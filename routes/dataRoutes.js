// server/routes/dataRoutes.js
import express from 'express';
import Data from '../models/Data.js';

const router = express.Router();

// GET /api/data — fetch all data with optional filters
router.get('/', async (req, res) => {
  try {
    const query = {};
    for (const [key, value] of Object.entries(req.query)) {
      if (value) {
        query[key] = value;
      }
    }
    
    const data = await Data.find(query).limit(1000);
    res.json({ success: true, data });
  } catch (err) {
    console.error('❌ Error fetching data:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch data', error: err.message });
  }
});

// ✅ ADD THIS: GET /api/data/filter-options
router.get('/filter-options', async (req, res) => {
  try {
    console.log('🔍 Fetching filter options...');
    
    // Get all documents to see the actual structure
    const allData = await Data.find({}).limit(10);
    console.log(`📊 Found ${allData.length} documents`);
    
    if (allData.length === 0) {
      console.log('⚠️ No documents found');
      return res.json({
        success: true,
        data: {
          endYear: [],
          topics: [],
          sector: [],
          region: [],
          country: [],
          city: [],
          pestle: [],
          source: [],
          swot: []
        }
      });
    }

    // Log the first document to see actual field names
    const firstDoc = allData[0].toObject();
    console.log('📄 First document fields:', Object.keys(firstDoc));
    console.log('📄 First document values:', {
      end_year: firstDoc.end_year,
      topics: firstDoc.topics,
      sector: firstDoc.sector,
      region: firstDoc.region,
      country: firstDoc.country,
      city: firstDoc.city,
      pestle: firstDoc.pestle,
      source: firstDoc.source,
      swot: firstDoc.swot
    });

    // Try to get distinct values, but handle missing fields gracefully
    const endYear = await Data.distinct('end_year').catch(() => []);
    const topics = await Data.distinct('topics').catch(() => []);
    const sector = await Data.distinct('sector').catch(() => []);
    const region = await Data.distinct('region').catch(() => []);
    const country = await Data.distinct('country').catch(() => []);
    const city = await Data.distinct('city').catch(() => []);
    const pestle = await Data.distinct('pestle').catch(() => []);
    const source = await Data.distinct('source').catch(() => []);
    const swot = await Data.distinct('swot').catch(() => []);

    console.log('🔧 Filter options found:');
    console.log('  endYear:', endYear);
    console.log('  topics:', topics);
    console.log('  sector:', sector);
    console.log('  region:', region);
    console.log('  country:', country);
    console.log('  city:', city);
    console.log('  pestle:', pestle);
    console.log('  source:', source);
    console.log('  swot:', swot);

    res.json({
      success: true,
      data: {
        endYear: endYear || [],
        topics: topics || [],
        sector: sector || [],
        region: region || [],
        country: country || [],
        city: city || [],
        pestle: pestle || [],
        source: source || [],
        swot: swot || []
      }
    });
  } catch (err) {
    console.error('❌ Error fetching filter options:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch filter options', error: err.message });
  }
});

// GET /api/data/debug - show data structure
router.get('/debug', async (req, res) => {
  try {
    const data = await Data.find({}).limit(3);
    
    if (data.length === 0) {
      return res.json({ message: 'No data found in database' });
    }
    
    const sample = data[0].toObject();
    const fields = Object.keys(sample);
    
    res.json({
      totalDocuments: await Data.countDocuments(),
      sampleDocument: sample,
      availableFields: fields,
      fieldTypes: fields.reduce((acc, field) => {
        acc[field] = typeof sample[field];
        return acc;
      }, {})
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
