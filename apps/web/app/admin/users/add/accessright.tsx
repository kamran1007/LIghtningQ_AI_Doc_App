"use client";

import React, { useEffect, useRef, useState } from "react";
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
import { X, Loader2Icon, ChevronDown, ChevronRight } from "lucide-react";
import { User } from "app/admin/hospitaluserlist";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  addUpdateAccessRight,
  fetchAllAccessRightModulesSubmodules,
  getRolePermissions,
} from "@/lib/admin";
import { getProfile } from "@/lib/action";
import { FetchHospital } from "@/lib/dashboard";
import toast from "react-hot-toast";

// ---- Helpers ----
const PERM_KEYS = [
  "CanView",
  "CanCreate",
  "CanUpdate",
  "CanDelete",
  "CanAI_Assist",
] as const;

interface AccessRightProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
}

const AccessRight: React.FC<AccessRightProps> = ({
  open,
  onOpenChange,
  user,
}) => {
  const [selectedHospitalId, setSelectedHospitalId] = useState<number | null>(
    null
  );
  const [modules, setModules] = useState<any[]>([]);
  const [expanded, setExpanded] = useState<number[]>([]);
  const [gridSize, setGridSize] = useState("2"); // default grid view 2x2
  const [loading, setLoading] = useState(true);
  const [userprofiledata, setUserprofiledata] = useState<any>([]);
  const [userprofile, setUserprofile] = useState<any>([]);

  const [hospitalData, setHospitalData] = useState<any[]>([]);
  const [userProfileData, setUserProfileData] = useState<UserType | null>(null);

  const {
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = useForm();

  const hospitalOptions =
    user?.AdminAccess.map((h: any) => ({
      id: h.hospital.HospitalId,
      name: h.hospital.HospitalName,
    })) ?? [];

  // ---- Utility evaluators ----
  const moduleAnyEnabled = (m: any) =>
    (m.SubModules ?? []).some((s: any) => s.enabled);

  const moduleAllEnabled = (m: any) =>
    (m.SubModules ?? []).every((s: any) => s.enabled);

  // ---- Cascading setters ----
  // const setModuleEnabled = (moduleId: number, enabled: boolean) => {
  //   setModules((prev) =>
  //     prev.map((m) => {
  //       if (m.ModuleId !== moduleId) return m;
  //       return {
  //         ...m,
  //         enabled,
  //         SubModules: m.SubModules.map((s: any) => ({
  //           ...s,
  //           enabled,
  //           Permissions: PERM_KEYS.reduce(
  //             (acc, key) => ({ ...acc, [key]: enabled }),
  //             {}
  //           ),
  //         })),
  //       };
  //     })
  //   );
  // };

  // const setSubmoduleEnabled = (
  //   moduleId: number,
  //   subModuleId: number,
  //   enabled: boolean
  // ) => {
  //   setModules((prev) =>
  //     prev.map((m) => {
  //       if (m.ModuleId !== moduleId) return m;
  //       const updatedSubmodules = m.SubModules.map((s: any) =>
  //         s.SubModuleId === subModuleId
  //           ? {
  //               ...s,
  //               enabled,
  //               Permissions: PERM_KEYS.reduce(
  //                 (acc, key) => ({ ...acc, [key]: enabled }),
  //                 {}
  //               ),
  //             }
  //           : s
  //       );
  //       const parentEnabled = updatedSubmodules.some((s: any) => s.enabled);
  //       return { ...m, SubModules: updatedSubmodules, enabled: parentEnabled };
  //     })
  //   );
  // };

  const setModuleEnabled = (moduleId: number, enabled: boolean) => {
    setModules((prev) =>
      prev.map((m) => {
        if (m.ModuleId !== moduleId) return m;
        return {
          ...m,
          enabled,
          SubModules: m.SubModules.map((s: any) => ({
            ...s,
            enabled,
            Permissions: {
              ...s.Permissions, // ✅ keep PermissionId + RolePermissions
              ...PERM_KEYS.reduce(
                (acc, key) => ({ ...acc, [key]: enabled }),
                {}
              ),
            },
          })),
        };
      })
    );
  };

  const setSubmoduleEnabled = (
    moduleId: number,
    subModuleId: number,
    enabled: boolean
  ) => {
    setModules((prev) =>
      prev.map((m) => {
        if (m.ModuleId !== moduleId) return m;
        const updatedSubmodules = m.SubModules.map((s: any) =>
          s.SubModuleId === subModuleId
            ? {
                ...s,
                enabled,
                Permissions: {
                  ...s.Permissions, // ✅ keep PermissionId + RolePermissions
                  ...PERM_KEYS.reduce(
                    (acc, key) => ({ ...acc, [key]: enabled }),
                    {}
                  ),
                },
              }
            : s
        );
        const parentEnabled = updatedSubmodules.some((s: any) => s.enabled);
        return { ...m, SubModules: updatedSubmodules, enabled: parentEnabled };
      })
    );
  };

  const setPermission = (
    moduleId: number,
    subModuleId: number,
    permKey: (typeof PERM_KEYS)[number],
    value: boolean
  ) => {
    setModules((prev) =>
      prev.map((m) => {
        if (m.ModuleId !== moduleId) return m;
        const updatedSubmodules = m.SubModules.map((s: any) => {
          if (s.SubModuleId !== subModuleId) return s;
          const nextPerms = { ...s.Permissions, [permKey]: value };
          const nextSubEnabled = PERM_KEYS.some((k) => nextPerms[k]);
          return { ...s, Permissions: nextPerms, enabled: nextSubEnabled };
        });
        const parentEnabled = updatedSubmodules.some((s: any) => s.enabled);
        return { ...m, SubModules: updatedSubmodules, enabled: parentEnabled };
      })
    );
  };

  const buildPayload = (
    modules: any[],
    roleId: number,
    userId: number,
    hospitalId: number,
    organizationId: number
  ) => {
    return modules.map((m) => ({
      ModuleId: m.ModuleId,
      ModuleName: m.ModuleName,
      IsActive: m.enabled ?? true, // match your frontend toggle

      SubModules: (m.SubModules || []).map((s: any) => ({
        SubModuleId: s.SubModuleId,
        SubModuleName: s.SubModuleName,
        IsActive: s.enabled ?? true,

        Permissions: ([] as any[])
          .concat(s.Permissions ?? []) // convert object or array to array
          .map((p: any) => ({
            PermissionId: p.PermissionId || 0,
            CanView: p.CanView ?? false,
            CanCreate: p.CanCreate ?? false,
            CanUpdate: p.CanUpdate ?? false,
            CanDelete: p.CanDelete ?? false,
            CanAI_Assist: p.CanAI_Assist ?? false,

            RolePermissions: [
              {
                RolePermissionId: p.RolePermissions?.[0]?.RolePermissionId || 0,
                RoleId: roleId,
                HospitalId: hospitalId,
                OrganizationId: organizationId,
                UserId: userId,
              },
            ],
          })),
      })),
    }));
  };

  const onSubmit = async () => {
    try {
      const user = userprofiledata;
      if (!selectedHospitalId) {
        toast.error("Please select a hospital before saving access rights.");
        return;
      }

      const payload = buildPayload(
        modules,
        user.roleId,
        user.UserId,
        selectedHospitalId,
        user.organizationId // ⚠️ case sensitive, make sure it's correct
      );

      const wrappedPayload = { Modules: payload };

      console.log(
        "Final payload to backend:",
        JSON.stringify(wrappedPayload, null, 2)
      );

      const res = await addUpdateAccessRight(wrappedPayload);

      if (res?.status === 200 || res?.success) {
        toast.success("Access rights updated successfully");
        onOpenChange(false);
      } else {
        toast.error("Failed to update access rights");
      }
    } catch (err) {
      console.error("Error submitting access rights:", err);
      toast.error("Failed to update access rights");
    }
  };

  const toggleExpanded = (moduleId: number) => {
    setExpanded((prev = []) =>
      prev.includes(moduleId)
        ? prev.filter((id) => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const fetchPermissions = async (
    RoleId: number,
    UserId: number,
    HospitalId: number,
    organizationId: number
  ) => {
    try {
      setLoading(true);
      const data = await getRolePermissions(
        RoleId,
        UserId,
        HospitalId,
        organizationId
      );
      console.log("access data has been log", data);
      return data;
    } catch (err) {
      console.error("Error fetching role permissions:", err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const fetchInitialData = async () => {
    if (!user) return;

    setUserprofiledata(user);

    const [hosRes, allModulesResp] = await Promise.all([
      FetchHospital(),
      fetchAllAccessRightModulesSubmodules(),
    ]);

    setHospitalData(hosRes ?? []);

    const hospitalId =
      user.AdminAccess?.[0]?.hospitalId || hosRes?.[0]?.HospitalId;

    const allModules = allModulesResp?.return ?? [];

    // let mergedWithPermissions = allModules;

    // if (user?.UserId && hospitalId) {
    //   const rolePermResp = await fetchPermissions(
    //     user.roleId,
    //     user.UserId,
    //     hospitalId,
    //     user.organizationId
    //   );

    //   mergedWithPermissions = mergeModulesWithPermissions(
    //     allModules,
    //     rolePermResp?.return ?? []
    //   );
    // }
    let mergedWithPermissions: any[] = [];

    if (user?.UserId && hospitalId) {
      const rolePermResp = await fetchPermissions(
        user.roleId,
        user.UserId,
        hospitalId,
        user.organizationId
      );

      // 🟢 Union of both: always include allModules + rolePermResp
      const orderedCombinedModules = [
        ...(rolePermResp?.return ?? []),
        ...allModules.filter(
          (m: any) =>
            !(rolePermResp?.return ?? []).some(
              (rm: any) => rm.ModuleId === m.ModuleId
            )
        ),
      ];

      mergedWithPermissions = mergeModulesWithPermissions(
        orderedCombinedModules,
        rolePermResp?.return ?? []
      );
    } else {
      mergedWithPermissions = allModules;
    }

    // ✅ Directly set modules (avoid stale prev merge on first load)
    setModules(mergedWithPermissions);
    isFirstLoad.current = false;
  };

  useEffect(() => {
    fetchInitialData();
  }, [user]);
  useEffect(() => {
    console.log("Modules updated:", modules);
  }, [modules]);

  const isFirstLoad = useRef(true);

  // function mergeModulesWithPermissions(
  //   allModules: any[],
  //   rolePermModules: any[]
  // ): Module[] {
  //   return allModules.map((mod) => {
  //     const roleModule = rolePermModules.find(
  //       (rm) => rm.ModuleId === mod.ModuleId
  //     );

  //     const allSubModules = mod.SubModules ?? mod.Submodules ?? [];

  //     const mergedSubModules = allSubModules.map((sub: any) => {
  //       const roleSub = roleModule?.Submodules?.find(
  //         (rs: any) => rs.SubModuleId === sub.SubModuleId
  //       );

  //       if (roleSub) {
  //         // convert array to object for frontend toggles
  //         const perms = Array.isArray(roleSub.Permissions)
  //           ? roleSub.Permissions[0]
  //           : roleSub.Permissions;

  //         return {
  //           ...roleSub,
  //           Permissions: {
  //             PermissionId: perms.PermissionId ?? 0,
  //             CanView: perms.CanView ?? false,
  //             CanCreate: perms.CanCreate ?? false,
  //             CanUpdate: perms.CanUpdate ?? false,
  //             CanDelete: perms.CanDelete ?? false,
  //             CanAI_Assist: perms.CanAI_Assist ?? false,
  //             RolePermissions: perms.RolePermissions ?? [],
  //           },
  //         };
  //       } else {
  //         // fallback defaults
  //         const defaultPerm = Array.isArray(sub.Permissions)
  //           ? sub.Permissions[0]
  //           : (sub.Permissions ?? {});

  //         return {
  //           ...sub,
  //           Permissions: {
  //             PermissionId: defaultPerm.PermissionId ?? 0,
  //             CanView: defaultPerm.CanView ?? false,
  //             CanCreate: defaultPerm.CanCreate ?? false,
  //             CanUpdate: defaultPerm.CanUpdate ?? false,
  //             CanDelete: defaultPerm.CanDelete ?? false,
  //             CanAI_Assist: defaultPerm.CanAI_Assist ?? false,
  //             RolePermissions: [],
  //           },
  //         };
  //       }
  //     });

  //     return {
  //       ModuleId: mod.ModuleId,
  //       ModuleName: mod.ModuleName,
  //       enabled: roleModule?.enabled ?? mod.enabled ?? true,
  //       SubModules: mergedSubModules,
  //     };
  //   });
  // }

  function mergeModulesWithPermissions(
    allModules: any[],
    rolePermModules: any[]
  ): Module[] {
    return allModules.map((mod) => {
      const roleModule = rolePermModules.find(
        (rm) => rm.ModuleId === mod.ModuleId
      );

      const allSubModules = mod.SubModules ?? mod.Submodules ?? [];
      const roleSubModules =
        roleModule?.SubModules ?? roleModule?.Submodules ?? [];

      const mergedSubModules = allSubModules.map((sub: any) => {
        const roleSub = roleSubModules.find(
          (rs: any) => rs.SubModuleId === sub.SubModuleId
        );
        const perms = roleSub
          ? Array.isArray(roleSub.Permissions)
            ? roleSub.Permissions[0]
            : roleSub.Permissions
          : Array.isArray(sub.Permissions)
            ? sub.Permissions[0]
            : (sub.Permissions ?? {});

        return {
          ...sub,
          ...roleSub, // ✅ overlay role info if exists
          Permissions: {
            PermissionId: perms?.PermissionId ?? 0,
            CanView: perms?.CanView ?? false,
            CanCreate: perms?.CanCreate ?? false,
            CanUpdate: perms?.CanUpdate ?? false,
            CanDelete: perms?.CanDelete ?? false,
            CanAI_Assist: perms?.CanAI_Assist ?? false,
            RolePermissions:
              perms?.RolePermissions?.map((rp: any) => ({
                RolePermissionId: rp.RolePermissionId ?? 0,
                RoleId: rp.RoleId,
                UserId: rp.UserId,
                HospitalId: rp.HospitalId,
                OrganizationId: rp.OrganizationId,
              })) ?? [],
          },
        };
      });

      return {
        ModuleId: mod.ModuleId,
        ModuleName: mod.ModuleName,
        enabled: roleModule?.enabled ?? mod.enabled ?? false, // default false if not found
        SubModules: mergedSubModules,
      };
    });
  }

  type Permission = {
    PermissionId: number;
    CanView: boolean;
    CanCreate: boolean;
    CanUpdate: boolean;
    CanDelete: boolean;
    CanAI_Assist: boolean;
    RolePermissions: {
      RolePermissionId: number;
      RoleId: number;
      UserId: number;
      HospitalId: number;
      OrganizationId: number;
    }[];
  };

  type SubModule = {
    SubModuleId: number;
    SubModuleName: string;
    enabled: boolean;
    Permissions: Permission;
  };

  type Module = {
    ModuleId: number;
    ModuleName: string;
    enabled: boolean;
    SubModules: SubModule[];
  };

  function mergeAccessRights(
    initialModules: Module[],
    savedModules: Module[]
  ): Module[] {
    return initialModules.map((module) => {
      const savedModule = savedModules.find(
        (m) => m.ModuleId === module.ModuleId
      );

      return {
        ...module,
        enabled: savedModule ? savedModule.enabled : module.enabled,
        SubModules: module.SubModules.map((sub) => {
          const savedSub = savedModule?.SubModules?.find(
            (s) => s.SubModuleId === sub.SubModuleId
          );

          return {
            ...sub,
            enabled: savedSub ? savedSub.enabled : sub.enabled,
            Permissions: savedSub?.Permissions
              ? { ...sub.Permissions, ...savedSub.Permissions }
              : sub.Permissions,
          };
        }),
      };
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        size="lg"
        className="max-h-[95vh] overflow-y-auto p-6 max-w-6.5xl rounded-2xl flex flex-col no-scrollbar"
      >
        {/* Header */}
        <div className="flex items-start justify-between px-1 pt-1 mb-4 ">
          <DialogTitle className="text-xl font-sans font-semibold text-teal-400 absolute top-4 left-4">
            User Access Right
          </DialogTitle>

          <DialogClose asChild>
            <button
              className="text-teal-300 hover:bg-teal-100 p-2 rounded-full transition cursor-pointer absolute top-4 right-3"
              title="Close"
            >
              <X className="w-6 h-6" />
            </button>
          </DialogClose>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col flex-1 justify-between"
        >
          {/* Select hospital */}
          <div className="w-[35%] mb-0">
            <Label className="mb-0 block text-sm font-medium text-gray-700">
              Select Hospital (Branch)
            </Label>
            <Select
              value={selectedHospitalId?.toString() || ""}
              onValueChange={(value) => {
                const selectedId = parseInt(value);
                setSelectedHospitalId(selectedId);
                setValue("hospitalId", selectedId);
              }}
            >
              <SelectTrigger className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500">
                <SelectValue placeholder="Select Hospital" />
              </SelectTrigger>
              <SelectContent className="border-white shadow-2xl rounded-2xl">
                {hospitalOptions.map((hosp) => (
                  <SelectItem key={hosp.id} value={hosp.id.toString()}>
                    {hosp.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {/* Grid size selector */}
          <div className="flex justify-end mb-0 border-b border-teal-300 pb-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <Select value={gridSize} onValueChange={setGridSize}>
                      <SelectTrigger className="w-[80px]">
                        <SelectValue placeholder="Grid Size" />
                      </SelectTrigger>
                      <SelectContent className="border-white shadow-2xl rounded-2xl focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500">
                        <SelectItem value="1">1 x 1</SelectItem>
                        <SelectItem value="2">2 x 2</SelectItem>
                        <SelectItem value="3">3 x 3</SelectItem>
                        {/* <SelectItem value="4">4 x 4</SelectItem> */}
                      </SelectContent>
                    </Select>
                  </div>
                </TooltipTrigger>
                <TooltipContent
                  side="top"
                  className=" text-white px-3 py-1.5 rounded-lg shadow-lg text-sm font-medium animate-fade-in"
                >
                  Grid View
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          {/* Modules & Submodules */}
          <div className={`grid gap-2 grid-cols-1 sm:grid-cols-${gridSize}`}>
            {modules?.map((module) => {
              const isAnyEnabled = moduleAnyEnabled(module);
              const isAllEnabled = moduleAllEnabled(module);
              const partial = isAnyEnabled && !isAllEnabled;
              const isExpanded = expanded.includes(module.ModuleId);

              return (
                <Card
                  key={module.ModuleId}
                  className="shadow hover:shadow-lg hover:border-teal-300 border border-transparent transition-all duration-200 p-0 rounded-2xl"
                >
                  <CardContent className="p-2">
                    {/* Module Header */}
                    <div className="flex items-center justify-between">
                      <div
                        className="flex items-center gap-2 cursor-pointer select-none border-b border-teal-200 pb-1"
                        onClick={() => toggleExpanded(module.ModuleId)}
                      >
                        {isExpanded ? <ChevronDown /> : <ChevronRight />}
                        <h2 className="text-lg font-sans font-semibold">
                          {module.ModuleName}
                        </h2>
                      </div>

                      <div className="flex items-center gap-3">
                        {partial && (
                          <span className="text-xs px-2 py-1 rounded bg-amber-100 text-amber-700">
                            Partial
                          </span>
                        )}
                        <span className="text-sm text-gray-600">
                          Enable Module
                        </span>
                        <Switch
                          checked={isAnyEnabled}
                          onCheckedChange={(checked) =>
                            setModuleEnabled(module.ModuleId, checked)
                          }
                          className="data-[state=checked]:bg-teal-400"
                        />
                      </div>
                    </div>

                    {/* Submodules & Permissions */}
                    {isExpanded && (
                      <div className="mt-4 space-y-3">
                        <div className="grid grid-cols-7 gap-2 text-xs font-medium text-gray-600 px-2">
                          <div className="col-span-2">Submodule</div>
                          {PERM_KEYS.map((k) => (
                            <div key={k} className="text-center">
                              {k.replace("Can", "")}
                            </div>
                          ))}
                        </div>

                        {module.SubModules?.map((sub: any) => (
                          <div
                            key={sub.SubModuleId}
                            className="grid grid-cols-7 gap-2 items-center border-t border-teal-200 py-2 px-2"
                          >
                            <div className="col-span-2 flex items-center justify-between pr-3">
                              <span className="text-sm font-medium">
                                {sub.SubModuleName}
                              </span>
                              <div className="flex items-center gap-2">
                                <Switch
                                  checked={sub.enabled}
                                  onCheckedChange={(checked) =>
                                    setSubmoduleEnabled(
                                      module.ModuleId,
                                      sub.SubModuleId,
                                      checked
                                    )
                                  }
                                  className="data-[state=checked]:bg-teal-300"
                                />
                              </div>
                            </div>

                            {PERM_KEYS.map((k) => (
                              <div
                                key={k}
                                className="flex items-center justify-center"
                              >
                                <Switch
                                  checked={sub.Permissions[k]}
                                  onCheckedChange={(checked) =>
                                    setPermission(
                                      module.ModuleId,
                                      sub.SubModuleId,
                                      k,
                                      checked
                                    )
                                  }
                                  className="data-[state=checked]:bg-teal-300"
                                />
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Footer */}
          <DialogFooter className="w-full flex flex-col sm:flex-row justify-end items-center gap-4 mt-6">
            <Button
              type="button"
              className="rounded-full h-10 px-6 cursor-pointer bg-red-500 text-white hover:bg-red-600 shadow-2xl"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="rounded-full h-10 px-6 cursor-pointer bg-green-400 text-white shadow-2xl hover:bg-green-500"
            >
              {isSubmitting ? <Loader2Icon className="animate-spin" /> : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AccessRight;
