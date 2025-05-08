-- CreateTable
CREATE TABLE "alergen_levels" (
    "id" SERIAL NOT NULL,
    "cityId" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "pollen" INTEGER,
    "dust" INTEGER,
    "mold" INTEGER,
    "ragweed" INTEGER,
    "grass" INTEGER,
    "trees" INTEGER,

    CONSTRAINT "alergen_levels_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "alergen_levels_cityId_month_key" ON "alergen_levels"("cityId", "month");

-- AddForeignKey
ALTER TABLE "alergen_levels" ADD CONSTRAINT "alergen_levels_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "cities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
