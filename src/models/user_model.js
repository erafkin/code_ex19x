import mongoose, { Schema, ObjectId } from 'mongoose';

const UserSchema = new Schema({
    _id: ObjectId,
    legal_prefix: String,
    legal_first_name: String,
    campus_address: String,
    last_name: String,
    prefix: String,
    legal_suffix: String,
    suffix: String,
    legal_name: String,
    first_name: String,
    cache_date: Date,
    netid: String,
    legal_last_name: String,
    email: String,
    legal_middle_name: String,
    name: String,
    middle_name: String,
    crushes: Array,  
    matches: Array,

}, { _id: false, minimize: false });

UserSchema.set('toJSON', {
  virtuals: true,
});

const UserModel = mongoose.model('User', UserSchema);

export default UserModel;
