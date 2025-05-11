export const getLocalizedMonthName = (monthNumber: number, locale: string = 'en-US'): string => {
  const date = new Date();
  date.setMonth(monthNumber - 1); // setMonth is 0-indexed
  return new Intl.DateTimeFormat(locale, { month: 'long' }).format(date);
};
