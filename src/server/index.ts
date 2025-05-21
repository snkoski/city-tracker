import express from 'express';
import { Prisma, PrismaClient } from '@prisma/client';
import cors from 'cors';
import { EventFormData, ResourceFormData } from '../types';

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

app.listen(3001, () => {
  console.log('Server running on port 3001');
});
