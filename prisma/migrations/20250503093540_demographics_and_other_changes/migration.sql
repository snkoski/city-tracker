/*
  Warnings:

  - You are about to drop the column `crime_rate` on the `cities` table. All the data in the column will be lost.
  - You are about to drop the `Event` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MonthlyWeather` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Place` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `State` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
ALTER TYPE "PlaceType" ADD VALUE 'PAPA_MURPHYS';

-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_city_id_fkey";

-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_place_id_fkey";

-- DropForeignKey
ALTER TABLE "MonthlyWeather" DROP CONSTRAINT "MonthlyWeather_city_id_fkey";

-- DropForeignKey
ALTER TABLE "Place" DROP CONSTRAINT "Place_city_id_fkey";

-- DropForeignKey
ALTER TABLE "Place" DROP CONSTRAINT "Place_neighborhood_id_fkey";

-- DropForeignKey
ALTER TABLE "cities" DROP CONSTRAINT "cities_state_id_fkey";

-- AlterTable
ALTER TABLE "cities" DROP COLUMN "crime_rate",
ADD COLUMN     "bike_score" INTEGER,
ADD COLUMN     "life_expectancy" INTEGER,
ADD COLUMN     "median_household_income" INTEGER,
ADD COLUMN     "median_income" INTEGER,
ADD COLUMN     "property_crime_rate" DECIMAL(65,30),
ADD COLUMN     "schoolRating" INTEGER,
ADD COLUMN     "transit_score" INTEGER,
ADD COLUMN     "violent_crime_rate" DECIMAL(65,30);

-- AlterTable
ALTER TABLE "neighborhoods" ADD COLUMN     "bike_score" INTEGER,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "school_rating" INTEGER,
ADD COLUMN     "transit_score" INTEGER;

-- DropTable
DROP TABLE "Event";

-- DropTable
DROP TABLE "MonthlyWeather";

-- DropTable
DROP TABLE "Place";

-- DropTable
DROP TABLE "State";

-- CreateTable
CREATE TABLE "states" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "income_tax_rate" DECIMAL(65,30),
    "population" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "states_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "monthly_weather" (
    "id" SERIAL NOT NULL,
    "city_id" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "avg_high_temp_f" DECIMAL(65,30),
    "avg_low_temp_f" DECIMAL(65,30),
    "avg_temp_f" DECIMAL(65,30),
    "avgrainfall_inch" DECIMAL(65,30),
    "humiditiy" DECIMAL(65,30),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "monthly_weather_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "places" (
    "id" SERIAL NOT NULL,
    "city_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "type" "PlaceType" NOT NULL,
    "neighborhood_id" INTEGER,
    "address" TEXT NOT NULL,
    "website" TEXT,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "places_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "events" (
    "id" SERIAL NOT NULL,
    "city_id" INTEGER,
    "place_id" INTEGER,
    "name" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "start_time" TIMESTAMP(3),
    "end_time" TIMESTAMP(3),
    "details" TEXT,
    "website" TEXT,
    "ticket_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "age_demographics" (
    "id" SERIAL NOT NULL,
    "city_id" INTEGER NOT NULL,
    "age_range" TEXT NOT NULL,
    "percent" DECIMAL(65,30) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "age_demographics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ethnic_demographics" (
    "id" SERIAL NOT NULL,
    "city_id" INTEGER NOT NULL,
    "group" TEXT NOT NULL,
    "percent" DECIMAL(65,30) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ethnic_demographics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "airports" (
    "id" SERIAL NOT NULL,
    "cityId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "isInternational" BOOLEAN NOT NULL,
    "travelTimeMinutes" INTEGER,
    "distanceMiles" DOUBLE PRECISION,
    "transitOptions" TEXT,
    "website" TEXT,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "airports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "resources" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "url" TEXT,
    "category" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "resources_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "states_name_key" ON "states"("name");

-- CreateIndex
CREATE UNIQUE INDEX "monthly_weather_city_id_month_key" ON "monthly_weather"("city_id", "month");

-- CreateIndex
CREATE UNIQUE INDEX "airports_code_key" ON "airports"("code");

-- AddForeignKey
ALTER TABLE "cities" ADD CONSTRAINT "cities_state_id_fkey" FOREIGN KEY ("state_id") REFERENCES "states"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "monthly_weather" ADD CONSTRAINT "monthly_weather_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "cities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "places" ADD CONSTRAINT "places_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "cities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "places" ADD CONSTRAINT "places_neighborhood_id_fkey" FOREIGN KEY ("neighborhood_id") REFERENCES "neighborhoods"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "cities"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_place_id_fkey" FOREIGN KEY ("place_id") REFERENCES "places"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "age_demographics" ADD CONSTRAINT "age_demographics_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "cities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ethnic_demographics" ADD CONSTRAINT "ethnic_demographics_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "cities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "airports" ADD CONSTRAINT "airports_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "cities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
