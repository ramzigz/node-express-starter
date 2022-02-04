/* eslint-disable no-underscore-dangle */
import File from '../models/File.js';

const addressService = {

  async create({
    filename,
    originalname,
    encoding,
    mimetype,
    path,
    size,
    owner,
  }) {
    try {
      const file = new File({
        filename,
        originalname,
        encoding,
        mimetype,
        path,
        size,
        owner,
      });

      if (file.validateSync()) { return { error: file.validateSync()._message }; }
      const create = await file.save();
      return create;
    } catch (err) {
      return { error: err };
    }
  },
  async delete(id) {
    try {
      const deleted = await File.deleteOne({ _id: id });

      return deleted;
    } catch (err) {
      return { error: err };
    }
  },

  async getOne(id) {
    try {
      const file = await File.findById(id);

      return file;
    } catch (err) {
      return { error: err };
    }
  },

};
export default addressService;
