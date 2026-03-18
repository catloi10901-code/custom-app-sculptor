import { Link } from 'react-router-dom';
import { SEOHead } from '@/components/layout/SEOHead';

const GDPRPage = () => {
  return (
    <div>
      <SEOHead title="GDPR - HOLYPray" description="Cam kết tuân thủ GDPR của HOLYPray." />
      <section className="py-16" style={{ background: 'linear-gradient(180deg, rgba(197,160,89,0.06) 0%, transparent 100%)' }}>
        <div className="container max-w-[800px]">
          <h1 className="font-serif text-primary text-center mb-2">Tuân Thủ GDPR</h1>
          <p className="text-center text-muted-foreground mb-10">General Data Protection Regulation</p>

          <div className="prose prose-lg max-w-none text-muted-foreground space-y-6">
            <section>
              <h2 className="font-serif text-foreground text-xl mb-3">1. Cam kết của HOLYPray</h2>
              <p>HOLYPray tuân thủ Quy định Bảo vệ Dữ liệu Chung (GDPR) của Liên minh Châu Âu, đảm bảo quyền riêng tư và bảo vệ dữ liệu cho tất cả người dùng trên toàn cầu.</p>
            </section>

            <section>
              <h2 className="font-serif text-foreground text-xl mb-3">2. Quyền của bạn theo GDPR</h2>
              <div className="space-y-3">
                {[
                  { icon: '📋', title: 'Quyền truy cập', desc: 'Bạn có quyền yêu cầu bản sao dữ liệu cá nhân chúng tôi lưu giữ.' },
                  { icon: '✏️', title: 'Quyền chỉnh sửa', desc: 'Bạn có quyền yêu cầu sửa đổi thông tin không chính xác.' },
                  { icon: '🗑️', title: 'Quyền xóa ("Quyền được quên")', desc: 'Bạn có quyền yêu cầu xóa toàn bộ dữ liệu cá nhân.' },
                  { icon: '📦', title: 'Quyền di chuyển dữ liệu', desc: 'Bạn có quyền nhận dữ liệu ở định dạng máy đọc được.' },
                  { icon: '🚫', title: 'Quyền phản đối', desc: 'Bạn có quyền phản đối việc xử lý dữ liệu cho mục đích cụ thể.' },
                  { icon: '⏸️', title: 'Quyền hạn chế xử lý', desc: 'Bạn có quyền yêu cầu tạm dừng xử lý dữ liệu.' },
                ].map((item, i) => (
                  <div key={i} className="bg-card border border-border rounded-xl p-4 flex gap-3">
                    <span className="text-2xl flex-shrink-0">{item.icon}</span>
                    <div>
                      <h4 className="text-foreground font-semibold text-sm">{item.title}</h4>
                      <p className="text-sm mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="font-serif text-foreground text-xl mb-3">3. Cơ sở pháp lý cho xử lý dữ liệu</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong className="text-foreground">Đồng ý:</strong> Khi bạn đăng ký tài khoản hoặc đăng ký nhận bản tin</li>
                <li><strong className="text-foreground">Thực hiện hợp đồng:</strong> Để cung cấp dịch vụ bạn yêu cầu</li>
                <li><strong className="text-foreground">Lợi ích hợp pháp:</strong> Cải thiện và bảo mật nền tảng</li>
                <li><strong className="text-foreground">Nghĩa vụ pháp lý:</strong> Tuân thủ luật pháp áp dụng</li>
              </ul>
            </section>

            <section>
              <h2 className="font-serif text-foreground text-xl mb-3">4. Chuyển dữ liệu quốc tế</h2>
              <p>Dữ liệu có thể được xử lý tại các máy chủ ngoài EU/EEA. Trong trường hợp này, chúng tôi đảm bảo các biện pháp bảo vệ phù hợp theo Điều 46 GDPR.</p>
            </section>

            <section>
              <h2 className="font-serif text-foreground text-xl mb-3">5. Thời gian lưu trữ</h2>
              <p>Dữ liệu cá nhân được lưu trữ trong thời gian cần thiết cho mục đích thu thập, hoặc theo yêu cầu pháp luật. Dữ liệu tài khoản bị xóa trong vòng 30 ngày sau khi yêu cầu xóa.</p>
            </section>

            <section>
              <h2 className="font-serif text-foreground text-xl mb-3">6. Nhân viên Bảo vệ Dữ liệu (DPO)</h2>
              <p>Liên hệ DPO: <a href="mailto:dpo@holypray.org" className="text-primary hover:underline">dpo@holypray.org</a></p>
              <p className="mt-2">Bạn cũng có quyền khiếu nại với cơ quan giám sát bảo vệ dữ liệu tại quốc gia của mình.</p>
            </section>
          </div>

          <div className="mt-10 text-center">
            <Link to="/" className="text-primary hover:underline text-sm">← Về trang chủ</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default GDPRPage;
