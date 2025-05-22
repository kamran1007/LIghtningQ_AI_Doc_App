import { getProfile } from "@/lib/action";

import React from "react";

const ProfilePage = async () => {
  const res = await getProfile();
  console.log("ProfilePage", res);
  return (
    <div>
      ProfilePage
      <p>{JSON.stringify(res)}</p>
    </div>
  );
};

export default ProfilePage;