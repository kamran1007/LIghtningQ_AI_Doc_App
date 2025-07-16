"use client";

import { useEffect, useState } from "react";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { useDebounce } from "@/hooks/useDebounce";
import { Spinner } from "@/components/ui/spinner";
import { useEvents } from "@/context/events-context";
import { useRouter } from "next/navigation";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTrigger,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { UserPlus, Zap, PhoneCall, Mail, MapPinHouse } from "lucide-react";
import Image from "next/image";
import { BACKEND_URL } from "@/lib/constants";
import { getSession } from "@/lib/session";
import { PatientAvatar } from "./PatientAvatar";

type Props = {
  query: string;
  onSelect: (patient: any) => void;
  onQuickAppointment: () => void;
  onRegisterNew: () => void;
};

export function PatientSearchDrawer({
  query,
  onSelect,
  onQuickAppointment,
  onRegisterNew,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [notFound, setNotFound] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false); // <--- new dialog state
  const getInitials = (firstName: string = "", lastName: string = "") => {
    return `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase();
  };

  const getColorByInitials = (initials: string) => {
    const code = initials.charCodeAt(0);
    const colors = [
      "bg-blue-100 text-blue-600",
      "bg-pink-100 text-pink-600",
      "bg-green-100 text-green-600",
      "bg-yellow-100 text-yellow-600",
      "bg-purple-100 text-purple-600",
      "bg-orange-100 text-orange-600",
      "bg-red-100 text-red-600",
      "bg-teal-100 text-teal-600",
      "bg-indigo-100 text-indigo-600",
    ];
    return colors[code % colors.length];
  };

  const debouncedQuery = useDebounce(query, 1000);
  const { setEventAddOpen } = useEvents();
  const router = useRouter();

  useEffect(() => {
    if (!debouncedQuery) {
      setResults([]);
      setNotFound(false);
      setDrawerOpen(false);
      return;
    }

    const fetchPatients = async () => {
      try {
        setLoading(true);
        const session = await getSession();
        const token = session?.accessToken;

        const res = await fetch(
          `${BACKEND_URL}/patientcare/getallpatientdetail?search=${debouncedQuery}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.status === 401) {
          console.error("Unauthorized access – check token/session.");
          return;
        }

        const Search = await res.json();
        console.log("search data", Search);
        if (Search?.return?.data?.length > 0) {
          setResults(Search?.return?.data);
          setNotFound(false);
        } else {
          setResults([]);
          setNotFound(true);
        }

        setDrawerOpen(true);
      } catch (error) {
        console.error("Error fetching patients:", error);
        setResults([]);
        setNotFound(true);
        setDrawerOpen(true);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, [debouncedQuery]);

  const handleContinue = () => {
    onRegisterNew(); // optional callback from props
    setDialogOpen(false); // close the dialog
    setDrawerOpen(false); // close the drawer
    router.push("/patientcare?openRegister=true");
  };

  const handleCancel = () => {
    setDialogOpen(false);
  };

  return (
    <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
      <DrawerContent className="p-4 space-y-4">
        {loading && (
          <Spinner className="absolute right-6 top-4 w-5 h-5 text-blue-600" />
        )}

        {results.length > 0 ? (
          <div>
            <h2 className="text-lg font-semibold text-gray-700 mb-2 font-sans">
              Matching Patients
            </h2>
            <div className="space-y-2 max-h-[60vh] overflow-y-auto no-scrollbar cursor-pointer">
              {results.map((p) => {
                const address = [
                  p.addressLine1,
                  p.addressLine2,
                  p.area,
                  p.city,
                  p.postalCode,
                  p.state,
                  p.country,
                ]
                  .filter(Boolean)
                  .join(", ");

                const isBase64 = p.profileImageUrl?.startsWith("data:image");
                const isAbsolute = p.profileImageUrl?.startsWith("http");
                const imageUrl =
                  isBase64 || isAbsolute
                    ? p.profileImageUrl
                    : p.profileImageUrl
                      ? `${BACKEND_URL}${p.profileImageUrl}`
                      : null;

                const initials = getInitials(p.firstName, p.lastName);
                const colorClass = getColorByInitials(initials);

                // State to handle image load error
                // const [imageError, setImageError] = useState(false);

                return (
                  <div
                    key={p.PatientId}
                    onClick={() => {
                      onSelect(p);
                      setDrawerOpen(false);
                    }}
                    className="p-4 border rounded-lg shadow-sm hover:shadow-md bg-white hover:bg-[#EFFFFD] cursor-pointer transition-all px-8 border-gray-300"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-base font-semibold text-gray-800">
                          {p.firstName} {p.lastName}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          MR No:{" "}
                          <span className="font-medium text-gray-700">
                            {p.Patient_Medical_Record_No}
                          </span>
                        </p>
                      </div>

                      <PatientAvatar
                        src={imageUrl}
                        alt={p.firstName}
                        initials={initials}
                        colorClass={colorClass}
                      />
                    </div>

                    {/* Contact + Address */}
                    <div className="mt-2 text-sm text-gray-600 flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <PhoneCall className="w-4 h-4 text-gray-500" />
                        <span>{p.mobile}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-500" />
                        <span>{p.email || "—"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPinHouse className="w-4 h-4 text-gray-500" />
                        <span className="truncate w-[calc(100%-2rem)]">
                          {address || "—"}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="text-center space-y-4">
            <div className="flex flex-col items-center justify-center text-center space-y-4">
              <Image
                src="/undraw_no-data_ig65.svg" // Make sure this file exists in /public
                alt="No matching patient"
                width={200}
                height={200}
              />
              <p className="text-sm text-gray-600">
                No matching patient found.
              </p>
            </div>
            {/* Register New Patient Dialog */}
            <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <AlertDialogTrigger asChild>
                <Button className="w-full cursor-pointer">
                  {" "}
                  <UserPlus className="w-4 h-4" />
                  Register New Patient
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogTitle>Register Patient</AlertDialogTitle>
                <p className="text-sm text-gray-600 mt-2">
                  Redirecting to patient registration screen...
                </p>

                <div className="flex justify-end gap-2 mt-6">
                  <Button variant="outline" onClick={handleCancel}>
                    Cancel
                  </Button>
                  <Button onClick={handleContinue}>Continue</Button>
                </div>
              </AlertDialogContent>
            </AlertDialog>

            {/* Quick Appointment */}
            <Button
              variant="outline"
              className="w-full  cursor-pointer"
              onClick={() => {
                onQuickAppointment();
                setDrawerOpen(false);
              }}
            >
              <Zap className="w-4 h-4 text-yellow-500 fill-yellow-400 drop-shadow" />
              Quick Appointment
            </Button>
          </div>
        )}
      </DrawerContent>
    </Drawer>
  );
}
