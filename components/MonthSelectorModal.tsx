"use client"

import { useState, useEffect, useRef } from "react"
import { useCalendarSettings } from "@/context/CalendarSettingsContext" // Import useCalendarSettings
import { useResponsiveScale } from "@/hooks/useResponsiveScale" // Import useResponsiveScale

interface MonthSelectorModalProps {
  isOpen: boolean
  currentYear: number // Initial year for selection
  currentMonth: number // Initial month for selection
  currentDay: number // Initial day for selection
  isFromSettings?: boolean // 新增参数，标识是否来自设置页面
  onMonthSelect: (year: number, month: number, day: number) => void // Modified to include day
  onClose: () => void
}

export function MonthSelectorModal({
  isOpen,
  currentYear,
  currentMonth,
  currentDay, // New prop for initial day
  isFromSettings = false, // 默认为false
  onMonthSelect,
  onClose,
}: MonthSelectorModalProps) {
  const { availableSemesters, currentSemester } = useCalendarSettings()
  const scale = useResponsiveScale(1408) // Get scale from hook

  const today = new Date()
  const todayYear = today.getFullYear()
  const todayMonth = today.getMonth() + 1
  const todayDay = today.getDate()

  // Refs for scrolling
  const monthListRef = useRef<HTMLDivElement>(null)
  const dayListRef = useRef<HTMLDivElement>(null)
  const selectedMonthButtonRef = useRef<HTMLButtonElement>(null)
  const selectedDayButtonRef = useRef<HTMLButtonElement>(null)

  // Internal state for modal selection
  const [modalSelectedYear, setModalSelectedYear] = useState(currentYear)
  const [modalSelectedMonth, setModalSelectedMonth] = useState(currentMonth)
  const [modalSelectedDay, setModalSelectedDay] = useState(currentDay) // Initialize with currentDay prop

  useEffect(() => {
    if (isOpen) {
      // Initialize with the current semester's start date or today's date if not set
      // Use the props for initial state, as they come from the calling component (settings page)
      setModalSelectedYear(currentYear)
      setModalSelectedMonth(currentMonth)
      setModalSelectedDay(currentDay)

      // Use setTimeout to ensure elements are rendered before attempting to scroll
      const timer = setTimeout(() => {
        selectedMonthButtonRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })
        selectedDayButtonRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })
      }, 100)

      return () => clearTimeout(timer)
    }
  }, [isOpen, currentYear, currentMonth, currentDay]) // Depend on isOpen and initial props

  if (!isOpen) return null

  // Generate months for selection (e.g., current year +/- 1 year, or based on available semesters)
  const monthsForSelection: { value: number; name: string }[] = []
  // For simplicity, let's show all 12 months for the selected year.
  for (let i = 1; i <= 12; i++) {
    monthsForSelection.push({ value: i, name: `${i}月` })
  }

  // Generate days for the selected month
  const daysInSelectedMonth: { value: number; name: string }[] = []
  const daysCount = new Date(modalSelectedYear, modalSelectedMonth, 0).getDate()
  for (let i = 1; i <= daysCount; i++) {
    daysInSelectedMonth.push({ value: i, name: `${i}日` })
  }

  const handleConfirm = () => {
    onMonthSelect(modalSelectedYear, modalSelectedMonth, modalSelectedDay)
    onClose()
  }

  const handleCancel = () => {
    onClose()
  }

  const handleMonthSelect = (month: number) => {
    setModalSelectedMonth(month)
    // Reset day to 1 if the current day is invalid for the new month
    const newDaysCount = new Date(modalSelectedYear, month, 0).getDate()
    if (modalSelectedDay > newDaysCount) {
      setModalSelectedDay(1)
    }
  }

  const handleDaySelect = (day: number) => {
    setModalSelectedDay(day)
  }

  return (
    <>
      {/* Blurred overlay */}
      <div className="fixed inset-0 z-[9998] bg-black/30 backdrop-blur-sm" onClick={handleCancel} />

      {/* Modal content container, apply scale here */}
      <div
        className="fixed left-1/2 z-[10000] -translate-x-1/2"
        style={{
          top: isFromSettings ? "200px" : "300px", // 设置页面使用更小的top值
          background: "white",
          width: isFromSettings ? "100vw" : "1408px", // 设置页面使用全屏宽度
          height: isFromSettings ? "500px" : "751px", // 设置页面使用更小的高度
          overflow: "hidden",
          fontFamily: '"Microsoft YaHei", sans-serif',
          borderRadius: isFromSettings ? "0px" : "0px", // 设置页面移除圆角以适配全屏
          boxShadow: isFromSettings ? "0 10px 30px rgba(0,0,0,0.3)" : "none", // 设置页面添加阴影
          left: isFromSettings ? "0" : "50%", // 设置页面使用左对齐
          transform: isFromSettings ? "none" : "translateX(-50%)", // 设置页面移除居中变换
        }}
      >
        {/* Top action bar */}
        <div
          className="flex items-center justify-between"
          style={{
            height: isFromSettings ? "70px" : "90px", // 设置页面使用更小的头部高度
            padding: "0 40px",
            borderBottom: "1px solid #e5e7eb",
          }}
        >
          <button
            onClick={handleCancel}
            style={{
              fontSize: isFromSettings ? "24px" : "32px", // 设置页面使用更小的字体
              fontWeight: 400,
              color: "#000000",
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            取消
          </button>
          <div
            style={{
              fontSize: isFromSettings ? "28px" : "36px", // 设置页面使用更小的字体
              fontWeight: 600,
              color: "#000000",
            }}
          >
            {isFromSettings ? "选择学期开始日期" : "请选择月份/日期"}
          </div>
          <button
            onClick={handleConfirm}
            style={{
              fontSize: isFromSettings ? "24px" : "32px", // 设置页面使用更小的字体
              fontWeight: 600,
              color: "#4f6ff1",
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            确定
          </button>
        </div>

        {/* Main selection area */}
        <div className={`flex ${isFromSettings ? "h-[calc(100%-70px)]" : "h-[calc(100%-90px)]"}`}>
          {/* Left - Month selection */}
          <div
            ref={monthListRef}
            className="flex flex-1 flex-col items-center justify-start overflow-y-auto max-h-full hide-scrollbar"
          >
            {monthsForSelection.map((month) => {
              const isSelected = month.value === modalSelectedMonth
              return (
                <button
                  key={month.value}
                  ref={isSelected ? selectedMonthButtonRef : null}
                  onClick={() => handleMonthSelect(month.value)}
                  className="w-full flex items-center justify-center transition-colors"
                  style={{
                    height: isFromSettings ? "80px" : "140px", // 设置页面使用更小的按钮高度
                    fontSize: isFromSettings ? "36px" : "64px", // 设置页面使用更小的字体
                    fontWeight: isSelected ? 700 : 300,
                    color: isSelected ? "#4f6ff1" : "#000000",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    flexShrink: 0,
                    whiteSpace: "nowrap",
                  }}
                >
                  {month.name}
                </button>
              )
            })}
          </div>
          {/* Middle separator */}
          <div
            style={{
              width: isFromSettings ? "3px" : "5px", // 设置页面使用更细的分隔线
              background: "#000000",
              opacity: 0.2,
              height: "100%",
            }}
          />
          {/* Right - Day selection */}
          <div
            ref={dayListRef}
            className="flex flex-1 flex-col items-center justify-center overflow-y-auto max-h-full hide-scrollbar"
          >
            {daysInSelectedMonth.map((day) => {
              const isSelected = day.value === modalSelectedDay
              return (
                <button
                  key={day.value}
                  ref={isSelected ? selectedDayButtonRef : null}
                  onClick={() => handleDaySelect(day.value)}
                  className="w-full flex items-center justify-center transition-colors"
                  style={{
                    height: isFromSettings ? "80px" : "140px", // 设置页面使用更小的按钮高度
                    fontSize: isFromSettings ? "36px" : "64px", // 设置页面使用更小的字体
                    fontWeight: isSelected ? 700 : 300,
                    color: isSelected ? "#4f6ff1" : "#000000",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    flexShrink: 0,
                    whiteSpace: "nowrap",
                  }}
                >
                  {day.name}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </>
  )
}
