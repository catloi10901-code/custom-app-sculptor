import { Link } from 'react-router-dom';
import { SEOHead } from '@/components/layout/SEOHead';

const CookiePolicyPage = () => {
  return (
    <div>
      <SEOHead title="Chính Sách Cookie - HOLYPray" description="Chính sách cookie của HOLYPray." />
      <section className="py-16" style={{ background: 'linear-gradient(180deg, rgba(197,160,89,0.06) 0%, transparent 100%)' }}>
        <div className="container max-w-[800px]">
          <h1 className="font-serif text-primary text-center mb-2">Chính Sách Cookie</h1>
          <p className="text-center text-muted-foreground mb-10">Cập nhật lần cuối: 18/03/2026</p>

          <div className="prose prose-lg max-w-none text-muted-foreground space-y-6">
            <section>
              <h2 className="font-serif text-foreground text-xl mb-3">1. Cookie là gì?</h2>
              <p>Cookie là các tệp văn bản nhỏ được lưu trữ trên thiết bị của bạn khi truy cập website. Chúng giúp website ghi nhớ tùy chọn của bạn và cải thiện trải nghiệm duyệt web.</p>
            </section>

            <section>
              <h2 className="font-serif text-foreground text-xl mb-3">2. Các loại cookie chúng tôi sử dụng</h2>
              <div className="space-y-4">
                <div className="bg-card border border-border rounded-xl p-4">
                  <h4 className="text-foreground font-semibold mb-1">🔧 Cookie cần thiết</h4>
                  <p className="text-sm">Bắt buộc để website hoạt động: xác thực đăng nhập, bảo mật phiên, ngôn ngữ.</p>
                </div>
                <div className="bg-card border border-border rounded-xl p-4">
                  <h4 className="text-foreground font-semibold mb-1">📊 Cookie phân tích</h4>
                  <p className="text-sm">Thu thập thông tin ẩn danh về cách sử dụng website để cải thiện dịch vụ.</p>
                </div>
                <div className="bg-card border border-border rounded-xl p-4">
                  <h4 className="text-foreground font-semibold mb-1">⚙️ Cookie chức năng</h4>
                  <p className="text-sm">Ghi nhớ tùy chọn ngôn ngữ, chế độ giao diện (sáng/tối), và cài đặt cá nhân.</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="font-serif text-foreground text-xl mb-3">3. Quản lý cookie</h2>
              <p>Bạn có thể kiểm soát cookie thông qua cài đặt trình duyệt. Lưu ý rằng việc tắt cookie cần thiết có thể ảnh hưởng đến chức năng của website.</p>
              <ul className="list-disc pl-5 space-y-2 mt-3">
                <li><strong className="text-foreground">Chrome:</strong> Cài đặt → Quyền riêng tư và bảo mật → Cookie</li>
                <li><strong className="text-foreground">Firefox:</strong> Tùy chọn → Quyền riêng tư & Bảo mật</li>
                <li><strong className="text-foreground">Safari:</strong> Tùy chọn → Quyền riêng tư</li>
              </ul>
            </section>

            <section>
              <h2 className="font-serif text-foreground text-xl mb-3">4. Cookie bên thứ ba</h2>
              <p>Chúng tôi không sử dụng cookie quảng cáo. Một số cookie bên thứ ba có thể được sử dụng cho mục đích phân tích (ẩn danh) và xử lý thanh toán an toàn.</p>
            </section>

            <section>
              <h2 className="font-serif text-foreground text-xl mb-3">5. Liên hệ</h2>
              <p>Câu hỏi về cookie? Liên hệ: <a href="mailto:privacy@holypray.org" className="text-primary hover:underline">privacy@holypray.org</a></p>
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

export default CookiePolicyPage;
