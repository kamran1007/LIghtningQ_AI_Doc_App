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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import GoogleMapReact from "google-map-react";
import { X } from "lucide-react";
// import { GoogleMapApiKey } from  "@/lib/constants";


// Zod schema for validation
const hospitalSchema = z.object({
  name: z.string().min(1),
  hospitalCode: z.string().min(1),
  SpecializationType: z.string().min(1),
  address: z.string().min(1),
  city: z.string().min(1),
  state: z.string().min(1),
  country: z.string().min(1),
  postalCode: z.string().min(1),
  contactNumber: z.string().min(1),
  email: z.string().email(),
  website: z.string().url(),
  logoUrl: z.string().url(),
  level: z.string().min(1),
  status: z.string().min(1),
  latitude: z.number(),
  longitude: z.number(),
});

type MapMarkerProps = {
  lat: number;
  lng: number;
};
const MapMarker: React.FC<MapMarkerProps> = () => (
  <div className="text-red-600">📍</div>
);
const GoogleMapApiKey = "";
console.log("Google Map Api key ",GoogleMapApiKey)
const AddHospitalForm = ({
  open,
  onOpenChange,
  hospital,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  hospital?: any;
}) => {
  const [lat, setLat] = useState(17.385044);
  const [lng, setLng] = useState(78.486671);
  const [address, setAddress] = useState("");

  const { register, handleSubmit, setValue, getValues, reset } = useForm({
    resolver: zodResolver(hospitalSchema),
    defaultValues: {
      latitude: lat,
      longitude: lng,
    },
  });
  useEffect(() => {
    if (hospital) {
      setValue("name", hospital.name);
      setValue("hospitalCode", hospital.hospitalCode);
      setValue("address", hospital.address);
      setValue("email", hospital.email);
      setValue("contactNumber", hospital.contactNumber);
      setValue("latitude", hospital.latitude || lat);
      setValue("longitude", hospital.longitude || lng);
      setAddress(hospital.address || "");
    }
  }, [hospital, lat, lng, setValue]);
  const handleMapClick = ({ lat, lng }: { lat: number; lng: number }) => {
    setLat(lat);
    setLng(lng);
    setValue("latitude", lat);
    setValue("longitude", lng);

    // Optional: Reverse geocoding to auto-fill address
    fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GoogleMapApiKey}`
    )
      .then((res) => res.json())
      .then((data) => {
        const formattedAddress = data.results?.[0]?.formatted_address;
        if (formattedAddress) {
          setAddress(formattedAddress);
          setValue("address", formattedAddress);
        }
      });
  };

  const onSubmit = (data: any) => {
    console.log("Form Data:", data);
    // Submit your data via POST or mutation here
  };
  const [city, setCity] = useState("");
  const [state, setState] = useState("");

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
  let inputbox =
    "w-full rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm text-gray-800 shadow-md placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-200";

  const handleCancel = () => {
    reset(); // ✅ Reset form fields
    setAddress(""); // ✅ Clear address state
    onOpenChange(false); // ✅ Close the modal
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild></DialogTrigger>
      <DialogContent
        size="fullscreen"
        className="max-h-[100vh] overflow-y-auto p-6"
      >
        <div className="flex justify-between items-start mb-2 shadow-2xl rounded-lg p-1 bg-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-700">
              {hospital ? "Edit hospital" : "Add Hospital"}
              {/* Add Hospital */}
            </DialogTitle>
            <DialogDescription>
              {hospital ? "You can Edit hospital" : "You can Add Hospital"}
            </DialogDescription>
          </DialogHeader>
          <DialogClose asChild>
            <button className="text-blue-600 hover:bg-blue-50 p-2 rounded-full transition">
              <X className="w-6 h-6" />
            </button>
          </DialogClose>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="scroll-gradient h-[300px] overflow-y-auto p-4h-[500px] rounded-md overflow-hidden">
            <GoogleMapReact
              bootstrapURLKeys={{ key: "AIzaSyDd8GXsu4fRn51F9SlYxJAMJbSfvxBUabc" }}
              defaultCenter={{ lat, lng }}
              defaultZoom={14}
              onClick={handleMapClick}
            >
              <MapMarker lat={lat} lng={lng} />
            </GoogleMapReact>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Input
              {...register("name")}
              placeholder="Hospital Name"
              className={`${inputbox} mb-4 py-5.5`}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
              <Input
                {...register("hospitalCode")}
                placeholder="Hospital Code"
                className={inputbox}
              />

              <select
                {...register("SpecializationType")}
                className={`${inputbox} bg-white border border-gray-300 rounded px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400`}
              >
                <option value="">Select Specialization</option>
                <option value="Cardiology">Cardiology</option>
                <option value="Neurology">Neurology</option>
                <option value="Pediatrics">Pediatrics</option>
                <option value="Oncology">Oncology</option>
                <option value="Orthopedics">Orthopedics</option>
              </select>
              <Input
                {...register("address")}
                placeholder="Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className={`${inputbox}`}
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

              <Input
                {...register("level")}
                placeholder="Level"
                className={inputbox}
              />
              {/* <Input {...register("status")} placeholder="Status" /> */}
            </div>

            <DialogFooter className="flex justify-end gap-2 mt-4">
              <Button
                type="button"
                onClick={handleCancel}
                className="bg-red-400 hover:bg-red-500 text-white px-5 py-2 rounded-4xl shadow-2xl transition disabled:opacity-50 cursor-pointer "
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-green-400 hover:bg-green-500 text-white px-5 py-2 rounded-4xl shadow-2xl transition disabled:opacity-50 cursor-pointer"
              >
                Submit
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddHospitalForm;



