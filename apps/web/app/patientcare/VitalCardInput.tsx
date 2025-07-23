import { Input } from "@/components/ui/input";

export const VitalCardInput = ({
  icon,
  label,
  value,
  onChange,
  unit,
  name,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  unit?: string;
  name: string;
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-center gap-3 p-4 rounded-2xl bg-white/70 shadow-lg border border-gray-200 backdrop-blur-sm transition-all hover:shadow-xl hover:border-teal-300 w-full max-w-md">
      <div className="flex items-center justify-center bg-gradient-to-br from-teal-100 to-cyan-100 text-teal-600 rounded-4xl w-10 h-10 shadow-inner border border-white/50">
        {icon}
      </div>

      <div className="flex flex-col w-full">
        <label className="text-sm text-gray-600 mb-1 font-medium">{label}</label>
        <div className="flex items-center gap-2 w-full">
          <Input
            name={name}
            value={value}
            onChange={onChange}
            placeholder="Enter value"
            className="w-full h-10 rounded-md border border-gray-300 px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-teal-300 focus-visible:outline-none transition-all"
          />
          {unit && <span className="text-sm text-gray-500 font-medium">{unit}</span>}
        </div>
      </div>
    </div>
  );
};
