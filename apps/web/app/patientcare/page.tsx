import React from "react";

import { getProfile } from "@/lib/action";
import PatientClientWrapper from "./PatientClientWrapper";

const ProfilePage = async () => {
  const res = await getProfile();
  console.log("ProfilePage", res);

  return (
    <PatientClientWrapper  />

  );
};

export default ProfilePage;
