"use client";

import * as React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/utils/utils";

interface BillingToggleProps {
  value: "monthly" | "yearly";
  onChange: (value: "monthly" | "yearly") => void;
}

export function BillingToggle({ value, onChange }: BillingToggleProps) {
  return (
    <div className="bg-muted flex h-12 items-center rounded-md p-1 text-lg">
      <RadioGroup
        className="grid h-full grid-cols-2 gap-1"
        value={value}
        onValueChange={(val) => onChange(val as "monthly" | "yearly")}
      >
        <BillingOption value="monthly" label="Monthly" />
        <BillingOption
          value="yearly"
          label={
            <>
              Yearly{" "}
              <span className="inline-flex items-center justify-center rounded-md border border-green-200 bg-green-100 px-1.5 py-0.5 text-xs font-medium text-green-600">
                -20%
              </span>
            </>
          }
        />
      </RadioGroup>
    </div>
  );
}

function BillingOption({
  value,
  label,
}: {
  value: string;
  label: React.ReactNode;
}) {
  return (
    <div className="has-[button[data-state=checked]]:bg-background h-full rounded-md transition-all">
      <RadioGroupItem value={value} id={value} className="peer sr-only" />
      <label
        htmlFor={value}
        className={cn(
          "flex h-full cursor-pointer items-center justify-center px-7 font-semibold text-sm text-muted-foreground peer-data-[state=checked]:text-primary"
        )}
      >
        {label}
      </label>
    </div>
  );
}
