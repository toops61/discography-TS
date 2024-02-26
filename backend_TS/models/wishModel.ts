import {Schema,model} from 'mongoose';

const wishSchema = new Schema({
  artist: { type: String, required: true },
  album: { type: String, required: true },
  genre: { type: String, required: true },
  cover: { type: String, required: false }
});

const WishModel = model('Wish', wishSchema);

export default WishModel;