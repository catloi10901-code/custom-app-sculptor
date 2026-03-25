-- Library items table for prayer library
create table if not exists public.library_items (
  id uuid primary key default gen_random_uuid(),
  icon text not null default '🙏',
  title text not null,
  excerpt text,
  content text,
  category_id uuid references public.blog_categories(id) on delete set null,
  sort_order int not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.library_items enable row level security;

create policy "Anyone can read published library items" on public.library_items
  for select using (is_published = true);

create policy "Admins can manage library items" on public.library_items
  for all using (public.has_role(auth.uid(), 'admin'));

-- Seed library categories into blog_categories (type = 'library')
insert into public.blog_categories (name, slug, icon, description, sort_order, type)
select * from (values
  ('Hòa Bình',   'library-peace',      '🕊️', 'Cầu nguyện cho hòa bình',        1, 'library'),
  ('Sức Khỏe',   'library-health',     '💚', 'Cầu nguyện cho sức khỏe',         2, 'library'),
  ('Phước Lành', 'library-prosperity', '🌟', 'Cầu nguyện cho phước lành',       3, 'library'),
  ('Gia Đình',   'library-family',     '👨‍👩‍👧', 'Cầu nguyện cho gia đình',     4, 'library'),
  ('Công Việc',  'library-work',       '💼', 'Cầu nguyện cho công việc',        5, 'library'),
  ('Tạ Ơn',      'library-gratitude',  '🙏', 'Cầu nguyện tạ ơn & thờ phượng',  6, 'library'),
  ('Quốc Gia',   'library-nation',     '🏛️', 'Cầu nguyện cho đất nước',        7, 'library')
) as t(name, slug, icon, description, sort_order, type)
where not exists (
  select 1 from public.blog_categories bc where bc.slug = t.slug
);

-- Seed all library items using CTEs for category references
with cats as (
  select id, slug from public.blog_categories where type = 'library'
),
peace_cat as (select id from cats where slug = 'library-peace'),
health_cat as (select id from cats where slug = 'library-health'),
prosperity_cat as (select id from cats where slug = 'library-prosperity'),
family_cat as (select id from cats where slug = 'library-family'),
work_cat as (select id from cats where slug = 'library-work'),
gratitude_cat as (select id from cats where slug = 'library-gratitude'),
nation_cat as (select id from cats where slug = 'library-nation')
insert into public.library_items (icon, title, excerpt, category_id, sort_order)
select icon, title, excerpt, cat_id, rn from (
  -- PEACE
  select '🕊️' icon,'Cầu Nguyện Cho Hòa Bình Thế Giới' title,'Collection of 10 powerful prayers for peace among nations in conflict.' excerpt,(select id from peace_cat) cat_id,1 rn union all
  select '🌍','Children of the World','Protection and blessing for children worldwide, especially in conflict zones.',(select id from peace_cat),2 union all
  select '🕊️','Hòa Giải Giữa Các Dân Tộc','Cầu nguyện cho sự hòa giải và hiểu biết giữa các dân tộc, chủng tộc trên toàn thế giới.',(select id from peace_cat),3 union all
  select '☮️','Chấm Dứt Chiến Tranh','Những lời cầu nguyện tha thiết cho các vùng chiến sự được hòa bình và ổn định.',(select id from peace_cat),4 union all
  select '🤝','Hòa Bình Trong Gia Đình','Cầu xin sự bình an của Chúa ngự trị trong mỗi gia đình và mối quan hệ.',(select id from peace_cat),5 union all
  select '🌿','Bình An Nội Tâm','Tìm kiếm sự bình an trong tâm hồn qua Lời Chúa và sự cầu nguyện.',(select id from peace_cat),6 union all
  select '🕊️','Cầu Cho Trung Đông','Cầu nguyện đặc biệt cho hòa bình tại vùng đất của Kinh Thánh.',(select id from peace_cat),7 union all
  select '🌅','Hòa Bình Cho Châu Phi','Lời cầu nguyện cho các quốc gia châu Phi đang chịu xung đột và bất ổn.',(select id from peace_cat),8 union all
  select '🕊️','Người Tị Nạn & Di Cư','Cầu cho hàng triệu người tị nạn tìm được nơi an toàn và hy vọng.',(select id from peace_cat),9 union all
  select '🌏','Hòa Bình Đông Nam Á','Cầu nguyện cho sự ổn định và phát triển hòa bình tại khu vực Đông Nam Á.',(select id from peace_cat),10 union all
  select '💫','Tha Thứ & Hòa Giải','Cầu xin Chúa ban ơn tha thứ để chữa lành những vết thương lịch sử.',(select id from peace_cat),11 union all
  select '🕊️','Hòa Bình Cho Ukraine','Cầu nguyện cho chiến tranh kết thúc và nhân dân Ukraine được bình an.',(select id from peace_cat),12 union all
  select '🌸','Chống Bạo Lực Gia Đình','Cầu cho những nạn nhân bạo lực được bảo vệ và chữa lành.',(select id from peace_cat),13 union all
  select '⚖️','Công Lý & Hòa Bình','Cầu nguyện cho công lý được thực thi và hòa bình được thiết lập.',(select id from peace_cat),14 union all
  select '🕊️','Thi Thiên Hòa Bình','Sưu tập các Thi Thiên về sự bình an để đọc và cầu nguyện mỗi ngày.',(select id from peace_cat),15 union all
  select '🌍','Hội Nghị Hòa Bình Thế Giới','Cầu cho các lãnh đạo thế giới có sự khôn ngoan trong đàm phán hòa bình.',(select id from peace_cat),16 union all
  select '🕊️','Người Xây Dựng Hòa Bình','Phước cho người làm cho hòa bình - Ma-thi-ơ 5:9.',(select id from peace_cat),17 union all
  select '🌻','Hòa Bình Trong Cộng Đồng','Cầu cho sự hòa thuận và yêu thương trong cộng đồng địa phương.',(select id from peace_cat),18 union all
  select '🕊️','Giải Trừ Vũ Khí Hạt Nhân','Cầu nguyện cho thế giới thoát khỏi mối đe dọa vũ khí hạt nhân.',(select id from peace_cat),19 union all
  select '🌈','Hòa Bình Sau Thiên Tai','Cầu cho sự phục hồi bình an của các cộng đồng sau thiên tai.',(select id from peace_cat),20 union all
  select '🕊️','Cầu Cho Tù Nhân Lương Tâm','Cầu cho những người bị giam giữ vì đức tin và lương tâm.',(select id from peace_cat),21 union all
  select '🌐','Hòa Bình Kỹ Thuật Số','Cầu cho internet và mạng xã hội trở thành nơi xây dựng hòa bình.',(select id from peace_cat),22 union all
  select '🕊️','Hòa Bình Liên Tôn Giáo','Cầu cho sự đối thoại và tôn trọng giữa các tôn giáo khác nhau.',(select id from peace_cat),23 union all
  select '🌿','Hòa Bình Với Thiên Nhiên','Cầu cho nhân loại sống hài hòa với thiên nhiên và bảo vệ môi trường.',(select id from peace_cat),24 union all
  select '🕊️','Phong Trào Phi Bạo Lực','Cầu cho tinh thần phi bạo lực lan tỏa theo gương Chúa Giê-su.',(select id from peace_cat),25 union all
  select '💒','Hiệp Một Trong Hội Thánh','Cầu cho sự hiệp một giữa các hệ phái Cơ Đốc trên toàn thế giới.',(select id from peace_cat),26 union all
  select '🕊️','Cầu Cho Myanmar','Cầu nguyện cho hòa bình và tự do tại Myanmar.',(select id from peace_cat),27 union all
  select '🌍','Nhân Quyền & Phẩm Giá','Cầu cho nhân quyền được tôn trọng ở mọi nơi trên thế giới.',(select id from peace_cat),28 union all
  select '🕊️','Shalom - Bình An Trọn Vẹn','Khám phá ý nghĩa Shalom trong Kinh Thánh và cầu nguyện cho sự bình an trọn vẹn.',(select id from peace_cat),29 union all
  select '✝️','Hoàng Tử Hòa Bình','Suy gẫm về Chúa Giê-su - Hoàng Tử Hòa Bình và ý nghĩa cho thế giới hôm nay.',(select id from peace_cat),30 union all
  -- HEALTH
  select '💚','Healing Prayers','Bible-based prayers for physical and spiritual healing.',(select id from health_cat),1 union all
  select '🏥','Cầu Nguyện Cho Người Bệnh','Những lời cầu nguyện theo Kinh Thánh cho người đang đau ốm.',(select id from health_cat),2 union all
  select '💊','Chữa Lành Bệnh Mãn Tính','Cầu xin quyền năng chữa lành của Chúa cho bệnh nhân mãn tính.',(select id from health_cat),3 union all
  select '🧠','Sức Khỏe Tinh Thần','Cầu nguyện cho sự bình an tâm trí và chữa lành trầm cảm, lo âu.',(select id from health_cat),4 union all
  select '💚','Chữa Lành Tâm Hồn','Những vết thương tâm hồn cần được Chúa chạm đến và chữa lành.',(select id from health_cat),5 union all
  select '🤰','Cầu Cho Thai Phụ','Cầu nguyện cho sức khỏe mẹ và bé trong suốt thai kỳ.',(select id from health_cat),6 union all
  select '👶','Sức Khỏe Trẻ Em','Cầu cho trẻ em được khỏe mạnh, phát triển toàn diện.',(select id from health_cat),7 union all
  select '💚','Phục Hồi Sau Phẫu Thuật','Cầu nguyện cho quá trình hồi phục nhanh chóng sau phẫu thuật.',(select id from health_cat),8 union all
  select '🦠','Chống Dịch Bệnh','Cầu cho Chúa bảo vệ khỏi dịch bệnh và ban sức khỏe cho cộng đồng.',(select id from health_cat),9 union all
  select '💚','Chữa Lành Ung Thư','Lời cầu nguyện đặc biệt cho bệnh nhân ung thư và gia đình họ.',(select id from health_cat),10 union all
  select '🩺','Cầu Cho Bác Sĩ & Y Tá','Cầu nguyện cho đội ngũ y tế có sức khỏe và sự khôn ngoan.',(select id from health_cat),11 union all
  select '💚','Cai Nghiện & Phục Hồi','Cầu cho người nghiện được giải phóng và phục hồi hoàn toàn.',(select id from health_cat),12 union all
  select '🧘','Nghỉ Ngơi & Phục Hồi','Cầu nguyện cho sự nghỉ ngơi đúng nghĩa theo mẫu Chúa ban.',(select id from health_cat),13 union all
  select '💚','Sức Khỏe Người Cao Tuổi','Cầu cho ông bà, người lớn tuổi được khỏe mạnh, bình an.',(select id from health_cat),14 union all
  select '🌡️','Chữa Lành Từ Kinh Thánh','Sưu tập 30 câu Kinh Thánh về sự chữa lành để tuyên bố mỗi ngày.',(select id from health_cat),15 union all
  select '💚','Sức Khỏe Sinh Sản','Cầu nguyện cho các cặp vợ chồng đang mong con và gặp khó khăn.',(select id from health_cat),16 union all
  select '🏃','Sức Khỏe Thể Chất','Cầu cho thân thể - đền thờ Đức Thánh Linh được khỏe mạnh.',(select id from health_cat),17 union all
  select '💚','Chữa Lành Ký Ức Đau','Cầu xin Chúa chữa lành những ký ức đau thương trong quá khứ.',(select id from health_cat),18 union all
  select '😴','Chữa Mất Ngủ','Cầu nguyện cho giấc ngủ bình an theo Thi Thiên 4:8.',(select id from health_cat),19 union all
  select '💚','Phục Hồi Đột Quỵ','Cầu cho bệnh nhân đột quỵ được phục hồi và hồi phục chức năng.',(select id from health_cat),20 union all
  select '💪','Sức Mạnh Trong Yếu Đuối','2 Cô-rinh-tô 12:9 - Quyền năng Chúa trọn vẹn trong sự yếu đuối.',(select id from health_cat),21 union all
  select '💚','Chữa Lành Dị Ứng','Cầu cho cơ thể được chữa lành khỏi các phản ứng dị ứng.',(select id from health_cat),22 union all
  select '🫀','Bệnh Tim Mạch','Cầu nguyện cho người mắc bệnh tim được Chúa chạm và chữa lành.',(select id from health_cat),23 union all
  select '💚','Sức Khỏe Mắt','Cầu cho thị lực được bảo vệ và phục hồi.',(select id from health_cat),24 union all
  select '🦴','Xương Khớp & Vận Động','Cầu cho sự chữa lành bệnh xương khớp và phục hồi vận động.',(select id from health_cat),25 union all
  select '💚','Chữa Lành Tiểu Đường','Cầu cho bệnh nhân tiểu đường được ổn định và chữa lành.',(select id from health_cat),26 union all
  select '🧬','Bệnh Di Truyền','Cầu cho các gia đình mang bệnh di truyền được Chúa chữa lành.',(select id from health_cat),27 union all
  select '💚','Phòng Ngừa Bệnh Tật','Cầu xin Chúa bảo vệ sức khỏe và phòng ngừa bệnh tật.',(select id from health_cat),28 union all
  select '🌱','Dinh Dưỡng & Sức Khỏe','Cầu cho sự khôn ngoan trong ăn uống để chăm sóc đền thờ Chúa.',(select id from health_cat),29 union all
  select '💚','Phép Lạ Chữa Lành','Sưu tập các câu chuyện phép lạ chữa lành trong Kinh Thánh và ngày nay.',(select id from health_cat),30 union all
  -- PROSPERITY
  select '🌟','Prosperity & Blessing','Prayers for financial blessing and prosperity according to God''s will.',(select id from prosperity_cat),1 union all
  select '💰','Phước Lành Tài Chính','Cầu nguyện cho sự cung ứng dư dật theo lời hứa Phi-líp 4:19.',(select id from prosperity_cat),2 union all
  select '🌟','Khôn Ngoan Quản Lý Tiền','Cầu xin sự khôn ngoan từ Chúa để quản lý tài chính tốt.',(select id from prosperity_cat),3 union all
  select '🏠','Cầu Cho Nhà Ở','Cầu nguyện cho nhu cầu nhà ở được Chúa cung ứng.',(select id from prosperity_cat),4 union all
  select '🌟','Thoát Nợ Nần','Cầu xin Chúa mở đường cho việc trả nợ và sống tự do tài chính.',(select id from prosperity_cat),5 union all
  select '📈','Thăng Tiến Sự Nghiệp','Cầu cho Chúa mở cánh cửa thăng tiến trong công việc.',(select id from prosperity_cat),6 union all
  select '🌟','Kinh Doanh Được Phước','Cầu nguyện cho doanh nghiệp phát triển theo ý Chúa.',(select id from prosperity_cat),7 union all
  select '🎓','Học Bổng & Giáo Dục','Cầu cho cơ hội học tập và phát triển được Chúa mở ra.',(select id from prosperity_cat),8 union all
  select '🌟','Dâng Phần Mười','Hiểu và thực hành dâng phần mười với niềm vui - Ma-la-chi 3:10.',(select id from prosperity_cat),9 union all
  select '💎','Giàu Có Trong Chúa','Phân biệt giàu có theo thế gian và giàu có trong Đấng Christ.',(select id from prosperity_cat),10 union all
  select '🌟','Đầu Tư Khôn Ngoan','Cầu cho sự khôn ngoan khi đầu tư và quản lý tài sản.',(select id from prosperity_cat),11 union all
  select '🌾','Gieo & Gặt','Nguyên tắc gieo gặt trong Kinh Thánh áp dụng cho tài chính.',(select id from prosperity_cat),12 union all
  select '🌟','Cung Ứng Trong Khó Khăn','Cầu xin Chúa cung cấp khi tài chính gặp khó khăn.',(select id from prosperity_cat),13 union all
  select '🏪','Khởi Nghiệp Cơ Đốc','Cầu cho startup và doanh nghiệp mới được Chúa dẫn dắt.',(select id from prosperity_cat),14 union all
  select '🌟','Công Việc Mới','Cầu nguyện cho Chúa mở cánh cửa việc làm phù hợp.',(select id from prosperity_cat),15 union all
  select '🙌','Rộng Rãi Ban Cho','Cầu cho tấm lòng rộng rãi và phước lành khi ban cho.',(select id from prosperity_cat),16 union all
  select '🌟','Tự Do Tài Chính','Cầu cho sự tự do tài chính để phục vụ Chúa hiệu quả hơn.',(select id from prosperity_cat),17 union all
  select '🛡️','Bảo Vệ Tài Sản','Cầu xin Chúa bảo vệ tài sản và gia nghiệp khỏi mất mát.',(select id from prosperity_cat),18 union all
  select '🌟','Phước Cho Thế Hệ Sau','Cầu cho con cháu được thừa hưởng phước lành và sự khôn ngoan.',(select id from prosperity_cat),19 union all
  select '🌱','Tăng Trưởng Từng Bước','Kiên nhẫn chờ đợi Chúa trong sự tăng trưởng tài chính.',(select id from prosperity_cat),20 union all
  select '🌟','Lương Thực Hàng Ngày','Cầu cho nhu cầu hàng ngày được cung ứng.',(select id from prosperity_cat),21 union all
  select '🏆','Thành Công Theo Ý Chúa','Định nghĩa lại thành công theo cách nhìn của Chúa.',(select id from prosperity_cat),22 union all
  select '🌟','Cơ Hội & Mối Quan Hệ','Cầu cho Chúa kết nối với đúng người vào đúng thời điểm.',(select id from prosperity_cat),23 union all
  select '📊','Lập Ngân Sách Cơ Đốc','Nguyên tắc lập ngân sách theo Kinh Thánh cho gia đình.',(select id from prosperity_cat),24 union all
  select '🌟','Tiết Kiệm & Dự Phòng','Sự khôn ngoan của con kiến - Châm Ngôn 6:6-8.',(select id from prosperity_cat),25 union all
  select '🎁','Phước Lành Bất Ngờ','Cầu cho những phước lành bất ngờ Chúa ban cho đời sống.',(select id from prosperity_cat),26 union all
  select '🌟','Lao Động Là Thờ Phượng','Biến công việc hàng ngày thành hành động thờ phượng Chúa.',(select id from prosperity_cat),27 union all
  select '🤲','Cho Nhiều Hơn Nhận','Công vụ 20:35 - Phước cho người cho hơn người nhận.',(select id from prosperity_cat),28 union all
  select '🌟','Thanh Toán Hóa Đơn','Cầu cho sự cung ứng thực tế trong việc thanh toán các chi phí.',(select id from prosperity_cat),29 union all
  select '👑','Con Vua Các Vua','Nhận biết thân phận con cái Vua và sống trong sự phước lành Ngài ban.',(select id from prosperity_cat),30 union all
  -- FAMILY
  select '👨‍👩‍👧','Family Prayers','Protect and preserve family in love and unity.',(select id from family_cat),1 union all
  select '💑','Cầu Cho Hôn Nhân','Cầu nguyện cho hôn nhân được vững mạnh trên nền tảng Chúa.',(select id from family_cat),2 union all
  select '👶','Cầu Cho Con Cái','Phó thác con cái cho Chúa và cầu nguyện mỗi ngày.',(select id from family_cat),3 union all
  select '👴','Kính Trọng Cha Mẹ','Cầu nguyện cho cha mẹ già và tấm lòng hiếu kính.',(select id from family_cat),4 union all
  select '🏠','Gia Đình Thờ Phượng','Hướng dẫn lập bàn thờ gia đình và thờ phượng chung.',(select id from family_cat),5 union all
  select '💔','Chữa Lành Gia Đình','Cầu cho những gia đình đang rạn nứt được phục hồi.',(select id from family_cat),6 union all
  select '👨‍👩‍👧‍👦','Gia Đình Đông Con','Cầu nguyện cho sự kiên nhẫn và khôn ngoan khi nuôi nhiều con.',(select id from family_cat),7 union all
  select '📖','Đọc Kinh Thánh Cùng Gia Đình','Chương trình đọc Kinh Thánh gia đình 7 ngày.',(select id from family_cat),8 union all
  select '🤱','Cầu Cho Bà Mẹ','Cầu nguyện đặc biệt cho các bà mẹ trong mọi hoàn cảnh.',(select id from family_cat),9 union all
  select '👨','Người Cha Cơ Đốc','Cầu cho người cha trở thành thầy tế lễ trong gia đình.',(select id from family_cat),10 union all
  select '💍','Chuẩn Bị Hôn Nhân','Cầu nguyện cho các cặp đôi đang chuẩn bị kết hôn.',(select id from family_cat),11 union all
  select '👫','Vợ Chồng Hiệp Một','Ê-phê-sô 5:31 - Hai người trở nên một thịt.',(select id from family_cat),12 union all
  select '🧒','Tuổi Teen & Gia Đình','Cầu cho mối quan hệ cha mẹ - con teen được gắn kết.',(select id from family_cat),13 union all
  select '👵','Ông Bà & Cháu','Cầu cho thế hệ ông bà truyền đức tin cho cháu chắt.',(select id from family_cat),14 union all
  select '🏡','Ngôi Nhà Bình An','Cầu cho ngôi nhà trở thành nơi bình an và yêu thương.',(select id from family_cat),15 union all
  select '🤝','Giao Tiếp Gia Đình','Cầu cho sự giao tiếp lành mạnh và hiểu biết trong gia đình.',(select id from family_cat),16 union all
  select '🎄','Lễ Hội Gia Đình','Cầu cho những dịp lễ gia đình sum họp trong tình yêu Chúa.',(select id from family_cat),17 union all
  select '📱','Gia Đình Trong Thời Số','Cầu cho gia đình giữ kết nối thật giữa thế giới số.',(select id from family_cat),18 union all
  select '💞','Tha Thứ Trong Gia Đình','Cầu cho sự tha thứ chữa lành những vết thương gia đình.',(select id from family_cat),19 union all
  select '🌳','Cây Gia Phả Đức Tin','Xây dựng di sản đức tin qua nhiều thế hệ.',(select id from family_cat),20 union all
  select '🍽️','Bữa Cơm Gia Đình','Cầu nguyện trước bữa ăn và tầm quan trọng ăn cùng nhau.',(select id from family_cat),21 union all
  select '🧸','Cầu Cho Trẻ Nhỏ','Lời cầu nguyện dịu dàng cho trẻ sơ sinh và trẻ nhỏ.',(select id from family_cat),22 union all
  select '🎒','Mùa Tựu Trường','Cầu cho con cái khi bắt đầu năm học mới.',(select id from family_cat),23 union all
  select '🏥','Gia Đình Chịu Bệnh','Cầu cho gia đình có người thân bị bệnh nặng.',(select id from family_cat),24 union all
  select '✈️','Gia Đình Xa Cách','Cầu cho những gia đình sống xa nhau vẫn gắn kết.',(select id from family_cat),25 union all
  select '🐕','Gia Đình & Thú Cưng','Cầu tạ ơn cho mọi thành viên trong gia đình, kể cả thú cưng.',(select id from family_cat),26 union all
  select '🎂','Sinh Nhật & Kỷ Niệm','Lời cầu nguyện cho những dịp sinh nhật và kỷ niệm gia đình.',(select id from family_cat),27 union all
  select '💐','Ngày Của Mẹ','Cầu nguyện đặc biệt nhân Ngày của Mẹ.',(select id from family_cat),28 union all
  select '👔','Ngày Của Cha','Cầu nguyện đặc biệt nhân Ngày của Cha.',(select id from family_cat),29 union all
  select '🏠','Gia Đình Là Hội Thánh','Gia đình là Hội Thánh thu nhỏ - xây dựng trên nền tảng Chúa.',(select id from family_cat),30 union all
  -- WORK
  select '💼','Work Prayers','Prayers for wisdom, creativity and success in career.',(select id from work_cat),1 union all
  select '🏢','Cầu Cho Công Việc','Cầu nguyện cho ngày làm việc hiệu quả và vinh hiển Chúa.',(select id from work_cat),2 union all
  select '💼','Sếp & Đồng Nghiệp','Cầu cho mối quan hệ tốt đẹp với sếp và đồng nghiệp.',(select id from work_cat),3 union all
  select '🎯','Mục Tiêu Nghề Nghiệp','Cầu xin Chúa dẫn dắt trong việc lập mục tiêu sự nghiệp.',(select id from work_cat),4 union all
  select '💼','Phỏng Vấn Xin Việc','Cầu nguyện trước buổi phỏng vấn để được bình an và tự tin.',(select id from work_cat),5 union all
  select '💡','Sáng Tạo Trong Công Việc','Cầu cho Thánh Linh ban sự sáng tạo trong mọi dự án.',(select id from work_cat),6 union all
  select '💼','Quyết Định Nghề Nghiệp','Cầu cho sự khôn ngoan khi đứng trước ngã rẽ sự nghiệp.',(select id from work_cat),7 union all
  select '⚖️','Cân Bằng Công Việc-Cuộc Sống','Cầu cho sự cân bằng giữa công việc và gia đình.',(select id from work_cat),8 union all
  select '💼','Đạo Đức Nghề Nghiệp','Cầu cho sự liêm chính và đạo đức Cơ Đốc tại nơi làm việc.',(select id from work_cat),9 union all
  select '🤝','Làm Việc Nhóm','Cầu cho sự hiệp một và hợp tác hiệu quả trong đội nhóm.',(select id from work_cat),10 union all
  select '💼','Áp Lực Công Việc','Cầu nguyện khi áp lực công việc quá lớn và cần nghỉ ngơi.',(select id from work_cat),11 union all
  select '📊','Dự Án Quan Trọng','Cầu cho sự thành công của dự án đang thực hiện.',(select id from work_cat),12 union all
  select '💼','Lãnh Đạo Cơ Đốc','Cầu cho phong cách lãnh đạo theo gương Chúa Giê-su.',(select id from work_cat),13 union all
  select '🏫','Giáo Viên & Nhà Giáo','Cầu cho giáo viên có sự kiên nhẫn và ảnh hưởng tốt.',(select id from work_cat),14 union all
  select '💼','Khởi Nghiệp','Cầu cho những người đang bắt đầu kinh doanh riêng.',(select id from work_cat),15 union all
  select '🔧','Công Nhân & Thợ','Cầu cho những người lao động chân tay được bảo vệ.',(select id from work_cat),16 union all
  select '💼','Freelancer Cơ Đốc','Cầu cho freelancer có đủ dự án và thu nhập ổn định.',(select id from work_cat),17 union all
  select '🖥️','Làm Việc Từ Xa','Cầu cho kỷ luật và hiệu quả khi làm việc tại nhà.',(select id from work_cat),18 union all
  select '💼','Thất Nghiệp','Cầu nguyện trong giai đoạn tìm việc và đợi chờ Chúa.',(select id from work_cat),19 union all
  select '🎓','Sinh Viên Mới Ra Trường','Cầu cho bước chuyển từ trường học sang thế giới công việc.',(select id from work_cat),20 union all
  select '💼','Cuộc Họp Quan Trọng','Cầu nguyện trước cuộc họp quan trọng để có sự khôn ngoan.',(select id from work_cat),21 union all
  select '✈️','Công Tác Xa','Cầu cho sự bảo vệ và hiệu quả trong chuyến công tác.',(select id from work_cat),22 union all
  select '💼','Nghỉ Hưu Trong Chúa','Cầu cho giai đoạn nghỉ hưu có ý nghĩa và phục vụ.',(select id from work_cat),23 union all
  select '🏥','Nhân Viên Y Tế','Cầu cho bác sĩ, y tá, nhân viên y tế có sức khỏe phục vụ.',(select id from work_cat),24 union all
  select '💼','Luật Sư Cơ Đốc','Cầu cho công lý và sự liêm chính trong ngành luật.',(select id from work_cat),25 union all
  select '👷','Công Trình Xây Dựng','Cầu cho sự an toàn và chất lượng trong xây dựng.',(select id from work_cat),26 union all
  select '💼','Marketing & Truyền Thông','Cầu cho sự chân thực và đạo đức trong marketing.',(select id from work_cat),27 union all
  select '🌾','Nông Dân & Ngư Dân','Cầu cho mùa màng bội thu và biển cả bình an.',(select id from work_cat),28 union all
  select '💼','Tài Xế & Vận Tải','Cầu cho sự an toàn trên mỗi cung đường.',(select id from work_cat),29 union all
  select '🎨','Nghệ Sĩ Cơ Đốc','Cầu cho nghệ sĩ sáng tạo và vinh hiển Chúa qua nghệ thuật.',(select id from work_cat),30 union all
  -- GRATITUDE
  select '🙏','Gratitude & Worship','Offer thanksgiving and worship to God in all circumstances.',(select id from gratitude_cat),1 union all
  select '🎵','Thánh Ca Tạ Ơn','Sưu tập các bài thánh ca về lòng biết ơn và thờ phượng.',(select id from gratitude_cat),2 union all
  select '🙏','Tạ Ơn Mỗi Sáng','Bắt đầu ngày mới bằng 5 lý do để tạ ơn Chúa.',(select id from gratitude_cat),3 union all
  select '📝','Nhật Ký Biết Ơn','Viết nhật ký biết ơn để nhận ra phước lành mỗi ngày.',(select id from gratitude_cat),4 union all
  select '🙏','Tạ Ơn Trong Thử Thách','1 Tê-sa-lô-ni-ca 5:18 - Phàm việc gì cũng phải tạ ơn.',(select id from gratitude_cat),5 union all
  select '🌅','Tạ Ơn Thiên Nhiên','Cảm tạ Chúa về vẻ đẹp kỳ diệu của thiên nhiên.',(select id from gratitude_cat),6 union all
  select '🙏','Biết Ơn Những Người Xung Quanh','Cầu nguyện tạ ơn cho những người Chúa đặt trong đời.',(select id from gratitude_cat),7 union all
  select '❤️','Tạ Ơn Vì Tình Yêu Chúa','Suy gẫm về tình yêu vô điều kiện của Chúa và dâng lời tạ ơn.',(select id from gratitude_cat),8 union all
  select '🙏','Tạ Ơn Vì Sự Cứu Rỗi','Cảm tạ Chúa về ân điển cứu rỗi qua Chúa Giê-su.',(select id from gratitude_cat),9 union all
  select '🍞','Tạ Ơn Trước Bữa Ăn','Những lời cầu nguyện đẹp để tạ ơn trước bữa ăn.',(select id from gratitude_cat),10 union all
  select '🙏','Thờ Phượng Trong Bão Tố','Học từ Phao-lô và Si-la thờ phượng trong tù.',(select id from gratitude_cat),11 union all
  select '🌟','100 Lý Do Tạ Ơn','Danh sách 100 lý do để tạ ơn Chúa mỗi ngày.',(select id from gratitude_cat),12 union all
  select '🙏','Thi Thiên Tạ Ơn','Các Thi Thiên về lòng biết ơn: 100, 103, 107, 136, 145.',(select id from gratitude_cat),13 union all
  select '🎶','Thờ Phượng Cá Nhân','Hướng dẫn thời gian thờ phượng riêng tư với Chúa.',(select id from gratitude_cat),14 union all
  select '🙏','Tạ Ơn Cuối Ngày','Kết thúc ngày với lời tạ ơn và phó thác cho Chúa.',(select id from gratitude_cat),15 union all
  select '🌈','Tạ Ơn Sau Cơn Mưa','Nhìn lại và tạ ơn sau những giai đoạn khó khăn.',(select id from gratitude_cat),16 union all
  select '🙏','Biết Ơn Sức Khỏe','Đừng quên tạ ơn vì sức khỏe - món quà quý giá.',(select id from gratitude_cat),17 union all
  select '👨‍👩‍👧','Tạ Ơn Vì Gia Đình','Gia đình là phước lành lớn nhất Chúa ban cho.',(select id from gratitude_cat),18 union all
  select '🙏','Tạ Ơn Vì Hội Thánh','Cảm tạ Chúa về cộng đồng đức tin và anh chị em.',(select id from gratitude_cat),19 union all
  select '📖','Tạ Ơn Vì Lời Chúa','Biết ơn vì có Kinh Thánh - Lời sống của Đức Chúa Trời.',(select id from gratitude_cat),20 union all
  select '🙏','Thờ Phượng Bằng Đời Sống','Rô-ma 12:1 - Dâng thân thể làm của lễ sống.',(select id from gratitude_cat),21 union all
  select '🕯️','Thờ Phượng Thầm Lặng','Nghệ thuật thờ phượng trong sự yên lặng trước Chúa.',(select id from gratitude_cat),22 union all
  select '🙏','Tạ Ơn Mùa Gặt','Cầu nguyện tạ ơn trong mùa thu hoạch và phước lành.',(select id from gratitude_cat),23 union all
  select '🎹','Thờ Phượng Bằng Nhạc Cụ','Dâng lên Chúa lời ca tiếng nhạc từ tấm lòng biết ơn.',(select id from gratitude_cat),24 union all
  select '🙏','Biết Ơn Điều Nhỏ','Tập biết ơn những điều nhỏ nhặt hàng ngày.',(select id from gratitude_cat),25 union all
  select '🌻','Tạ Ơn Mùa Xuân','Cảm tạ Chúa về sự tươi mới và bắt đầu lại.',(select id from gratitude_cat),26 union all
  select '🙏','Dâng Hiến Với Lòng Biết Ơn','Dâng hiến không phải nghĩa vụ mà là biểu hiện lòng biết ơn.',(select id from gratitude_cat),27 union all
  select '✨','Tạ Ơn Vì Ân Điển','Ân điển mới mỗi buổi sáng - Ca Thương 3:23.',(select id from gratitude_cat),28 union all
  select '🙏','Hallelujah - Ngợi Khen Chúa','Ý nghĩa sâu sắc của Hallelujah và cách sống ngợi khen.',(select id from gratitude_cat),29 union all
  select '🎉','Lễ Tạ Ơn Cơ Đốc','Ý nghĩa tâm linh của Lễ Tạ Ơn và cách tổ chức.',(select id from gratitude_cat),30 union all
  -- NATION
  select '🏛️','Nation Prayers','Intercede for the nation, government and leaders.',(select id from nation_cat),1 union all
  select '🇻🇳','Cầu Cho Việt Nam','Cầu nguyện cho đất nước Việt Nam được phước lành và phát triển.',(select id from nation_cat),2 union all
  select '🏛️','Cầu Cho Chính Phủ','Cầu cho lãnh đạo quốc gia có sự khôn ngoan và liêm chính.',(select id from nation_cat),3 union all
  select '⚖️','Công Lý Quốc Gia','Cầu cho hệ thống tư pháp công bằng và minh bạch.',(select id from nation_cat),4 union all
  select '🏛️','Tự Do Tôn Giáo','Cầu cho quyền tự do tín ngưỡng được tôn trọng.',(select id from nation_cat),5 union all
  select '📚','Giáo Dục Quốc Gia','Cầu cho hệ thống giáo dục đào tạo thế hệ tương lai.',(select id from nation_cat),6 union all
  select '🏛️','Kinh Tế Đất Nước','Cầu cho nền kinh tế phát triển bền vững và công bằng.',(select id from nation_cat),7 union all
  select '🌾','Nông Nghiệp & Lương Thực','Cầu cho mùa màng bội thu và an ninh lương thực.',(select id from nation_cat),8 union all
  select '🏛️','Quân Đội & An Ninh','Cầu cho lực lượng vũ trang bảo vệ đất nước.',(select id from nation_cat),9 union all
  select '🏥','Y Tế Quốc Gia','Cầu cho hệ thống y tế phục vụ nhân dân hiệu quả.',(select id from nation_cat),10 union all
  select '🏛️','Chống Tham Nhũng','Cầu cho sự liêm chính và chống tham nhũng trong xã hội.',(select id from nation_cat),11 union all
  select '🌳','Bảo Vệ Môi Trường','Cầu cho chính sách bảo vệ môi trường và thiên nhiên.',(select id from nation_cat),12 union all
  select '🏛️','Cầu Cho 54 Dân Tộc','Cầu nguyện cho sự đoàn kết và phát triển 54 dân tộc Việt Nam.',(select id from nation_cat),13 union all
  select '🚗','Hạ Tầng & Giao Thông','Cầu cho an toàn giao thông và phát triển hạ tầng.',(select id from nation_cat),14 union all
  select '🏛️','Bầu Cử & Dân Chủ','Cầu cho tiến trình dân chủ và sự tham gia của công dân.',(select id from nation_cat),15 union all
  select '👶','Trẻ Em & Tương Lai','Cầu cho thế hệ tương lai của đất nước được bảo vệ.',(select id from nation_cat),16 union all
  select '🏛️','Phục Hưng Tâm Linh Quốc Gia','Cầu cho sự phục hưng tâm linh lan rộng khắp đất nước.',(select id from nation_cat),17 union all
  select '🤝','Ngoại Giao & Hòa Bình','Cầu cho quan hệ ngoại giao hòa bình với các quốc gia.',(select id from nation_cat),18 union all
  select '🏛️','Chống Ma Túy','Cầu cho cuộc chiến chống ma túy và bảo vệ thanh niên.',(select id from nation_cat),19 union all
  select '🏙️','Đô Thị Hóa','Cầu cho sự phát triển đô thị bền vững và nhân bản.',(select id from nation_cat),20 union all
  select '🏛️','Báo Chí & Truyền Thông','Cầu cho sự trung thực và trách nhiệm trong truyền thông.',(select id from nation_cat),21 union all
  select '🌊','Thiên Tai & Bão Lũ','Cầu cho đất nước thoát khỏi thiên tai và bão lũ.',(select id from nation_cat),22 union all
  select '🏛️','Nghèo Đói & Bất Bình Đẳng','Cầu cho sự xóa đói giảm nghèo và công bằng xã hội.',(select id from nation_cat),23 union all
  select '🎓','Nghiên Cứu Khoa Học','Cầu cho nền khoa học phát triển phục vụ nhân loại.',(select id from nation_cat),24 union all
  select '🏛️','Người Khuyết Tật','Cầu cho chính sách hỗ trợ người khuyết tật hiệu quả.',(select id from nation_cat),25 union all
  select '🏘️','Nông Thôn & Miền Núi','Cầu cho sự phát triển vùng nông thôn và miền núi.',(select id from nation_cat),26 union all
  select '🏛️','Thanh Niên & Việc Làm','Cầu cho thanh niên có cơ hội việc làm và phát triển.',(select id from nation_cat),27 union all
  select '🏥','Dịch Bệnh & Phòng Chống','Cầu cho quốc gia được bảo vệ khỏi dịch bệnh.',(select id from nation_cat),28 union all
  select '🏛️','Văn Hóa & Bản Sắc','Cầu cho văn hóa dân tộc được gìn giữ và phát huy.',(select id from nation_cat),29 union all
  select '🌟','Việt Nam - Đất Hứa','Cầu nguyện và tuyên bố Việt Nam là đất được Chúa chúc phước.',(select id from nation_cat),30
) items;
