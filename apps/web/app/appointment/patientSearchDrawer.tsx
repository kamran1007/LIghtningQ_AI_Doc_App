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
import { UserPlus, Zap } from "lucide-react";
import Image from "next/image";

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

    setLoading(true);
    fetch(`/api/search-patient?q=${debouncedQuery}`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.patients?.length > 0) {
          setResults(data.patients);
          setNotFound(false);
        } else {
          setResults([]);
          setNotFound(true);
        }
        setDrawerOpen(true);
      })
      .catch(() => {
        setResults([]);
        setNotFound(true);
        setDrawerOpen(true);
      })
      .finally(() => setLoading(false));
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
            <h2 className="text-lg font-semibold text-gray-700 mb-2">
              Matching Patients
            </h2>
            <ul className="divide-y">
              {results.map((p) => (
                <li
                  key={p.id}
                  className="py-2 flex justify-between items-center"
                >
                  <span>
                    {p.name} ({p.phone})
                  </span>
                  <Button
                    size="sm"
                    onClick={() => {
                      onSelect(p);
                      setDrawerOpen(false);
                    }}
                  >
                    Select
                  </Button>
                </li>
              ))}
            </ul>
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
