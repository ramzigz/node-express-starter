import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const fileSchema = new Schema({
  filename: String,
  originalname: String,
  encoding: String,
  mimetype: String,
  path: String,
  size: Number,
  owner: { type: Schema.Types.ObjectId, ref: 'User', default: null },
}, { timestamps: true,versionKey: false  });

const File = model('File', fileSchema);

export default File;
