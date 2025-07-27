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

  // 保存用户最后选择的日期，如果没有选择过则使用当前学期开始日期
  const [lastSelectedDate, setLastSelectedDate] = useState(() => {
    const currentStartDate = new Date(currentSemester.startDate + "T00:00:00") // 修复：添加时间部分
    return {
      year: currentStartDate.getFullYear(),
      month: currentStartDate.getMonth() + 1,
      day: currentStartDate.getDate(),
    }
  })

  const handleSemesterStartDateSelect = (year: number, month: number, day: number) => {
    // 更新最后选择的日期
    setLastSelectedDate({ year, month, day })

    // 构造新的学期开始日期字符串 - 修复时区问题
    const selectedDate = new Date(year, month - 1, day) // 使用本地时区构造日期
    // 格式化为 YYYY-MM-DD 格式，避免时区转换问题
    const newStartDate = `${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`

    console.log("Selected date components:", { year, month, day })
    console.log("Constructed selectedDate:", selectedDate)
    console.log("Formatted newStartDate:", newStartDate)

    // 查找选择的日期原本属于哪个学期，以确定结束日期
    const originalSemester = availableSemesters.find((s) => {
      const sStart = new Date(s.startDate + "T00:00:00") // 修复：添加时间部分
      const sEnd = new Date(s.endDate + "T00:00:00") // 修复：添加时间部分
      console.log(`Checking semester ${s.name}: ${sStart.toDateString()} - ${sEnd.toDateString()}`)
      console.log(`Selected date: ${selectedDate.toDateString()}`)
      return selectedDate >= sStart && selectedDate <= sEnd
    })

    // 确定结束日期
    let newEndDate: string
    if (originalSemester) {
      // 如果找到了原始学期，使用原始学期的结束日期
      newEndDate = originalSemester.endDate
      console.log(`Selected date belongs to ${originalSemester.name}, using its end date: ${newEndDate}`)
    } else {
      // 如果没有找到原始学期，使用默认的4个月后
      const endDate = new Date(selectedDate)
      endDate.setMonth(endDate.getMonth() + 4)
      // 格式化结束日期，避免时区问题
      newEndDate = `${endDate.getFullYear()}-${(endDate.getMonth() + 1).toString().padStart(2, "0")}-${endDate.getDate().toString().padStart(2, "0")}`
      console.log(`Selected date doesn't belong to any existing semester, using default 4 months later: ${newEndDate}`)
    }

    // 创建自定义学期
    const customSemester = {
      id: `custom-${Date.now()}`, // 生成唯一ID
      name: originalSemester?.name || `${year}年自定义学期`, // 使用原始学期名称，如果没有则使用年份+自定义学期
      year: year,
      season: originalSemester?.season || currentSemester.season, // 使用原始学期的类型，如果没有则使用当前学期类型
      startDate: newStartDate,
      endDate: newEndDate,
    }

    console.log("Creating custom semester:", customSemester)
    console.log("Original semester found:", originalSemester)
    setCurrentSemester(customSemester)

    setShowSemesterStartDateModal(false)
    router.push("/") // 导航回主页
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
                  setShowSemesterStartDateModal(true)
                }}
              />
              <SettingItem label="设置学校额外假期" onClick={() => router.push("/settings/holidays")} />
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
              <SettingItem label="关于我们" onClick={() => router.push("/settings/about")} />
              <SettingItem label="数据备份" onClick={() => router.push("/settings/backup")} isLast={true} />
            </div>
          </div>
        </main>
      </div>

      {/* Month/Day Selector Modal */}
      <MonthSelectorModal
        isOpen={showSemesterStartDateModal}
        currentYear={lastSelectedDate.year}
        currentMonth={lastSelectedDate.month}
        currentDay={lastSelectedDate.day}
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
