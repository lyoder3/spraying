enum DayEnum {
  Sunday,
  Monday,
  Tuesday,
  Wednesday,
  Thursday,
  Friday,
  Saturday
}
enum MonthEnum {
  January,
  February,
  March,
  April,
  May,
  June,
  July,
  August,
  September,
  October,
  November,
  December
}

const MILLISECONDS_PER_DAY = 1000*60*60*24;
const DAYS_PER_WEEK = 7;

function getInstanceOfDayInMonth(dayOfWeek:DayEnum, instanceCount:number, month:number, year:number) {

  let d = new Date(year, month, 1);

  const firstInstance = calculateFirstInstance(d,dayOfWeek);

  const desiredDate = firstInstance + (instanceCount - 1)*7;

  return new Date(year, month, desiredDate);
}

function calculateFirstInstance(d:Date, dayOfWeek:DayEnum): number {
  if (d.getDay() <= dayOfWeek) {
    return d.getDate() + dayOfWeek-d.getDay();
  }
  return d.getDate() + (dayOfWeek+7 - d.getDay());
}
function treatAsUTC(d:Date) {
  return d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
}
function generateSprayWeekDates(year:number) {
  const d = getInstanceOfDayInMonth(DayEnum['Monday'], 4, MonthEnum['May'], year);
  const endD = getInstanceOfDayInMonth(DayEnum['Monday'], 2, MonthEnum['October'], year);

  const diff = treatAsUTC(endD) - treatAsUTC(d);
  const weeks = Math.round(diff / MILLISECONDS_PER_DAY) / DAYS_PER_WEEK;

  const tabLabels:Array<string> = [];
  const columnLabels = []

  for (let i = 0; i < weeks; i++) {
    d.setDate(d.getDate() + 7);
    tabLabels.push(tabNameBuilder(d));
    columnLabels.push(columnLabelBulider(d));

  }
  console.log(tabLabels);
  console.log(columnLabels);
}

function weekStringBuilder(d:Date) {
  const month = d.getMonth();
  const date = d.getDate();
  const year = d.getFullYear();

  return (month+1).toString().padStart(2,'0') + '/' + date.toString().padStart(2,'0') + '/' + year;
}

function tabNameBuilder(d:Date) {
  return "W" + weekStringBuilder(d);
}
function columnLabelBulider(d:Date) {
  return "MIX " + weekStringBuilder(d);
}

generateSprayWeekDates(2022);
