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
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { deleteBillingItemCharge, GetBillingItem } from "@/lib/billing";
import { Toast } from "primereact/toast";

interface InvestigationItem {
  BillingItemChargeId: number;
  BillingItemName: string;
  code?: string;
  price?: number;
  Hospital?: { HospitalName?: string };
  Specialization?: { SpecializationName?: string };
  maxDiscountPercent?: number;
  maxDiscountInr?: number;
  description?: string;
  chargeType?: { BillItemTypeName?: string };
  isActive?: boolean;
}

interface InvestigationTableProps {
  onEdit?: (item: InvestigationItem) => void;
  refreshTrigger?: number;
}

export default function InvestigationTable({
  onEdit,
  refreshTrigger,
}: InvestigationTableProps) {
  const [data, setData] = useState<InvestigationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const toast = useRef<Toast>(null);

  const [deleteTarget, setDeleteTarget] = useState<InvestigationItem | null>(
    null
  );
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const limit = 10;
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState<any>({});

  // ✅ Fetch paginated investigations
  const fetchInvestigations = async (pageNumber = 1) => {
    try {
      setLoading(true);
      const res = await GetBillingItem({
        chargeType: "investigation",
        page: pageNumber,
        limit,
      });
      console.log("Fetched Investigations:", res);
      setData(res.data || []);
      setMeta(res.meta || {});
    } catch (error) {
      console.error("❌ Failed to fetch investigations:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvestigations(page);
  }, [page, refreshTrigger]);

  return (
    <>
      <Toast ref={toast} />

      <div className="overflow-auto bg-white rounded-xl shadow-md border border-gray-200 p-3">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-100">
              <TableHead className="text-center w-[40px]">S No.</TableHead>
              <TableHead>Investigation Name</TableHead>
              <TableHead>Specialization</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Cost (₹)</TableHead>
              <TableHead>Hospital</TableHead>
              <TableHead>Max Discount</TableHead>
              <TableHead>Notes</TableHead>
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
                  No investigations found.
                </TableCell>
              </TableRow>
            ) : (
              data.map((item, idx) => (
                <TableRow
                  key={item.BillingItemChargeId}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <TableCell className="text-center">
                    {(meta.page - 1) * limit + idx + 1}
                  </TableCell>
                  <TableCell>{item.BillingItemName}</TableCell>
                  <TableCell>
                    {item.Specialization?.SpecializationName || "—"}
                  </TableCell>
                  <TableCell>{item.code || "—"}</TableCell>
                  <TableCell>₹{item.price ?? 0}</TableCell>
                  <TableCell>{item.Hospital?.HospitalName || "—"}</TableCell>
                  <TableCell>
                    {item.maxDiscountPercent
                      ? `${item.maxDiscountPercent}%`
                      : item.maxDiscountInr
                      ? `₹${item.maxDiscountInr}`
                      : "—"}
                  </TableCell>
                  <TableCell>{item.description || "—"}</TableCell>
                  <TableCell className="text-right space-x-2">
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
      </div>

      {/* 🧭 Pagination Controls */}
      {meta?.totalPages > 1 && (
        <div className="flex justify-center mt-4 space-x-2">
          <Button
            size="sm"
            variant="outline"
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Previous
          </Button>

          {[...Array(meta.totalPages)].map((_, i) => (
            <Button
              key={i}
              size="sm"
              variant={i + 1 === page ? "default" : "outline"}
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </Button>
          ))}

          <Button
            size="sm"
            variant="outline"
            disabled={page === meta.totalPages}
            onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
          >
            Next
          </Button>
        </div>
      )}

      {/* 🗑️ Delete Confirmation Dialog */}
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
                    fetchInvestigations(page); // ✅ Refresh current page
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
