"use client"

import { useState } from "react"
import type { MonthViewData } from "../types/calendar"
import { MonthSelectorModal } from "./MonthSelectorModal"
import { WeekRow } from "./WeekRow"
import { useRouter } from "next/navigation"
import { useCalendarSettings } from "@/context/CalendarSettingsContext" // 导入 useCalendarSettings

interface MonthViewProps {
  monthData: MonthViewData
  onBackClick: () => void
  onMonthChange: (year: number, month: number) => void
  scale: number
}

export function MonthView({ monthData, onBackClick, onMonthChange, scale }: MonthViewProps) {
  const { currentSemester, availableSemesters } = useCalendarSettings() // 从 Context 获取学期信息
  const [showMonthSelector, setShowMonthSelector] = useState(false)
  const today = new Date()
  const currentDayIndex = (today.getDay() + 6) % 7 // 0 for Monday, 1 for Tuesday, ..., 6 for Sunday
  const router = useRouter()

  const handleMonthSelectorConfirm = (year: number, month: number, day: number) => {
    // Added day parameter
    onMonthChange(year, month)
    setShowMonthSelector(false)
  }

  const monthViewWeekHeight = 450 // 月视图基础周高 (90 * 5)
  const calendarContentHeight = monthData.weeks.length * monthViewWeekHeight

  return (
    <div
      style={{
        width: "1408px",
        fontFamily: '"Microsoft YaHei", sans-serif',
      }}
    >
      {/* 顶部蓝色标题栏 */}
      <div
        className="relative overflow-hidden"
        style={{
          background: "#1e39de",
          width: "1408px",
          height: "609px",
          boxShadow: "4px 4px 10px 0px rgba(30, 57, 222, 1)",
        }}
      >
        {/* 返回按钮 */}
        <button
          onClick={onBackClick}
          className="absolute"
          style={{
            width: "80px",
            height: "80px",
            left: "60px",
            top: "60px",
            background: "rgba(255,255,255,0.2)",
            borderRadius: "50%",
            color: "white",
            fontSize: "32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            border: "2px solid rgba(255,255,255,0.3)",
          }}
        >
          ←
        </button>

        {/* 设置按钮 */}
        <button
          onClick={() => router.push("/settings")}
          className="absolute"
          style={{
            width: "80px",
            height: "80px",
            right: "60px",
            top: "60px",
            background: "rgba(255,255,255,0.2)",
            borderRadius: "50%",
            color: "white",
            fontSize: "24px",
            cursor: "pointer",
            border: "2px solid rgba(255,255,255,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          ⚙️
        </button>

        {/* 月份选择按钮 */}
        <button
          onClick={() => setShowMonthSelector(true)}
          className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-6 text-white transition-opacity hover:opacity-80"
          style={{
            top: "224px", // 统一为 224px，与学期选择器对齐
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: "64px",
            lineHeight: "150%",
            letterSpacing: "-0.023em",
            fontWeight: 400,
            // width: "558px", // 移除固定宽度，让其自适应内容
            height: "96px", // 统一高度
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            whiteSpace: "nowrap",
          }}
        >
          {currentSemester.name} {monthData.monthName} {/* 从 Context 获取学期名称 */}
          <svg
            width="32"
            height="20"
            viewBox="0 0 32 20"
            fill="none"
            className={`transition-transform duration-200 ${showMonthSelector ? "rotate-180" : ""}`}
          >
            <path d="M2 2L16 16L30 2" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* 周次标题 */}
        <div
          className="absolute"
          style={{
            background: "#4159f7",
            borderRadius: "25px",
            border: "1px solid rgba(0,0,0,0.1)",
            width: "150px",
            height: "150px",
            left: "60px",
            top: "399px",
            boxShadow: "4px 4px 10px 0px rgba(0, 0, 0, 0.15)",
            overflow: "hidden",
          }}
        >
          <div
            className="absolute"
            style={{
              color: "#ffffff",
              textAlign: "left",
              fontSize: "64px",
              lineHeight: "150%",
              letterSpacing: "-0.023em",
              fontWeight: 400,
              left: "11px",
              top: "27px",
              width: "127px",
              height: "96px",
            }}
          >
            周次
          </div>
        </div>

        {/* 星期标题 */}
        <div
          className="absolute flex"
          style={{
            background: "#4159f7",
            borderRadius: "25px",
            border: "1px solid rgba(0,0,0,0.1)",
            width: "1080px",
            height: "150px",
            left: "270px",
            top: "399px",
            boxShadow: "4px 4px 10px 0px rgba(0, 0, 0, 0.15)",
            overflow: "hidden",
            gap: "10px",
            alignItems: "flex-start",
            justifyContent: "flex-start",
          }}
        >
          <div className="flex-1 h-[150px] relative rounded-[25px]">
            {[
              { label: ["周", "一"], pos: "calc(50% - 530px)" },
              { label: ["周", "二"], pos: "calc(50% - 370px)" },
              { label: ["周", "三"], pos: "calc(50% - 210px)" },
              { label: ["周", "四"], pos: "50%" },
              { label: ["周", "五"], pos: "calc(50% + 110px)" },
              { label: ["周", "六"], pos: "calc(50% + 270px)" },
              { label: ["周", "日"], pos: "calc(50% + 430px)" },
            ].map((day, index) => (
              <div
                key={index}
                className="absolute"
                style={{
                  width: "100px",
                  height: "130px",
                  left: day.pos,
                  top: "50%",
                  transform: day.pos === "50%" ? "translate(-50%, -50%)" : "translateY(-50%)",
                }}
              >
                {index === currentDayIndex && (
                  <div
                    className="absolute"
                    style={{
                      background: "#1e39de",
                      borderRadius: "15px",
                      width: "100px",
                      height: "130px",
                      left: "50%",
                      top: "50%",
                      transform: "translate(-50%, -50%)",
                      boxShadow: "4px 4px 10px 0px rgba(0, 0, 0, 0.25)",
                      overflow: "hidden",
                    }}
                  />
                )}
                <div
                  className="absolute flex flex-col items-center justify-center"
                  style={{
                    color: "#ffffff",
                    textAlign: "center",
                    fontSize: "48px",
                    lineHeight: "120%",
                    letterSpacing: "-0.023em",
                    fontWeight: 400,
                    left: "50%",
                    top: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "48px",
                    height: "130px",
                    zIndex: 1,
                  }}
                >
                  <div>{day.label[0]}</div>
                  <div>{day.label[1]}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 日历内容区域 */}
      <div
        style={{
          background: "rgba(230, 230, 230, 0.2)",
          padding: "15px 59px 0px 59px",
          marginTop: "0px",
          width: "1408px",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "flex-start",
        }}
      >
        <div
          className="relative"
          style={{
            width: "1290px",
            height: `${calendarContentHeight}px`, // 动态高度
          }}
        >
          {/* 周次列 */}
          <div
            className="absolute flex flex-col"
            style={{
              background: "#ffffff",
              borderRadius: "25px",
              border: "1px solid rgba(0,0,0,0.1)",
              width: "150px",
              height: `${calendarContentHeight}px`, // 动态高度
              left: "0px",
              top: "0px",
              boxShadow: "4px 4px 10px 0px rgba(0, 0, 0, 0.25)",
            }}
          >
            {monthData.weeks.map((week, weekIndex) => (
              <div
                key={weekIndex}
                className="relative flex items-center justify-center"
                style={{
                  width: "150px",
                  height: `${monthViewWeekHeight}px`, // 月视图周高
                  background: week.isCurrentWeek ? "#1e39de" : "transparent",
                  color: week.isCurrentWeek ? "#ffffff" : "#1e39de",
                  fontSize: "48px",
                  lineHeight: "150%",
                  letterSpacing: "-0.023em",
                  fontWeight: 700,
                  borderRadius: week.isCurrentWeek ? "15px" : "0",
                  margin: week.isCurrentWeek ? "0 auto" : "0",
                  boxShadow: week.isCurrentWeek ? "0px 8px 16px rgba(0, 0, 0, 0.2)" : "none",
                }}
              >
                <div
                  style={{
                    width: "95px",
                    height: "72px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {week.weekNumber}
                </div>
              </div>
            ))}
          </div>

          {/* 日期网格 */}
          <div
            className="absolute flex flex-col"
            style={{
              background: "#ffffff",
              borderRadius: "25px",
              width: "1080px",
              height: `${calendarContentHeight}px`, // 动态高度
              left: "210px",
              top: "0px",
              boxShadow: "4px 4px 10px 0px rgba(0, 0, 0, 0.25)",
            }}
          >
            {monthData.weeks.map((week, weekIndex) => (
              <WeekRow key={weekIndex} week={week} isMonthView={true} scale={scale} />
            ))}
          </div>
        </div>
      </div>

      {/* 月份选择模态框 */}
      <MonthSelectorModal
        isOpen={showMonthSelector}
        currentYear={monthData.year}
        currentMonth={monthData.month}
        currentDay={today.getDate()} // Pass today's date as initial day for month view modal
        onMonthSelect={handleMonthSelectorConfirm}
        onClose={() => setShowMonthSelector(false)}
        availableSemesters={availableSemesters} // 从 Context 获取可用学期
      />
    </div>
  )
}
