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
    const currentStartDate = new Date(currentSemester.startDate)
    return {
      year: currentStartDate.getFullYear(),
      month: currentStartDate.getMonth() + 1,
      day: currentStartDate.getDate(),
    }
  })

  const handleSemesterStartDateSelect = (year: number, month: number, day: number) => {
    // 更新最后选择的日期
    setLastSelectedDate({ year, month, day })

    // 构造新的学期开始日期字符串
    const newStartDate = new Date(year, month - 1, day).toISOString().split("T")[0]

    // 查找选择的日期是否在任何现有学期范围内
    const newActiveSemester = availableSemesters.find((s) => {
      const sStart = new Date(s.startDate)
      const sEnd = new Date(s.endDate)
      const selectedDate = new Date(year, month - 1, day)

      return selectedDate >= sStart && selectedDate <= sEnd
    })

    if (newActiveSemester) {
      // 如果选择的日期在现有学期范围内，切换到那个学期
      setCurrentSemester(newActiveSemester)
    } else {
      // 如果选择的日期不属于任何预定义学期，创建一个自定义学期
      const customSemester = {
        ...currentSemester,
        id: `custom-${Date.now()}`, // 生成唯一ID
        name: `自定义学期 (${year}年${month}月${day}日开始)`,
        startDate: newStartDate,
        // 保持原有的结束日期或设置一个默认的结束日期
        endDate: currentSemester.endDate,
      }
      setCurrentSemester({
        ...customSemester,
      })
    }

    setShowSemesterStartDateModal(false)
    router.push("/") // 添加这行代码，导航回主页
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
