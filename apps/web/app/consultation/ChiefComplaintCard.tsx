import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Stethoscope, Mic, MicOff } from "lucide-react";
import CreatableSelect from "react-select/creatable";
import {
  AddUpdatechiefComplaint,
  FetchChiefComplaint,
} from "@/lib/consultation"; // adjust path as needed
import { getProfile } from "@/lib/action";

interface ComplaintOption {
  label: string;
  value: string;
  id: number;
}

export const ChiefComplaintCard = ({
  selectedChiefComplaints,
  setSelectedChiefComplaints, // array of { id, label, value }
  inputValue,
  setInputValue,
  complaintText,
  setComplaintText,
  handleChiefComplaintMicClick,
  listening,
  customsStyles,
}) => {
  const [chiefComplaintOptions, setChiefComplaintOptions] = useState<
    ComplaintOption[]
  >([]);
    const [userprofiledata, setUserprofiledata] = useState<any>(null);
  
  // console.log("ChiefComplaintCard rendered", chiefComplaintOptions);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const resp = await getProfile();
        setUserprofiledata(resp);
        const response = await FetchChiefComplaint();
        const transformed = response?.return.map((item: any) => ({
          label: item.ChiefComplainTagName,
          value: item.ChiefComplainTagName,
          ChiefComplaintTagId: item.ChiefComplaintTagId,
        }));

        setChiefComplaintOptions(transformed);
      } catch (error) {
        console.error("Failed to fetch chief complaints:", error);
      }
    };

    fetchData();
  }, []);
  const handleCreateOption = async (inputValue: string) => {
    const newTag = {
      ChiefComplainTagName: inputValue,
     specializationId: userprofiledata?.user?.SpecializationId  || 0, // Use specializationId from user profile

    };

    try {
      const result = await AddUpdatechiefComplaint(newTag);

      const newOption = {
        label: result?.ChiefComplainTagName || inputValue,
        value: result?.ChiefComplainTagName || inputValue,
        ChiefComplaintTagId: result?.ChiefComplaintTagId || 0,
      };

      // Add to master options
      setChiefComplaintOptions((prev) => [...prev, newOption]);

      // Add to selected
      setSelectedChiefComplaints((prev) => [...prev, newOption]);
    } catch (error) {
      console.error("Error creating chief complaint:", error);
    }
  };

  const handleChange = (selected: any) => {
  const updated = selected.map((s: any) => {
    const found = chiefComplaintOptions.find((opt) => opt.value === s.value);
    return {
      label: s?.label,
      value: s?.value,
      ChiefComplaintTagId: found ? found?.ChiefComplaintTagId : 0, // fallback if not matched
    };
  });

  setSelectedChiefComplaints(updated);
};

  return (
    <Card className="p-4 rounded-xl shadow-sm border bg-white border-gray-300 hover:shadow-xl hover:border-blue-300">
      <div className="flex items-center gap-2 mb-2 font-semibold text-gray-800">
        <Stethoscope size={18} className="text-blue-500" />
        Chief Complaint
      </div>

      <CreatableSelect
        isMulti
        options={chiefComplaintOptions}
        styles={customsStyles}
        value={(selectedChiefComplaints || []).map((c) => ({
          label: c?.label,
          value: c?.value,
        }))}
        onChange={handleChange}
        inputValue={inputValue}
        onInputChange={(val) => setInputValue(val)}
        onCreateOption={handleCreateOption}
        placeholder="Type or select chief complaint..."
        classNamePrefix="react-select"
      />

      <div className="relative flex items-center gap-2 py-1 mt-2">
        <textarea
          value={complaintText}
          onChange={(e) => setComplaintText(e.target.value)}
          placeholder="Enter or speak your complaint..."
          className="text-sm px-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300 pr-10"
          name="notes"
          rows={6}
        />
        <button
          type="button"
          onClick={handleChiefComplaintMicClick}
          className={`absolute right-2 bottom-4 p-2 rounded-full transition ${
            listening
              ? "bg-red-100 hover:bg-red-200"
              : "bg-blue-100 hover:bg-blue-200"
          }`}
        >
          {listening ? (
            <MicOff className="w-5 h-5 text-red-600 animate-pulse" />
          ) : (
            <Mic className="w-5 h-5 text-[#22E0D4]" />
          )}
        </button>
      </div>

      <p className="text-xs text-gray-500">
        {listening ? "Listening..." : "Click the mic to speak"}
      </p>
    </Card>
  );
};
