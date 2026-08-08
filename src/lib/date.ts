const WEEKDAYS = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
const MONTHS = [
  'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
  'يوليو', 'أغسطس', 'سبتمبر', 'أوكتوبر', 'نوفمبر', 'ديسمبر',
];

/** "10 أوكتوبر 2026" */
export function formatDateShort(iso: string): string {
  const d = new Date(iso);
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

/** "السبت، 10 أوكتوبر 2026" */
export function formatDateWithWeekday(iso: string): string {
  const d = new Date(iso);
  return `${WEEKDAYS[d.getDay()]}، ${formatDateShort(iso)}`;
}
