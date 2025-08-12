import prisma from "@stef_martens/database-tickopsy";

export function getAllAccounts() {
  return prisma.account.findMany({
    include: {
      users: true,
      customers: true,
      tickets: true,
      subscriptions: true,
    },
  });
}

export function getAccountById(id: string) {
  return prisma.account.findUnique({
    where: { id },
    include: {
      users: true,
      customers: true,
      tickets: true,
    },
  });
}

export function createAccount(data: {
  name: string;
  email: string;
  phone: string;
  plan: string;
  imageUrl?: string;
}) {
  return prisma.account.create({ data });
}

export function updateAccount(
  id: string,
  data: Partial<{
    name: string;
    email: string;
    phone: string;
    plan: string;
    imageUrl: string;
  }>
) {
  return prisma.account.update({
    where: { id },
    data,
  });
}

export function deleteAccount(id: string) {
  return prisma.account.delete({ where: { id } });
}
