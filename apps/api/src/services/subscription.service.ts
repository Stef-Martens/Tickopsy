import prisma from "@stef_martens/database-tickopsy";

export async function updateSubscription({
  subscriptionId,
  email,
  status,
  plan,
  expiresAt,
}: {
  customerId: string;
  subscriptionId: string;
  email?: string;
  status: string;
  plan: string;
  expiresAt: string | number | Date;
}) {
  const user = await prisma.user.findFirst({ where: { email } });
  if (!user) throw new Error("User not found");
  const accountId = user.accountId; // assuming user has an accountId field

  await prisma.subscription.upsert({
    where: { id: subscriptionId }, // use the unique subscription id
    update: {
      plan,
      status,
      startedAt: new Date(),
      expiresAt: new Date(expiresAt), // depends on Stripe period end
    },
    create: {
      accountId, // get the account linked to the Stripe customer
      stripeId: subscriptionId,
      plan,
      status,
      startedAt: new Date(),
      expiresAt: new Date(expiresAt),
    },
  });
}
