import {Schema,model} from 'mongoose';

export interface userModelType {
  email: string;
  password: string;
  id?: string;
}

const userSchema = new Schema<userModelType>({
  email: { type: String, required: true },
  password: { type: String, required: true }
});

const UserModel = model('User', userSchema);

export default UserModel;