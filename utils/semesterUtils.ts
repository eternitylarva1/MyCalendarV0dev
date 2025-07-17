import type { SemesterInfo } from "../types/calendar"

// 预定义的学期数据 - 扩展更多学年，并加入小学期
export const AVAILABLE_SEMESTERS: SemesterInfo[] = [
  // 2022-2023学年
  {
    id: "2022-fall",
    name: "2022年秋季学期",
    year: 2022,
    season: "fall",
    startDate: "2022-09-05",
    endDate: "2023-01-15",
  },
  {
    id: "2023-spring",
    name: "2023年春季学期",
    year: 2023,
    season: "spring",
    startDate: "2023-02-20",
    endDate: "2023-06-30",
  },
  {
    id: "2023-short",
    name: "2023年小学期",
    year: 2023,
    season: "short",
    startDate: "2023-06-20",
    endDate: "2023-07-31",
  },
  // 2023-2024学年
  {
    id: "2023-fall",
    name: "2023年秋季学期",
    year: 2023,
    season: "fall",
    startDate: "2023-09-04",
    endDate: "2024-01-15",
  },
  {
    id: "2024-spring",
    name: "2024年春季学期",
    year: 2024,
    season: "spring",
    startDate: "2024-02-19",
    endDate: "2024-06-30",
  },
  {
    id: "2024-short",
    name: "2024年小学期",
    year: 2024,
    season: "short",
    startDate: "2024-06-20",
    endDate: "2024-07-31",
  },
  // 2024-2025学年
  {
    id: "2024-fall",
    name: "2024年秋季学期",
    year: 2024,
    season: "fall",
    startDate: "2024-09-02",
    endDate: "2025-01-15",
  },
  {
    id: "2025-spring",
    name: "2025年春季学期",
    year: 2025,
    season: "spring",
    startDate: "2025-02-17",
    endDate: "2025-06-30",
  },
  {
    id: "2025-short",
    name: "2025年小学期",
    year: 2025,
    season: "short",
    startDate: "2025-06-20", // 默认6月20日
    endDate: "2025-07-31", // 延续到7月底
  },
  // 2025-2026学年
  {
    id: "2025-fall",
    name: "2025年秋季学期",
    year: 2025,
    season: "fall",
    startDate: "2025-09-01",
    endDate: "2026-01-15",
  },
  {
    id: "2026-spring",
    name: "2026年春季学期",
    year: 2026,
    season: "spring",
    startDate: "2026-02-16",
    endDate: "2026-06-30",
  },
  {
    id: "2026-short",
    name: "2026年小学期",
    year: 2026,
    season: "short",
    startDate: "2026-06-20",
    endDate: "2026-07-31",
  },
]

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
