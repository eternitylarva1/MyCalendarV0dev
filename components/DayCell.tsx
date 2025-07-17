import type { DayData } from "../types/calendar"

interface DayCellProps {
  day: DayData
  isMonthView?: boolean
  scale: number
}

export function DayCell({ day, isMonthView = false, scale }: DayCellProps) {
  return (
    <div
      className="relative flex items-center justify-center"
      style={{
        width: isMonthView ? "150px" : "100px",
        height: isMonthView ? "450px" : "90px",
        opacity: day.isInactive ? 0.3 : 1,
        flexDirection: isMonthView ? "column" : "row",
        position: "relative",
      }}
      title={`${day.fullDate.toLocaleDateString("zh-CN")} ${["周日", "周一", "周二", "周三", "周四", "周五", "周六"][day.dayOfWeek]}`}
    >
      {/* 今日背景 */}
      {day.isToday && (
        <div
          style={{
            content: "",
            background: "#1e39de",
            borderRadius: "15px",
            width: isMonthView ? "130px" : "80px",
            height: isMonthView ? "430px" : "80px", // 月视图中几乎占满整个高度
            position: "absolute",
            boxShadow: "4px 4px 10px rgba(0, 0, 0, 0.25)",
            zIndex: 0,
          }}
        />
      )}

      {/* 日期内容 */}
      {isMonthView ? (
        <div className="relative z-10 flex flex-col items-center justify-center">
          <span
            style={{
              color: day.isToday ? "white" : "#000",
              fontSize: "72px", // 调整为1.5倍大小
              fontWeight: 400,
              marginBottom: "8px",
              textAlign: "center",
            }}
          >
            {day.date}
          </span>
          <span
            style={{
              color: day.isToday ? "white" : "#666",
              fontSize: "48px", // 农历日期和周数大小保持不变
              fontWeight: 400,
              textAlign: "center",
            }}
          >
            {day.holiday || day.lunarDate}
          </span>
        </div>
      ) : (
        <span
          className="relative z-10"
          style={{
            color: day.isToday ? "white" : "#000",
            fontSize: "48px",
            fontWeight: 400,
            textAlign: "center",
          }}
        >
          {day.date}
        </span>
      )}
    </div>
  )
}
