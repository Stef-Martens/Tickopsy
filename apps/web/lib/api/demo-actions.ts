"use server";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export interface DemoFormState {
  status: "idle" | "success" | "error";
  message?: string;
}

export async function requestDemo(
  _prev: DemoFormState,
  formData: FormData,
): Promise<DemoFormState> {
  const name = (formData.get("name") as string | null)?.trim() ?? "";
  const email = (formData.get("email") as string | null)?.trim() ?? "";
  const company = (formData.get("company") as string | null)?.trim() ?? "";
  const message = (formData.get("message") as string | null)?.trim() ?? "";

  if (!name || !email) {
    return { status: "error", message: "Name and email are required." };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { status: "error", message: "Please enter a valid email address." };
  }

  const toEmail = process.env.CONTACT_EMAIL;
  if (!toEmail || !process.env.RESEND_API_KEY) {
    return {
      status: "error",
      message: "Contact form is not configured yet. Please try again later.",
    };
  }

  const { error } = await resend.emails.send({
    from: "Tickopsy Demo Requests <noreply@tickopsy.com>",
    to: toEmail,
    replyTo: email,
    subject: `Demo request from ${name}${company ? ` (${company})` : ""}`,
    html: `
      <h2>New Demo Request</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
      ${company ? `<p><strong>Company:</strong> ${company}</p>` : ""}
      ${message ? `<p><strong>Message:</strong><br/>${message.replace(/\n/g, "<br/>")}</p>` : ""}
    `,
  });

  if (error) {
    console.error("Resend error:", JSON.stringify(error));
    const isDev = process.env.NODE_ENV === "development";
    return {
      status: "error",
      message: isDev
        ? `Resend error: ${error.name} — ${error.message}`
        : "Something went wrong. Please try again later.",
    };
  }

  return { status: "success" };
}
