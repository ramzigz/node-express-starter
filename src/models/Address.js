import { Schema, model } from 'mongoose';

const addressSchema = new Schema({
  street: String,
  postalCode: String,
  city: String,
  state: String,
  countryCode: String,
  country: String,
  regionCode: String,
  region: String,
  radius: Number,
  location: {
    type: { type: String, default: 'Point' },
    coordinates: { type: [Number], index: '2dsphere', default: [0, 0] },

  },
}, { timestamps: true, versionKey: false });

const Address = model('Address', addressSchema);

export default Address;
