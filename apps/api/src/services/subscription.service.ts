import prisma from "@stef_martens/database-tickopsy";

export async function updateSubscription({
  customerId,
  subscriptionId,
  email,
  status,
  plan,
}: {
  customerId: string;
  subscriptionId: string;
  email?: string;
  status: string;
  plan: string;
}) {
  const user = await prisma.user.findFirst({ where: { email } });
  if (!user) throw new Error("User not found");

  prisma.subscription.upsert({
    where: { stripeId: stripeSubscriptionId }, // your webhook stripe subscription id
    update: {
      plan,
      status,
      startedAt: new Date(),
      expiresAt: new Date(expiresAt), // depends on Stripe period end
    },
    create: {
      accountId, // get the account linked to the Stripe customer
      stripeId: stripeSubscriptionId,
      plan,
      status,
      startedAt: new Date(),
      expiresAt: new Date(expiresAt),
    },
  });
}
