/*
  Warnings:

  - Added the required column `dangerLevel` to the `Observation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable (avec gestion des données existantes)
ALTER TABLE "Observation" ADD COLUMN "dangerLevel" INTEGER DEFAULT 3;

-- AlterTable
ALTER TABLE "Species" ADD COLUMN "rarityScore" DOUBLE PRECISION NOT NULL DEFAULT 1.0;

-- Mettre le dangerLevel comme NOT NULL après l'ajout
ALTER TABLE "Observation" ALTER COLUMN "dangerLevel" SET NOT NULL;
