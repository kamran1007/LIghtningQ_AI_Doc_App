"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";

import { cn } from "@/lib/utils";

function Dialog({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />;
}

function DialogTrigger({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
}

function DialogPortal({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
}

function DialogClose({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
}

function DialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className={cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-white/25  border-white shadow-2xl transition-all duration-300 backdrop-blur-xs",
        className
      )}
      {...props}
    />
  );
}

type DialogSize = "sm" | "md" | "lg" | "fullscreen";

interface DialogContentProps
  extends React.ComponentProps<typeof DialogPrimitive.Content> {
  size?: DialogSize;
}

function DialogContent({
  className,
  children,
  size = "md", // default size
  ...props
}: DialogContentProps) {
  // console.log("DialogContent size:", size);
  const sizeClasses = {
    sm: "w-full max-w-md", // ~448px
    md: "w-full max-w-2xl", // ~672px
    lg: "w-full max-w-5xl", // ~1024px
    fullscreen: "w-[95vw] h-[95vh] max-w-none max-h-none", // fullscreen handled separately
  };

  const heightClass =
    size === "fullscreen" ? "" : "max-h-[calc(100vh-6rem)] overflow-y-auto";

  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        className={cn(
          "fixed top-1/2 left-1/2 z-50 grid transform -translate-x-1/2 -translate-y-1/2 gap-4 rounded-2xl border border-white bg-white p-6 shadow-2xl shadow-blue-100/50 backdrop-blur-md",
          sizeClasses[size],
          heightClass,
          className
        )}
        {...props}
      >
        {children}
      </DialogPrimitive.Content>
    </DialogPortal>
  );
}

// function DialogContent({
//   className,
//   children,
//   ...props
// }: React.ComponentProps<typeof DialogPrimitive.Content>) {
//   return (
//     <DialogPortal data-slot="dialog-portal">
//       <DialogOverlay />
//       <DialogPrimitive.Content
//         data-slot="dialog-content"
//         className={cn(
//           "data-[state=open]:animate-in data-[state=closed]:animate-out " +
//             "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 " +
//             "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 " +
//             "fixed top-1/2 left-1/2 z-50 grid w-full max-w-2xl " + // ✅ medium width
//             "translate-x-[-50%] translate-y-[-50%] gap-4 rounded-xl border " +
//             "p-6 shadow-xl duration-200 bg-background h-[calc(100vh-6rem)] overflow-y-auto", // ✅ slightly reduced height
//           className
//         )}
//         {...props}
//       >
//         {children}
//         {/* Remove or keep this depending on where else you're showing a close icon */}
//         {/* <DialogPrimitive.Close className="absolute top-4 right-4 opacity-70 hover:opacity-100 transition">
//           <XIcon className="size-5" />
//           <span className="sr-only">Close</span>
//         </DialogPrimitive.Close> */}
//       </DialogPrimitive.Content>
//     </DialogPortal>
//   )
// }

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex flex-col gap-2 text-center sm:text-left", className)}
      {...props}
    />
  );
}

function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className
      )}
      {...props}
    />
  );
}

function DialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn("text-lg leading-none font-semibold", className)}
      {...props}
    />
  );
}

function DialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
};
