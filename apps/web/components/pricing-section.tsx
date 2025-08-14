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
import { BillingToggle } from "./ui/billing-toggle";

interface PricingFeature {
  text: string;
}

interface PricingPlan {
  id: string;
  name: string;
  description: string;
  billing: {
    monthly: {
      displayPrice: string;
      stripePriceId: string | null;
      paymentUrl: string;
    };
    yearly: {
      displayPrice: string;
      stripePriceId: string | null;
      paymentUrl: string;
    };
  };
  features: PricingFeature[];
  button: {
    text: string;
  };
  comingSoon?: boolean;
}

interface PricingSectionProps {
  heading?: string;
  description?: string;
  plans?: PricingPlan[];
}

export const plans = [
  {
    id: "basic",
    name: "Basic",
    description: "For small shops getting started and want to stay organized",
    billing: {
      monthly: {
        displayPrice: "€24,99",
        stripePriceId: "price_1Rw1ue4eLBjiZOJYONXFwAvN",
        paymentUrl:
          "https://buy.stripe.com/test_9B6aEQfod3687GSdcV8EM00" +
          "?prefilled_email=" +
          "stef.m@hotmail.be",
      },
      yearly: {
        displayPrice: "€239,99",
        stripePriceId: "price_1Rw4OD4eLBjiZOJYvW56xKBy",
        paymentUrl: "https://buy.stripe.com/test_eVq4gsa3TbCEf9kgp78EM05",
      },
    },
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
    },
  },
  {
    id: "pro-solo",
    name: "Pro Solo",
    description: "For single operators who want customization & insights",
    billing: {
      monthly: {
        displayPrice: "€49,99",
        stripePriceId: "price_1Rw1v54eLBjiZOJYCsqQxEit",
        paymentUrl: "https://buy.stripe.com/test_4gM3codg5ayA5yKgp78EM01",
      },
      yearly: {
        displayPrice: "€479,99",
        stripePriceId: "price_1Rw4PY4eLBjiZOJYEa1K3SM1",
        paymentUrl: "https://buy.stripe.com/test_9B6dR2gsh6ik0eq1ud8EM04",
      },
    },
    features: [
      { text: "All Basic features" },
      { text: "Customizable UI layout & widgets" },
      { text: "Advanced analytics & reports" },
      { text: "Unlimited ticket history search" },
      { text: "Priority email support" },
    ],
    button: {
      text: "Purchase",
    },
  },
  {
    id: "pro-team",
    name: "Pro Team",
    description: "For teams that need collaboration & delegation",
    billing: {
      monthly: {
        displayPrice: "Coming Soon",
        stripePriceId: null,
        paymentUrl: "#",
      },
      yearly: {
        displayPrice: "Coming Soon",
        stripePriceId: null,
        paymentUrl: "#",
      },
    },
    features: [
      { text: "All Pro Solo features" },
      { text: "Assign todos & reminders to team members" },
      { text: "Multiple user accounts with one admin" },
      { text: "Role-based permissions" },
      { text: "Shared customer database" },
      { text: "Team activity tracking & productivity insights" },
      { text: "More features to come" },
    ],
    comingSoon: true,
    button: {
      text: "Coming Soon",
    },
  },
];

const PricingSection = ({
  heading = "Pricing",
  description = "Choose the plan that fits your business",
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
                          {isYearly
                            ? plan.billing.yearly.displayPrice
                            : plan.billing.monthly.displayPrice}
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
                    <a
                      href={
                        plan.billing[isYearly ? "yearly" : "monthly"].paymentUrl
                      }
                    >
                      {plan.button.text}
                    </a>
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
