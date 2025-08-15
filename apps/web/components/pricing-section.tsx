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
import { plans } from "@/app/constants";

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
                        "/get-started"
                        // plan.billing[isYearly ? "yearly" : "monthly"].paymentUrl
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
