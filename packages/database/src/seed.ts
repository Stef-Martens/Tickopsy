import { PrismaClient } from "../generated/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...\n");

  // ── Clean slate ──────────────────────────────────────────────
  await prisma.reminder.deleteMany();
  await prisma.todo.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.ticketStatusHistory.deleteMany();
  await prisma.ticket.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.subscription.deleteMany();
  await prisma.user.deleteMany();
  await prisma.account.deleteMany();
  console.log("  ✓ Cleared existing data");

  // ── Account ──────────────────────────────────────────────────
  const account = await prisma.account.create({
    data: {
      name: "Tickopsy Demo",
      email: "demo@tickopsy.com",
      phone: "+31612345678",
      hasAccess: true,
    },
  });
  console.log(`  ✓ Account: ${account.name}`);

  // ── Users ────────────────────────────────────────────────────
  const admin = await prisma.user.create({
    data: {
      authId: "seed-admin-auth-id",
      accountId: account.id,
      name: "Stef Martens",
      email: "stef@tickopsy.com",
      phone: "+31612345678",
      role: "ADMIN",
    },
  });

  const tech = await prisma.user.create({
    data: {
      authId: "seed-tech-auth-id",
      accountId: account.id,
      name: "Jan de Vries",
      email: "jan@tickopsy.com",
      phone: "+31698765432",
      role: "USER",
    },
  });
  console.log(`  ✓ Users: ${admin.name} (ADMIN), ${tech.name} (USER)`);

  // ── Customers ────────────────────────────────────────────────
  const customers = await Promise.all([
    prisma.customer.create({
      data: {
        accountId: account.id,
        name: "Acme BV",
        email: "info@acme.nl",
        phone: "+31201234567",
        notes: "Key client — SLA 4h response",
      },
    }),
    prisma.customer.create({
      data: {
        accountId: account.id,
        name: "TechStart",
        email: "hello@techstart.io",
        phone: "+31207654321",
        notes: "Startup customer, flexible hours",
      },
    }),
    prisma.customer.create({
      data: {
        accountId: account.id,
        name: "Bakkerij Klaas",
        email: "klaas@bakkerij.nl",
        phone: "+31301112233",
      },
    }),
  ]);
  console.log(`  ✓ Customers: ${customers.length}`);

  // ── Tickets ──────────────────────────────────────────────────
  const tickets = await Promise.all([
    prisma.ticket.create({
      data: {
        accountId: account.id,
        customerId: customers[0].id,
        createdById: admin.id,
        description: "Server room AC unit making grinding noise",
        status: "OPEN",
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      },
    }),
    prisma.ticket.create({
      data: {
        accountId: account.id,
        customerId: customers[0].id,
        createdById: tech.id,
        description: "Replace UPS batteries — building B",
        status: "IN_PROGRESS",
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    }),
    prisma.ticket.create({
      data: {
        accountId: account.id,
        customerId: customers[1].id,
        createdById: admin.id,
        description: "Install network switch in meeting room 3",
        status: "OPEN",
      },
    }),
    prisma.ticket.create({
      data: {
        accountId: account.id,
        customerId: customers[2].id,
        createdById: tech.id,
        description: "Oven thermostat calibration",
        status: "COMPLETED",
        dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
    }),
    prisma.ticket.create({
      data: {
        accountId: account.id,
        createdById: admin.id,
        description: "Internal: update safety inspection checklist",
        status: "OPEN",
      },
    }),
  ]);
  console.log(`  ✓ Tickets: ${tickets.length}`);

  // ── Ticket status history ────────────────────────────────────
  await prisma.ticketStatusHistory.createMany({
    data: [
      { ticketId: tickets[1].id, status: "OPEN", changedById: tech.id },
      {
        ticketId: tickets[1].id,
        status: "IN_PROGRESS",
        changedById: tech.id,
      },
      { ticketId: tickets[3].id, status: "OPEN", changedById: tech.id },
      {
        ticketId: tickets[3].id,
        status: "IN_PROGRESS",
        changedById: tech.id,
      },
      {
        ticketId: tickets[3].id,
        status: "COMPLETED",
        changedById: tech.id,
      },
    ],
  });
  console.log("  ✓ Ticket status history");

  // ── Todos ────────────────────────────────────────────────────
  await prisma.todo.createMany({
    data: [
      {
        userId: admin.id,
        accountId: account.id,
        note: "Order replacement filters for AC units",
        status: "PENDING",
      },
      {
        userId: admin.id,
        accountId: account.id,
        note: "Review monthly service report",
        status: "PENDING",
      },
      {
        userId: tech.id,
        accountId: account.id,
        note: "Pick up UPS batteries from supplier",
        status: "DONE",
      },
    ],
  });
  console.log("  ✓ Todos");

  // ── Reminders ────────────────────────────────────────────────
  await prisma.reminder.createMany({
    data: [
      {
        userId: admin.id,
        ticketId: tickets[0].id,
        message: "Follow up on AC repair",
        remindAt: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        channel: "EMAIL",
      },
      {
        userId: tech.id,
        ticketId: tickets[1].id,
        message: "Check UPS battery delivery status",
        remindAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        channel: "SMS",
      },
    ],
  });
  console.log("  ✓ Reminders");

  console.log("\n✅ Seed complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
