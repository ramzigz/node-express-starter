/* eslint-disable no-underscore-dangle */
import Address from '../models/Address.js';

const addressService = {

  async create({
    street,
    postalCode,
    city,
    country,
    regionCode,
    region,
    latitude,
    longitude,
    radius,
  }) {
    try {
      const address = new Address({
        street: street || '',
        postalCode: postalCode || '',
        city: city || '',
        country: country || '',
        regionCode: regionCode || '',
        region: region || '',
        radius: radius || 0,
        location: {
          coordinates: [latitude || 0, longitude || 0],
        },
      });

      if (address.validateSync()) { return { error: address.validateSync()._message }; }
      const createAddress = await address.save();
      return createAddress;
    } catch (err) {
      return { error: err };
    }
  },

  async getAll({
    populate = '', filters = {}, offset = null, limit = null, sort = '', select = '', distinct = '',
  }) {
    try {
      const addresses = await Address.find({ ...filters })
        .populate(populate)
        .skip(offset)
        .limit(limit)
        .sort(sort)
        .distinct(distinct)
        .select(`${select}`)
        .exec();

      const counts = await Address.countDocuments({ ...filters });
      return { data: { addresses, counts } };
    } catch (err) {
      return { error: err };
    }
  },

  async getById(id) {
    try {
      const address = await Address.findById(id).exec();

      return address;
    } catch (err) {
      return { error: err };
    }
  },

  async update(id, {
    street,
    postalCode,
    city,
    country,
    regionCode,
    region,
    latitude,
    longitude,
    radius,
  }) {
    try {
      const address = await addressService.getById(id);

      if (!address || address.error) return { error: 'Resource not exist' };
      const data = {};
      const location = {};

      location.coordinates = (latitude && latitude !== 0 && longitude && longitude !== 0)
        ? [latitude, longitude]
        : address.location.coordinates;

      data.location = location || address.location;
      data.radius = radius || address.radius;

      data.street = street || address.street;
      data.postalCode = postalCode || address.postalCode;
      data.city = city || address.city;
      data.country = country || address.country;
      data.regionCode = regionCode || address.regionCode;
      data.region = region || address.region;

      const saving = await Address.updateOne({ _id: id }, { $set: data });

      if (saving && !saving.error) {
        return await addressService.getById(id);
      }

      return { error: saving.error || 'Error updating' };
    } catch (err) {
      return { error: err };
    }
  },

  async delete(id) {
    try {
      const deleted = await Address.deleteOne({ _id: id });

      return deleted;
    } catch (err) {
      return { error: err };
    }
  },

};
export default addressService;
