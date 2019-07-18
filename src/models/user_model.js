import mongoose, { Schema } from 'mongoose';

const UserSchema = new Schema({

}, { _id: false, minimize: false });

UserSchema.set('toJSON', {
  virtuals: true,
});

const UserModel = mongoose.model('User', UserSchema);

export default UserModel;
