// app/components/ui/appBar.ts // must be a client component
import SearchBar from "./searchpatient";
import NavbarDropdown from "../ui/NavbarDropdown"; // must be a client component
// import { getSession } from "@/lib/session";
import { getProfile } from "@/lib/action";
import Image from "next/image";

const AppBar = async () => {
  const UserProfile = await getProfile();
  const firstName = UserProfile?.user?.firstName ?? "";
  const lastName = UserProfile?.user?.lastName ?? "";
  const roleId = UserProfile?.user?.roleId ?? null;

  const FullName = firstName + " " + lastName;
  const roleLabel = roleId === 1 ? "Admin" : "Doctor";
  

  return (
    <div className="navbar flex items-center justify-between px-4 py-4 h-14 relative bg-gray-800">
      
      {/* Left-side logo (no padding) */}
      <div className="absolute left-0 top-0 h-14 flex items-center z-50">
        <Image
          src="/NavBarLogo.png"
          alt="Logo"
          width={400}
          height={400}
          className="h-14 w-20 object-contain cursor-pointer"
          priority = {false}
        />
      </div>

      {/* Centered Search Bar */}
      <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-40">
        <SearchBar />
      </div>

      {/* Right-side user info and dropdown */}
      <div className="absolute right-4 top-0 h-14 flex items-center gap-2 z-50">
        {UserProfile?.user ? (
          <p className="font-houschka text-1xl text-white whitespace-nowrap">
            {FullName} ({roleLabel})
          </p>
        ) : (
          <p className="font-houschka text-1xl text-white">Loading...</p>
        )}
        <NavbarDropdown />
      </div>
    </div>
  );
};



export default AppBar;
