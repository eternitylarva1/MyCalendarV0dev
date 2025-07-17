"use client"

import { useState, useEffect } from "react"
import type { MonthData, CalendarConfig, MonthViewData, SemesterInfo, WeekData, DayData } from "../types/calendar"
import { getLunarDate, getHoliday } from "../utils/lunarUtils"
// import { getMonthConfigsForSemester } from "../utils/semesterUtils" // 不再直接使用此函数来构建学期视图的月份结构

// 修正的中文数字 - 二十一改为二一
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
  "二一", // 修改：二十一 -> 二一
  "二二", // 修改：二十二 -> 二二
  "二三", // 修改：二十三 -> 二三
  "二四", // 修改：二十四 -> 二四
  "二五", // 修改：二十五 -> 二五
  "二六", // 修改：二十六 -> 二六
  "二七", // 修改：二十七 -> 二七
  "二八", // 修改：二十八 -> 二八
  "二九", // 修改：二十九 -> 二九
  "三十", // 修改：三十 -> 三十
]

export function useCalendarData(config: CalendarConfig, semesterInfo: SemesterInfo) {
  const [calendarData, setCalendarData] = useState<MonthData[]>([])
  const [currentWeek, setCurrentWeek] = useState(-1)

  // 生成日历数据 - 移除maxWeeks限制
  const generateCalendarData = (semester: SemesterInfo) => {
    const semesterStartDate = new Date(semester.startDate + "T00:00:00")
    const semesterEndDate = new Date(semester.endDate + "T00:00:00")
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // 计算学期开始的周一
    const semesterStartDayOfWeek = semesterStartDate.getDay() // 0 for Sunday, 1 for Monday
    const semesterStartWeekMonday = new Date(semesterStartDate)
    const daysToSubtract = semesterStartDayOfWeek === 0 ? 6 : semesterStartDayOfWeek - 1
    semesterStartWeekMonday.setDate(semesterStartWeekMonday.getDate() - daysToSubtract)

    // 计算今天相对于学期开始周一的周次索引
    const dayDifferenceForToday = Math.floor(
      (today.getTime() - semesterStartWeekMonday.getTime()) / (1000 * 60 * 60 * 24),
    )
    const todayWeekIndex = Math.floor(dayDifferenceForToday / 7)
    setCurrentWeek(todayWeekIndex)

    const allWeeks: WeekData[] = []
    const tempDate = new Date(semesterStartWeekMonday)
    let currentSemesterWeekIndex = 0

    // 生成所有周的数据，直到学期结束日期之后的一周，以确保包含所有相关周
    // 循环条件改为确保覆盖到学期结束日期所在的周
    while (tempDate.getTime() <= semesterEndDate.getTime() + 7 * 24 * 60 * 60 * 1000) {
      const weekDays: DayData[] = []
      const weekStartDate = new Date(tempDate) // 当前周的起始日期

      const isCurrentWeek = currentSemesterWeekIndex === todayWeekIndex

      let weekNumberDisplay: string
      // 只有当周的起始日期在学期范围内时，才显示周次
      if (weekStartDate >= semesterStartDate && weekStartDate <= semesterEndDate) {
        weekNumberDisplay = chineseNumbers[currentSemesterWeekIndex] || (currentSemesterWeekIndex + 1).toString()
      } else {
        weekNumberDisplay = "—" // 不在学期内的周次显示占位符
      }

      for (let i = 0; i < 7; i++) {
        const isInactive = !(tempDate >= semesterStartDate && tempDate <= semesterEndDate) // 日期是否在学期范围内
        const isToday = tempDate.getTime() === today.getTime()

        weekDays.push({
          date: tempDate.getDate(),
          fullDate: new Date(tempDate),
          isInactive,
          isToday,
          dayOfWeek: tempDate.getDay(),
          lunarDate: getLunarDate(tempDate),
          holiday: getHoliday(tempDate),
        })
        tempDate.setDate(tempDate.getDate() + 1)
      }

      allWeeks.push({
        weekNumber: weekNumberDisplay,
        isCurrentWeek,
        days: weekDays,
      })
      currentSemesterWeekIndex++
    }

    // 根据周的起始日期将周分组到月份中
    const groupedMonths: { [key: string]: MonthData } = {}
    const monthNames = ["", "1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"]

    allWeeks.forEach((week) => {
      const firstDayOfweek = week.days[0].fullDate
      const year = firstDayOfweek.getFullYear()
      const month = firstDayOfweek.getMonth() + 1 // 1-indexed month
      const monthKey = `${year}-${month}`

      // 确保只包含学期内的月份
      const monthStart = new Date(year, month - 1, 1)
      const monthEnd = new Date(year, month, 0)

      if (monthStart <= semesterEndDate && monthEnd >= semesterStartDate) {
        if (!groupedMonths[monthKey]) {
          groupedMonths[monthKey] = {
            key: monthKey,
            name: monthNames[month],
            weekRows: 0, // 稍后更新
            height: 0, // 稍后更新
            centered: false, // 稍后更新
            weeks: [],
          }
        }
        groupedMonths[monthKey].weeks.push(week)
      }
    })

    // 将分组后的月份转换为排序数组，并计算高度和居中状态
    const finalCalendarData: MonthData[] = Object.values(groupedMonths)
      .sort((a, b) => {
        const [aYear, aMonth] = a.key.split("-").map(Number)
        const [bYear, bMonth] = b.key.split("-").map(Number)
        if (aYear !== bYear) return aYear - bYear
        return aMonth - bMonth
      })
      .map((monthData) => {
        const weekRows = monthData.weeks.length
        return {
          ...monthData,
          weekRows: weekRows,
          height: 72 + weekRows * 90, // 72px for title, 90px per week row
          centered: weekRows === 5, // 保持原有的5周居中逻辑
        }
      })

    setCalendarData(finalCalendarData)
  }

  useEffect(() => {
    generateCalendarData(semesterInfo)
  }, [semesterInfo]) // 依赖 semesterInfo 变化时重新生成

  return { calendarData, currentWeek }
}

// useMonthViewData 保持不变
export function useMonthViewData(year: number, month: number, semesterStartDate: string, semesterEndDate: string) {
  const [monthViewData, setMonthViewData] = useState<MonthViewData | null>(null)

  useEffect(() => {
    const generateMonthViewData = () => {
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      // 计算学期开始的周一
      const semesterStartDateObj = new Date(semesterStartDate + "T00:00:00")
      const semesterEndDateObj = new Date(semesterEndDate + "T00:00:00") // 获取学期结束日期
      const semesterStartDayOfWeek = semesterStartDateObj.getDay()
      const semesterStartWeekMonday = new Date(semesterStartDateObj)
      const daysToSubtract = semesterStartDayOfWeek === 0 ? 6 : semesterStartDayOfWeek - 1
      semesterStartWeekMonday.setDate(semesterStartWeekMonday.getDate() - daysToSubtract)

      // 获取当月第一天
      const firstDayOfMonth = new Date(year, month - 1, 1)
      const lastDayOfMonth = new Date(year, month, 0)

      // 获取当月第一天是星期几
      const firstDayWeekday = firstDayOfMonth.getDay()
      const startDate = new Date(firstDayOfMonth)
      // 调整到周一开始
      const daysToSubtractFromFirst = firstDayWeekday === 0 ? 6 : firstDayWeekday - 1
      startDate.setDate(startDate.getDate() - daysToSubtractFromFirst)

      const weeks = []
      const currentDate = new Date(startDate)

      // 生成6周的数据（足够覆盖任何月份）
      for (let weekIndex = 0; weekIndex < 6; weekIndex++) {
        // 计算当前周相对于学期开始的周次
        const dayDiff = Math.floor((currentDate.getTime() - semesterStartWeekMonday.getTime()) / (1000 * 60 * 60 * 24))
        const semesterWeekIndex = Math.floor(dayDiff / 7)
        const isCurrentWeek =
          Math.floor((today.getTime() - semesterStartWeekMonday.getTime()) / (1000 * 60 * 60 * 24 * 7)) ===
          semesterWeekIndex

        let weekNumberDisplay: string
        // 判断当前周是否在学期范围内
        if (
          currentDate.getTime() < semesterStartDateObj.getTime() ||
          currentDate.getTime() > semesterEndDateObj.getTime()
        ) {
          weekNumberDisplay = "—" // 不在学期内显示占位符
        } else {
          weekNumberDisplay = chineseNumbers[semesterWeekIndex] || (semesterWeekIndex + 1).toString() // 确保使用中文数字，如果超出数组长度则回退
        }

        const weekData = {
          weekNumber: weekNumberDisplay,
          isCurrentWeek,
          days: [],
        }

        for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
          const isInactive = currentDate.getMonth() + 1 !== month
          const isToday = currentDate.getTime() === today.getTime()

          weekData.days.push({
            date: currentDate.getDate(),
            fullDate: new Date(currentDate),
            isInactive,
            isToday,
            dayOfWeek: currentDate.getDay(),
            lunarDate: getLunarDate(currentDate),
            holiday: getHoliday(currentDate),
          })

          currentDate.setDate(currentDate.getDate() + 1)
        }

        weeks.push(weekData)

        // 如果这一周已经完全超出了当月，就停止生成
        if (currentDate.getMonth() + 1 > month && weekIndex >= 3) {
          break
        }
      }

      const monthNames = ["", "1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"]

      setMonthViewData({
        year,
        month,
        monthName: monthNames[month],
        weeks,
      })
    }

    generateMonthViewData()
  }, [year, month, semesterStartDate, semesterEndDate]) // 添加 semesterEndDate 到依赖数组

  return monthViewData
}
