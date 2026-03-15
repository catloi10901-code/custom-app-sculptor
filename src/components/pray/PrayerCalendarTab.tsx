import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Globe, BookOpen } from 'lucide-react';
import { prayerSchedule, continentLabels, bibleVerse, type PrayerDay } from '@/data/prayerSchedule';

const daysOfWeek = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

// Cycle start date: The 54-day cycle repeats. We anchor Day 1 to a known start.
const CYCLE_START = new Date(2026, 1, 12); // Feb 12, 2026 = Day 1
const CYCLE_LENGTH = 54;

function getDayInCycle(date: Date): number {
  const diff = Math.floor((date.getTime() - CYCLE_START.getTime()) / 86400000);
  const mod = ((diff % CYCLE_LENGTH) + CYCLE_LENGTH) % CYCLE_LENGTH;
  return mod + 1; // 1-based
}

const PrayerCalendarTab = () => {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth());
  });
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);

  const today = new Date();
  const todayStr = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;

  const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));

  const monthLabel = currentMonth.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' });

  const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();

  const calDays = useMemo(() => {
    const days: { day: number; isCurrentMonth: boolean; date: Date }[] = [];
    const prevMonthDays = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 0).getDate();
    for (let i = firstDay - 1; i >= 0; i--) {
      const d = prevMonthDays - i;
      days.push({ day: d, isCurrentMonth: false, date: new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, d) });
    }
    for (let d = 1; d <= daysInMonth; d++) {
      days.push({ day: d, isCurrentMonth: true, date: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), d) });
    }
    while (days.length % 7 !== 0) {
      const d = days.length - firstDay - daysInMonth + 1;
      days.push({ day: d, isCurrentMonth: false, date: new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, d) });
    }
    return days;
  }, [currentMonth, firstDay, daysInMonth]);

  const selectedSchedule: PrayerDay | null = useMemo(() => {
    const target = selectedDay || today;
    const dayNum = getDayInCycle(target);
    return prayerSchedule.find(s => s.day === dayNum) || null;
  }, [selectedDay, today]);

  const currentCycleDay = getDayInCycle(selectedDay || today);

  const continentKeys = ['israel', 'asia', 'africa', 'europe', 'americas', 'oceania'] as const;

  return (
    <section className="py-8 sm:py-12">
      <div className="container max-w-[1000px]">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-3">
            <Globe className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-primary">Pray For All The Nations (PAN)</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl text-foreground mb-2">Lịch Cầu Nguyện Hàng Ngày</h2>
          <p className="text-muted-foreground text-sm max-w-lg mx-auto">
            Cầu thay cho lãnh đạo các quốc gia — Mỗi ngày lúc 21h (Việt Nam) — Chu kỳ 54 ngày
          </p>
        </div>

        {/* Bible Verse */}
        <div className="flex items-start gap-3 p-4 rounded-xl bg-primary/[0.06] border border-primary/20 mb-6">
          <BookOpen className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-foreground text-sm italic">{bibleVerse.text}</p>
            <p className="text-primary text-xs font-semibold mt-1">— {bibleVerse.ref}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
          {/* Calendar Grid */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <button onClick={prevMonth} className="p-2 rounded-lg bg-secondary/50 border border-border text-foreground hover:bg-secondary transition-colors">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <h3 className="font-serif text-foreground text-lg capitalize">{monthLabel}</h3>
              <button onClick={nextMonth} className="p-2 rounded-lg bg-secondary/50 border border-border text-foreground hover:bg-secondary transition-colors">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1">
              {daysOfWeek.map((d) => (
                <div key={d} className="text-center text-[0.7rem] font-semibold text-muted-foreground py-2 uppercase tracking-wider">{d}</div>
              ))}
              {calDays.map((cell, i) => {
                const cellStr = `${cell.date.getFullYear()}-${cell.date.getMonth()}-${cell.date.getDate()}`;
                const isToday = cellStr === todayStr;
                const isSelected = selectedDay && cell.date.getTime() === selectedDay.getTime();
                const cycleDay = getDayInCycle(cell.date);

                return (
                  <button
                    key={i}
                    onClick={() => setSelectedDay(cell.date)}
                    className={`min-h-[62px] sm:min-h-[72px] rounded-lg p-1.5 cursor-pointer transition-all duration-200 relative text-left border
                      ${!cell.isCurrentMonth ? 'opacity-25 border-transparent' : 'border-border/30 hover:bg-secondary/30 hover:border-border'}
                      ${isToday ? 'border-primary/50 bg-primary/[0.08]' : ''}
                      ${isSelected ? 'border-primary bg-primary/[0.12] ring-1 ring-primary/30' : ''}
                    `}
                  >
                    <span className={`text-[0.78rem] font-semibold ${isToday ? 'text-primary' : 'text-foreground'}`}>{cell.day}</span>
                    {cell.isCurrentMonth && (
                      <div className="text-[0.6rem] text-muted-foreground mt-0.5">Ngày {cycleDay}</div>
                    )}
                    {isToday && <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-primary rounded-full" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Day Detail Panel */}
          <div className="lg:sticky lg:top-[80px] self-start">
            <div className="rounded-2xl border border-border bg-card/50 backdrop-blur-sm overflow-hidden">
              {/* Panel header */}
              <div className="bg-gradient-to-r from-primary/15 to-primary/5 px-5 py-4 border-b border-border/50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Chu kỳ ngày</p>
                    <p className="text-2xl font-bold text-primary">{currentCycleDay}<span className="text-sm text-muted-foreground font-normal"> / 54</span></p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">
                      {(selectedDay || today).toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long' })}
                    </p>
                    <p className="text-xs text-primary font-semibold mt-0.5">21:00 GMT+7</p>
                  </div>
                </div>
              </div>

              {/* Countries list */}
              <div className="p-4 space-y-2">
                <p className="text-[0.7rem] uppercase tracking-wider text-muted-foreground font-semibold mb-3">Cầu nguyện cho</p>
                {selectedSchedule && continentKeys.map((key) => {
                  const value = selectedSchedule[key as keyof PrayerDay];
                  if (!value || typeof value === 'number') return null;
                  const info = continentLabels[key];
                  const isGeneral = typeof value === 'string' && value.startsWith('Cầu nguyện chung');

                  return (
                    <div
                      key={key}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-colors
                        ${key === 'israel' ? 'bg-blue-500/[0.08] border-blue-500/20' : 'bg-secondary/30 border-border/40 hover:bg-secondary/50'}
                      `}
                    >
                      <span className="text-lg flex-shrink-0">{info.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className={`text-[0.68rem] font-semibold uppercase tracking-wider ${info.color}`}>{info.label}</p>
                        <p className={`text-sm font-medium text-foreground truncate ${isGeneral ? 'italic text-muted-foreground' : ''}`}>
                          {value as string}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Progress bar */}
              <div className="px-4 pb-4">
                <div className="flex items-center justify-between text-[0.68rem] text-muted-foreground mb-1.5">
                  <span>Tiến trình chu kỳ</span>
                  <span>{Math.round((currentCycleDay / CYCLE_LENGTH) * 100)}%</span>
                </div>
                <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-primary/60 rounded-full transition-all duration-500"
                    style={{ width: `${(currentCycleDay / CYCLE_LENGTH) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PrayerCalendarTab;
