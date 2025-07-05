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

import { ChevronsUpDown, Check, ChevronRight } from "lucide-react";

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
import successAnimation from "@/assets/success-animation.json";
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

const inputbox =
  "w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-800  placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-200";

const eventAddFormSchema = z.object({
  title: z
    .string({ required_error: "Please enter a title." })
    .min(1, { message: "Must provide a title for this event." }),
  description: z
    .string({ required_error: "Please enter a description." })
    .min(1, { message: "Must provide a description for this event." }),
  start: z.date({
    required_error: "Please select a start time",
    invalid_type_error: "That's not a date!",
  }),
  end: z.date({
    required_error: "Please select an end time",
    invalid_type_error: "That's not a date!",
  }),
  color: z
    .string({ required_error: "Please select an event color." })
    .min(1, { message: "Must provide a title for this event." }),
  city: z.string().optional(),
  state: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().optional(),
});

type RegisterPatient = z.infer<typeof eventAddFormSchema>;

export function RegisterPatient() {
  const { events, addEvent } = useEvents();
  const { eventAddOpen, setEventAddOpen } = useEvents();
  const { isRegisterPatientOpen, setRegisterPatientOpen } = useEvents(); // updated context

  const [booked, setBooked] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [displayText, setDisplayText] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();
  const shouldOpen = searchParams.get("openRegister") === "true";
  const webcamRef = useRef<Webcam>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [states, setStates] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>("");

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    reset,
    control,
    formState: { errors, isSubmitting, isValid },
  } = useForm({
    resolver: zodResolver(eventAddFormSchema),
  });

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

  //Allergies

  const allergyList = [
    "Allergic Asthma",
    "Allergic Bronchitis",
    "Allergic Cold",
    "Allergic To Penicillin",
    "Allergic To Ibuprofen",
    "Allergic To Dust",
    "Allergic To Sunlight",
    "Allergic To Antibiotics",
    "Allergic To Pollen",
    "Allergic To Seafood",
  ];
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAllergies, setSelectedAllergies] = useState<string[]>([]);

  const filtered = allergyList.filter((a) =>
    a.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleAllergy = (item: string) => {
    setSelectedAllergies((prev) =>
      prev.includes(item) ? prev.filter((a) => a !== item) : [...prev, item]
    );
  };

  // language spoken
  const languageOptions = [
    "English",
    "Hindi",
    "Telugu",
    "Tamil",
    "Malayalam",
    "Kannada",
    "Urdu",
    "Marathi",
  ];
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const toggle = (lang: string) =>
    setSelected((prev) =>
      prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]
    );

  const Languagefiltered = languageOptions.filter((l) =>
    l.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    fetch("/data/indian_states.json")
      .then((res) => res.json())
      .then((data) => setStates(data.map((s: any) => s.name)));

    if (shouldOpen) {
      setRegisterPatientOpen(true);

      // Clean the URL after opening the modal (without full page reload)
      router.replace("/patientcare", { scroll: false });
    }
  }, [shouldOpen]);
  const onSubmit = (data: RegisterPatient) => {
    setTimeout(() => {
      setBooked(true);
      setTimeout(() => {
        setBooked(false);
        setRegisterPatientOpen(false);
      }, 2000);
    }, 800);
  };
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImageUrl(reader.result as string);
      // setValue("imageUrl", file);
      reader.readAsDataURL(file);
    }
  };

  const captureImage = () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setImageUrl(imageSrc);
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
  return (
    <AlertDialog open={isRegisterPatientOpen} onOpenChange={setRegisterPatientOpen}>
      <div className="w-full flex justify-end pr-4">
        <Button
          className="glow-reister-button bg-white text-black text-[1rem] md:text-sm cursor-pointer border border-black flex items-center gap-2"
          onClick={() => setRegisterPatientOpen(true)}
        >
          <UserPlus className="w-5 h-5" />
          Register Patient
        </Button>
      </div>

      <AlertDialogContent className="max-w-300 h-[95vh] overflow-y-auto p-0 rounded-2xl shadow-2xl bg-white no-scrollbar">
        {/* Header with search and close */}
        {/* Header with dark background */}
        <div className="font-nunito bg-[#ffffff] text-white px-4 h-10 flex justify-between items-center sticky top-0 z-10 shadow-sm">
        <h2 className="text-2xl font-semibold text-gray-700 -mb-1">
            Register Patient
          </h2>
          <AlertDialogCancel
            className="p-1 text-red-400 hover:text-red-500 cursor-pointer rounded-tr-xs shadow-2xl h-7 w-8 -mb-1"
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
            <div className="space-y-1 bg-gradient-to-br from-[#FFFDF9] to-[#FDFAF6] border border-[#fcdcdc] shadow-md rounded-2xl p-2 transition-all duration-200">
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
                  <Label className="mb-1.5 block">Title</Label>
                  <Select>
                    <SelectTrigger className={`${inputbox} h-9`}>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent className="border-gray-300 shadow-2xl rounded-2xl focus:outline-none data-[state=checked]:bg-white data-[highlighted]:bg-white">
                      <SelectItem value="Mr">Mr</SelectItem>
                      <SelectItem value="Mrs">Mrs</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="mb-1.5 block">First Name</Label>
                  <Input className={inputbox} placeholder="John" />
                </div>
                <div>
                  <Label className="mb-1.5 block">Last Name</Label>
                  <Input className={inputbox} placeholder="Doe" />
                </div>
                <div>
                  <Label className="mb-1.5 block">Date of Birth</Label>
                  <Input className={inputbox} type="date" />
                </div>
                <div>
                  <Label className="mb-1.5 block">Gender</Label>
                  <Select>
                    <SelectTrigger className={`${inputbox} h-9`}>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent className="border-gray-300 shadow-2xl rounded-2xl focus:outline-none data-[state=checked]:bg-white data-[highlighted]:bg-white">
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="mb-1.5 block">Mobile Number</Label>
                  <Input
                    className={inputbox}
                    placeholder="9988776655"
                    maxLength={10}
                  />
                </div>
                <div>
                  <Label className="mb-1.5 block">
                    Alternative Contact Number
                  </Label>
                  <Input
                    className={inputbox}
                    placeholder="9988776655"
                    maxLength={10}
                  />
                </div>

                <div>
                  <Label className="mb-1.5 block">Email</Label>
                  <Input
                    className={inputbox}
                    placeholder="john.doe@email.com"
                    type="email"
                  />
                </div>
                <div>
                  <Label className="mb-1.5 block">Blood Group</Label>
                  <Select>
                    <SelectTrigger className={`${inputbox} h-9`}>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent className="border-gray-300 shadow-2xl rounded-2xl focus:outline-none data-[state=checked]:bg-white data-[highlighted]:bg-white">
                      <SelectItem value="O+">O+</SelectItem>
                      <SelectItem value="O-">O-</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="mb-1.5 block">ReferalSource</Label>
                  <Input className={inputbox} placeholder="Referral Source" />
                </div>
              </div>
            </div>
            {/* Contact Details Section */}
            <div className="space-y-1 bg-gradient-to-br from-[#FFFDF9] to-[#FDFAF6] border border-[#fcdcdc] shadow-md rounded-2xl p-2 transition-all duration-200">
              <h3 className=" font-sans text-md font-semibold text-[#515151] border-b pb-2 mb-4">
                Contact Details
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="mb-1.5 block">Door No./Building</Label>
                  <Input
                    className={inputbox}
                    placeholder="e.g. 12A, Galaxy Towers"
                  />
                </div>
                <div>
                  <Label className="mb-1.5 block">Street</Label>
                  <Input className={inputbox} placeholder="e.g. Main Street" />
                </div>
                <div>
                  <Label className="mb-1.5 block">Area/Town/Village</Label>
                  <Input
                    className={inputbox}
                    placeholder="e.g. Banjara Hills"
                  />
                </div>

                <div>
                  <Label className="mb-1.5 block">City/District</Label>
                  <Input
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
                            className={cn("w-full justify-between", inputbox)}
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
                  <Label className="mb-1.5 block">Pincode</Label>
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
                    className={inputbox}
                    placeholder="e.g. Near Bus Stand"
                  />
                </div>
                <div>
                  <Label className="mb-1.5 block">Taluka</Label>
                  <Input className={inputbox} placeholder="e.g. Suryapet" />
                </div>
              </div>
            </div>

            {/* Emergency Contact Section */}
            <div className="space-y-1 bg-gradient-to-br from-[#FFFDF9] to-[#FDFAF6] border border-[#fcdcdc] shadow-md rounded-2xl p-2 transition-all duration-200">
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
                  <label htmlFor="sameAsKin" className="text-sm text-gray-600">
                    Same as Kin
                  </label>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="mb-1.5 block">Name</Label>
                  <Input
                    value={emergency.name}
                    onChange={(e) =>
                      setEmergency({ ...emergency, name: e.target.value })
                    }
                    placeholder="e.g. Mathew"
                  />
                </div>
                <div>
                  <Label className="mb-1.5 block">Contact Number</Label>
                  <Input
                    value={emergency.contact}
                    onChange={(e) =>
                      setEmergency({ ...emergency, contact: e.target.value })
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
            <div className="space-y-1 bg-gradient-to-br from-[#FFFDF9] to-[#FDFAF6] border border-[#fcdcdc] shadow-md rounded-2xl p-2 transition-all duration-200">
              <div className="flex items-center justify-between border-b pb-2 mb-4">
                <h3 className="font-sans text-md font-semibold text-[#515151]">
                  Select your Family Member
                </h3>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={sameAsEmergency}
                    onChange={(_, checked) => handleSameAsEmergency(checked)}
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
                    value={kin.name}
                    onChange={(e) => setKin({ ...kin, name: e.target.value })}
                    placeholder="e.g. Mathew"
                  />
                </div>
                <div>
                  <Label className="mb-1.5 block">KIN Contact Number</Label>
                  <Input
                    value={kin.contact}
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
                    // disabled={!isValid}
                    whileHover={isValid ? { scale: 1.05 } : {}}
                    className={`font-sans flex-1 rounded-full py-1.5 px-5 text-lg font-semibold flex items-center justify-center gap-2 transition cursor-pointer ${
                      isValid
                        ? "bg-green-300 text-black hover:bg-green-400"
                        : "bg-green-200 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    <UserPlus className="w-5 h-5" />
                    Register Patient
                    {isValid && (
                      <motion.span
                        className="ml-2 flex items-center gap-1"
                        initial={{ x: 0 }}
                        animate={{ x: [0, 8, 0] }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          repeatType: "loop",
                        }}
                      >
                        <ChevronRight className="w-4 h-4" />
                        <ChevronRight className="w-4 h-4" />
                      </motion.span>
                    )}
                  </motion.button>
                </div>
              </div>
            </div>

            <div className="pt-2"></div>
          </div>

          <div className="space-y-2 bg-gradient-to-br from-blue-50 to-blue-200 border border-blue-200 rounded-xl shadow-sm p-0">
            {/* <h3 className="text-sm font-medium text-gray-600 mb-2 text-center">
              Patient Record
            </h3> */}
            <div className="space-y-2 bg-blue-50 rounded-xl shadow-xl p-3 w-full md:max-w-[320px]">
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
                    <Input
                      placeholder="Type allergies"
                      className="mb-3"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <div className="flex flex-wrap gap-2 max-h-72 overflow-y-auto pr-1 no-scrollbar">
                      {filtered.map((allergy) => (
                        <Button
                          key={allergy}
                          variant={
                            selectedAllergies.includes(allergy)
                              ? "default"
                              : "outline"
                          }
                          className={cn(
                            "rounded-full text-sm px-4 py-1.5 text-center leading-tight whitespace-normal break-words",
                            selectedAllergies.includes(allergy)
                              ? "bg-blue-500 text-white"
                              : "text-gray-700"
                          )}
                          onClick={() => toggleAllergy(allergy)}
                        >
                          {allergy}
                        </Button>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Language Spoken Section */}
                <AccordionItem value="languages">
                  <AccordionTrigger className="w-full flex items-center justify-between px-4 py-3 text-md font-semibold font-sans">
                    <span className="flex-1 text-center">Language Spoken</span>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    <Input
                      placeholder="Search language"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="mb-3"
                    />
                    <div className="flex flex-wrap gap-2 max-h-72 overflow-y-auto pr-1 no-scrollbar">
                      {Languagefiltered.map((lang) => (
                        <Button
                          key={lang}
                          variant={
                            selected.includes(lang) ? "default" : "outline"
                          }
                          className={cn(
                            "rounded-full text-sm px-4 py-1.5 text-center leading-tight whitespace-normal break-words",
                            selected.includes(lang)
                              ? "bg-blue-500 text-white"
                              : "text-gray-700"
                          )}
                          onClick={() => toggle(lang)}
                        >
                          {lang}
                        </Button>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
          {/* ✅ Success Animation */}
          {/* {booked && (
            <div className="absolute inset-0 z-50 bg-white/90 flex flex-col items-center justify-center">
              <Lottie
                animationData={successAnimation}
                className="w-100 h-100"
                loop={false}
              />
              <p className="text-2xl mt-4 font-semibold text-green-600">
                Appointment Booked Successfully!
              </p>
            </div>
          )} */}
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
      </AlertDialogContent>
    </AlertDialog>
  );
}
