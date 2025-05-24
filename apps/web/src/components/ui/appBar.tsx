// app/components/ui/appBar.tsx (Server Component)
import Link from "next/link";
import LogInButton from "../loginButton"; // must be a client component

const AppBar = () => {

  return (
    <div className="submit-button">
      <Link href={"/dashboard"}>Dashboard</Link>
      <Link href={"/profile"}>Profile</Link>
      <LogInButton />
    </div>
  );
};

export default AppBar;
