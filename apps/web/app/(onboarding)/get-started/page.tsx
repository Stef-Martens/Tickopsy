"use client";

import { useEffect, useState } from "react";
import { SignUpForm } from "@/components/get-started/sign-up-form";
import { ChoosePlanCrumb } from "@/components/get-started/choose-plan-crumb";
import OnboardingSuccess from "@/components/get-started/success-step";
import { useSession } from "@/providers/session-provider";

export default function GetStartedPage() {
  const { user, account } = useSession();

  useEffect(() => {
    if (!user && !account) {
      goToStep(1);
      return;
    }

    if (account?.hasAccess) {
      goToStep(4);
    } else {
      goToStep(2);
    }
  }, [user, account]);

  const [currentStep, setCurrentStep] = useState(1);

  const goToStep = (step: number) => setCurrentStep(step);

  return (
    <div className="bg-muted min-h-svh flex flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full flex flex-col gap-4">
        {/* Step content */}
        {currentStep === 1 && <SignUpForm onSuccess={() => goToStep(2)} />}
        {currentStep === 2 && <ChoosePlanCrumb />}
        {currentStep === 4 && <OnboardingSuccess />}
      </div>
    </div>
  );
}
