"use client";

import { useState } from "react";
import { login, signup } from "@/lib/api/auth-actions";
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
import { Progress } from "@/components/ui/progress";

export function SignUpForm({ onSuccess }) {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});

    const formData = new FormData(e.currentTarget);
    const firstName = formData.get("first-name")?.toString().trim() || "";
    const lastName = formData.get("last-name")?.toString().trim() || "";
    const email = formData.get("email")?.toString().trim() || "";
    const password = formData.get("password")?.toString() || "";
    const confirmPassword = formData.get("confirm-password")?.toString() || "";

    // Validation
    const fieldErrors: { [key: string]: string } = {};
    if (!firstName) fieldErrors["first-name"] = "First name is required";
    if (!lastName) fieldErrors["last-name"] = "Last name is required";
    if (!email) fieldErrors.email = "Email is required";
    else if (!email.includes("@")) fieldErrors.email = "Invalid email address";

    if (!password) {
      fieldErrors.password = "Password is required";
    } else {
      const minLength = 8;
      const uppercase = /[A-Z]/;
      const lowercase = /[a-z]/;
      const number = /[0-9]/;
      const specialChar = /[!@#$%^&*(),.?":{}|<>]/;

      if (password.length < minLength)
        fieldErrors.password = `Password must be at least ${minLength} characters`;
      else if (!uppercase.test(password))
        fieldErrors.password = "Password must contain an uppercase letter";
      else if (!lowercase.test(password))
        fieldErrors.password = "Password must contain a lowercase letter";
      else if (!number.test(password))
        fieldErrors.password = "Password must contain a number";
      else if (!specialChar.test(password))
        fieldErrors.password = "Password must contain a special character";
    }

    if (!confirmPassword) {
      fieldErrors["confirm-password"] = "Please confirm your password";
    } else if (password && confirmPassword !== password) {
      fieldErrors["confirm-password"] = "Passwords do not match";
    }

    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);

    try {
      const res = await signup(formData);

      if (res.success) {
        const loginRes = await login(formData);

        if (!loginRes.success) {
          return {
            success: false,
            error: "Signup succeeded but login failed.",
          };
        }
        onSuccess();
      } else if (res.errorCode === "EMAIL_EXISTS") {
        setErrors({ email: res.error });
      } else {
        setErrors({ general: res.error });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-xl">Sign Up</CardTitle>
        <CardDescription>
          Enter your information to create an account
        </CardDescription>
        <div className="mt-2">
          <Progress value={0} className="h-2 rounded-full" />
          <span className="text-xs text-muted-foreground mt-1 block">
            Step 1 of 4
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4">
            {/* Name fields */}
            <div className="grid grid-cols-2 gap-4 items-start">
              <div className="grid gap-2">
                <Label htmlFor="first-name">First name</Label>
                <Input
                  name="first-name"
                  id="first-name"
                  variant={errors["first-name"] ? "error" : "default"}
                  errorMessage={errors["first-name"]}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="last-name">Last name</Label>
                <Input
                  name="last-name"
                  id="last-name"
                  variant={errors["last-name"] ? "error" : "default"}
                  errorMessage={errors["last-name"]}
                />
              </div>
            </div>

            {/* Email */}
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                name="email"
                id="email"
                type="email"
                variant={errors.email ? "error" : "default"}
                errorMessage={errors.email}
              />
            </div>

            {/* Password */}
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                name="password"
                id="password"
                type="password"
                variant={errors.password ? "error" : "default"}
                errorMessage={errors.password}
              />
            </div>

            {/* Confirm Password */}
            <div className="grid gap-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input
                name="confirm-password"
                id="confirm-password"
                type="password"
                variant={errors["confirm-password"] ? "error" : "default"}
                errorMessage={errors["confirm-password"]}
              />
            </div>

            {/* General error */}
            {errors.general && (
              <p className="text-red-500 text-sm">{errors.general}</p>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating account..." : "Create an account"}
            </Button>
          </div>
        </form>

        <div className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link href="/login" className="underline">
            Sign in
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
