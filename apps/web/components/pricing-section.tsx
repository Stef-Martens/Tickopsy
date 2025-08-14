"use client";

import { CircleCheck } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { BillingToggle } from "./ui/billing-toggle";

interface PricingFeature {
  text: string;
}

interface PricingPlan {
  id: string;
  name: string;
  description: string;
  monthlyPrice: string;
  yearlyPrice: string;
  features: PricingFeature[];
  button: {
    text: string;
    url: string;
  };
  comingSoon?: boolean;
}

interface PricingSectionProps {
  heading?: string;
  description?: string;
  plans?: PricingPlan[];
}

const PricingSection = ({
  heading = "Pricing",
  description = "Choose the plan that fits your business",
  plans = [
    {
      id: "basic",
      name: "Basic",
      description: "For small shops getting started and want to stay organized",
      monthlyPrice: "€24,99",
      yearlyPrice: "€239,99",
      features: [
        { text: "Digital job check-in form" },
        { text: "Job dashboard with statuses" },
        { text: "Update status manually or via QR scan (optional)" },
        { text: "Customer notifications (SMS/email)" },
        { text: "Simple filters (date, status, etc.)" },
        { text: "Optional QR sticker generation (paid add-on)" },
      ],
      button: {
        text: "Start Free Trial",
        url: "#",
      },
    },
    {
      id: "pro-solo",
      name: "Pro Solo",
      description: "For single operators who want customization & insights",
      monthlyPrice: "€49,99",
      yearlyPrice: "€479,99",
      features: [
        { text: "All Basic features" },
        { text: "Customizable UI layout & widgets" },
        { text: "Advanced analytics & reports" },
        { text: "Unlimited ticket history search" },
        { text: "Priority email support" },
      ],
      button: {
        text: "Purchase",
        url: "#",
      },
    },
    {
      id: "pro-team",
      name: "Pro Team",
      description: "For teams that need collaboration & delegation",
      monthlyPrice: "Coming Soon",
      yearlyPrice: "Coming Soon",
      features: [
        { text: "All Pro Solo features" },
        { text: "Assign todos & reminders to team members" },
        { text: "Multiple user accounts with one admin" },
        { text: "Role-based permissions" },
        { text: "Shared customer database" },
        { text: "Team activity tracking & productivity insights" },
        { text: "More features to come" },
      ],
      button: {
        text: "Coming Soon",
        url: "#",
      },
      comingSoon: true,
    },
  ],
}: PricingSectionProps) => {
  const [isYearly, setIsYearly] = useState(false);
  return (
    <section className="py-32">
      <div className="">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 text-center">
          <h2 className="text-4xl font-semibold text-pretty lg:text-6xl">
            {heading}
          </h2>
          <p className="text-muted-foreground lg:text-xl">{description}</p>
          <div className="flex items-center gap-3 text-lg">
            <BillingToggle
              value={isYearly ? "yearly" : "monthly"}
              onChange={(val) => setIsYearly(val === "yearly")}
            />
          </div>
          <div className="flex flex-wrap justify-center gap-7">
            {plans.map((plan) => (
              <Card
                key={plan.id}
                className="flex w-80 flex-col justify-between text-left"
              >
                <CardHeader>
                  <CardTitle>
                    <p>{plan.name}</p>
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {plan.description}
                  </p>
                  <div className="flex items-end">
                    {plan.comingSoon ? (
                      <span className="text-xl font-semibold text-muted-foreground">
                        Coming Soon
                      </span>
                    ) : (
                      <>
                        <span className="text-4xl font-semibold">
                          {isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                        </span>
                        <span className="text-2xl font-semibold text-muted-foreground">
                          {isYearly ? "/yr" : "/mo"}
                        </span>
                      </>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <Separator className="mb-6" />
                  <ul className="space-y-4">
                    {plan.features.map((feature, index) => (
                      <li
                        key={index}
                        className="flex items-center gap-2 text-sm"
                      >
                        <CircleCheck className="size-4" />
                        <span>{feature.text}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="mt-auto">
                  <Button asChild className="w-full" disabled={plan.comingSoon}>
                    <a href={plan.button.url}>{plan.button.text}</a>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export { PricingSection };
