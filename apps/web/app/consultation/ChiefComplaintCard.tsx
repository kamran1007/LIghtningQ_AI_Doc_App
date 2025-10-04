import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Stethoscope, Mic, MicOff, MessageCirclePlus } from "lucide-react";
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
import { MultiValue, ActionMeta } from "react-select";

export const ChiefComplaintCard = ({
  disabled,
  selectedChiefComplaints,
  setSelectedChiefComplaints, // array of { id, label, value }
  inputValue,
  setInputValue,
  complaintText,
  setComplaintText,
  handleChiefComplaintMicClick,
  listening,
  customsStyles,
}: any) => {
  const [chiefComplaintOptions, setChiefComplaintOptions] = useState<
    ComplaintOption[]
  >([]);
  const [userprofiledata, setUserprofiledata] = useState<any>(null);
  const [showComplaintRemark, setShowComplaintRemark] = useState(
    !!complaintText // open if remark already exists
  );
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
      specializationId: userprofiledata?.user?.SpecializationId || 0, // Use specializationId from user profile
    };

    try {
      const result = await AddUpdatechiefComplaint(newTag);

      const newOption: ComplaintOption = {
        label: result?.ChiefComplainTagName || inputValue,
        value: result?.ChiefComplainTagName || inputValue,
        id: result?.ChiefComplaintTagId || 0, // ✅ use "id"
      };

      // Add to master options
      setChiefComplaintOptions((prev) => [...prev, newOption]);

      // Add to selected
      setSelectedChiefComplaints((prev: any) => [...prev, newOption]);
    } catch (error) {
      console.error("Error creating chief complaint:", error);
    }
  };

  //
  const handleChange = (
    selected: MultiValue<ComplaintOption>,
    _actionMeta: ActionMeta<ComplaintOption>
  ) => {
    const updated: ComplaintOption[] = selected.map((s) => {
      const found = chiefComplaintOptions.find((opt) => opt.value === s.value);
      return {
        label: s.label,
        value: s.value,
        id: found ? found.id : 0,
      };
    });

    setSelectedChiefComplaints(updated);
  };

  useEffect(() => {
    if (complaintText && complaintText.trim() !== "") {
      setShowComplaintRemark(true);
    }
  }, [complaintText]);

  return (
    <Card className="p-4 rounded-xl shadow-sm border bg-white border-gray-300 hover:shadow-xl hover:border-blue-300">
      <div className="flex items-center gap-2 mb-2 font-semibold text-gray-800">
        <Stethoscope size={18} className="text-blue-500" />
        Chief Complaint
      </div>

      <CreatableSelect
        isMulti
        isDisabled={disabled}
        options={chiefComplaintOptions}
        styles={customsStyles}
        value={(selectedChiefComplaints || []).map(
          (c: { label: any; value: any }) => ({
            label: c?.label,
            value: c?.value,
          })
        )}
        onChange={handleChange}
        inputValue={inputValue}
        onInputChange={(val) => setInputValue(val)}
        onCreateOption={handleCreateOption}
        placeholder="Type or select chief complaint..."
        classNamePrefix="react-select"
      />

      {/* Add Remark Section */}
      <div className="mt-3">
        {!showComplaintRemark ? (
          <button
            type="button"
            onClick={() => setShowComplaintRemark(true)}
            className="mt-2 text-xs text-blue-400 hover:underline flex items-center gap-1"
          >
            <MessageCirclePlus className="w-4 h-4" />
            <span>Add Chief Complaint Remark</span>
          </button>
        ) : (
          <div className="relative flex flex-col gap-2">
            {/* Textarea */}
            <div className="relative">
              <textarea
                value={complaintText}
                disabled={disabled}
                onChange={(e) => setComplaintText(e.target.value)}
                placeholder="Enter or speak your complaint..."
                className="mt-1 pr-10 w-full resize-none rounded-2xl border-2 border-blue-200 hover:border-blue-300 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all duration-300 no-scrollbar bg-gradient-to-br from-blue-50/50 to-sky-50/30 placeholder:text-gray-400 placeholder:font-light text-gray-700 leading-relaxed tracking-wide shadow-sm hover:shadow-md focus:shadow-lg backdrop-blur-sm p-4"
                rows={3}
                style={{
                  fontFamily:
                    '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                  fontSize: "14px",
                  lineHeight: "1.6",
                  letterSpacing: "0.025em",
                  minHeight: "90px",
                }}
              />
              <button
                type="button"
                disabled={disabled}
                onClick={handleChiefComplaintMicClick}
                className={`absolute bottom-2 right-2 p-1 rounded-full transition ${
                  listening
                    ? "bg-red-100 hover:bg-red-200"
                    : "bg-blue-100 hover:bg-blue-200"
                }`}
              >
                {listening ? (
                  <MicOff className="w-5 h-5 text-red-600 animate-pulse" />
                ) : (
                  <Mic className="w-5 h-5 text-blue-400 shadow-xl hover:shadow-2xl" />
                )}
              </button>
            </div>

            <p className="text-xs text-gray-500">
              {listening ? "Listening..." : "Click the mic to speak"}
            </p>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                disabled={disabled}
                type="button"
                onClick={() => setComplaintText("")}
                className="px-2 py-1 text-xs mouse-pointer bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
              >
                Clear
              </button>
              <button
                type="button"
                disabled={disabled}
                onClick={() => {
                  setComplaintText("");
                  setShowComplaintRemark(false);
                }}
                className="px-2 py-1 text-xs bg-red-100 text-red-600 rounded hover:bg-red-200"
              >
                Remove
              </button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
