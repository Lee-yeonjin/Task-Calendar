"use client"

import { useState } from "react"
import { CalendarDays, Plus, CheckCircle2, Circle, Flame } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

// Sample data
const routines = [
  { id: 1, title: "CS 공부", completed: true, icon: "💻" },
  { id: 2, title: "코딩테스트", completed: true, icon: "⌨️" },
  { id: 3, title: "자기소개서 작성", completed: false, icon: "📝" },
  { id: 4, title: "알고리즘 문제풀이", completed: false, icon: "🧩" },
]

const jobEvents = [
  { date: 19, title: "카카오 서류 마감", type: "document", dday: 3 },
  { date: 18, title: "네이버 코테", type: "coding", dday: 6 },
  { date: 22, title: "토스 면접", type: "interview", dday: 10 },
]

const basicEvents = [
  { date: 19, title: "채움솔루션 면접", type: "basic" },
  { date: 16, title: "자격증 시험", type: "basic" },
]

const knowledgeOfDay = "배열은 메모리의 연속된 공간에 저장되므로 인덱스 접근이 O(1)로 빠릅니다."
const motivationMessage = "이번 주도 잘 해냈어요. 계속 나아가세요! 💪"

export default function DevRoutinePage() {
  const today = new Date()
  const [currentDate] = useState(today)
  const [hoveredDate, setHoveredDate] = useState<number | null>(null)

  const currentMonth = currentDate.toLocaleDateString("ko-KR", { month: "long" })
  const currentYear = currentDate.getFullYear()

  // Generate calendar days
  const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
  const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
  const daysInMonth = lastDay.getDate()
  const startingDayOfWeek = firstDay.getDay()

  const calendarDays = []
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(null)
  }
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i)
  }

  const getEventsForDate = (date: number) => {
    const jobs = jobEvents.filter((e) => e.date === date)
    const basics = basicEvents.filter((e) => e.date === date)
    return { jobs, basics }
  }

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "document":
        return "bg-light-orange text-foreground"
      case "coding":
        return "bg-deep-blue text-primary-foreground"
      case "interview":
        return "bg-blue-500 text-white"
      case "basic":
        return "bg-[#F4B6B6] text-[#8B2E2E]"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">DevRoutine</h1>
              <p className="text-muted-foreground">개발자 취준생을 위한 루틴 트래커</p>
            </div>
            <div className="flex items-center gap-3 glass-card px-4 py-2 rounded-2xl">
              <Flame className="w-5 h-5 text-destructive" />
              <span className="text-sm font-medium">4일 연속 루틴 유지 중!</span>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
          {/* Main Calendar */}
          <div className="space-y-6">
            {/* Calendar Header */}
            <Card className="glass-card p-6 rounded-3xl border-0 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-foreground">
                  {currentYear}년 {currentMonth}
                </h2>
                <Button variant="ghost" size="icon" className="rounded-xl">
                  <CalendarDays className="w-5 h-5" />
                </Button>
              </div>

              {/* Calendar Grid */}
              <div className="space-y-2">
                {/* Weekday Headers */}
                <div className="grid grid-cols-7 gap-2 mb-4">
                  {["일", "월", "화", "수", "목", "금", "토"].map((day, i) => (
                    <div
                      key={day}
                      className={cn(
                        "text-center text-sm font-medium py-2",
                        i === 0 ? "text-destructive" : i === 6 ? "text-deep-blue" : "text-muted-foreground",
                      )}
                    >
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar Days */}
                <div className="grid grid-cols-7 gap-2">
                  {calendarDays.map((day, index) => {
                    if (!day) {
                      return <div key={`empty-${index}`} className="aspect-square" />
                    }

                    const { jobs, basics } = getEventsForDate(day)
                    const isToday =
                      day === today.getDate() &&
                      currentDate.getMonth() === today.getMonth() &&
                      currentDate.getFullYear() === today.getFullYear()
                    const hasEvents = jobs.length > 0 || basics.length > 0

                    return (
                      <div
                        key={day}
                        className={cn(
                          "relative aspect-square rounded-2xl p-2 transition-all cursor-pointer",
                          "hover:scale-105 hover:shadow-md",
                          isToday
                            ? "bg-[#244088] text-white shadow-lg"
                            : "bg-card",
                          hoveredDate === day && "ring-2 ring-primary",
                        )}
                        onMouseEnter={() => setHoveredDate(day)}
                        onMouseLeave={() => setHoveredDate(null)}
                      >
                        <div className="flex flex-col h-full">
                          <span
                            className={cn(
                              "text-sm font-medium mb-1",
                              isToday ? "text-primary-foreground" : "text-foreground",
                            )}
                          >
                            {day}
                          </span>

                          {hasEvents && (
                            <div className="flex-1 flex flex-col gap-1 overflow-hidden">
                              {jobs.map((event, i) => (
                                <div
                                  key={i}
                                  className={cn(
                                    "text-xs px-1.5 py-0.5 rounded-md truncate font-medium",
                                    getEventTypeColor(event.type),
                                  )}
                                  title={event.title}
                                >
                                  {event.dday !== undefined && <span className="font-bold">D-{event.dday} </span>}
                                  {event.title}
                                </div>
                              ))}
                              {basics.map((event, i) => (
                                <div
                                  key={i}
                                  className={cn(
                                    "text-xs px-1.5 py-0.5 rounded-md truncate font-medium",
                                    getEventTypeColor(event.type),
                                  )}
                                  title={event.title}
                                >
                                  {event.title}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </Card>

            {/* Legend */}
            <Card className="glass-card p-4 rounded-2xl border-0 shadow-md">
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-light-orange" />
                  <span className="text-foreground">서류 마감</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-deep-blue" />
                  <span className="text-foreground">코딩테스트</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-destructive" />
                  <span className="text-foreground">면접</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-warm-yellow" />
                  <span className="text-foreground">기본 일정</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar Widgets */}
          <div className="space-y-4">
            {/* Today's Routines */}
            <Card className="glass-card p-5 rounded-3xl border-0 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-foreground">오늘의 루틴</h3>
                <Button size="icon" variant="ghost" className="rounded-xl h-8 w-8">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="space-y-3">
                {routines.map((routine) => (
                  <button
                    key={routine.id}
                    className={cn(
                      "w-full flex items-center gap-3 p-3 rounded-xl transition-all",
                      "hover:bg-accent/50",
                      routine.completed && "opacity-60",
                    )}
                  >
                    {routine.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                    ) : (
                      <Circle className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                    )}
                    <span className="text-sm flex items-center gap-2">
                      <span>{routine.icon}</span>
                      <span className={cn("text-left", routine.completed && "line-through")}>{routine.title}</span>
                    </span>
                  </button>
                ))}
              </div>
            </Card>

            {/* Today's Knowledge */}
            <Card className="glass-card p-5 rounded-3xl border-0 shadow-lg bg-gradient-to-br from-soft-pink/20 to-warm-yellow/20">
              <div className="flex items-start gap-3">
                <div className="text-2xl">🧠</div>
                <div>
                  <h3 className="text-sm font-bold text-foreground mb-2">오늘의 한 줄 지식</h3>
                  <p className="text-sm text-foreground/80 leading-relaxed">{knowledgeOfDay}</p>
                </div>
              </div>
            </Card>

            {/* Motivation Message */}
            <Card className="glass-card p-5 rounded-3xl border-0 shadow-lg bg-gradient-to-br from-deep-blue/10 to-primary/10">
              <div className="flex items-start gap-3">
                <div className="text-2xl">💌</div>
                <div>
                  <h3 className="text-sm font-bold text-foreground mb-2">나에게 온 메시지</h3>
                  <p className="text-sm text-foreground/80 leading-relaxed">{motivationMessage}</p>
                </div>
              </div>
            </Card>

            {/* Upcoming Deadlines */}
            <Card className="glass-card p-5 rounded-3xl border-0 shadow-lg">
              <h3 className="text-lg font-bold text-foreground mb-4">다가오는 일정</h3>
              <div className="space-y-3">
                {jobEvents.slice(0, 3).map((event, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-accent/30">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{event.title}</p>
                      <p className="text-xs text-muted-foreground">{event.date}일</p>
                    </div>
                    <div
                      className={cn(
                        "px-3 py-1 rounded-full text-xs font-bold",
                        event.dday <= 3 ? "bg-destructive/20 text-destructive" : "bg-primary/20 text-primary",
                      )}
                    >
                      D-{event.dday}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}