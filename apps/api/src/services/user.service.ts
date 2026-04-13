import prisma from "@stef_martens/database-tickopsy";

export async function getAllUsers() {
  return await prisma.user.findMany({
    include: { account: true, ticketsCreated: true },
  });
}

export async function getUsersByAccountId(accountId: string) {
  return await prisma.user.findMany({
    where: { accountId },
    include: { account: true, ticketsCreated: true },
  });
}

export async function getUserById(id: string) {
  return await prisma.user.findUnique({
    where: { id },
    include: { account: true },
  });
}

export async function getUserByIdForAccount(id: string, accountId: string) {
  return await prisma.user.findFirst({
    where: { id, accountId },
    include: { account: true },
  });
}

export async function updateUser(
  id: string,
  data: Partial<{
    name: string;
    email: string;
    phone: string;
  }>,
) {
  // No password handling here — managed by Supabase
  return prisma.user.update({
    where: { id },
    data,
  });
}

export async function updateUserForAccount(
  id: string,
  accountId: string,
  data: Partial<{
    name: string;
    email: string;
    phone: string;
  }>,
) {
  const user = await prisma.user.findFirst({ where: { id, accountId } });
  if (!user) {
    return null;
  }

  return prisma.user.update({
    where: { id },
    data,
  });
}

export async function deleteUser(id: string) {
  return await prisma.user.delete({ where: { id } });
}

export async function deleteUserForAccount(id: string, accountId: string) {
  const user = await prisma.user.findFirst({ where: { id, accountId } });
  if (!user) {
    return null;
  }
  return prisma.user.delete({ where: { id } });
}
