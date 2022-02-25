import models from '../models/index.js';

const crudHandler = {
  async create({ model, data }) {
    try {
      if (!model || model === '') return { error: 'No model provided' };
      const created = await new models[model](data).save();
      if (!created?.error) {
        return await crudHandler.getById({ model, id: created._id });
      }
      return { error: 'error creating' };
    } catch (err) {
      return { error: err };
    }
  },

  async getList({
    model,
    populate = '',
    filters = '',
    offset = null,
    limit = null,
    sort = '',
    select = '',
  }) {
    try {
      if (!model || model === '') return { error: 'No model provided' };

      const list = await models[model].find({ ...filters })
        .populate(populate)
        .skip(offset)
        .limit(limit)
        .sort(sort)
        .select(select)
        .exec();
      const counts = await models[model].countDocuments({ ...filters });
      return { data: { list, counts } };
    } catch (err) {
      return { error: err };
    }
  },

  async getCounts({ model, filters = '' }) {
    try {
      if (!model || model === '') return { error: 'No model provided' };
      const counts = await models[model].countDocuments(filters);
      return counts;
    } catch (err) {
      return { error: err };
    }
  },

  async getById({ model, id, populate = '', select = '' }) {
    try {
      if (!model || model === '') return { error: 'No model provided' };
      return await models[model].findById(id)
        .populate(populate)
        .select(select)
        .exec();
    } catch (err) {
      return { error: err };
    }
  },

  async getOne({ model, filters = {}, populate = '' }) {
    try {
      if (!filters || Object.keys(filters).length === 0) {
        return { error: 'Filters object shouldn\'t be empty' };
      }

      return await models[model].findOne(filters)
        .populate(populate)
        .exec();
    } catch (err) {
      return { error: err };
    }
  },

  async update({ model, id, populate = '', select = '' }) {
    try {
      const response = await crudHandler.getById({ model, id });
      if (!response || response.error) return { error: 'Resource not exist' };
      const data = {};

      const saving = await models[model].updateOne({ id }, { $set: data });

      if (saving && !saving.error) {
        return await crudHandler.getById({ model, id, populate, select });
      }
      return { error: saving.error || 'Error updating' };
    } catch (err) {
      return { error: err };
    }
  },

  async delete({ model, id }) {
    try {
      return await models[model].deleteOne({ _id: id });
    } catch (err) {
      return { error: err };
    }
  },
};
export default crudHandler;
