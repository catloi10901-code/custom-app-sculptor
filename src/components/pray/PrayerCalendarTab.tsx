import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const daysOfWeek = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

const PrayerCalendarTab = () => {
  const { t } = useTranslation();
  const [currentMonth] = useState(new Date(2026, 2));
  const today = 11;

  const events = [
    { day: 11, title: t('liveSessions.peaceTitle'), type: 'live' },
    { day: 14, title: t('community.badgePrayer'), type: 'community' },
    { day: 18, title: t('liveSessions.worshipTitle'), type: 'prayer' },
    { day: 22, title: t('liveSessions.globalTitle'), type: 'live' },
    { day: 25, title: t('liveSessions.healingTitle'), type: 'prayer' },
    { day: 28, title: t('liveSessions.worshipTitle'), type: 'community' },
  ];

  const upcomingEvents = [
    { day: '14', month: 'MAR', title: t('community.badgePrayer'), meta: '20:00 GMT+7 • Zoom', joined: false },
    { day: '18', month: 'MAR', title: t('liveSessions.worshipTitle'), meta: '19:00 GMT+7 • YouTube Live', joined: true },
    { day: '22', month: 'MAR', title: t('liveSessions.globalTitle'), meta: '47 nations', joined: false },
    { day: '25', month: 'MAR', title: t('liveSessions.healingTitle'), meta: '14:00 GMT+7 • UNPray Live', joined: false },
  ];

  const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();

  const calDays: { day: number; isCurrentMonth: boolean }[] = [];
  const prevMonthDays = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 0).getDate();
  for (let i = firstDay - 1; i >= 0; i--) calDays.push({ day: prevMonthDays - i, isCurrentMonth: false });
  for (let d = 1; d <= daysInMonth; d++) calDays.push({ day: d, isCurrentMonth: true });
  while (calDays.length % 7 !== 0) calDays.push({ day: calDays.length - firstDay - daysInMonth + 1, isCurrentMonth: false });

  return (
    <section className="py-20">
      <div className="container max-w-[900px]">
        <div className="flex items-center justify-between mb-5">
          <button className="bg-white/[0.08] border border-border text-foreground rounded-lg px-4 py-2 cursor-pointer text-sm hover:bg-secondary">{t('calendar.prev')}</button>
          <h3 className="font-serif text-white text-xl">{t('calendar.month')}</h3>
          <button className="bg-white/[0.08] border border-border text-foreground rounded-lg px-4 py-2 cursor-pointer text-sm hover:bg-secondary">{t('calendar.next')}</button>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-8">
          {daysOfWeek.map((d) => (
            <div key={d} className="text-center text-[0.75rem] font-semibold text-muted-foreground py-2 uppercase tracking-wider">{d}</div>
          ))}
          {calDays.map((cell, i) => {
            const event = cell.isCurrentMonth ? events.find(e => e.day === cell.day) : undefined;
            const isToday = cell.isCurrentMonth && cell.day === today;
            return (
              <div key={i} className={`min-h-[70px] bg-white/[0.04] border border-white/[0.06] rounded-lg p-1.5 cursor-pointer transition-all duration-300 relative hover:bg-white/[0.09] hover:border-border ${isToday ? 'border-primary bg-gold-dim' : ''} ${!cell.isCurrentMonth ? 'opacity-30' : ''}`}>
                <span className={`text-[0.8rem] font-semibold ${isToday ? 'text-primary' : 'text-foreground'}`}>{cell.day}</span>
                {event && (
                  <div className={`text-[0.65rem] rounded px-1 py-0.5 mt-1 whitespace-nowrap overflow-hidden text-ellipsis ${event.type === 'live' ? 'bg-red-500/25 text-red-300' : event.type === 'community' ? 'bg-blue-500/35 text-blue-300' : 'bg-primary/25 text-primary'}`}>
                    {event.title}
                  </div>
                )}
                {event && <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-primary rounded-full" />}
              </div>
            );
          })}
        </div>

        <h3 className="font-serif text-white text-lg mb-3.5">{t('calendar.upcoming')}</h3>
        <div className="flex flex-col gap-2">
          {upcomingEvents.map((ev, i) => (
            <div key={i} className="flex items-center gap-3.5 px-4 py-3 bg-white/[0.04] border border-white/[0.07] rounded-xl transition-all duration-300 hover:bg-white/[0.07]">
              <div className="min-w-[44px] text-center bg-gold-dim border border-border rounded-lg py-1.5 px-1">
                <div className="text-xl font-bold text-primary leading-none">{ev.day}</div>
                <div className="text-[0.65rem] text-muted-foreground uppercase">{ev.month}</div>
              </div>
              <div className="flex-1">
                <div className="font-semibold text-foreground text-[0.9rem]">{ev.title}</div>
                <div className="text-[0.78rem] text-muted-foreground mt-0.5">{ev.meta}</div>
              </div>
              <button className={`rounded-md px-3.5 py-1.5 text-[0.8rem] font-semibold cursor-pointer transition-all duration-300 whitespace-nowrap ${ev.joined ? 'bg-green-500/40 text-green-300' : 'bg-secondary text-white hover:bg-primary hover:text-primary-foreground'}`}>
                {ev.joined ? t('calendar.joined') : t('calendar.join')}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PrayerCalendarTab;