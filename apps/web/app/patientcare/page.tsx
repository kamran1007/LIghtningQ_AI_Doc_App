import React from "react";

import { getProfile } from "@/lib/action";
import PatientClientWrapper from "./PatientClientWrapper";
import { EventsProvider } from "@/context/events-context";

const ProfilePage = async () => {
  const res = await getProfile();
  console.log("ProfilePage", res);

  return (
    <EventsProvider>
      <PatientClientWrapper />
    </EventsProvider>
  );
};

export default ProfilePage;
