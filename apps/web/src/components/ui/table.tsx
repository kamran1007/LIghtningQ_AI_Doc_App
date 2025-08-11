// components/ui/table.tsx
import React from "react";

export function Table({ children }: { children: React.ReactNode }) {
  return (
    <table className="w-full text-sm text-left text-gray-500 border border-gray-300 rounded-md">
      {children}
    </table>
  );
}

export function TableHeader({ children }: { children: React.ReactNode }) {
  return <thead className="bg-gray-100 text-gray-700">{children}</thead>;
}

export function TableBody({ children }: { children: React.ReactNode }) {
  return <tbody className="divide-y">{children}</tbody>;
}

export function TableRow({ children }: { children: React.ReactNode }) {
  return <tr>{children}</tr>;
}

export function TableHead({ children }: { children: React.ReactNode }) {
  return <th className="px-4 py-2 font-medium text-gray-700">{children}</th>;
}

// ✅ Rename TD → TableCell
export function TableCell({ children }: { children: React.ReactNode }) {
  return <td className="px-4 py-2">{children}</td>;
}
