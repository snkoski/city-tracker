/*
  Warnings:

  - You are about to drop the `alergen_levels` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "alergen_levels" DROP CONSTRAINT "alergen_levels_cityId_fkey";

-- DropTable
DROP TABLE "alergen_levels";

-- CreateTable
CREATE TABLE "allergen_levels" (
    "id" SERIAL NOT NULL,
    "cityId" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "pollen" INTEGER,
    "dust" INTEGER,
    "mold" INTEGER,
    "ragweed" INTEGER,
    "grass" INTEGER,
    "trees" INTEGER,

    CONSTRAINT "allergen_levels_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "allergen_levels_cityId_month_key" ON "allergen_levels"("cityId", "month");

-- AddForeignKey
ALTER TABLE "allergen_levels" ADD CONSTRAINT "allergen_levels_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "cities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
