/*
  Warnings:

  - You are about to drop the column `stripe_id` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `plan` on the `Subscription` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[stripe_id]` on the table `Subscription` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `price_id` to the `Subscription` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Account" DROP COLUMN "stripe_id",
ADD COLUMN     "has_access" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "public"."Subscription" DROP COLUMN "plan",
ADD COLUMN     "price_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_stripe_id_key" ON "public"."Subscription"("stripe_id");
