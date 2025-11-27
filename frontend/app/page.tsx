"use client"

import { useState } from "react"
import { CalendarDays, Plus, CheckCircle2, Circle, Flame, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

// 루틴 샘플
const routines = [
  { id: 1, title: "CS 공부", completed: true, icon: "💻" },
  { id: 2, title: "코딩테스트", completed: true, icon: "⌨️" },
  { id: 3, title: "자기소개서 작성", completed: false, icon: "📝" },
  { id: 4, title: "알고리즘 문제풀이", completed: false, icon: "🧩" },
]

const knowledgeOfDay =
  "배열은 메모리의 연속된 공간에 저장되므로 인덱스 접근이 O(1)로 빠릅니다."
const motivationMessage = "이번 주도 잘 해냈어요. 계속 나아가세요! 💪"

export default function DevRoutinePage() {
  const today = new Date()

  // ⭐ A → hover / select를 Date 객체로 통일
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  // ⭐ B → 달 이동 가능하도록 year / month 상태로 관리
  const [currentYear, setCurrentYear] = useState(today.getFullYear())
  const [currentMonth, setCurrentMonth] = useState(today.getMonth()) // 0~11

  // ⭐ 일정 저장 상태
  const [events, setEvents] = useState<Record<string, { title: string; color: string }[]>>({})

  // ⭐ 모달 상태
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newTitle, setNewTitle] = useState("")
  const [newColor, setNewColor] = useState("#7886C7")

  // 날짜 포맷 키
  function dateKey(date: Date) {
    return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
  }

  function isSameDate(a: Date, b: Date) {
    return (
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate()
    )
  }

  // 모달 열기
  const openModal = (date: Date) => {
    setSelectedDate(date)
    setIsModalOpen(true)
  }

  const saveEvent = () => {
    if (!selectedDate || !newTitle.trim()) return

    const key = dateKey(selectedDate)

    setEvents((prev) => ({
      ...prev,
      [key]: [...(prev[key] || []), { title: newTitle, color: newColor }],
    }))

    setNewTitle("")
    setNewColor("#7886C7")
    setIsModalOpen(false)
  }

  // ------------------ 캘린더 날짜 생성 ------------------
  const firstDay = new Date(currentYear, currentMonth, 1)
  const lastDay = new Date(currentYear, currentMonth + 1, 0)

  const startWeekday = firstDay.getDay()
  const totalDays = lastDay.getDate()

  const prevLast = new Date(currentYear, currentMonth, 0).getDate()

  let days: { date: Date; currentMonth: boolean }[] = []

  // 전월 날짜
  for (let i = startWeekday - 1; i >= 0; i--) {
    days.push({
      date: new Date(currentYear, currentMonth - 1, prevLast - i),
      currentMonth: false,
    })
  }

  // 이번달 날짜
  for (let i = 1; i <= totalDays; i++) {
    days.push({
      date: new Date(currentYear, currentMonth, i),
      currentMonth: true,
    })
  }

  // 다음달 날짜
  while (days.length < 42) {
    const nextIndex = days.length - (startWeekday + totalDays) + 1
    days.push({
      date: new Date(currentYear, currentMonth + 1, nextIndex),
      currentMonth: false,
    })
  }

  // 달 변경
  const goPrevMonth = () => {
    setCurrentMonth((m) => {
      if (m === 0) {
        setCurrentYear((y) => y - 1)
        return 11
      }
      return m - 1
    })
  }

  const goNextMonth = () => {
    setCurrentMonth((m) => {
      if (m === 11) {
        setCurrentYear((y) => y + 1)
        return 0
      }
      return m + 1
    })
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="mb-2 text-4xl font-bold text-foreground">
                DevRoutine
              </h1>
              <p className="text-muted-foreground">취준생을 위한 루틴 트래커</p>
            </div>
            <div className="glass-card flex items-center gap-3 rounded-2xl px-4 py-2">
              <Flame className="h-5 w-5 text-destructive" />
              <span className="text-sm font-medium">4일 연속 루틴 유지 중!</span>
            </div>
          </div>
        </header>

        {/* 메인 레이아웃 */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
          
          {/* ------------------ 캘린더 ------------------ */}
          <div className="space-y-6">
            <Card className="glass-card rounded-3xl border-0 p-6 shadow-lg">
              
              {/* 월/년도 */}
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={goPrevMonth}
                    className="p-2 rounded-xl hover:bg-accent transition"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <h2 className="text-2xl font-bold text-foreground">
                    {currentYear}년 {currentMonth + 1}월
                  </h2>
                  <button
                    onClick={goNextMonth}
                    className="p-2 rounded-xl hover:bg-accent transition"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>

                <Button variant="ghost" size="icon" className="rounded-xl">
                  <CalendarDays className="h-5 w-5" />
                </Button>
              </div>

              {/* 요일 */}
              <div className="mb-4 grid grid-cols-7 gap-1">
                {["일", "월", "화", "수", "목", "금", "토"].map((d, i) => (
                  <div
                    key={d}
                    className={cn(
                      "py-2 text-center text-sm font-medium",
                      i === 0 ? "text-destructive" : i === 6 ? "text-blue-700" : "text-muted-foreground"
                    )}
                  >
                    {d}
                  </div>
                ))}
              </div>

              {/* 날짜들 */}
              <div className="grid grid-cols-7 gap-2">
                {days.map(({ date, currentMonth }, idx) => {
                  
                  const isToday = isSameDate(date, today)
                  const isHover = hoveredDate && isSameDate(date, hoveredDate)
                  const key = dateKey(date)
                  const dayEvents = events[key] || []

                  return (
                    <div
                      key={idx}
                      onClick={() => currentMonth && openModal(date)}
                      onMouseEnter={() => setHoveredDate(date)}
                      onMouseLeave={() => setHoveredDate(null)}
                      className={cn(
                        "relative h-20 cursor-pointer rounded-2xl p-2 transition-all",
                        "hover:scale-105 hover:shadow-md",
                        currentMonth ? "opacity-100" : "opacity-40",
                        isToday ? "bg-[#7886C7] text-white shadow-lg" : "bg-card",
                        isHover && "ring-2 ring-primary"
                      )}
                    >
                      {/* 날짜 숫자 */}
                      <span
                        className={cn(
                          "absolute left-1/2 top-2 -translate-x-1/2 text-sm font-medium",
                          isToday ? "text-white" : "text-foreground"
                        )}
                      >
                        {date.getDate()}
                      </span>

                      {/* 일정 */}
                      {dayEvents.length > 0 && (
                        <div className="mt-6 flex flex-col gap-1 overflow-hidden">
                          {dayEvents.map((ev, i) => (
                            <div
                              key={i}
                              className="truncate rounded-md px-1.5 py-0.5 text-xs font-medium text-white"
                              style={{ backgroundColor: ev.color }}
                            >
                              {ev.title}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>

            </Card>
          </div>

          {/* ------------------ 사이드바 ------------------ */}
          <div className="space-y-4">
            <Card className="glass-card rounded-3xl border-0 p-5 shadow-lg">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-bold text-foreground">오늘의 루틴</h3>
                <Button size="icon" variant="ghost" className="h-8 w-8 rounded-xl">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-3">
                {routines.map((routine) => (
                  <button
                    key={routine.id}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-xl p-3 transition-all",
                      "hover:bg-accent/50",
                      routine.completed && "opacity-60"
                    )}
                  >
                    {routine.completed ? (
                      <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-primary" />
                    ) : (
                      <Circle className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
                    )}

                    <span className="flex items-center gap-2 text-sm">
                      <span>{routine.icon}</span>
                      <span
                        className={cn(
                          "text-left",
                          routine.completed && "line-through"
                        )}
                      >
                        {routine.title}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            </Card>

            {/* 오늘의 한 줄 지식 */}
            <Card className="glass-card rounded-3xl border-0 bg-gradient-to-br from-soft-pink/20 to-warm-yellow/20 p-5 shadow-lg">
              <div className="flex items-start gap-3">
                <div className="text-2xl">🧠</div>
                <div>
                  <h3 className="mb-2 text-sm font-bold text-foreground">오늘의 한 줄 지식</h3>
                  <p className="text-sm leading-relaxed text-foreground/80">
                    {knowledgeOfDay}
                  </p>
                </div>
              </div>
            </Card>

            {/* 메시지 */}
            <Card className="glass-card rounded-3xl border-0 bg-gradient-to-br from-deep-blue/10 to-primary/10 p-5 shadow-lg">
              <div className="flex items-start gap-3">
                <div className="text-2xl">💌</div>
                <div>
                  <h3 className="mb-2 text-sm font-bold text-foreground">나에게 온 메시지</h3>
                  <p className="text-sm leading-relaxed text-foreground/80">
                    {motivationMessage}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* ------------------ 일정 추가 모달 ------------------ */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">
              {selectedDate?.getDate()}일 일정 추가
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <input
              placeholder="일정 제목"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
            />

            <div className="flex gap-2">
              {["#7886C7", "#F4B6B6", "#4EA8DE", "#FFD43B"].map((color) => (
                <button
                  key={color}
                  type="button"
                  className={cn(
                    "h-8 w-8 rounded-full border",
                    newColor === color && "ring-2 ring-primary"
                  )}
                  style={{ backgroundColor: color }}
                  onClick={() => setNewColor(color)}
                />
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button onClick={saveEvent}>저장</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}