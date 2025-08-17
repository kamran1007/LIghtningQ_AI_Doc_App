import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const SearchBar = () => {
  return (
    <div className="relative w-full max-w-md mx-4">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-black" />
      <Input
        type="search"
        placeholder="Search patient..."
        className="pl-10 bg-white text-black rounded-full shadow] 
             border border-b-white placeholder placeholder:text-gray-400 
             placeholder:font-medium focus:outline-teal-300 focus:ring-2 focus:ring-teal-500"
      />
    </div>
  );
};

export default SearchBar;
