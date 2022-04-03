import moment from 'moment';
import { isAdmin } from './checkAuth.js';

export default async function createFilters(query, user, isActive = true) {
  let filters = { status: { $ne: 'DELETED' } };
  if (!isAdmin(user)) {
    filters = { filters, ...(isActive && { isActive }) };
  } else {
    filters = { _id: { $nin: user._id } };
  }

  let sort = '-_id';
  let select = '';

  const addressFilters = {};

  Object.keys(query).forEach(async (key) => {
    if (query[key] !== '') {
      switch (key) {
        case ('firstName'):
          filters['profile.firstName'] = { $regex: (query[key]), $options: 'i' };
          break;
        case ('lastName'):
          filters['profile.lastName'] = { $regex: (query[key]), $options: 'i' };
          break;
        case ('name'):
          filters.name = { $regex: (query[key]), $options: 'i' };
          break;
        case ('title'):
          filters.title = { $regex: (query[key]), $options: 'i' };
          break;
        case ('email'):
          filters.email = { $regex: (query[key]), $options: 'i' };
          break;
        case ('role'):
          filters.role = query[key];
          break;
        case ('status'):
          filters.status = query[key];
          break;
        case ('createdAt'):
          filters.createdAt = {
            $gte: moment(query[key]).startOf('day').format(),
            $lt: moment(query[key]).endOf('day').format(),
          };
          break;
        case ('regionCode'):
          addressFilters.regionCode = query[key];
          break;
        case ('region'):
          addressFilters.region = query[key];
          break;
        case ('city'):
          addressFilters.city = query[key];
          break;
        case ('postalCode'):
          addressFilters.postalCode = query[key];
          break;
        case ('country'):
          addressFilters.country = query[key];
          break;
        case ('featureId'):
          filters[key] = query[key];
          break;
        case ('featureValue'):
          filters[key] = query[key];
          break;
        case ('sort'):
          sort = query[key];
          break;
        case ('select'):
          select = query[key].split(',');
          break;

        default:
          filters[key] = query[key].split(',');
      }
    }
  });

  return { filters, sort, select };
}
