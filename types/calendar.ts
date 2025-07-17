export interface DayData {
  date: number
  fullDate: Date
  isInactive: boolean
  isToday: boolean
  dayOfWeek: number // 0=周日, 1=周一, ..., 6=周六
  lunarDate?: string // 农历日期
  holiday?: string // 节假日
}

export interface WeekData {
  weekNumber: string
  isCurrentWeek: boolean
  days: DayData[]
}

export interface MonthData {
  key: string
  name: string
  weekRows: number
  height: number
  centered: boolean
  weeks: WeekData[]
}

export interface CalendarConfig {
  year: number
  semesterStartDate: string
  maxWeeks: number
}

export type ViewMode = "semester" | "month"

export interface MonthViewData {
  year: number
  month: number
  monthName: string
  weeks: WeekData[]
}

// 新增学期相关类型
export interface SemesterInfo {
  id: string
  name: string
  year: number
  season: "spring" | "fall" | "short" // 增加 'short' 类型
  startDate: string
  endDate: string
}

export interface SemesterConfig {
  current: SemesterInfo
  available: SemesterInfo[]
}
