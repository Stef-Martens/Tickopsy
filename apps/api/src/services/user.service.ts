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
