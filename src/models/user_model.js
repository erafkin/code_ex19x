import mongoose, { Schema } from 'mongoose';

const UserSchema = new Schema({
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
    crushingNumber: Number,
}, {collection: "students"});

UserSchema.set('toJSON', {
  virtuals: true,
});

const User = mongoose.model('User', UserSchema);


export default User;
