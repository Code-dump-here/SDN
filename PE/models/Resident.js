const mongoose = require('mongoose');
const ResidentSchema = new mongoose.Schema({
  residentName: { type: String, required: true, unique: true },
  residentDescription: { type: String, required: true },
  floor: { type: Number, required: true, min: 1, max: 40 },
  yOB: { type: Number, required: true, min: 1940, max: 2025 },
  isOwned: { type: Boolean, default: false },
  apartment: { type: mongoose.Schema.Types.ObjectId, ref: 'Apartment', required: true }
}, { timestamps: true });
module.exports = mongoose.model('Resident', ResidentSchema);
