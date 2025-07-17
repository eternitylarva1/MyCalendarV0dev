"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { useResponsiveScale } from "@/hooks/useResponsiveScale"
import { ChevronRight } from "lucide-react"
import { MonthSelectorModal } from "@/components/MonthSelectorModal"
import { useCalendarSettings } from "@/context/CalendarSettingsContext"

export default function SettingsPage() {
  const router = useRouter()
  const scale = useResponsiveScale(1408)
  const { currentSemester, setCurrentSemester, availableSemesters } = useCalendarSettings()

  const [showSemesterStartDateModal, setShowSemesterStartDateModal] = useState(false)
  // Initialize modal's selected year, month, day with current semester's start date
  const currentStartDate = new Date(currentSemester.startDate)
  const [modalSelectedYear, setModalSelectedYear] = useState(currentStartDate.getFullYear())
  const [modalSelectedMonth, setModalSelectedMonth] = useState(currentStartDate.getMonth() + 1)
  const [modalSelectedDay, setModalSelectedDay] = useState(currentStartDate.getDate())

  const handleSemesterStartDateSelect = (year: number, month: number, day: number) => {
    // Added day parameter
    // Construct the new semester start date string
    const newStartDate = new Date(year, month - 1, day).toISOString().split("T")[0]

    // Find if the new start date falls within any existing semester
    const newActiveSemester = availableSemesters.find((s) => {
      const sStart = new Date(s.startDate)
      const sEnd = new Date(s.endDate)
      const selectedDate = new Date(year, month - 1, day)

      return selectedDate >= sStart && selectedDate <= sEnd
    })

    if (newActiveSemester) {
      // If the selected date falls within an existing semester, switch to that semester
      setCurrentSemester(newActiveSemester)
    } else {
      // If the selected date does not belong to any predefined semester,
      // update the current semester's start date.
      // This might mean the user is setting a custom start date or a date outside defined semesters.
      setCurrentSemester({
        ...currentSemester,
        startDate: newStartDate,
      })
    }

    setShowSemesterStartDateModal(false)
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
        overflowX: "hidden",
        overflowY: "auto",
      }}
    >
      {/* Main container (scaled) */}
      <div
        style={{
          width: "1408px",
          transform: `scale(${scale})`,
          transformOrigin: "top center",
          fontFamily: '"Microsoft YaHei", sans-serif',
          height: "auto",
          position: "relative",
        }}
      >
        {/* Top navigation bar */}
        <header
          style={{
            background: "#1e39de",
            height: "150px",
            boxShadow: "4px 4px 10px rgba(30,57,222,1)",
            display: "flex",
            alignItems: "center",
            padding: "0 60px",
            position: "relative",
          }}
        >
          {/* 返回按钮 */}
          <button
            onClick={() => router.back()}
            style={{
              width: "80px",
              height: "80px",
              background: "rgba(255,255,255,0.2)",
              borderRadius: "50%",
              border: "2px solid rgba(255,255,255,0.3)",
              color: "#fff",
              fontSize: "32px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            ←
          </button>

          {/* 页面标题 */}
          <h1
            style={{
              color: "#fff",
              fontSize: "64px",
              fontWeight: 400,
              margin: "0 auto",
            }}
          >
            设置
          </h1>

          {/* 右侧占位符保持对称 */}
          <div style={{ width: "80px", height: "80px" }} />
        </header>

        {/* Main content area */}
        <main
          style={{
            width: "1408px",
            minHeight: "calc(100vh - 150px)",
            background: "rgba(230,230,230,0.2)",
            padding: "0px",
          }}
        >
          {/* Calendar Settings */}
          <div style={{ padding: "40px 60px 0px 60px" }}>
            <h2
              style={{
                fontSize: "48px",
                fontWeight: 600,
                color: "#000",
                marginBottom: "20px",
              }}
            >
              日历设置
            </h2>
            <div
              style={{
                background: "#fff",
                borderRadius: "25px",
                boxShadow: "0px 4px 10px rgba(0,0,0,0.05)",
                overflow: "hidden",
              }}
            >
              <SettingItem
                label="设置学期开始时间"
                onClick={() => {
                  const currentStartDate = new Date(currentSemester.startDate)
                  setModalSelectedYear(currentStartDate.getFullYear())
                  setModalSelectedMonth(currentStartDate.getMonth() + 1)
                  setModalSelectedDay(currentStartDate.getDate()) // Set initial day
                  setShowSemesterStartDateModal(true)
                }}
              />
              <SettingItem label="设置学校额外假期" onClick={() => console.log("设置学校额外假期")} />
              <SettingItem label="设置特殊时间节点" onClick={() => console.log("设置特殊时间节点")} isLast={true} />
            </div>
          </div>

          {/* Other Settings */}
          <div style={{ padding: "40px 60px 0px 60px" }}>
            <h2
              style={{
                fontSize: "48px",
                fontWeight: 600,
                color: "#000",
                marginBottom: "20px",
              }}
            >
              其他设置
            </h2>
            <div
              style={{
                background: "#fff",
                borderRadius: "25px",
                boxShadow: "0px 4px 10px rgba(0,0,0,0.05)",
                overflow: "hidden",
              }}
            >
              <SettingItem label="关于我们" onClick={() => console.log("关于我们")} />
              <SettingItem label="数据备份" onClick={() => console.log("数据备份")} isLast={true} />
            </div>
          </div>
        </main>
      </div>

      {/* Month/Day Selector Modal */}
      <MonthSelectorModal
        isOpen={showSemesterStartDateModal}
        currentYear={modalSelectedYear}
        currentMonth={modalSelectedMonth}
        currentDay={modalSelectedDay} // Pass currentDay to the modal
        isFromSettings={true} // 标识这是来自设置页面的调用
        onMonthSelect={handleSemesterStartDateSelect}
        onClose={() => setShowSemesterStartDateModal(false)}
      />
    </div>
  )
}

interface SettingItemProps {
  label: string
  onClick: () => void
  isLast?: boolean
}

function SettingItem({ label, onClick, isLast = false }: SettingItemProps) {
  return (
    <button
      onClick={onClick}
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "30px 40px",
        background: "none",
        border: "none",
        borderBottom: isLast ? "none" : "1px solid #e5e7eb",
        cursor: "pointer",
        transition: "background-color 0.2s ease",
      }}
    >
      <span
        style={{
          fontSize: "48px",
          fontWeight: 400,
          color: "#000",
        }}
      >
        {label}
      </span>
      <ChevronRight size={48} color="#9ca3af" />
    </button>
  )
}
