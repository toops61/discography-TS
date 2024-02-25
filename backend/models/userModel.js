import {Schema,model} from 'mongoose';

const userSchema = Schema({
  email: { type: String, required: true },
  password: { type: String, required: true }
});

const UserModel = model('User', userSchema);

export default UserModel;