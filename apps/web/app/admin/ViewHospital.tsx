"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MapPin, Mail, Globe, Phone, EyeOff, X } from "lucide-react";
import Image from "next/image";
import React from "react";

type Hospital = {
  name: string;
  hospitalCode: string;
  ParentHospitalCode: string;
  SpecializationType: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  contactNumber: string;
  email: string;
  website: string;
  logoUrl: string;
  latitude: number;
  longitude: number;
  level: string;
  status: string;
  isActive: boolean;
};

interface Props {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  hospital: Hospital;
}

const ViewHospitalModal = ({ isOpen, onOpenChange, hospital }: Props) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent size="md" className="max-h-[95vh] overflow-y-auto p-6">
        <div className="flex justify-between items-start mb-2 shadow-2xl rounded-lg p-1 bg-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-700">
            View Hospital
            </DialogTitle>
            <DialogDescription>
              view your added hospital data
            </DialogDescription>
          </DialogHeader>
          <DialogClose asChild>
            <button className="text-blue-600 hover:bg-blue-50 p-2 rounded-full transition cursor-pointer">
              <X className="w-6 h-6" />
            </button>
          </DialogClose>
        </div>
        

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          <div className="flex flex-col gap-2">
            <span className="font-semibold">Name:</span>
            <span>{hospital.name}</span>

            <span className="font-semibold">Specialization:</span>
            <span>{hospital.SpecializationType}</span>

            <span className="font-semibold">Hospital Code:</span>
            <span>{hospital.hospitalCode || "N/A"}</span>

            <span className="font-semibold">Parent Code:</span>
            <span>{hospital.ParentHospitalCode}</span>

            <span className="font-semibold">Level:</span>
            <span>{hospital.level}</span>

            <span className="font-semibold">Status:</span>
            <span>{hospital.status}</span>
          </div>

          <div className="flex flex-col gap-2">
            <span className="font-semibold">Address:</span>
            <span>
              {hospital.address}, {hospital.city}, {hospital.state} -{" "}
              {hospital.postalCode}, {hospital.country}
            </span>

            <span className="font-semibold flex items-center gap-2">
              <Phone className="w-4 h-4 text-blue-500" />
              {hospital.contactNumber}
            </span>

            <span className="font-semibold flex items-center gap-2">
              <Mail className="w-4 h-4 text-blue-500" />
              {hospital.email}
            </span>

            <span className="font-semibold flex items-center gap-2">
              <Globe className="w-4 h-4 text-blue-500" />
              <a
                href={hospital.website}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 underline"
              >
                {hospital.website}
              </a>
            </span>

            {/* <span className="font-semibold flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-500" />
              Lat: {hospital.latitude}, Lng: {hospital.longitude}
            </span> */}
          </div>
        </div>

        <Image
          src={
            hospital.logoUrl?.startsWith("http")
              ? hospital.logoUrl
              : hospital.logoUrl
                ? `/${hospital.logoUrl}` // fallback to relative path with slash
                : "/default-logo.png" // fallback if it's undefined or invalid
          }
          alt="Hospital Logo"
          width={120}
          height={80}
          className="w-32 h-20 object-contain self-center"
        />

        <DialogFooter className="pt-4">
          <DialogClose asChild>
            <Button className="cursor-pointer rounded-4xl shadow-2xl">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ViewHospitalModal;
