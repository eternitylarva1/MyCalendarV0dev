"use client"

import { useState } from "react"
import type { CalendarConfig, ViewMode } from "../types/calendar"
import { useCalendarData, useMonthViewData } from "../hooks/useCalendarData"
import { useResponsiveScale } from "../hooks/useResponsiveScale"
import { CalendarHeader } from "../components/CalendarHeader"
import { MonthBlock } from "../components/MonthBlock"
import { MonthView } from "../components/MonthView"
import { BottomNavigation } from "../components/BottomNavigation"
import { MonthSelectorModal } from "../components/MonthSelectorModal"
import { useCalendarSettings } from "@/context/CalendarSettingsContext" // 导入 useCalendarSettings

export default function SemesterCalendar() {
  const { currentSemester, setCurrentSemester, availableSemesters } = useCalendarSettings() // 从 Context 获取学期信息
  const [currentView, setCurrentView] = useState<ViewMode>("semester")
  const [selectedMonth, setSelectedMonth] = useState<{ year: number; month: number }>({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
  })
  const [showMonthSelector, setShowMonthSelector] = useState(false)
  const [monthData, setMonthData] = useState({ year: new Date().getFullYear(), month: new Date().getMonth() + 1 })

  const config: CalendarConfig = {
    year: currentSemester.year,
    semesterStartDate: currentSemester.startDate, // 使用 Context 中的学期开始日期
    maxWeeks: 30,
  }

  const { calendarData } = useCalendarData(config, currentSemester)
  const monthViewData = useMonthViewData(
    selectedMonth.year,
    selectedMonth.month,
    currentSemester.startDate, // 使用 Context 中的学期开始日期
    currentSemester.endDate,
  )
  const scale = useResponsiveScale(1408)

  const handleSemesterChange = (semesterId: string) => {
    const newSemester = availableSemesters.find((s) => s.id === semesterId)
    if (newSemester) {
      setCurrentSemester(newSemester) // 更新 Context 中的学期
    }
  }

  const handleViewChange = (view: ViewMode) => {
    if (view === "month" && currentView === "semester") {
      const today = new Date()
      setSelectedMonth({
        year: today.getFullYear(),
        month: today.getMonth() + 1,
      })
    }
    setCurrentView(view)
  }

  const handleMonthClick = (monthKey: string) => {
    const [year, month] = monthKey.split("-").map(Number)
    setSelectedMonth({ year, month })
    setCurrentView("month")
  }

  const handleMonthChangeFromModal = (year: number, month: number) => {
    setSelectedMonth({ year, month })
    setMonthData({ year, month })
  }

  return (
    <div
      style={{
        backgroundColor: "#f0f2f5",
        minHeight: "100vh",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        padding: "0",
        margin: "0",
        overflowX: "hidden",
        overflowY: "auto",
        position: "relative",
      }}
    >
      <MonthSelectorModal
        isOpen={showMonthSelector}
        currentYear={monthData.year}
        currentMonth={monthData.month}
        onMonthSelect={handleMonthChangeFromModal}
        onClose={() => setShowMonthSelector(false)}
        availableSemesters={availableSemesters} // 从 Context 获取可用学期
      />

      {/* 主容器，应用整体缩放 */}
      <div
        style={{
          width: "1408px", // 保持原始设计宽度，由 transform 视觉缩放
          transform: `scale(${scale})`,
          transformOrigin: "top center",
          fontFamily: '"MicrosoftYaHei-Regular", sans-serif',
          height: "auto",
          position: "relative",
        }}
      >
        {currentView === "month" && monthViewData ? (
          <MonthView
            monthData={monthViewData}
            semesterName={currentSemester.name} // 从 Context 获取学期名称
            onBackClick={() => setCurrentView("semester")}
            onMonthChange={handleMonthChangeFromModal}
            scale={scale}
            // availableSemesters={availableSemesters} // MonthView 现在从 Context 获取 availableSemesters
          />
        ) : (
          <>
            <CalendarHeader
              // semesterInfo={currentSemester} // CalendarHeader 现在从 Context 获取学期信息
              // availableSemesters={availableSemesters} // CalendarHeader 现在从 Context 获取可用学期
              onSemesterChange={handleSemesterChange}
              scale={scale}
            />

            {/* 日历内容区域 */}
            <div
              style={{
                background: "rgba(230, 230, 230, 0.2)",
                padding: "15px 59px 0px 59px",
                marginTop: "0px",
                display: "flex",
                flexDirection: "column",
                gap: "36px",
                alignItems: "flex-start",
                justifyContent: "flex-start",
                width: "1408px",
                position: "relative",
                zIndex: 1,
              }}
            >
              {calendarData.map((month, monthIndex) => (
                <MonthBlock key={monthIndex} month={month} onMonthClick={handleMonthClick} scale={scale} />
              ))}
            </div>
          </>
        )}
        <BottomNavigation currentView={currentView} onViewChange={handleViewChange} scale={scale} />
      </div>
    </div>
  )
}
