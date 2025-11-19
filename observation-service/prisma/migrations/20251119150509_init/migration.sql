/*
  Warnings:

  - The values [APPROVED] on the enum `Status` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `imageUrl` on the `Observation` table. All the data in the column will be lost.
  - You are about to drop the column `latitude` on the `Observation` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `Observation` table. All the data in the column will be lost.
  - You are about to drop the column `longitude` on the `Observation` table. All the data in the column will be lost.
  - You are about to drop the column `species` on the `Observation` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Observation` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Observation` table. All the data in the column will be lost.
  - Added the required column `authorId` to the `Observation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `speciesId` to the `Observation` table without a default value. This is not possible if the table is not empty.
  - Made the column `description` on table `Observation` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Status_new" AS ENUM ('PENDING', 'VALIDATED', 'REJECTED');
ALTER TABLE "Observation" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Observation" ALTER COLUMN "status" TYPE "Status_new" USING ("status"::text::"Status_new");
ALTER TYPE "Status" RENAME TO "Status_old";
ALTER TYPE "Status_new" RENAME TO "Status";
DROP TYPE "Status_old";
ALTER TABLE "Observation" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

-- AlterTable
ALTER TABLE "Observation" DROP COLUMN "imageUrl",
DROP COLUMN "latitude",
DROP COLUMN "location",
DROP COLUMN "longitude",
DROP COLUMN "species",
DROP COLUMN "updatedAt",
DROP COLUMN "userId",
ADD COLUMN     "authorId" INTEGER NOT NULL,
ADD COLUMN     "speciesId" INTEGER NOT NULL,
ADD COLUMN     "validatedAt" TIMESTAMP(3),
ADD COLUMN     "validatedBy" INTEGER,
ALTER COLUMN "description" SET NOT NULL;

-- CreateTable
CREATE TABLE "Species" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "authorId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Species_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Species_name_key" ON "Species"("name");
