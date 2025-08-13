"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import React from "react";

const ForgotPasswordPageSucces = () => {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Check your email
            </CardTitle>
            <CardDescription className="text-center">
              We have sent you an email with instructions to reset your
              password.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center">
              <Button
                type="submit"
                className="w-full"
                onClick={() => (window.location.href = "/login")}
              >
                Back to Login
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPasswordPageSucces;

/*"use client";

import { useState } from "react";
import { forgotPassword } from "@/lib/auth-actions";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type ForgotPasswordResponse = {
  success: boolean;
  error?: string;
};

export function ForgotPassword() {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setErrors({});
    const formData = new FormData(e.currentTarget);
    const email = (formData.get("email") as string)?.trim() || "";

    const fieldErrors: { [key: string]: string } = {};
    if (!email) fieldErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      fieldErrors.email = "Invalid email address";

    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);

    try {
      const res: ForgotPasswordResponse = await forgotPassword({ email });

      if (res.success) {
        window.location.href = "/forgot-password/success";
        return;
      }

      if (res.error?.toLowerCase().includes("email")) {
        setErrors({ email: res.error });
      } else {
        setErrors({ general: res.error || "Failed to send reset link" });
      }
    } catch {
      setErrors({ general: "Something went wrong. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mx-auto max-w-sm w-full">
      <CardHeader>
        <CardTitle className="text-xl">Forgot Password</CardTitle>
        <CardDescription>
          Enter your email to reset your password
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} noValidate>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="m@example.com"
                variant={errors.email ? "error" : "default"}
                errorMessage={errors.email || " "}
              />
            </div>

            {errors.general && (
              <p className="text-red-500 text-sm">{errors.general}</p>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Sending..." : "Send Reset Link"}
            </Button>
          </div>
        </form>

        <div className="mt-4 text-center text-sm">
          Want to sign in?{" "}
          <Link href="/login" className="underline">
            Sign in
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
*/
