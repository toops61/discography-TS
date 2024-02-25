import {Schema,model} from 'mongoose';

const discSchema = Schema({
  artist: { type: String, required: true },
  album: { type: String, required: true },
  year: { type: Number, required: false },
  genre: { type: String, required: true },
  format: { type: String, required: true },
  cover: { type: String, required: false },
  digipack: { type: Boolean, required: true}
});

const DiscModel = model('Disc', discSchema);

export default DiscModel;