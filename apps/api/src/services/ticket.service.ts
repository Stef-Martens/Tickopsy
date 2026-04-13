import prisma from "@stef_martens/database-tickopsy";

export function getAllTickets() {
  return prisma.ticket.findMany({
    include: {
      account: true,
      customer: true,
      creator: true,
      notifications: true,
      reminders: true,
    },
  });
}

export function getTicketsByAccountId(accountId: string) {
  return prisma.ticket.findMany({
    where: { accountId, deletedAt: null },
    include: {
      account: true,
      customer: true,
      creator: true,
      notifications: true,
      reminders: true,
    },
  });
}

export function getTicketByIdForAccount(id: string, accountId: string) {
  return prisma.ticket.findFirst({
    where: { id, accountId, deletedAt: null },
  });
}

export function createTicket(data: {
  accountId: string;
  createdById: string;
  customerId?: string;
  description: string;
  status: string;
  dueDate?: string;
}) {
  return prisma.ticket.create({
    data: {
      accountId: data.accountId,
      createdById: data.createdById,
      customerId: data.customerId,
      description: data.description,
      status: data.status,
      dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
    },
  });
}

export async function updateTicketForAccount(
  id: string,
  accountId: string,
  data: Partial<{
    description: string;
    status: string;
    dueDate: string;
  }>,
) {
  const existing = await prisma.ticket.findFirst({
    where: { id, accountId, deletedAt: null },
  });

  if (!existing) {
    return null;
  }

  return prisma.ticket.update({
    where: { id },
    data: {
      description: data.description,
      status: data.status,
      dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
    },
  });
}

export async function deleteTicketForAccount(id: string, accountId: string) {
  const existing = await prisma.ticket.findFirst({
    where: { id, accountId, deletedAt: null },
  });

  if (!existing) {
    return null;
  }

  return prisma.ticket.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
}
