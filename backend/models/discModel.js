const mongoose = require('mongoose');

const discSchema = mongoose.Schema({
  artist: { type: String, required: true },
  album: { type: String, required: true },
  year: { type: Number, required: false },
  genre: { type: String, required: true },
  format: { type: String, required: true },
  cover: { type: String, required: false },
  digipack: { type: Boolean, required: true}
});

module.exports = mongoose.model('Disc', discSchema);