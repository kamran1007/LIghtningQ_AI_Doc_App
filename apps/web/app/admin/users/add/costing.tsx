"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@mui/material";
import { X } from "lucide-react";


interface TimeslotProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}


const Costing: React.FC<TimeslotProps> = ({ open, onOpenChange }) => {


  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild></DialogTrigger>
      <DialogContent
        size="md"
        className="max-h-[95vh] overflow-y-auto p-4 max-w-3xl"
      >
        <div className="flex justify-between items-center">
          <DialogTitle className="text-xl font-semibold">
            Doctor Time Slot
          </DialogTitle>
          <DialogClose asChild>
            <button className="text-blue-600 hover:bg-blue-50 p-2 rounded-full transition cursor-pointer">
              <X className="w-6 h-6" />
            </button>
          </DialogClose>
        </div>
        
            {/* Day selector */}
            
            
      </DialogContent>
    </Dialog>
  );
};

export default Costing;
