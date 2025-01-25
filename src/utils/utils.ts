export function setChildrenUndefined(data: any[]) {
  for (let i = 0; i < data.length; i += 1) {
    const item = data[i];
    if (item.children && item.children.length > 0) {
      setChildrenUndefined(item.children);
    } else {
      item.children = undefined;
    }
  }
}

export function getQueryVariable(variable: string): string {
  const query = window.location.search.substring(1);
  const vars = query.split('&');
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < vars.length; i++) {
    const pair = vars[i].split('=');
    // eslint-disable-next-line eqeqeq
    if (pair[0] == variable) {
      return pair[1];
    }
  }
  return '';
}

export const getNowFormatDate = (date) => {
  const year = date.getFullYear(); // 返回日期的年
  let month = date.getMonth() + 1; // 月份 返回的月份小1个月   记得月份+1
  let d = date.getDate(); // 返回的是 几号
  month = month < 10 ? '0' + month : month;
  d = d < 10 ? '0' + d : d;

  return `${year}-${month}-${d}`;
};
export const getlastMonth = (now: Date) => {
  // 当前年月的日
  const nowDate = now.getDate();
  //当前月份完整日期 (Thu Jul 07 2022 12:03:37 GMT+0800 (中国标准时间))
  const lastMonth = new Date(now.getTime());
  // 设置上一个月（这里不需要减1） getMonth()返回表示月份的数字 setMonth()设置月份参数
  lastMonth.setMonth(lastMonth.getMonth());
  // 设置为0，默认为当前月的最后一天
  lastMonth.setDate(0);
  // 上一个月的天数
  const daysOflastMonth = lastMonth.getDate();
  // 设置上一个月的日期，如果当前月的日期大于上个月的总天数，则为最后一天
  // 例如当前是3月31，而2月只有28或29天，则取2月的最后一天
  lastMonth.setDate(nowDate > daysOflastMonth ? daysOflastMonth : nowDate);
  //调用格式化日期函数
  const lastMonths = getNowFormatDate(lastMonth);
  return lastMonths;
};

export const getNowdate = (now: Date) => {
  const year = now.getFullYear(); //获取当前时间的年份
  const month = now.getMonth(); //获取当前时间的月份
  const day = now.getDate(); //获取当前时间的日
  let newYear = year;
  let nextMonth = parseInt(String(month + 2), 10); //获取当前月份的一个月以后的月份
  let currentDay = day;
  /* 				days = new Date(year, month, 0) //将获取到的年月赋值给days
              days = days.getDate() //获取当前年月的日 */

  //考虑到12月要是获取一个月以后，就是一月，年份需要加一 ，一年没有13月，所以%12，取得来年1月
  if (nextMonth > 12) {
    newYear = parseInt(String(newYear), 10) + 1;
    nextMonth = parseInt(String(nextMonth), 10) % 12;
  }

  const nextDay = new Date(newYear, nextMonth, 0); //将获取到的年月赋值给nextDay
  const nextDayn = nextDay.getDate(); //获取当前月份的一个月以后的日

  /* 			获取了当前年份的日和1个月以后的日，为的就是判断如果前一个月是有31号，
              后一个月没有，就将一个月以后的日期取到，赋值给currentDay */
  currentDay = currentDay > nextDayn ? nextDayn : currentDay;

  const nextMonthn = nextMonth < 10 ? '0' + nextMonth : nextMonth;

  const currentDayn = currentDay < 10 ? '0' + currentDay : currentDay;

  return `${newYear}-${nextMonthn}-${currentDayn}`;
};

const nameMap = new Map<string, string>();

nameMap.set('MoveUp', 'ArrowUp');
nameMap.set('MoveDown', 'ArrowDown');
nameMap.set('MoveLeft', 'ArrowLeft');
nameMap.set('MoveRight', 'ArrowRight');

export const timesTamp = (createdAt) => {
  //时间戳转时间；时间戳->yyyy-mm-dd hh:mm:ss
  const date = new Date(createdAt);
  const Y = date.getFullYear() + '-';
  const M =
    (date.getMonth() + 1 < 10
      ? '0' + (date.getMonth() + 1)
      : date.getMonth() + 1) + '-';
  const D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
  const h =
    (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
  const m =
    (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) +
    ':';
  const s =
    date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
  return Y + M + D + h + m + s;
};

export default { setChildrenUndefined, getQueryVariable, nameMap, timesTamp };
