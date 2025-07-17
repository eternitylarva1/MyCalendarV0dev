// 简化的农历转换工具（实际项目中建议使用专业的农历库）
export function getLunarDate(date: Date): string {
  const lunarDates = [
    "初一",
    "初二",
    "初三",
    "初四",
    "初五",
    "初六",
    "初七",
    "初八",
    "初九",
    "初十",
    "十一",
    "十二",
    "十三",
    "十四",
    "十五",
    "十六",
    "十七",
    "十八",
    "十九",
    "二十",
    "廿一",
    "廿二",
    "廿三",
    "廿四",
    "廿五",
    "廿六",
    "廿七",
    "廿八",
    "廿九",
    "三十",
  ]

  // 这里使用简化的计算方式，实际应用中需要使用准确的农历算法
  const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 1).getTime()) / (1000 * 60 * 60 * 24))
  const lunarIndex = (dayOfYear + 15) % 30

  return lunarDates[lunarIndex] || "初一"
}

export function getHoliday(date: Date): string | undefined {
  const month = date.getMonth() + 1
  const day = date.getDate()

  const holidays: Record<string, string> = {
    "5-1": "劳动节",
    "5-4": "青年节",
    "5-5": "立夏",
    "5-11": "母亲节",
    "5-12": "护士节",
    "5-21": "小满",
    "5-31": "端午节",
    "6-1": "儿童节",
  }

  return holidays[`${month}-${day}`]
}
