import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Mail,
  Phone,
  Calendar,
  MapPin,
  User,
  Tag,
  Languages,
  AlertCircle,
  Droplets,
  WineOff,
} from "lucide-react";
import { ActionButtons } from "./ActionButtons";

export default function DemographicsCard({ patient }: { patient: any }) {
  return (
    <ScrollArea className="h-full pr-2">
      <Card className="rounded-2xl shadow-lg border border-zinc-200 dark:border-zinc-800">
        <CardContent className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 flex-wrap">
            {/* Avatar + Name */}
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-blue-100 text-blue-800 w-14 h-14 flex items-center justify-center text-xl font-semibold uppercase">
                {patient.firstName?.[0]}
                {patient.lastName?.[0]}
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
                  {patient?.prefix} {patient.firstName} {patient.lastName}
                </h2>
                <p className="text-muted-foreground text-sm">
                  MRN: {patient.Patient_Medical_Record_No}
                </p>
              </div>
            </div>

            {/* Action Buttons on the right (scrolls normally) */}
            <div>
              <ActionButtons />
            </div>
          </div>

          <Separator />

          {/* Personal Info */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <InfoItem
              label="Gender"
              value={patient.gender}
              icon={<User className="w-4 h-4" />}
            />
            <InfoItem
              label="Date of Birth"
              value={formatDate(patient.dateOfBirth)}
              icon={<Calendar className="w-4 h-4" />}
            />
            <InfoItem
              label="Blood Group"
              value={patient.bloodGroup}
              icon={<Droplets className="w-4 h-4" />}
            />
          </div>

          {/* Contact Info */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <InfoItem
              label="Mobile"
              value={patient.mobile}
              icon={<Phone className="w-4 h-4" />}
            />
            <InfoItem
              label="Alternate Contact"
              value={patient.altContactNumber || "—"}
              icon={<Phone className="w-4 h-4" />}
            />
            <InfoItem
              label="Email"
              value={patient.email}
              icon={<Mail className="w-4 h-4" />}
            />
          </div>

          {/* Address */}
          <div className="space-y-1">
            <p className="text-sm font-medium flex items-center gap-1 text-muted-foreground">
              <MapPin className="w-4 h-4" /> Address
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {patient.addressLine1}, {patient.addressLine2}, {patient.landmark}
              , {patient.area}, {patient.city}, {patient.state} -{" "}
              {patient.postalCode}, {patient.country}
            </p>
          </div>

          <Separator />

          {/* Tags & Allergies */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-b-gray-300">
            <TagSection
              label="Patient Tags"
              data={patient.TagPatient}
              icon={<Tag className="w-4 h-4" />}
            />
            <TagSection
              label="Languages"
              data={patient.languages}
              icon={<Languages className="w-4 h-4" />}
            />
            <TagSection
              label="Allergies"
              data={patient.allergies}
              icon={<WineOff className="w-4 h-4" />}
            />
            <TagSection
              label="Medical History"
              data={patient.medicalHistory}
              icon={<AlertCircle className="w-4 h-4" />}
            />
          </div>

          {/* Emergency Info */}
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">
              Emergency Contact
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Name: {patient.emergencyName || "—"} <br />
              Relation: {patient.emergencyRelation || "—"} <br />
              Contact: {patient.emergencyContact || "—"}
            </p>
          </div>

          {/* Kin Info */}
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">
              Kin Details
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Name: {patient.kinName || "—"} <br />
              Relation: {patient.kinRelation || "—"} <br />
              Contact: {patient.kinContact || "—"}
            </p>
          </div>
        </CardContent>
      </Card>
    </ScrollArea>
  );
}

// Utility Components
function InfoItem({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <p className="text-sm font-medium text-muted-foreground flex items-center gap-1 border-b-gray-300">
        {icon} {label}
      </p>
      <p className="text-sm text-gray-800 dark:text-gray-200 border-b-gray-300">
        {value || "—"}
      </p>
    </div>
  );
}

function TagSection({
  label,
  data,
  icon,
}: {
  label: string;
  data: any[];
  icon: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-sm font-medium flex items-center gap-1 text-muted-foreground mb-1">
        {icon} {label}
      </p>
      <div className="flex flex-wrap gap-2">
        {data?.length > 0 ? (
          data.map((item: any, idx: number) => (
            <Badge
              key={idx}
              variant="outline"
              className="rounded-full border border-gray-300 bg-white text-gray-700 shadow-sm hover:shadow-md transition-all duration-200 px-3 py-1 text-sm"
            >
              {item?.AllergyName ||
                item?.LanguageName ||
                item?.MedicalHistoryName ||
                item?.TagPatientName}
            </Badge>
          ))
        ) : (
          <p className="text-sm text-gray-500">None</p>
        )}
      </div>
    </div>
  );
}

function formatDate(dateString: string | null) {
  if (!dateString) return "—";
  const d = new Date(dateString);
  return d.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
