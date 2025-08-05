/*
  Warnings:

  - You are about to drop the column `uerId` on the `Website` table. All the data in the column will be lost.
  - Added the required column `userId` to the `Website` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Website" DROP COLUMN "uerId",
ADD COLUMN     "userId" TEXT NOT NULL;
