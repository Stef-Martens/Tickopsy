"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@radix-ui/react-label";
import { Check } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/utils/utils";
import { plans } from "@/app/constants";
import { BillingToggle } from "@/components/ui/billing-toggle";

interface ChoosePlanCrumbProps {
  email: string;
}

export function ChoosePlanCrumb({ email }: ChoosePlanCrumbProps) {
  const [selected, setSelected] = useState<string>("basic");
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");

  const handleContinue = () => {
    if (!selected) return;

    const plan = plans.find((p) => p.id === selected);
    if (!plan) return;

    // Redirect to the plan's URL for the selected billing
    const url = plan.billing[billing]?.paymentUrl;
    if (url) {
      // get email from supabase session
      window.location.href = url + "?prefilled_email=" + email;
    }
  };

  return (
    <Card className="mx-auto max-w-3xl w-full">
      <CardHeader>
        <CardTitle className="text-xl">Choose Your Plan</CardTitle>
        <CardDescription>
          Select the plan that fits your needs best
        </CardDescription>
        <div className="mt-2">
          <Progress value={50} className="h-2 rounded-full" />
          <span className="text-xs text-muted-foreground mt-1 block">
            Step 2 of 4
          </span>
        </div>
      </CardHeader>

      <CardContent>
        {/* Billing toggle */}
        <div className="flex justify-center mb-6">
          <BillingToggle
            value={billing}
            onChange={(val) =>
              setBilling(val === "yearly" ? "yearly" : "monthly")
            }
          />
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Plan selection buttons */}
          <RadioGroup
            value={selected}
            onValueChange={setSelected}
            className="flex flex-col gap-3 md:w-1/3"
          >
            {plans.map((plan) => {
              const isDisabled = plan.comingSoon;

              return (
                <Label
                  key={plan.id}
                  htmlFor={plan.id}
                  className={cn(
                    "relative cursor-pointer rounded-lg border p-4 text-left transition-all",
                    "hover:border-primary/50",
                    selected === plan.id && !isDisabled
                      ? "border-primary bg-primary/5"
                      : "border-border",
                    isDisabled && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{plan.name}</span>
                    <RadioGroupItem
                      id={plan.id}
                      value={plan.id}
                      disabled={isDisabled}
                    />
                  </div>

                  {!isDisabled && (
                    <div className="mt-1 text-sm text-muted-foreground">
                      {plan.billing[billing].displayPrice} /{" "}
                      {billing === "monthly" ? "month" : "year"}
                      {plan.freeTrial && (
                        <span className="ml-2 text-xs italic text-green-500">
                          {plan.freeTrial} day free trial
                        </span>
                      )}
                    </div>
                  )}

                  {isDisabled && (
                    <div className="mt-1 text-sm text-muted-foreground italic">
                      Coming Soon
                    </div>
                  )}
                </Label>
              );
            })}
          </RadioGroup>

          {/* Plan details */}
          <div className="flex-1 bg-muted p-4 rounded-lg shadow-sm">
            {selected ? (
              <>
                <h3 className="text-lg font-semibold">
                  {plans.find((p) => p.id === selected)?.name}
                </h3>
                <p className="text-sm text-muted-foreground mt-1 mb-3">
                  {plans.find((p) => p.id === selected)?.description}
                </p>
                <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
                  {plans
                    .find((p) => p.id === selected)
                    ?.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        {feature.text}
                      </li>
                    ))}
                </ul>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                Select a plan to see details
              </p>
            )}
          </div>
        </div>

        <Button
          className="w-full mt-6 md:mt-8"
          disabled={!selected}
          onClick={handleContinue}
        >
          Continue
        </Button>
      </CardContent>
    </Card>
  );
}
