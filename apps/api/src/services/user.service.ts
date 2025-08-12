import prisma from "@stef_martens/database-tickopsy";
import { supabase } from "../lib/supabase";

export function getAllUsers() {
  return prisma.user.findMany({
    include: { account: true, ticketsCreated: true },
  });
}

export function getUserById(id: string) {
  return prisma.user.findUnique({
    where: { id },
    include: { account: true },
  });
}

export async function createUser(data: {
  accountId?: string;
  name: string;
  email: string;
  password: string;
  role: string;
  phone?: string;
}) {
  // 1. Create user in Supabase Auth
  const { data: authData, error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
  });

  if (error || !authData.user) {
    throw new Error(error?.message || "Supabase signUp failed");
  }

  // 2. Store in your own DB
  return prisma.user.create({
    data: {
      accountId: data.accountId,
      name: data.name,
      email: data.email,
      role: data.role,
      phone: data.phone,
      authId: authData.user.id,
    },
  });
}

export async function updateUser(
  id: string,
  data: Partial<{
    name: string;
    email: string;
    role: string;
    phone: string;
  }>
) {
  // No password handling here — managed by Supabase
  return prisma.user.update({
    where: { id },
    data,
  });
}

export function deleteUser(id: string) {
  return prisma.user.delete({ where: { id } });
}
