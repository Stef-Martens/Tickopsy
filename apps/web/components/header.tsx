import Link from "next/link";
import { Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="site-header">
      <div className="landing-container header-inner">
        <Link href="/" className="header-logo">
          <Ticket className="size-5" />
          <span>Tickopsy</span>
        </Link>

        <nav className="header-nav">
          <a href="#how-it-works" className="header-link">
            How It Works
          </a>
          <a href="#features" className="header-link">
            Features
          </a>
          <a href="#pricing" className="header-link">
            Pricing
          </a>
        </nav>

        <div className="header-actions">
          <Button asChild variant="ghost" size="sm">
            <Link href="/login">Log In</Link>
          </Button>
          <Button asChild size="sm" className="hero-primary-btn">
            <Link href="/get-started">Start Free</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
