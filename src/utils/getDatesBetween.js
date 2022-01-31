import moment from 'moment';

function getDaysBetweenDates(startDate, endDate) {
  let now = startDate;
  const dates = [];

  while (moment(now).isSameOrBefore(endDate)) {
    dates.push(moment(now).format('YYYY-MM-DD'));
    now = moment(now).add(1, 'days');
  }
  return dates;
}

export default getDaysBetweenDates;
