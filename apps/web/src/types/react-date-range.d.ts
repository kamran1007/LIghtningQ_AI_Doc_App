// src/types/react-date-range.d.ts
declare module "react-date-range" {
  import * as React from "react";

  export interface DateRange {
    startDate?: Date;
    endDate?: Date;
    key?: string;
  }

  export interface DateRangePickerProps {
    ranges: DateRange[];
    onChange?: (ranges: { selection: DateRange }) => void;
    months?: number;
    direction?: "vertical" | "horizontal";
    editableDateInputs?: boolean;
    moveRangeOnFirstSelection?: boolean;
    showSelectionPreview?: boolean;
    showDateDisplay?: boolean;
    minDate?: Date;
    maxDate?: Date;
    className?: string;
  }

  export class DateRangePicker extends React.Component<DateRangePickerProps> {}
}
