"use client"

import { useRouter } from "next/navigation"
import { SemesterSelector } from "./SemesterSelector"
import { useCalendarSettings } from "@/context/CalendarSettingsContext" // 导入 useCalendarSettings

interface CalendarHeaderProps {
  scale: number // 保持 scale prop
}

export function CalendarHeader({ scale }: CalendarHeaderProps) {
  const { currentSemester, setCurrentSemester, availableSemesters } = useCalendarSettings() // 从 Context 获取学期信息
  const today = new Date()
  const currentDayIndex = (today.getDay() + 6) % 7 // 0 for Monday, 1 for Tuesday, ..., 6 for Sunday
  const router = useRouter()

  const handleSemesterChange = (semesterId: string) => {
    const newSemester = availableSemesters.find((s) => s.id === semesterId)
    if (newSemester) {
      setCurrentSemester(newSemester) // 更新 Context 中的学期
    }
  }

  return (
    <div
      className="relative overflow-visible"
      style={{
        background: "#1e39de",
        width: "1408px", // 保持原始宽度
        height: "609px", // 保持原始高度
        boxShadow: "4px 4px 10px 0px rgba(30, 57, 222, 1)",
        zIndex: 10,
      }}
    >
      {/* 设置按钮 */}
      <button
        onClick={() => router.push("/settings")}
        className="absolute"
        style={{
          width: "80px",
          height: "80px",
          left: "1222px",
          top: "232px",
          background: "rgba(255,255,255,0.2)",
          borderRadius: "50%",
          color: "white",
          fontSize: "24px",
          cursor: "pointer",
          border: "2px solid rgba(255,255,255,0.3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 20,
        }}
      >
        ⚙️
      </button>

      {/* 学期选择器 */}
      <div
        className="absolute left-1/2 transform -translate-x-1/2"
        style={{
          top: "224px", // 保持原始位置
          zIndex: 30,
        }}
      >
        <SemesterSelector
          currentSemester={currentSemester} // 从 Context 获取当前学期
          availableSemesters={availableSemesters} // 从 Context 获取可用学期
          onSemesterChange={handleSemesterChange} // 使用本地处理函数更新 Context
        />
      </div>

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
          zIndex: 5,
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
          zIndex: 5,
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
  )
}
