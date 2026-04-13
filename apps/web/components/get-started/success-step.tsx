"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function OnboardingSuccess() {
  const router = useRouter();

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="flex justify-center mb-2">
            <CheckCircle2 className="text-green-500 w-12 h-12" />
          </div>
          <CardTitle className="text-2xl font-bold">You're all set!</CardTitle>
          <CardDescription>
            Your subscription is active and your account is ready to go.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <p className="text-muted-foreground">
            Welcome aboard! You can now start using all features of your
            dashboard.
          </p>
        </CardContent>

        <CardFooter className="flex justify-center">
          <Button onClick={() => router.push("/login")}>Go to Login</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
