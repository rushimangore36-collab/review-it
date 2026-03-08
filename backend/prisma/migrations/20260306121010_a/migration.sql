/*
  Warnings:

  - You are about to drop the column `item` on the `Review` table. All the data in the column will be lost.
  - You are about to drop the column `published` on the `Review` table. All the data in the column will be lost.
  - Added the required column `name` to the `Review` table without a default value. This is not possible if the table is not empty.
  - Made the column `discription` on table `Review` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Review" DROP COLUMN "item",
DROP COLUMN "published",
ADD COLUMN     "name" TEXT NOT NULL,
ALTER COLUMN "discription" SET NOT NULL;
