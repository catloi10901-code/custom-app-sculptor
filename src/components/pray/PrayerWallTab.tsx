import { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { Mail, X } from 'lucide-react';
import PrayerCard from './PrayerCard';
import PrayerForm from './PrayerForm';

const filterEmojis: Record<string, string> = {
  all: '🌐',
  peace: '🕊️',
  prosperity: '⭐',
  poverty: '🌿',
  healing: '💚',
  recovery: '🔄',
  family: '👨‍👩‍👧',
  nation: '🏛️',
};

const PrayerWallTab = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [activeFilter, setActiveFilter] = useState('all');
  const [prayers, setPrayers] = useState<any[]>([]);
  const [amenedPrayers, setAmenedPrayers] = useState<Set<string>>(new Set());
  const [showLetter, setShowLetter] = useState(false);
  const [loading, setLoading] = useState(true);
  const [realtimeIds, setRealtimeIds] = useState<Set<string>>(new Set());
  const prayersRef = useRef(prayers);
  prayersRef.current = prayers;
  const hoveringRef = useRef(false);

  const filters = [
    { id: 'all', label: t('filter.all') },
    { id: 'peace', label: t('topic.peace') },
    { id: 'prosperity', label: t('topic.prosperity') },
    { id: 'poverty', label: t('topic.poverty') },
    { id: 'healing', label: t('topic.healing') },
    { id: 'recovery', label: t('topic.recovery') },
    { id: 'family', label: t('topic.family') },
    { id: 'nation', label: t('topic.nation') },
  ];

  const fetchPrayers = useCallback(async () => {
    let query = supabase.from('prayers').select('*').eq('is_approved', true).order('created_at', { ascending: false }).limit(50);
    if (activeFilter !== 'all') query = query.eq('topic', activeFilter);
    const { data, error } = await query;
    if (error) console.error('Error fetching prayers:', error);
    else setPrayers(data || []);
    setLoading(false);
  }, [activeFilter]);

  const fetchUserAmens = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase.from('prayer_amens').select('prayer_id').eq('user_id', user.id);
    if (data) setAmenedPrayers(new Set(data.map(a => a.prayer_id)));
  }, [user]);

  useEffect(() => { fetchPrayers(); fetchUserAmens(); }, [fetchPrayers, fetchUserAmens]);

  // Realtime: prepend new prayers directly from payload
  useEffect(() => {
    const channel = supabase.channel('prayers-realtime')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'prayers' }, (payload) => {
        const newPrayer = payload.new as any;
        if (!newPrayer.is_approved) return;
        if (activeFilter !== 'all' && newPrayer.topic !== activeFilter) return;
        // If hovering, skip adding new prayers to avoid disruption
        if (hoveringRef.current) return;
        setRealtimeIds(prev => new Set(prev).add(newPrayer.id));
        setPrayers(prev => {
          if (prev.some(p => p.id === newPrayer.id)) return prev;
          return [newPrayer, ...prev].slice(0, 50);
        });
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'prayers' }, (payload) => {
        const updated = payload.new as any;
        setPrayers(prev => prev.map(p => p.id === updated.id ? updated : p));
      })
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'prayers' }, (payload) => {
        const deleted = payload.old as any;
        setPrayers(prev => prev.filter(p => p.id !== deleted.id));
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [activeFilter]);

  // Auto-seed prayers every ~600ms, pause on hover
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;

    const start = () => {
      if (!interval) {
        interval = setInterval(() => {
          if (hoveringRef.current) return; // Skip seed while hovering
          supabase.functions.invoke('seed-prayers').catch(() => {});
        }, 600);
      }
    };

    const stop = () => {
      if (interval) { clearInterval(interval); interval = null; }
    };

    const onVisibility = () => {
      document.hidden ? stop() : start();
    };

    if (!document.hidden) start();
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      stop();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  const toggleAmen = async (prayerId: string) => {
    if (!user) { toast.error(t('prayerWall.loginAmen')); return; }
    const hasAmened = amenedPrayers.has(prayerId);
    if (hasAmened) {
      await supabase.from('prayer_amens').delete().eq('prayer_id', prayerId).eq('user_id', user.id);
      setAmenedPrayers(prev => { const n = new Set(prev); n.delete(prayerId); return n; });
    } else {
      await supabase.from('prayer_amens').insert({ prayer_id: prayerId, user_id: user.id });
      setAmenedPrayers(prev => new Set(prev).add(prayerId));
    }
    fetchPrayers();
  };

  return (
    <section className="py-20">
      <div className="container">
        {/* Header with gradient banner */}
        <div className="relative rounded-2xl overflow-hidden mb-8 p-6 sm:p-8 bg-gradient-to-r from-primary/10 via-blue-500/5 to-purple-500/10 border border-primary/20">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-serif text-primary mb-2 text-xl sm:text-2xl">{t('prayerWall.title')}</h2>
              <p className="text-muted-foreground text-sm sm:text-base">{t('prayerWall.sub')}</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowLetter(true)}
                className="px-4 py-2.5 rounded-lg border border-primary/30 bg-primary/10 text-primary font-semibold text-sm transition-all duration-300 hover:bg-primary/20 flex items-center gap-2"
              >
                <Mail className="w-4 h-4" />
                {t('prayerWall.heartLetter')}
              </button>
              <a href="#submit-form" className="px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-bold text-sm transition-all duration-300 hover:bg-gold-light shadow-lg shadow-primary/20">
                {t('prayerWall.sendBtn')}
              </a>
            </div>
          </div>
        </div>

        {/* Tâm Thư Modal */}
        {showLetter && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" onClick={() => setShowLetter(false)}>
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
            <div
              className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-card border border-border rounded-2xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-card/95 backdrop-blur-sm border-b border-border">
                <h3 className="font-serif text-primary text-lg">📜 Tâm Thư</h3>
                <button onClick={() => setShowLetter(false)} className="p-1.5 rounded-lg hover:bg-secondary transition-colors">
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>
              <div className="px-6 py-5 space-y-4 text-foreground text-[0.9rem] leading-relaxed">
                <div className="text-muted-foreground text-sm space-y-1">
                  <p><strong className="text-foreground">GỬI:</strong> Quý Tôi Tớ Chúa và Gia Đình Cơ Đốc Nhân Trên Khắp Thế Giới</p>
                  <p><strong className="text-foreground">TỪ:</strong> Abraham Nguyễn Quang Huy (Dubai, UAE) – 9S UNION</p>
                  <p><strong className="text-foreground">NGÀY:</strong> Chúa Nhật, 01/03/2026</p>
                </div>

                <div className="border-t border-border pt-4">
                  <p>Thưa anh chị em yêu dấu trong Đấng Christ, 🤍🔥</p>
                  <p className="mt-3">Tôi viết những dòng này từ Dubai - nơi đêm qua, bầu trời như bị xé toạc bởi những vệt sáng tên lửa, và tiếng còi báo động vang lên thay cho sự bình yên. Trong khoảnh khắc ấy, Lời Chúa vang dội trong tâm linh tôi: <em>"Dân này sẽ dấy lên nghịch cùng dân khác, nước nọ nghịch cùng nước kia"</em> (Ma-thi-ơ 24:7).</p>
                  <p className="mt-3">Cuộc xung đột bùng nổ ngày 28/02/2026 giữa Iran, Israel và Hoa Kỳ không chỉ là một biến động địa-chính trị. Với Hội Thánh của Đức Chúa Trời, đây là một tiếng chuông cảnh tỉnh thuộc linh - những "cơn đau chuyển dạ" (Ma-thi-ơ 24:8), nhắc chúng ta rằng thời kỳ sau rốt đang hiển hiện ngay trước mắt.</p>
                  <p className="mt-3">Nhưng, anh chị em ơi, Chúa Giê-su đã phán: <em>"Hãy giữ mình, đừng bối rối"</em> (Ma-thi-ơ 24:6).</p>
                  <p className="mt-3 font-semibold">Sự hoảng loạn thuộc về thế gian. Còn SỰ TỈNH THỨC, SỰ HIỆP MỘT, VÀ CẦU THAY thuộc về con cái Chúa. 🙏</p>
                </div>

                <div className="bg-primary/[0.06] border border-primary/20 rounded-xl p-4">
                  <h4 className="font-serif text-primary text-lg mb-2">CHIẾN DỊCH 72 GIỜ HIỆP NGUYỆN KHẨN CẤP</h4>
                  <p className="font-semibold text-primary text-sm">CẦU NGUYỆN – NGỢI KHEN – THỜ PHƯỢNG LIÊN TỤC</p>
                </div>

                <div>
                  <h4 className="font-semibold text-primary mb-2">1) CẦU NGUYỆN CHO ISRAEL & TRUNG ĐÔNG 🕊</h4>
                  <p>Lạy Chúa, xin thương xót và che chở dân sự Ngài. Xin Chúa tể trị trên Trung Đông - chiếc nôi của đức tin - nơi đang oằn mình trong khói lửa. Xin dập tắt bạo lực, chặn đứng sự hủy diệt, bẻ gãy mọi mưu kế tối tăm, và giải cứu những người vô tội. Xin bình an của Chúa - shalom - phủ lấp mọi vùng đất đang run rẩy.</p>
                </div>

                <div>
                  <h4 className="font-semibold text-primary mb-2">2) CẦU NGUYỆN CHO LÃNH ĐẠO CÁC QUỐC GIA 👑</h4>
                  <p>Kinh Thánh dạy chúng ta cầu thay cho người cầm quyền để xã hội được yên ổn (I Ti-mô-thê 2:1–2). Giờ này, chúng ta không đứng trong tranh cãi, nhưng đứng trong cầu thay.</p>
                  <ul className="list-disc pl-5 mt-2 space-y-1 text-[0.85rem]">
                    <li>Đặc biệt cho Tổng thống Donald Trump và Chính phủ Hoa Kỳ: xin Chúa ban sự khôn ngoan siêu nhiên, lòng khiêm nhu, và tinh thần công bình.</li>
                    <li>Cho lãnh đạo Israel: xin Chúa ban sự tỉnh thức, lòng kính sợ Đức Chúa Trời.</li>
                    <li>Cho lãnh đạo các quốc gia Hồi giáo, đặc biệt Iran: xin Chúa chạm đến tấm lòng họ, thay thế hận thù bằng khát vọng hòa bình.</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-primary mb-2">3) THẮP LẠI TÌNH YÊU THƯƠNG – ĐÁNH THỨC LÒNG NGƯỜI 🤍</h4>
                  <p>Xin Chúa phá vỡ sự vô cảm, ích kỷ, thù hận đang bao phủ nhân loại. Xin Tình Yêu Agape tuôn tràn như dòng sông chữa lành - chữa lành gia đình, cộng đồng, dân tộc và các quốc gia.</p>
                </div>

                <div className="bg-primary/[0.06] border border-primary/20 rounded-xl p-4 italic text-sm">
                  <p>"Nếu dân Ta… hạ mình xuống, cầu nguyện, tìm kiếm mặt Ta và trở lại bỏ con đường tà, thì Ta ở trên trời sẽ nghe, tha thứ tội chúng nó và cứu xứ họ khỏi tai vạ."</p>
                  <p className="text-primary font-semibold mt-1 not-italic">— 2 Sử-ký 7:14</p>
                </div>

                <div className="space-y-2">
                  <p className="font-semibold">Anh chị em yêu dấu, giờ này không phải lúc để ngủ mê.</p>
                  <p>Hãy biến ngôi nhà của anh chị em thành bàn Thờ - Thờ phượng Đức Chúa Trời.</p>
                  <p>Hãy biến Hội Thánh của anh chị em thành pháo đài cầu thay.</p>
                  <p className="font-semibold text-primary">Hãy để Lời Ngợi Khen Chúa lấn át tiếng bom đạn, làm rung chuyển thế giới bằng lời Ngợi khen chứ không phải tên lửa và đạn pháo. 🔥</p>
                </div>

                <div className="border-t border-border pt-4 space-y-2">
                  <p>Nguyện xin Đức Chúa Cha thương xót thế giới này.</p>
                  <p>Nguyện xin Chúa Giê-su Christ gìn giữ chúng ta trong sự bình an trọn vẹn.</p>
                  <p>Nguyện xin Đức Thánh Linh dẫn dắt chúng ta trong từng lời cầu nguyện.</p>
                  <p className="font-semibold mt-3">Hết lòng vì Vương Quốc Chúa,</p>
                  <p className="text-primary font-semibold">Hallelujah! Amen. 🙌🕊</p>
                  <p className="text-muted-foreground text-sm mt-2">Abraham Nguyễn Quang Huy – Đồng Chủ tịch 9S UNION<br/>(Kêu gọi từ tâm bão Dubai – UAE, ngày 01/03/2026)</p>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Filter pills with emojis */}
        <div className="flex gap-2 flex-wrap mb-6 overflow-x-auto pb-1">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className={`px-4 py-1.5 rounded-full border text-[0.85rem] font-semibold cursor-pointer transition-all duration-300 flex items-center gap-1.5 ${
                activeFilter === f.id
                  ? 'bg-gold-dim border-primary text-primary shadow-md shadow-primary/15'
                  : 'border-border bg-transparent text-muted-foreground hover:bg-gold-dim hover:border-primary hover:text-primary'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-16 text-muted-foreground">{t('prayerWall.loading')}</div>
        ) : prayers.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-2xl mb-2">🙏</p>
            <p>{t('prayerWall.empty')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
            {prayers.map((prayer, i) => (
              <PrayerCard
                key={prayer.id}
                prayer={prayer}
                index={i}
                hasAmened={amenedPrayers.has(prayer.id)}
                onToggleAmen={toggleAmen}
                isRealtime={realtimeIds.has(prayer.id)}
                onMouseEnter={() => { hoveringRef.current = true; }}
                onMouseLeave={() => { hoveringRef.current = false; }}
              />
            ))}
          </div>
        )}

        <PrayerForm onSuccess={fetchPrayers} />
      </div>
    </section>
  );
};

export default PrayerWallTab;
