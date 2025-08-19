import prisma from "@stef_martens/database-tickopsy";

export async function updateSubscription({
  subscriptionId,
  email,
  status,
  priceId,
  expiresAt,
}: {
  customerId: string;
  subscriptionId: string;
  email?: string;
  status: string;
  priceId: string;
  expiresAt: string | number | Date;
}) {
  const user = await prisma.user.findFirst({ where: { email } });
  if (!user) throw new Error("User not found");
  const accountId = user.accountId; // assuming user has an accountId field

  await prisma.subscription.upsert({
    where: { stripeId: subscriptionId }, // use the unique subscription id
    update: {
      priceId,
      status,
      startedAt: new Date(),
      expiresAt: new Date(expiresAt), // depends on Stripe period end
    },
    create: {
      accountId, // get the account linked to the Stripe customer
      stripeId: subscriptionId,
      priceId,
      status,
      startedAt: new Date(),
      expiresAt: new Date(expiresAt),
    },
  });

  if (status === "active") {
    await prisma.account.update({
      where: { id: accountId },
      data: { hasAccess: true },
    });
  } else if (status === "canceled" || status === "past_due") {
    await prisma.account.update({
      where: { id: accountId },
      data: { hasAccess: false },
    });
  }
}
