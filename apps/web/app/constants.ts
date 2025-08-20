export const plans = [
  {
    id: "basic",
    name: "Basic",
    description: "For small shops getting started and want to stay organized",
    billing: {
      monthly: {
        displayPrice: "€24,99",
        stripePriceId: "price_1Rw1ue4eLBjiZOJYONXFwAvN",
        paymentUrl: "https://buy.stripe.com/test_9B6aEQfod3687GSdcV8EM00",
      },
      yearly: {
        displayPrice: "€239,99",
        stripePriceId: "price_1Rw4OD4eLBjiZOJYvW56xKBy",
        paymentUrl: "https://buy.stripe.com/test_eVq4gsa3TbCEf9kgp78EM05",
      },
    },
    features: [
      { text: "Digital job check-in form" },
      { text: "Job dashboard with statuses" },
      { text: "Update status manually or via QR scan (optional)" },
      { text: "Customer notifications (SMS/email)" },
      { text: "Simple filters (date, status, etc.)" },
      { text: "Optional QR sticker generation (paid add-on)" },
    ],
    button: {
      text: "Start Free Trial",
    },
    freeTrial: 14,
  },
  {
    id: "pro-solo",
    name: "Pro Solo",
    description: "For single operators who want customization & insights",
    billing: {
      monthly: {
        displayPrice: "€49,99",
        stripePriceId: "price_1Rw1v54eLBjiZOJYCsqQxEit",
        paymentUrl: "https://buy.stripe.com/test_4gM3codg5ayA5yKgp78EM01",
      },
      yearly: {
        displayPrice: "€479,99",
        stripePriceId: "price_1Rw4PY4eLBjiZOJYEa1K3SM1",
        paymentUrl: "https://buy.stripe.com/test_9B6dR2gsh6ik0eq1ud8EM04",
      },
    },
    features: [
      { text: "All Basic features" },
      { text: "Customizable UI layout & widgets" },
      { text: "Advanced analytics & reports" },
      { text: "Unlimited ticket history search" },
      { text: "Priority email support" },
    ],
    button: {
      text: "Get Started",
    },
  },
  {
    id: "pro-team",
    name: "Pro Team",
    description: "For teams that need collaboration & delegation",
    billing: {
      monthly: {
        displayPrice: "Coming Soon",
        stripePriceId: null,
        paymentUrl: "#",
      },
      yearly: {
        displayPrice: "Coming Soon",
        stripePriceId: null,
        paymentUrl: "#",
      },
    },
    features: [
      { text: "All Pro Solo features" },
      { text: "Assign todos & reminders to team members" },
      { text: "Multiple user accounts with one admin" },
      { text: "Role-based permissions" },
      { text: "Shared customer database" },
      { text: "Team activity tracking & productivity insights" },
      { text: "More features to come" },
    ],
    comingSoon: true,
    button: {
      text: "Coming Soon",
    },
  },
];
