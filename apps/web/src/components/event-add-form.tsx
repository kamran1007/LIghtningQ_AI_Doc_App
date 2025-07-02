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
import {
  Select,
  SelectTrigger,
  SelectItem,
  SelectContent,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import { CalendarClock, Plus, X } from "lucide-react";
import Lottie from "lottie-react";
import successAnimation from "@/assets/success-animation.json";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { useEvents } from "@/context/events-context";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { PatientSearchDrawer } from "app/appointment/patientSearchDrawer";

const messages = [
  "Search patient by Phone No.",
  "Search patient by Name",
  "Search patient by MR No.",
];
const inputbox =
  "w-full rounded-4xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-800  placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-200";
interface EventAddFormProps {
  start: Date;
  end: Date;
}

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
});

type EventAddFormValues = z.infer<typeof eventAddFormSchema>;

export function EventAddForm({ start, end }: EventAddFormProps) {
  const { events, addEvent } = useEvents();
  const { eventAddOpen, setEventAddOpen } = useEvents();
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [booked, setBooked] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [displayText, setDisplayText] = useState("");
  const [msgIndex, setMsgIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const form = useForm<z.infer<typeof eventAddFormSchema>>({
    resolver: zodResolver(eventAddFormSchema),
  });
  useEffect(() => {
    const current = messages[msgIndex];
    if (current && charIndex < current.length) {
      const timeout = setTimeout(() => {
        setDisplayText((prev) => prev + current.charAt(charIndex));
        setCharIndex((prev) => prev + 1);
      }, 70);
      return () => clearTimeout(timeout);
    } else if (current) {
      const timeout = setTimeout(() => {
        setCharIndex(0);
        setDisplayText("");
        setMsgIndex((prev) => (prev + 1) % messages.length);
      }, 1500); // wait before switching message
      return () => clearTimeout(timeout);
    }
  }, [charIndex, msgIndex]);

  useEffect(() => {
    if (!eventAddOpen) {
      setSearchQuery("");
      form.reset({
        title: "",
        description: "",
        start: start,
        end: end,
        color: "#76c7ef",
      });
    }
  }, [eventAddOpen]);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTimeout(() => {
      setBooked(true);
      setTimeout(() => {
        setBooked(false);
        setEventAddOpen(false);
      }, 2000);
    }, 800);
  };

  return (
    <AlertDialog open={eventAddOpen} onOpenChange={setEventAddOpen}>
      <AlertDialogTrigger asChild>
        <Button
          className="glow-button bg-white text-white text-[1rem] md:text-sm cursor-pointer border-e-black"
          onClick={() => setEventAddOpen(true)}
        >
            <CalendarClock className="w-5 h-5 text-grey-500" />

          Book Appointment
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="max-w-350 h-[95vh] overflow-y-auto p-0 rounded-2xl shadow-2xl bg-white no-scrollbar">
        {/* Header with search and close */}
        {/* Header with dark background */}
        <div className="font-sans  bg-[#ffffff] text-white px-4 h-8 flex justify-between items-center sticky top-0 z-10">
          <h2 className="text-2xl font-semibold text-gray-700 -mb-1">
            Make Appointment
          </h2>
          <AlertDialogCancel
            className="p-1 text-red-400 hover:text-red-500 cursor-pointer rounded-tr-xs shadow-2xl h-7 w-8 -mb-2"
            onClick={() => setEventAddOpen(false)}
          >
            <X className="w-4 h-4 cursor-pointer" />
          </AlertDialogCancel>
        </div>

        {/* Pull input box upward using negative margin */}
        {/* <div className="bg-[#f7f5fe] h-16 px-4 py-0 rounded-tr-xs shadow-xl"> */}
        <div className="bg-gradient-to-r from-[#F1F3F5] to-[#EDEDED] h-16 px-4 flex items-center rounded-tr-xl shadow-md -mb-2 border-b border-gray-300">
          <div className="flex items-center h-full">
            {/* Input Box */}
            <div className="mr-6 mt-1 w-80">
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={displayText}
                className="w-full p-2 border border-gray-300 focus:ring-0 focus:border-white shadow-2xl bg-gray-50 text-black rounded-2xl transition-all placeholder-black placeholder-opacity-70 font-medium text-center"
              />
            </div>

            {/* Patient Name */}
            <div className="flex items-center h-full gap-6 mt-1 font-sans">
              {/* Patient Name */}
              <div className="flex items-center gap-4">
                <div className="h-12 w-px bg-gray-400" />
                <div className="flex flex-col items-center">
                  <h1 className="text-sm text-gray-500 font-medium">
                    Patient Name
                  </h1>
                  <p className="text-sm font-semibold text-black mt-1">
                    Kamran
                  </p>
                </div>
              </div>

              {/* Mobile No */}
              <div className="flex items-center gap-4">
                <div className="h-12 w-px bg-gray-400" />
                <div className="flex flex-col items-center">
                  <h1 className="text-sm text-gray-500 font-medium">
                    Mobile No
                  </h1>
                  <p className="text-sm font-semibold text-black mt-1">
                    9876543210
                  </p>
                </div>
              </div>

              {/* Age */}
              <div className="flex items-center gap-4">
                <div className="h-12 w-px bg-gray-400" />
                <div className="flex flex-col items-center">
                  <h1 className="text-sm text-gray-500 font-medium">Age</h1>
                  <p className="text-sm font-semibold text-black mt-1">24</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-12 w-px bg-gray-400" />
                <div className="flex flex-col items-center">
                  <h1 className="text-sm text-gray-500 font-medium">
                    Last Visit
                  </h1>
                  <p className="text-sm font-semibold text-black mt-1">
                    31-March-2025
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-12 w-px bg-gray-400" />
                <div className="flex flex-col items-center">
                  {/* <h1 className="text-sm text-gray-500 font-medium">Last Visit</h1>
                  <p className="text-sm font-semibold text-black mt-1">31-March-2025</p> */}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form Content */}
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-3 gap-3 px-6 py-2 "
        >
          <div className="space-y-1 bg-gradient-to-br from-[#FFFDF9] to-[#FDFAF6] border border-[#fcdcdc] shadow-md rounded-2xl p-2 transition-all duration-200">
            <div className="px-6 py-1">
              <h3 className="text-sm font-medium text-gray-600 mb-2">
                Choose Specialist
              </h3>
              <div className="flex flex-wrap gap-2">
                {["Pediatrics", "Cardiology", "Endocrinology", "ENT"].map(
                  (cat, idx) => (
                    <button
                      key={idx}
                      className="flex items-center gap-2 px-4 py-2 bg-white text-sm text-gray-600 border rounded-full hover:bg-blue-50 hover:text-blue-600 transition"
                    >
                      <span>💙</span> {cat}
                    </button>
                  )
                )}
              </div>
            </div>
            <div className="px-6 py-0">
              <h3 className="text-sm font-medium text-gray-600 mb-2">
                Choose doctor
              </h3>
              <div className="flex gap-4 overflow-x-auto pb-2">
                {[1, 2].map((_, idx) => (
                  <div
                    key={idx}
                    className="w-40 flex-shrink-0 bg-white border rounded-xl p-4 shadow hover:shadow-2xl cursor-pointer transition border-gray-300"
                  >
                    <Avatar className="h-10 w-10 rounded-full">
                      <AvatarImage
                        src="https://github.com/shadcn.png"
                        alt="User avatar"
                        className="h-10 w-10 rounded-full object-cover"
                      />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <h4 className="text-md font-semibold">Dr. Liza Martin</h4>
                    <p className="text-xs text-gray-500">Cardiologist</p>
                    <p className="text-blue-600 text-sm mt-1">9 Years Exp.</p>
                  </div>
                ))}
              </div>
            </div>
            {/* <div className="px-6 py-4">
              <h3 className="text-sm font-medium text-gray-600 mb-2">
                Choose doctor
              </h3>
              <Carousel opts={{ align: "start" }} className="w-full">
                <CarouselContent>
                  {[1, 2, 3, 4, 5].map((_, index) => (
                    <CarouselItem
                      key={index}
                      className="basis-auto md:basis-1/3 lg:basis-1/4 xl:basis-1/5"
                    >
                      <Card className="p-4 cursor-pointer hover:shadow-lg transition border border-gray-300">
                        <CardContent className="p-0 flex flex-col items-start">
                          <Avatar className="h-10 w-10 mb-2">
                            <AvatarImage
                              src="https://github.com/shadcn.png"
                              alt="User avatar"
                              className="object-cover"
                            />
                            <AvatarFallback>CN</AvatarFallback>
                          </Avatar>
                          <h4 className="text-md font-semibold">
                            Dr. Liza Martin
                          </h4>
                          <p className="text-xs text-gray-500">Cardiologist</p>
                          <p className="text-blue-600 text-sm mt-1">
                            9 Years Exp.
                          </p>
                        </CardContent>
                      </Card>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </div> */}

            <div className="px-6 py-0">
              <h3 className="text-sm font-medium text-gray-600 mb-2">
                Choose date and time
              </h3>
              <div className="grid grid-cols-7 gap-2 text-center text-sm border-gray-300">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                  (day, idx) => (
                    <div
                      key={idx}
                      className={`p-2 rounded-lg ${idx === 3 ? "bg-blue-500 text-white" : "bg-white"}`}
                    >
                      <p>{day}</p>
                      <p className="text-xs">9</p>
                    </div>
                  )
                )}
              </div>
              <div className="flex gap-2 flex-wrap mt-3 border-gray-300">
                {["08:30", "09:30", "10:30", "11:30"].map((slot, idx) => (
                  <button
                    key={idx}
                    className="px-4 py-1 bg-white border rounded-full text-sm hover:bg-blue-100 transition border-gray-300"
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
            {/* <div className="grid grid-cols-2 gap-4 px-6 py-4">
              <div>
                <Label className="text-sm text-gray-600">Visit Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="New / Follow-up" />
                  </SelectTrigger>
                  <SelectContent className="border-white shadow-2xl rounded-2xl data-[state=checked]:bg-white data-[highlighted]:bg-white">
                    <SelectItem value="new">New Appointment</SelectItem>
                    <SelectItem value="followup">Free Follow-up</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm text-gray-600">Payment</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Cash / UPI" />
                  </SelectTrigger>
                  <SelectContent className="border-white shadow-2xl rounded-2xl data-[state=checked]:bg-white data-[highlighted]:bg-white">
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="upi">UPI</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div> */}

            {/* <div className="px-6 pb-6">
              <Button
                type="submit"
                className="w-full bg-lime-400 hover:bg-lime-500 text-black font-semibold rounded-full py-3 text-lg transition"
              >
                Book Appointment
              </Button>
            </div> */}
          </div>

          <div className="space-y-3 bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-2xl shadow-xl p-2">
            {/* Row 1: Title + First Name */}
            <div className="flex gap-2 ">
              <div className="w-40">
                <Label className="text-sm font-medium text-gray-700 mb-1.5 block">
                  Title
                </Label>
                <Select>
                  <SelectTrigger className={`${inputbox} h-9`}>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent className="border-gray-300 shadow-2xl rounded-2xl focus:outline-none data-[state=checked]:bg-white data-[highlighted]:bg-white">
                    <SelectItem value="Mr">Mr</SelectItem>
                    <SelectItem value="Mrs">Mrs</SelectItem>
                    <SelectItem value="Miss">Miss</SelectItem>
                    <SelectItem value="Ms">Ms</SelectItem>
                    <SelectItem value="Prof">Prof</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <Label className="text-sm font-medium text-gray-700 mb-1.5 block">
                  First Name
                </Label>
                <Input placeholder="John" className={inputbox} />
              </div>
            </div>

            {/* Row 2: Last Name + DOB */}
            <div className="flex gap-2">
              <div className="w-50">
                <Label className="text-sm font-medium text-gray-700 mb-1.5 block">
                  Last Name
                </Label>
                <Input placeholder="Doe" className={inputbox} />
              </div>
              <div className="flex-1">
                <Label className="text-sm font-medium text-gray-700 mb-1.5 block">
                  Date of Birth
                </Label>
                <Input type="date" className={inputbox} />
              </div>
            </div>

            {/* Row 3: Gender + Mobile */}
            <div className="flex gap-2">
              <div className="w-40">
                <Label className="text-sm font-medium text-gray-700 mb-1.5 block">
                  Gender
                </Label>
                <Select>
                  <SelectTrigger className={`${inputbox} h-9`}>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent className="border-gray-300 shadow-2xl rounded-2xl focus:outline-none data-[state=checked]:bg-white data-[highlighted]:bg-white">
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <Label className="text-sm font-medium text-gray-700 mb-1.5 block">
                  Mobile Number
                </Label>
                <Input
                  placeholder="9988776655"
                  maxLength={10}
                  className={inputbox}
                />
              </div>
            </div>

            {/* Row 4: Address */}
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-1.5 block">
                Address
              </Label>
              <Input placeholder="Enter Address" className={inputbox} />
            </div>

            {/* Row 5: Visit Type + Payment Mode */}
            <div className="flex gap-2">
              <div className="flex-1">
                <Label className="text-sm font-medium text-gray-700 mb-1.5 block">
                  Visit Type
                </Label>
                <Select>
                  <SelectTrigger className={`${inputbox} h-9`}>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent className="border-gray-300 shadow-2xl rounded-2xl focus:outline-none data-[state=checked]:bg-white data-[highlighted]:bg-white">
                    <SelectItem value="new">New Appointment</SelectItem>
                    <SelectItem value="FreeFollowup">Free Follow-up</SelectItem>
                    <SelectItem value="PaidFollowup">Paid Follow-up</SelectItem>
                    <SelectItem value="NewPatient">New Patient</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <Label className="text-sm font-medium text-gray-700 mb-1.5 block">
                  Payment Mode
                </Label>
                <Select>
                  <SelectTrigger className={`${inputbox} h-9`}>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent className="border-gray-300 shadow-2xl rounded-2xl focus:outline-none data-[state=checked]:bg-white data-[highlighted]:bg-white">
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="upi">UPI</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <Button
                type="submit"
                className="w-full bg-lime-400 hover:bg-lime-500 text-black font-semibold rounded-full py-3 text-lg transition font-sans"
              >
                Book Appointment
              </Button>
            </div>
          </div>

          <div className="space-y-2 bg-gradient-to-br from-blue-50 to-blue-200 border border-blue-200 rounded-xl shadow-sm p-0">
            <h3 className="text-sm font-medium text-gray-600 mb-2 text-center">
              Appointment Details
            </h3>
          </div>
          {/* ✅ Success Animation */}
          {booked && (
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
          )}
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
            console.log("🚀 Redirecting to register screen");
          }}
        />
      </AlertDialogContent>
    </AlertDialog>
  );
}
