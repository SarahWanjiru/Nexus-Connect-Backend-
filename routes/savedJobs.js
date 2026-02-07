const express = require('express');
const pool = require('../config/db');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/', auth, async (req, res) => {
  try {
    const { jobId, title, company, location, salary_min, salary_max, contract_type, category } = req.body;
    const userId = req.user.id;

    const existing = await pool.query(
      'SELECT * FROM saved_jobs WHERE user_id = $1 AND job_id = $2',
      [userId, jobId]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ success: false, error: 'Job already saved' });
    }

    await pool.query(
      'INSERT INTO saved_jobs (user_id, job_id, title, company, location, salary_min, salary_max, contract_type, category) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
      [userId, jobId, title, company, location, salary_min, salary_max, contract_type, category]
    );

    res.json({ success: true, message: 'Job saved successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to save job' });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await pool.query(
      'SELECT * FROM saved_jobs WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );

    res.json({ success: true, jobs: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch saved jobs' });
  }
});

router.delete('/:jobId', auth, async (req, res) => {
  try {
    const { jobId } = req.params;
    const userId = req.user.id;

    await pool.query(
      'DELETE FROM saved_jobs WHERE user_id = $1 AND job_id = $2',
      [userId, jobId]
    );

    res.json({ success: true, message: 'Job removed from saved' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to remove job' });
  }
});

module.exports = router;
