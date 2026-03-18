import { Link } from 'react-router-dom';
import SEOHead from '@/components/layout/SEOHead';

const TermsPage = () => {
  return (
    <div>
      <SEOHead title="Điều Khoản Sử Dụng - HOLYPray" description="Điều khoản sử dụng nền tảng HOLYPray." />
      <section className="py-16" style={{ background: 'linear-gradient(180deg, rgba(197,160,89,0.06) 0%, transparent 100%)' }}>
        <div className="container max-w-[800px]">
          <h1 className="font-serif text-primary text-center mb-2">Điều Khoản Sử Dụng</h1>
          <p className="text-center text-muted-foreground mb-10">Cập nhật lần cuối: 18/03/2026</p>

          <div className="prose prose-lg max-w-none text-muted-foreground space-y-6">
            <section>
              <h2 className="font-serif text-foreground text-xl mb-3">1. Chấp nhận điều khoản</h2>
              <p>Bằng việc truy cập và sử dụng HOLYPray, bạn đồng ý tuân thủ các điều khoản này. Nếu không đồng ý, vui lòng ngừng sử dụng nền tảng.</p>
            </section>

            <section>
              <h2 className="font-serif text-foreground text-xl mb-3">2. Tài khoản người dùng</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>Bạn phải cung cấp thông tin chính xác khi đăng ký</li>
                <li>Bạn chịu trách nhiệm bảo mật tài khoản của mình</li>
                <li>Mỗi người chỉ được sở hữu một tài khoản</li>
                <li>Tài khoản không được chuyển nhượng</li>
              </ul>
            </section>

            <section>
              <h2 className="font-serif text-foreground text-xl mb-3">3. Nội dung người dùng</h2>
              <p>Khi đăng nội dung lên HOLYPray, bạn cam kết:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Nội dung không vi phạm pháp luật hoặc quyền của người khác</li>
                <li>Không đăng nội dung thù hận, bạo lực, hoặc phản cảm</li>
                <li>Không spam hoặc quảng cáo trái phép</li>
                <li>Tôn trọng tất cả tín ngưỡng và quan điểm tôn giáo</li>
              </ul>
            </section>

            <section>
              <h2 className="font-serif text-foreground text-xl mb-3">4. Quyên góp</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>Mọi khoản quyên góp là tự nguyện và không hoàn lại</li>
                <li>HOLYPray cam kết sử dụng quỹ đúng mục đích đã công bố</li>
                <li>Báo cáo tài chính được công khai định kỳ</li>
              </ul>
            </section>

            <section>
              <h2 className="font-serif text-foreground text-xl mb-3">5. Quyền sở hữu trí tuệ</h2>
              <p>Tất cả nội dung, thiết kế, logo và thương hiệu HOLYPray thuộc quyền sở hữu của chúng tôi. Bạn không được sao chép, phân phối hoặc sử dụng cho mục đích thương mại mà không có sự đồng ý.</p>
            </section>

            <section>
              <h2 className="font-serif text-foreground text-xl mb-3">6. Giới hạn trách nhiệm</h2>
              <p>HOLYPray cung cấp nền tảng "nguyên trạng" và không đảm bảo tính liên tục, chính xác tuyệt đối của dịch vụ. Chúng tôi không chịu trách nhiệm cho thiệt hại gián tiếp phát sinh từ việc sử dụng nền tảng.</p>
            </section>

            <section>
              <h2 className="font-serif text-foreground text-xl mb-3">7. Thay đổi điều khoản</h2>
              <p>Chúng tôi có quyền cập nhật điều khoản bất kỳ lúc nào. Thay đổi quan trọng sẽ được thông báo qua email hoặc trên nền tảng.</p>
            </section>

            <section>
              <h2 className="font-serif text-foreground text-xl mb-3">8. Liên hệ</h2>
              <p>Mọi thắc mắc về điều khoản, vui lòng liên hệ: <a href="mailto:legal@holypray.org" className="text-primary hover:underline">legal@holypray.org</a></p>
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

export default TermsPage;
