const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const Apartment = require('../models/Apartment');
const Resident = require('../models/Resident');

router.use(authenticate);

router.get('/apartments', async (req, res, next) => {
  try {
    const apartments = await Apartment.find();
    res.json(apartments);
  } catch (err) { next(err); }
});

router.get('/apartments/:id', async (req, res, next) => {
  try {
    const apt = await Apartment.findById(req.params.id);
    if (!apt) return res.status(404).json({ message: 'Apartment not found' });
    res.json(apt);
  } catch (err) { next(err); }
});

router.post('/apartments', async (req, res, next) => {
  try {
    const apt = await Apartment.create(req.body);
    res.status(201).json(apt);
  } catch (err) { next(err); }
});

router.put('/apartments/:id', async (req, res, next) => {
  try {
    const apt = await Apartment.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!apt) return res.status(404).json({ message: 'Apartment not found' });
    res.json(apt);
  } catch (err) { next(err); }
});

router.delete('/apartments/:id', async (req, res, next) => {
  try {
    const hasResidents = await Resident.findOne({ apartment: req.params.id });
    if (hasResidents) return res.status(400).json({ message: 'Cannot delete apartment because it has associated residents' });
    const apt = await Apartment.findByIdAndDelete(req.params.id);
    if (!apt) return res.status(404).json({ message: 'Apartment not found' });
    res.json({ message: 'Apartment deleted successfully' });
  } catch (err) { next(err); }
});

module.exports = router;
