import { getProfile } from '@/lib/action';
import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import React from 'react'

const page = async () => {
  const session = await getSession();
    const res = await getProfile();
  
  if(!session || !session.user) redirect("/auth/login");
  console.log("session", session);
  return (
    
    <div>page
      <p>{JSON.stringify(res)}</p>
    </div>
  )
}

export default page