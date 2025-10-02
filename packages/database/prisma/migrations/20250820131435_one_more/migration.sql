/*
  Warnings:

  - You are about to drop the column `expires_at` on the `Subscription` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Subscription" DROP COLUMN "expires_at",
ADD COLUMN     "expired_at" TIMESTAMP(3);
