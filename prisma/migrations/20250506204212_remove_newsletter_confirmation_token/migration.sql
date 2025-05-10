/*
  Warnings:

  - You are about to drop the column `confirmationToken` on the `newslettersubscriber` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `newslettersubscriber` DROP COLUMN `confirmationToken`,
    MODIFY `isConfirmed` BOOLEAN NOT NULL DEFAULT true;
