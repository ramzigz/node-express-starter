import moment from 'moment';
import getDaysBetweenDates from '../utils/getDatesBetween';

export default async function checkAvailabilty(ad, beginDate, endDate) {
  // console.log('ad.beginDate', ad.beginDate, 'beginDate', beginDate, 'test', moment(ad.beginDate).isSameOrBefore(moment(beginDate), 'day'));
  // console.log('ad.beginDate', ad.endDate, 'beginDate', endDate, 'test', moment(endDate).isSameOrBefore(moment(ad.endDate), 'day'));

  if (moment(ad.beginDate).isSameOrBefore(moment(beginDate), 'day')
    && moment(endDate).isSameOrBefore(moment(ad.endDate), 'day')) {
    let condition = true;
    const { reservedDates } = ad;
    const startingDate = moment(beginDate);
    const endingDate = moment(endDate);
    const daysRange = getDaysBetweenDates(startingDate, endingDate);

    for (let index = 0; index < daysRange.length; index += 1) {
      const item = daysRange[index];

      if (reservedDates.includes(item)) {
        condition = false;
      }
    }

    return condition;
  }

  return false;
}
