import {
  BellRing,
  ClipboardCheck,
  QrCode,
  ShieldCheck,
  Sparkles,
  Ticket,
  Users,
  Wrench,
} from "lucide-react";

import { Header } from "@/components/header";
import { PricingSection } from "@/components/pricing-section";
import { DemoSection } from "@/components/demo-section";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="landing-shell">
      <Header />
      <section className="landing-hero">
        <div className="landing-container">
          <div className="hero-grid">
            <div className="hero-copy">
              <p className="hero-kicker">Smart Ticketing For Service Teams</p>
              <h1>
                Stop juggling post-its. Run every repair, intake, and update in
                one clean workflow.
              </h1>
              <p className="hero-lead">
                Tickopsy helps modern service businesses track jobs, keep teams
                aligned, and keep customers informed by email and SMS.
              </p>
              <div className="hero-actions">
                <Button asChild size="lg" className="hero-primary-btn">
                  <a href="/get-started">Start Free</a>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <a href="#contact">Book A Demo</a>
                </Button>
              </div>
              <p className="hero-note">
                Built for bike repair shops, IT service desks, equipment rental
                counters, and workshop teams.
              </p>
            </div>

            <div className="hero-panel">
              <div className="status-pill">
                <BellRing className="size-4" />
                Customer Notified: Ticket #2941 moved to In Progress
              </div>
              <div className="ticket-card">
                <div>
                  <p className="ticket-label">Current Job</p>
                  <p className="ticket-title">MacBook Screen Replacement</p>
                </div>
                <div className="ticket-flow">
                  <span>New</span>
                  <span>In Progress</span>
                  <span>Waiting</span>
                  <span>Done</span>
                  <span>Picked Up</span>
                </div>
                <p className="ticket-meta">
                  Assigned to Alex • Due today 16:30
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="landing-section">
        <div className="landing-container">
          <h2 className="section-title">How Tickopsy Works</h2>
          <div className="step-grid">
            <article className="step-card">
              <ClipboardCheck className="step-icon" />
              <h3>1. Quick Job Intake</h3>
              <p>
                Collect customer details, job description, and custom fields in
                a tablet-friendly form.
              </p>
            </article>
            <article className="step-card">
              <Ticket className="step-icon" />
              <h3>2. Instant Ticket Creation</h3>
              <p>
                Every ticket becomes searchable and linked to customer history
                for full team visibility.
              </p>
            </article>
            <article className="step-card">
              <BellRing className="step-icon" />
              <h3>3. Automated Status Updates</h3>
              <p>
                Move from New to Picked Up and trigger email/SMS updates with
                customizable templates.
              </p>
            </article>
            <article className="step-card">
              <QrCode className="step-icon" />
              <h3>4. Optional QR Automation</h3>
              <p>
                Print and scan QR labels to update ticket status quickly on the
                floor or at pickup.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section id="features" className="landing-section alt-bg">
        <div className="landing-container">
          <h2 className="section-title">Everything Your Team Needs</h2>
          <div className="feature-grid">
            <article className="feature-card">
              <Sparkles className="feature-icon" />
              <h3>Digital Ticketing</h3>
              <p>
                Replace paper workflows with structured digital intake, custom
                fields, categories, and tags.
              </p>
            </article>
            <article className="feature-card">
              <BellRing className="feature-icon" />
              <h3>Customer Notifications</h3>
              <p>
                Send updates through email and optional SMS whenever ticket
                status changes.
              </p>
            </article>
            <article className="feature-card">
              <Users className="feature-icon" />
              <h3>Customer Profiles</h3>
              <p>
                Track repeat customers, history, and lifetime metrics at a
                glance.
              </p>
            </article>
            <article className="feature-card">
              <Wrench className="feature-icon" />
              <h3>Dashboard + Team Ops</h3>
              <p>
                Filter by status, due dates, and technician. Add internal notes,
                reminders, and to-dos.
              </p>
            </article>
            <article className="feature-card">
              <ShieldCheck className="feature-icon" />
              <h3>Admin Controls</h3>
              <p>
                Role management, analytics insights, and subscription controls
                for business owners.
              </p>
            </article>
            <article className="feature-card">
              <QrCode className="feature-icon" />
              <h3>QR + Printer Add-On</h3>
              <p>
                Enable thermal label integration for fast scan-and-update
                workflows when your team is ready.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="landing-section">
        <div className="landing-container cta-band">
          <div>
            <p className="hero-kicker">Built For Real-World Service Work</p>
            <h2>Start simple today, scale with automation tomorrow.</h2>
            <p>
              Tickopsy grows with your process: begin with digital intake and
              status updates, then unlock QR workflows when needed.
            </p>
          </div>
          <Button asChild size="lg" className="hero-primary-btn">
            <a href="/get-started">Create Your Workspace</a>
          </Button>
        </div>
      </section>

      <div id="pricing">
        <PricingSection
          heading="Simple Pricing, Built For Service Businesses"
          description="Choose monthly or yearly plans and get your team live in minutes."
        />
      </div>

      <DemoSection />

      <section className="landing-footer">
        <div className="landing-container footer-row">
          <p>Tickopsy</p>
          <p>Smart ticketing for modern service businesses.</p>
        </div>
      </section>
    </main>
  );
}
