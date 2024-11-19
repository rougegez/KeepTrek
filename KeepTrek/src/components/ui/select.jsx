import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown } from "lucide-react";

export const Select = SelectPrimitive.Root;
export const SelectTrigger = React.forwardRef(({ className, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={`flex items-center justify-between rounded-md border bg-white px-3 py-2 ${className}`}
    {...props}
  >
    {props.children}
    <ChevronDown className="h-4 w-4 ml-2" />
  </SelectPrimitive.Trigger>
));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

export const SelectContent = React.forwardRef(({ className, ...props }, ref) => (
  <SelectPrimitive.Content
    ref={ref}
    className={`rounded-md border bg-white shadow-md ${className}`}
    {...props}
  />
));
SelectContent.displayName = SelectPrimitive.Content.displayName;

export const SelectItem = React.forwardRef(({ className, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={`cursor-pointer px-4 py-2 hover:bg-muted ${className}`}
    {...props}
  >
    {props.children}
  </SelectPrimitive.Item>
));
SelectItem.displayName = SelectPrimitive.Item.displayName;