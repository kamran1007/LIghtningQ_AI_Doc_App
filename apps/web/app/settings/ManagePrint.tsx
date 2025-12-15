"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, ImageDown } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Toast } from "primereact/toast";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { upsertPrintData, GetprintSetting } from "@/lib/setting"; // <- your helpers
import Image from "next/image";
import { useSelector } from "react-redux";
import { fixCDNUrl } from "@/utils/fixCDNUrl";

type Props = {
  open: boolean;
  onClose: (open: boolean) => void;
};

const pageNameToId = { Billing: 1, Prescription: 2, "Visit Summary": 3 };
const idToPageName = { 1: "Billing", 2: "Prescription", 3: "Visit Summary" };

const ManagePrint: React.FC<Props> = ({ open, onClose }) => {
  const toast = useRef<Toast | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // form state
  const [selectedPage, setSelectedPage] = useState<string>("Billing");
  const [pageType, setPageType] = useState<string>("Without Letter");
  const [pageSize, setPageSize] = useState<string>("A4");
  const [orientation, setOrientation] = useState<string>("Portrait");
  const [margins, setMargins] = useState<{
    top: number;
    bottom: number;
    left: number;
    right: number;
  }>({
    top: 10,
    bottom: 10,
    left: 10,
    right: 10,
  });

  // file uploads + previews
  const [headerLogoFile, setHeaderLogoFile] = useState<File | null>(null);
  const [footerLogoFile, setFooterLogoFile] = useState<File | null>(null);
  const [headerPreview, setHeaderPreview] = useState<string | null>(null);
  const [footerPreview, setFooterPreview] = useState<string | null>(null);

  // track doctorPrintSetting id when editing existing record
  const [DoctorPrintSettingId, setDoctorPrintSettingId] = useState<
    number | null
  >(null);

  // global logos from DB (URLs) — we keep them to show previews and send back if unchanged
  const [globalLogos, setGlobalLogos] = useState({
    printHeaderImgUrl: "",
    printHeaderImgAlignment: "center",
    printImageHeaderUrl: "",
    printImageFooterUrl: "",
    printBillingLogoUrl: "",
    printPrescriptionLogoUrl: "",
    printVisitSummaryLogoUrl: "",
  });

  const hospitalSelection = useSelector(
    (state: any) => state.hospitalSelection?.selectedHospital
  );
  const [details, setDetails] = useState<any[]>([]);

  //userData

  const userId = hospitalSelection.UserId;

  const parentOrganizationId = hospitalSelection.hospital.organizationId;

  const hospitalId = hospitalSelection.hospital.HospitalId;

  // load existing when open
  useEffect(() => {
    if (!open) return;

    const load = async () => {
      try {
        setLoading(true);

        const apiResponse = await GetprintSetting(
          userId,
          hospitalId,
          parentOrganizationId
        );

        console.log("API RAW:", apiResponse);

        const setting = apiResponse?.data; // ⬅️ MAIN FIX

        if (!setting) {
          // No record → set defaults
          setDoctorPrintSettingId(null);
          setGlobalLogos({
            printHeaderImgUrl: "",
            printHeaderImgAlignment: "center",
            printImageHeaderUrl: "",
            printImageFooterUrl: "",
            printBillingLogoUrl: "",
            printPrescriptionLogoUrl: "",
            printVisitSummaryLogoUrl: "",
          });

          setSelectedPage("");
          setPageType("Without Letter");
          setPageSize("A4");
          setOrientation("Portrait");
          setMargins({ top: 10, bottom: 10, left: 10, right: 10 });
          return;
        }

        // ---------------------------
        // TOP LEVEL VALUES
        // ---------------------------
        setDoctorPrintSettingId(setting.DoctorPrintSettingId ?? null);

        setGlobalLogos({
          printHeaderImgUrl: setting.globalLogos?.printHeaderImgUrl ?? "",
          printHeaderImgAlignment:
            setting.globalLogos?.printHeaderImgAlignment ?? "center",
          printImageHeaderUrl: setting.globalLogos?.printImageHeaderUrl ?? "",
          printImageFooterUrl: setting.globalLogos?.printImageFooterUrl ?? "",
          printBillingLogoUrl: setting.globalLogos?.printBillingLogoUrl ?? "",
          printPrescriptionLogoUrl:
            setting.globalLogos?.printPrescriptionLogoUrl ?? "",
          printVisitSummaryLogoUrl:
            setting.globalLogos?.printVisitSummaryLogoUrl ?? "",
        });

        // ---------------------------
        // DETAILS → Bind per-page settings
        // ---------------------------
        if (Array.isArray(setting.details) && setting.details.length > 0) {
          setDetails(setting.details);

          const d = setting.details[0];

          const resolvedPageName =
            d.pageName ||
            idToPageName[d.printPageId as keyof typeof idToPageName] ||
            "Billing";

          setSelectedPage(resolvedPageName);
          setPageType(d.letterHeadValue ?? "Without Letter");

          if (d.pageSettings) {
            setPageSize(d.pageSettings.pageSize ?? "A4");
            setOrientation(d.pageSettings.pageOrientation ?? "Portrait");
            setMargins({
              top: d.pageSettings.marginTop ?? 10,
              bottom: d.pageSettings.marginBottom ?? 10,
              left: d.pageSettings.marginLeft ?? 10,
              right: d.pageSettings.marginRight ?? 10,
            });
          }

          if (setting.globalLogos?.printHeaderImgUrl) {
            setHeaderPreview(fixCDNUrl(setting.globalLogos.printHeaderImgUrl));
          }

          if (setting.globalLogos?.printImageFooterUrl) {
            setFooterPreview(
              fixCDNUrl(setting.globalLogos.printImageFooterUrl)
            );
          }
        }
      } catch (err) {
        console.error("Failed to load print setting:", err);
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: "Failed to load print settings.",
        });
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [open, hospitalId, parentOrganizationId]);

  // file change handlers
  const onHeaderFile = (f?: File | null) => {
    setHeaderLogoFile(f ?? null);
    if (f) setHeaderPreview(URL.createObjectURL(f));
  };
  const onFooterFile = (f?: File | null) => {
    setFooterLogoFile(f ?? null);
    if (f) setFooterPreview(URL.createObjectURL(f));
  };

  // helpers for margins
  const setMargin = (which: "top" | "bottom" | "left" | "right", val: number) =>
    setMargins((m) => ({ ...m, [which]: val }));

  // Save / Upsert handler
  const handleSave = async () => {
    try {
      setSaving(true);

      // build payload as your backend expects
      const payload: any = {
        // don't pass DoctorPrintSettingId unless you want update-by-id; backend will find existing by user/hospital/org
        parentOrganizationId: hospitalSelection?.hospital?.organizationId,
        hospitalId: hospitalSelection.hospital?.HospitalId,
        userId: hospitalSelection?.UserId,
        language: 1,
        type: true,

        globalLogos: {
          // keep existing DB urls if present (backend will merge uploaded files)
          printHeaderImgUrl: globalLogos.printHeaderImgUrl || "",
          printHeaderImgAlignment:
            globalLogos.printHeaderImgAlignment || "center",
          printImageHeaderUrl: globalLogos.printImageHeaderUrl || "",
          printImageFooterUrl: globalLogos.printImageFooterUrl || "",
        },

        Printdetails: [
          {
            printPageId:
              pageNameToId[selectedPage as keyof typeof pageNameToId] ?? 1,
            letterHeadValue: pageType,
            pageSettings: {
              pageSize,
              pageOrientation: orientation,
              marginTop: margins.top,
              marginBottom: margins.bottom,
              marginLeft: margins.left,
              marginRight: margins.right,
            },
            customSettings: {
              headerSettings: "",
              contentSettings: "",
              footerSettings: "",
            },
          },
        ],
      };

      // Attach files using the names your backend expects (frontend's upsertPrintData maps to these keys)
      if (headerLogoFile) payload.headerLogoFile = headerLogoFile;
      if (footerLogoFile) payload.footerLogoFile = footerLogoFile;

      // call upsert helper (it does FormData + auth)
      await upsertPrintData(payload);

      toast.current?.show({
        severity: "success",
        summary: "Saved",
        detail: "Print settings saved successfully.",
      });

      // close
      onClose(false);
    } catch (err) {
      console.error(err);
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to save print settings.",
      });
    } finally {
      setSaving(false);
    }
  };

  // UI: small subcomponents for file inputs with preview
  const FileInputPreview: React.FC<{
    label: string;
    file?: File | null;
    preview?: string | null;
    onSelect: (f: File | null) => void;
  }> = ({ label, preview, onSelect }) => {
    return (
      <div>
        <label className="text-sm font-medium text-gray-600">{label}</label>
        <div className="mt-2 p-3 border rounded-xl bg-gray-50 border-gray-300">
          <input
            type="file"
            accept="image/*"
            className="w-full cursor-pointer"
            onChange={(e) => {
              const f = e.target.files?.[0] ?? null;
              onSelect(f);
            }}
          />
          <p className="text-gray-500 text-xs mt-2">
            Upload .png, .jpg, .jpeg | Max size 5mb
          </p>
          <div className="mt-3 w-full h-28 border rounded-lg overflow-hidden bg-white flex items-center justify-center">
            {preview ? (
              // next/image requires valid URL — for local blob previews, use native <img>
              preview.startsWith("blob:") || preview.startsWith("data:") ? (
                // blob/object url
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={preview}
                  alt="preview"
                  className="h-full object-contain"
                />
              ) : (
                // remote url
                // use next/image with unoptimized to avoid problems in dev
                <Image
                  src={preview}
                  alt="preview"
                  width={400}
                  height={150}
                  unoptimized
                  className="object-contain h-full"
                />
              )
            ) : (
              <div className="text-gray-400 text-sm">No image selected</div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // When Page Name changes
  const onPageChange = (page: string) => {
    setSelectedPage(page);

    const selected = details.find(
      (d: any) =>
        d.printPageId === pageNameToId[page as keyof typeof pageNameToId]
    );

    if (!selected) {
      setPageType("Without Letter");
      setPageSize("A4");
      setOrientation("Portrait");
      setMargins({ top: 10, bottom: 10, left: 10, right: 10 });
      setHeaderPreview(globalLogos.printHeaderImgUrl || null);
      setFooterPreview(globalLogos.printImageFooterUrl || null);
      return;
    }

    setPageType(selected.letterHeadValue);
    setPageSize(selected.pageSettings.pageSize);
    setOrientation(selected.pageSettings.pageOrientation);
    setMargins({
      top: selected.pageSettings.marginTop,
      bottom: selected.pageSettings.marginBottom,
      left: selected.pageSettings.marginLeft,
      right: selected.pageSettings.marginRight,
    });

    setHeaderPreview(globalLogos.printHeaderImgUrl || null);
    setFooterPreview(globalLogos.printImageFooterUrl || null);
  };

  return (
    <>
      <Toast ref={toast} />

      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent
          className="bg-white/90 backdrop-blur-md rounded-2xl border border-gray-300 shadow-xl max-w-6xl p-6 no-scrollbar"
          onInteractOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          <div>
            <DialogHeader>
              <DialogTitle className="text-2xl font-semibold text-gray-700">
                Manage Print Settings
              </DialogTitle>

              <button
                onClick={() => onClose(false)}
                className="text-gray-500 hover:text-red-500 p-2 rounded-full absolute top-4 right-4 cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </DialogHeader>

            <Tabs
              value="print"
              onValueChange={() => {}}
              className="w-full mt-6"
            >
              <TabsList className="flex gap-3 mb-6 bg-gray-100 p-2 rounded-full">
                <TabsTrigger
                  value="print"
                  className="rounded-full px-5 py-2 text-sm font-medium bg-blue-600 text-white shadow-md"
                >
                  Print Settings
                </TabsTrigger>
              </TabsList>

              <TabsContent value="print">
                {loading ? (
                  <div className="py-8 text-center text-gray-500">
                    Loading...
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* left */}
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-600">
                          Page Name
                        </label>
                        <Select
                          value={selectedPage}
                          onValueChange={onPageChange}
                        >
                          <SelectTrigger className="w-full mt-1">
                            <SelectValue placeholder="Select Page Name">
                              {selectedPage}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent className="border-white shadow-2xl rounded-2xl">
                            <SelectItem value="Billing">Billing</SelectItem>
                            <SelectItem value="Prescription">
                              Prescription
                            </SelectItem>
                            <SelectItem value="Visit Summary">
                              Visit Summary
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-600">
                          Page Type
                        </label>
                        <div className="flex gap-6 mt-2">
                          {[
                            "With Letter",
                            "Without Letter",
                            "With Image(Header/Footer)",
                          ].map((item) => (
                            <label
                              key={item}
                              className="flex items-center gap-2 cursor-pointer"
                            >
                              <input
                                type="radio"
                                name="pageType"
                                checked={pageType === item}
                                onChange={() => setPageType(item)}
                                className="accent-teal-400"
                              />
                              <span className="text-gray-700 text-sm">
                                {item}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-600">
                            Page Size
                          </label>
                          <Select
                            value={pageSize}
                            onValueChange={(v: string) => setPageSize(v)}
                          >
                            <SelectTrigger className="w-full mt-1">
                              <SelectValue placeholder="Select Page Size" />
                            </SelectTrigger>
                            <SelectContent className="border-white shadow-2xl rounded-2xl">
                              <SelectItem value="A4">A4</SelectItem>
                              <SelectItem value="A5">A5</SelectItem>
                              <SelectItem value="Letter">Letter</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <label className="text-sm font-medium text-gray-600">
                            Orientation
                          </label>
                          <Select
                            value={orientation}
                            onValueChange={(v: string) => setOrientation(v)}
                          >
                            <SelectTrigger className="w-full mt-1">
                              <SelectValue placeholder="Select Orientation" />
                            </SelectTrigger>
                            <SelectContent className="border-white shadow-2xl rounded-2xl">
                              <SelectItem value="Portrait">Portrait</SelectItem>
                              <SelectItem value="Landscape">
                                Landscape
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-4 gap-3 border-gray-300">
                        {[
                          { label: "Top", key: "top" },
                          { label: "Bottom", key: "bottom" },
                          { label: "Left", key: "left" },
                          { label: "Right", key: "right" },
                        ].map((m) => (
                          <div key={m.key}>
                            <label className="text-sm font-medium text-gray-600">
                              {m.label}
                            </label>
                            <input
                              type="number"
                              className="w-full border rounded-lg p-2 mt-1 border-gray-300"
                              value={
                                m.key === "top"
                                  ? margins.top
                                  : m.key === "bottom"
                                    ? margins.bottom
                                    : m.key === "left"
                                      ? margins.left
                                      : margins.right
                              }
                              onChange={(e) =>
                                setMargin(m.key as any, Number(e.target.value))
                              }
                            />
                          </div>
                        ))}
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-600">
                          Header Logo Alignment
                        </label>
                        <div className="flex gap-6 mt-1">
                          {["Right", "Left", "Center"].map((align) => (
                            <label
                              key={align}
                              className="flex items-center gap-2"
                            >
                              <input
                                type="radio"
                                name="logoAlign"
                                defaultChecked={
                                  globalLogos.printHeaderImgAlignment ===
                                    align.toLowerCase() ||
                                  globalLogos.printHeaderImgAlignment === align
                                }
                                onChange={() =>
                                  setGlobalLogos((g) => ({
                                    ...g,
                                    printHeaderImgAlignment:
                                      align.toLowerCase(),
                                  }))
                                }
                              />
                              <span className="text-gray-700 text-sm">
                                {align}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* right */}
                    <div>
                      {pageType === "With Image(Header/Footer)" ? (
                        <div>
                          <label className="text-sm font-medium text-gray-600">
                            Select Logo
                          </label>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 border-gray-300">
                            <div className="border-gray-200">
                              <FileInputPreview
                                label="Upload Header Image"
                                preview={
                                  fixCDNUrl(headerPreview) ||
                                  fixCDNUrl(globalLogos.printHeaderImgUrl) ||
                                  fixCDNUrl(globalLogos.printImageHeaderUrl)
                                }
                                onSelect={(f) => onHeaderFile(f ?? null)}
                              />
                            </div>

                            <div className="border-gray-200">
                              <FileInputPreview
                                label="Upload Footer Image"
                                preview={
                                  fixCDNUrl(footerPreview) ||
                                  fixCDNUrl(globalLogos.printImageFooterUrl)
                                }
                                onSelect={(f) => onFooterFile(f ?? null)}
                              />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-sm text-gray-500">
                          Select "With Image(Header/Footer)" to upload
                          header/footer images.
                        </div>
                      )}
                    </div>

                    {/* footer buttons */}
                    <div className="col-span-full flex justify-end gap-3 mt-6 border-t pt-4 border-gray-300">
                      <Button
                        variant="outline"
                        className="px-6 py-2 rounded-xl border-gray-300"
                        onClick={() => onClose(false)}
                      >
                        Cancel
                      </Button>

                      <Button
                        className="px-6 py-2 w-32 rounded-xl bg-green-500 hover:bg-green-600 text-white shadow-md"
                        onClick={handleSave}
                        disabled={saving}
                      >
                        <ImageDown className="inline-block mr-2" />
                        {saving ? "Saving..." : "Save"}
                      </Button>
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ManagePrint;
