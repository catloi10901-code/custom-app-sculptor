import { useState, useEffect, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

type CalEvent = {
  id: string;
  day: number;
  month: number;
  year: number;
  title: string;
  time: string;
  type: 'Hiệp Lời' | 'Live Session' | 'Cộng Đồng' | 'Lễ Tôn Giáo' | 'Tôn Giáo Bạn';
  icon: string;
  community: boolean;
  joined: boolean;
};

const MONTHS = ['Tháng 1','Tháng 2','Tháng 3','Tháng 4','Tháng 5','Tháng 6','Tháng 7','Tháng 8','Tháng 9','Tháng 10','Tháng 11','Tháng 12'];
const DAY_NAMES = ['CN','T2','T3','T4','T5','T6','T7'];

const SAMPLE_EVENTS: CalEvent[] = [
  { id: '1', day: 10, month: 3, year: 2026, title: 'Cầu Nguyện Hòa Bình Toàn Cầu', time: '20:00', type: 'Hiệp Lời', icon: '🕊️', community: true, joined: false },
  { id: '2', day: 12, month: 3, year: 2026, title: 'Thứ Tư Tro (Công Giáo)', time: 'Cả ngày', type: 'Lễ Tôn Giáo', icon: '✝️', community: false, joined: false },
  { id: '3', day: 15, month: 3, year: 2026, title: 'Buổi Cầu Nguyện Thịnh Vượng', time: '19:00', type: 'Live Session', icon: '🌟', community: true, joined: false },
  { id: '4', day: 17, month: 3, year: 2026, title: 'Lễ Thánh Patrick', time: 'Cả ngày', type: 'Lễ Tôn Giáo', icon: '☘️', community: false, joined: false },
  { id: '5', day: 20, month: 3, year: 2026, title: 'Ngày Quốc Tế Hạnh Phúc', time: '18:00', type: 'Cộng Đồng', icon: '😊', community: true, joined: false },
  { id: '6', day: 22, month: 3, year: 2026, title: 'Hiệp Cầu Châu Á', time: '21:00', type: 'Live Session', icon: '🌏', community: true, joined: false },
  { id: '7', day: 25, month: 3, year: 2026, title: 'Kỷ Niệm Truyền Đạo Phúc Âm', time: 'Cả ngày', type: 'Lễ Tôn Giáo', icon: '📖', community: false, joined: false },
  { id: '8', day: 28, month: 3, year: 2026, title: 'Ramadan - Lời Chúc Tâm Linh', time: '19:30', type: 'Tôn Giáo Bạn', icon: '☪️', community: true, joined: false },
  { id: '9', day: 5, month: 4, year: 2026, title: 'Lễ Phục Sinh & Cầu Nguyện Bình Minh', time: '06:00', type: 'Lễ Tôn Giáo', icon: '🌅', community: true, joined: false },
];

const PrayerCalendarTab = () => {
  const [currentDate, setCurrentDate] = useState(() => new Date(2026, 2, 1));
  const [events, setEvents] = useState<CalEvent[]>(SAMPLE_EVENTS);

  useEffect(() => {
    supabase
      .from('live_sessions')
      .select('*')
      .eq('is_active', true)
      .then(({ data }) => {
        if (!data) return;
        const sessionEvents: CalEvent[] = data
          .filter(s => s.scheduled_time)
          .map(s => {
            const d = new Date(s.scheduled_time!);
            return {
              id: s.id,
              day: d.getDate(),
              month: d.getMonth() + 1,
              year: d.getFullYear(),
              title: s.title,
              time: d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
              type: 'Live Session' as const,
              icon: '🎙️',
              community: true,
              joined: false,
            };
          });
        if (sessionEvents.length) {
          setEvents(prev => {
            const existingIds = new Set(prev.map(e => e.id));
            const newEvents = sessionEvents.filter(e => !existingIds.has(e.id));
            return newEvents.length ? [...prev, ...newEvents] : prev;
          });
        }
      });
  }, []);

  const today = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthLabel = `${MONTHS[month]}, ${year}`;
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const calDays = useMemo(() => {
    const days: { day: number; isCurrentMonth: boolean; date: Date; events: CalEvent[] }[] = [];
    for (let i = firstDay - 1; i >= 0; i--) {
      const d = daysInPrevMonth - i;
      const date = new Date(year, month - 1, d);
      days.push({ day: d, isCurrentMonth: false, date, events: [] });
    }
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d);
      const evs = events.filter(e => e.day === d && e.month === month + 1 && e.year === year);
      days.push({ day: d, isCurrentMonth: true, date, events: evs });
    }
    const remaining = (firstDay + daysInMonth) % 7;
    if (remaining) {
      for (let i = 1; i <= 7 - remaining; i++) {
        const date = new Date(year, month + 1, i);
        days.push({ day: i, isCurrentMonth: false, date, events: [] });
      }
    }
    return days;
  }, [firstDay, daysInMonth, daysInPrevMonth, year, month, events]);

  const upcomingEvents = useMemo(() => {
    return events
      .filter(e => e.month === month + 1 && e.year === year)
      .sort((a, b) => a.day - b.day);
  }, [events, month, year]);

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const toggleJoin = (id: string) => {
    setEvents(evs => evs.map(e => e.id === id ? { ...e, joined: !e.joined } : e));
  };

  const getEventChipClass = (ev: CalEvent) => {
    const base = 'text-[0.6rem] rounded px-1 py-0.5 font-semibold';
    if (ev.type === 'Live Session') return `${base} bg-red-500/20 text-red-400`;
    if (ev.type === 'Lễ Tôn Giáo') return `${base} bg-amber-500/15 text-amber-400`;
    if (ev.type === 'Tôn Giáo Bạn') return `${base} bg-blue-500/20 text-blue-400`;
    if (ev.type === 'Cộng Đồng') return `${base} bg-purple-500/15 text-purple-400`;
    return `${base} bg-primary/15 text-primary`;
  };

  return (
    <section className="py-8 sm:py-12">
      <div className="container max-w-[900px]">

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-1">
            <span className="text-2xl">📅</span>
            <h2 className="font-serif text-foreground text-xl sm:text-2xl">Lịch Cầu Nguyện</h2>
          </div>
          <p className="text-muted-foreground text-sm">Lịch cầu nguyện hàng ngày và sự kiện cộng đồng</p>
        </div>

        {/* Calendar Card */}
        <div className="rounded-2xl border border-border bg-card/50 overflow-hidden">

          {/* Month Nav */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-border/50">
            <button
              onClick={prevMonth}
              className="flex items-center gap-1.5 bg-secondary/50 border border-border text-foreground text-sm px-4 py-2 rounded-lg hover:bg-secondary transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Trước</span>
            </button>
            <span className="font-serif text-primary text-lg sm:text-xl">{monthLabel}</span>
            <button
              onClick={nextMonth}
              className="flex items-center gap-1.5 bg-secondary/50 border border-border text-foreground text-sm px-4 py-2 rounded-lg hover:bg-secondary transition-colors cursor-pointer"
            >
              <span>Sau</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Day Labels */}
          <div className="grid grid-cols-7 gap-1 px-4 pt-4">
            {DAY_NAMES.map(d => (
              <div key={d} className="text-center text-[0.72rem] font-semibold text-muted-foreground py-2 uppercase tracking-wider">
                {d}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1 px-4 pb-4 mt-1">
            {calDays.map((cell, i) => {
              const isToday =
                today.getDate() === cell.day &&
                today.getMonth() === month &&
                today.getFullYear() === cell.date.getFullYear() &&
                cell.isCurrentMonth;
              const evs = cell.events;

              return (
                <div
                  key={i}
                  className={[
                    'min-h-[70px] sm:min-h-[80px] rounded-lg p-1.5 transition-all duration-200 relative',
                    cell.isCurrentMonth
                      ? 'bg-secondary/10 border border-border/30 hover:bg-secondary/25 cursor-pointer'
                      : 'opacity-30',
                    isToday ? 'border-2 border-primary bg-primary/[0.07]' : '',
                  ].join(' ')}
                >
                  <span className={`text-[0.78rem] font-semibold ${isToday ? 'text-primary' : 'text-foreground'}`}>
                    {cell.day}
                  </span>

                  {evs.slice(0, 2).map(ev => (
                    <div
                      key={ev.id}
                      className={`mt-1 truncate ${getEventChipClass(ev)}`}
                    >
                      {ev.icon} {ev.title.substring(0, 10)}
                    </div>
                  ))}

                  {evs.length > 0 && (
                    <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-primary rounded-full" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="mt-8">
          <h3 className="font-serif text-foreground text-lg mb-4 flex items-center gap-2">
            <span>⏰</span> Sự Kiện Sắp Tới
          </h3>

          {upcomingEvents.length === 0 ? (
            <p className="text-muted-foreground text-sm">Không có sự kiện trong tháng này</p>
          ) : (
            <div className="space-y-2">
              {upcomingEvents.map(ev => (
                <div
                  key={ev.id}
                  className="flex items-center gap-4 p-4 bg-card/50 border border-border/50 rounded-xl hover:bg-card/80 transition-colors"
                >
                  {/* Date badge */}
                  <div className="min-w-[44px] text-center bg-primary/10 border border-primary/20 rounded-lg py-2 px-1">
                    <div className="text-xl font-bold text-primary leading-none">{ev.day}</div>
                    <div className="text-[0.65rem] text-muted-foreground uppercase mt-0.5">Th{ev.month}</div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm">{ev.icon}</span>
                      <span className="text-foreground text-sm font-semibold truncate">{ev.title}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[0.78rem] text-muted-foreground flex items-center gap-1">
                        ⏰ {ev.time}
                      </span>
                      <span className="text-muted-foreground text-xs">•</span>
                      <span className={`text-[0.78rem] font-medium ${
                        ev.type === 'Live Session' ? 'text-red-400' :
                        ev.type === 'Lễ Tôn Giáo' ? 'text-amber-400' : 'text-primary'
                      }`}>
                        {ev.type}
                      </span>
                    </div>
                  </div>

                  {/* Action */}
                  {ev.community ? (
                    <button
                      onClick={() => toggleJoin(ev.id)}
                      className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold border transition-all cursor-pointer whitespace-nowrap ${
                        ev.joined
                          ? 'bg-green-500/15 border-green-500/30 text-green-400 hover:bg-green-500/20'
                          : 'bg-primary/15 border-primary/30 text-primary hover:bg-primary/25'
                      }`}
                    >
                      <Users className="w-3.5 h-3.5" />
                      <span>{ev.joined ? '✓ Đã Tham Gia' : 'Tham Gia'}</span>
                    </button>
                  ) : (
                    <span className="text-[0.75rem] text-muted-foreground">Lễ Tôn Giáo</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default PrayerCalendarTab;
