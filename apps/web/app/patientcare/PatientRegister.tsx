"use client";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTrigger,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";

import {
  Select,
  SelectTrigger,
  SelectItem,
  SelectContent,
  SelectValue,
} from "@/components/ui/select";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";

import {
  ChevronsUpDown,
  Check,
  ChevronRight,
  ChevronsRight,
  Loader2Icon,
} from "lucide-react";

import {
  Camera,
  ImagePlus,
  Loader2,
  Plus,
  X,
  CheckCircle,
  UserPlus,
  XCircle,
} from "lucide-react";
import Lottie from "lottie-react";
import successAnimation from "@/assets/PatientRegistrationAnimation.json";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { useEvents } from "@/context/events-context";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { useSearchParams, useRouter } from "next/navigation";
import Webcam from "react-webcam";
import { Image as PrimeImage } from "primereact/image";

import { PatientSearchDrawer } from "app/appointment/patientSearchDrawer";
import { Checkbox } from "@mui/material";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { eventAddPatientRegistrationFormSchema } from "@/helper/Patientregistrationschema";
import {
  AddUpdatePatient,
  fetchLanguagesSpoken,
  fetchPastMedical,
  fetchPatientAllergies,
} from "@/lib/patientcare";
import { getSession } from "@/lib/session";
import { getProfile } from "@/lib/action";
import { BACKEND_URL } from "@/lib/constants";
import { fetchAllRegisterPatient } from "@/store/PatientSlice";
import { useAppDispatch } from "@/store/hooks";
import { EventAddForm } from "@/components/event-add-form";
import AllergiesLanguageSkeleton from "@/components/ui/skeletonloader/AllergiesLanguageSkeleton";
import { Toast } from "primereact/toast";
import { AppDispatch, RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import { fetchHospitals } from "@/store/hospitalSlice";

const inputbox =
  "w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-800  placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-200";

const formData = new FormData();

type RegisterPatient = z.infer<typeof eventAddPatientRegistrationFormSchema>;

export function RegisterPatient() {
  const { events, addEvent } = useEvents();
  const { eventAddOpen, setEventAddOpen } = useEvents();

  const { isRegisterPatientOpen, setRegisterPatientOpen } = useEvents(); // updated context

  const [registerAnimation, setRegisterAnimation] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [displayText, setDisplayText] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();
  const shouldOpen = searchParams.get("openRegister") === "true";
  const webcamRef = useRef<Webcam>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [uploading, setUploading] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [states, setStates] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>("");
  type Allergy = { id: string; name: string };
  const [allergies, setAllergies] = useState<Allergy[]>([]);
  type Language = { id: string; name: string };
  const [languages, setLanguages] = useState<Language[]>([]);
  type MedicalHistory = { id: string; name: string };
  const [MedicalHistory, setPastMedicalHistory] = useState<MedicalHistory[]>(
    []
  );
  const [userdata, setUserdata] = useState<any>(null);
  const { editingPatient, setEditingPatient } = useEvents();
  const [countdown, setCountdown] = useState(5);
  const [isLoadingAllergies, setIsLoadingAllergies] = useState(true);
  const [appointmentData, setAppointmrntData] = useState<any>(null);
  const toast = useRef<Toast>(null);

  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    reset,
    control,
    formState: { errors, isSubmitting },
    watch,
  } = useForm({
    resolver: zodResolver(eventAddPatientRegistrationFormSchema),
  });

  const watchedFields = watch([
    "Title",
    "firstName",
    "lastName",
    "mobilenumber",
    "Email",
    "DateofBirth",
    "postalCode",
    "bloodgroup",
    "Area",
  ]);

  const isPartialValid = Boolean(
    watchedFields[0]?.trim() && // Title
      watchedFields[1]?.trim() && // firstName
      watchedFields[2]?.trim() && // lastName
      watchedFields[3]?.length >= 10 && // mobilenumber
      watchedFields[4]?.includes("@") && // Email (basic)
      watchedFields[5]?.trim() && // DateofBirth
      watchedFields[6]?.trim() && // postalCode
      watchedFields[7]?.trim() && // bloodgroup
      watchedFields[8]?.trim()
  );
  //KIN and Emergency
  const relations = [
    "Father",
    "Mother",
    "Spouse",
    "Son",
    "Daughter",
    "Brother",
    "Sister",
    "Uncle",
    "Aunt",
    "Grandfather",
    "Grandmother",
    "Cousin",
    "Friend",
    "Other",
  ];

  const [emergency, setEmergency] = useState({
    name: "",
    contact: "",
    relation: "",
  });

  const [kin, setKin] = useState({
    name: "",
    contact: "",
    relation: "",
  });

  const [sameAsEmergency, setSameAsEmergency] = useState(false);
  const [sameAsKin, setSameAsKin] = useState(false);

  // Sync Kin with Emergency
  const handleSameAsEmergency = (checked: boolean) => {
    setSameAsEmergency(checked);
    if (checked) setKin(emergency);
  };

  // Sync Emergency with Kin
  const handleSameAsKin = (checked: boolean) => {
    setSameAsKin(checked);
    if (checked) setEmergency(kin);
  };

  const [searchTerm, setSearchTerm] = useState("");
  const filteredAllergies = allergies.filter((a) =>
    a.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  console.log("allergies", filteredAllergies);
  const [selectedAllergies, setSelectedAllergies] = useState<string[]>([]); // Only selected

  const toggleAllergy = (id: string) => {
    setSelectedAllergies((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  const [search, setSearch] = useState("");
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [selectedMedicalHistory, setSelectedMedicalHistory] = useState<
    string[]
  >([]);

  const toggleLanguage = (id: string) => {
    setSelectedLanguages((prev) =>
      prev.includes(id) ? prev.filter((l) => l !== id) : [...prev, id]
    );
  };

  const filteredLanguages = languages.filter((lang) =>
    lang.name.toLowerCase().includes(search.toLowerCase())
  );

  const toggleMedicalHistory = (id: string) => {
    setSelectedMedicalHistory((prev) =>
      prev.includes(id) ? prev.filter((l) => l !== id) : [...prev, id]
    );
  };

  const filteredMedicalHistory = MedicalHistory.filter((lang) =>
    lang.name.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const init = async () => {
      try {
        // Load states from local JSON
        const session = await getSession();
        const resp = await getProfile();
        setUserdata(resp);
        console.log(session);
        const res = await fetch("/data/indian_states.json");
        const data = await res.json();
        setStates(data.map((s: any) => s.name));

        // Fetch allergies, languages, and past history
        const [allergyData, languageData, MedicalhistoryData] =
          await Promise.all([
            fetchPatientAllergies(),
            fetchLanguagesSpoken(),
            fetchPastMedical(),
          ]);

        console.log("Allergies API Response:", allergyData);
        console.log("Languages API Response:", languageData);
        console.log("Medical History API Response:", MedicalhistoryData);

        setIsLoadingAllergies(true);

        setAllergies(
          allergyData?.return?.map((a: any) => ({
            id: a.AllergyId.toString(), // assuming this comes from backend
            name: a.AllergyName,
          })) || []
        );

        setIsLoadingAllergies(false);

        setLanguages(
          languageData?.return?.map((l: any) => ({
            id: l.LanguageId.toString(),
            name: l.LanguageName,
          })) || []
        );
        setPastMedicalHistory(
          MedicalhistoryData?.return?.map((h: any) => ({
            id: h.MedicalHistoryId.toString(),
            name: h.MedicalHistoryName,
          })) || []
        );
      } catch (error) {
        console.error("❌ Error fetching initial patient data:", error);
      }

      // Auto-open modal from URL
      if (shouldOpen) {
        setRegisterPatientOpen(true);
        router.replace("/patientcare", { scroll: false });
      }
    };

    init();
  }, [shouldOpen]);

  useEffect(() => {
    if (editingPatient) {
      const {
        PatientId,
        firstName,
        lastName,
        dateOfBirth,
        gender,
        mobile,
        altContactNumber,
        email,
        addressLine1,
        addressLine2,
        area,
        city,
        state,
        country,
        postalCode,
        landmark,
        taluka,
        bloodGroup,
        emergencyName,
        emergencyContact,
        emergencyRelation,
        kinName,
        kinContact,
        kinRelation,
        allergies,
        languages,
        medicalHistory,
        profileImageUrl,
      } = editingPatient;

      // Set basic form fields
      reset({
        PatientId: PatientId,
        Title: editingPatient?.Prefix ?? "",
        firstName,
        lastName,
        DateofBirth: dateOfBirth?.slice(0, 10),
        gender,
        mobilenumber: mobile,
        alternativemobilenumber: altContactNumber,
        Email: email,
        doorNumber: addressLine1,
        street: addressLine2,
        Area: area,
        city,
        state,
        country,
        postalCode: postalCode?.toString(),
        Landmark: landmark,
        Taluka: taluka,
        bloodgroup: bloodGroup,
      });

      setEmergency({
        name: emergencyName,
        contact: emergencyContact,
        relation: emergencyRelation,
      });

      setKin({
        name: kinName,
        contact: kinContact,
        relation: kinRelation,
      });

      setSelectedAllergies(
        (allergies ?? []).map((a) => a.AllergyId.toString())
      );
      setSelectedLanguages(
        (languages ?? []).map((l) => l.LanguageId.toString())
      );
      setSelectedMedicalHistory(
        (medicalHistory ?? []).map((MH) => MH.MedicalHistoryId.toString())
      );

      // Set image if exists
      if (profileImageUrl) {
        setImageUrl(`${BACKEND_URL}${profileImageUrl}`);
      }
    }
  }, [editingPatient, reset]);

  useEffect(() => {
    if (!isRegisterPatientOpen) {
      // Always reset form when closing
      reset({
        Title: "",
        firstName: "",
        lastName: "",
        mobilenumber: "",
        alternativemobilenumber: "",
        Email: "",
        DateofBirth: "",
        doorNumber: "",
        street: "",
        Area: "",
        city: "",
        state: "",
        country: "",
        postalCode: "",
        Landmark: "",
        Taluka: "",
        gender: "",
        bloodgroup: "",
      });
      setEmergency({ name: "", contact: "", relation: "" });
      setKin({ name: "", contact: "", relation: "" });
      setSelectedAllergies([]);
      setSelectedLanguages([]);
      setSelectedMedicalHistory([]);
      setSameAsEmergency(false);
      setSameAsKin(false);
      setCity("");
      setState("");
      setImageUrl(null);
      setImageFile(null);

      // Clear editing patient so next open is fresh
      if (editingPatient) {
        setEditingPatient(null);
      }
    }
  }, [isRegisterPatientOpen]);

  const buildFormPayload = async (
    data: any,
    imageUrl: string | null,
    imageFile: File | null
  ) => {
    let file = null;

    if (imageFile) {
      file = imageFile;
    } else if (imageUrl?.startsWith("data:image")) {
      const blob = await fetch(imageUrl).then((res) => res.blob());
      file = new File([blob], "webcam.jpg", { type: "image/jpeg" });
    }

    return {
      // Required System Fields
      PatientId: editingPatient?.PatientId || "",
      hospitalCode: selectedHospital?.hospital?.HospitalCode || "H01",
      HospitalId: selectedHospital?.hospitalId,
      organizationId: userdata?.user?.OrganizationId,

      // Basic Details
      Prefix: data.Title,
      firstName: data.firstName,
      lastName: data.lastName,
      dateOfBirth: new Date(data.DateofBirth).toISOString(),
      gender: data.gender,

      // Contact Info
      mobile: data.mobilenumber,
      altContactNumber: data.alternativemobilenumber,
      email: data.Email,
      addressLine1: data.doorNumber,
      addressLine2: data.street,
      area: data.Area,
      city: data.city,
      state: data.state,
      country: data.country,
      postalCode: parseInt(data.postalCode, 10),
      landmark: data.Landmark,
      taluka: data.Taluka,

      // Emergency
      emergencyName: emergency.name,
      emergencyContact: emergency.contact,
      emergencyRelation: emergency.relation,

      // Kin
      kinName: kin.name,
      kinContact: kin.contact,
      kinRelation: kin.relation,

      // Meta
      profileImageUrl: "", // only File should be used
      bloodGroup: data.bloodgroup,

      // Tags
      allergies: selectedAllergies,
      languages: selectedLanguages,
      MedicalHistory: selectedMedicalHistory,
      UpdatedBy: "",
      // Optional Draft/Tracking
      isDraft: false, // or true if you’re supporting autosave
      CreatedBy: String(userdata?.user?.UserId),
    };
  };

  const onSubmit = async (data: RegisterPatient) => {
    console.log("watchedFields", watchedFields);

    try {
      const payload = await buildFormPayload(data, imageUrl, imageFile); // 👈 pass it

      const formData = new FormData();
      for (const [key, value] of Object.entries(payload)) {
        if (key === "profileImageUrl") continue; // Don't append this key

        if (["languages", "allergies", "MedicalHistory"].includes(key)) {
          formData.append(key, JSON.stringify(value || []));
        } else {
          formData.append(key, value ?? "");
        }
      }
      if (imageFile) {
        formData.append("file", imageFile);
      } else if (imageUrl?.startsWith("data:image")) {
        const blob = await fetch(imageUrl).then((res) => res.blob());
        const webcamFile = new File([blob], "webcam.jpg", {
          type: "image/jpeg",
        });
        formData.append("file", webcamFile);
      }

      const result = await AddUpdatePatient(formData);
      if (!result) throw new Error("No response from server");

      if (result.return.success === false) {
        const errorMessage = result.return.message || "❌ Something went wrong";
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: errorMessage,
          life: 4000,
          className: "custom-toast-container", // 👈 this attaches the blur effect
        });
        return;
      }

      console.log("✅ Patient registered:", result);
      setAppointmrntData(result?.return);

      setTimeout(() => {
        setRegisterAnimation(true);
        setCountdown(5); // Start from 10

        const timer = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(timer);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);

        setTimeout(() => {
          setRegisterPatientOpen(false);
          setRegisterAnimation(false);
          dispatch(fetchAllRegisterPatient({organizationId: selectedHospital?.organizationId,hospitalId: selectedHospital?.hospitalId, page: 1, limit: 10 }));
          reset();
          setImageUrl(null);
        }, 5000);
      }, 800);

      // setTimeout(() => {
      //   // ✅ clear image after submission
      // }, 2000);
    } catch (err) {
      console.error("❌ Error submitting form:", err);
    }
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setImageUrl(URL.createObjectURL(file)); // or store actual File in state
      setImageFile(file); // recommended
    }
  };

  const captureImage = () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setImageUrl(imageSrc); // must be base64
      setShowCamera(false);
    }
  };

  const handlePincodeFetch = async () => {
    const pincode = getValues("postalCode");
    if (!pincode || pincode.length !== 6) return;

    try {
      const res = await fetch(
        `https://api.postalpincode.in/pincode/${pincode}`
      );
      const data = await res.json();
      if (data[0].Status === "Success") {
        const postOffice = data[0].PostOffice[0];
        setCity(postOffice.District);
        setState(postOffice.State);
        setValue("city", postOffice.District);
        setValue("state", postOffice.State);
      }
    } catch (error) {
      console.error("Failed to fetch pincode info", error);
    }
  };
  const selectedHospital = useSelector(
    (state: any) => state.hospitalSelection?.selectedHospital
  );

  // const hospitals = useSelector((state: RootState) => state.hospital.data);

  // useEffect(() => {
  //   if (!hospitals || hospitals.length === 0) {
  //     dispatch(fetchHospitals());
  //   }
  // }, [dispatch]);
  console.log("Hospital data in Register patient sceren ", selectedHospital);

  // const { setSelectedPatient } = useEvents();

    const hospitals = useSelector((state: RootState) => state.hospital.data);

    console.log()
  
    useEffect(() => {
      if (!hospitals || hospitals.length === 0) {
        dispatch(fetchHospitals());
      }
    }, [dispatch]);

  return (
    <>
      <Toast ref={toast} />

      <AlertDialog
        open={isRegisterPatientOpen}
        onOpenChange={setRegisterPatientOpen}
      >
        <div className="w-full flex justify-end pr-4">
          <Button
            className="glow-reister-button bg-white text-black text-[1rem] md:text-sm cursor-pointer border border-black flex items-center gap-2"
            onClick={() => setRegisterPatientOpen(true)}
          >
            <UserPlus className="w-5 h-5" />
            Register Patient
          </Button>
        </div>
        {/* ✅ Success Animation */}
        <div className="relative">
          {" "}
          {/* ✅ Ensure parent is relative */}
          {registerAnimation && (
            <div
              className="fixed inset-0 z-[9999] bg-white/90 flex items-center justify-center overflow-auto"
              style={{ pointerEvents: "auto" }}
            >
              <div className="flex flex-col items-center justify-center text-center p-6 max-w-md w-full mx-auto">
                <div className="animate-floatUp mb-2">
                  <Lottie
                    animationData={successAnimation}
                    className="w-100 h-100 md:w-100 md:h-100"
                    loop={false}
                  />
                </div>

                <p className="text-2xl font-semibold text-green-600 mb-2 items-center justify-center text-center ">
                  Patient Registered Successfully!
                </p>

                <p className="text-lg text-gray-500 mb-4">
                  Closing in {countdown} second{countdown !== 1 && "s"}...
                </p>

                <button
                  onClick={() => {
                    console.log("🟢 Book Appointment clicked");
                    setSelectedPatient(appointmentData);
                    setEventAddOpen(true);
                    setRegisterPatientOpen(false);
                    setRegisterAnimation(false);
                  }}
                  className="px-6 py-2 bg-green-400 text-white font-medium rounded-full hover:bg-green-500 transition-all duration-200 cursor-pointer shadow-2xl"
                >
                  Book Appointment
                </button>
              </div>
            </div>
          )}
          {/* your form or modal content */}
          <AlertDialogContent className="max-h-[95vh] overflow-y-auto p-1 max-w-6xl rounded-2xl shadow-2xl bg-white no-scrollbar">
            {/* Header with search and close */}
            {/* Header with dark background */}
            <div className="font-nunito bg-[#ffffff] text-white px-4 h-10 flex justify-between items-center sticky top-0 z-10 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-700 -mb-0.5 font-sans">
                Register Patient
              </h2>
              <AlertDialogCancel
                className="p-1 text-red-400 hover:text-red-500 cursor-pointer rounded-tr-xs shadow-2xl h-7 w-8"
                onClick={() => setRegisterPatientOpen(false)}
              >
                <X className="w-4 h-4 cursor-pointer" />
              </AlertDialogCancel>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-2 px-6 py-2"
            >
              <div className="space-y-2  p-0 w-210">
                <div className="space-y-1 bg-gradient-to-br from-[#FFFDF9] to-[#FDFAF6] border-2 border-[#fcdcdc] shadow-md rounded-2xl p-2 transition-all duration-200">
                  <h3 className=" font-sans text-md font-semibold text-[#515151] border-b pb-2 mb-4">
                    Basic Details
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="flex flex-col items-center gap-2 row-span-2">
                      <label className="text-sm font-medium text-gray-700">
                        Patient Image
                      </label>

                      <div className="relative h-24 w-24 rounded-full overflow-hidden group shadow-md ring-2 ring-blue-300">
                        {uploading ? (
                          <div className="flex items-center justify-center h-full w-full bg-gray-100">
                            <Loader2 className="animate-spin text-blue-500 w-6 h-6" />
                          </div>
                        ) : imageUrl ? (
                          <>
                            <PrimeImage
                              src={imageUrl}
                              alt="Patient avatar"
                              preview
                              downloadable
                              className="h-full w-full object-cover rounded-full"
                              imageClassName="h-full w-full object-cover rounded-full"
                            />

                            {/* Eye Icon only — pointer-events-none allows click to pass through */}
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none group-hover:bg-black/30 group-hover:opacity-100 transition rounded-full">
                              <i className="pi pi-eye text-white text-lg" />
                            </div>

                            {/* Upload Icon (only clickable part) */}
                            <div
                              onClick={(e) => {
                                e.stopPropagation(); // don’t open preview
                                fileInputRef.current?.click();
                              }}
                              className="absolute top-0 right-0 m-1 bg-white rounded-full p-1 shadow hover:scale-105 transition cursor-pointer z-10"
                              title="Upload Image"
                            >
                              <Camera className="w-4 h-4 text-gray-600" />
                            </div>
                          </>
                        ) : (
                          <div
                            onClick={() => fileInputRef.current?.click()}
                            className="flex items-center justify-center h-full w-full bg-gray-100 cursor-pointer"
                          >
                            <ImagePlus className="w-8 h-8 text-gray-400" />
                          </div>
                        )}

                        <input
                          type="file"
                          ref={fileInputRef}
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </div>

                      <div className="flex gap-2 mt-1">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="text-xs bg-blue-100 px-2 py-1 rounded-full text-blue-600 hover:bg-blue-200 cursor-pointer"
                        >
                          Upload
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowCamera(true)}
                          className="text-xs bg-green-100 px-2 py-1 rounded-full text-green-600 hover:bg-green-200 cursor-pointer"
                        >
                          Capture
                        </button>
                      </div>

                      <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </div>

                    {/* Webcam Modal */}
                    {showCamera && (
                      <div
                        className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center"
                        onClick={(e) => e.stopPropagation()} // Prevent parent modal from closing
                      >
                        <div
                          className="relative bg-white rounded-xl shadow-lg p-4 w-[90vw] max-w-md flex flex-col items-center"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Webcam
                            audio={false}
                            ref={webcamRef}
                            screenshotFormat="image/jpeg"
                            className="rounded-xl mb-4"
                            width={320}
                            height={240}
                            videoConstraints={{ facingMode: "user" }}
                          />
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                captureImage();
                              }}
                              className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700"
                            >
                              Capture
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowCamera(false);
                              }}
                              className="px-4 py-2 bg-gray-300 text-gray-800 rounded-full hover:bg-gray-400"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Image Preview Modal */}
                    {showPreview && imageUrl && (
                      <div
                        className="fixed inset-0 z-[100] bg-black/70 flex items-center justify-center"
                        onClick={() => setShowPreview(false)}
                      >
                        <div
                          className="relative w-[90vw] max-w-sm bg-white rounded-xl shadow-xl overflow-hidden"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Image
                            src={imageUrl}
                            alt="Patient avatar"
                            width={400}
                            height={400}
                            className="w-full h-full object-contain"
                          />
                          <button
                            onClick={() => setShowPreview(false)}
                            className="absolute top-2 right-2 text-white bg-black/70 hover:bg-black/90 rounded-full p-1"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    )}

                    <div>
                      <Label className="mb-1.5 block">
                        Title <span className="text-red-500">*</span>
                      </Label>

                      <Controller
                        control={control}
                        name="Title"
                        render={({ field }) => (
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger className={`${inputbox} h-9`}>
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent className="border-gray-300 shadow-2xl rounded-2xl focus:outline-none data-[state=checked]:bg-white data-[highlighted]:bg-white">
                              {" "}
                              <SelectItem value="Mr">Mr</SelectItem>
                              <SelectItem value="Mrs">Mrs</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>
                    <div>
                      <Label className="mb-1.5 block">
                        First Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        {...register("firstName")}
                        className={inputbox}
                        placeholder="John"
                      />
                      {errors.firstName && (
                        <p className="text-red-500 text-sm">
                          {errors.firstName.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label className="mb-1.5 block">
                        Last Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        {...register("lastName")}
                        className={inputbox}
                        placeholder="Deo"
                      />
                      {errors.lastName && (
                        <p className="text-red-500 text-sm">
                          {errors.lastName.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label className="mb-1.5 block">
                        Date of Birth <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        {...register("DateofBirth")}
                        className={inputbox}
                        type="date"
                      />
                      {errors.lastName && (
                        <p className="text-red-500 text-sm">
                          {errors.lastName.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label className="mb-1.5 block">
                        Gender <span className="text-red-500">*</span>
                      </Label>

                      <Controller
                        control={control}
                        name="gender"
                        render={({ field }) => (
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger className={`${inputbox} h-9`}>
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent className="border-gray-300 shadow-2xl rounded-2xl focus:outline-none data-[state=checked]:bg-white data-[highlighted]:bg-white">
                              {" "}
                              <SelectItem value="MALE">Male</SelectItem>
                              <SelectItem value="FEMALE">Female</SelectItem>
                              <SelectItem value="OTHER">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors.lastName && (
                        <p className="text-red-500 text-sm">
                          {errors.lastName.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label className="mb-1.5 block">
                        Mobile Number <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        {...register("mobilenumber")}
                        className={inputbox}
                        placeholder="9988776655"
                        maxLength={10}
                      />
                      {errors.mobilenumber && (
                        <p className="text-red-500 text-sm">
                          {errors.mobilenumber.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label className="mb-1.5 block">
                        Alternative Contact Number
                      </Label>
                      <Input
                        {...register("alternativemobilenumber")}
                        className={inputbox}
                        placeholder="9988776655"
                        maxLength={10}
                      />
                    </div>

                    <div>
                      <Label className="mb-1.5 block">
                        Email <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        {...register("Email")}
                        className={inputbox}
                        placeholder="john.doe@email.com"
                        type="email"
                      />
                      {errors.Email && (
                        <p className="text-red-500 text-sm">
                          {errors.Email.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label className="mb-1.5 block">
                        Blood Group <span className="text-red-500">*</span>
                      </Label>

                      <Controller
                        control={control}
                        name="bloodgroup"
                        render={({ field }) => (
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger className={`${inputbox} h-9`}>
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>

                            <SelectContent className="border-gray-300 shadow-2xl rounded-2xl focus:outline-none data-[state=checked]:bg-white data-[highlighted]:bg-white">
                              <SelectItem value="O_POS">O+</SelectItem>
                              <SelectItem value="O_NEG">O-</SelectItem>
                              <SelectItem value="A_POS">A+</SelectItem>
                              <SelectItem value="A_NEG">A-</SelectItem>
                              <SelectItem value="B_POS">B+</SelectItem>
                              <SelectItem value="B_NEG">B-</SelectItem>
                              <SelectItem value="AB_POS">AB+</SelectItem>
                              <SelectItem value="AB_NEG">AB-</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors.bloodgroup && (
                        <p className="text-red-500 text-sm">
                          {errors.bloodgroup.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label className="mb-1.5 block">ReferalSource</Label>
                      <Input
                        className={inputbox}
                        placeholder="Referral Source"
                        {...register("ReferralSource")}
                      />
                    </div>
                  </div>
                </div>
                {/* Contact Details Section */}
                <div className="space-y-1 bg-gradient-to-br from-[#FFFDF9] to-[#FDFAF6] border-2 border-[#fcdcdc] shadow-md rounded-2xl p-2 transition-all duration-200">
                  <h3 className=" font-sans text-md font-semibold text-[#515151] border-b pb-2 mb-4">
                    Contact Details
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label className="mb-1.5 block">Door No./Building</Label>
                      <Input
                        {...register("doorNumber")}
                        className={inputbox}
                        placeholder="e.g. 12A, Galaxy Towers"
                      />
                    </div>
                    <div>
                      <Label className="mb-1.5 block">Street</Label>
                      <Input
                        {...register("street")}
                        className={inputbox}
                        placeholder="e.g. Main Street"
                      />
                    </div>
                    <div>
                      <Label className="mb-1.5 block">
                        Area/Town/Village{" "}
                        <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        {...register("Area")}
                        className={inputbox}
                        placeholder="e.g. Banjara Hills"
                      />
                      {errors.Area && (
                        <p className="text-red-500 text-sm">
                          {errors.Area.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label className="mb-1.5 block">City/District</Label>
                      <Input
                        {...register("city")}
                        className={inputbox}
                        placeholder="e.g. Hyderabad"
                        {...register("city")}
                      />
                    </div>
                    <div>
                      <Label className="mb-1.5 block">State</Label>

                      <Controller
                        name="state"
                        control={control}
                        render={({ field }) => (
                          <Popover open={open} onOpenChange={setOpen}>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={open}
                                className={cn(
                                  "w-full justify-between",
                                  inputbox
                                )}
                              >
                                {field.value || "Select state..."}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </PopoverTrigger>

                            <PopoverContent
                              className="z-50 w-full p-0 border-gray-300 shadow-2xl rounded-2xl"
                              side="bottom"
                              align="start"
                              sideOffset={4}
                            >
                              <Command>
                                <CommandInput
                                  placeholder="Search state..."
                                  className="h-9"
                                />
                                <CommandList className="max-h-60 overflow-y-auto scroll-smooth">
                                  <CommandEmpty>No state found.</CommandEmpty>
                                  <CommandGroup>
                                    {states.map((state) => (
                                      <CommandItem
                                        key={state}
                                        value={state}
                                        onSelect={() => {
                                          field.onChange(state);
                                          setOpen(false);
                                        }}
                                      >
                                        {state}
                                        <Check
                                          className={cn(
                                            "ml-auto h-4 w-4",
                                            field.value === state
                                              ? "opacity-100"
                                              : "opacity-0"
                                          )}
                                        />
                                      </CommandItem>
                                    ))}
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>
                        )}
                      />
                    </div>
                    <div>
                      <Label className="mb-1.5 block">Country</Label>
                      <Input
                        className={inputbox}
                        placeholder="e.g. India"
                        defaultValue="India"
                        {...register("country")}
                      />
                    </div>

                    <div>
                      <Label className="mb-1.5 block">
                        Pincode <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        {...register("postalCode")}
                        className={inputbox}
                        placeholder="e.g. 823001"
                        maxLength={6}
                        onBlur={handlePincodeFetch} // fetch city/state on blur
                      />
                    </div>
                    <div>
                      <Label className="mb-1.5 block">Landmark</Label>
                      <Input
                        {...register("Landmark")}
                        className={inputbox}
                        placeholder="e.g. Near Bus Stand"
                      />
                    </div>
                    <div>
                      <Label className="mb-1.5 block">Taluka</Label>
                      <Input
                        {...register("Taluka")}
                        className={inputbox}
                        placeholder="e.g. Suryapet"
                      />
                    </div>
                  </div>
                </div>

                {/* Emergency Contact Section */}
                <div className="space-y-1 bg-gradient-to-br from-[#FFFDF9] to-[#FDFAF6] border-2 border-[#fcdcdc] shadow-md rounded-2xl p-2 transition-all duration-200">
                  <div className="flex items-center justify-between border-b pb-2 mb-4">
                    <h3 className="font-sans text-md font-semibold text-[#515151]">
                      Emergency Contact Details
                    </h3>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        checked={sameAsKin}
                        onChange={(_, checked) => handleSameAsKin(checked)}
                        id="sameAsKin"
                      />
                      <label
                        htmlFor="sameAsKin"
                        className="text-sm text-gray-600"
                      >
                        Same as Kin
                      </label>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label className="mb-1.5 block">Name</Label>
                      <Input
                        {...register("EmergencyContactName")}
                        value={emergency.name}
                        className={inputbox}
                        onChange={(e) =>
                          setEmergency({ ...emergency, name: e.target.value })
                        }
                        placeholder="e.g. Mathew"
                      />
                    </div>
                    <div>
                      <Label className="mb-1.5 block">Contact Number</Label>
                      <Input
                        {...register("EmergencyContactNumber")}
                        value={emergency.contact}
                        className={inputbox}
                        onChange={(e) =>
                          setEmergency({
                            ...emergency,
                            contact: e.target.value,
                          })
                        }
                        placeholder="e.g. 9988112233"
                      />
                    </div>
                    <div>
                      <Label className="mb-1.5 block">Relation</Label>
                      <Select
                        value={emergency.relation}
                        onValueChange={(value) =>
                          setEmergency({ ...emergency, relation: value })
                        }
                      >
                        <SelectTrigger className="h-9">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent className="border-gray-300 shadow-2xl rounded-2xl focus:outline-none data-[state=checked]:bg-white data-[highlighted]:bg-white">
                          {relations.map((r) => (
                            <SelectItem key={r} value={r}>
                              {r}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Kin Section */}
                <div className="space-y-1 bg-gradient-to-br from-[#FFFDF9] to-[#FDFAF6] border-2 border-[#fcdcdc] shadow-md rounded-2xl p-2 transition-all duration-200">
                  <div className="flex items-center justify-between border-b pb-2 mb-4">
                    <h3 className="font-sans text-md font-semibold text-[#515151]">
                      Select your Family Member
                    </h3>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        checked={sameAsEmergency}
                        onChange={(_, checked) =>
                          handleSameAsEmergency(checked)
                        }
                        id="sameAsEmergency"
                      />
                      <label
                        htmlFor="sameAsEmergency"
                        className="text-sm text-gray-600"
                      >
                        Same as Emergency
                      </label>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label className="mb-1.5 block">KIN Name</Label>
                      <Input
                        {...register("KinName")}
                        value={kin.name}
                        className={inputbox}
                        onChange={(e) =>
                          setKin({ ...kin, name: e.target.value })
                        }
                        placeholder="e.g. Mathew"
                      />
                    </div>
                    <div>
                      <Label className="mb-1.5 block">KIN Contact Number</Label>
                      <Input
                        {...register("KinContactName")}
                        value={kin.contact}
                        className={inputbox}
                        onChange={(e) =>
                          setKin({ ...kin, contact: e.target.value })
                        }
                        placeholder="e.g. 9988112233"
                      />
                    </div>
                    <div>
                      <Label className="mb-1.5 block">Relation</Label>
                      <Select
                        value={kin.relation}
                        onValueChange={(value) =>
                          setKin({ ...kin, relation: value })
                        }
                      >
                        <SelectTrigger className="h-9">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent className="border-gray-300 shadow-2xl rounded-2xl focus:outline-none data-[state=checked]:bg-white data-[highlighted]:bg-white">
                          {relations.map((r) => (
                            <SelectItem key={r} value={r}>
                              {r}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="py-2">
                  <div className="px-6 pb-1">
                    <div className="flex gap-4">
                      {/* Cancel Button */}
                      <Button
                        type="button"
                        variant="outline"
                        className="font-sans flex-1 border-gray-300 text-gray-700 hover:bg-gray-100 rounded-full py-5 text-lg transition flex items-center justify-center gap-2 cursor-pointer"
                        onClick={() => setRegisterPatientOpen(false)}
                      >
                        <XCircle className="w-5 h-5" />
                        Cancel
                      </Button>

                      {/* Register Patient Button */}

                      <motion.button
                        type="submit"
                        whileHover={isPartialValid ? { scale: 1.05 } : {}}
                        disabled={!isPartialValid}
                        className={`font-sans flex-1 rounded-full py-1.5 px-5 text-lg font-semibold flex items-center justify-center gap-2 transition cursor-pointer ${
                          isPartialValid
                            ? "bg-green-300 text-black hover:bg-green-400"
                            : "bg-green-200 text-gray-500 cursor-not-allowed"
                        }`}
                      >
                        <UserPlus className="w-5 h-5" />
                        {isSubmitting ? (
                          <Loader2Icon className="animate-spin" />
                        ) : (
                          "Register Patient"
                        )}

                        {isPartialValid && (
                          <motion.span
                            className="ml-2 flex items-center gap-1"
                            initial={{ x: 0 }}
                            animate={{ x: [0, 8, 0] }}
                            transition={{
                              duration: 0.6, // animation time
                              repeat: Infinity,
                              repeatType: "loop",
                              repeatDelay: 0.5, // ⏳ delay after each loop
                            }}
                          >
                            <ChevronsRight className="w-4 h-4" />
                            <ChevronsRight className="w-4 h-4" />
                            <ChevronsRight className="w-4 h-4" />
                          </motion.span>
                        )}
                      </motion.button>
                    </div>
                  </div>
                </div>

                <div className="pt-2"></div>
              </div>

              <div className="space-y-2  bg-gradient-to-br from-[#c0f9f6] to-[#dbf7f6] border-2 border-[#22E0D4]  rounded-xl shadow-sm p-0 h-93">
                {/* <h3 className="text-sm font-medium text-gray-600 mb-2 text-center">
              Patient Record
            </h3> */}
                <div className="space-y-2 bg-[#c0f9f6] rounded-xl shadow-xl p-3 w-full md:max-w-[320px]">
                  <Accordion
                    type="single"
                    collapsible
                    value={openSection}
                    onValueChange={(val) => setOpenSection(val)}
                    className="space-y-2 border-gray-300 bg-white  rounded-2xl focus:outline-none data-[state=checked]:bg-white data-[highlighted]:bg-white"
                  >
                    {/* Allergies Section */}
                    <AccordionItem value="allergies">
                      <AccordionTrigger className="w-full flex items-center justify-between px-4 py-3 text-md font-semibold font-sans ">
                        <span className="flex-1 text-center">Allergies</span>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pb-4">
                        {isLoadingAllergies ? (
                          <AllergiesLanguageSkeleton />
                        ) : (
                          <>
                            <Input
                              placeholder="Type allergies"
                              className="mb-3"
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <div className="flex flex-wrap gap-2 max-h-72 overflow-y-auto pr-1 no-scrollbar">
                              {filteredAllergies.map((allergy) => (
                                <Button
                                  key={allergy.id}
                                  type="button"
                                  variant={
                                    selectedAllergies.includes(allergy.id)
                                      ? "default"
                                      : "outline"
                                  }
                                  className={cn(
                                    "text-sm px-4 py-1.5 border-gray-300 shadow-md rounded-2xl",
                                    selectedAllergies.includes(allergy.id)
                                      ? "bg-blue-500 text-white"
                                      : "text-gray-700"
                                  )}
                                  onClick={() => toggleAllergy(allergy.id)}
                                >
                                  {allergy.name}
                                </Button>
                              ))}
                            </div>
                          </>
                        )}
                      </AccordionContent>
                    </AccordionItem>

                    {/* Language Spoken Section */}
                    <AccordionItem value="languages">
                      <AccordionTrigger className="w-full flex items-center justify-between px-4 py-3 text-md font-semibold font-sans">
                        <span className="flex-1 text-center">
                          Language Spoken
                        </span>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pb-4">
                        {isLoadingAllergies ? (
                          <AllergiesLanguageSkeleton />
                        ) : (
                          <>
                            <Input
                              placeholder="Search language"
                              value={search}
                              onChange={(e) => setSearch(e.target.value)}
                              className="mb-3"
                            />
                            <div className="flex flex-wrap gap-2 max-h-72 overflow-y-auto pr-1 no-scrollbar">
                              {filteredLanguages.map((lang) => (
                                <Button
                                  key={lang.id}
                                  type="button" // 🛑 Prevents form submission
                                  variant={
                                    selectedLanguages.includes(lang.id)
                                      ? "default"
                                      : "outline"
                                  }
                                  className={cn(
                                    "text-sm px-4 py-1.5 border-gray-300 shadow-md rounded-2xl",
                                    selectedLanguages.includes(lang.id)
                                      ? "bg-blue-500 text-white"
                                      : "text-gray-700"
                                  )}
                                  onClick={() => toggleLanguage(lang.id)}
                                >
                                  {lang.name}
                                </Button>
                              ))}
                            </div>
                          </>
                        )}
                      </AccordionContent>
                    </AccordionItem>
                    {/* Medical History */}
                    <AccordionItem value="MedicalHistory">
                      <AccordionTrigger className="w-full flex items-center justify-between px-4 py-3 text-md font-semibold font-sans">
                        <span className="flex-1 text-center">
                          Medical History
                        </span>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pb-4">
                        {isLoadingAllergies ? (
                          <AllergiesLanguageSkeleton />
                        ) : (
                          <>
                            <Input
                              placeholder="Search language"
                              value={search}
                              onChange={(e) => setSearch(e.target.value)}
                              className="mb-3"
                            />
                            <div className="flex flex-wrap gap-2 max-h-72 overflow-y-auto pr-1 no-scrollbar">
                              {filteredMedicalHistory.map((mediHis) => (
                                <Button
                                  key={mediHis.id}
                                  type="button" // 🛑 Prevents form submission
                                  variant={
                                    selectedMedicalHistory.includes(mediHis.id)
                                      ? "default"
                                      : "outline"
                                  }
                                  className={cn(
                                    "text-sm px-4 py-1.5 border-gray-300 shadow-md rounded-2xl",
                                    selectedMedicalHistory.includes(mediHis.id)
                                      ? "bg-blue-500 text-white"
                                      : "text-gray-700"
                                  )}
                                  onClick={() =>
                                    toggleMedicalHistory(mediHis.id)
                                  }
                                >
                                  {mediHis.name}
                                </Button>
                              ))}
                            </div>
                          </>
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </div>
            </form>

            <PatientSearchDrawer
              query={searchQuery}
              onSelect={(patient) => {
                setSelectedPatient(patient);
                setSearchQuery(""); // reset input
                console.log("✅ Selected Patient", patient);
              }}
              onQuickAppointment={() => {
                console.log("⚡ Quick appointment triggered");
              }}
              onRegisterNew={() => {
                console.log("opening");
                setRegisterPatientOpen(true);
              }}
            />
            <div className="hidden">
              <EventAddForm
                key={appointmentData?.PatientId ?? "new"}
                selectedPatient={selectedPatient}
                start={undefined}
                end={undefined}
              />
            </div>
          </AlertDialogContent>
        </div>
      </AlertDialog>
    </>
  );
}
