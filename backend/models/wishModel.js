const mongoose = require('mongoose');

const wishSchema = mongoose.Schema({
  artist: { type: String, required: true },
  album: { type: String, required: true },
  genre: { type: String, required: true },
  cover: { type: String, required: false }
});

module.exports = mongoose.model('Wish', wishSchema);