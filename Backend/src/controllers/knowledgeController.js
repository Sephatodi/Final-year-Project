const { KnowledgeBase } = require('../models');
const { validationResult } = require('express-validator');
const { Op } = require('sequelize');
const sequelize = require('sequelize'); // Change this import

const getKnowledgeBase = async (req, res) => {
  try {
    const {
      category,
      species,
      severity,
      page = 1,
      limit = 20,
      language = 'en'
    } = req.query;

    const where = {};

    if (category) where.category = category;
    
    // Handle species filtering (works with array field)
    if (species) {
      // This works if species is stored as JSON/array
      where.species = { [Op.contains]: [species] };
    }
    
    if (severity) where.severity = severity;

    const entries = await KnowledgeBase.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
      order: [['title', 'ASC']]
    });

    // Transform based on language preference
    const transformedRows = entries.rows.map(entry => 
      transformForLanguage(entry, language)
    );

    res.json({
      success: true,
      data: transformedRows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: entries.count,
        pages: Math.ceil(entries.count / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get knowledge base error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getKnowledgeEntryById = async (req, res) => {
  try {
    const { language = 'en' } = req.query;
    
    const entry = await KnowledgeBase.findByPk(req.params.id);

    if (!entry) {
      return res.status(404).json({ message: 'Knowledge entry not found' });
    }

    // Increment view count
    await entry.increment('views');

    res.json({ 
      success: true, 
      data: transformForLanguage(entry, language) 
    });
  } catch (error) {
    console.error('Get knowledge entry by id error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const searchKnowledgeBase = async (req, res) => {
  try {
    const { q, language = 'en', page = 1, limit = 20 } = req.query;

    if (!q) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    // Cross-database compatible search
    const where = {
      [Op.or]: [
        sequelize.where(sequelize.fn('LOWER', sequelize.col('title')), {
          [Op.like]: `%${q.toLowerCase()}%`
        }),
        sequelize.where(sequelize.fn('LOWER', sequelize.col('titleSetswana')), {
          [Op.like]: `%${q.toLowerCase()}%`
        })
      ]
    };

    // Add symptoms search if the field exists
    try {
      const testEntry = await KnowledgeBase.findOne();
      if (testEntry && testEntry.symptoms) {
        where[Op.or].push(
          sequelize.where(sequelize.fn('LOWER', sequelize.cast(sequelize.col('symptoms'), 'text')), {
            [Op.like]: `%${q.toLowerCase()}%`
          })
        );
      }
    } catch (e) {
      // Ignore if symptoms field doesn't exist or is not text-searchable
    }

    const entries = await KnowledgeBase.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
      order: [['title', 'ASC']]
    });

    const transformedRows = entries.rows.map(entry => 
      transformForLanguage(entry, language)
    );

    res.json({
      success: true,
      data: transformedRows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: entries.count,
        pages: Math.ceil(entries.count / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Search knowledge base error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getKnowledgeByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const { language = 'en', page = 1, limit = 20 } = req.query;

    const entries = await KnowledgeBase.findAndCountAll({
      where: { category },
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
      order: [['title', 'ASC']]
    });

    const transformedRows = entries.rows.map(entry => 
      transformForLanguage(entry, language)
    );

    res.json({
      success: true,
      data: transformedRows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: entries.count,
        pages: Math.ceil(entries.count / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get knowledge by category error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getKnowledgeBySpecies = async (req, res) => {
  try {
    const { species } = req.params;
    const { language = 'en', page = 1, limit = 20 } = req.query;

    // For array fields, we need to use a different approach
    // This works for JSON/array fields in PostgreSQL
    const entries = await KnowledgeBase.findAndCountAll({
      where: {
        species: { [Op.contains]: [species] }
      },
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
      order: [['title', 'ASC']]
    });

    const transformedRows = entries.rows.map(entry => 
      transformForLanguage(entry, language)
    );

    res.json({
      success: true,
      data: transformedRows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: entries.count,
        pages: Math.ceil(entries.count / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get knowledge by species error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const createKnowledgeEntry = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const entry = await KnowledgeBase.create({
      ...req.body,
      views: 0,
      version: 1,
      lastUpdated: new Date()
    });

    res.status(201).json({
      success: true,
      data: entry
    });
  } catch (error) {
    console.error('Create knowledge entry error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateKnowledgeEntry = async (req, res) => {
  try {
    const entry = await KnowledgeBase.findByPk(req.params.id);

    if (!entry) {
      return res.status(404).json({ message: 'Knowledge entry not found' });
    }

    const allowedUpdates = [
      'title', 'titleSetswana', 'category', 'species',
      'symptoms', 'symptomsSetswana', 'causes', 'causesSetswana',
      'prevention', 'preventionSetswana', 'treatment', 'treatmentSetswana',
      'medications', 'severity', 'contagious', 'reportable',
      'images', 'references', 'tags'
    ];

    const updates = {};
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    updates.version = (entry.version || 0) + 1;
    updates.lastUpdated = new Date();

    await entry.update(updates);

    res.json({ success: true, data: entry });
  } catch (error) {
    console.error('Update knowledge entry error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteKnowledgeEntry = async (req, res) => {
  try {
    const entry = await KnowledgeBase.findByPk(req.params.id);

    if (!entry) {
      return res.status(404).json({ message: 'Knowledge entry not found' });
    }

    await entry.destroy();

    res.json({ success: true, message: 'Knowledge entry deleted successfully' });
  } catch (error) {
    console.error('Delete knowledge entry error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getOfflinePackage = async (req, res) => {
  try {
    // Get essential knowledge for offline use
    const entries = await KnowledgeBase.findAll({
      where: {
        [Op.or]: [
          { severity: { [Op.in]: ['high', 'critical'] } },
          { category: { [Op.in]: ['disease', 'vaccination'] } }
        ]
      },
      limit: 500,
      order: [['severity', 'DESC']]
    });

    const version = Date.now();

    res.json({
      success: true,
      data: {
        version,
        timestamp: new Date(),
        entries: entries.map(entry => {
          const entryJson = entry.toJSON();
          // Include both languages for offline
          return {
            ...entryJson,
            // Ensure both language versions are available
            titleEn: entryJson.title,
            titleTn: entryJson.titleSetswana || entryJson.title,
            symptomsEn: entryJson.symptoms,
            symptomsTn: entryJson.symptomsSetswana || entryJson.symptoms,
            causesEn: entryJson.causes,
            causesTn: entryJson.causesSetswana || entryJson.causes,
            preventionEn: entryJson.prevention,
            preventionTn: entryJson.preventionSetswana || entryJson.prevention,
            treatmentEn: entryJson.treatment,
            treatmentTn: entryJson.treatmentSetswana || entryJson.treatment
          };
        })
      }
    });
  } catch (error) {
    console.error('Get offline package error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const incrementViews = async (req, res) => {
  try {
    const entry = await KnowledgeBase.findByPk(req.params.id);

    if (!entry) {
      return res.status(404).json({ message: 'Knowledge entry not found' });
    }

    await entry.increment('views');

    res.json({ success: true });
  } catch (error) {
    console.error('Increment views error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Helper function to transform based on language preference
const transformForLanguage = (entry, language) => {
  const entryJson = entry.toJSON ? entry.toJSON() : entry;
  
  const transformed = { ...entryJson };

  if (language === 'tn' || language === 'tn') {
    transformed.title = entryJson.titleSetswana || entryJson.title;
    transformed.symptoms = entryJson.symptomsSetswana || entryJson.symptoms;
    transformed.causes = entryJson.causesSetswana || entryJson.causes;
    transformed.prevention = entryJson.preventionSetswana || entryJson.prevention;
    transformed.treatment = entryJson.treatmentSetswana || entryJson.treatment;
  }

  // Remove Setswana fields from response (optional - can keep them for debugging)
  delete transformed.titleSetswana;
  delete transformed.symptomsSetswana;
  delete transformed.causesSetswana;
  delete transformed.preventionSetswana;
  delete transformed.treatmentSetswana;

  return transformed;
};

module.exports = {
  getKnowledgeBase,
  getKnowledgeEntryById,
  searchKnowledgeBase,
  getKnowledgeByCategory,
  getKnowledgeBySpecies,
  createKnowledgeEntry,
  updateKnowledgeEntry,
  deleteKnowledgeEntry,
  getOfflinePackage,
  incrementViews
};