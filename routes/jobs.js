const express = require('express');
const axios = require('axios');
const router = express.Router();

const ADZUNA_BASE_URL = 'https://api.adzuna.com/v1/api/jobs';
const APP_ID = process.env.ADZUNA_APP_ID;
const APP_KEY = process.env.ADZUNA_APP_KEY;

/**
 * @swagger
 * /api/jobs:
 *   get:
 *     summary: Get job listings from Adzuna
 *     tags: [Jobs]
 *     parameters:
 *       - in: query
 *         name: country
 *         schema:
 *           type: string
 *           default: us
 *       - in: query
 *         name: what
 *         schema:
 *           type: string
 *         description: Job title or keywords
 *       - in: query
 *         name: where
 *         schema:
 *           type: string
 *         description: Location
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: results_per_page
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: Jobs retrieved successfully
 *       500:
 *         description: Failed to fetch jobs
 */
router.get('/', async (req, res) => {
  try {
    const { 
      country = 'us', 
      category, 
      page = 1, 
      results_per_page = 20,
      what,
      where
    } = req.query;

    const params = {
      app_id: APP_ID,
      app_key: APP_KEY,
      results_per_page
    };

    if (what) params.what = what;
    if (where) params.where = where;
    if (category) params.category = category;

    const response = await axios.get(
      `${ADZUNA_BASE_URL}/${country}/search/${page}`,
      { params }
    );

    const jobs = response.data.results.map(job => ({
      id: job.id,
      title: job.title,
      company: job.company.display_name,
      location: job.location.display_name,
      description: job.description,
      salary_min: job.salary_min,
      salary_max: job.salary_max,
      contract_type: job.contract_type,
      created: job.created,
      redirect_url: job.redirect_url,
      category: job.category.label
    }));

    res.json({
      success: true,
      count: response.data.count,
      jobs
    });
  } catch (error) {
    console.error('Adzuna API Error:', error.response?.data || error.message);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch jobs',
      details: error.response?.data || error.message
    });
  }
});

/**
 * @swagger
 * /api/jobs/categories:
 *   get:
 *     summary: Get job categories
 *     tags: [Jobs]
 *     parameters:
 *       - in: query
 *         name: country
 *         schema:
 *           type: string
 *           default: us
 *     responses:
 *       200:
 *         description: Categories retrieved successfully
 */
router.get('/categories', async (req, res) => {
  try {
    const { country = 'us' } = req.query;
    
    const response = await axios.get(
      `${ADZUNA_BASE_URL}/${country}/categories`,
      {
        params: {
          app_id: APP_ID,
          app_key: APP_KEY
        }
      }
    );

    res.json({
      success: true,
      categories: response.data.results
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch categories' 
    });
  }
});

/**
 * @swagger
 * /api/jobs/top-companies:
 *   get:
 *     summary: Get top companies
 *     tags: [Jobs]
 *     parameters:
 *       - in: query
 *         name: country
 *         schema:
 *           type: string
 *           default: us
 *     responses:
 *       200:
 *         description: Companies retrieved successfully
 */
router.get('/top-companies', async (req, res) => {
  try {
    const { country = 'us' } = req.query;
    
    const response = await axios.get(
      `${ADZUNA_BASE_URL}/${country}/top_companies`,
      {
        params: {
          app_id: APP_ID,
          app_key: APP_KEY
        }
      }
    );

    res.json({
      success: true,
      companies: response.data.leaderboard
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch companies' 
    });
  }
});

module.exports = router;
