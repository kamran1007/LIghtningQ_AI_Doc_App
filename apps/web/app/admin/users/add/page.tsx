"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Controller, useForm } from "react-hook-form";
import {
  Signature,
  Hospital,
  LockKeyholeOpen,
  UserCheck,
  RotateCcwKey,
  Loader2Icon,
} from "lucide-react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { fetchHospitals } from "@/store/hospitalSlice";
import { RootState, AppDispatch } from "@/store";
import SignaturePadCanvas, {
  SignaturePadHandle,
} from "@/components/ui/signaturePadCanvas";
import { toast } from "react-hot-toast";
import {
  addhuserdetail,
  getOrganizationByUser,
  getUserRole,
  getUserSpecialization,
  Updateuserinfo,
} from "@/lib/admin";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { useSearchParams } from "next/navigation";
import { getallusers } from "@/lib/admin";
import { User } from "app/admin/hospitaluserlist";
import { useRouter } from "next/navigation"; // App Router
import { zodResolver } from "@hookform/resolvers/zod";
import { userFormSchema } from "@/helper/userFormSchema";
import Aside from "./aside";
import z, { set } from "zod";
import AddUserSkeleton from "@/components/ui/skeletonloader/AddUserSkeleton";
import PasswordStrengthMeter from "@/components/ui/PasswordStrengthMeter";
import { Eye, EyeOff } from "lucide-react";

export default function AddUserPage() {
  const dispatch = useDispatch<AppDispatch>();
  const hospitals = useSelector((state: RootState) => state.hospital.data);
  const hospitalLoading = useSelector(
    (state: RootState) => state.hospital.loading
  );

  useEffect(() => {
    if (!hospitals || hospitals.length === 0) {
      dispatch(fetchHospitals());
    }
  }, [dispatch]);

  const selectedUser = useSelector(
    (state: RootState) => state.user.selectedUser
  );
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");
  const [user, setUser] = useState<User | null>(null);

  const [showPasswordFields, setShowPasswordFields] = useState(false);
  type UserFormSchemaType = z.infer<ReturnType<typeof userFormSchema>>;

  const schema = useMemo(
    () => userFormSchema(showPasswordFields),
    [showPasswordFields]
  );

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    reset,
    watch,
    resetField,
    control,
    formState: { errors, isSubmitting },
  } = useForm<UserFormSchemaType>({
    resolver: zodResolver(schema),
    defaultValues: {
      Prefix: "",
      firstName: "",
      lastName: "",
      mobile: "",
      email: "",
      gender: "",
      dateOfBirth: "",
      passwordHash: "",
      confirmPassword: "",
      roleId: undefined,
      SpecializationId: undefined,
      Experience: "",
      Employee_ID: "",
      imageUrl: "",
      SignatureOfUser: null,
    },
  });
  const [imageUrl, setImageUrl] = useState("");
  // const [signatureFileSelected, setSignatureFileSelected] = useState(false);
  // const [hasDrawnSignature, setHasDrawnSignature] = useState(false);
  const [signatureMethod, setSignatureMethod] = useState<"upload" | "draw">(
    "upload"
  );
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Extract firstName and lastName from form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const initials =
    (firstName?.[0]?.toUpperCase() || "") +
    (lastName?.[0]?.toUpperCase() || "");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImageUrl(reader.result as string);
      setValue("imageUrl", file);
      reader.readAsDataURL(file);
    }
  };
  type SignaturePadExtended = SignaturePad & {
    isEmpty: () => boolean;
    toDataURL: (type: string) => string;
    undo: () => void;
  };
  const router = useRouter();

  const sigRef = useRef<SignaturePadExtended | null>(null);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordValue, setPasswordValue] = useState("");

  // const handleSignatureFileChange = (
  //   e: React.ChangeEvent<HTMLInputElement>
  // ) => {
  //   const file = e.target.files?.[0];
  //   if (file) {
  //     setSignatureFileSelected(true);
  //     setHasDrawnSignature(false); // reset drawing
  //     toast.success("File selected. Drawing disabled.");
  //   } else {
  //     setSignatureFileSelected(false);
  //   }
  // };
  const handleSignatureFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = e.target.files;
    const file = files && files[0] ? files[0] : null;
    if (file) {
      setUploadedFile(file);

      const signatureUrl = URL.createObjectURL(file);
      setPreviewUrl(signatureUrl);

      // Ensure it's set properly in form state
      setValue("SignatureOfUser", file, { shouldValidate: true });

      toast.success("Signature uploaded");
    } else {
      setUploadedFile(null);
    }
  };

  const handleClearSignature = () => {
    sigRef.current?.clear();
    setPreviewUrl(null);
    toast("Signature cleared");
  };

  const handleDrawEnd = async () => {
    if (sigRef.current) {
      const dataUrl = sigRef.current.toDataURL("image/png");
      setPreviewUrl(dataUrl);

      const blob = await fetch(dataUrl).then((res) => res.blob());
      const file = new File([blob], "signature.png", { type: "image/png" });

      // ✅ put into react-hook-form
      setValue("SignatureOfUser", file, { shouldValidate: true });
    }
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };
  const handleCancel = () => {
    reset({
      setRoles: getValues("roleId"), // retain current selected role
      setSpecializations: getValues("SpecializationId"), // retain current selected specialization
    });
  };
  // function handleClearSignature(
  //   event: React.MouseEvent<HTMLButtonElement>
  // ): void {
  //   sigRef.current?.clear(); // ✅ This now works
  //   setSignatureFileSelected(false); // Re-enable canvas AND file input

  //   setHasDrawnSignature(false); // allow file input again
  // }
  const inputbox =
    "w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-800 shadow-md placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-200";
  type Role = {
    RoleId: number;
    Rolename: string;
  };
  // const dispatch = useDispatch<AppDispatch>();

  type Organization = {
    OrganizationId: number;
    OrganizationName: string;
    // add other fields if needed
  };
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [orgLoading, setOrgLoading] = useState(false);
  const [roles, setRoles] = useState<Role[]>([]);
  const [specializations, setSpecializations] = useState([]);
  const [userBranchArray, setUserBranchArray] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null); // for upload

  const handleHospitalCheck = (checked: boolean, hospital: any) => {
    const roleId = Number(getValues("roleId")); // Ensure roleId is a number

    if (!roleId || isNaN(roleId)) {
      console.warn("Please select a valid role before assigning hospitals.");
      toast.error("Please select a valid role before assigning hospitals.");
      return;
    }

    const roleName =
      (roles.find((r) => r.RoleId === roleId) as any)?.Rolename || "Unknown";

    setUserBranchArray((prev) => {
      const alreadyExists = prev.some(
        (item) =>
          item.HospitalId === hospital.HospitalId && item.RoleId === roleId
      );

      if (checked && !alreadyExists) {
        // ✅ Use correct casing for OrganizationId
        return [
          ...prev,
          {
            OrganizationId: hospital.OrganizationId ?? hospital.organizationId,
            RoleId: roleId,
            RoleName: roleName,
            HospitalId: hospital.HospitalId,
            BranchName: hospital.HospitalName,
            ActiveInd: "Y",
            DeleteInd: "N",
          },
        ];
      } else if (!checked && alreadyExists) {
        // Remove hospital if it's being unchecked
        return prev.filter(
          (item) =>
            !(item.HospitalId === hospital.HospitalId && item.RoleId === roleId)
        );
      }

      return prev; // no changes if redundant toggle
    });
  };

  const handleResetPasswordToggle = () => {
    setShowPasswordFields((prev) => {
      const newState = !prev;
      if (!newState) {
        resetField("passwordHash");
        resetField("confirmPassword");
      }
      return newState;
    });
  };
  //onsubmit
  const saveUser = async (formData: any) => {
    if (userBranchArray.length === 0) {
      toast.error("Please assign at least one hospital.");
      return;
    }

    const {
      Prefix,
      firstName,
      lastName,
      Employee_ID,
      mobile,
      gender,
      dateOfBirth,
      email,
      passwordHash,
      SpecializationId,
      Experience,
      roleId,
      SignatureOfUser,
    } = formData;

    const UserOrganizationArray = organizations
      .filter((org: any) => org?.OrganizationId)
      .map((org: any) => ({
        OrganizationId: Number(org.OrganizationId),
        OrganizationName: String(org.OrganizationName || ""),
        ActiveInd: "Y",
        DeleteInd: "N",
      }));

    const formPayload = new FormData();
    formPayload.append("Prefix", Prefix);
    formPayload.append("firstName", firstName);
    formPayload.append("lastName", lastName);
    formPayload.append("Employee_ID", Employee_ID);
    formPayload.append("mobile", mobile);
    formPayload.append("gender", gender);
    formPayload.append("dateOfBirth", dateOfBirth);
    formPayload.append("email", email);
    formPayload.append("passwordHash", passwordHash);
    formPayload.append(
      "organizationId",
      String(UserOrganizationArray[0]?.OrganizationId ?? "")
    );
    formPayload.append("roleId", String(roleId));

    if (SpecializationId)
      formPayload.append("SpecializationId", String(SpecializationId));
    if (Experience) formPayload.append("Experience", String(Experience));

    formPayload.append(
      "UserOrganizationArray",
      JSON.stringify(UserOrganizationArray)
    );
    formPayload.append("UserBranchesArray", JSON.stringify(userBranchArray));

    const imageFile = formData.imageUrl;
    if (imageFile) formPayload.append("imageUrl", imageFile);

    if (SignatureOfUser instanceof File) {
      formPayload.append("SignatureOfUser", SignatureOfUser);
      console.log("Signature file ready:", SignatureOfUser.name);
    } else {
      console.log("⚠️ No signature file present");
    }

    let res;

    if (user?.UserId) {
      res = await Updateuserinfo(user?.UserId, formPayload);
    } else {
      res = await addhuserdetail(formPayload);
    }

    return res;
  };

  const onSubmit = async (data: any) => {
    const formData = new FormData();

    console.log("Before saveUser, SignatureOfUser:", data.SignatureOfUser);
    const res = await saveUser(data); // <-- send FormData, not plain object

    if (res?.return?.HttpCode === 200 || res?.data?.return?.HttpCode === 200) {
      toast.success(
        `User ${user?.UserId ? "updated" : "created"} successfully!`
      );
      setTimeout(() => {
        router.push("/admin");
      }, 1000);
    } else {
      toast.error("Something went wrong");
      console.log(res);
    }
  };

  const handleSaveAndContinue = async () => {
    const formData = getValues(); // from react-hook-form
    const res = await saveUser(formData);

    const Userdata = res?.data?.return?.updatedUser || res?.return?.user;
    const httpCode = res?.return?.HttpCode ?? res?.data?.return?.HttpCode;
    const message = res?.return?.message ?? res?.data?.return?.message;

    if (httpCode === 200) {
      setUser(Userdata);
      toast.success(message || "Changes saved. You can continue.");
    } else {
      toast.error(message || "Something went wrong while saving.");
      console.log(res);
    }
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setOrgLoading(true);
        setIsLoading(true);

        const [orgRes, roleRes, specRes, allUsersRes] = await Promise.all([
          getOrganizationByUser(),
          getUserRole(),
          getUserSpecialization(),
          getallusers(),
        ]);

        const userList = allUsersRes?.return?.data ?? [];

        setOrganizations(orgRes?.return?.data ?? []);
        setRoles(roleRes?.return?.data ?? []);
        setSpecializations(specRes?.return?.data ?? []);

        // ✅ Set user if editing
        if (userId) {
          const foundUser = userList.find(
            (u: { UserId: number }) => u.UserId === Number(userId)
          );
          setUser(foundUser ?? null);
          // console.log("Found user for editing:", foundUser);
          // console.log("Editing user:", user);
        }
      } catch (error) {
        console.error("Failed to fetch data", error);
        toast.error("Failed to fetch initial data");
      } finally {
        setOrgLoading(false);
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, [userId]);

  // 🔁 2. Once user is loaded, prefill the form
  useEffect(() => {
    if (user) {
      setValue("Prefix", user.Prefix);
      setValue("firstName", user.firstName);
      setValue("lastName", user.lastName);
      setValue("Employee_ID", user.Employee_ID);
      setValue("mobile", user.mobile);
      setValue("gender", user.gender);
      setValue("email", user.email);
      const formattedDOB = new Date(user.dateOfBirth)
        .toISOString()
        .split("T")[0];
      setValue("dateOfBirth", formattedDOB || "");
      setValue("roleId", user.roleId);
      setValue("SpecializationId", user.SpecializationId);
      setImageUrl(user.imageUrl ? `http://localhost:8000${user.imageUrl}` : "");
      // setImageUrl(user.imageUrl || "");
      // setSignatureFileSelected(!!user?.SignatureOfUser);
      //     const rawSignature = user?.SignatureOfUser;
      // const fullSignatureUrl = rawSignature
      //   ? `http://localhost:8000${rawSignature}`
      //   : null;

      // setPreviewUrl(fullSignatureUrl);

      //     // Optionally determine upload vs draw
      //     if (
      //       user?.SignatureOfUser?.endsWith(".png") ||
      //       user?.SignatureOfUser?.endsWith(".jpg") ||
      //       user?.SignatureOfUser?.endsWith(".jpeg")
      //     ) {
      //       setSignatureMethod("upload");
      //     } else {
      //       setSignatureMethod("draw");
      //     }
      const rawSignature = user?.SignatureOfUser;
      const fullSignatureUrl = rawSignature
        ? `http://localhost:8000${rawSignature}`
        : null;

      setPreviewUrl(fullSignatureUrl);

      // ✅ File extension match
      const extMatch = rawSignature?.match(/\.(png|jpg|jpeg)$/i);
      setSignatureMethod(extMatch ? "upload" : "draw");
      setValue("Experience", user.Experience);
      const hospitalsFromAccess =
        user?.AdminAccess?.map((access: any) => ({
          OrganizationId: access.hospital.organizationId,
          RoleId: access.roleId,
          HospitalId: access.hospital.HospitalId,
          BranchName: access.hospital.HospitalName,
          ActiveInd: "Y",
          DeleteInd: "N",
        })) || [];

      setUserBranchArray(hospitalsFromAccess);
    }
  }, [user, setValue]); // ✅ dependency should be `user`, not `selectedUser`

  return (
    <div className="flex h-full">
      {isLoading ? (
        <AddUserSkeleton />
      ) : (
        <>
          {/* Sidebar */}
          <Aside user={user} />

          {/* Main Form */}
          <main className="flex-1 p-6 overflow-auto">
            <div className="flex items-center gap-x-4 mb-4">
              <UserCheck className="w-5 h-5 text-teal-500" />
              <h2 className="text-lg font-semibold text-gray-800">
                {user?.UserId ? "Edit User" : "Add User"}
              </h2>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-6"
              encType="multipart/form-data"
            >
              {/* Image Upload & Prefix */}
              <div className="flex items-center gap-4">
                <div className="relative h-20 w-20 rounded-full overflow-hidden group cursor-pointer">
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt="User avatar"
                      width={80}
                      height={80}
                      className="object-cover h-full w-full transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full w-full bg-teal-100">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-10 w-10 text-teal-400"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M12 12c2.67 0 8 1.34 8 4v2H4v-2c0-2.66 5.33-4 8-4Zm0-2a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
                      </svg>
                    </div>
                  )}

                  <div
                    onClick={handleImageClick}
                    title="Edit profile image"
                    aria-label="Edit profile image"
                    className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15.232 5.232l3.536 3.536M9 11l6-6 3.536 3.536a2 2 0 010 2.828l-6 6H9v-2.828a2 2 0 01.586-1.414z"
                      />
                    </svg>
                  </div>
                </div>

                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />

                <div className="mb-1">
                  <Controller
                    name="Prefix"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger
                          className={`${inputbox} py-1 px-4 text-sm leading-tight h-10`}
                        >
                          <SelectValue placeholder="Select Prefix" />
                          <span className="text-red-500">*</span>
                        </SelectTrigger>
                        <SelectContent className="border-gray-300 shadow-2xl rounded-2xl focus:outline-none data-[state=checked]:bg-white data-[highlighted]:bg-white">
                          <SelectItem value="Mr">MR</SelectItem>
                          <SelectItem value="Mrs">MRS</SelectItem>
                          <SelectItem value="Miss">MISS</SelectItem>
                          <SelectItem value="Ms">MS</SelectItem>
                          <SelectItem value="Dr">DR</SelectItem>
                          <SelectItem value="Prof">PROF</SelectItem>
                          <SelectItem value="Other">OTHER</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4">
                {/* First Name */}
                <div className="flex flex-col">
                  <Label className="mb-2 block text-sm">
                    First Name <span className="text-red-500">*</span>
                  </Label>

                  <Input
                    {...register("firstName")}
                    placeholder="First Name"
                    className={`${inputbox} mb-2 py-4`}
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-sm">
                      {errors.firstName.message}
                    </p>
                  )}
                </div>

                {/* Last Name */}
                <div className="flex flex-col">
                  <Label className="mb-2 block text-sm">
                    Last Name <span className="text-red-500">*</span>
                  </Label>

                  <Input
                    {...register("lastName")}
                    placeholder="Last Name"
                    className={`${inputbox} mb-2 py-4`}
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-sm">
                      {errors.lastName.message}
                    </p>
                  )}
                </div>

                {/* Employee ID */}
                <div className="flex flex-col">
                  <Label className="mb-2 block text-sm">Employee ID </Label>

                  <Input
                    {...register("Employee_ID")}
                    placeholder="Employee ID"
                    className={`${inputbox} mb-2 py-4`}
                  />
                  {errors.Employee_ID && (
                    <p className="text-red-500 text-sm">
                      {errors.Employee_ID.message}
                    </p>
                  )}
                </div>

                {/* Mobile */}
                <div className="flex flex-col">
                  <Label className="mb-2 block text-sm">
                    Mobile <span className="text-red-500">*</span>
                  </Label>

                  <Input
                    {...register("mobile")}
                    placeholder="Mobile"
                    maxLength={10}
                    className={`${inputbox} mb-2 py-4`}
                  />
                  {errors.mobile && (
                    <p className="text-red-500 text-sm">
                      {errors.mobile.message}
                    </p>
                  )}
                </div>
                {/* DOB */}
                <div className="flex flex-col">
                  <Label className="mb-2 block text-sm">
                    Date Of Birth <span className="text-red-500">*</span>
                  </Label>

                  <Input
                    {...register("dateOfBirth")}
                    type="date"
                    placeholder="Date of Birth"
                    className={`${inputbox} mb-2 py-4`}
                  />
                  {errors.dateOfBirth && (
                    <p className="text-red-500 text-sm">
                      {errors.dateOfBirth.message}
                    </p>
                  )}
                </div>

                <input type="hidden" {...register("SignatureOfUser")} />
                {/* Gender */}
                {/* <div className="flex flex-col">
              <Input
                {...register("gender")}
                placeholder="Gender"
                className={`${inputbox} mb-2 py-4`}
              />
              {errors.gender && (
                <p className="text-red-500 text-sm">{errors.gender.message}</p>
              )}
            </div> */}
                <div className="mb-1">
                  <Label className="mb-1 block text-sm">
                    Gender <span className="text-red-500">*</span>
                  </Label>
                  <Controller
                    name="gender"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger
                          className={`${inputbox} py-1 px-2 text-sm leading-tight h-10`}
                        >
                          <SelectValue placeholder="Select a Gender" />
                        </SelectTrigger>
                        <SelectContent className="border-gray-300 shadow-2xl rounded-2xl focus:outline-none data-[state=checked]:bg-white data-[highlighted]:bg-white">
                          <SelectItem value="MALE">MALE</SelectItem>
                          <SelectItem value="FEMALE">FEMALE</SelectItem>
                          <SelectItem value="OTHER">OTHER</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                {/* Role */}
                <div className="mb-1">
                  <Label className="mb-1 block text-sm">
                    Role <span className="text-red-500">*</span>
                  </Label>

                  <Controller
                    name="roleId"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...register("roleId")}
                        value={field.value?.toString() ?? ""}
                        onValueChange={(value) => field.onChange(value)}
                      >
                        <SelectTrigger
                          className={`${inputbox} py-1 px-2 text-sm leading-tight h-10`}
                        >
                          <SelectValue placeholder="Select Role" />
                        </SelectTrigger>
                        <SelectContent className="border-gray-300 shadow-2xl rounded-2xl focus:outline-none data-[state=checked]:bg-white data-[highlighted]:bg-white">
                          {roles.map((role: any) => (
                            <SelectItem
                              key={role.RoleId}
                              value={role.RoleId.toString()}
                            >
                              {role.Rolename}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />

                  {errors.roleId && (
                    <p className="text-red-500 text-sm">
                      {errors.roleId.message}
                    </p>
                  )}
                </div>

                {/* Specialization */}
                <div className="mb-1">
                  <Label className="mb-1 block text-sm">Specialization</Label>

                  <Controller
                    name="SpecializationId"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...register("SpecializationId")}
                        value={field.value?.toString() ?? ""}
                        onValueChange={(value) => field.onChange(value)}
                      >
                        <SelectTrigger
                          className={`${inputbox} py-1 px-2 text-sm leading-tight h-10`}
                        >
                          <SelectValue placeholder="Select Specialization" />
                        </SelectTrigger>
                        <SelectContent className="border-gray-300 shadow-2xl rounded-2xl focus:outline-none data-[state=checked]:bg-white data-[highlighted]:bg-white">
                          {specializations.map((spec: any) => (
                            <SelectItem
                              key={spec.SpecializationId}
                              value={spec.SpecializationId.toString()}
                            >
                              {spec.SpecializationName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />

                  {errors.SpecializationId && (
                    <p className="text-red-500 text-sm">
                      {errors.SpecializationId.message}
                    </p>
                  )}
                </div>

                {/* Experience */}
                <div className="flex flex-col">
                  <Label className="mb-1 block text-sm">
                    Year Of Experiance
                  </Label>

                  <Input
                    {...register("Experience")}
                    type="number"
                    placeholder="Year Of Experience"
                    className={`${inputbox} mb-2 py-4`}
                  />
                  {errors.Experience && (
                    <p className="text-red-500 text-sm">
                      {errors.Experience.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Credentials */}
              <div className="space-y-8">
                <div className="flex items-center gap-x-4 mb-4">
                  <LockKeyholeOpen className="w-5 h-5 text-teal-500" />
                  <h2 className="text-lg font-semibold text-gray-800">
                    Credentials
                  </h2>
                </div>
                {/* === Credentials Section === */}
                {/* <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col">
                <Input
                  {...register("email")}
                  placeholder="Email"
                  className={`${inputbox} mb-2 py-4`}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email.message}</p>
                )}
              </div>

              <div className="flex flex-col">
                <Input
                  {...register("passwordHash")}
                  type="password"
                  placeholder="Password"
                  className={`${inputbox} mb-2 py-4`}
                />
                {errors.passwordHash && (
                  <p className="text-red-500 text-sm">
                    {errors.passwordHash.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col">
                <Input
                  {...register("confirmPassword")}
                  type="password"
                  placeholder="Confirm Password"
                  className={`${inputbox} mb-2 py-4`}
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </div> */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex flex-col">
                    <Label className="mb-1 block text-sm">
                      Email <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      {...register("email")}
                      placeholder="Email"
                      className={`${inputbox} mb-2 py-4`}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  {!showPasswordFields && user?.UserId ? (
                    <div className="flex justify-end mt-4">
                      <button
                        type="button"
                        onClick={handleResetPasswordToggle}
                        className="flex items-center gap-2 text-sm text-teal-600 hover:text-teal-800 underline transition duration-200 cursor-pointer"
                      >
                        <div className="flex items-center gap-x-4 mb-2">
                          <RotateCcwKey className="w-5 h-5 text-teal-500" />
                          <h2 className="text-md font-semibold text-teal-500">
                            Reset Password?
                          </h2>
                        </div>
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="flex flex-col">
                        <Label className="mb-1 block text-sm">
                          Password <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          {...register("passwordHash")}
                          type="password"
                          placeholder="New Password"
                          className={`${inputbox} mb-2 py-4`}
                          onChange={(e) =>
                            setValue("passwordHash", e.target.value)
                          }
                        />
                        <PasswordStrengthMeter
                          password={watch("passwordHash")}
                        />
                        {errors.passwordHash && (
                          <p className="text-red-500 text-sm">
                            {errors.passwordHash.message}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-col">
                        <Label className="mb-1 block text-sm">
                          Confirm Password
                          <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          {...register("confirmPassword")}
                          type="password"
                          placeholder="Confirm New Password"
                          className={`${inputbox} mb-2 py-4`}
                        />

                        {/* Real-time password match validation */}
                        {watch("passwordHash") &&
                          watch("confirmPassword") &&
                          watch("passwordHash") !==
                            watch("confirmPassword") && (
                            <p className="text-red-500 text-sm mb-2">
                              Passwords do not match
                            </p>
                          )}

                        {/* Show success message when passwords match */}
                        {watch("passwordHash") &&
                          watch("confirmPassword") &&
                          watch("passwordHash") === watch("confirmPassword") &&
                          watch("confirmPassword").length > 0 && (
                            <p className="text-green-600 text-sm mb-2 flex items-center">
                              <svg
                                className="w-4 h-4 mr-1"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M5 13l4 4L19 7"
                                ></path>
                              </svg>
                              Passwords match
                            </p>
                          )}

                        {/* Form validation errors */}
                        {errors.confirmPassword && (
                          <p className="text-red-500 text-sm">
                            {errors.confirmPassword.message}
                          </p>
                        )}
                      </div>
                    </>
                  )}
                </div>

                {/* === User Signature Section === */}
                <div className="p-0">
                  <div className="flex items-center gap-x-4 mb-4">
                    <Signature className="w-5 h-5 text-teal-500" />
                    <h2 className="text-lg font-semibold text-gray-800">
                      User Signature
                    </h2>
                  </div>

                  {/* Signature Input Section */}
                  {/* Radio Selection */}
                  <div className="flex gap-4 mb-4">
                    <label className="flex items-center gap-2 text-sm text-gray-700">
                      <input
                        type="radio"
                        name="signatureMethod"
                        value="upload"
                        className="w-4 h-4 accent-teal-400"
                        checked={signatureMethod === "upload"}
                        onChange={() => {
                          setSignatureMethod("upload");
                          setPreviewUrl(null);
                          // sigRef.current?.clear();
                        }}
                      />
                      Upload
                    </label>
                    <label className="flex items-center gap-2 text-sm text-gray-700">
                      <input
                        type="radio"
                        name="signatureMethod"
                        value="draw"
                        className="w-4 h-4 accent-teal-400"
                        checked={signatureMethod === "draw"}
                        onChange={() => {
                          setSignatureMethod("draw");
                          setPreviewUrl(null);
                        }}
                      />
                      Draw
                    </label>
                  </div>

                  {/* Upload Section */}
                  {/* {signatureMethod === "upload" && (
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">
                    Upload Signature
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleSignatureFileChange}
                    className="border px-2 py-1 w-72"
                  />
                </div>
              )} */}

                  {/* Draw Section */}
                  <div className="flex flex-col md:flex-row gap-8">
                    {/* Left Side: Upload or Draw */}
                    <div className="flex flex-col gap-2">
                      {signatureMethod === "upload" ? (
                        <>
                          <label className="text-sm font-medium text-gray-700">
                            Upload Signature
                          </label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleSignatureFileChange}
                            className="border px-2 py-1 w-72"
                          />
                        </>
                      ) : (
                        <>
                          <label className="text-sm font-medium text-gray-700">
                            Draw Signature
                          </label>
                          <div className="border border-gray-400 w-72 h-32 bg-white">
                            <SignaturePadCanvas
                              ref={sigRef}
                              penColor="black"
                              onEnd={handleDrawEnd}
                              canvasProps={{
                                width: 288,
                                height: 128,
                                className: "bg-white",
                              }}
                            />
                          </div>
                          <div className="flex gap-4 mt-2">
                            <button
                              type="button"
                              onClick={handleClearSignature}
                              className="text-sm text-teal-600 hover:underline"
                            >
                              Clear
                            </button>
                            <button
                              type="button"
                              onClick={() => sigRef.current?.undo()}
                              className="text-sm text-teal-600 hover:underline"
                            >
                              Undo
                            </button>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Right Side: Preview */}
                    <div className="flex flex-col">
                      <label className="text-sm font-medium text-gray-700 mb-1">
                        Preview
                      </label>
                      <div className="w-72 h-32 border rounded bg-gray-100 flex items-center justify-center text-gray-400">
                        {previewUrl ? (
                          <Image
                            src={previewUrl}
                            alt="Signature Preview"
                            width={150}
                            height={80}
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          "No signature yet"
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Hospital Assignment */}
              {/* Organization Assignment */}
              {/* <div className="mt-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Assign Organization
            </h2>

            <div className="flex flex-wrap gap-4">
              {orgLoading ? (
                <p className="text-gray-500">Loading organizations...</p>
              ) : organizations.length > 0 ? (
                organizations.map((org: any) => (
                  <label key={org.OrganizationId} className="flex items-center gap-2">
                    <Checkbox
                      value={org.OrganizationId}
                      {...register("organizations")} // ✅ Add this line
                    />
                    {org.OrganizationName}
                  </label>
                ))
              ) : (
                <p className="text-gray-500">No organizations found.</p>
              )}
            </div>
          </div> */}
              <div>
                <div className="flex items-center gap-x-4 mb-4">
                  <Hospital className="w-5 h-5 text-teal-500" />
                  <h2 className="text-lg font-semibold text-gray-800">
                    Assign Hospital <span className="text-red-500">*</span>
                  </h2>
                </div>

                <div className="flex flex-wrap gap-4">
                  {hospitalLoading ? (
                    <p className="text-gray-500">Loading hospitals...</p>
                  ) : hospitals?.length > 0 ? (
                    hospitals.map((hospital: any) => {
                      const roleId = Number(getValues("roleId"));

                      const isChecked = userBranchArray.some(
                        (item) =>
                          item.HospitalId === hospital.HospitalId &&
                          item.RoleId === roleId
                      );

                      return (
                        <label
                          key={hospital.HospitalId}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <Checkbox
                            checked={isChecked}
                            onCheckedChange={(checked) =>
                              handleHospitalCheck(Boolean(checked), hospital)
                            }
                            className="data-[state=checked]:bg-teal-400 data-[state=checked]:border-teal-400"
                          />
                          <span
                            className={`${
                              isChecked
                                ? "text-gray-900 font-medium"
                                : "text-gray-700"
                            }`}
                          >
                            {hospital.HospitalName}- {hospital.city}
                          </span>
                        </label>
                      );
                    })
                  ) : (
                    <p className="text-gray-500">No hospitals found.</p>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end mt-4">
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="bg-red-400 hover:bg-red-500 text-white px-5 py-2 rounded-4xl shadow-2xl transition disabled:opacity-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full shadow-2xl transition duration-200 ease-in-out cursor-pointer"
                  >
                    {isSubmitting ? (
                      <Loader2Icon className="animate-spin" />
                    ) : (
                      "Submit"
                    )}
                  </button>
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={handleSaveAndContinue}
                    className="bg-sky-500 hover:bg-sky-600 text-white px-6 py-2 rounded-full shadow-2xl transition duration-200 ease-in-out cursor-pointer"
                  >
                    {isSubmitting ? (
                      <Loader2Icon className="animate-spin" />
                    ) : (
                      "Save and Continue"
                    )}
                  </button>
                </div>
              </div>
            </form>
          </main>
        </>
      )}
    </div>
  );
}
