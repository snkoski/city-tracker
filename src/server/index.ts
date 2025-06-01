import express from 'express';
import { Prisma, PrismaClient } from '@prisma/client';
import cors from 'cors';
import {
  AgeDemographicFormData,
  AirportFormData,
  AllergenLevelFormData,
  CityFormData,
  EthnicDemographicFormData,
  EventFormData,
  NeighborhoodFormData,
  ResourceFormData
} from '../types';

const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());

// States endpoint
app.get('/api/states', async (req, res) => {
  try {
    const states = await prisma.state.findMany({
      orderBy: {
        name: 'asc'
      }
    });
    res.json(states);
  } catch (error) {
    console.error('Error fetching states:', error);
    res.status(500).json({ error: 'Failed to fetch states' });
  }
});

// Cities
app.get('/api/states/:stateId/cities', async (req, res) => {
  const stateId = parseInt(req.params.stateId, 10);
  try {
    if (isNaN(stateId)) {
      res.status(400).json({ error: 'Invalid stateId format' });
    }

    const stateExists = await prisma.state.findUnique({
      where: {
        id: stateId
      }
    });

    if (!stateExists) {
      res.status(404).json({ error: `State with ID ${stateId} does not exist` });
    }

    const cities = await prisma.city.findMany({
      where: { stateId: stateId },
      orderBy: { name: 'asc' }
    });

    res.json(cities);
  } catch (error) {
    console.error(`Error fetching cities for state ID ${stateId}: ${error}`);
    res.status(500).json({ error: 'Failed to fetch cities for the state' });
  }
});

app.get('/api/cities', async (req, res) => {
  try {
    const cities = await prisma.city.findMany({
      include: {
        state: true,
        neighborhoods: true
      },
      orderBy: {
        name: 'asc'
      }
    });
    res.json(cities);
  } catch (error) {
    console.error('Error fetching cities:', error);
    res.status(500).json({ error: 'Failed to fetch cities' });
  }
});

app.get(`/api/cities/:cityId`, async (req, res) => {
  const cityId = parseInt(req.params.cityId, 10);
  try {
    if (isNaN(cityId)) {
      res.status(400).json({ error: 'Invalid cityId format' });
    }

    const city = await prisma.city.findUnique({
      where: { id: cityId },
      include: {
        places: true,
        airports: true,
        events: {
          include: {
            place: true
          }
        },
        monthlyWeather: true,
        neighborhoods: true,
        ageDemographics: true,
        ethnicDemographics: true,
        allergenLevels: true,
        state: true
      }
    });
    res.json(city);
  } catch (error) {
    console.error(`Error fetching that city ${cityId}:${error}`);
    res.status(500).json({ error: `Failed to fetch city ${cityId}` });
  }
});

app.post('/api/cities', async (req, res) => {
  try {
    console.log('Received city data:', req.body);
    const city = await prisma.city.create({
      data: {
        name: req.body.name,
        stateId: req.body.stateId,
        population: req.body.population ? parseInt(req.body.population) : null,
        salesTaxRate: req.body.salesTaxRate ? parseFloat(req.body.salesTaxRate) : null
      }
    });
    console.log('Created city:', city);
    res.json(city);
  } catch (error) {
    console.error('Detailed error creating city:', error);
    res.status(500).json({
      error: 'Failed to create city',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

app.patch('/api/cities/:id', async (req, res) => {
  const cityId = parseInt(req.params.id, 10);
  if (isNaN(cityId)) {
    res.status(400).json({ error: 'Invalid city ID format. ID must be a number.' });
  }
  const {
    name,
    stateId,
    population,
    salesTaxRate,
    subreddit,
    naturalDisasters,
    violentCrimeRate,
    propertyCrimeRate,
    lifeExpectancy,
    medianIncome,
    medianHouseholdIncome,
    walkabilityScore,
    bikeScore,
    transitScore,
    schoolRating,
    notes
  } = req.body;
  const updateData: Partial<CityFormData> = {};
  if (name !== undefined) updateData.name = name;
  if (stateId !== undefined) updateData.stateId = stateId;
  if (population !== undefined) updateData.population = population;
  if (salesTaxRate !== undefined) updateData.salesTaxRate = salesTaxRate;
  if (subreddit !== undefined) updateData.subreddit = subreddit;
  if (naturalDisasters !== undefined) updateData.naturalDisasters = naturalDisasters;
  if (violentCrimeRate !== undefined) updateData.violentCrimeRate = violentCrimeRate;
  if (propertyCrimeRate !== undefined) updateData.propertyCrimeRate = propertyCrimeRate;
  if (lifeExpectancy !== undefined) updateData.lifeExpectancy = lifeExpectancy;
  if (medianIncome !== undefined) updateData.medianIncome = medianIncome;
  if (medianHouseholdIncome !== undefined) updateData.medianHouseholdIncome = medianHouseholdIncome;
  if (walkabilityScore !== undefined) updateData.walkabilityScore = walkabilityScore;
  if (bikeScore !== undefined) updateData.bikeScore = bikeScore;
  if (transitScore !== undefined) updateData.transitScore = transitScore;
  if (schoolRating !== undefined) updateData.schoolRating = schoolRating;
  if (notes !== undefined) updateData.notes = notes;

  if (Object.keys(updateData).length === 0) {
    res.status(400).json({ error: 'No update data provided.' });
  }
  try {
    const updatedCity = await prisma.city.update({
      where: {
        id: cityId
      },
      data: updateData
    });
    res.status(200).json(updatedCity);
  } catch (error: unknown) {
    console.error(`Error updating event with ID ${cityId}:`, error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        res.status(404).json({ error: `City with ID ${cityId} not found.` });
      }

      if (error.code === 'P2002') {
        res.status(409).json({
          error: 'Update failed due to a conflict (e.g., unique field already exists).',
          details: `The change violates a unique constraint on ${
            Array.isArray(error.meta?.target)
              ? (error.meta?.target as string[]).join(', ')
              : error.meta?.target || 'a field'
          }.`
        });
      }
      res.status(500).json({
        error: 'Failed to update city due to a database error.',
        prismaCode: error.code
      });
    } else if (error instanceof Error) {
      // Handle generic JavaScript errors (these have a .message property)
      res.status(500).json({ error: 'Failed to update city.', details: error.message });
    } else {
      // Handle other types of thrown values (e.g., if a string was thrown)
      res.status(500).json({ error: 'An unexpected error occurred.' });
    }
  }
});

app.delete('/api/cities/:id', async (req, res) => {
  const cityId = parseInt(req.params.id, 10);
  if (isNaN(cityId)) {
    res.status(400).json({ error: 'Invalid event ID format. ID must be a number.' });
  }
  try {
    await prisma.city.delete({
      where: { id: cityId }
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({
      error: 'Failed to delete city',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Events
app.get('/api/events', async (req, res) => {
  try {
    const events = await prisma.event.findMany({
      orderBy: {
        id: 'asc'
      }
    });
    res.json(events);
  } catch (error) {
    console.error(`Error fetching events: ${error}`);
    res.status(500).json({ error: 'Failed to fetch events from postgres' });
  }
});

app.get('/api/cities/:cityId/events', async (req, res) => {
  const cityId = parseInt(req.params.cityId, 10);
  try {
    if (isNaN(cityId)) {
      res.status(400).json({ error: 'Invalid stateId format' });
    }

    const cityExists = await prisma.city.findUnique({
      where: {
        id: cityId
      }
    });

    if (!cityExists) {
      res.status(404).json({ error: `City with ID ${cityId} does not exist` });
    }

    const events = await prisma.event.findMany({
      where: { cityId: cityId },
      orderBy: { name: 'asc' }
    });

    res.json(events);
  } catch (error) {
    console.error(`Error fetching events for city ID ${cityId}: ${error}`);
    res.status(500).json({ error: 'Failed to fetch events for the city' });
  }
});

app.post('/api/events', async (req, res) => {
  try {
    console.log(`Received event data: ${req.body}`);
    const event = await prisma.event.create({
      data: {
        cityId: req.body.cityId,
        placeId: req.body.placeId,
        name: req.body.name,
        date: req.body.date,
        startTime: req.body.startTime,
        endTime: req.body.endTime,
        details: req.body.details,
        website: req.body.website,
        ticketUrl: req.body.ticketUrl
      }
    });
    console.log(`Created event: ${event}`);
    res.json(event);
  } catch (error) {
    console.error(`Error creating event: ${error}`);
    res.status(500).json({
      error: 'Failed to create event',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

app.patch('/api/events/:id', async (req, res) => {
  const eventId = parseInt(req.params.id, 10);
  if (isNaN(eventId)) {
    res.status(400).json({ error: 'Invalid event ID format. ID must be a number.' });
  }

  const { cityId, placeId, name, date, startTime, endTime, details, website, ticketUrl } = req.body;
  const updateData: Partial<EventFormData> = {};
  if (cityId !== undefined) updateData.cityId = cityId;
  if (placeId !== undefined) updateData.placeId = placeId;
  if (name !== undefined) updateData.name = name;
  if (date !== undefined) updateData.date = date;
  if (startTime !== undefined) updateData.startTime = startTime;
  if (endTime !== undefined) updateData.endTime = endTime;
  if (details !== undefined) updateData.details = details;
  if (website !== undefined) updateData.website = website;
  if (ticketUrl !== undefined) updateData.ticketUrl = ticketUrl;
  if (Object.keys(updateData).length === 0) {
    res.status(400).json({ error: 'No update data provided.' });
  }
  try {
    const updatedEvent = await prisma.event.update({
      where: {
        id: eventId
      },
      data: updateData
    });
    res.status(200).json(updatedEvent);
  } catch (error: unknown) {
    console.error(`Error updating event with ID ${eventId}:`, error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        res.status(404).json({ error: `Event with ID ${eventId} not found.` });
      }

      if (error.code === 'P2002') {
        res.status(409).json({
          error: 'Update failed due to a conflict (e.g., unique field already exists).',
          details: `The change violates a unique constraint on ${
            Array.isArray(error.meta?.target)
              ? (error.meta?.target as string[]).join(', ')
              : error.meta?.target || 'a field'
          }.`
        });
      }
      res.status(500).json({
        error: 'Failed to update event due to a database error.',
        prismaCode: error.code
      });
    } else if (error instanceof Error) {
      // Handle generic JavaScript errors (these have a .message property)
      res.status(500).json({ error: 'Failed to update event.', details: error.message });
    } else {
      // Handle other types of thrown values (e.g., if a string was thrown)
      res.status(500).json({ error: 'An unexpected error occurred.' });
    }
  }
});

app.delete('/api/events/:id', async (req, res) => {
  const eventId = parseInt(req.params.id, 10);
  if (isNaN(eventId)) {
    res.status(400).json({ error: 'Invalid event ID format. ID must be a number.' });
  }
  try {
    await prisma.event.delete({
      where: { id: eventId }
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({
      error: 'Failed to delete event',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Resources
app.get('/api/resources', async (req, res) => {
  try {
    const resources = await prisma.resource.findMany({
      orderBy: {
        id: 'asc'
      }
    });
    res.json(resources);
  } catch (error) {
    console.error(`Error fetching resources: ${error}`);
    res.status(500).json({ error: 'Failed to fetch resources from postgres' });
  }
});

app.post('/api/resources', async (req, res) => {
  try {
    console.log(`Received resource data: ${req.body}`);
    const resource = await prisma.resource.create({
      data: {
        title: req.body.title,
        description: req.body.description,
        url: req.body.url,
        category: req.body.category
      }
    });
    console.log(`Created resource: ${resource}`);
    res.json(resource);
  } catch (error) {
    console.error(`Error creating resource: ${error}`);
    res.status(500).json({
      error: 'Failed to create resource',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

app.patch('/api/resources/:id', async (req, res) => {
  const resourceId = parseInt(req.params.id, 10);
  if (isNaN(resourceId)) {
    res.status(400).json({ error: 'Invalid resource ID format. ID must be a number.' });
  }

  const { title, description, url, category } = req.body;
  const updateData: Partial<ResourceFormData> = {};
  if (title !== undefined) updateData.title = title;
  if (description !== undefined) updateData.description = description;
  if (url !== undefined) updateData.url = url;
  if (category !== undefined) updateData.category = category;

  if (Object.keys(updateData).length === 0) {
    res.status(400).json({ error: 'No update data provided.' });
  }
  try {
    const updatedResource = await prisma.resource.update({
      where: {
        id: resourceId
      },
      data: updateData
    });
    res.status(200).json(updatedResource);
  } catch (error: unknown) {
    console.error(`Error updating resource with ID ${resourceId}:`, error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        res.status(404).json({ error: `Resource with ID ${resourceId} not found.` });
      }

      if (error.code === 'P2002') {
        res.status(409).json({
          error: 'Update failed due to a conflict (e.g., unique field already exists).',
          details: `The change violates a unique constraint on ${
            Array.isArray(error.meta?.target)
              ? (error.meta?.target as string[]).join(', ')
              : error.meta?.target || 'a field'
          }.`
        });
      }
      res.status(500).json({
        error: 'Failed to update resource due to a database error.',
        prismaCode: error.code
      });
    } else if (error instanceof Error) {
      // Handle generic JavaScript errors (these have a .message property)
      res.status(500).json({ error: 'Failed to update resource.', details: error.message });
    } else {
      // Handle other types of thrown values (e.g., if a string was thrown)
      res.status(500).json({ error: 'An unexpected error occurred.' });
    }
  }
});

app.delete('/api/resources/:id', async (req, res) => {
  const resourceId = parseInt(req.params.id, 10);
  if (isNaN(resourceId)) {
    res.status(400).json({ error: 'Invalid resource ID format. ID must be a number.' });
  }
  try {
    await prisma.resource.delete({
      where: { id: resourceId }
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({
      error: 'Failed to delete resource',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Monthly Weather
app.get('/api/cities/:cityId/monthlyWeather', async (req, res) => {
  const cityId = parseInt(req.params.cityId, 10);
  try {
    if (isNaN(cityId)) {
      res.status(400).json({ error: 'Invalid stateId format' });
    }

    const cityExists = await prisma.city.findUnique({
      where: {
        id: cityId
      }
    });

    if (!cityExists) {
      res.status(404).json({ error: `City with ID ${cityId} does not exist` });
    }

    const monthlyWeather = await prisma.monthlyWeather.findMany({
      where: { cityId: cityId },
      orderBy: { month: 'asc' }
    });

    res.json(monthlyWeather);
  } catch (error) {
    console.error(`Error fetching monthlyWeather for city ID ${cityId}: ${error}`);
    res.status(500).json({ error: 'Failed to fetch monthlyWeather for the city' });
  }
});

app.listen(3001, () => {
  console.log('Server running on port 3001');
});

// Neighborhoods
app.get('/api/neighborhoods', async (req, res) => {
  try {
    const neighborhoods = await prisma.neighborhood.findMany({
      orderBy: {
        id: 'asc'
      }
    });
    res.json(neighborhoods);
  } catch (error) {
    console.error(`Error fetching neighborhoods: ${error}`);
    res.status(500).json({ error: 'Failed to fetch neighborhoods from postgres' });
  }
});

app.get('/api/cities/:cityId/neighborhoods', async (req, res) => {
  const cityId = parseInt(req.params.cityId, 10);
  try {
    if (isNaN(cityId)) {
      res.status(400).json({ error: 'Invalid stateId format' });
    }

    const cityExists = await prisma.city.findUnique({
      where: {
        id: cityId
      }
    });

    if (!cityExists) {
      res.status(404).json({ error: `City with ID ${cityId} does not exist` });
    }

    const neighborhoods = await prisma.neighborhood.findMany({
      where: { cityId: cityId },
      orderBy: { name: 'asc' }
    });

    res.json(neighborhoods);
  } catch (error) {
    console.error(`Error fetching neighborhoods for city ID ${cityId}: ${error}`);
    res.status(500).json({ error: 'Failed to fetch neighborhoods for the city' });
  }
});

app.post('/api/neighborhoods', async (req, res) => {
  try {
    console.log(`Received neighborhood data: ${req.body}`);
    const neighborhood = await prisma.neighborhood.create({
      data: {
        cityId: req.body.cityId,
        name: req.body.name,
        population: req.body.population,
        area: req.body.area,
        description: req.body.description,
        walkabilityScore: req.body.walkabilityScore,
        bikeScore: req.body.bikeScore,
        transitScore: req.body.transitScore,
        schoolRating: req.body.schoolRating,
        notes: req.body.notes
      }
    });
    console.log(`Created neighborhood: ${neighborhood}`);
    res.json(neighborhood);
  } catch (error) {
    console.error(`Error creating neighborhood: ${error}`);
    res.status(500).json({
      error: 'Failed to create neighborhood',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

app.patch('/api/neighborhoods/:id', async (req, res) => {
  const neighborhoodId = parseInt(req.params.id, 10);
  if (isNaN(neighborhoodId)) {
    res.status(400).json({ error: 'Invalid neighborhood ID format. ID must be a number.' });
  }

  const {
    cityId,
    name,
    population,
    area,
    description,
    walkabilityScore,
    bikeScore,
    transitScore,
    schoolRating,
    notes
  } = req.body;
  const updateData: Partial<NeighborhoodFormData> = {};
  if (cityId !== undefined) updateData.cityId = cityId;
  if (name !== undefined) updateData.name = name;
  if (population !== undefined) updateData.population = population;
  if (area !== undefined) updateData.area = area;
  if (description !== undefined) updateData.description = description;
  if (walkabilityScore !== undefined) updateData.walkabilityScore = walkabilityScore;
  if (bikeScore !== undefined) updateData.bikeScore = bikeScore;
  if (transitScore !== undefined) updateData.transitScore = transitScore;
  if (schoolRating !== undefined) updateData.schoolRating = schoolRating;
  if (notes !== undefined) updateData.notes = notes;
  if (Object.keys(updateData).length === 0) {
    res.status(400).json({ error: 'No update data provided.' });
  }
  try {
    const updatedNeighborhood = await prisma.neighborhood.update({
      where: {
        id: neighborhoodId
      },
      data: updateData
    });
    res.status(200).json(updatedNeighborhood);
  } catch (error: unknown) {
    console.error(`Error updating neighborhood with ID ${neighborhoodId}:`, error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        res.status(404).json({ error: `Neighborhood with ID ${neighborhoodId} not found.` });
      }

      if (error.code === 'P2002') {
        res.status(409).json({
          error: 'Update failed due to a conflict (e.g., unique field already exists).',
          details: `The change violates a unique constraint on ${
            Array.isArray(error.meta?.target)
              ? (error.meta?.target as string[]).join(', ')
              : error.meta?.target || 'a field'
          }.`
        });
      }
      res.status(500).json({
        error: 'Failed to update neighborhood due to a database error.',
        prismaCode: error.code
      });
    } else if (error instanceof Error) {
      // Handle generic JavaScript errors (these have a .message property)
      res.status(500).json({ error: 'Failed to update neighborhood.', details: error.message });
    } else {
      // Handle other types of thrown values (e.g., if a string was thrown)
      res.status(500).json({ error: 'An unexpected error occurred.' });
    }
  }
});

app.delete('/api/neighborhoods/:id', async (req, res) => {
  const neighborhoodId = parseInt(req.params.id, 10);
  if (isNaN(neighborhoodId)) {
    res.status(400).json({ error: 'Invalid neighborhood ID format. ID must be a number.' });
  }
  try {
    await prisma.neighborhood.delete({
      where: { id: neighborhoodId }
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({
      error: 'Failed to delete neighborhood',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Age Demographics
app.get('/api/ageDemographics', async (req, res) => {
  try {
    const ageDemographics = await prisma.ageDemographic.findMany({
      orderBy: {
        id: 'asc'
      }
    });
    res.json(ageDemographics);
  } catch (error) {
    console.error(`Error fetching ageDemographics: ${error}`);
    res.status(500).json({ error: 'Failed to fetch ageDemographics from postgres' });
  }
});

app.get('/api/cities/:cityId/ageDemographics', async (req, res) => {
  const cityId = parseInt(req.params.cityId, 10);
  try {
    if (isNaN(cityId)) {
      res.status(400).json({ error: 'Invalid stateId format' });
    }

    const cityExists = await prisma.city.findUnique({
      where: {
        id: cityId
      }
    });

    if (!cityExists) {
      res.status(404).json({ error: `City with ID ${cityId} does not exist` });
    }

    const ageDemographics = await prisma.ageDemographic.findMany({
      where: { cityId: cityId },
      orderBy: { ageRange: 'asc' }
    });

    res.json(ageDemographics);
  } catch (error) {
    console.error(`Error fetching ageDemographics for city ID ${cityId}: ${error}`);
    res.status(500).json({ error: 'Failed to fetch ageDemographics for the city' });
  }
});

app.post('/api/ageDemographics', async (req, res) => {
  try {
    console.log(`Received ageDemographic data: ${req.body}`);
    const ageDemographic = await prisma.ageDemographic.create({
      data: {
        cityId: req.body.cityId,
        ageRange: req.body.ageRange,
        percent: req.body.percent
      }
    });
    console.log(`Created ageDemographic: ${ageDemographic}`);
    res.json(ageDemographic);
  } catch (error) {
    console.error(`Error creating ageDemographic: ${error}`);
    res.status(500).json({
      error: 'Failed to create ageDemographic',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

app.patch('/api/ageDemographics/:id', async (req, res) => {
  const ageDemographicId = parseInt(req.params.id, 10);
  if (isNaN(ageDemographicId)) {
    res.status(400).json({ error: 'Invalid ageDemographic ID format. ID must be a number.' });
  }

  const { ageRange, percent } = req.body;
  const updateData: Partial<AgeDemographicFormData> = {};
  if (ageRange !== undefined) updateData.ageRange = ageRange;
  if (percent !== undefined) updateData.percent = percent;
  if (Object.keys(updateData).length === 0) {
    res.status(400).json({ error: 'No update data provided.' });
  }
  try {
    const updatedAgeDemographic = await prisma.event.update({
      where: {
        id: ageDemographicId
      },
      data: updateData
    });
    res.status(200).json(updatedAgeDemographic);
  } catch (error: unknown) {
    console.error(`Error updating AgeDemographic with ID ${ageDemographicId}:`, error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        res.status(404).json({ error: `AgeDemographic with ID ${ageDemographicId} not found.` });
      }

      if (error.code === 'P2002') {
        res.status(409).json({
          error: 'Update failed due to a conflict (e.g., unique field already exists).',
          details: `The change violates a unique constraint on ${
            Array.isArray(error.meta?.target)
              ? (error.meta?.target as string[]).join(', ')
              : error.meta?.target || 'a field'
          }.`
        });
      }
      res.status(500).json({
        error: 'Failed to update ageDemographic due to a database error.',
        prismaCode: error.code
      });
    } else if (error instanceof Error) {
      // Handle generic JavaScript errors (these have a .message property)
      res.status(500).json({ error: 'Failed to update ageDemographic.', details: error.message });
    } else {
      // Handle other types of thrown values (e.g., if a string was thrown)
      res.status(500).json({ error: 'An unexpected error occurred.' });
    }
  }
});

app.delete('/api/ageDemographics/:id', async (req, res) => {
  const ageDemographicId = parseInt(req.params.id, 10);
  if (isNaN(ageDemographicId)) {
    res.status(400).json({ error: 'Invalid ageDemographic ID format. ID must be a number.' });
  }
  try {
    await prisma.ageDemographic.delete({
      where: { id: ageDemographicId }
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({
      error: 'Failed to delete ageDemographic',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Ethnic Demographics
app.get('/api/ethnicDemographics', async (req, res) => {
  try {
    const ethnicDemographics = await prisma.ethnicDemographic.findMany({
      orderBy: {
        id: 'asc'
      }
    });
    res.json(ethnicDemographics);
  } catch (error) {
    console.error(`Error fetching ethnicDemographics: ${error}`);
    res.status(500).json({ error: 'Failed to fetch ethnicDemographics from postgres' });
  }
});

app.get('/api/cities/:cityId/ethnicDemographics', async (req, res) => {
  const cityId = parseInt(req.params.cityId, 10);
  try {
    if (isNaN(cityId)) {
      res.status(400).json({ error: 'Invalid stateId format' });
    }

    const cityExists = await prisma.city.findUnique({
      where: {
        id: cityId
      }
    });

    if (!cityExists) {
      res.status(404).json({ error: `City with ID ${cityId} does not exist` });
    }

    const ethnicDemographics = await prisma.ethnicDemographic.findMany({
      where: { cityId: cityId },
      orderBy: { group: 'asc' }
    });

    res.json(ethnicDemographics);
  } catch (error) {
    console.error(`Error fetching ethnicDemographics for city ID ${cityId}: ${error}`);
    res.status(500).json({ error: 'Failed to fetch ethnicDemographics for the city' });
  }
});

app.post('/api/ethnicDemographics', async (req, res) => {
  try {
    console.log(`Received ethnicDemographic data: ${req.body}`);
    const ethnicDemographic = await prisma.ethnicDemographic.create({
      data: {
        cityId: req.body.cityId,
        group: req.body.string,
        percent: req.body.Decimal
      }
    });
    console.log(`Created ethnicDemographic: ${ethnicDemographic}`);
    res.json(ethnicDemographic);
  } catch (error) {
    console.error(`Error creating ethnicDemographic: ${error}`);
    res.status(500).json({
      error: 'Failed to create ethnicDemographic',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

app.patch('/api/ethnicDemographics/:id', async (req, res) => {
  const ethnicDemographicId = parseInt(req.params.id, 10);
  if (isNaN(ethnicDemographicId)) {
    res.status(400).json({ error: 'Invalid ethnicDemographic ID format. ID must be a number.' });
  }

  const { group, percent } = req.body;
  const updateData: Partial<EthnicDemographicFormData> = {};
  if (group !== undefined) updateData.group = group;
  if (percent !== undefined) updateData.percent = percent;
  if (Object.keys(updateData).length === 0) {
    res.status(400).json({ error: 'No update data provided.' });
  }
  try {
    const updatedEthnicDemographic = await prisma.event.update({
      where: {
        id: ethnicDemographicId
      },
      data: updateData
    });
    res.status(200).json(updatedEthnicDemographic);
  } catch (error: unknown) {
    console.error(`Error updating ethnicDemographic with ID ${ethnicDemographicId}:`, error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        res
          .status(404)
          .json({ error: `ethnicDemographic with ID ${ethnicDemographicId} not found.` });
      }

      if (error.code === 'P2002') {
        res.status(409).json({
          error: 'Update failed due to a conflict (e.g., unique field already exists).',
          details: `The change violates a unique constraint on ${
            Array.isArray(error.meta?.target)
              ? (error.meta?.target as string[]).join(', ')
              : error.meta?.target || 'a field'
          }.`
        });
      }
      res.status(500).json({
        error: 'Failed to update ethnicDemographic due to a database error.',
        prismaCode: error.code
      });
    } else if (error instanceof Error) {
      // Handle generic JavaScript errors (these have a .message property)
      res
        .status(500)
        .json({ error: 'Failed to update ethnicDemographic.', details: error.message });
    } else {
      // Handle other types of thrown values (e.g., if a string was thrown)
      res.status(500).json({ error: 'An unexpected error occurred.' });
    }
  }
});

app.delete('/api/ethnicDemographics/:id', async (req, res) => {
  const ethnicDemographicId = parseInt(req.params.id, 10);
  if (isNaN(ethnicDemographicId)) {
    res.status(400).json({ error: 'Invalid ethnicDemographic ID format. ID must be a number.' });
  }
  try {
    await prisma.ethnicDemographic.delete({
      where: { id: ethnicDemographicId }
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({
      error: 'Failed to delete ethnicDemographic',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Ethnic Demographics
app.get('/api/ethnicDemographics', async (req, res) => {
  try {
    const ethnicDemographics = await prisma.ethnicDemographic.findMany({
      orderBy: {
        id: 'asc'
      }
    });
    res.json(ethnicDemographics);
  } catch (error) {
    console.error(`Error fetching ethnicDemographics: ${error}`);
    res.status(500).json({ error: 'Failed to fetch ethnicDemographics from postgres' });
  }
});

app.get('/api/cities/:cityId/ethnicDemographics', async (req, res) => {
  const cityId = parseInt(req.params.cityId, 10);
  try {
    if (isNaN(cityId)) {
      res.status(400).json({ error: 'Invalid stateId format' });
    }

    const cityExists = await prisma.city.findUnique({
      where: {
        id: cityId
      }
    });

    if (!cityExists) {
      res.status(404).json({ error: `City with ID ${cityId} does not exist` });
    }

    const ethnicDemographics = await prisma.ethnicDemographic.findMany({
      where: { cityId: cityId },
      orderBy: { group: 'asc' }
    });

    res.json(ethnicDemographics);
  } catch (error) {
    console.error(`Error fetching ethnicDemographics for city ID ${cityId}: ${error}`);
    res.status(500).json({ error: 'Failed to fetch ethnicDemographics for the city' });
  }
});

app.post('/api/ethnicDemographics', async (req, res) => {
  try {
    console.log(`Received ethnicDemographic data: ${req.body}`);
    const ethnicDemographic = await prisma.ethnicDemographic.create({
      data: {
        cityId: req.body.cityId,
        group: req.body.string,
        percent: req.body.Decimal
      }
    });
    console.log(`Created ethnicDemographic: ${ethnicDemographic}`);
    res.json(ethnicDemographic);
  } catch (error) {
    console.error(`Error creating ethnicDemographic: ${error}`);
    res.status(500).json({
      error: 'Failed to create ethnicDemographic',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

app.patch('/api/ethnicDemographics/:id', async (req, res) => {
  const ethnicDemographicId = parseInt(req.params.id, 10);
  if (isNaN(ethnicDemographicId)) {
    res.status(400).json({ error: 'Invalid ethnicDemographic ID format. ID must be a number.' });
  }

  const { group, percent } = req.body;
  const updateData: Partial<EthnicDemographicFormData> = {};
  if (group !== undefined) updateData.group = group;
  if (percent !== undefined) updateData.percent = percent;
  if (Object.keys(updateData).length === 0) {
    res.status(400).json({ error: 'No update data provided.' });
  }
  try {
    const updatedEthnicDemographic = await prisma.event.update({
      where: {
        id: ethnicDemographicId
      },
      data: updateData
    });
    res.status(200).json(updatedEthnicDemographic);
  } catch (error: unknown) {
    console.error(`Error updating ethnicDemographic with ID ${ethnicDemographicId}:`, error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        res
          .status(404)
          .json({ error: `ethnicDemographic with ID ${ethnicDemographicId} not found.` });
      }

      if (error.code === 'P2002') {
        res.status(409).json({
          error: 'Update failed due to a conflict (e.g., unique field already exists).',
          details: `The change violates a unique constraint on ${
            Array.isArray(error.meta?.target)
              ? (error.meta?.target as string[]).join(', ')
              : error.meta?.target || 'a field'
          }.`
        });
      }
      res.status(500).json({
        error: 'Failed to update ethnicDemographic due to a database error.',
        prismaCode: error.code
      });
    } else if (error instanceof Error) {
      // Handle generic JavaScript errors (these have a .message property)
      res
        .status(500)
        .json({ error: 'Failed to update ethnicDemographic.', details: error.message });
    } else {
      // Handle other types of thrown values (e.g., if a string was thrown)
      res.status(500).json({ error: 'An unexpected error occurred.' });
    }
  }
});

app.delete('/api/ethnicDemographics/:id', async (req, res) => {
  const ethnicDemographicId = parseInt(req.params.id, 10);
  if (isNaN(ethnicDemographicId)) {
    res.status(400).json({ error: 'Invalid ethnicDemographic ID format. ID must be a number.' });
  }
  try {
    await prisma.ethnicDemographic.delete({
      where: { id: ethnicDemographicId }
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({
      error: 'Failed to delete ethnicDemographic',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Allergen Levels
app.get('/api/allergenLevels', async (req, res) => {
  try {
    const allergenLevels = await prisma.allergenLevel.findMany({
      orderBy: {
        id: 'asc'
      }
    });
    res.json(allergenLevels);
  } catch (error) {
    console.error(`Error fetching allergenLevels: ${error}`);
    res.status(500).json({ error: 'Failed to fetch allergenLevels from postgres' });
  }
});

app.get('/api/cities/:cityId/allergenLevels', async (req, res) => {
  const cityId = parseInt(req.params.cityId, 10);
  try {
    if (isNaN(cityId)) {
      res.status(400).json({ error: 'Invalid stateId format' });
    }

    const cityExists = await prisma.city.findUnique({
      where: {
        id: cityId
      }
    });

    if (!cityExists) {
      res.status(404).json({ error: `City with ID ${cityId} does not exist` });
    }

    const allergenLevels = await prisma.allergenLevel.findMany({
      where: { cityId: cityId },
      orderBy: { month: 'asc' }
    });

    res.json(allergenLevels);
  } catch (error) {
    console.error(`Error fetching allergenLevels for city ID ${cityId}: ${error}`);
    res.status(500).json({ error: 'Failed to fetch allergenLevels for the city' });
  }
});

app.post('/api/allergenLevels', async (req, res) => {
  try {
    console.log(`Received allergenLevel data: ${req.body}`);
    const allergenLevel = await prisma.allergenLevel.create({
      data: {
        cityId: req.body.cityId,
        month: req.body.month,
        pollen: req.body.pollen,
        dust: req.body.dust,
        mold: req.body.mold,
        ragweed: req.body.ragweed,
        grass: req.body.grass,
        trees: req.body.trees
      }
    });
    console.log(`Created allergenLevel: ${allergenLevel}`);
    res.json(allergenLevel);
  } catch (error) {
    console.error(`Error creating allergenLevel: ${error}`);
    res.status(500).json({
      error: 'Failed to create allergenLevel',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

app.patch('/api/allergenLevels/:id', async (req, res) => {
  const allergenLevelId = parseInt(req.params.id, 10);
  if (isNaN(allergenLevelId)) {
    res.status(400).json({ error: 'Invalid allergenLevel ID format. ID must be a number.' });
  }

  const { month, pollen, dust, mold, ragweed, grass, trees } = req.body;
  const updateData: Partial<AllergenLevelFormData> = {};

  if (month !== undefined) updateData.month = month;
  if (pollen !== undefined) updateData.pollen = pollen;
  if (dust !== undefined) updateData.dust = dust;
  if (mold !== undefined) updateData.mold = mold;
  if (ragweed !== undefined) updateData.ragweed = ragweed;
  if (grass !== undefined) updateData.grass = grass;
  if (trees !== undefined) updateData.trees = trees;
  if (Object.keys(updateData).length === 0) {
    res.status(400).json({ error: 'No update data provided.' });
  }
  try {
    const updatedEthnicDemographic = await prisma.event.update({
      where: {
        id: allergenLevelId
      },
      data: updateData
    });
    res.status(200).json(updatedEthnicDemographic);
  } catch (error: unknown) {
    console.error(`Error updating allergenLevel with ID ${allergenLevelId}:`, error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        res.status(404).json({ error: `allergenLevel with ID ${allergenLevelId} not found.` });
      }

      if (error.code === 'P2002') {
        res.status(409).json({
          error: 'Update failed due to a conflict (e.g., unique field already exists).',
          details: `The change violates a unique constraint on ${
            Array.isArray(error.meta?.target)
              ? (error.meta?.target as string[]).join(', ')
              : error.meta?.target || 'a field'
          }.`
        });
      }
      res.status(500).json({
        error: 'Failed to update allergenLevel due to a database error.',
        prismaCode: error.code
      });
    } else if (error instanceof Error) {
      // Handle generic JavaScript errors (these have a .message property)
      res.status(500).json({ error: 'Failed to update allergenLevel.', details: error.message });
    } else {
      // Handle other types of thrown values (e.g., if a string was thrown)
      res.status(500).json({ error: 'An unexpected error occurred.' });
    }
  }
});

app.delete('/api/allergenLevels/:id', async (req, res) => {
  const allergenLevelId = parseInt(req.params.id, 10);
  if (isNaN(allergenLevelId)) {
    res.status(400).json({ error: 'Invalid allergenLevel ID format. ID must be a number.' });
  }
  try {
    await prisma.allergenLevel.delete({
      where: { id: allergenLevelId }
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({
      error: 'Failed to delete allergenLevel',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Airports
app.get('/api/airports', async (req, res) => {
  try {
    const airports = await prisma.airport.findMany({
      orderBy: {
        id: 'asc'
      }
    });
    res.json(airports);
  } catch (error) {
    console.error(`Error fetching airports: ${error}`);
    res.status(500).json({ error: 'Failed to fetch airports from postgres' });
  }
});

app.get('/api/cities/:cityId/airports', async (req, res) => {
  const cityId = parseInt(req.params.cityId, 10);
  try {
    if (isNaN(cityId)) {
      res.status(400).json({ error: 'Invalid stateId format' });
    }

    const cityExists = await prisma.city.findUnique({
      where: {
        id: cityId
      }
    });

    if (!cityExists) {
      res.status(404).json({ error: `City with ID ${cityId} does not exist` });
    }

    const airports = await prisma.airport.findMany({
      where: { cityId: cityId },
      orderBy: { name: 'asc' }
    });

    res.json(airports);
  } catch (error) {
    console.error(`Error fetching airports for city ID ${cityId}: ${error}`);
    res.status(500).json({ error: 'Failed to fetch airports for the city' });
  }
});

app.post('/api/airports', async (req, res) => {
  try {
    console.log(`Received airport data: ${req.body}`);
    const airport = await prisma.airport.create({
      data: {
        cityId: req.body.cityId,
        name: req.body.name,
        code: req.body.code,
        isInternational: req.body.isInternational,
        travelTimeMinutes: req.body.travelTimeMinutes,
        distanceMiles: req.body.distanceMiles,
        transitOptions: req.body.transitOptions,
        website: req.body.website,
        description: req.body.description
      }
    });
    console.log(`Created airport: ${airport}`);
    res.json(airport);
  } catch (error) {
    console.error(`Error creating airport: ${error}`);
    res.status(500).json({
      error: 'Failed to create airport',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

app.patch('/api/airports/:id', async (req, res) => {
  const airportId = parseInt(req.params.id, 10);
  if (isNaN(airportId)) {
    res.status(400).json({ error: 'Invalid airport ID format. ID must be a number.' });
  }

  const {
    name,
    code,
    isInternational,
    travelTimeMinutes,
    distanceMiles,
    transitOptions,
    website,
    description
  } = req.body;
  const updateData: Partial<AirportFormData> = {};

  if (name !== undefined) updateData.name = name;
  if (code !== undefined) updateData.code = code;
  if (isInternational !== undefined) updateData.isInternational = isInternational;
  if (travelTimeMinutes !== undefined) updateData.travelTimeMinutes = travelTimeMinutes;
  if (distanceMiles !== undefined) updateData.distanceMiles = distanceMiles;
  if (transitOptions !== undefined) updateData.transitOptions = transitOptions;
  if (website !== undefined) updateData.website = website;
  if (description !== undefined) updateData.description = description;
  if (Object.keys(updateData).length === 0) {
    res.status(400).json({ error: 'No update data provided.' });
  }
  try {
    const updatedAirport = await prisma.event.update({
      where: {
        id: airportId
      },
      data: updateData
    });
    res.status(200).json(updatedAirport);
  } catch (error: unknown) {
    console.error(`Error updating airport with ID ${airportId}:`, error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        res.status(404).json({ error: `airport with ID ${airportId} not found.` });
      }

      if (error.code === 'P2002') {
        res.status(409).json({
          error: 'Update failed due to a conflict (e.g., unique field already exists).',
          details: `The change violates a unique constraint on ${
            Array.isArray(error.meta?.target)
              ? (error.meta?.target as string[]).join(', ')
              : error.meta?.target || 'a field'
          }.`
        });
      }
      res.status(500).json({
        error: 'Failed to update airport due to a database error.',
        prismaCode: error.code
      });
    } else if (error instanceof Error) {
      // Handle generic JavaScript errors (these have a .message property)
      res.status(500).json({ error: 'Failed to update airport.', details: error.message });
    } else {
      // Handle other types of thrown values (e.g., if a string was thrown)
      res.status(500).json({ error: 'An unexpected error occurred.' });
    }
  }
});

app.delete('/api/airports/:id', async (req, res) => {
  const airportId = parseInt(req.params.id, 10);
  if (isNaN(airportId)) {
    res.status(400).json({ error: 'Invalid airport ID format. ID must be a number.' });
  }
  try {
    await prisma.airport.delete({
      where: { id: airportId }
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({
      error: 'Failed to delete airport',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});
