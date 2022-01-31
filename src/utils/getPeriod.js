import moment from 'moment';

function checkPeriodExitance(prices, period) {
  return prices?.find((item) => (item.period === period && item.total !== 0));
}

export default function getPeriod({ beginDate, endDate, prices = null }) {
  const start = moment(beginDate);
  const end = moment(endDate);

  let [hours, days, months] = [0, 0, 0];

  if (checkPeriodExitance(prices, 'MONTH')) {
    months = end.diff(start, 'months');
    start.add(months, 'months');
  }

  if (checkPeriodExitance(prices, 'DAY')) {
    days = end.diff(start, 'days');
    start.add(days, 'days');
  } else if (days >= 30 && checkPeriodExitance(prices, 'MONTH')) {
    months += 1;
    days = 0;
  }

  const minutesDiff = end.diff(start, 'minutes');

  if (minutesDiff > 0 && (minutesDiff % 60) < 60 && (minutesDiff % 60) !== 0) {
    start.subtract(1, 'hours');
  }

  if (end.diff(start, 'hours') === 24) {
    days += 1;
    hours = 0;
  } else if (checkPeriodExitance(prices, 'HOUR')) {
    hours += end.diff(start, 'hours');
    start.add(hours, 'hours');
  } else {
    const hoursDiff = end.diff(start, 'hours');

    if (hoursDiff > 0 && checkPeriodExitance(prices, 'DAY')) {
      days += 1;
      hours = 0;
    }
  }

  return {
    months, days, hours,
  };
}
