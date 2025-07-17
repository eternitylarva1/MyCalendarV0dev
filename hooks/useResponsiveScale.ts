"use client"

import { useState, useEffect } from "react"

export function useResponsiveScale(designWidth = 1408) {
  const [scale, setScale] = useState(1)

  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth

      // 计算缩放比例
      let newScale = Math.min(1, screenWidth / designWidth)

      // 确保最小缩放比例，避免内容过小
      if (screenWidth <= 768) {
        newScale = Math.max(0.3, newScale)
      }

      setScale(newScale)

      // 重置body样式
      document.body.style.height = "auto"
      document.body.style.minHeight = "auto"
      document.body.style.overflow = "auto"
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [designWidth])

  return scale
}
