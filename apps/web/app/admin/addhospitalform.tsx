"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"; // adjust path if needed
import { Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Loader2Icon, X } from "lucide-react";
import { GoogleMapApiKey } from "@/lib/constants";
import { fetchHospitals } from "@/store/hospitalSlice";
import {
  GoogleMap,
  Marker,
  Autocomplete,
  useJsApiLoader,
} from "@react-google-maps/api";
import { addhospitaldetail, updatehospitaldetail } from "@/lib/admin";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/store"; // <-- your store file
// const GoogleMapApiKey = process.env.NEXT_PUBLIC_GOOGLEMAPSECRETEKEY;;
console.log("Google secrete", GoogleMapApiKey);
const libraries: "places"[] = ["places"];

const hospitalSchema = z.object({
  HospitalName: z.string().min(1),
  HospitalCode: z.string(),
  SpecializationType: z.string().min(1),
  address: z.string().min(1),
  city: z.string().min(1),
  state: z.string().min(1),
  country: z.string().min(1),
  postalCode: z.string().min(1),
  contactNumber: z.string().min(1),
  email: z.string().email(),
  website: z.string().min(1),
  logoUrl: z.string().min(1),
  // level: z.string().min(1),
  // status: z.string().min(1).optional(),
  latitude: z.number(),
  longitude: z.number(),
});

const AddHospitalForm = ({
  open,
  onOpenChange,
  hospital,
  Organizationdata,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  hospital?: any;
  Organizationdata?: {
    OrganizationId: number;
    OrganizationName: string;
    Organizationcode: string;
  };
}) => {
  const [lat, setLat] = useState(17.385044);
  const [lng, setLng] = useState(78.486671);
  const [address, setAddress] = useState("");
  const [name, setName] = useState("");
  const [HospitalWebsite, setHospitalWebsite] = useState("");
  const [Hospitalphone, setHospitalPhone] = useState("");

  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [autocomplete, setAutocomplete] =
    useState<google.maps.places.Autocomplete | null>(null);
  console.log("data has been received", Organizationdata);
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: GoogleMapApiKey || "",
    libraries,
  });

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(hospitalSchema),
    defaultValues: {
      latitude: lat,
      longitude: lng,
    },
  });
  const [error, setError] = useState<{
    HospitalName?: string;
    SpecializationType?: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
    contactNumber?: string;
    email?: string;
    website?: string;
    logoUrl?: string;
  }>({});
  useEffect(() => {
    if (!hospital) return;

    // Reset form values
    reset({
      HospitalName: hospital.HospitalName,
      HospitalCode: hospital.HospitalCode,
      address: hospital.address,
      email: hospital.email,
      contactNumber: hospital.contactNumber,
      SpecializationType: hospital.SpecializationType,
      postalCode: hospital.postalCode,
      city: hospital.city,
      state: hospital.state,
      latitude: hospital.latitude || lat,
      longitude: hospital.longitude || lng,
      logoUrl: hospital.logoUrl,
      website: hospital.website,
    });

    // Update local state for map pin and address
    setLat(hospital.latitude || lat);
    setLng(hospital.longitude || lng);
    setAddress(hospital.address || "");

    handlePincodeFetch();
    // Optional: trigger a reverse geocode if you want to validate/refresh address
    // OR ensure Google Maps pin updates
  }, [hospital, reset]);

  const handleMapClick = ({ latLng }: google.maps.MapMouseEvent) => {
    if (!latLng) return;
    const lat = latLng.lat();
    const lng = latLng.lng();

    setLat(lat);
    setLng(lng);
    setValue("latitude", lat);
    setValue("longitude", lng);

    fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GoogleMapApiKey}`
    )
      .then((res) => res.json())
      .then((data) => {
        const formattedAddress = data.results?.[0]?.formatted_address;
        console.log("data for map",data);
        console.log("Reverse geocoded address:", formattedAddress);
        if (formattedAddress) {
          setAddress(formattedAddress);
          setValue("address", formattedAddress);
        }
      });
  };

  const onLoadAutocomplete = (auto: google.maps.places.Autocomplete) => {
    setAutocomplete(auto);
  };

  const onPlaceChanged = () => {
    if (!autocomplete) return;
    const place = autocomplete.getPlace();
    if (!place.geometry?.location) return;

    const newLat = place.geometry.location.lat();
    const newLng = place.geometry.location.lng();

    setLat(newLat);
    setLng(newLng);
    setValue("latitude", newLat);
    setValue("longitude", newLng);

    const formattedAddress = place.formatted_address || "";
    const HospitalName = place.name || "";
    const HospitalWebsite = place.website || "";
    const HosspitalContact = place.formatted_phone_number || "";
    setAddress(formattedAddress);
    setName(HospitalName);
    setHospitalWebsite(HospitalWebsite || "");
    setHospitalPhone(HosspitalContact || "");
    setValue("address", formattedAddress);
    setValue("HospitalName", HospitalName);
    setValue("website", HospitalWebsite);
    setValue("contactNumber", HosspitalContact?.replace(/\D/g, "").slice(-10)); // last 10 digits

    console.log("Place changed:", place);

    // Extract pincode
    const pincodeMatch = formattedAddress.match(/\b\d{6}\b/);
    const postalCode = pincodeMatch ? pincodeMatch[0] : null;

    if (postalCode) {
      console.log("postalCode:", postalCode);
      setValue("postalCode", postalCode); // Optional: if you have a field for it
      handlePincodeFetch();
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
  const dispatch = useDispatch<AppDispatch>();

  const onSubmit = async (formData: any) => {
    console.log("Data has been log", Organizationdata);
    try {
      // 🔥 Include required extra fields if needed
      const isEdit = !!hospital?.HospitalId;

      const payload = {
        ...formData,
        organizationId: isEdit
          ? (hospital.organizationId ?? "")
          : (Organizationdata?.OrganizationId ?? ""),
        ParentHospitalCode: isEdit
          ? (hospital.Organizationcode ?? "")
          : (Organizationdata?.Organizationcode ?? ""),
        level: "SUPER",
        status: formData.status || hospital?.status || "ACTIVE",
        isActive: isEdit ? (hospital.isActive ?? true) : true,
      };
      // const parsed = hospitalSchema.safeParse(payload);
      // if (!parsed.success) {
      //   const formatted = parsed.error.format();
      //   console.log("Validation Errors:", formatted);

      //   setError({
      //     name: formatted.name?._errors?.[0] ?? "",
      //     SpecializationType: formatted.SpecializationType?._errors?.[0] ?? "",
      //     address: formatted.address?._errors?.[0] ?? "",
      //     city: formatted.city?._errors?.[0] ?? "",
      //     state: formatted.state?._errors?.[0] ?? "",
      //     country: formatted.country?._errors?.[0] ?? "",
      //     postalCode: formatted.postalCode?._errors?.[0],
      //     email: formatted.email?._errors?.[0] ?? "",
      //     website: formatted.website?._errors?.[0] ?? "",
      //     logoUrl: formatted.logoUrl?._errors?.[0] ?? "",
      //   });

      //   toast.error("Please correct the errors and try again.");
      //   return;
      // } else {
      //   setError({}); // Clear errors on successful validation
      // }

      // const result = await addhospitaldetail(payload);

      // console.log("Hospital added:", result);
      // toast.success("Hospital data added scccessfully");
      // reset(); // Reset the form
      // onOpenChange(false); // Close the dialog
      if (isEdit) {
        await updatehospitaldetail(hospital.HospitalId, payload);
        toast.success("Hospital updated successfully");
      } else {
        const result = await addhospitaldetail(payload);
        toast.success("Hospital added successfully", result);
      }

      reset();
      onOpenChange(false);
      dispatch(fetchHospitals());
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      const message = error?.response?.data?.message || "An error has occurred";
      toast.error(message);
    }
  };

  const handleCancel = () => {
    reset();
    setAddress("");
    onOpenChange(false);
  };

  const inputbox =
    "w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-800 shadow-md placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-200";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild></DialogTrigger>
      <DialogContent
        size="fullscreen"
        className="max-h-[10vh] overflow-y-auto p-4 no-scrollbar"
      >
        <div className="font-sans flex justify-between items-start mb-1 shadow-2xl rounded-lg p-1 bg-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-700">
              {hospital ? "Edit Hospital" : "Add Hospital"}
            </DialogTitle>
            <DialogDescription>
              {hospital ? "Update hospital info" : "Enter hospital details"}
            </DialogDescription>
          </DialogHeader>
          <DialogClose asChild>
            <button className="text-blue-600 hover:bg-blue-50 p-2 rounded-full transition cursor-pointer">
              <X className="w-6 h-6" />
            </button>
          </DialogClose>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 🗺️ Google Map & Address Search */}
          {isLoaded && (
            <div className="scroll-gradient overflow-hidden rounded-xl h-[400px]">
              <Autocomplete
                onLoad={onLoadAutocomplete}
                onPlaceChanged={onPlaceChanged}
              >
                <Input
                  placeholder="Search Hospital"
                  className={`${inputbox} mb-3`}
                />
              </Autocomplete>
              <GoogleMap
                mapContainerStyle={{ height: "350px", width: "100%" }}
                center={{ lat, lng }}
                zoom={14}
                onClick={handleMapClick}
              >
                <Marker position={{ lat, lng }} />
              </GoogleMap>
            </div>
          )}

          {/* 📝 Form Fields */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <Input
              {...register("HospitalName")}
              placeholder="Hospital Name"
              className={`${inputbox} mb-4 py-5`}
            />

            <Input
              {...register("address")}
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className={`${inputbox}  mb-4 py-4.5`}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
              <Input
                {...register("HospitalCode")}
                placeholder="Hospital Code"
                className={inputbox}
              />

              <Controller
                name="SpecializationType"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <div className="mb-4">
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger
                        className={`${inputbox} py-1 px-4 text-sm leading-tight h-10`}
                      >
                        {" "}
                        <SelectValue placeholder="Select Specialization" />
                      </SelectTrigger>
                      <SelectContent className="border-gray-300 shadow-2xl rounded-2xl focus:outline-none data-[state=checked]:bg-white data-[highlighted]:bg-white">
                        <SelectItem value="GENERAL">GENERAL</SelectItem>
                        <SelectItem value="OPHTHALMOLOGY">
                          OPHTHALMOLOGY
                        </SelectItem>
                        <SelectItem value="DENTAL">DENTAL</SelectItem>
                        <SelectItem value="ENT">ENT</SelectItem>
                        <SelectItem value="ORTHOPEDIC">ORTHOPEDIC</SelectItem>
                        <SelectItem value="MULTISPECIALITY">
                          MULTISPECIALITY
                        </SelectItem>
                        <SelectItem value="OTHER">OTHER</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              />

              <Input
                {...register("postalCode")}
                placeholder="Postal Code"
                onBlur={handlePincodeFetch} // fetch city/state on blur
                className={inputbox}
              />
              <Input
                {...register("city")}
                placeholder="City"
                value={city}
                readOnly
                className={inputbox}
              />
              <Input
                {...register("state")}
                placeholder="State"
                value={state}
                readOnly
                className={inputbox}
              />
              <Input
                {...register("country")}
                placeholder="Country"
                defaultValue="India"
                className={inputbox}
              />

              <Input
                {...register("contactNumber")}
                placeholder="Contact Number"
                className={inputbox}
                maxLength={10}
              />
              <Input
                {...register("email")}
                placeholder="Email"
                className={inputbox}
              />

              <Input
                {...register("website")}
                placeholder="Website"
                className={inputbox}
              />

              <Input
                {...register("logoUrl")}
                placeholder="Logo URL"
                className={inputbox}
              />

              {/* <Input
                {...register("level")}
                placeholder="Level"
                className={inputbox}
              /> */}
              {/* <Input {...register("status")} placeholder="Status" /> */}
            </div>

            <DialogFooter className="flex justify-end gap-2 mt-4">
              <button
                type="button"
                onClick={handleCancel}
                className="bg-red-400 hover:bg-red-500 text-white px-5 py-2 rounded-4xl shadow-2xl transition disabled:opacity-50 cursor-pointer "
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-green-400 hover:bg-green-500 text-white px-5 py-2 rounded-4xl shadow-2xl transition cursor-pointer"
              >
                {isSubmitting ? (
                  <Loader2Icon className="animate-spin" />
                ) : (
                  "Save"
                )}{" "}
              </button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddHospitalForm;
