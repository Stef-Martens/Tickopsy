"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSubscription = updateSubscription;
const database_tickopsy_1 = __importDefault(require("@stef_martens/database-tickopsy"));
async function updateSubscription({ subscriptionId, email, status, plan, expiresAt, }) {
    const user = await database_tickopsy_1.default.user.findFirst({ where: { email } });
    if (!user)
        throw new Error("User not found");
    const accountId = user.accountId; // assuming user has an accountId field
    await database_tickopsy_1.default.subscription.upsert({
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
