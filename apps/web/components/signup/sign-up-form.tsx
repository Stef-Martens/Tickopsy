"use client";

import { useState } from "react";
import { signup } from "@/lib/auth-actions";

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

export function SignUpForm() {
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

    // COLLECT ALL ERRORS
    const fieldErrors: { [key: string]: string } = {};
    if (!firstName) fieldErrors["first-name"] = "First name is required";
    if (!lastName) fieldErrors["last-name"] = "Last name is required";
    if (!email) fieldErrors.email = "Email is required";
    else if (!email.includes("@")) fieldErrors.email = "Invalid email address";
    if (!password) fieldErrors.password = "Password is required";
    else {
      const minLength = 8;
      const uppercase = /[A-Z]/;
      const lowercase = /[a-z]/;
      const number = /[0-9]/;
      const specialChar = /[!@#$%^&*(),.?":{}|<>]/;

      if (password.length < minLength)
        fieldErrors.password = `Password must be at least ${minLength} characters`;
      else if (!uppercase.test(password))
        fieldErrors.password =
          "Password must contain at least one uppercase letter";
      else if (!lowercase.test(password))
        fieldErrors.password =
          "Password must contain at least one lowercase letter";
      else if (!number.test(password))
        fieldErrors.password = "Password must contain at least one number";
      else if (!specialChar.test(password))
        fieldErrors.password =
          "Password must contain at least one special character";
    }

    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);

    try {
      const res = await signup(formData);

      if (res.success) {
        window.location.href = "/login";
        return;
      }

      // parse error if it's JSON
      let errorMsg = res.error;
      try {
        const parsed = JSON.parse(res.error);
        if (parsed.error) errorMsg = parsed.error;
      } catch {
        // not JSON, keep as is
      }

      if (errorMsg.includes("email")) {
        setErrors({ email: errorMsg });
      } else {
        setErrors({ general: errorMsg });
      }
    } catch (err: any) {
      setErrors({ general: "Something went wrong. Please try again." });
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
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4 items-start">
              <div className="grid gap-2">
                <Label htmlFor="first-name">First name</Label>
                <Input
                  name="first-name"
                  id="first-name"
                  placeholder="Max"
                  variant={errors["first-name"] ? "error" : "default"}
                  errorMessage={errors["first-name"] || " "}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="last-name">Last name</Label>
                <Input
                  name="last-name"
                  id="last-name"
                  placeholder="Robinson"
                  variant={errors["last-name"] ? "error" : "default"}
                  errorMessage={errors["last-name"] || " "}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                name="email"
                id="email"
                type="email"
                placeholder="m@example.com"
                variant={errors.email ? "error" : "default"}
                errorMessage={errors.email || " "}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                name="password"
                id="password"
                type="password"
                variant={errors.password ? "error" : "default"}
                errorMessage={errors.password || " "}
              />
            </div>

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
