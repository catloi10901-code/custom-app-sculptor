import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import qrBtc from '@/assets/qr-btc.jpg';
import qrTrx from '@/assets/qr-trx.jpg';
import qrEth from '@/assets/qr-eth.jpg';

const presetAmounts = [10, 25, 50, 100, 250, 500, 1000];

const cryptoCoins = [
  { name: 'Bitcoin', symbol: 'BTC', color: '#f7931a', address: 'bc1q2jd8m2qjqf3ev30esz25hrfsgv3c32qwcuskku', qr: qrBtc },
  { name: 'Tron', symbol: 'TRX', color: '#eb0029', address: 'TFXkfjnW7X4cdsRTAgEnmBk1zQGTi3TkNY', qr: qrTrx },
  { name: 'Ethereum', symbol: 'ETH', color: '#627eea', address: '0x3BBA2a672324D9B3901E882CD559d46dC76A8B7d', qr: qrEth },
];

const GivePage = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [selectedAmount, setSelectedAmount] = useState<number | null>(50);
  const [customAmount, setCustomAmount] = useState('');
  const [paymentTab, setPaymentTab] = useState<'crypto'>('crypto');
  const [selectedCoin, setSelectedCoin] = useState(0);
  const [isRecurring, setIsRecurring] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const amount = customAmount ? Number(customAmount) : selectedAmount;

  const allocations = [
    { label: t('give.alloc.humanitarian'), pct: 45, color: '#e8c87a' },
    { label: t('give.alloc.education'), pct: 25, color: '#6ee7b7' },
    { label: t('give.alloc.peace'), pct: 20, color: '#60a5fa' },
    { label: t('give.alloc.operations'), pct: 10, color: '#a78bfa' },
  ];

  const handleDonate = async () => {
    if (!amount || amount <= 0) {
      toast.error(t('give.invalidAmount'));
      return;
    }
    if (!user) {
      toast.error(t('give.loginRequired'));
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.from('donations').insert({
      user_id: user.id,
      amount,
      currency: 'USD',
      is_recurring: isRecurring,
      payment_method: paymentTab,
      allocation: { humanitarian: 45, education: 25, peace: 20, operations: 10 },
      status: 'completed',
    });

    if (error) {
      console.error(error);
      toast.error(t('give.error'));
    } else {
      toast.success(t('give.thanks', { amount }));
      setSelectedAmount(50);
      setCustomAmount('');
    }
    setSubmitting(false);
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(cryptoCoins[selectedCoin].address);
    toast.success(t('give.copied'));
  };

  return (
    <div>
      <section className="py-10 sm:py-20 text-center px-4" style={{ background: 'linear-gradient(180deg, rgba(197,160,89,0.06) 0%, transparent 100%)' }}>
        <div className="container max-w-[700px]">
          <h1 className="font-serif text-primary mb-3 sm:mb-4 text-xl sm:text-2xl md:text-4xl">{t('give.title')}</h1>
          <p className="text-muted-foreground text-sm sm:text-base md:text-lg">{t('give.sub')}</p>
        </div>
      </section>

      <section className="py-8 sm:py-12">
        <div className="container">
          <div className="max-w-[560px] mx-auto bg-card border border-border rounded-2xl p-4 sm:p-5 md:p-9">
            <h3 className="font-serif text-primary mb-3 sm:mb-4 text-base sm:text-lg">{t('give.chooseAmount')}</h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-2.5 mb-4 sm:mb-5">
              {presetAmounts.map((amt) => (
                <button
                  key={amt}
                  onClick={() => { setSelectedAmount(amt); setCustomAmount(''); }}
                  className={`py-2.5 sm:py-3 border-[1.5px] rounded-lg text-xs sm:text-sm md:text-base font-bold cursor-pointer transition-all duration-300 ${
                    selectedAmount === amt && !customAmount
                      ? 'border-primary text-primary bg-gold-dim'
                      : 'border-border text-foreground bg-transparent hover:border-primary hover:text-primary hover:bg-gold-dim'
                  }`}
                >
                  ${amt}
                </button>
              ))}
              <input
                type="number"
                placeholder={t('give.other')}
                value={customAmount}
                onChange={(e) => { setCustomAmount(e.target.value); setSelectedAmount(null); }}
                className="py-2.5 sm:py-3 px-2 sm:px-3 border-[1.5px] border-border rounded-lg bg-transparent text-foreground text-xs sm:text-sm md:text-base font-bold text-center focus:outline-none focus:border-primary col-span-3 sm:col-span-1"
              />
            </div>

            <div className="flex items-center gap-2.5 p-2.5 sm:p-3 bg-white/[0.04] border border-white/[0.08] rounded-xl mb-4 sm:mb-5">
              <label className="relative w-10 h-[22px] cursor-pointer">
                <input type="checkbox" checked={isRecurring} onChange={() => setIsRecurring(!isRecurring)} className="opacity-0 w-0 h-0 peer" />
                <span className="absolute inset-0 rounded-full bg-white/15 transition-all duration-300 peer-checked:bg-primary before:content-[''] before:absolute before:h-4 before:w-4 before:left-[3px] before:bottom-[3px] before:bg-white before:rounded-full before:transition-all before:duration-300 peer-checked:before:translate-x-[18px]" />
              </label>
              <span className="text-[0.8rem] sm:text-[0.85rem] text-muted-foreground">{t('give.monthly')}</span>
            </div>

            <h4 className="font-serif text-primary mb-2 sm:mb-3 text-xs sm:text-sm">{t('give.allocation')}</h4>
            <div className="space-y-2.5 sm:space-y-3 mb-5 sm:mb-6">
              {allocations.map((a, i) => (
                <div key={i}>
                  <div className="flex justify-between text-[0.78rem] sm:text-[0.85rem] mb-1">
                    <span className="text-muted-foreground">{a.label}</span>
                    <span className="text-primary font-bold">{a.pct}%</span>
                  </div>
                  <div className="h-2 sm:h-2.5 bg-black/30 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${a.pct}%`, background: a.color, transition: 'width 0.6s ease' }} />
                  </div>
                </div>
              ))}
            </div>

            <h3 className="font-serif text-primary mb-3 sm:mb-4 text-xs sm:text-sm">₿ {t('give.crypto')}</h3>
            <div>
              <div className="flex gap-1 sm:gap-2 mb-3 sm:mb-4">
                {cryptoCoins.map((coin, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedCoin(i)}
                    className={`flex-1 py-1.5 sm:py-2 rounded-lg text-[0.68rem] sm:text-[0.85rem] font-bold cursor-pointer transition-all border-[1.5px] flex items-center justify-center gap-1 sm:gap-1.5 ${
                      selectedCoin === i ? 'border-primary text-primary bg-gold-dim' : 'border-white/10 bg-white/[0.04] text-muted-foreground'
                    }`}
                  >
                    <span className="w-4 h-4 sm:w-5 sm:h-5 md:w-[26px] md:h-[26px] rounded-full text-white text-[0.6rem] sm:text-[0.7rem] md:text-[0.8rem] font-bold inline-flex items-center justify-center flex-shrink-0" style={{ background: coin.color }}>
                      {coin.symbol[0]}
                    </span>
                    <span className="truncate">{coin.symbol}</span>
                  </button>
                ))}
              </div>

              <div className="relative w-[160px] h-[160px] sm:w-[200px] sm:h-[200px] md:w-[240px] md:h-[240px] mx-auto mb-3 sm:mb-4 rounded-[14px] overflow-hidden border-2 border-border bg-white flex items-center justify-center shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
                <img src={cryptoCoins[selectedCoin].qr} alt={`${cryptoCoins[selectedCoin].name} QR`} className="w-full h-full object-contain p-1.5 sm:p-2" />
              </div>

              <div className="text-center text-[0.85rem] sm:text-[0.95rem] font-bold text-foreground mb-2 sm:mb-3 flex items-center justify-center gap-2">
                <span className="w-5 h-5 sm:w-[26px] sm:h-[26px] rounded-full text-white text-[0.7rem] sm:text-[0.8rem] font-bold inline-flex items-center justify-center" style={{ background: cryptoCoins[selectedCoin].color }}>
                  {cryptoCoins[selectedCoin].symbol[0]}
                </span>
                {cryptoCoins[selectedCoin].name}
              </div>
              <div className="bg-black/30 border border-white/[0.08] rounded-lg px-2.5 sm:px-3.5 py-2 sm:py-2.5 text-[0.62rem] sm:text-[0.72rem] text-muted-foreground text-center break-all leading-relaxed mb-2 sm:mb-2.5 font-mono select-all cursor-text">
                {cryptoCoins[selectedCoin].address}
              </div>
              <button
                onClick={copyAddress}
                className="w-full py-2 sm:py-2.5 rounded-lg border-[1.5px] border-primary/30 bg-primary/[0.08] text-primary text-[0.78rem] sm:text-[0.84rem] font-semibold cursor-pointer transition-all duration-300 hover:bg-primary/20 hover:border-primary"
              >
                {t('give.copyAddress')}
              </button>
            </div>

            <div className="flex gap-1.5 sm:gap-2 md:gap-3 items-center justify-center mt-4 sm:mt-5 flex-wrap">
              {['🔒 SSL', '🛡 PCI', '✦ 100% Impact'].map((badge, i) => (
                <span key={i} className="flex items-center gap-1 text-[0.65rem] sm:text-[0.72rem] md:text-[0.78rem] text-muted-foreground bg-black/20 px-1.5 sm:px-2 md:px-3 py-1 sm:py-1.5 rounded-md border border-border">
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default GivePage;
