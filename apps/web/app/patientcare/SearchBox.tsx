// SearchBox.tsx
import React, { useState, useEffect, useRef } from "react";

export default React.memo(function SearchBox({ onSearch }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // debounce logic
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // trigger fetch but do NOT blur
  useEffect(() => {
    if (debouncedSearch !== "") {
      onSearch(debouncedSearch);
    }
  }, [debouncedSearch, onSearch]);

  return (
    <input
      ref={inputRef}
      type="text"
      placeholder="Search Name, MRN, Mobile No"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      className="pl-10 pr-4 py-3 w-full rounded-2xl border border-gray-200 
        bg-white shadow-sm focus:border-pink-400 focus:ring-2 
        focus:ring-pink-200 transition-all"
    />
  );
});