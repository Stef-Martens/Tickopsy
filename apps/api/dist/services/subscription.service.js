"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSubscription = updateSubscription;
const database_tickopsy_1 = __importDefault(require("@stef_martens/database-tickopsy"));
async function updateSubscription({ subscriptionId, email, status, priceId, expiredAt = new Date(), }) {
    const user = await database_tickopsy_1.default.user.findFirst({ where: { email } });
    if (!user)
        throw new Error("User not found");
    const accountId = user.accountId; // assuming user has an accountId field
    await database_tickopsy_1.default.subscription.upsert({
        where: { stripeId: subscriptionId }, // use the unique subscription id
        update: {
            priceId,
            status,
            startedAt: new Date(),
            expiredAt: status !== "active" ? new Date(expiredAt) : undefined,
        },
        create: {
            accountId, // get the account linked to the Stripe customer
            stripeId: subscriptionId,
            priceId,
            status,
            startedAt: new Date(),
            expiredAt: status !== "active" ? new Date(expiredAt) : undefined,
        },
    });
    if (status === "active") {
        await database_tickopsy_1.default.account.update({
            where: { id: accountId },
            data: { hasAccess: true },
        });
    }
    else if (status === "canceled" || status === "past_due") {
        await database_tickopsy_1.default.account.update({
            where: { id: accountId },
            data: { hasAccess: false },
        });
    }
}
