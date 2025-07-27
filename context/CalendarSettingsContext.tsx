"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import type { SemesterInfo } from "@/types/calendar"
import { AVAILABLE_SEMESTERS, getCurrentSemester } from "@/utils/semesterUtils"

interface CalendarSettingsContextType {
  currentSemester: SemesterInfo
  setCurrentSemester: (semester: SemesterInfo) => void
  availableSemesters: SemesterInfo[]
}

const CalendarSettingsContext = createContext<CalendarSettingsContextType | undefined>(undefined)

export function CalendarSettingsProvider({ children }: { children: ReactNode }) {
  const [currentSemester, setCurrentSemesterState] = useState<SemesterInfo>(getCurrentSemester())

  const setCurrentSemester = (semester: SemesterInfo) => {
    console.log("Setting new semester:", semester) // 添加调试日志
    setCurrentSemesterState(semester)
  }

  const contextValue = {
    currentSemester,
    setCurrentSemester,
    availableSemesters: AVAILABLE_SEMESTERS,
  }

  return <CalendarSettingsContext.Provider value={contextValue}>{children}</CalendarSettingsContext.Provider>
}

export function useCalendarSettings() {
  const context = useContext(CalendarSettingsContext)
  if (context === undefined) {
    throw new Error("useCalendarSettings must be used within a CalendarSettingsProvider")
  }
  return context
}
