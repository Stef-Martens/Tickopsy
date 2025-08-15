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

export function updateTicket(
  id: string,
  data: Partial<{
    description: string;
    status: string;
    dueDate: string;
  }>
) {
  return prisma.ticket.update({
    where: { id },
    data: {
      description: data.description,
      status: data.status,
      dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
    },
  });
}

export function deleteTicket(id: string) {
  return prisma.ticket.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
}
