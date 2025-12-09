"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

import {
  X,
  Loader2Icon,
  ChevronDown,
  ChevronRight,
  User,
  Phone,
  CalendarClock,
  Mars,
  Venus,
  Clipboard,
  Search,
  CreditCard,
  IndianRupee,
  PlusCircle,
  Receipt,
  Building2,
  Calendar,
  FileText,
  Building,
  Banknote,
  SquarePen,
  Printer,
  Trash2,
  UserRoundCheck,
  TicketX,
  NotepadTextDashed,
  SquareBottomDashedScissors,
} from "lucide-react";
import { User as HospitalUser } from "app/admin/hospitaluserlist";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  addUpdateAccessRight,
  fetchAllAccessRightModulesSubmodules,
  getRolePermissions,
} from "@/lib/admin";
import { FetchHospital } from "@/lib/dashboard";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useAppDispatch } from "@/store/hooks";
import { RootState } from "@/store";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  addupdatePatientPackageUsage,
  addupdatePatientsyncPatientPackageUsage,
  CancelBill,
  createUpdatePatientBill,
  getBillingByPatient,
  GetBillingItem,
  getPatientPackageUsage,
} from "@/lib/billing";
import { Toast } from "primereact/toast";
import Lottie from "lottie-react";
import PaymentSuccessAnimation from "@/assets/Payment Success.json";
import { generateBillPDF } from "@/utils/generateBillPDF";
import BillingItemSkeleton from "@/components/ui/skeletonloader/BillingItemSkeleton";

// ---- Helpers ----

export interface User {
  UserId: number;
  roleId: number;
  organizationId: number; // ✅ add this
  firstName: string;
  lastName: string;
  email: string;
  AdminAccess?: {
    hospital: {
      HospitalId: number;
      HospitalName: string;
    };
  }[];
}

interface BillingsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patient: User | null;
  appointment?: any;
  onOpenBillingForEdit?: (bill: any) => void;
}

interface BillingItem {
  BillingItemChargeId: number;
  BillingItemName: string;
  chargeType?: { BillItemTypeName?: string };
  price?: number;
  walkinPrice?: number;
  telePrice?: number;
  fastTrackCharges?: number;
  selectedChargeType?: string;
  fromAdvised?: boolean;
  subCategoryName?: string;
  billingItemCharge?: string;
  chargeData?: any;
}

interface PatientPackageUsage {
  PatientPackageUsageId: number;
  patientId: number;
  appointmentId?: number;
  consultationId?: number;
  status?: string;

  IsFastTrack: boolean;
  IsFreeFollowUp: boolean;

  billingItemChargeId: number;

  billingItemCharge?: {
    BillingItemChargeId: number;
    BillingItemName: string;
    price?: number;
  };
}

const Billing: React.FC<BillingsProps> = ({
  open,
  onOpenChange,
  patient,
  appointment,
  onOpenBillingForEdit,
}) => {
  const [selectedHospitalId, setSelectedHospitalId] = useState<number | null>(
    null
  );

  const [userHospital, setUserHospital] = useState<any>(null);
  const dispatch = useAppDispatch();
  const [searchQuery, setSearchQuery] = useState("");

  const [items, setItems] = useState<BillingItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [chargeType, setChargeType] = useState<string | undefined>();
  const [meta, setMeta] = useState<any>({});
  const [page, setPage] = useState(1);
  const limit = 10;
  const toast = useRef<Toast>(null);

  const [previousBills, setPreviousBills] = useState<any[]>([]);
  const [expandedBillId, setExpandedBillId] = useState<number | null>(null);
  const [loadingBills, setLoadingBills] = useState(false);
  const [Hasbilldone, setHasbilldone] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingBill, setDeletingBill] = useState<any | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [showClearDueModal, setShowClearDueModal] = useState(false);
  const [dueBill, setDueBill] = useState<any | null>(null);
  const [clearDueLoading, setClearDueLoading] = useState(false);
  const [previousPaidAmount, setPreviousPaidAmount] = useState(0);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isBillingSubmitting, setIsBillingSubmitting] = useState(false);
  const [selectedAdvisedIds, setSelectedAdvisedIds] = useState<number[]>([]);

  // ---- Billing Summary States ----

  // ---- Editing bill id ----
  const [editingBillingId, setEditingBillingId] = useState<number | null>(null);

  // Payment form for clearing due
  const [clearPaymentMode, setClearPaymentMode] = useState<
    "Cash" | "Card" | "UPI" | "Cheque" | "Other"
  >("Cash");
  const [clearPaymentAmount, setClearPaymentAmount] = useState<number>(0);
  const [clearPaymentReference, setClearPaymentReference] =
    useState<string>("");
  const [clearPaymentRemark, setClearPaymentRemark] = useState<string>("");

  const [paymentDetails, setPaymentDetails] = useState({
    Cash: 0,
    Card: 0,
    Cheque: 0,
    Other: 0,
  });

  const [billDateTime, setBillDateTime] = useState<string>("");
  // 🟢 For storing the bill user selected for due payment
  const [duePaymentBill, setDuePaymentBill] = useState<any>(null);

  // 🟢 For showing due payment modal
  const [showDuePaymentModal, setShowDuePaymentModal] = useState(false);

  useEffect(() => {
    const now = new Date();
    const formatted = now.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    setBillDateTime(formatted);
  }, [open]); // update every time modal opens

  const {
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = useForm();

  const hospitalSelection = useSelector(
    (state: any) => state.hospitalSelection?.selectedHospital
  );
  useEffect(() => {
    if (hospitalSelection) {
      // 🩺 hospitalSelection may have HospitalId or hospitalId — handle both
      const selectedId =
        hospitalSelection?.HospitalId || hospitalSelection?.hospitalId;
      setUserHospital(hospitalSelection);
      setSelectedHospitalId(selectedId);
      setValue("hospitalId", selectedId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hospitalSelection, setValue]);

  const isFirstLoad = useRef(true);

  // Get Access Right update permission from Redux
  const accessRights = useSelector(
    (state: RootState) => state.hospitalAccessRight.data
  );

  const adminModule = accessRights?.find((m: any) => m.ModuleName === "Admin");
  const accessRightSub = adminModule?.Submodules?.find(
    (s: any) => s.SubModuleName === "Access Right"
  );
  const canUpdateAccessRight =
    accessRightSub?.Permissions?.[0]?.CanUpdate ?? false;

  function calculateAgeWithSex(dob: string, gender?: string): string {
    if (!dob) return "-";

    const birthDate = new Date(dob);
    const today = new Date();

    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();

    // adjust if birthday hasn’t occurred this year
    if (today.getDate() < birthDate.getDate()) {
      months -= 1;
    }

    if (months < 0) {
      years -= 1;
      months += 12;
    }

    const ageString =
      years > 0 ? `${years}Y${months > 0 ? `,${months}M` : ""}` : `${months}M`;

    const genderShort =
      gender?.toLowerCase() === "male"
        ? "M"
        : gender?.toLowerCase() === "female"
          ? "F"
          : gender?.charAt(0)?.toUpperCase() || "";

    return `${ageString}${genderShort ? ` & ${genderShort}` : ""}`;
  }

  // ✅ Fetch billing items
  const fetchBillingItems = async (pageNumber = 1, type?: string) => {
    try {
      setLoading(true);

      const query: Record<string, any> = {
        page: pageNumber,
        limit,
      };

      // ✅ Only add chargeType if not "all categories"
      if (type && type !== "all categories") {
        query.chargeType = type;
      }

      const res = await GetBillingItem(query);

      setItems(res.data || []);
      setMeta(res.meta || {});
    } catch (error) {
      console.error("❌ Failed to fetch billing items:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch whenever page or chargeType changes
  useEffect(() => {
    fetchBillingItems(page, chargeType);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, chargeType]);

  useEffect(() => {
    if (open && appointment?.PatientId) {
      loadPreviousBills(appointment?.PatientId);
    }
  }, [open]);

  const loadPreviousBills = async (patientId: number) => {
    try {
      setLoadingBills(true);
      const res = await getBillingByPatient(patientId);
      setPreviousBills(res.data || []);
    } catch (e) {
      console.error("Billing history load error", e);
    } finally {
      setLoadingBills(false);
    }
  };

  // ----------------- selected billing rows & operations -----------------
  const [selectedItems, setSelectedItems] = useState<any[]>([]);

  const getSubCategory = (item: any) => {
    return (
      item.SubCategoryName ||
      item.subCategory ||
      item.categoryName ||
      item.chargeMode ||
      item.typeName ||
      item.ModeName ||
      item.AppointmentMode ||
      null
    );
  };

  // const handleAddBillingItem = (item: BillingItem) => {
  //   if (!item) {
  //     console.warn("⚠️ Tried to add undefined item");
  //     return;
  //   }

  //   const id =
  //     item.BillingItemChargeId ||
  //     (item as any).billingItemChargeId ||
  //     (item as any).BillingItemId ||
  //     Math.random().toString(36).substring(2, 9);

  //   const selectedType = item.selectedChargeType || "General";
  //   const uniqueKey = `${id}-${selectedType}`;

  //   let isDuplicate = false;
  //   let autoDiscountAmt = 0;
  //   let autoDiscountType: "flat" | "percent" = "flat";
  //   let autoDiscountValue = 0;

  //   if (item.fromAdvised) {
  //     const charge = item.billingItemCharge || item.chargeData;

  //     const percent = Number(charge?.maxDiscountPercent || 0);
  //     const flat = Number(charge?.maxDiscountInr || 0);

  //     autoDiscountType = percent > 0 ? "percent" : "flat";
  //     autoDiscountValue = percent > 0 ? percent : flat;

  //     const base = (item.price || 0) * 1;

  //     autoDiscountAmt =
  //       autoDiscountType === "percent"
  //         ? (base * autoDiscountValue) / 100
  //         : autoDiscountValue;
  //   }

  //   setSelectedItems((prev) => {
  //     const exists = prev.some((i) => i.uniqueKey === uniqueKey);

  //     if (exists) {
  //       isDuplicate = true;
  //       return prev;
  //     }

  //     const newItem = {
  //       ...item,
  //       BillingItemChargeId: id,
  //       selectedChargeType: selectedType,
  //       uniqueKey,

  //       // ⭐ FIXED: THIS IS THE KEY!!!!
  //       subCategoryName: selectedType, // Now -> Walk-in / Teleconsultation / FastTrack

  //       price: item.price || (item as any).Price || 0,
  //       units: 1,

  //       // discount: 0,
  //       // discountType: "flat",
  //       // discountValue: 0,
  //       // ✅ AUTO-APPLIED DISCOUNT
  //       discount: autoDiscountAmt,
  //       discountType: autoDiscountType,
  //       discountValue: autoDiscountValue,
  //       gst: 0,
  //       gstType: "flat",
  //       gstValue: 0,
  //       received: 0,
  //     };

  //     console.log("✅ Adding to bill:", newItem);
  //     return [...prev, newItem];
  //   });

  //   if (isDuplicate) {
  //     toast.current?.show({
  //       severity: "info",
  //       summary: "Item already added!",
  //     });
  //   } else {
  //     toast.current?.show({
  //       severity: "success",
  //       summary: `Added: ${item.BillingItemName}`,
  //     });
  //   }
  // };

  const handleAddBillingItem = (item: BillingItem) => {
    if (!item) return;

    const id =
      item.BillingItemChargeId ||
      (item as any).billingItemChargeId ||
      Math.random().toString(36).substring(2, 9);

    const selectedType = item.selectedChargeType || "General";
    const uniqueKey = `${id}-${selectedType}`;

    const charge = item.billingItemCharge || item.chargeData || item;

    // -------------------------------
    // PRICE FIX
    // -------------------------------
    let basePrice = 0;
    if (charge.appointmentTypeId === 1 || charge.appointmentTypeId === 3) {
      basePrice = Number(charge.walkinPrice || 0);
    } else if (charge.appointmentTypeId === 2) {
      basePrice = Number(charge.telePrice || 0);
    } else {
      basePrice = Number(item.price || charge.price || 0);
    }

    // -------------------------------
    // DISCOUNT LOGIC
    // -------------------------------
    const maxPercent = Number(charge?.maxDiscountPercent || 0);
    const maxFlat = Number(charge?.maxDiscountInr || 0);

    let autoDiscountAmt = 0;
    let autoDiscountType: "flat" | "percent" = "flat";
    let autoDiscountValue = 0;

    if (maxPercent > 0) {
      autoDiscountType = "percent";
      autoDiscountValue = maxPercent;
      autoDiscountAmt = (basePrice * maxPercent) / 100;
    } else if (maxFlat > 0) {
      autoDiscountType = "flat";
      autoDiscountValue = maxFlat;
      autoDiscountAmt = maxFlat;
    }

    // --------------------------------
    // ❌ CHECK DUPLICATE BEFORE STATE UPDATE
    // --------------------------------
    const alreadyExists = selectedItems.some((i) => i.uniqueKey === uniqueKey);

    if (alreadyExists) {
      toast.current?.show({
        severity: "warn",
        summary: "Already Added",
        detail: `"${item.BillingItemName}" is already selected.`,
      });
      return; // stop here
    }

    // --------------------------------
    // ✅ SAFE: SHOW SUCCESS ALERT ONLY ONCE
    // --------------------------------
    toast.current?.show({
      severity: "success",
      summary: "Item Added",
      detail: `"${item.BillingItemName}" added successfully.`,
    });

    // --------------------------------
    // UPDATE STATE (NO SIDE-EFFECTS HERE)
    // --------------------------------
    setSelectedItems((prev) => [
      ...prev,
      {
        ...item,
        BillingItemChargeId: id,
        selectedChargeType: selectedType,
        uniqueKey,
        subCategoryName: selectedType,

        price: basePrice,
        units: 1,

        discount: autoDiscountAmt,
        discountType: autoDiscountType,
        discountValue: autoDiscountValue,

        gst: 0,
        gstType: "flat",
        gstValue: 0,
        received: 0,

        chargeType: charge?.chargeType,
        billingItemCharge: charge,
      },
    ]);
  };

  const updateBillingItem = (
    uniqueKey: string,
    field: string,
    value: string | number | boolean
  ) => {
    setSelectedItems((prev) =>
      prev.map((item) =>
        item.uniqueKey === uniqueKey ? { ...item, [field]: value } : item
      )
    );
  };

  // const applyDiscount = (id: number) => {
  //   const raw = prompt("Enter discount amount (flat):", "0");
  //   const discount = parseFloat(raw || "0");
  //   if (isNaN(discount)) return;
  //   updateBillingItem(id, "discount", discount);
  // };

  // const applyGST = (id: number) => {
  //   const raw = prompt("Enter GST amount (flat):", "0");
  //   const gst = parseFloat(raw || "0");
  //   if (isNaN(gst)) return;
  //   updateBillingItem(id, "gst", gst);
  // };

  // const removeBillingItem = (uniqueKey: string) => {
  //   setSelectedItems((prev) =>
  //     prev.filter((item) => item.uniqueKey !== uniqueKey)
  //   );
  // };

  const removeBillingItem = (uniqueKey: string) => {
    setSelectedItems((prev) => {
      const itemToRemove = prev.find((i) => i.uniqueKey === uniqueKey);

      // If this item is from advised items, remove its ID
      if (itemToRemove?.fromAdvised) {
        setSelectedAdvisedIds((prevIds) =>
          prevIds.filter((id) => id !== itemToRemove.BillingItemChargeId)
        );
      }

      return prev.filter((i) => i.uniqueKey !== uniqueKey);
    });
  };

  // ----------------- overall discount in summary (select + input) -----------------
  const [overallDiscountMode, setOverallDiscountMode] = useState<
    "flat" | "percent"
  >("flat");
  const [totalDiscount, setTotalDiscount] = useState<number>(0);
  const [taltalGst, setTotalGst] = useState<number>(0);
  const [overallDiscountValue, setOverallDiscountValue] = useState<number>(0);
  const [billingRemarks, setBillingRemarks] = useState<string>("");
  const [activeTab, setActiveTab] = useState("all-billing");
  const [billingactiveTab, setBillingActiveTab] = useState("billing");
  // billing | advised
  const [advisedItems, setAdvisedItems] = useState<PatientPackageUsage[]>([]);
  const [advcetemsloading, setAdvisedItemsLoading] = useState(false);

  const resetBillingForm = () => {
    setSelectedItems([]);
    setAdvisedItems([]);
    setEditingBillingId(null);
    setOverallDiscountMode("flat");
    setOverallDiscountValue(0);
    setBillingRemarks("");
    setIsEditMode(false);
    setPaymentDetails({
      Cash: 0,
      Card: 0,
      Cheque: 0,
      Other: 0,
    });
  };

  // ----------------- calculations -----------------
  const itemDiscountTotal = selectedItems.reduce(
    (sum, i) => sum + (parseFloat(i.discount || 0) || 0),
    0
  );
  const itemGstTotal = selectedItems.reduce(
    (sum, i) => sum + (parseFloat(i.gst || 0) || 0),
    0
  );
  const itemsNetBeforeOverall = selectedItems.reduce(
    (sum, i) =>
      sum + (parseFloat(i.price || 0) || 0) * (parseFloat(i.units || 0) || 0),
    0
  );

  const overallDiscountAmount = useMemo(() => {
    return overallDiscountMode === "percent"
      ? (itemsNetBeforeOverall * (overallDiscountValue || 0)) / 100
      : overallDiscountValue || 0;
  }, [overallDiscountMode, overallDiscountValue, itemsNetBeforeOverall]);

  useEffect(() => {
    console.log("Overall Discount Amount:", overallDiscountAmount);
  }, [overallDiscountAmount]);

  const ItemWiseTotalDiacount = Number(totalDiscount);
  const ItemWiseTotalGST = Number(taltalGst);
  const totalNet = Math.max(
    0,
    itemsNetBeforeOverall -
      itemDiscountTotal -
      overallDiscountAmount +
      itemGstTotal
  );

  const totalReceived =
    (paymentDetails.Cash || 0) +
    (paymentDetails.Card || 0) +
    (paymentDetails.Cheque || 0) +
    (paymentDetails.Other || 0);

  // ❗ this is what you want
  // const totalBalance = Math.max(0, totalNet - (previousPaidAmount +  totalReceived));

  const totalBalance = Math.max(
    0,
    isEditMode
      ? totalNet - (previousPaidAmount + totalReceived)
      : totalNet - totalReceived
  );

  const handleSaveBilling = async (mode: "Draft" | "Finalized") => {
    try {
      setIsBillingSubmitting(true); // ⭐ Start loader

      // 🚨 1) Prevent save if no items
      if (!selectedItems || selectedItems.length === 0) {
        toast.current?.show({
          severity: "warn",
          summary: "No Items Selected",
          detail: "Please select at least one billing item first.",
        });
        return;
      }

      const billStatusId = mode === "Draft" ? 1 : 2;

      const payload = {
        BillingTransactionId: editingBillingId || "",
        patientId: appointment?.PatientId,
        appointmentId: appointment?.AppointmentId || null,
        hospitalId: appointment?.hospitalId,
        organizationId: appointment?.hospital?.organizationId,
        doctorId: appointment?.DoctorId,

        subtotal: itemsNetBeforeOverall,
        totalDiscount: itemDiscountTotal,
        totalTax: itemGstTotal,
        overallDiscountType: overallDiscountMode,
        overallDiscountValue: overallDiscountAmount,
        netAmount: totalNet,
        amountPaid: isEditMode
          ? totalReceived + previousPaidAmount
          : totalReceived,
        remarks: billingRemarks,

        billStatusId: billStatusId,
        PaymentStatusId: totalBalance > 0 ? 2 : 1,

        items: selectedItems.map((item) => ({
          BillingItemChargeId: item.BillingItemChargeId,
          BillingItemName: item.BillingItemName,
          quantity: item.units,
          price: item.price,
          discount: item.discount,
          gst: item.gst,
          netAmount: item.price * item.units - item.discount + item.gst,
        })),

        payments: Object.entries(paymentDetails)
          .filter(([_, amt]) => amt > 0)
          .map(([mode, amt]) => ({
            paymentMode: mode,
            amount: amt,
            referenceNumber: "",
            remarks: billingRemarks || `clearing due amount`,
          })),
      };

      const res = await createUpdatePatientBill(payload);
      const advisedBillingItemChargeIds =
        advisedItems
          ?.filter((it) => it.status === "Incomplete")
          ?.map((it) => it.billingItemChargeId)
          ?.filter(Boolean) || [];

      const billingChanges = {
        patientId: advisedItems[0]?.patientId,
        appointmentId: advisedItems[0]?.appointmentId,
        consultationId: null,
        billingItemChargeIds: selectedAdvisedIds,
        status: "Completed",
      };
      addupdatePatientsyncPatientPackageUsage(billingChanges);
      setIsBillingSubmitting(false);

      console.log("💾 Billing saved:", res);

      // 🚨 2) Allow printing ONLY for finalized bills
      if (mode === "Finalized") {
        generateBillPDF(res.data, appointment);
      }

      setIsEditMode(false);
      setHasbilldone(true);

      setTimeout(() => {
        setHasbilldone(false);
        resetBillingForm();
        onOpenChange(false);
      }, 3000);
    } catch (err) {
      toast.current?.show({
        severity: "error",
        summary: "Failed to save bill",
      });
    }
  };

  const onClearDue = (bill: any) => {
    setDueBill(bill);
    // set default amount to outstanding
    setClearPaymentAmount(bill.balanceDue || 0);
    setClearPaymentMode("Cash");
    setClearPaymentReference("");
    setClearPaymentRemark("");
    setShowClearDueModal(true);
  };

  /* -------------------------
  Confirm delete action
------------------------- */
  const confirmDeleteBill = async () => {
    if (!deletingBill) return;
    setDeleteLoading(true);
    try {
      await CancelBill(
        deletingBill.BillingTransactionId,
        "reson of deletion by user"
      );
      toast.current?.show({
        severity: "success",
        summary: "Deleted",
        detail: "Bill deleted successfully",
      });
      setShowDeleteModal(false);
      setDeletingBill(null);
      await loadPreviousBills(appointment?.PatientId);
    } catch (err: any) {
      console.error("delete error", err);
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: err.message || "Delete failed",
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  const DeleteConfirmModal = () => (
    <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
      <DialogContent className="max-w-lg">
        <div className="flex items-start justify-between">
          <DialogTitle>Delete Bill</DialogTitle>
          <button
            onClick={() => setShowDeleteModal(false)}
            className="p-1 rounded-md"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="mt-4">
          <p className="text-sm text-gray-600">
            Are you sure you want to permanently delete invoice{" "}
            <strong>{deletingBill?.OPInvoiceNo}</strong>? This action cannot be
            undone.
          </p>

          <div className="mt-4 flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button
              className="bg-red-500 hover:bg-red-600 text-white"
              onClick={confirmDeleteBill}
              disabled={deleteLoading}
            >
              {deleteLoading ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  const onDeleteBill = (bill: any) => {
    setDeletingBill(bill);
    setShowDeleteModal(true);
  };

  // Extract Billing permission
  const billingPermission = accessRights
    ?.flatMap((m: any) => m.Submodules || [])
    ?.find((s: any) => s.SubModuleName === "Billing")?.Permissions?.[0];

  const canViewBillingHistory = billingPermission?.CanView ?? false;
  const canCreateBilling = billingPermission?.CanCreate ?? false;
  const canDeleteBilling = billingPermission?.CanDelete ?? false;
  const canEditBilling = billingPermission?.CanUpdate ?? false;
  const canPayDue = canEditBilling || canCreateBilling;

  const billingModule = accessRights
    ?.flatMap((mod: any) => mod.Submodules || [])
    ?.find((s: any) => s.SubModuleName === "Billing");

  const isBillingEnabled = billingModule?.enabled ?? false;

  const allTabs = [
    "All Billing",
    "Previous Billings",
    "Cancel Receipts",
    "Draft Billing History",
    "Draft Cancel History",
  ];

  const visibleTabs = canViewBillingHistory ? allTabs : ["All Billing"]; // Only one tab shown

  const mapBillToForm = (bill: any) => {
    // 1. Load Items
    const mappedItems = bill.BillingTransactionItem.map(
      (it: any, index: number) => ({
        BillingItemChargeId: it.billingItemChargeId,
        BillingItemName: it.itemName,
        chargeType:
          it.chargeType ||
          it.BillingItemCharge?.chargeType ||
          it.BillingItemCharge?.chargeType?.BillItemTypeName,

        price: Number(it.price),
        units: Number(it.units),
        discount: Number(it.discountAmount),
        discountType: it.discountType || "flat",
        discountValue: Number(it.discountValue || 0),
        gst: Number(it.gstAmount || 0),
        gstType: it.gstType || "flat",
        gstValue: Number(it.gstValue || 0),
        uniqueKey: `${it.billingItemChargeId}-${index}`,
      })
    );

    setSelectedItems(mappedItems);

    // 2. Payment Details
    const payMap: any = { Cash: 0, Card: 0, Cheque: 0, Other: 0 };
    let prevPaid = 0;

    bill.BillingPayment.forEach((p: any) => {
      prevPaid += Number(p.amount || 0);

      if (payMap[p.paymentMode] !== undefined) {
        payMap[p.paymentMode] = Number(p.amount);
      }
    });

    setPaymentDetails(payMap);

    // 🟢 store previous paid amount
    setPreviousPaidAmount(prevPaid);

    // 🟢 reset new payments (fresh payment)
    setPaymentDetails({ Cash: 0, Card: 0, Cheque: 0, Other: 0 });

    // 3. Overall discount
    setOverallDiscountMode(bill.overallDiscountType || "flat");

    if (bill.overallDiscountType === "percent") {
      // bill.overallDiscountValue contains 65.8 (the AMOUNT)
      const percent =
        (Number(bill.overallDiscountValue) / Number(bill.subtotal)) * 100;
      setOverallDiscountValue(Number(percent.toFixed(2))); // e.g., 3%
    } else {
      setOverallDiscountValue(Number(bill.overallDiscountValue || 0));
    }

    // 4. Billing Remarks
    setBillingRemarks(bill.remarks || "");

    // 5. We must update appointment context
    setEditingBillingId(bill.BillingTransactionId);

    // 6. Recalculate totals
    recalculateTotals(mappedItems, payMap);

    //Item wise Discount and GST are already mapped above
    setTotalDiscount(Number(bill.totalDiscount || 0));
    setTotalGst(Number(bill.totalTax || 0));
  };

  const recalculateTotals = (items: any[], payments: any) => {
    const subtotal = items.reduce(
      (sum, it) => sum + Number(it.price) * Number(it.units),
      0
    );

    const discountTotal = items.reduce(
      (sum, it) => sum + Number(it.discount || 0),
      0
    );

    const gstTotal = items.reduce((sum, it) => sum + Number(it.gst || 0), 0);

    const overallDiscount =
      overallDiscountMode === "percent"
        ? (subtotal * (overallDiscountValue || 0)) / 100
        : Number(overallDiscountValue || 0);

    const net = subtotal - discountTotal - overallDiscount + gstTotal;

    const paid = Object.values(payments).reduce(
      (sum: number, val: any) => sum + Number(val || 0),
      0
    );
  };

  const onEditBill = (bill: any) => {
    const totalPrevPaid =
      bill.BillingPayment?.reduce(
        (sum: number, p: any) => sum + Number(p.amount || 0),
        0
      ) || 0;

    setPreviousPaidAmount(totalPrevPaid);
    setIsEditMode(true); // <-- IMPORTANT

    setActiveTab("all-billing");

    // Load bill into form
    mapBillToForm(bill);

    // Call parent handler if provided
    if (onOpenBillingForEdit) {
      onOpenBillingForEdit(bill);
    } else {
      console.warn("No edit handler provided.");
      toast.current?.show({
        severity: "info",
        summary: "Edit",
        detail: "No edit handler available",
      });
    }
  };

  /* -------------------------
  Submit clear due
------------------------- */
  const submitClearDue = async () => {
    if (!dueBill) return;
    const amount = Number(clearPaymentAmount || 0);
    const totalReceived = amount + Number(dueBill.amountPaid || 0);

    if (amount <= 0) {
      toast.current?.show({
        severity: "warn",
        summary: "Invalid",
        detail: "Amount must be greater than zero",
      });
      return;
    }
    if (amount > Number(dueBill.balanceDue || 0)) {
      toast.current?.show({
        severity: "warn",
        summary: "Overpay",
        detail: "Amount exceeds due",
      });
      return;
    }

    setClearDueLoading(true);
    try {
      const payload = {
        BillingTransactionId: dueBill.BillingTransactionId,
        patientId: appointment?.PatientId,
        appointmentId: appointment?.AppointmentId || null,
        hospitalId: appointment?.hospitalId,
        organizationId: appointment?.hospital?.organizationId,
        doctorId: appointment?.DoctorId,
        subtotal: dueBill.subtotal,
        totalDiscount: dueBill?.totalDiscount,
        totalTax: dueBill?.totalTax,
        overallDiscountType: dueBill?.overallDiscountType,
        overallDiscountValue: dueBill?.overallDiscountValue,
        netAmount: dueBill?.netAmount,
        amountPaid: totalReceived,
        remarks: billingRemarks,
        billStatusId: 2,
        PaymentStatusId: totalBalance == 0 ? 3 : 2, // 1=Paid,2=Partial,3=Unpaid

        items: dueBill?.BillingTransactionItem.map((item: any) => ({
          BillingItemChargeId: item.billingItemChargeId,
          BillingItemName: item.itemName,
          quantity: Number(item.units),
          price: Number(item.price),
          discount: Number(item.discountAmount),
          gst: Number(item.gstAmount),
          netAmount:
            Number(item.price) * Number(item.units) -
            Number(item.discountAmount) +
            Number(item.gstAmount),
        })),
        payments: [
          {
            paymentMode: clearPaymentMode,
            amount: clearPaymentAmount,
            referenceNumber: clearPaymentReference || null,
            remarks:
              clearPaymentRemark ||
              `clearing due amount ${dueBill.OPInvoiceNo}`,
          },
        ],
      };
      console.log("📤 Clear due payload:", payload);

      await createUpdatePatientBill(payload);

      toast.current?.show({
        severity: "success",
        summary: "Paid",
        detail: `Paid ₹${amount} successfully`,
      });
      setShowClearDueModal(false);
      setDueBill(null);
      await loadPreviousBills(appointment?.PatientId);
    } catch (err: any) {
      console.error("pay due error", err);
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: err.message || "Payment failed",
      });
    } finally {
      setClearDueLoading(false);
    }
  };

  const formatPaymentDate = (isoDate: string) => {
    if (!isoDate) return "-";

    const date = new Date(isoDate);

    const day = date.getDate();
    const month = date.toLocaleString("en-US", { month: "short" });
    const year = date.getFullYear();

    const suffix =
      day % 10 === 1 && day !== 11
        ? "st"
        : day % 10 === 2 && day !== 12
          ? "nd"
          : day % 10 === 3 && day !== 13
            ? "rd"
            : "th";

    const time = date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });

    return `${day}${suffix} ${month} ${year}, ${time}`;
  };

  /* -------------------------
  ClearDueModal JSX
  Insert this JSX once (e.g. near top of render)
------------------------- */
  const ClearDueModal = () => (
    <Dialog open={showClearDueModal} onOpenChange={setShowClearDueModal}>
      <DialogContent className="max-w-xl">
        <div className="flex items-start justify-between">
          <DialogTitle>Pay Due Amount</DialogTitle>
          <button
            onClick={() => setShowClearDueModal(false)}
            className="p-1 rounded-md"
          >
            <X className="w-5 h-5 text-red-500 cursor-pointer" />
          </button>
        </div>

        <div className="mt-4 space-y-4">
          <div>
            <div className="text-sm text-gray-500">Invoice</div>
            <div className="font-medium text-gray-900">
              {dueBill?.OPInvoiceNo || "-"}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <Label className="text-xs">Payment Mode</Label>
              <Select
                onValueChange={(v) => setClearPaymentMode(v as any)}
                defaultValue={clearPaymentMode}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="w-full border border-gray-300 shadow-xl">
                  <SelectItem value="Cash">Cash</SelectItem>
                  <SelectItem value="Card">Card</SelectItem>
                  <SelectItem value="UPI">UPI</SelectItem>
                  <SelectItem value="Cheque">Cheque</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-xs">Amount</Label>
              <Input
                value={clearPaymentAmount}
                onChange={(e) =>
                  setClearPaymentAmount(Number(e.target.value || 0))
                }
                type="number"
              />
              <div className="text-xs text-gray-500 mt-1">
                Due: ₹{dueBill?.balanceDue || 0}
              </div>
            </div>

            <div>
              <Label className="text-xs">Reference</Label>
              <Input
                value={clearPaymentReference}
                onChange={(e) => setClearPaymentReference(e.target.value)}
                placeholder="Txn / Ref no (optional)"
              />
            </div>

            <div>
              <Label className="text-xs">Remark</Label>
              <Input
                value={clearPaymentRemark}
                onChange={(e) => setClearPaymentRemark(e.target.value)}
                placeholder="Remark (optional)"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setShowClearDueModal(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-teal-600 text-white"
              onClick={submitClearDue}
              disabled={clearDueLoading}
            >
              {clearDueLoading
                ? "Processing..."
                : `Pay ₹${clearPaymentAmount || 0}`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  const onPrintBill = (bill: any) => {
    generateBillPDF(bill, appointment);
  };

  const finalizedBills = previousBills.filter(
    (bill) => bill.BillStatus?.StatusName === "Finalized"
  );

  useEffect(() => {
    if (Hasbilldone) {
      // Scroll entire page to top
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [Hasbilldone]);

  useEffect(() => {
    if (!appointment?.PatientId) return;

    const fetchAdvised = async () => {
      setAdvisedItemsLoading(true);
      try {
        const resp = await getPatientPackageUsage(
          0,
          appointment.PatientId,
          appointment?.AppointmentId
        );

        // ❗ FILTER OUT INCOMPLETE ITEMS
        const filtered = (resp || []).filter(
          (item: any) => item.status === "Incomplete"
        );

        console.log("Filtered Advised Items:", filtered);

        setAdvisedItems(filtered);
      } catch (err) {
        console.error("Error loading advised items:", err);
      } finally {
        setAdvisedItemsLoading(false);
      }
    };

    if (billingactiveTab === "advised") {
      fetchAdvised();
    }
  }, [billingactiveTab, appointment?.PatientId]);

  return (
    <>
      {Hasbilldone && (
        <div
          className="fixed inset-0 z-[9999] bg-white/90 flex items-center justify-center"
          style={{ pointerEvents: "auto" }}
        >
          <div className="flex flex-col items-center justify-center text-center p-6 max-w-md w-full mx-auto">
            <div className="animate-floatUp mb-2">
              <Lottie
                animationData={PaymentSuccessAnimation}
                className="w-80 h-80"
                loop={false}
              />
            </div>
            <p className="text-2xl mt-4 font-semibold text-green-600">
              Billing Done Successfully!
            </p>
          </div>
        </div>
      )}
      <Dialog open={open} onOpenChange={onOpenChange}>
        <Toast ref={toast} />
        {DeleteConfirmModal()}
        {ClearDueModal()}

        <DialogContent
          size="lg"
          className="max-h-[92vh] overflow-y-auto p-0 max-w-7xl rounded-2xl flex flex-col no-scrollbar bg-gradient-to-r from-cyan-50 via-indigo-50 to-teal-50"
          onInteractOutside={(e) => e.preventDefault()} // 🛑 Prevent close on outside click
          onEscapeKeyDown={(e) => e.preventDefault()} // 🛑 Prevent close on ESC key
        >
          <div className="relative">
            {/* Header */}
            <div
              className="relative flex items-center justify-between w-full px-6 py-4 rounded-t-2xl border-b border-gray-200"
              style={{
                background:
                  "linear-gradient(90deg, rgba(34,211,238,0.35) 0%, rgba(129,140,248,0.15) 50%, rgba(20,184,166,0.25) 100%)",
                backdropFilter: "blur(4px)",
              }}
            >
              {/* Left: Search Input */}
              <div className="flex items-center gap-6 w-full">
                <div className="w-64">
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search Patient"
                    className="w-full rounded-xl border border-teal-400 bg-white/80 text-center font-medium text-black placeholder-gray-400 focus:ring-2 focus:ring-teal-400 focus:outline-none transition-all duration-300"
                  />
                </div>
                <div className="h-8 w-px bg-gradient-to-b from-teal-400 to-indigo-400" />

                {/* Patient Info */}
                <div className="flex items-center gap-6 text-center font-sans">
                  {[
                    {
                      label: "Patient Name",
                      icon: <User className="w-4 h-4 text-teal-500" />,
                      value:
                        `${appointment?.patient?.firstName || ""} ${appointment?.patient?.lastName || ""}`.trim() ||
                        "-",
                    },
                    {
                      label: "Mobile No",
                      icon: <Phone className="w-4 h-4 text-indigo-500" />,
                      value: appointment?.patient?.mobile || "-",
                    },
                    {
                      label: "MRN",
                      icon: <Clipboard className="w-4 h-4 text-green-500" />,
                      value:
                        appointment?.patient?.Patient_Medical_Record_No || "-",
                    },
                    {
                      label: "Age & Sex",
                      icon:
                        appointment?.patient?.gender?.toLowerCase() ===
                        "male" ? (
                          <Mars className="w-3 h-3 text-blue-500" />
                        ) : (
                          <Venus className="w-3 h-3 text-pink-500" />
                        ),
                      value: appointment?.patient?.dateOfBirth
                        ? calculateAgeWithSex(
                            appointment?.patient?.dateOfBirth,
                            appointment?.patient?.gender
                          )
                        : "-",
                    },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4">
                      {idx !== 0 && (
                        <div className="h-8 w-px bg-gradient-to-b from-teal-400 to-indigo-400" />
                      )}
                      <div className="flex flex-col items-center">
                        <div className="flex items-center gap-1">
                          {item.icon}
                          <h1 className="text-xs text-gray-600 font-medium">
                            {item.label}
                          </h1>
                        </div>
                        <p className="text-sm font-semibold text-gray-900 mt-1">
                          {item.value}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="absolute top-3 right-3 text-teal-500 hover:bg-teal-100 p-2 rounded-full transition"
                title="Close"
              >
                <X className="w-5 h-5 cursor-pointer" />
              </button>
            </div>

            {/* Billing Tabs Section */}
            <div className="flex flex-col w-full p-4 bg-transparent">
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                {/* Tab Header */}
                <TabsList className="flex flex-wrap gap-2 bg-transparent mb-4">
                  {visibleTabs.map((tab, idx) => (
                    <TabsTrigger
                      key={idx}
                      value={tab.toLowerCase().replace(/\s+/g, "-")}
                      className="rounded-full border border-teal-400 text-sm px-4 py-2 font-medium text-gray-700 
        hover:bg-teal-50 hover:text-teal-600 data-[state=active]:bg-teal-500 
        data-[state=active]:text-white transition-all duration-200"
                    >
                      {tab}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {/* All Billing Content */}
                <TabsContent value="all-billing">
                  <div className="grid grid-cols-12 gap-4">
                    {/* ---------- Left Panel: All Charges ---------- */}
                    {/* ---------- Left Panel: All Charges (col-span-4) ---------- */}
                    <div className="col-span-4">
                      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4 flex flex-col h-full">
                        {/* Billing / Advised Toggle */}
                        <div className="flex items-center mb-3 rounded-lg overflow-hidden border border-teal-400">
                          <button
                            onClick={() => setBillingActiveTab("billing")}
                            className={`flex-1 text-sm font-semibold py-2 ${
                              billingactiveTab === "billing"
                                ? "bg-teal-600 text-white"
                                : "bg-white text-teal-600"
                            }`}
                          >
                            BILLING ITEMS
                          </button>

                          <button
                            onClick={() => setBillingActiveTab("advised")}
                            className={`flex-1 text-sm font-semibold py-2 ${
                              billingactiveTab === "advised"
                                ? "bg-teal-600 text-white"
                                : "bg-white text-teal-600"
                            }`}
                          >
                            ADVISED ITEMS
                          </button>
                        </div>

                        {/* ---------- Billing Tab Filters (Search, Toggle, Category) ---------- */}
                        {billingactiveTab === "billing" && (
                          <>
                            {/* Search Bar */}
                            <div className="relative mb-3">
                              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
                              <Input
                                placeholder="Search Item"
                                className="pl-9 rounded-lg border-gray-300 focus:ring-2 focus:ring-teal-400 bg-gradient-to-r from-white via-gray-50 to-gray-100"
                                // onChange should be wired to your search handler if you have one
                              />
                            </div>

                            {/* Frequently Added / All */}
                            <div className="flex items-center mb-3 rounded-lg overflow-hidden border border-teal-400">
                              <button
                                className="flex-1 text-sm font-semibold text-teal-600 bg-white py-1 border-r border-teal-400"
                                // onClick can toggle frequently vs all if you implement it
                              >
                                Frequently Added
                              </button>
                              <button className="flex-1 text-sm font-semibold text-white bg-teal-500 hover:bg-teal-600 transition-all">
                                All
                              </button>
                            </div>

                            {/* Category Dropdown */}
                            <div className="mb-3">
                              <Select
                                value={chargeType}
                                onValueChange={(val) => {
                                  setChargeType(val);
                                  setPage(1);
                                }}
                              >
                                <SelectTrigger className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500">
                                  <SelectValue placeholder="All Categories" />
                                </SelectTrigger>

                                <SelectContent className="border-white shadow-2xl rounded-2xl max-h-[300px]">
                                  {[
                                    "ALL CATEGORIES",
                                    "CONSULTATION",
                                    "PROCEDURE",
                                    "INVESTIGATION",
                                    "OTHER CHARGES",
                                  ].map((category, idx) => (
                                    <SelectItem
                                      key={idx}
                                      value={category.toLowerCase()}
                                    >
                                      {category}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </>
                        )}

                        {/* -------------------- Scroll List -------------------- */}
                        <ScrollArea className="flex-1 h-[400px] pr-2">
                          <div className="flex flex-col gap-2">
                            {/* ========================= */}
                            {/*        BILLING TAB        */}
                            {/* ========================= */}
                            {billingactiveTab === "billing" && (
                              <>
                                {loading ? (
                                  <BillingItemSkeleton count={6} />
                                ) : items.length === 0 ? (
                                  <div className="text-center text-gray-500 py-8 text-sm">
                                    No records found.
                                  </div>
                                ) : (
                                  items.map((item: any) => {
                                    const isConsultation =
                                      item?.chargeType?.BillItemTypeName?.toUpperCase() ===
                                      "CONSULTATION";

                                    return (
                                      <div
                                        key={item.BillingItemChargeId}
                                        className="flex flex-col rounded-lg border border-gray-200 hover:border-teal-400 px-3 py-2 cursor-pointer hover:bg-teal-50"
                                      >
                                        <div>
                                          <div className="text-sm font-semibold">
                                            {item.BillingItemName}
                                          </div>
                                          <div className="text-xs text-gray-500">
                                            {item.chargeType
                                              ?.BillItemTypeName || "—"}
                                          </div>
                                        </div>

                                        {/* ----------------------------- */}
                                        {/* CONSULTATION → Subcharges     */}
                                        {/* ----------------------------- */}
                                        {isConsultation ? (
                                          <div className="mt-2 flex flex-col gap-1 text-xs text-gray-700 pl-2 border-t pt-1">
                                            {/* Walk-in */}
                                            <div
                                              onClick={() =>
                                                handleAddBillingItem({
                                                  ...item,
                                                  selectedChargeType: "Walk-in",
                                                  price:
                                                    item.walkinPrice ??
                                                    item.price ??
                                                    0,
                                                })
                                              }
                                              className="hover:bg-teal-100 px-2 py-1 rounded-md flex justify-between items-center"
                                            >
                                              <span className="font-medium">
                                                Walk-in
                                              </span>
                                              <span>
                                                ₹{item.walkinPrice || 0}
                                              </span>
                                            </div>

                                            {/* Teleconsultation */}
                                            <div
                                              onClick={() =>
                                                handleAddBillingItem({
                                                  ...item,
                                                  selectedChargeType:
                                                    "Teleconsultation",
                                                  price:
                                                    item.telePrice ??
                                                    item.price ??
                                                    0,
                                                })
                                              }
                                              className="hover:bg-teal-100 px-2 py-1 rounded-md flex justify-between items-center"
                                            >
                                              <span className="font-medium">
                                                Teleconsultation
                                              </span>
                                              <span>
                                                ₹{item.telePrice || 0}
                                              </span>
                                            </div>

                                            {/* FastTrack */}
                                            <div
                                              onClick={() =>
                                                handleAddBillingItem({
                                                  ...item,
                                                  selectedChargeType:
                                                    "FastTrack",
                                                  price:
                                                    item.fastTrackCharges ??
                                                    item.price ??
                                                    0,
                                                })
                                              }
                                              className="hover:bg-teal-100 px-2 py-1 rounded-md flex justify-between items-center"
                                            >
                                              <span className="font-medium">
                                                Fast Track
                                              </span>
                                              <span>
                                                ₹{item.fastTrackCharges || 0}
                                              </span>
                                            </div>
                                          </div>
                                        ) : (
                                          /* ----------------------------- */
                                          /* NON-CONSULTATION → ONE PRICE */
                                          /* ----------------------------- */
                                          <div
                                            className="mt-2 text-xs text-teal-600 hover:text-teal-700"
                                            onClick={() =>
                                              handleAddBillingItem({
                                                ...item,
                                                selectedChargeType: "Standard",
                                                price: item.price ?? 0,
                                              })
                                            }
                                          >
                                            Add Item (₹{item.price || 0})
                                          </div>
                                        )}
                                      </div>
                                    );
                                  })
                                )}
                              </>
                            )}

                            {/* ========================= */}
                            {/*        ADVISED TAB        */}
                            {/* ========================= */}
                            {billingactiveTab === "advised" && (
                              <>
                                {advcetemsloading ? (
                                  Array.from({ length: 3 }).map((_, i) => (
                                    <BillingItemSkeleton key={i} />
                                  ))
                                ) : advisedItems.filter(
                                    (x: any) => x.status === "Incomplete"
                                  ).length === 0 ? (
                                  <div className="text-center text-gray-500 py-8 text-sm">
                                    No advised items found.
                                  </div>
                                ) : (
                                  advisedItems
                                    .filter(
                                      (x: any) => x.status === "Incomplete"
                                    )
                                    .map((pkg: any) => {
                                      const charge = pkg.BillingItemCharge;
                                      const isConsultation =
                                        charge?.chargeType?.BillItemTypeName?.toUpperCase() ===
                                        "CONSULTATION";

                                      return (
                                        <div
                                          key={pkg.PatientPackageUsageId}
                                          className="flex flex-col rounded-lg border border-gray-200 px-3 py-3 hover:border-teal-500 hover:bg-teal-50 cursor-pointer"
                                        >
                                          <div className="text-sm font-semibold text-gray-800">
                                            {charge?.BillingItemName}
                                          </div>

                                          <div className="text-xs text-gray-500 uppercase">
                                            {charge?.chargeType
                                              ?.BillItemTypeName || "—"}
                                          </div>

                                          <div className="mt-2 border-t pt-2 flex flex-col gap-1 text-xs text-gray-700">
                                            {/* ============================== */}
                                            {/* CONSULTATION → Walk-in & FT    */}
                                            {/* ============================== */}
                                            {isConsultation ? (
                                              <>
                                                {/* Walk-in */}
                                                <div
                                                  onClick={() => {
                                                    handleAddBillingItem({
                                                      fromAdvised: true,
                                                      BillingItemName:
                                                        charge?.BillingItemName,
                                                      BillingItemChargeId:
                                                        pkg.billingItemChargeId,
                                                      selectedChargeType:
                                                        "Standard",
                                                      price:
                                                        Number(charge?.price) ||
                                                        0,
                                                      chargeType:
                                                        charge?.chargeType,
                                                      billingItemCharge: charge,
                                                      chargeData: charge,
                                                    });

                                                    // ⭐ ADD THIS
                                                    setSelectedAdvisedIds(
                                                      (prev) => {
                                                        if (
                                                          prev.includes(
                                                            pkg.billingItemChargeId
                                                          )
                                                        )
                                                          return prev; // avoid duplicate
                                                        return [
                                                          ...prev,
                                                          pkg.billingItemChargeId,
                                                        ];
                                                      }
                                                    );
                                                  }}
                                                  className="px-2 py-1 rounded-md flex justify-between items-center hover:bg-teal-100 bg-white"
                                                >
                                                  <span className="font-medium">
                                                    Walk-in
                                                  </span>
                                                  <span>
                                                    ₹
                                                    {pkg.IsFreeFollowUp
                                                      ? 0
                                                      : charge?.walkinPrice ||
                                                        0}
                                                  </span>
                                                </div>

                                                {/* FastTrack */}
                                                {pkg.IsFastTrack && (
                                                  <div
                                                    onClick={() => {
                                                      handleAddBillingItem({
                                                        fromAdvised: true,
                                                        BillingItemName:
                                                          charge?.BillingItemName,
                                                        BillingItemChargeId:
                                                          pkg.billingItemChargeId,
                                                        selectedChargeType:
                                                          "Standard",
                                                        price:
                                                          Number(
                                                            charge?.price
                                                          ) || 0,
                                                        chargeType:
                                                          charge?.chargeType,
                                                        billingItemCharge:
                                                          charge,
                                                        chargeData: charge,
                                                      });

                                                      // ⭐ ADD THIS
                                                      setSelectedAdvisedIds(
                                                        (prev) => {
                                                          if (
                                                            prev.includes(
                                                              pkg.billingItemChargeId
                                                            )
                                                          )
                                                            return prev; // avoid duplicate
                                                          return [
                                                            ...prev,
                                                            pkg.billingItemChargeId,
                                                          ];
                                                        }
                                                      );
                                                    }}
                                                    className="px-2 py-1 rounded-md flex justify-between items-center hover:bg-teal-100 bg-teal-100 border border-teal-400"
                                                  >
                                                    <span className="font-medium">
                                                      Fast Track
                                                    </span>
                                                    <span>
                                                      ₹
                                                      {charge?.fastTrackCharges ||
                                                        0}
                                                    </span>
                                                  </div>
                                                )}
                                              </>
                                            ) : (
                                              /* ============================== */
                                              /* NON-CONSULTATION → ONE PRICE  */
                                              /* ============================== */
                                              <div
                                                onClick={() => {
                                                  handleAddBillingItem({
                                                    fromAdvised: true,
                                                    BillingItemName:
                                                      charge?.BillingItemName,
                                                    BillingItemChargeId:
                                                      pkg.billingItemChargeId,
                                                    selectedChargeType:
                                                      "Standard",
                                                    price:
                                                      Number(charge?.price) ||
                                                      0,
                                                    chargeType:
                                                      charge?.chargeType,
                                                    billingItemCharge: charge,
                                                    chargeData: charge,
                                                  });

                                                  // ⭐
                                                  setSelectedAdvisedIds(
                                                    (prev) => {
                                                      if (
                                                        prev.includes(
                                                          pkg.billingItemChargeId
                                                        )
                                                      )
                                                        return prev; // avoid duplicate
                                                      return [
                                                        ...prev,
                                                        pkg.billingItemChargeId,
                                                      ];
                                                    }
                                                  );
                                                }}
                                                className="px-2 py-1 rounded-md flex justify-between items-center hover:bg-teal-100 bg-white"
                                              >
                                                <span className="font-medium">
                                                  Item Charge
                                                </span>
                                                <span>
                                                  ₹{Number(charge?.price) || 0}
                                                </span>
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      );
                                    })
                                )}
                              </>
                            )}
                          </div>
                        </ScrollArea>

                        {/* PAGINATION ONLY FOR BILLING TAB */}
                        {billingactiveTab === "billing" && (
                          <div className="flex justify-center items-center gap-2 mt-3 border-t pt-2">
                            <button
                              disabled={page === 1}
                              onClick={() =>
                                setPage((p: number) => Math.max(1, p - 1))
                              }
                              className={`text-xs px-2 py-1 rounded-md border ${
                                page === 1
                                  ? "border-gray-200 text-gray-300 cursor-not-allowed"
                                  : "border-gray-300 text-gray-600 hover:bg-gray-100"
                              }`}
                            >
                              Previous
                            </button>

                            <div className="flex gap-1">
                              {(() => {
                                const totalPages = meta?.totalPages || 1;
                                const visiblePages: (number | string)[] = [];

                                if (totalPages <= 5) {
                                  for (let i = 1; i <= totalPages; i++)
                                    visiblePages.push(i);
                                } else {
                                  if (page > 3) visiblePages.push(1, "...");
                                  for (
                                    let i = Math.max(1, page - 1);
                                    i <= Math.min(totalPages, page + 1);
                                    i++
                                  ) {
                                    visiblePages.push(i);
                                  }
                                  if (page < totalPages - 2)
                                    visiblePages.push("...", totalPages);
                                }

                                return visiblePages.map(
                                  (p: any, idx: number) => (
                                    <button
                                      key={idx}
                                      onClick={() =>
                                        typeof p === "number" && setPage(p)
                                      }
                                      disabled={p === "..."}
                                      className={`text-xs w-7 h-7 flex items-center justify-center rounded-md ${
                                        p === page
                                          ? "bg-teal-500 text-white"
                                          : p === "..."
                                            ? "text-gray-400 cursor-default"
                                            : "border border-gray-300 text-gray-600 hover:bg-gray-100"
                                      }`}
                                    >
                                      {p}
                                    </button>
                                  )
                                );
                              })()}
                            </div>

                            <button
                              disabled={page === meta?.totalPages}
                              onClick={() =>
                                setPage((p: number) =>
                                  Math.min(meta?.totalPages || 1, p + 1)
                                )
                              }
                              className={`text-xs px-2 py-1 rounded-md border ${
                                page === meta?.totalPages
                                  ? "border-gray-200 text-gray-300 cursor-not-allowed"
                                  : "border-gray-300 text-gray-600 hover:bg-gray-100"
                              }`}
                            >
                              Next
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* ---------- Right Panel: Billing Details ---------- */}
                    <div className="col-span-8 bg-white rounded-xl shadow-md border border-gray-300 p-4 flex flex-col gap-4">
                      {/* Billing Table */}
                      <div>
                        {/* Table Title */}
                        <div className="flex items-center justify-between border-b pb-1 mb-2 border-gray-300">
                          <h3 className="text-sm font-semibold text-gray-700">
                            New Billing
                          </h3>

                          {/* Date & Time Section */}
                          <div className="text-xs text-gray-600 flex items-center gap-2">
                            <span className="font-medium text-gray-500">
                              Date & Time:
                            </span>
                            <span className="text-gray-800 font-semibold">
                              {billDateTime || "--/--/---- --:--"}
                            </span>
                          </div>
                        </div>

                        {/* Table Header */}
                        <div className="grid grid-cols-[2fr_1fr_1fr_1.5fr_1.5fr_1fr] text-xs font-semibold border-b border-gray-300 pb-2 text-gray-600 uppercase tracking-wide">
                          <span className="pl-1">Item</span>
                          <span className="text-center">Price</span>
                          <span className="text-center">Units</span>
                          <span className="text-center">Options</span>
                          <span className="text-center">Amount</span>
                          <span className="text-center">Action</span>
                        </div>

                        {/* Table Body */}
                        {selectedItems.length === 0 ? (
                          <div className="text-center py-8 text-gray-500 text-sm">
                            Select an item from the left panel to add it to the
                            bill.
                          </div>
                        ) : (
                          selectedItems.map((item) => {
                            const amount =
                              (item.price || 0) * (item.units || 0);
                            const net =
                              amount - (item.discount || 0) + (item.gst || 0);

                            return (
                              <div
                                key={item.uniqueKey} // ✅ not BillingItemChargeId
                                className="grid grid-cols-[2fr_1fr_1fr_1.5fr_1.5fr_1fr] ..."
                              >
                                {/* Item */}
                                <div className="pl-1">
                                  {/* Line 1 — Billing Item Name + Subcategory */}
                                  <div className="font-semibold text-gray-800 leading-tight">
                                    {item.BillingItemName}
                                    {item.subCategoryName && (
                                      <span className="text-teal-600 font-medium">
                                        {" — " + item.subCategoryName}
                                      </span>
                                    )}
                                  </div>

                                  {/* Line 2 — Consultation / Pharmacy / Procedure etc. */}
                                  <div className="text-xs text-gray-500 mt-0.5">
                                    {item.chargeType?.BillItemTypeName || "—"}
                                  </div>
                                </div>

                                {/* Price */}
                                <div className="flex justify-center">
                                  <Input
                                    type="number"
                                    value={item.price}
                                    onChange={(e) =>
                                      updateBillingItem(
                                        item.uniqueKey,
                                        "price",
                                        +e.target.value
                                      )
                                    }
                                    className="w-24 h-8 text-center"
                                  />
                                </div>

                                {/* Units */}
                                <div className="flex justify-center">
                                  <Input
                                    type="number"
                                    value={item.units}
                                    onChange={(e) =>
                                      updateBillingItem(
                                        item.uniqueKey,
                                        "units",
                                        +e.target.value
                                      )
                                    }
                                    className="w-16 h-8 text-center bg-yellow-50"
                                  />
                                </div>

                                {/* Options */}
                                <div className="flex flex-col items-center gap-1">
                                  {/* Discount Popover */}
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        className="w-24 text-xs py-1  border-gray-300"
                                      >
                                        Add Discount
                                      </Button>
                                    </PopoverTrigger>

                                    <PopoverContent className="w-56 p-3 shadow-md border border-gray-200 rounded-xl">
                                      <Label className="text-xs font-medium mb-2 block text-gray-600">
                                        Discount
                                      </Label>

                                      {/* Toggle between ₹ and % */}
                                      <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs font-medium text-gray-500">
                                          INR (₹)
                                        </span>
                                        <Switch
                                          checked={
                                            item.discountType === "percent"
                                          }
                                          onCheckedChange={(checked) =>
                                            updateBillingItem(
                                              item.uniqueKey,
                                              "discountType",
                                              checked ? "percent" : "flat"
                                            )
                                          }
                                        />
                                        <span className="text-xs font-medium text-gray-500">
                                          %
                                        </span>
                                      </div>

                                      <Input
                                        type="number"
                                        placeholder={
                                          item.discountType === "percent"
                                            ? "Enter %"
                                            : "Enter ₹ amount"
                                        }
                                        className="h-8 text-sm mb-2"
                                        value={item.discountValue || ""}
                                        onChange={(e) =>
                                          updateBillingItem(
                                            item.uniqueKey,
                                            "discountValue",
                                            +e.target.value
                                          )
                                        }
                                      />

                                      <Button
                                        size="sm"
                                        className="w-full bg-teal-500 hover:bg-teal-600 text-white text-xs"
                                        onClick={() => {
                                          const charge =
                                            item.billingItemCharge ||
                                            item.chargeData ||
                                            item;

                                          const maxPercent = Number(
                                            charge?.maxDiscountPercent || 0
                                          );
                                          const maxFlat = Number(
                                            charge?.maxDiscountInr || 0
                                          );

                                          const base = item.price * item.units;
                                          const val = Number(
                                            item.discountValue || 0
                                          );

                                          // VALIDATION — PERCENT
                                          if (
                                            item.discountType === "percent" &&
                                            val > maxPercent
                                          ) {
                                            toast.current?.show({
                                              severity: "warn",
                                              summary:
                                                "⚠ Maximum discount exceeded",
                                              detail: `You cannot apply more than ${maxPercent}%`,
                                            });
                                            return;
                                          }

                                          // VALIDATION — INR
                                          if (
                                            item.discountType === "flat" &&
                                            val > maxFlat
                                          ) {
                                            toast.current?.show({
                                              severity: "warn",
                                              summary:
                                                "⚠ Maximum discount exceeded",
                                              detail: `You cannot apply more than ₹${maxFlat}`,
                                            });
                                            return;
                                          }

                                          // APPLY DISCOUNT
                                          const discountAmt =
                                            item.discountType === "percent"
                                              ? (base * val) / 100
                                              : val;

                                          updateBillingItem(
                                            item.uniqueKey,
                                            "discount",
                                            discountAmt
                                          );
                                        }}
                                      >
                                        Apply
                                      </Button>
                                    </PopoverContent>
                                  </Popover>

                                  {/* GST Popover */}
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        className="w-24 text-xs py-1  border-gray-300"
                                      >
                                        Add GST
                                      </Button>
                                    </PopoverTrigger>

                                    <PopoverContent className="w-56 p-3 shadow-md border border-gray-200 rounded-xl">
                                      <Label className="text-xs font-medium mb-2 block text-gray-600">
                                        GST
                                      </Label>

                                      {/* Toggle between ₹ and % */}
                                      <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs font-medium text-gray-500">
                                          INR (₹)
                                        </span>
                                        <Switch
                                          checked={item.gstType === "percent"}
                                          onCheckedChange={(checked) =>
                                            updateBillingItem(
                                              item.uniqueKey,
                                              "gstType",
                                              checked ? "percent" : "flat"
                                            )
                                          }
                                        />
                                        <span className="text-xs font-medium text-gray-500">
                                          %
                                        </span>
                                      </div>

                                      <Input
                                        type="number"
                                        placeholder={
                                          item.gstType === "percent"
                                            ? "Enter %"
                                            : "Enter ₹ amount"
                                        }
                                        className="h-8 text-sm mb-2"
                                        value={item.gstValue || ""}
                                        onChange={(e) =>
                                          updateBillingItem(
                                            item.uniqueKey,
                                            "gstValue",
                                            +e.target.value
                                          )
                                        }
                                      />

                                      <Button
                                        size="sm"
                                        className="w-full bg-teal-500 hover:bg-teal-600 text-white text-xs"
                                        onClick={() => {
                                          const base = item.price * item.units;
                                          let gstAmt = 0;
                                          if (item.gstType === "percent") {
                                            gstAmt =
                                              (base * (item.gstValue || 0)) /
                                              100;
                                          } else {
                                            gstAmt = item.gstValue || 0;
                                          }
                                          updateBillingItem(
                                            item.uniqueKey,
                                            "gst",
                                            gstAmt
                                          );
                                        }}
                                      >
                                        Apply
                                      </Button>
                                    </PopoverContent>
                                  </Popover>
                                </div>

                                {/* Amount */}
                                <div className="text-right flex flex-col gap-0.5 pr-2">
                                  {/* Total Amount before Discount/GST */}
                                  <div className="text-xs text-gray-500">
                                    Total :{" "}
                                    <span className="text-gray-700 font-medium">
                                      ₹{(item.price * item.units).toFixed(2)}
                                    </span>
                                  </div>

                                  {/* Discount */}
                                  <div className="text-xs text-gray-500">
                                    Discount :{" "}
                                    <span className="text-gray-700 font-medium">
                                      ₹{(item.discount || 0).toFixed(2)}
                                    </span>
                                  </div>

                                  {/* GST */}
                                  <div className="text-xs text-gray-500">
                                    GST :{" "}
                                    <span className="text-gray-700 font-medium">
                                      ₹{(item.gst || 0).toFixed(2)}
                                    </span>
                                  </div>

                                  {/* Net Amount */}
                                  <div className="text-xs text-gray-800 font-semibold mt-0.5 border-t border-gray-300 pt-1">
                                    Net : ₹{net.toFixed(2)}
                                  </div>
                                </div>

                                {/* Action */}
                                <div className="flex flex-col items-center justify-center">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="text-red-500 text-xs hover:text-red-600"
                                    onClick={() =>
                                      removeBillingItem(item.uniqueKey)
                                    }
                                  >
                                    Remove
                                  </Button>
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>

                      {/* Payment Details */}
                      <div className="border-t pt-3 border-teal-400">
                        <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                          <CreditCard className="w-4 h-4 text-teal-500" />{" "}
                          Payment Details
                        </h3>

                        <div className="grid grid-cols-4 gap-2 mb-2">
                          {["Cash", "Card", "Cheque", "Other"].map(
                            (method, idx) => (
                              <div
                                key={idx}
                                className="flex flex-col border border-gray-200 rounded-md p-2 bg-white"
                              >
                                <Label className="text-xs font-medium text-gray-600">
                                  {method}
                                </Label>
                                <Input
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  value={
                                    paymentDetails[
                                      method as keyof typeof paymentDetails
                                    ] || ""
                                  }
                                  onChange={(e) => {
                                    const newValue =
                                      parseFloat(e.target.value) || 0;
                                    const otherTotal = Object.entries(
                                      paymentDetails
                                    )
                                      .filter(([key]) => key !== method)
                                      .reduce(
                                        (sum, [, val]) => sum + (val || 0),
                                        0
                                      );

                                    // Prevent overpayment
                                    if (newValue + otherTotal > totalNet) {
                                      const allowed = Math.max(
                                        0,
                                        totalNet - otherTotal
                                      );

                                      // Show toast
                                      toast.current?.show({
                                        severity: "warn",
                                        summary: `⚠️ Maximum allowed in ${method} is ₹${allowed.toFixed(2)}`,
                                      });

                                      // Update state
                                      setPaymentDetails((prev) => ({
                                        ...prev,
                                        [method]: allowed,
                                      }));

                                      // Stop further execution
                                      return;
                                    }

                                    setPaymentDetails((prev) => ({
                                      ...prev,
                                      [method]: newValue,
                                    }));
                                  }}
                                  className="mt-1 h-8 text-sm rounded-md border-gray-300 focus:ring-teal-400"
                                />
                              </div>
                            )
                          )}
                        </div>

                        <div>
                          <Label className="text-xs font-medium text-gray-600">
                            Remarks
                          </Label>
                          <Input
                            placeholder="Enter remarks"
                            type="text"
                            value={billingRemarks}
                            onChange={(e) => setBillingRemarks(e.target.value)}
                            className="mt-1 h-8 text-sm rounded-md border-gray-300 focus:ring-teal-400"
                          />
                        </div>
                      </div>

                      {/* Billing Summary */}
                      <div className="mt-6 border-t pt-4 border-teal-400">
                        <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                          <IndianRupee className="w-4 h-4 text-teal-500" />{" "}
                          Billing Summary
                        </h3>

                        <div className="max-w-md ml-auto bg-gray-50 rounded-xl p-4 shadow-sm border border-gray-200 space-y-2 text-sm">
                          {/* Subtotal */}
                          <div className="flex justify-between text-gray-800">
                            <span>Subtotal</span>
                            <span>₹{itemsNetBeforeOverall.toFixed(2)}</span>
                          </div>

                          {/* Item Discounts */}
                          <div className="flex justify-between text-gray-600">
                            <span>Item Discounts</span>
                            <span>- ₹{itemDiscountTotal.toFixed(2)}</span>
                          </div>

                          {/* Overall Discount (only percentage allowed) */}
                          <div className="flex items-center justify-between text-gray-700">
                            {/* Left Side: Label + Mode Switch + Input */}
                            <div className="flex items-center gap-2">
                              <Label className="text-xs font-medium">
                                Overall Discount
                              </Label>

                              {/* Toggle Between INR and % */}
                              <div className="flex items-center gap-1 border border-gray-300 rounded-md px-2 py-0.5 bg-white">
                                <span
                                  className={`text-[10px] font-semibold ${overallDiscountMode === "flat" ? "text-teal-600" : "text-gray-400"}`}
                                >
                                  ₹
                                </span>
                                <Switch
                                  checked={overallDiscountMode === "percent"}
                                  onCheckedChange={(checked) =>
                                    setOverallDiscountMode(
                                      checked ? "percent" : "flat"
                                    )
                                  }
                                />
                                <span
                                  className={`text-[10px] font-semibold ${overallDiscountMode === "percent" ? "text-teal-600" : "text-gray-400"}`}
                                >
                                  %
                                </span>
                              </div>

                              {/* Input for Discount Value */}
                              <Input
                                type="number"
                                value={overallDiscountValue}
                                onChange={(e) =>
                                  setOverallDiscountValue(+e.target.value)
                                }
                                className="w-20 h-7 text-center text-sm border-gray-300"
                                placeholder={
                                  overallDiscountMode === "percent"
                                    ? "Enter %"
                                    : "Enter ₹"
                                }
                              />
                            </div>

                            {/* Right Side: Computed Discount Amount */}
                            <span className="text-gray-700 font-medium">
                              - ₹{overallDiscountAmount.toFixed(2)}
                            </span>
                          </div>

                          <div className="border-t border-gray-200 my-1"></div>

                          {/* Tax Section */}
                          <div className="flex justify-between text-gray-700">
                            <span>Tax (GST)</span>
                            <span>+ ₹{itemGstTotal.toFixed(2)}</span>
                          </div>

                          <div className="border-t border-gray-300 my-1"></div>

                          {/* Grand Total */}
                          <div className="flex justify-between font-semibold text-gray-800">
                            <span>Grand Total</span>
                            <span>₹{totalNet.toFixed(2)}</span>
                          </div>

                          {/* Amount Paid */}
                          <div className="flex justify-between text-green-600 font-semibold">
                            <span>Amount Paid</span>
                            <span>₹{totalReceived.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-teal-600 font-semibold">
                            <span>Previous Paid</span>
                            <span>₹{previousPaidAmount.toFixed(2)}</span>
                          </div>

                          {/* Balance Due */}
                          <div className="flex justify-between text-red-600 font-semibold border-t border-gray-300 pt-1">
                            <span>Balance Due</span>
                            <span>₹{totalBalance.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Footer Buttons */}
                      <div className="flex justify-end gap-3 mt-4 border-t pt-3 border-teal-300">
                        {/* Save Draft */}
                        <Button
                          variant="outline"
                          disabled={!canCreateBilling}
                          className={`border-gray-200 ${
                            !canCreateBilling
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                          onClick={() => {
                            if (!canCreateBilling) {
                              toast.current?.show({
                                severity: "info",
                                summary: "Error",
                                detail:
                                  "You do not have access. Contact admin.",
                              });
                              return;
                            }
                            handleSaveBilling("Draft");
                          }}
                        >
                          {isBillingSubmitting ? (
                            <Loader2Icon className="animate-spin h-4 w-4" />
                          ) : (
                            "Save Draft"
                          )}
                        </Button>

                        {/* Pay & Print */}
                        <Button
                          disabled={!canCreateBilling}
                          className={`bg-teal-500 hover:bg-teal-600 text-white ${
                            !canCreateBilling
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                          onClick={() => {
                            if (!canCreateBilling) {
                              toast.current?.show({
                                severity: "info",
                                summary: "Error",
                                detail:
                                  "You do not have access. Contact admin.",
                              });
                              return;
                            }
                            handleSaveBilling("Finalized");
                          }}
                        >
                          {isBillingSubmitting ? (
                            <Loader2Icon className="animate-spin h-4 w-4" />
                          ) : (
                            "Pay & Print"
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="previous-billings">
                  <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
                    <div className="max-w-7xl mx-auto space-y-6">
                      {/* ➤ HEADER */}
                      <div className="flex items-center justify-between">
                        <h1 className="text-xl font-sans text-gray-900 tracking-tight">
                          Previous Invoices
                        </h1>

                        <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow border border-gray-200">
                          <FileText className="w-4 h-4 text-teal-400" />
                          <span className="text-sm font-medium text-gray-700">
                            {finalizedBills.length} Invoice
                            {finalizedBills.length !== 1 && "s"}
                          </span>
                        </div>
                      </div>

                      {/* ➤ LOADING */}
                      {loadingBills && (
                        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl shadow">
                          <div className="w-10 h-10 border-4 border-indigo-300 border-t-teal-400 rounded-full animate-spin"></div>
                          <p className="text-gray-600 mt-3">
                            Loading invoices...
                          </p>
                        </div>
                      )}

                      {/* ➤ NO DATA */}
                      {!loadingBills && previousBills?.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl shadow border border-gray-300">
                          <Receipt className="w-16 h-16 text-gray-300 mb-4" />
                          <p className="text-gray-600 text-lg font-medium">
                            No previous billing records found
                          </p>
                        </div>
                      )}

                      {/* ➤ BILL LIST */}
                      {!loadingBills &&
                        previousBills
                          .filter(
                            (bill: any) =>
                              bill.BillStatus?.StatusName?.toLowerCase() ===
                              "finalized"
                          )
                          .map((bill: any) => {
                            const isOpen =
                              expandedBillId === bill.BillingTransactionId;
                            const isPaid =
                              bill.PaymentStatus?.StatusName === "Completed" ||
                              bill.PaymentStatus?.StatusName?.toLowerCase() ===
                                "paid";

                            return (
                              <div
                                key={bill.BillingTransactionId}
                                className="rounded-2xl bg-white shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all"
                              >
                                {/* HEADER */}
                                <div
                                  onClick={() =>
                                    setExpandedBillId(
                                      isOpen ? null : bill.BillingTransactionId
                                    )
                                  }
                                  className="p-6 cursor-pointer hover:bg-gray-50 transition"
                                >
                                  <div className="flex justify-between items-start gap-4 p-4 bg-gradient-to-br from-white via-slate-50 to-white rounded-xl border border-gray-200 shadow-sm">
                                    {/* LEFT SIDE */}
                                    <div className="flex-1 space-y-4">
                                      {/* INVOICE + DATE */}
                                      <div className="flex items-start justify-between flex-wrap gap-3">
                                        <span className="text-md font-semibold text-gray-700">
                                          OPD Invoice No.: {bill.OPInvoiceNo}
                                        </span>

                                        <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-lg shadow-sm">
                                          <Calendar className="w-4 h-4 text-teal-500" />
                                          {new Date(
                                            bill.billDate
                                          ).toLocaleString("en-IN", {
                                            day: "2-digit",
                                            month: "short",
                                            year: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                          })}
                                        </div>
                                      </div>

                                      {/* DOCTOR / BRANCH / CREATED BY */}
                                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="flex items-center gap-3 bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                                          <User className="w-4 h-4 text-indigo-500" />
                                          <div className="flex flex-col leading-tight">
                                            <span className="text-xs text-gray-500">
                                              Towards Doctor
                                            </span>
                                            <span className="font-semibold text-gray-800 font-sans">
                                              Dr.{" "}
                                              {
                                                bill
                                                  .User_BillingTransaction_doctorIdToUser
                                                  ?.firstName
                                              }{" "}
                                              {
                                                bill
                                                  .User_BillingTransaction_doctorIdToUser
                                                  ?.lastName
                                              }
                                            </span>
                                          </div>
                                        </div>

                                        <div className="flex items-center gap-3 bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                                          <Building className="w-4 h-4 text-cyan-600" />
                                          <div className="flex flex-col leading-tight">
                                            <span className="text-xs text-gray-500">
                                              Branch
                                            </span>
                                            <span className="font-semibold text-gray-800 font-sans">
                                              {bill.Hospital?.HospitalName} –{" "}
                                              {bill.Hospital?.city}
                                            </span>
                                          </div>
                                        </div>

                                        <div className="flex items-center gap-3 bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                                          <UserRoundCheck className="w-4 h-4 text-violet-500" />
                                          <div className="flex flex-col leading-tight">
                                            <span className="text-xs text-gray-500">
                                              Created By
                                            </span>
                                            <span className="font-semibold text-gray-800 font-sans">
                                              {
                                                bill
                                                  .User_BillingTransaction_createdByToUser
                                                  ?.firstName
                                              }{" "}
                                              {
                                                bill
                                                  .User_BillingTransaction_createdByToUser
                                                  ?.lastName
                                              }
                                            </span>
                                          </div>
                                        </div>
                                      </div>

                                      {/* AMOUNT SUMMARY */}
                                      <div className="flex items-center gap-6 flex-wrap pt-2">
                                        <div className="bg-white px-4 py-2 rounded-lg shadow border border-gray-300">
                                          <span className="text-xs text-gray-500">
                                            Total
                                          </span>
                                          <p className="text-xl font-bold text-gray-800 ">
                                            ₹{bill.subtotal}
                                          </p>
                                        </div>

                                        <div className="bg-white px-4 py-2 rounded-lg shadow border border-green-200">
                                          <span className="text-xs text-gray-500">
                                            Discount
                                          </span>
                                          <p className="text-xl font-bold text-green-600">
                                            -₹
                                            {Number(bill.totalDiscount) +
                                              Number(bill.overallDiscountValue)}
                                          </p>
                                        </div>

                                        <div className="bg-white px-4 py-2 rounded-lg shadow border border-cyan-300">
                                          <span className="text-xs text-gray-500">
                                            GST
                                          </span>
                                          <p className="text-xl font-bold text-cyan-600">
                                            +₹{bill.totalTax}
                                          </p>
                                        </div>

                                        <div className="bg-white px-4 py-2 rounded-lg shadow border border-teal-300">
                                          <span className="text-xs text-gray-500">
                                            Paid
                                          </span>
                                          <p className="text-xl font-bold text-teal-600">
                                            ₹{bill.amountPaid}
                                          </p>
                                        </div>

                                        {bill.balanceDue > 0 && (
                                          <div className="bg-red-50 px-4 py-2 rounded-lg shadow border border-red-300">
                                            <span className="text-xs text-red-500 font-semibold uppercase">
                                              Due
                                            </span>
                                            <p className="text-xl font-bold text-red-600">
                                              ₹{bill.balanceDue}
                                            </p>
                                          </div>
                                        )}
                                      </div>
                                    </div>

                                    {/* STATUS + CHEVRON */}
                                    <div className="flex flex-col items-end gap-3">
                                      <span
                                        className={`px-4 py-1 rounded-full text-xs font-semibold shadow-md ${
                                          isPaid
                                            ? "bg-green-100 text-green-700"
                                            : "bg-yellow-100 text-yellow-700"
                                        }`}
                                      >
                                        {bill.PaymentStatus?.StatusName}
                                      </span>

                                      <ChevronDown
                                        className={`w-6 h-6 text-gray-500 transition-transform ${
                                          isOpen ? "rotate-180" : ""
                                        }`}
                                      />
                                    </div>
                                  </div>
                                </div>

                                {/* EXPANDED CONTENT */}
                                {isOpen && (
                                  <div className="border-t bg-gradient-to-b from-gray-50 to-white animate-fadeIn border-gray-300">
                                    <div className="p-6 space-y-6">
                                      {/* ➤ CLEAR DUE BUTTON */}
                                      {bill.balanceDue > 0 && (
                                        <div className="flex justify-end">
                                          <Button
                                            disabled={!canPayDue}
                                            onClick={() => {
                                              if (!canPayDue) {
                                                toast.current?.show({
                                                  severity: "error",
                                                  summary: "Error",
                                                  detail:
                                                    "You do not have access. Contact admin.",
                                                });
                                              }
                                              onClearDue(bill);
                                            }}
                                            className={`
    group relative overflow-hidden
    flex items-center gap-2
    bg-gradient-to-r from-teal-500 to-blue-500
    text-white font-semibold
    px-12 py-2 rounded-tr-xl shadow-md
    transition-all duration-300
    ${!canPayDue ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:scale-105 hover:shadow-xl"}
  `}
                                          >
                                            <Banknote
                                              className="
      w-6 h-6 text-white 
      transform transition-all duration-300 
      group-hover:translate-x-1
    "
                                            />
                                            <span className="transition-all duration-300 group-hover:tracking-wide">
                                              Pay Due ₹{bill.balanceDue}
                                            </span>
                                            <span
                                              className="
      absolute inset-0 bg-white/20 opacity-0
      group-hover:opacity-10 transition-opacity duration-300
    "
                                            ></span>
                                          </Button>
                                        </div>
                                      )}

                                      {/* ➤ ACTION BUTTONS */}
                                      <div className="flex items-center gap-3 justify-end">
                                        <Button
                                          disabled={!canEditBilling}
                                          onClick={() => {
                                            if (!canEditBilling) {
                                              toast.current?.show({
                                                severity: "error",
                                                summary: "Error",
                                                detail:
                                                  "You do not have access. Contact admin.",
                                              });
                                              return;
                                            }
                                            onEditBill(bill);
                                          }}
                                          className={`
    group flex items-center gap-2 px-5 py-2 rounded-lg
    bg-gradient-to-r from-teal-500 to-indigo-300 text-white font-medium
    shadow-md transition-all duration-300
    ${!canEditBilling ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:scale-[1.03] hover:shadow-indigo-300/40"}
  `}
                                        >
                                          <SquarePen
                                            className="
      w-4 h-4
      transition-all duration-300
      group-hover:translate-x-[3px]
      group-hover:scale-110
    "
                                          />
                                          Edit Bill
                                        </Button>

                                        <Button
                                          disabled={!canDeleteBilling}
                                          onClick={() => {
                                            if (!canDeleteBilling) {
                                              toast.current?.show({
                                                severity: "error",
                                                summary: "Error",
                                                detail:
                                                  "You do not have access. Contact admin.",
                                              });
                                              return;
                                            }
                                            onDeleteBill(bill);
                                          }}
                                          className={`
    relative flex items-center gap-2 px-5 py-2.5
    bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold rounded-lg shadow-md
    transition-all duration-300
    ${!canDeleteBilling ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:scale-105 hover:shadow-lg hover:from-red-600 hover:to-red-700"}
  `}
                                        >
                                          <Trash2 className="w-4 h-4 transition-transform duration-300 group-hover:rotate-12" />
                                          Delete Bill
                                        </Button>

                                        <Button
                                          onClick={() => onPrintBill(bill)}
                                          className="relative flex items-center gap-2 px-5 py-2.5
             bg-gradient-to-r from-teal-500 to-purple-500
             text-white font-semibold rounded-lg shadow-md cursor-pointer
             transition-all duration-300 
             hover:scale-105 hover:shadow-lg"
                                        >
                                          <Printer className="w-4 h-4 transition-transform duration-300 group-hover:-translate-y-1" />
                                          Print Bill
                                        </Button>
                                      </div>

                                      {/* ➤ ITEMS TABLE */}
                                      <div>
                                        <h3 className="text-sm font-sans text-gray-800 mb-3 flex items-center gap-2">
                                          <Receipt className="w-5 h-5 text-pink-400" />
                                          Items & Charges
                                        </h3>

                                        <div className="rounded-xl border overflow-hidden  border-gray-300 shadow-2xs">
                                          <table className="w-full text-sm border-teal-200">
                                            <thead className="bg-gradient-to-r from-cyan-50 via-indigo-50 to-teal-50">
                                              <tr>
                                                <th className="p-3 text-left">
                                                  Item
                                                </th>
                                                <th className="p-3 text-right">
                                                  Price
                                                </th>
                                                <th className="p-3 text-center">
                                                  Qty
                                                </th>
                                                <th className="p-3 text-right">
                                                  Discount
                                                </th>
                                                <th className="p-3 text-right">
                                                  GST
                                                </th>
                                                <th className="p-3 text-right">
                                                  Amount
                                                </th>
                                              </tr>
                                            </thead>

                                            <tbody>
                                              {bill.BillingTransactionItem.map(
                                                (row: any) => (
                                                  <tr
                                                    key={
                                                      row.BillingTransactionItemId
                                                    }
                                                    className="border-b border-gray-300 hover:bg-pink-50"
                                                  >
                                                    <td className="p-3">
                                                      {row.itemName} —{" "}
                                                      {
                                                        row.BillingItemCharge
                                                          ?.chargeType
                                                          ?.BillItemTypeName
                                                      }
                                                    </td>

                                                    <td className="p-3 text-right">
                                                      ₹{row.price}
                                                    </td>
                                                    <td className="p-3 text-center">
                                                      {row.units}
                                                    </td>
                                                    <td className="p-3 text-right text-green-600">
                                                      -₹{row.discountAmount}
                                                    </td>
                                                    <td className="p-3 text-right">
                                                      ₹{row.gstAmount}
                                                    </td>
                                                    <td className="p-3 text-right font-semibold">
                                                      ₹{row.totalAmount}
                                                    </td>
                                                  </tr>
                                                )
                                              )}
                                            </tbody>
                                          </table>
                                        </div>
                                      </div>

                                      {/* ➤ PAYMENT HISTORY */}
                                      <div>
                                        <h3 className="text-sm font-medium text-gray-800 mb-3 flex items-center gap-2 font-sans">
                                          <CreditCard className="w-5 h-5 text-green-400" />
                                          Payment History
                                        </h3>

                                        {bill.BillingPayment.length === 0 ? (
                                          <div className="p-6 bg-white rounded-xl border text-gray-500 ">
                                            No payment recorded
                                          </div>
                                        ) : (
                                          <div className="rounded-xl border shadow-sm overflow-hidden border-gray-300">
                                            <table className="w-full text-sm">
                                              <thead className="bg-gradient-to-r from-cyan-50 via-indigo-50 to-teal-50">
                                                <tr>
                                                  <th className="p-3 text-left">
                                                    Mode
                                                  </th>
                                                  <th className="p-3 text-right">
                                                    Amount
                                                  </th>
                                                  <th className="p-3 text-right">
                                                    Payment Recept No.
                                                  </th>
                                                  <th className="p-3 text-left">
                                                    Payment Date & Time
                                                  </th>{" "}
                                                  {/* NEW */}
                                                  <th className="p-3 text-left">
                                                    Reference
                                                  </th>
                                                  <th className="p-3 text-right">
                                                    Remarks
                                                  </th>
                                                </tr>
                                              </thead>

                                              <tbody>
                                                {Array.isArray(
                                                  bill?.BillingPayment
                                                ) &&
                                                bill.BillingPayment.length >
                                                  0 ? (
                                                  bill.BillingPayment.map(
                                                    (p: any) => (
                                                      <tr
                                                        key={p.BillingPaymentId}
                                                        className="border-b border-gray-300 hover:bg-green-50"
                                                      >
                                                        <td className="p-3">
                                                          <span className="px-3 py-1 bg-yellow-100 text-yellow-600 rounded-full text-xs font-semibold">
                                                            {p.paymentMode}
                                                          </span>
                                                        </td>

                                                        <td className="p-3 text-right font-bold">
                                                          ₹{p.amount}
                                                        </td>

                                                        <td className="p-3 text-right font-bold">
                                                          {p.PaymentReceptNo ||
                                                            "-"}
                                                        </td>

                                                        <td className="p-3 text-left text-gray-600">
                                                          {formatPaymentDate(
                                                            p.createdAt
                                                          )}
                                                        </td>

                                                        <td className="p-3 text-left text-gray-600">
                                                          {p.referenceNumber ||
                                                            "-"}
                                                        </td>

                                                        <td className="p-3 text-right text-gray-600">
                                                          {p.remarks || "-"}
                                                        </td>
                                                      </tr>
                                                    )
                                                  )
                                                ) : (
                                                  <tr>
                                                    <td
                                                      colSpan={6}
                                                      className="text-center py-4 text-gray-500"
                                                    >
                                                      No payment history found
                                                    </td>
                                                  </tr>
                                                )}
                                              </tbody>
                                            </table>
                                          </div>
                                        )}
                                      </div>

                                      {/* ➤ FINAL SUMMARY */}
                                      <div className="pt-4 border-t border-teal-400">
                                        <div className="bg-gradient-to-r from-cyan-50 via-indigo-50 to-teal-50 rounded-xl shadow-2xs p-5 space-y-3">
                                          <div className="flex justify-between text-sm font-sans">
                                            <span>Total Amount</span>
                                            <span className="text-lg font-bold">
                                              ₹{bill.netAmount}
                                            </span>
                                          </div>

                                          <div className="flex justify-between text-sm font-sans">
                                            <span className="text-green-600">
                                              Amount Paid
                                            </span>
                                            <span className="text-lg font-bold text-green-600">
                                              ₹{bill.amountPaid}
                                            </span>
                                          </div>

                                          {bill.balanceDue > 0 && (
                                            <div className="flex justify-between text-sm pt-2 border-t border-red-300 font-bold text-red-500 font-sans">
                                              <span>Balance Due</span>
                                              <span className="text-lg font-bold">
                                                ₹{bill.balanceDue}
                                              </span>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="cancel-receipts">
                  <div className="min-h-screen bg-gradient-to-br from-blue-50 via-pink-50 to-yellow-50 p-6">
                    <div className="max-w-7xl mx-auto space-y-6">
                      {/* Header */}
                      <div className="flex items-center justify-between">
                        <h1 className="text-xl font-sans text-gray-900 tracking-tight">
                          Cancelled Receipts
                        </h1>

                        <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow border border-gray-200">
                          <Trash2 className="w-4 h-4 text-red-500" />
                          <span className="text-sm font-medium text-gray-700">
                            {
                              previousBills.filter(
                                (b: any) =>
                                  b.BillStatus?.StatusName?.toLowerCase() ===
                                  "cancelled"
                              ).length
                            }{" "}
                            Cancelled
                          </span>
                        </div>
                      </div>

                      {/* Loading */}
                      {loadingBills && (
                        <div className="flex justify-center py-12">
                          Loading...
                        </div>
                      )}

                      {/* No Data */}
                      {!loadingBills &&
                        previousBills.filter(
                          (b: any) =>
                            b.BillStatus?.StatusName?.toLowerCase() ===
                            "cancelled"
                        ).length === 0 && (
                          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl shadow border border-gray-300">
                            <TicketX className="w-16 h-16 text-gray-300 mb-4" />
                            <p className="text-gray-600 text-lg font-medium">
                              No Cancel billing records found
                            </p>
                          </div>
                        )}

                      {/* Cancelled Bills List */}
                      {!loadingBills &&
                        previousBills
                          .filter(
                            (bill: any) =>
                              bill.BillStatus?.StatusName?.toLowerCase() ===
                              "cancelled"
                          )
                          .map((bill: any) => {
                            const isOpen =
                              expandedBillId === bill.BillingTransactionId;

                            return (
                              <div
                                key={bill.BillingTransactionId}
                                className="rounded-2xl bg-white shadow-lg border border-red-200 overflow-hidden hover:shadow-xl transition-all"
                              >
                                <div
                                  onClick={() =>
                                    setExpandedBillId(
                                      isOpen ? null : bill.BillingTransactionId
                                    )
                                  }
                                  className="p-6 cursor-pointer hover:bg-red-50 transition"
                                >
                                  <div className="flex justify-between items-start gap-4">
                                    <div className="space-y-2">
                                      <h2 className="font-semibold text-gray-800">
                                        Invoice No.: {bill.OPInvoiceNo}
                                      </h2>
                                      <p className="text-sm text-gray-500">
                                        {new Date(bill.billDate).toLocaleString(
                                          "en-IN"
                                        )}
                                      </p>

                                      <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">
                                        Cancelled
                                      </span>
                                    </div>

                                    <ChevronDown
                                      className={`w-6 h-6 text-gray-500 transition-transform ${
                                        isOpen ? "rotate-180" : ""
                                      }`}
                                    />
                                  </div>
                                </div>

                                {isOpen && (
                                  <div className="border-t p-6 bg-red-50 border-gray-300 ">
                                    <p className="text-gray-600 text-sm">
                                      Cancelled By:{" "}
                                      <strong>
                                        {bill?.User_BillingTransaction_cancelledByToUser?.firstName || "-"}{" "}
                                        {bill?.User_BillingTransaction_cancelledByToUser?.lastName}
                                      </strong>
                                    </p>

                                    <p className="text-gray-700 text-sm mt-1">
                                      Cancelled At:{" "}
                                      <strong>
                                        {bill.cancelledAt
                                          ? new Date(
                                              bill.cancelledAt
                                            ).toLocaleString("en-IN")
                                          : "-"}
                                      </strong>
                                    </p>

                                    <p className="text-gray-700 text-sm mt-1">
                                      Reason:{" "}
                                      <strong>{bill.remarks || "-"}</strong>
                                    </p>

                                    <div className="mt-4">
                                      <Button
                                        className="bg-indigo-500 text-white"
                                        onClick={() => onPrintBill(bill)}
                                      >
                                        Print Cancel Receipt
                                      </Button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="draft-billing-history">
                  <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-indigo-50 p-6">
                    <div className="max-w-7xl mx-auto space-y-6">
                      {/* HEADER */}
                      <div className="flex items-center justify-between">
                        <h1 className="text-xl font-sans text-gray-900 tracking-tight">
                          Draft Billing History
                        </h1>

                        <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow border border-gray-200">
                          <FileText className="w-4 h-4 text-blue-500" />
                          <span className="text-sm font-medium text-gray-700">
                            {
                              previousBills.filter(
                                (b: any) =>
                                  b.BillStatus?.StatusName?.toLowerCase() ===
                                  "draft"
                              ).length
                            }{" "}
                            Draft Billing
                          </span>
                        </div>
                      </div>

                      {/* LOADING */}
                      {loadingBills && (
                        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl shadow">
                          <div className="w-10 h-10 border-4 border-indigo-300 border-t-blue-500 rounded-full animate-spin"></div>
                          <p className="text-gray-600 mt-3">
                            Loading draft bills...
                          </p>
                        </div>
                      )}

                      {/* NO DATA */}
                      {!loadingBills &&
                        previousBills.filter(
                          (b: any) =>
                            b.BillStatus?.StatusName?.toLowerCase() === "draft"
                        ).length === 0 && (
                          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl shadow border border-gray-300">
                            <NotepadTextDashed className="w-16 h-16 text-gray-300 mb-4" />
                            <p className="text-gray-600 text-lg font-medium">
                              No Draft billing records found
                            </p>
                          </div>
                        )}

                      {/* ---- DRAFT BILL LIST ---- */}
                      {!loadingBills &&
                        previousBills
                          .filter(
                            (bill: any) =>
                              bill.BillStatus?.StatusName?.toLowerCase() ===
                              "draft"
                          )
                          .map((bill: any) => {
                            const isOpen =
                              expandedBillId === bill.BillingTransactionId;

                            return (
                              <div
                                key={bill.BillingTransactionId}
                                className="rounded-2xl bg-white shadow-lg border border-blue-200 overflow-hidden hover:shadow-xl transition-all"
                              >
                                <div
                                  onClick={() =>
                                    setExpandedBillId(
                                      isOpen ? null : bill.BillingTransactionId
                                    )
                                  }
                                  className="p-6 cursor-pointer hover:bg-blue-50 transition"
                                >
                                  <div className="flex justify-between items-start gap-4">
                                    {/* LEFT SIDE */}
                                    <div className="space-y-2">
                                      <h2 className="font-semibold text-gray-800">
                                        {bill.OPInvoiceNo}
                                      </h2>
                                      <p className="text-sm text-gray-500">
                                        {new Date(bill.billDate).toLocaleString(
                                          "en-IN"
                                        )}
                                      </p>

                                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                                        Draft
                                      </span>
                                    </div>

                                    <ChevronDown
                                      className={`w-6 h-6 text-gray-500 transition-transform ${
                                        isOpen ? "rotate-180" : ""
                                      }`}
                                    />
                                  </div>
                                </div>

                                {/* EXPANDED SECTION */}
                                {isOpen && (
                                  <div className="border-t p-6 bg-gradient-to-b from-blue-50 to-white space-y-6 border-gray-300">
                                    {/* ACTION BUTTONS */}
                                    <div className="flex justify-end gap-3">
                                      {/* Continue Editing */}
                                      <Button
                                        onClick={() => onEditBill(bill)}
                                        className="group flex items-center gap-2 px-5 py-2 rounded-lg bg-blue-500 text-white font-medium shadow-md transition-all hover:scale-105"
                                      >
                                        <SquarePen className="w-4 h-4 group-hover:scale-110" />
                                        Continue Editing
                                      </Button>

                                      {/* Delete Draft */}
                                      <Button
                                        onClick={() => onDeleteBill(bill)}
                                        className="flex items-center gap-2 px-5 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                        Delete Draft
                                      </Button>
                                    </div>

                                    {/* DRAFT BILL ITEMS */}
                                    <div>
                                      <h3 className="text-sm font-medium text-gray-800 mb-3 flex items-center gap-2">
                                        <Receipt className="w-4 h-4 text-blue-400" />
                                        Items
                                      </h3>

                                      <div className="rounded-xl border border-blue-200 shadow overflow-hidden">
                                        <table className="w-full text-sm">
                                          <thead className="bg-blue-50">
                                            <tr>
                                              <th className="p-3 text-left">
                                                Item
                                              </th>
                                              <th className="p-3 text-right">
                                                Price
                                              </th>
                                              <th className="p-3 text-center">
                                                Qty
                                              </th>
                                              <th className="p-3 text-right">
                                                Amount
                                              </th>
                                            </tr>
                                          </thead>

                                          <tbody>
                                            {bill.BillingTransactionItem.map(
                                              (item: any) => (
                                                <tr
                                                  key={
                                                    item.BillingTransactionItemId
                                                  }
                                                  className="border-b hover:bg-blue-50 border-gray-300"
                                                >
                                                  <td className="p-3">
                                                    {item.itemName}
                                                  </td>
                                                  <td className="p-3 text-right">
                                                    ₹{item.price}
                                                  </td>
                                                  <td className="p-3 text-center">
                                                    {item.units}
                                                  </td>
                                                  <td className="p-3 text-right font-semibold">
                                                    ₹{item.totalAmount}
                                                  </td>
                                                </tr>
                                              )
                                            )}
                                          </tbody>
                                        </table>
                                      </div>
                                    </div>

                                    {/* SUMMARY */}
                                    <div className="bg-blue-50 rounded-xl p-4 shadow border border-blue-200">
                                      <div className="flex justify-between text-sm">
                                        <span>Total Amount</span>
                                        <span className="font-bold">
                                          ₹{bill.netAmount}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="draft-cancel-history">
                  <div className="min-h-screen bg-gradient-to-br from-pink-100 via-cyan-50 to-indigo-50 p-6">
                    <div className="max-w-7xl mx-auto space-y-6">
                      {/* HEADER */}
                      <div className="flex items-center justify-between">
                        <h1 className="text-xl font-sans text-gray-900 tracking-tight">
                          Draft Billing History
                        </h1>

                        <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow border border-gray-200">
                          <FileText className="w-4 h-4 text-blue-500" />
                          <span className="text-sm font-medium text-gray-700">
                            {
                              previousBills.filter(
                                (b: any) =>
                                  b.BillStatus?.StatusName?.toLowerCase() ===
                                  "cancelleddraft"
                              ).length
                            }{" "}
                            Draft Cancel Billing
                          </span>
                        </div>
                      </div>

                      {/* LOADING */}
                      {loadingBills && (
                        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl shadow">
                          <div className="w-10 h-10 border-4 border-indigo-300 border-t-blue-500 rounded-full animate-spin"></div>
                          <p className="text-gray-600 mt-3">
                            Loading draft bills...
                          </p>
                        </div>
                      )}

                      {/* NO DATA */}
                      {!loadingBills &&
                        previousBills.filter(
                          (b: any) =>
                            b.BillStatus?.StatusName?.toLowerCase() ===
                            "cancelleddraft"
                        ).length === 0 && (
                          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl shadow border border-gray-300">
                            <SquareBottomDashedScissors className="w-16 h-16 text-gray-300 mb-4" />
                            <p className="text-gray-600 text-lg font-medium">
                              No Draft Cancel billing records found
                            </p>
                          </div>
                        )}

                      {/* ---- DRAFT BILL LIST ---- */}
                      {!loadingBills &&
                        previousBills
                          .filter(
                            (bill: any) =>
                              bill.BillStatus?.StatusName?.toLowerCase() ===
                              "cancelleddraft"
                          )
                          .map((bill: any) => {
                            const isOpen =
                              expandedBillId === bill.BillingTransactionId;

                            return (
                              <div
                                key={bill.BillingTransactionId}
                                className="rounded-2xl bg-white shadow-lg border border-blue-200 overflow-hidden hover:shadow-xl transition-all"
                              >
                                <div
                                  onClick={() =>
                                    setExpandedBillId(
                                      isOpen ? null : bill.BillingTransactionId
                                    )
                                  }
                                  className="p-6 cursor-pointer hover:bg-blue-50 transition"
                                >
                                  <div className="flex justify-between items-start gap-4">
                                    {/* LEFT SIDE */}
                                    <div className="space-y-2">
                                      <h2 className="font-semibold text-gray-800">
                                        {bill.OPInvoiceNo}
                                      </h2>
                                      <p className="text-sm text-gray-500">
                                        {new Date(bill.billDate).toLocaleString(
                                          "en-IN"
                                        )}
                                      </p>

                                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                                        Draft
                                      </span>
                                    </div>

                                    <ChevronDown
                                      className={`w-6 h-6 text-gray-500 transition-transform ${
                                        isOpen ? "rotate-180" : ""
                                      }`}
                                    />
                                  </div>
                                </div>

                                {/* EXPANDED SECTION */}
                                {isOpen && (
                                  <div className="border-t p-6 bg-gradient-to-b from-blue-50 to-white space-y-6 border-gray-300">
                                    {/* ACTION BUTTONS */}
                                    <div className="flex justify-end gap-3">
                                      {/* Continue Editing */}
                                      {/* <Button
                                      onClick={() => onEditBill(bill)}
                                      className="group flex items-center gap-2 px-5 py-2 rounded-lg bg-blue-500 text-white font-medium shadow-md transition-all hover:scale-105"
                                    >
                                      <SquarePen className="w-4 h-4 group-hover:scale-110" />
                                      Continue Editing
                                    </Button> */}

                                      {/* Delete Draft */}
                                      {/* <Button
                                      onClick={() => onDeleteBill(bill)}
                                      className="flex items-center gap-2 px-5 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                      Delete Draft
                                    </Button> */}
                                    </div>

                                    {/* DRAFT BILL ITEMS */}
                                    <div>
                                      <h3 className="text-sm font-medium text-gray-800 mb-3 flex items-center gap-2">
                                        <Receipt className="w-4 h-4 text-blue-400" />
                                        Items
                                      </h3>

                                      <div className="rounded-xl border border-blue-200 shadow overflow-hidden">
                                        <table className="w-full text-sm">
                                          <thead className="bg-blue-50">
                                            <tr>
                                              <th className="p-3 text-left">
                                                Item
                                              </th>
                                              <th className="p-3 text-right">
                                                Price
                                              </th>
                                              <th className="p-3 text-center">
                                                Qty
                                              </th>
                                              <th className="p-3 text-right">
                                                Amount
                                              </th>
                                            </tr>
                                          </thead>

                                          <tbody>
                                            {bill.BillingTransactionItem.map(
                                              (item: any) => (
                                                <tr
                                                  key={
                                                    item.BillingTransactionItemId
                                                  }
                                                  className="border-b hover:bg-blue-50 border-gray-300"
                                                >
                                                  <td className="p-3">
                                                    {item.itemName}
                                                  </td>
                                                  <td className="p-3 text-right">
                                                    ₹{item.price}
                                                  </td>
                                                  <td className="p-3 text-center">
                                                    {item.units}
                                                  </td>
                                                  <td className="p-3 text-right font-semibold">
                                                    ₹{item.totalAmount}
                                                  </td>
                                                </tr>
                                              )
                                            )}
                                          </tbody>
                                        </table>
                                      </div>
                                    </div>

                                    {/* SUMMARY */}
                                    <div className="bg-blue-50 rounded-xl p-4 shadow border border-blue-200">
                                      <div className="flex justify-between text-sm">
                                        <span>Total Amount</span>
                                        <span className="font-bold">
                                          ₹{bill.netAmount}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </DialogContent>
      </Dialog>{" "}
    </>
  );
};

export default Billing;
