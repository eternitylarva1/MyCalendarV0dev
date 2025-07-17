"use client"

import type { ViewMode } from "../types/calendar"

interface BottomNavigationProps {
  currentView: ViewMode
  onViewChange: (view: ViewMode) => void
  scale?: number // Keep scale prop
}

export function BottomNavigation({ currentView, onViewChange, scale = 1 }: BottomNavigationProps) {
  return (
    <div
      className="flex items-center justify-around"
      style={{
        background: "#fafafa",
        borderRadius: "0px",
        padding: "48px 0",
        width: "1408px", // 保持原始宽度
        height: "193px", // 保持原始高度
        marginTop: scale < 1 ? "20px" : "50px", // 根据缩放调整间距
      }}
    >
      <div
        className="relative cursor-pointer"
        onClick={() => onViewChange("semester")}
        style={{
          background: currentView === "semester" ? "#4159f7" : "transparent",
          borderRadius: "25px",
          border: "1px solid rgba(0,0,0,0.1)",
          width: "193px",
          height: "96px",
          boxShadow: currentView === "semester" ? "4px 4px 10px 0px rgba(0, 0, 0, 0.25)" : "none",
        }}
      >
        <div
          className="absolute flex items-center justify-center"
          style={{
            padding: "10px",
            gap: "10px",
            left: "23px",
            top: "-10px",
          }}
        >
          <div
            style={{
              color: currentView === "semester" ? "#ffffff" : "#000000",
              textAlign: "left",
              fontFamily: currentView === "semester" ? '"MicrosoftYaHei-Bold", sans-serif' : "inherit",
              fontSize: "64px",
              lineHeight: "150%",
              letterSpacing: "-0.023em",
              fontWeight: currentView === "semester" ? 700 : 400,
            }}
          >
            学期
          </div>
        </div>
      </div>

      <div
        className="relative cursor-pointer flex items-center justify-center"
        onClick={() => onViewChange("month")}
        style={{
          background: currentView === "month" ? "#4159f7" : "transparent",
          borderRadius: "25px",
          border: currentView === "month" ? "1px solid rgba(0,0,0,0.1)" : "none",
          width: "193px",
          height: "96px",
          boxShadow: currentView === "month" ? "4px 4px 10px 0px rgba(0, 0, 0, 0.25)" : "none",
        }}
      >
        <div
          style={{
            color: currentView === "month" ? "#ffffff" : "#000000",
            textAlign: "left",
            fontSize: "64px",
            lineHeight: "150%",
            letterSpacing: "-0.023em",
            fontWeight: currentView === "month" ? 700 : 400,
            fontFamily: currentView === "month" ? '"MicrosoftYaHei-Bold", sans-serif' : "inherit",
          }}
        >
          月
        </div>
      </div>
    </div>
  )
}
