"use client"

import type { MonthData } from "../types/calendar"
import { WeekRow } from "./WeekRow"

interface MonthBlockProps {
  month: MonthData
  onMonthClick: (monthKey: string) => void
  scale: number
}

export function MonthBlock({ month, onMonthClick, scale }: MonthBlockProps) {
  return (
    <div className="relative" style={{ height: `${month.height}px` }}>
      {/* 月份标题 */}
      <div
        className="absolute cursor-pointer"
        onClick={() => onMonthClick(month.key)}
        style={{
          background: "transparent",
          borderRadius: "25px 25px 0 0",
          width: "1290px",
          height: "72px",
          left: month.centered ? "50%" : "0",
          top: "0",
          transform: month.centered ? "translateX(-50%)" : "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            fontSize: "48px",
            fontWeight: 400,
            color: "#000",
          }}
        >
          {month.name}
        </div>
      </div>

      {/* 周次列 */}
      <div
        className="absolute flex flex-col"
        style={{
          background: "white",
          borderRadius: "25px",
          border: "1px solid rgba(0,0,0,0.1)",
          width: "150px",
          left: "0",
          top: "72px",
          boxShadow: "4px 4px 10px rgba(0, 0, 0, 0.25)",
        }}
      >
        {month.weeks.map((week, index) => (
          <div
            key={index}
            className={`flex items-center justify-center ${week.isCurrentWeek ? "current-week" : ""}`}
            style={{
              height: "90px",
              fontSize: "48px",
              fontWeight: 400,
              color: "#000",
              position: "relative",
              ...(week.isCurrentWeek
                ? {
                    background: "#1e39de",
                    color: "#f5f5f5",
                    borderRadius: "15px",
                    margin: "0 16px",
                    boxShadow: "4px 4px 10px rgba(0, 0, 0, 0.25)",
                  }
                : {}),
            }}
          >
            {week.weekNumber}
          </div>
        ))}
      </div>

      {/* 日期网格 */}
      <div
        className="absolute flex flex-col"
        style={{
          background: "white",
          borderRadius: "25px",
          width: "1080px",
          left: "210px",
          top: "72px",
          boxShadow: "4px 4px 10px rgba(0, 0, 0, 0.25)",
        }}
      >
        {month.weeks.map((week, index) => (
          <WeekRow key={index} week={week} isMonthView={false} scale={scale} />
        ))}
      </div>
    </div>
  )
}
