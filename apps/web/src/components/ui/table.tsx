// components/ui/table.tsx
import * as React from "react";
import { cn } from "@/lib/utils"; // optional utility for merging classNames

// Table
export const Table = React.forwardRef<
  HTMLTableElement,
  React.TableHTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
  <table
    ref={ref}
    className={cn(
      "w-full text-sm text-left text-gray-500 border border-gray-300 rounded-md",
      className
    )}
    {...props}
  />
));
Table.displayName = "Table";

// TableHeader
export const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead
    ref={ref}
    className={cn("bg-gray-100 text-gray-700", className)}
    {...props}
  />
));
TableHeader.displayName = "TableHeader";

// TableBody
export const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody ref={ref} className={cn("divide-y", className)} {...props} />
));
TableBody.displayName = "TableBody";

// TableRow
export const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr ref={ref} className={cn("", className)} {...props} />
));
TableRow.displayName = "TableRow";

// TableHead
export const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn("px-4 py-2 font-medium text-gray-700", className)}
    {...props}
  />
));
TableHead.displayName = "TableHead";

// TableCell
export const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td ref={ref} className={cn("px-4 py-2", className)} {...props} />
));
TableCell.displayName = "TableCell";
