/*
  Warnings:

  - Made the column `url` on table `resources` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "resources" ALTER COLUMN "url" SET NOT NULL;
