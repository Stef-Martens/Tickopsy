"use client";

import { useFormState, useFormStatus } from "react-dom";
import { requestDemo, DemoFormState } from "@/lib/api/demo-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle } from "lucide-react";

const initialState: DemoFormState = { status: "idle" };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      size="lg"
      className="hero-primary-btn w-full"
      disabled={pending}
    >
      {pending ? "Sending\u2026" : "Send Demo Request"}
    </Button>
  );
}

export function DemoSection() {
  const [state, formAction] = useFormState(requestDemo, initialState);

  return (
    <section id="contact" className="landing-section demo-section">
      <div className="landing-container demo-grid">
        <div className="demo-copy">
          <p className="hero-kicker">Book A Demo</p>
          <h2 className="section-title" style={{ marginBottom: "0.75rem" }}>
            See Tickopsy in action
          </h2>
          <p className="hero-lead">
            Want a walkthrough of how Tickopsy works for your team? Drop your
            details and we&apos;ll get back to you shortly!
          </p>
        </div>

        <div className="demo-form-wrap">
          {state.status === "success" ? (
            <div className="demo-success">
              <CheckCircle className="size-9" />
              <h3>Request received!</h3>
              <p>
                Thanks for reaching out. We&apos;ll be in touch within one
                business day.
              </p>
            </div>
          ) : (
            <form action={formAction} className="demo-form">
              <div className="form-row">
                <div className="form-field">
                  <Label htmlFor="demo-name">Your name *</Label>
                  <Input
                    id="demo-name"
                    name="name"
                    placeholder="Jane Smith"
                    required
                  />
                </div>
                <div className="form-field">
                  <Label htmlFor="demo-email">Email address *</Label>
                  <Input
                    id="demo-email"
                    name="email"
                    type="email"
                    placeholder="jane@example.com"
                    required
                  />
                </div>
              </div>
              <div className="form-field">
                <Label htmlFor="demo-company">Company / shop name</Label>
                <Input
                  id="demo-company"
                  name="company"
                  placeholder="Acme Bike Repair"
                />
              </div>
              <div className="form-field">
                <Label htmlFor="demo-message">
                  Anything you&apos;d like to add?
                </Label>
                <textarea
                  id="demo-message"
                  name="message"
                  className="demo-textarea"
                  placeholder="Tell us about your team size, current workflow, etc."
                  rows={3}
                />
              </div>
              {state.status === "error" && (
                <p className="demo-error">{state.message}</p>
              )}
              <SubmitButton />
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
