import type { WeekData } from "../types/calendar"
import { DayCell } from "./DayCell"

interface WeekRowProps {
  week: WeekData
  isMonthView?: boolean
  scale: number
}

export function WeekRow({ week, isMonthView = false, scale }: WeekRowProps) {
  return (
    <div
      className={`flex items-center ${week.isCurrentWeek && !isMonthView ? "current-week-row" : ""}`}
      style={{
        height: isMonthView ? "450px" : "90px",
        padding: "0 10px",
        gap: "60px",
        ...(week.isCurrentWeek && !isMonthView
          ? {
              background: "rgba(30, 57, 222, 0.05)",
              borderRadius: "20px",
              margin: "0 10px",
            }
          : {}),
      }}
    >
      {week.days.map((day, dayIndex) => (
        <DayCell key={dayIndex} day={day} isMonthView={isMonthView} scale={scale} />
      ))}
    </div>
  )
}
