import express from 'express';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';

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

app.listen(3001, () => {
  console.log('Server running on port 3001');
});
