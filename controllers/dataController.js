import Data from '../models/Data.js';

// Get all data with optional filtering
export const getAllData = async (req, res) => {
  try {
    const {
      endYear,
      topics,
      sector,
      region,
      country,
      city,
      pestle,
      source,
      swot,
      page = 1,
      limit = 1000,
      sortBy = 'year',
      sortOrder = 'asc'
    } = req.query;

    // Build filter object
    const filter = {};
    
    if (endYear) filter.end_year = endYear;
    if (topics) filter.topics = new RegExp(topics, 'i');
    if (sector) filter.sector = new RegExp(sector, 'i');
    if (region) filter.region = new RegExp(region, 'i');
    if (country) filter.country = new RegExp(country, 'i');
    if (city) filter.city = new RegExp(city, 'i');
    if (pestle) filter.pestle = new RegExp(pestle, 'i');
    if (source) filter.source = new RegExp(source, 'i');
    if (swot) filter.swot = swot;

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query
    const data = await Data.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    // Get total count for pagination
    const total = await Data.countDocuments(filter);

    // Transform data to match frontend expectations
    const transformedData = data.map(item => ({
      id: item._id.toString(),
      end_year: item.end_year,
      intensity: item.intensity,
      likelihood: item.likelihood,
      relevance: item.relevance,
      year: item.year,
      country: item.country,
      topics: item.topics,
      region: item.region,
      city: item.city,
      sector: item.sector,
      pestle: item.pestle,
      source: item.source,
      swot: item.swot,
      title: item.title,
      url: item.url,
      published: item.published,
      added: item.added
    }));

    res.json({
      success: true,
      data: transformedData,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / parseInt(limit)),
        count: data.length,
        totalRecords: total
      }
    });

  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Error fetching data:', error);
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error while fetching data',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get filter options for dropdowns
export const getFilterOptions = async (req, res) => {
  try {
    const [
      endYears,
      topics,
      sectors,
      regions,
      countries,
      cities,
      pestles,
      sources,
      swots
    ] = await Promise.all([
      Data.distinct('end_year').then(arr => arr.filter(Boolean).sort()),
      Data.distinct('topics').then(arr => arr.filter(Boolean).sort()),
      Data.distinct('sector').then(arr => arr.filter(Boolean).sort()),
      Data.distinct('region').then(arr => arr.filter(Boolean).sort()),
      Data.distinct('country').then(arr => arr.filter(Boolean).sort()),
      Data.distinct('city').then(arr => arr.filter(Boolean).sort()),
      Data.distinct('pestle').then(arr => arr.filter(Boolean).sort()),
      Data.distinct('source').then(arr => arr.filter(Boolean).sort()),
      Data.distinct('swot').then(arr => arr.filter(Boolean).sort())
    ]);

    res.json({
      success: true,
      filterOptions: {
        endYear: endYears,
        topics: topics,
        sector: sectors,
        region: regions,
        country: countries,
        city: cities,
        pestle: pestles,
        source: sources,
        swot: swots
      }
    });

  } catch (error) {
    console.error('Error fetching filter options:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching filter options',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get analytics/statistics
export const getAnalytics = async (req, res) => {
  try {
    const analytics = await Data.aggregate([
      {
        $group: {
          _id: null,
          totalRecords: { $sum: 1 },
          avgIntensity: { $avg: '$intensity' },
          avgLikelihood: { $avg: '$likelihood' },
          avgRelevance: { $avg: '$relevance' },
          maxYear: { $max: '$year' },
          minYear: { $min: '$year' },
          uniqueCountries: { $addToSet: '$country' },
          uniqueRegions: { $addToSet: '$region' },
          uniqueTopics: { $addToSet: '$topics' }
        }
      }
    ]);

    const stats = analytics[0] || {};

    res.json({
      success: true,
      analytics: {
        totalRecords: stats.totalRecords || 0,
        avgIntensity: Math.round((stats.avgIntensity || 0) * 100) / 100,
        avgLikelihood: Math.round((stats.avgLikelihood || 0) * 100) / 100,
        avgRelevance: Math.round((stats.avgRelevance || 0) * 100) / 100,
        yearRange: {
          min: stats.minYear || 0,
          max: stats.maxYear || 0
        },
        uniqueCounts: {
          countries: (stats.uniqueCountries || []).length,
          regions: (stats.uniqueRegions || []).length,
          topics: (stats.uniqueTopics || []).length
        }
      }
    });

  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching analytics',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};