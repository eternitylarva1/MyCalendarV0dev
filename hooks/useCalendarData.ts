"use client"

/**
 * Hook utilities for generating semester & month-view data.
 * – useCalendarData(config, semesterInfo)      → semester overview grid
 * – useMonthViewData(year, month, start, end) → month detail grid
 */

import { useState, useEffect } from "react"
import type { CalendarConfig, MonthData, MonthViewData, SemesterInfo, WeekData, DayData } from "../types/calendar"
import { getLunarDate, getHoliday } from "../utils/lunarUtils"

/* ---------------------------- helpers ----------------------------- */

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
  "二一",
  "二二",
  "二三",
  "二四",
  "二五",
  "二六",
  "二七",
  "二八",
  "二九",
  "三十",
]

/* ------------------------------------------------------------------ */
/* 1.  useCalendarData – semester overview (month blocks)              */
/* ------------------------------------------------------------------ */
export function useCalendarData(config: CalendarConfig, semesterInfo: SemesterInfo) {
  const [calendarData, setCalendarData] = useState<MonthData[]>([])
  // Removed currentWeek state

  useEffect(() => {
    generateCalendarData(semesterInfo)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [semesterInfo])

  const generateCalendarData = (semester: SemesterInfo) => {
    // 修复时区问题：确保日期解析时使用本地时区
    const semesterStart = new Date(semester.startDate + "T00:00:00")
    const semesterEnd = new Date(semester.endDate + "T00:00:00")
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    console.log("Semester start:", semesterStart.toDateString())
    console.log("Semester end:", semesterEnd.toDateString())
    console.log("Today:", today.toDateString())

    /* ---------- align semester start to Monday ---------- */
    const startDow = semesterStart.getDay() // Sun=0 … Sat=6
    const mondayOfWeek0 = new Date(semesterStart)
    mondayOfWeek0.setDate(mondayOfWeek0.getDate() - (startDow === 0 ? 6 : startDow - 1))

    console.log("Monday of week 0:", mondayOfWeek0.toDateString())

    /* ---------- iterate week-by-week until after end ----- */
    const allWeeks: WeekData[] = []
    const cursor = new Date(mondayOfWeek0)
    let semesterWeekIdx = 0

    while (cursor.getTime() <= semesterEnd.getTime() + 7 * 86400000) {
      const weekDays: DayData[] = []
      const weekStart = new Date(cursor)

      const weekLabel =
        weekStart >= semesterStart && weekStart <= semesterEnd
          ? (chineseNumbers[semesterWeekIdx] ?? (semesterWeekIdx + 1).toString())
          : "—"

      for (let i = 0; i < 7; i++) {
        const cellDate = new Date(cursor)
        weekDays.push({
          date: cellDate.getDate(),
          fullDate: cellDate,
          dayOfWeek: cellDate.getDay(),
          isInactive: !(cellDate >= semesterStart && cellDate <= semesterEnd),
          isToday: cellDate.getTime() === today.getTime(),
          lunarDate: getLunarDate(cellDate),
          holiday: getHoliday(cellDate),
        })
        cursor.setDate(cursor.getDate() + 1)
      }

      allWeeks.push({
        weekNumber: weekLabel,
        isCurrentWeek: weekDays.some((day) => day.isToday), // Check if any day in this week is today
        days: weekDays,
      })
      semesterWeekIdx++
    }

    /* ---------- group weeks into months ----------------- */
    const monthMap: Record<string, MonthData> = {}
    const monthNames = ["", "1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"]

    allWeeks.forEach((week) => {
      const firstDay = week.days[0].fullDate
      const y = firstDay.getFullYear()
      const m = firstDay.getMonth() + 1
      const key = `${y}-${m}`

      if (!monthMap[key]) {
        monthMap[key] = {
          key,
          name: monthNames[m],
          weekRows: 0,
          height: 0,
          centered: false,
          weeks: [],
        }
      }
      monthMap[key].weeks.push(week)
    })

    const result: MonthData[] = Object.values(monthMap)
      .sort((a, b) => (a.key > b.key ? 1 : -1))
      .map((m) => {
        const rows = m.weeks.length
        return {
          ...m,
          weekRows: rows,
          height: 72 + rows * 90,
          centered: rows === 5,
        }
      })

    console.log("Generated calendar data:", result)
    setCalendarData(result)
  }

  return { calendarData, currentWeek: -1 } // currentWeek is no longer used directly for highlighting
}

/* ------------------------------------------------------------------ */
/* 2.  useMonthViewData – month detail grid                            */
/* ------------------------------------------------------------------ */
export function useMonthViewData(year: number, month: number, semesterStartDate: string, semesterEndDate: string) {
  const [monthViewData, setMonthViewData] = useState<MonthViewData | null>(null)

  useEffect(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // 修复时区问题：确保日期解析时使用本地时区
    const semStart = new Date(semesterStartDate + "T00:00:00")
    const semEnd = new Date(semesterEndDate + "T00:00:00")

    const startDow = semStart.getDay() // Sun=0 … Sat=6
    const mondayOfWeek0 = new Date(semStart)
    mondayOfWeek0.setDate(mondayOfWeek0.getDate() - (startDow === 0 ? 6 : startDow - 1))

    /* ------- align grid start to Monday before month ----- */
    const firstOfMonth = new Date(year, month - 1, 1)
    const firstDow = firstOfMonth.getDay()
    const gridStart = new Date(firstOfMonth)
    gridStart.setDate(gridStart.getDate() - (firstDow === 0 ? 6 : firstDow - 1))

    const weeks: WeekData[] = []
    const cursor = new Date(gridStart)

    for (let w = 0; w < 6; w++) {
      const weekDays: DayData[] = []

      const daysFromMonday0ToCursor = Math.floor((cursor.getTime() - mondayOfWeek0.getTime()) / 86400000)
      const semesterWeekIdx = Math.floor(daysFromMonday0ToCursor / 7)

      const weekLabel =
        cursor < semStart || cursor > semEnd
          ? "—"
          : (chineseNumbers[semesterWeekIdx] ?? (semesterWeekIdx + 1).toString())

      // Changed isCurrentWeek calculation
      for (let d = 0; d < 7; d++) {
        const dCopy = new Date(cursor)
        weekDays.push({
          date: dCopy.getDate(),
          fullDate: dCopy,
          dayOfWeek: dCopy.getDay(),
          isInactive: dCopy.getMonth() + 1 !== month,
          isToday: dCopy.getTime() === today.getTime(),
          lunarDate: getLunarDate(dCopy),
          holiday: getHoliday(dCopy),
        })
        cursor.setDate(cursor.getDate() + 1)
      }
      const isCurrentWeek = weekDays.some((day) => day.isToday)

      weeks.push({ weekNumber: weekLabel, isCurrentWeek, days: weekDays })

      /* stop early if we've moved past the month */
      if (weeks.length >= 4 && cursor.getMonth() + 1 !== month) break
    }

    const monthNames = ["", "1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"]

    setMonthViewData({
      year,
      month,
      monthName: monthNames[month],
      weeks,
    })
  }, [year, month, semesterStartDate, semesterEndDate])

  return monthViewData
}
