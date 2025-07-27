import type { SemesterInfo } from "../types/calendar"

// 动态生成学期数据的函数
function generateSemesterData(): SemesterInfo[] {
  const semesters: SemesterInfo[] = []
  const currentYear = new Date().getFullYear()

  // 从2022年开始，生成到当前年份+4年
  const startYear = 2022
  const endYear = currentYear + 4

  for (let year = startYear; year <= endYear; year++) {
    // 秋季学期 (当年9月 - 次年1月)
    semesters.push({
      id: `${year}-fall`,
      name: `${year}年秋季学期`,
      year: year,
      season: "fall",
      startDate: `${year}-09-01`,
      endDate: `${year + 1}-01-15`,
    })

    // 春季学期 (次年2月 - 次年6月)
    const springYear = year + 1
    if (springYear <= endYear) {
      semesters.push({
        id: `${springYear}-spring`,
        name: `${springYear}年春季学期`,
        year: springYear,
        season: "spring",
        startDate: `${springYear}-02-16`,
        endDate: `${springYear}-06-19`,
      })

      // 小学期 (次年6月 - 次年7月)
      semesters.push({
        id: `${springYear}-short`,
        name: `${springYear}年小学期`,
        year: springYear,
        season: "short",
        startDate: `${springYear}-06-20`,
        endDate: `${springYear}-07-31`,
      })
    }
  }

  // 按时间顺序排序
  return semesters.sort((a, b) => {
    const dateA = new Date(a.startDate + "T00:00:00")
    const dateB = new Date(b.startDate + "T00:00:00")
    return dateA.getTime() - dateB.getTime()
  })
}

// 动态生成的学期数据
export const AVAILABLE_SEMESTERS: SemesterInfo[] = generateSemesterData()

// 获取当前应该显示的学期
export function getCurrentSemester(): SemesterInfo {
  const today = new Date()
  today.setHours(0, 0, 0, 0) // Normalize today to start of day

  // 1. 检查今天是否落在任何一个学期的时间范围内
  for (const semester of AVAILABLE_SEMESTERS) {
    const startDate = new Date(semester.startDate + "T00:00:00")
    const endDate = new Date(semester.endDate + "T00:00:00")
    if (today >= startDate && today <= endDate) {
      return semester
    }
  }

  // 2. 如果今天不在任何学期内，则查找最近的未来学期
  const upcomingSemesters = AVAILABLE_SEMESTERS.filter((s) => new Date(s.startDate + "T00:00:00") > today).sort(
    (a, b) => new Date(a.startDate + "T00:00:00").getTime() - new Date(b.startDate + "T00:00:00").getTime(),
  )

  if (upcomingSemesters.length > 0) {
    return upcomingSemesters[0]
  }

  // 3. 如果没有未来学期（例如，已经过了所有定义的学期），则返回最近的一个学期
  // 假设 AVAILABLE_SEMESTERS 已经按时间顺序排列
  return AVAILABLE_SEMESTERS[AVAILABLE_SEMESTERS.length - 1]
}

// 根据学期获取月份配置 - 此函数主要用于月视图，保持不变
export function getMonthConfigsForSemester(semester: SemesterInfo) {
  const startDate = new Date(semester.startDate + "T00:00:00")
  const endDate = new Date(semester.endDate + "T00:00:00")

  const configs = []
  const currentDate = new Date(startDate.getFullYear(), startDate.getMonth(), 1) // 从学期开始月份的第一天开始

  while (
    currentDate <= endDate ||
    (currentDate.getMonth() + 1 === endDate.getMonth() + 1 && currentDate.getFullYear() === endDate.getFullYear())
  ) {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth() + 1
    const monthKey = `${year}-${month}`

    // 计算该月的周数 - 确保显示完整月份
    const firstDay = new Date(year, month - 1, 1)
    const lastDay = new Date(year, month, 0)

    // 计算第一天是星期几（0=周日，1=周一...）
    const firstDayWeek = firstDay.getDay()
    const startWeekday = firstDayWeek === 0 ? 6 : firstDayWeek - 1 // 转换为周一开始

    // 计算需要多少周来显示完整月份
    const totalDays = lastDay.getDate()
    const weekRows = Math.ceil((totalDays + startWeekday) / 7)

    const monthNames = ["", "1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"]

    configs.push({
      key: monthKey,
      name: monthNames[month],
      weekRows: weekRows,
      height: 162 + (weekRows - 1) * 90,
      centered: weekRows === 5, // 5周的月份居中显示
    })

    // 移动到下个月
    currentDate.setMonth(currentDate.getMonth() + 1)
    // 如果当前月份已经超过了学期结束月份，并且不是学期结束月份本身，则停止
    if (
      currentDate.getFullYear() > endDate.getFullYear() ||
      (currentDate.getFullYear() === endDate.getFullYear() && currentDate.getMonth() > endDate.getMonth())
    ) {
      break
    }
  }

  return configs
}

// 辅助函数：获取学期生成的年份范围信息（用于调试）
export function getSemesterYearRange() {
  const currentYear = new Date().getFullYear()
  return {
    startYear: 2022,
    endYear: currentYear + 4,
    currentYear,
    totalSemesters: AVAILABLE_SEMESTERS.length,
  }
}
