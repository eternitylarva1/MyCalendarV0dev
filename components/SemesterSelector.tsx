"use client"

import { useState } from "react"
import type { SemesterInfo } from "../types/calendar"

interface SemesterSelectorProps {
  currentSemester: SemesterInfo
  availableSemesters: SemesterInfo[]
  onSemesterChange: (semesterId: string) => void
}

export function SemesterSelector({ currentSemester, availableSemesters, onSemesterChange }: SemesterSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedYear, setSelectedYear] = useState(currentSemester.year)
  const [selectedSeason, setSelectedSeason] = useState<"spring" | "fall" | "short">(currentSemester.season)

  // 动态生成学年列表：当前学年向前和向后各延伸3年
  const yearOffset = 3
  const currentYear = new Date().getFullYear()
  const startYearRange = Math.min(currentYear - yearOffset, currentSemester.year - yearOffset)
  const endYearRange = Math.max(currentYear + yearOffset, currentSemester.year + yearOffset)

  const dynamicAvailableYears = Array.from({ length: endYearRange - startYearRange + 1 }, (_, i) => startYearRange + i)

  // 根据选中的学年和学期找到对应的学期信息
  const getSelectedSemester = (year: number, season: "spring" | "fall" | "short") => {
    return availableSemesters.find((s) => s.year === year && s.season === season)
  }

  const handleYearSelect = (year: number) => {
    setSelectedYear(year)
    // 检查该学年是否有当前选中的学期，如果没有则切换到该学年可用的第一个学期
    const semesterWithSameSeason = availableSemesters.find((s) => s.year === year && s.season === selectedSeason)
    if (!semesterWithSameSeason) {
      const firstAvailableSemesterInNewYear = availableSemesters.find((s) => s.year === year)
      if (firstAvailableSemesterInNewYear) {
        setSelectedSeason(firstAvailableSemesterInNewYear.season)
      } else {
        // 如果该学年没有任何学期，可以考虑重置或禁用确定按钮
        // 这里我们保持当前season，但按钮会显示为不可用
      }
    }
  }

  const handleSeasonSelect = (season: "spring" | "fall" | "short") => {
    setSelectedSeason(season)
  }

  const handleConfirm = () => {
    const selectedSemester = getSelectedSemester(selectedYear, selectedSeason)
    if (selectedSemester) {
      onSemesterChange(selectedSemester.id)
    }
    setIsOpen(false)
  }

  const handleCancel = () => {
    // 重置为当前学期
    setSelectedYear(currentSemester.year)
    setSelectedSeason(currentSemester.season)
    setIsOpen(false)
  }

  return (
    <>
      {/* 主按钮 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative z-50 flex items-center gap-2 text-white transition-opacity hover:opacity-80"
        style={{
          fontSize: "64px", // 恢复到 64px
          lineHeight: "150%",
          letterSpacing: "-0.023em",
          fontWeight: 400,
          whiteSpace: "nowrap", // 防止文本换行
          height: "96px", // 统一高度
          display: "flex", // 确保flex布局
          alignItems: "center", // 垂直居中
          justifyContent: "center", // 水平居中
        }}
      >
        {currentSemester.name} {/* 这是您希望露出的“2024年春季学期”文字 */}
        <svg
          width="32" // 恢复到 32px
          height="20" // 恢复到 20px
          viewBox="0 0 32 20"
          fill="none"
          className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          // style={{ marginTop: "8px" }} // 移除此行，通过flexbox实现垂直居中
        >
          <path d="M2 2L16 16L30 2" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* 下拉菜单和遮罩 */}
      {isOpen && (
        <>
          {/* 模糊遮罩层 - 从学期名称下方开始模糊 */}
          <div
            className="fixed bottom-0 left-0 right-0 z-[9998] bg-black/30 backdrop-blur-sm"
            style={{ top: "320px" }} // 恢复到 320px
            onClick={handleCancel}
          />

          {/* 模态框内容容器 */}
          <div
            className="fixed left-1/2 z-[10000] -translate-x-1/2"
            style={{
              top: "140px", // 恢复到 140px
              background: "white",
              width: "1408px", // 恢复到 1408px
              height: "751px", // 恢复到 751px
              overflow: "hidden", // 确保没有滚动条
              fontFamily: '"Microsoft YaHei", sans-serif', // 应用字体
            }}
          >
            {/* 顶部操作栏 */}
            <div
              className="flex items-center justify-between"
              style={{
                height: "90px", // 恢复到 90px
                padding: "0 40px", // 恢复到 0 40px
                borderBottom: "1px solid #e5e7eb", // 浅灰色边框
              }}
            >
              <button
                onClick={handleCancel}
                style={{
                  fontSize: "32px", // 恢复到 32px
                  fontWeight: 400, // 正常粗细
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
                  fontSize: "36px", // 恢复到 36px
                  fontWeight: 600, // 半粗
                  color: "#000000",
                }}
              >
                请选择年份/学期
              </div>
              <button
                onClick={handleConfirm}
                style={{
                  fontSize: "32px", // 恢复到 32px
                  fontWeight: 600, // 半粗
                  color: "#4f6ff1", // 蓝色
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                确定
              </button>
            </div>

            {/* 主要选择区域 */}
            <div
              className="flex h-[calc(100%-90px)]" // 恢复到 calc(100%-90px)
            >
              {" "}
              {/* 减去新的头部高度 */}
              {/* 左侧 - 学年选择 */}
              <div className="flex flex-1 flex-col items-center justify-start overflow-y-auto max-h-full hide-scrollbar">
                {dynamicAvailableYears.map((year) => {
                  const yearLabel = `${year}-${year + 1}学年`
                  const isSelected = year === selectedYear
                  return (
                    <button
                      key={year}
                      onClick={() => handleYearSelect(year)}
                      className="w-full flex items-center justify-center transition-colors"
                      style={{
                        height: "140px", // 恢复到 140px
                        fontSize: "64px", // 恢复到 64px
                        fontWeight: isSelected ? 700 : 300, // 根据Figma调整字重
                        color: isSelected ? "#4f6ff1" : "#000000", // 根据Figma调整颜色
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        flexShrink: 0, // 防止按钮缩小
                        whiteSpace: "nowrap", // 防止文本换行
                      }}
                    >
                      {yearLabel}
                    </button>
                  )
                })}
              </div>
              {/* 中间分隔线 - 黑色细线 */}
              <div
                style={{
                  width: "5px", // 恢复到 5px
                  background: "#000000",
                  opacity: 0.2, // 根据Figma调整透明度
                  height: "100%", // 占据选择区域的全部高度
                }}
              />
              {/* 右侧 - 学期选择 */}
              <div className="flex flex-1 flex-col items-center justify-center overflow-y-auto max-h-full hide-scrollbar">
                {["fall", "spring", "short"].map((season) => {
                  // 添加 'short'
                  let seasonLabel = ""
                  switch (season) {
                    case "fall":
                      seasonLabel = "第一学期"
                      break
                    case "spring":
                      seasonLabel = "第二学期"
                      break
                    case "short":
                      seasonLabel = "小学期" // 新增小学期标签
                      break
                  }
                  const isAvailable = availableSemesters.some((s) => s.year === selectedYear && s.season === season)
                  const isSelected = season === selectedSeason && isAvailable

                  return (
                    <button
                      key={season}
                      onClick={() => isAvailable && handleSeasonSelect(season as "spring" | "fall" | "short")} // 更新类型
                      disabled={!isAvailable}
                      className="w-full flex items-center justify-center transition-colors"
                      style={{
                        height: "140px", // 恢复到 140px
                        fontSize: "64px", // 恢复到 64px
                        fontWeight: isSelected ? 700 : 300, // 根据Figma调整字重
                        color: !isAvailable ? "#9ca3af" : isSelected ? "#4f6ff1" : "#000000", // 根据Figma调整颜色
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        flexShrink: 0, // 防止按钮缩小
                        whiteSpace: "nowrap", // 防止文本换行
                      }}
                    >
                      {seasonLabel}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}
