import SEOHead from "@/components/layout/SEOHead";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const PrivacyPolicyPage = () => {
  const { t } = useTranslation();

  return (
    <div>
      <SEOHead title="Chính Sách Bảo Mật - HOLYPray" description="Chính sách bảo mật của HOLYPray - cam kết bảo vệ dữ liệu cá nhân của bạn." />
      <section className="py-16" style={{ background: "linear-gradient(180deg, rgba(197,160,89,0.06) 0%, transparent 100%)" }}>
        <div className="container max-w-[800px]">
          <h1 className="font-serif text-primary text-center mb-2">Chính Sách Bảo Mật</h1>
          <p className="text-center text-muted-foreground mb-10">Cập nhật lần cuối: 18/03/2026</p>

          <div className="prose prose-lg max-w-none text-muted-foreground space-y-6">
            <section>
              <h2 className="font-serif text-foreground text-xl mb-3">1. Giới thiệu</h2>
              <p>
                HOLYPray ("chúng tôi") cam kết bảo vệ quyền riêng tư và dữ liệu cá nhân của bạn. Chính sách này mô tả cách chúng tôi thu thập, sử dụng, lưu trữ và bảo vệ thông tin khi bạn sử dụng nền
                tảng HOLYPray.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-foreground text-xl mb-3">2. Thông tin chúng tôi thu thập</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong className="text-foreground">Thông tin tài khoản:</strong> Tên, email, mật khẩu (đã mã hóa), quốc gia, ảnh đại diện.
                </li>
                <li>
                  <strong className="text-foreground">Nội dung người dùng:</strong> Lời cầu nguyện, bình luận, tin tức, lời chứng.
                </li>
                <li>
                  <strong className="text-foreground">Dữ liệu sử dụng:</strong> Lượt truy cập, thời gian, thiết bị, trình duyệt, địa chỉ IP.
                </li>
                <li>
                  <strong className="text-foreground">Thông tin quyên góp:</strong> Số tiền, phương thức thanh toán (không lưu thông tin thẻ).
                </li>
              </ul>
            </section>

            <section>
              <h2 className="font-serif text-foreground text-xl mb-3">3. Mục đích sử dụng</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>Cung cấp và cải thiện dịch vụ nền tảng</li>
                <li>Gửi thông báo, cập nhật và bản tin (nếu đăng ký)</li>
                <li>Phân tích xu hướng sử dụng để nâng cao trải nghiệm</li>
                <li>Bảo mật tài khoản và ngăn chặn gian lận</li>
                <li>Tuân thủ nghĩa vụ pháp lý</li>
              </ul>
            </section>

            <section>
              <h2 className="font-serif text-foreground text-xl mb-3">4. Chia sẻ thông tin</h2>
              <p>
                Chúng tôi <strong className="text-foreground">không bán</strong> dữ liệu cá nhân cho bên thứ ba. Thông tin chỉ được chia sẻ trong các trường hợp:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Với sự đồng ý rõ ràng của bạn</li>
                <li>Với đối tác xử lý thanh toán (chỉ dữ liệu cần thiết)</li>
                <li>Khi có yêu cầu từ cơ quan pháp luật</li>
              </ul>
            </section>

            <section>
              <h2 className="font-serif text-foreground text-xl mb-3">5. Bảo mật dữ liệu</h2>
              <p>
                Chúng tôi sử dụng mã hóa SSL/TLS, mã hóa mật khẩu bcrypt, và các biện pháp bảo mật cấp doanh nghiệp để bảo vệ dữ liệu của bạn. Truy cập dữ liệu được giới hạn nghiêm ngặt theo nguyên
                tắc "cần biết".
              </p>
            </section>

            <section>
              <h2 className="font-serif text-foreground text-xl mb-3">6. Quyền của bạn</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>Truy cập và tải xuống dữ liệu cá nhân</li>
                <li>Chỉnh sửa hoặc cập nhật thông tin</li>
                <li>Yêu cầu xóa tài khoản và dữ liệu</li>
                <li>Hủy đăng ký nhận bản tin</li>
                <li>Phản đối việc xử lý dữ liệu</li>
              </ul>
            </section>

            <section>
              <h2 className="font-serif text-foreground text-xl mb-3">7. Liên hệ</h2>
              <p>
                Nếu có câu hỏi về chính sách bảo mật, vui lòng liên hệ:{" "}
                <a href="mailto:privacy@holypray.org" className="text-primary hover:underline">
                  privacy@holypray.org
                </a>
              </p>
            </section>
          </div>

          <div className="mt-10 text-center">
            <Link to="/" className="text-primary hover:underline text-sm">
              ← Về trang chủ
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicyPage;
