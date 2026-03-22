const mongoose = require('mongoose');
const ApartmentSchema = new mongoose.Schema({
  apartmentName: { type: String, required: true, unique: true },
  totalOfFloors: { type: Number, required: true }
}, { timestamps: true });
module.exports = mongoose.model('Apartment', ApartmentSchema);
