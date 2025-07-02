"use client";


import AvailabilityChecker from "@/components/availability-checker";
import Calendar from "@/components/calendar";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EventsProvider, useEvents } from "@/context/events-context";
import PatientClientWrapper from "app/patientcare/PatientClientWrapper";
import { RegisterPatient } from "app/patientcare/PatientRegister";
import React from "react";



// ✅ Dynamically import the client wrapper

const Appointment =  () => {

  return (
    <EventsProvider>
      <div className="py-0">
        <Tabs
          defaultValue="calendar"
          className="flex flex-col w-full items-center"
        >
          {/* <TabsList className="flex justify-center mb-2">
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
            <TabsTrigger value="schedulingAssistant">
              Scheduling Assistant
            </TabsTrigger>
          </TabsList> */}
          <TabsContent value="calendar" className="w-full px-5 space-y-5">
            {/* <div className="space-y-0">
              <h2 className="flex items-center text-2xl font-semibold tracking-tight md:text-3xl">
                Calendar
              </h2>
              <p className="text-xs md:text-sm font-medium">
                A flexible calendar component with drag and drop capabilities
                built using FullCalendar and shadcn/ui.
              </p>
            </div> */}

            {/* <Separator /> */}
            <Calendar />
          </TabsContent>
          <TabsContent
            value="schedulingAssistant"
            className="w-full px-5 space-y-5"
          >
            <div className="space-y-0">
              <h2 className="flex items-center text-2xl font-semibold tracking-tight md:text-3xl">
                Scheduling Assistant
              </h2>
              <p className="text-xs md:text-sm font-medium">
                A scheduling assistant built to analyze a user&apos;s schedule
                and automatically show open spots.
              </p>
            </div>
            <Separator />
            <AvailabilityChecker />
          </TabsContent>
        </Tabs>
      </div>
       {/* <PatientClientWrapper  /> */}

    </EventsProvider>
  );
};

export default Appointment;