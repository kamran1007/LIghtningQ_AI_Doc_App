"use client";

import { useEffect, useRef, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { deleteBillingItemCharge, GetBillingItem } from "@/lib/billing";
import { Toast } from "primereact/toast";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { motion } from "framer-motion";

interface ConsultationItem {
  BillingItemChargeId: number;
  BillingItemName: string;
  code?: string;
  walkinPrice?: number;
  telePrice?: number;
  fastTrackCharges?: number;
  numberOfFollowups?: number;
  followupValidity?: number;
  hospital?: { HospitalName?: string };
  doctor?: { firstName: string; lastName: string };
  chargeType?: { BillItemTypeName?: string };
  isActive?: boolean;
}

interface ConsultationTableProps {
  onEdit?: (item: ConsultationItem) => void;
  refreshTrigger?: number;
}

export default function ConsultationTable({
  onEdit,
  refreshTrigger,
}: ConsultationTableProps) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState<any>({});
  const toast = useRef<Toast>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<any>(null);
  const limit = 10;

  // ✅ Fetch paginated consultations
  const fetchConsultations = async (pageNumber = 1) => {
  try {
    setLoading(true);
    const res = await GetBillingItem({
      chargeType: "consultation",
      page: pageNumber,
      limit,
    });
    setData(res.data);
    setMeta(res.meta);
  } catch (error) {
    console.error("❌ Failed to fetch consultations:", error);
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  fetchConsultations(page);
}, [page, refreshTrigger]);

  return (
    <>
      <Toast ref={toast} />

      <div className="overflow-auto bg-white rounded-xl shadow-md border border-gray-200 p-3">
        <Table className="min-w-full text-sm">
          <TableHeader>
            <TableRow className="bg-gray-100">
              <TableHead className="text-center w-[50px]">S No.</TableHead>
              <TableHead>Doctor Name</TableHead>
              <TableHead>Appointment Type</TableHead>
              <TableHead>Consultation Name</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Charges</TableHead>
              <TableHead>Followups</TableHead>
              <TableHead>Validity</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-4">
                  Loading...
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-4">
                  No consultation charges found.
                </TableCell>
              </TableRow>
            ) : (
              data.map((item, idx) => (
                <TableRow
                  key={item.BillingItemChargeId}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <TableCell className="text-center">
                    {(meta.page - 1) * meta.limit + idx + 1}
                  </TableCell>
                  <TableCell className="capitalize">
                    {item.User_BillingItemCharge_doctorIdToUser
                      ? `${item.User_BillingItemCharge_doctorIdToUser.firstName} ${item.User_BillingItemCharge_doctorIdToUser.lastName}`
                      : "—"}
                  </TableCell>
                  <TableCell>
                    {item.chargeType?.BillItemTypeName || "—"}
                  </TableCell>
                  <TableCell>{item.BillingItemName}</TableCell>
                  <TableCell>{item.code || "-"}</TableCell>

                  <TableCell>
                    <div className="flex flex-col text-xs text-gray-700 space-y-1">
                      <span>
                        <strong>Video Fee:</strong> ₹{item.telePrice ?? 0}
                      </span>
                      <span>
                        <strong>FastTrack:</strong> ₹
                        {item.fastTrackCharges ?? 0}
                      </span>
                      <span>
                        <strong>Walk-in:</strong> ₹{item.walkinPrice ?? 0}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell>{item.numberOfFollowups ?? 0}</TableCell>
                  <TableCell>{item.followupValidity ?? 0}</TableCell>

                  <TableCell className="text-right space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit?.(item)}
                    >
                      <Pencil className="w-4 h-4 text-blue-500" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setDeleteTarget(item);
                        setShowDeleteDialog(true);
                      }}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        {meta?.totalPages > 1 && (
          <div className="flex justify-center mt-4 space-x-2">
            <Button
              size="sm"
              variant="outline"
              disabled={meta.page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </Button>

            {[...Array(meta.totalPages)].map((_, i) => (
              <Button
                key={i}
                size="sm"
                variant={i + 1 === meta.page ? "default" : "outline"}
                onClick={() => setPage(i + 1)}
              >
                {i + 1}
              </Button>
            ))}

            <Button
              size="sm"
              variant="outline"
              disabled={meta.page === meta.totalPages}
              onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
            >
              Next
            </Button>
          </div>
        )}
      </div>

      {/* 🗑️ Delete Confirmation */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="sm:max-w-md bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <AlertDialogHeader>
              <AlertDialogTitle className="text-lg font-semibold text-gray-800">
                Confirm Deletion
              </AlertDialogTitle>
              <AlertDialogDescription className="text-gray-600 text-sm">
                Are you sure you want to delete{" "}
                <span className="font-semibold text-gray-900">
                  {deleteTarget?.BillingItemName}
                </span>
                ? This will mark the record as inactive.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter className="flex justify-end gap-2 mt-6">
              <AlertDialogCancel
                className="border border-gray-300 text-gray-700 rounded-full px-4 py-1.5 hover:bg-gray-100"
                onClick={() => setShowDeleteDialog(false)}
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                className="bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-full px-5 py-1.5 hover:opacity-90 shadow-md"
                onClick={async () => {
                  if (!deleteTarget) return;
                  try {
                    await deleteBillingItemCharge(
                      deleteTarget.BillingItemChargeId
                    );
                    toast.current?.show({
                      severity: "success",
                      summary: "Deleted Successfully",
                      life: 2000,
                    });
                    fetchConsultations(page); // refresh current page
                  } catch (error: any) {
                    toast.current?.show({
                      severity: "error",
                      summary: "Delete Failed",
                      detail: error.message || "Unable to delete item",
                      life: 2500,
                    });
                  } finally {
                    setShowDeleteDialog(false);
                    setDeleteTarget(null);
                  }
                }}
              >
                Yes, Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </motion.div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
