const express = require('express');
const router = express.Router();
const Resident = require('../models/Resident');
const Apartment = require('../models/Apartment');

// Session guard
router.use((req, res, next) => {
  if (!req.session.user) return res.redirect('/auth/signin');
  next();
});

router.get('/residents', async (req, res, next) => {
  try {
    const residents = await Resident.find().populate('apartment');
    const apartments = await Apartment.find();
    res.render('residents', {
      residents,
      apartments,
      error: req.flash('error'),
      success: req.flash('success')
    });
  } catch (err) { next(err); }
});

router.post('/residents', async (req, res, next) => {
  try {
    const { residentName, residentDescription, floor, age, isOwned, apartment } = req.body;
    if (!/^[a-zA-Z ]+$/.test(residentName)) {
      req.flash('error', 'Resident name must contain only letters and spaces');
      return res.redirect('/view/residents');
    }
    if (floor < 1 || floor > 40) {
      req.flash('error', 'Floor must be between 1 and 40');
      return res.redirect('/view/residents');
    }
    if (age < 1 || age > 95) {
      req.flash('error', 'Age must be between 1 and 95');
      return res.redirect('/view/residents');
    }
    const yOB = new Date().getFullYear() - Number(age);
    await Resident.create({ residentName, residentDescription, floor: Number(floor), yOB, isOwned: isOwned === 'on' || isOwned === true, apartment });
    req.flash('success', 'Resident added successfully');
    res.redirect('/view/residents');
  } catch (err) {
    req.flash('error', err.message);
    res.redirect('/view/residents');
  }
});

router.put('/residents/:id', async (req, res, next) => {
  try {
    const { residentName, residentDescription, floor, age, isOwned, apartment } = req.body;
    if (!/^[a-zA-Z ]+$/.test(residentName)) {
      req.flash('error', 'Resident name must contain only letters and spaces');
      return res.redirect('/view/residents');
    }
    if (floor < 1 || floor > 40) {
      req.flash('error', 'Floor must be between 1 and 40');
      return res.redirect('/view/residents');
    }
    if (age < 1 || age > 95) {
      req.flash('error', 'Age must be between 1 and 95');
      return res.redirect('/view/residents');
    }
    const yOB = new Date().getFullYear() - Number(age);
    await Resident.findByIdAndUpdate(req.params.id, {
      residentName, residentDescription, floor: Number(floor), yOB,
      isOwned: isOwned === 'on' || isOwned === true, apartment
    }, { runValidators: true });
    req.flash('success', 'Resident updated successfully');
    res.redirect('/view/residents');
  } catch (err) {
    req.flash('error', err.message);
    res.redirect('/view/residents');
  }
});

router.delete('/residents/:id', async (req, res, next) => {
  try {
    await Resident.findByIdAndDelete(req.params.id);
    req.flash('success', 'Resident deleted successfully');
    res.redirect('/view/residents');
  } catch (err) {
    req.flash('error', err.message);
    res.redirect('/view/residents');
  }
});

module.exports = router;
