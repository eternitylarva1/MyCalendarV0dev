export function getTodayInfo(semesterStartDate: string) {
  const today = new Date()
  const startDate = new Date(semesterStartDate + "T00:00:00")

  const semesterStartDayOfWeek = startDate.getDay()
  const semesterStartWeekMonday = new Date(startDate)
  const daysToSubtract = semesterStartDayOfWeek === 0 ? 6 : semesterStartDayOfWeek - 1
  semesterStartWeekMonday.setDate(semesterStartWeekMonday.getDate() - daysToSubtract)

  const dayDiff = Math.floor((today.getTime() - semesterStartWeekMonday.getTime()) / (1000 * 60 * 60 * 24))
  const weekIndex = Math.floor(dayDiff / 7)

  const chineseNumbers = [
    "一",
    "二",
    "三",
    "四",
    "五",
    "六",
    "七",
    "八",
    "九",
    "十",
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
  ]

  let weekDescription: string
  if (weekIndex < 0) {
    weekDescription = "学期前"
  } else if (weekIndex < chineseNumbers.length) {
    weekDescription = `第${chineseNumbers[weekIndex]}周`
  } else {
    weekDescription = `第${weekIndex + 1}周`
  }

  return {
    date: today.toLocaleDateString("zh-CN"),
    weekNumber: weekDescription,
    dayOfWeek: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"][today.getDay()],
    semesterStartInfo: `${startDate.toLocaleDateString("zh-CN")} (${["周日", "周一", "周二", "周三", "周四", "周五", "周六"][startDate.getDay()]})`,
  }
}
