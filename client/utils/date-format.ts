import moment from 'moment';

export function formatDate(date: string) {
  return date ? moment(date).format('M/D/YYYY') : 'N/A';
}

export function getLengthInWeeks(daysDiff: number) {
  const diffWeeks = Math.floor(daysDiff / 7);
  const diffDays = daysDiff % 7;
  let desc = '';
  if (diffWeeks) {
    desc += `${diffWeeks || 0} week${diffWeeks > 1 ? 's' : ''}`;
  }
  if (diffWeeks && diffDays) {
    desc += `, `;
  }
  if (diffDays) {
    desc += `${diffDays} day${diffDays > 1 ? 's' : ''}`;
  }
  return desc;
}

// move all this to some utils/format file
export function formatCurrency(number) {
  return (number || 0).toLocaleString('en-US', { maximumFractionDigits: 2 });
}
