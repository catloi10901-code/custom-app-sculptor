import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const verses = [
  { ref: "Giăng 3:16", content: "Vì Đức Chúa Trời yêu thương thế gian, đến nỗi đã ban Con một của Ngài, hầu cho hễ ai tin Con ấy không bị hư mất mà được sự sống đời đời.", tags: ["tình yêu", "cứu rỗi"] },
  { ref: "Thi Thiên 23:1", content: "Đức Giê-hô-va là Đấng chăn giữ tôi, tôi sẽ chẳng thiếu thốn gì.", tags: ["bình an", "tin cậy"] },
  { ref: "Châm Ngôn 3:5-6", content: "Hãy hết lòng tin cậy Đức Giê-hô-va, chớ nương cậy nơi sự thông sáng của con. Phàm trong các việc làm của con, khá nhận biết Ngài, thì Ngài sẽ chỉ dẫn các nẻo của con.", tags: ["đức tin", "hướng dẫn"] },
  { ref: "Phi-líp 4:13", content: "Tôi làm được mọi sự nhờ Đấng ban thêm sức cho tôi.", tags: ["sức mạnh", "đức tin"] },
  { ref: "Rô-ma 8:28", content: "Vả, chúng ta biết rằng mọi sự hiệp lại làm ích cho kẻ yêu mến Đức Chúa Trời, tức là cho kẻ được gọi theo ý muốn Ngài đã định.", tags: ["hy vọng", "tin cậy"] },
  { ref: "Ê-sai 41:10", content: "Đừng sợ, vì ta ở với ngươi; chớ kinh khiếp, vì ta là Đức Chúa Trời ngươi! Ta sẽ bổ sức cho ngươi; phải, ta sẽ giúp đỡ ngươi.", tags: ["can đảm", "bình an"] },
  { ref: "Giê-rê-mi 29:11", content: "Đức Giê-hô-va phán: Vì ta biết ý tưởng ta nghĩ đối cùng các ngươi, là ý tưởng bình an, không phải tai họa, để cho các ngươi được sự trông cậy trong lúc cuối cùng.", tags: ["hy vọng", "tương lai"] },
  { ref: "Ma-thi-ơ 11:28", content: "Hỡi những kẻ mệt mỏi và gánh nặng, hãy đến cùng ta, ta sẽ cho các ngươi được yên nghỉ.", tags: ["bình an", "an ủi"] },
  { ref: "Thi Thiên 46:1", content: "Đức Chúa Trời là nơi nương náu và sức lực của chúng tôi, Ngài sẵn giúp đỡ trong cơn gian truân.", tags: ["sức mạnh", "bảo vệ"] },
  { ref: "Ga-la-ti 5:22-23", content: "Nhưng trái của Thánh Linh, ấy là lòng yêu thương, sự vui mừng, bình an, nhịn nhục, nhân từ, hiền lành, trung tín, mềm mại, tiết độ.", tags: ["Thánh Linh", "phẩm hạnh"] },
  { ref: "Hê-bơ-rơ 11:1", content: "Vả, đức tin là sự biết chắc vững vàng của những điều mình đang trông mong, là bằng cớ của những điều mình chẳng xem thấy.", tags: ["đức tin"] },
  { ref: "Rô-ma 12:2", content: "Đừng làm theo đời nầy, nhưng hãy biến hóa bởi sự đổi mới của tâm thần mình, để thử cho biết ý muốn tốt lành, đẹp lòng và trọn vẹn của Đức Chúa Trời là thể nào.", tags: ["biến đổi", "đức tin"] },
  { ref: "Thi Thiên 119:105", content: "Lời Chúa là ngọn đèn cho chân tôi, ánh sáng cho đường lối tôi.", tags: ["lời Chúa", "hướng dẫn"] },
  { ref: "2 Ti-mô-thê 1:7", content: "Vì Đức Chúa Trời chẳng ban cho chúng ta tâm thần nhút nhát, bèn là tâm thần mạnh mẽ, có tình thương yêu và dè giữ.", tags: ["can đảm", "sức mạnh"] },
  { ref: "1 Cô-rinh-tô 13:4-7", content: "Tình yêu thương hay nhịn nhục, tình yêu thương hay nhân từ; tình yêu thương chẳng ghen tị, chẳng khoe mình, chẳng lên mình kiêu ngạo, chẳng làm điều trái phép, chẳng kiếm tư lợi, chẳng nóng giận, chẳng nghi ngờ sự dữ.", tags: ["tình yêu"] },
  { ref: "Ê-phê-sô 2:8-9", content: "Vả, ấy là nhờ ân điển, bởi đức tin, mà anh em được cứu, điều đó không phải đến từ anh em, bèn là sự ban cho của Đức Chúa Trời. Ấy chẳng phải bởi việc làm đâu, hầu cho không ai khoe mình.", tags: ["ân điển", "cứu rỗi"] },
  { ref: "Thi Thiên 27:1", content: "Đức Giê-hô-va là ánh sáng và sự cứu rỗi tôi: Tôi sẽ sợ ai? Đức Giê-hô-va là đồn lũy của mạng sống tôi: Tôi sẽ hãi hùng ai?", tags: ["can đảm", "bảo vệ"] },
  { ref: "Ma-thi-ơ 6:33", content: "Nhưng trước hết, hãy tìm kiếm nước Đức Chúa Trời và sự công bình của Ngài, thì Ngài sẽ cho thêm các ngươi mọi điều ấy nữa.", tags: ["đức tin", "ưu tiên"] },
  { ref: "Giăng 14:6", content: "Đức Chúa Jêsus đáp rằng: Ta là đường đi, lẽ thật, và sự sống; chẳng bởi ta thì không ai được đến cùng Cha.", tags: ["cứu rỗi", "lẽ thật"] },
  { ref: "Rô-ma 5:8", content: "Nhưng Đức Chúa Trời tỏ lòng yêu thương Ngài đối với chúng ta, khi chúng ta còn là người có tội, thì Đấng Christ vì chúng ta chịu chết.", tags: ["tình yêu", "cứu rỗi"] },
  { ref: "Thi Thiên 37:4", content: "Cũng hãy khoái lạc nơi Đức Giê-hô-va, thì Ngài sẽ ban cho ngươi điều lòng ngươi ao ước.", tags: ["vui mừng", "tin cậy"] },
  { ref: "Ê-sai 40:31", content: "Nhưng ai trông đợi Đức Giê-hô-va thì chắc được sức mới, cất cánh bay cao như chim ưng; chạy mà không mệt nhọc, đi mà không mòn mỏi.", tags: ["hy vọng", "sức mạnh"] },
  { ref: "Giăng 1:1", content: "Ban đầu có Ngôi Lời, Ngôi Lời ở cùng Đức Chúa Trời, và Ngôi Lời là Đức Chúa Trời.", tags: ["lẽ thật", "Chúa Jêsus"] },
  { ref: "Sáng Thế Ký 1:1", content: "Ban đầu Đức Chúa Trời dựng nên trời đất.", tags: ["sáng tạo"] },
  { ref: "Thi Thiên 91:1-2", content: "Người nào ở nơi kín đáo của Đấng Chí Cao, sẽ được hằng ở dưới bóng của Đấng Toàn Năng. Tôi nói về Đức Giê-hô-va rằng: Ngài là nơi nương náu tôi, là đồn lũy tôi, là Đức Chúa Trời tôi, tôi tin cậy nơi Ngài.", tags: ["bảo vệ", "tin cậy"] },
  { ref: "Phi-líp 4:6-7", content: "Chớ lo phiền chi hết, nhưng trong mọi sự hãy dùng lời cầu nguyện, nài xin, và sự tạ ơn mà trình các sự cầu xin của mình cho Đức Chúa Trời. Sự bình an của Đức Chúa Trời vượt quá mọi sự hiểu biết, sẽ giữ gìn lòng và ý tưởng anh em trong Đức Chúa Jêsus Christ.", tags: ["bình an", "cầu nguyện"] },
  { ref: "Giô-suê 1:9", content: "Ta há chẳng có phán dặn ngươi sao? Hãy vững lòng bền chí, chớ run sợ, chớ kinh khủng; vì Giê-hô-va Đức Chúa Trời ngươi vẫn ở cùng ngươi trong mọi nơi ngươi đi.", tags: ["can đảm", "sức mạnh"] },
  { ref: "Châm Ngôn 18:10", content: "Danh Đức Giê-hô-va vốn một ngọn tháp kiên cố; người công bình chạy đến đó, được yên ổn vô sự.", tags: ["bảo vệ", "an toàn"] },
  { ref: "Ma-thi-ơ 28:19-20", content: "Vậy, hãy đi dạy dỗ muôn dân, hãy nhân danh Đức Cha, Đức Con, và Đức Thánh Linh mà làm phép báp-tem cho họ, và dạy họ giữ hết cả mọi điều mà ta đã truyền cho các ngươi. Và nầy, ta thường ở cùng các ngươi luôn cho đến tận thế.", tags: ["sứ mệnh", "đức tin"] },
  { ref: "1 Giăng 4:8", content: "Ai chẳng yêu, thì không biết Đức Chúa Trời; vì Đức Chúa Trời là sự yêu thương.", tags: ["tình yêu"] },
  { ref: "Thi Thiên 34:18", content: "Đức Giê-hô-va ở gần những người có lòng đau thương, và cứu kẻ nào có tâm hồn thống hối.", tags: ["an ủi", "chữa lành"] },
  { ref: "Rô-ma 8:38-39", content: "Vì tôi chắc rằng bất kỳ sự chết, sự sống, các thiên sứ, các kẻ cầm quyền, việc bây giờ, việc hầu đến, quyền phép, bề cao, hay bề sâu, hoặc một vật nào, chẳng có thể phân rẽ chúng ta khỏi sự yêu thương mà Đức Chúa Trời đã chứng cho chúng ta trong Đức Chúa Jêsus Christ.", tags: ["tình yêu", "bảo đảm"] },
  { ref: "Thi Thiên 139:14", content: "Tôi cảm tạ Chúa, vì tôi được dựng nên cách đáng sợ lạ lùng. Công việc Chúa thật lạ lùng, lòng tôi biết rõ lắm.", tags: ["tạ ơn", "sáng tạo"] },
  { ref: "Ê-sai 53:5", content: "Nhưng người đã vì tội lỗi chúng ta mà bị vết, vì sự gian ác chúng ta mà bị thương. Bởi sự sửa phạt người chịu chúng ta được bình an, bởi lằn roi người chúng ta được lành bệnh.", tags: ["cứu rỗi", "chữa lành"] },
  { ref: "2 Cô-rinh-tô 5:17", content: "Vậy, nếu ai ở trong Đấng Christ, thì nấy là người dựng nên mới; những sự cũ đã qua đi, nầy mọi sự đều trở nên mới.", tags: ["biến đổi", "tái sinh"] },
  { ref: "Ma-thi-ơ 5:14-16", content: "Các ngươi là sự sáng của thế gian; một cái thành ở trên núi thì không khi nào bị khuất được. Cũng không ai thắp đèn mà để dưới cái thùng, song người ta để trên chân đèn, thì nó soi sáng mọi người ở trong nhà.", tags: ["sứ mệnh", "ánh sáng"] },
  { ref: "Giăng 8:32", content: "Các ngươi sẽ biết lẽ thật, và lẽ thật sẽ buông tha các ngươi.", tags: ["lẽ thật", "tự do"] },
  { ref: "Thi Thiên 121:1-2", content: "Tôi ngước mắt lên trên núi: Sự tiếp trợ tôi đến từ đâu? Sự tiếp trợ tôi đến từ Đức Giê-hô-va, là Đấng đã dựng nên trời và đất.", tags: ["tin cậy", "giúp đỡ"] },
  { ref: "Rô-ma 10:9", content: "Vậy nếu miệng ngươi xưng Đức Chúa Jêsus ra và lòng ngươi tin rằng Đức Chúa Trời đã khiến Ngài từ kẻ chết sống lại, thì ngươi sẽ được cứu.", tags: ["cứu rỗi", "đức tin"] },
  { ref: "Giăng 10:10", content: "Kẻ trộm chỉ đến để cướp giết và hủy diệt; còn ta đã đến, hầu cho chiên được sự sống và được sự sống dư dật.", tags: ["sự sống", "phước hạnh"] },
  { ref: "Thi Thiên 103:1-3", content: "Hỡi linh hồn ta, khá ngợi khen Đức Giê-hô-va! Mọi điều gì ở trong ta hãy ca tụng danh thánh của Ngài! Hỡi linh hồn ta, hãy ngợi khen Đức Giê-hô-va, chớ quên các ơn lành của Ngài.", tags: ["ngợi khen", "tạ ơn"] },
  { ref: "Ê-phê-sô 6:10-11", content: "Vả lại, anh em phải làm mạnh dạn trong Chúa, nhờ sức toàn năng của Ngài. Hãy mang lấy mọi khí giới của Đức Chúa Trời, để được đứng vững mà địch cùng mưu kế của ma quỉ.", tags: ["chiến trận", "sức mạnh"] },
  { ref: "Ma-thi-ơ 7:7", content: "Hãy xin, sẽ được; hãy tìm, sẽ gặp; hãy gõ cửa, sẽ mở cho.", tags: ["cầu nguyện", "đức tin"] },
  { ref: "Thi Thiên 150:6", content: "Phàm vật chi thở, hãy ngợi khen Đức Giê-hô-va! Ha-lê-lu-gia!", tags: ["ngợi khen"] },
  { ref: "Ê-sai 55:8-9", content: "Đức Giê-hô-va phán: Ý tưởng ta chẳng phải ý tưởng các ngươi, đường lối các ngươi chẳng phải đường lối ta. Vì các từng trời cao hơn đất bao nhiêu, thì đường lối ta cao hơn đường lối các ngươi, ý tưởng ta cao hơn ý tưởng các ngươi cũng bấy nhiêu.", tags: ["khôn ngoan", "tin cậy"] },
  { ref: "1 Phi-e-rơ 5:7", content: "Lại hãy trao mọi điều lo lắng mình cho Ngài, vì Ngài hay săn sóc anh em.", tags: ["bình an", "tin cậy"] },
  { ref: "Giăng 15:5", content: "Ta là gốc nho, các ngươi là nhánh. Ai cứ ở trong ta và ta trong họ thì sinh ra lắm trái; vì ngoài ta, các ngươi chẳng làm chi được.", tags: ["kết quả", "đức tin"] },
  { ref: "Châm Ngôn 22:6", content: "Hãy dạy cho trẻ thơ con đường nó phải theo; dầu khi nó trở về già, cũng không hề lìa khỏi đó.", tags: ["gia đình", "giáo dục"] },
  { ref: "Thi Thiên 51:10", content: "Đức Chúa Trời ơi, xin hãy dựng nên trong tôi một lòng trong sạch, làm cho mới lại trong tôi một thần linh ngay thẳng.", tags: ["ăn năn", "thánh khiết"] },
  { ref: "Rô-ma 6:23", content: "Vì tiền công của tội lỗi là sự chết; nhưng sự ban cho của Đức Chúa Trời là sự sống đời đời trong Đức Chúa Jêsus Christ, Chúa chúng ta.", tags: ["cứu rỗi", "ân điển"] },
  { ref: "Ma-thi-ơ 22:37-39", content: "Đức Chúa Jêsus đáp rằng: Ngươi hãy hết lòng, hết linh hồn, hết ý mà yêu mến Chúa, là Đức Chúa Trời ngươi. Ấy là điều răn thứ nhất và lớn hơn hết. Còn điều răn thứ hai giống như vậy: Ngươi hãy yêu kẻ lân cận như mình.", tags: ["tình yêu", "điều răn"] },
  { ref: "Giăng 16:33", content: "Ta đã bảo các ngươi những điều đó, hầu cho các ngươi có lòng bình an trong ta. Các ngươi sẽ có sự hoạn nạn trong thế gian, nhưng hãy cứ vững lòng, ta đã thắng thế gian rồi!", tags: ["bình an", "chiến thắng"] },
  { ref: "Thi Thiên 19:1", content: "Các từng trời rao truyền sự vinh hiển của Đức Chúa Trời, bầu trời giãi tỏ công việc tay Ngài làm.", tags: ["sáng tạo", "ngợi khen"] },
  { ref: "Ê-sai 26:3", content: "Người nào có lòng vững bền, thì Chúa sẽ gìn giữ người trong sự bình yên trọn vẹn, vì người nhờ cậy Chúa.", tags: ["bình an", "tin cậy"] },
  { ref: "Châm Ngôn 4:23", content: "Khá cẩn thận giữ tấm lòng của con hơn hết, vì các nguồn sự sống do nơi nó mà ra.", tags: ["khôn ngoan", "tấm lòng"] },
  { ref: "Giăng 11:25-26", content: "Đức Chúa Jêsus phán rằng: Ta là sự sống lại và sự sống; kẻ nào tin ta thì sẽ sống, mặc dầu đã chết rồi. Còn ai sống và tin ta thì không hề chết.", tags: ["sự sống", "phục sinh"] },
  { ref: "Thi Thiên 55:22", content: "Hãy trao gánh nặng ngươi cho Đức Giê-hô-va, Ngài sẽ nâng đỡ ngươi; Ngài sẽ chẳng hề cho người công bình bị rúng động.", tags: ["tin cậy", "an ủi"] },
  { ref: "Rô-ma 15:13", content: "Vậy xin Đức Chúa Trời của sự trông cậy, làm cho anh em đầy dẫy mọi điều vui vẻ và mọi điều bình an trong đức tin, hầu cho anh em nhờ quyền phép Đức Thánh Linh được dư dật sự trông cậy.", tags: ["hy vọng", "vui mừng"] },
  { ref: "2 Cô-rinh-tô 12:9", content: "Nhưng Chúa phán rằng: Ân điển ta đủ cho ngươi rồi, vì sức mạnh của ta nên trọn vẹn trong sự yếu đuối.", tags: ["ân điển", "sức mạnh"] },
  { ref: "Hê-bơ-rơ 13:5", content: "Chớ tham tiền; hãy lấy điều mình có làm đủ rồi, vì chính Đức Chúa Trời có phán rằng: Ta sẽ chẳng lìa ngươi đâu, chẳng bỏ ngươi đâu.", tags: ["tin cậy", "bình an"] },
  { ref: "Ma-thi-ơ 5:3-4", content: "Phước cho những kẻ có lòng khó khăn, vì nước thiên đàng là của những kẻ ấy! Phước cho những kẻ than khóc, vì sẽ được yên ủi!", tags: ["phước hạnh", "an ủi"] },
  { ref: "Gia-cơ 1:2-3", content: "Hỡi anh em, hãy coi sự thử thách trăm bề thoạt đến cho anh em như là điều vui mừng trọn vẹn, vì biết rằng sự thử thách đức tin anh em sanh ra sự nhịn nhục.", tags: ["thử thách", "đức tin"] },
  { ref: "1 Tê-sa-lô-ni-ca 5:16-18", content: "Hãy vui mừng mãi mãi, cầu nguyện không thôi, phàm làm việc gì cũng phải tạ ơn Chúa; vì ý muốn của Đức Chúa Trời trong Đức Chúa Jêsus Christ đối với anh em là vậy.", tags: ["vui mừng", "tạ ơn"] },
  { ref: "Thi Thiên 100:4-5", content: "Hãy cảm tạ mà vào các cửa Ngài, hãy ngợi khen mà vào hành lang Ngài. Khá cảm tạ Ngài, chúc tụng danh của Ngài. Vì Đức Giê-hô-va là thiện; sự nhân từ Ngài còn đến đời đời.", tags: ["ngợi khen", "tạ ơn"] },
  { ref: "Giăng 13:34-35", content: "Ta ban cho các ngươi một điều răn mới, nghĩa là các ngươi phải yêu nhau; như ta đã yêu các ngươi thể nào, thì các ngươi cũng hãy yêu nhau thể ấy.", tags: ["tình yêu", "điều răn"] },
  { ref: "Thi Thiên 42:11", content: "Hỡi linh hồn ta, cớ sao ngươi sờn ngã? Cớ sao ngươi bồn chồn trong ta? Hãy trông cậy nơi Đức Chúa Trời; ta sẽ còn ngợi khen Ngài nữa; Ngài là sự cứu rỗi của mặt ta, và là Đức Chúa Trời ta.", tags: ["hy vọng", "an ủi"] },
  { ref: "Ê-sai 43:2", content: "Khi ngươi vượt qua các dòng nước, ta sẽ ở cùng; khi ngươi lội qua sông, sẽ chẳng ngập. Khi ngươi bước qua lửa, sẽ chẳng bị cháy, ngọn lửa chẳng đốt ngươi.", tags: ["bảo vệ", "tin cậy"] },
  { ref: "Châm Ngôn 16:3", content: "Hãy phó các việc mình cho Đức Giê-hô-va, thì những mưu ý mình sẽ được thành công.", tags: ["hướng dẫn", "tin cậy"] },
  { ref: "Rô-ma 1:16", content: "Thật vậy, tôi không hổ thẹn về Tin Lành đâu, vì là quyền phép của Đức Chúa Trời để cứu mọi kẻ tin.", tags: ["Tin Lành", "cứu rỗi"] },
  { ref: "Ma-thi-ơ 19:26", content: "Đức Chúa Jêsus ngó môn đồ mà phán rằng: Điều đó loài người không thể làm được, nhưng Đức Chúa Trời làm mọi việc đều được.", tags: ["đức tin", "quyền năng"] },
  { ref: "Thi Thiên 23:4", content: "Dầu khi tôi đi trong trũng bóng chết, tôi sẽ chẳng sợ tai họa nào; vì Chúa ở cùng tôi: Cây trượng và cây gậy của Chúa an ủi tôi.", tags: ["bình an", "bảo vệ"] },
  { ref: "Cô-lô-se 3:23", content: "Hễ làm việc gì, hãy hết lòng mà làm, như làm cho Chúa, chớ không phải làm cho người ta.", tags: ["phục vụ", "siêng năng"] },
  { ref: "Ê-sai 40:29", content: "Ngài ban sức mạnh cho kẻ nhọc nhằn, thêm lực lượng cho kẻ chẳng có sức.", tags: ["sức mạnh", "giúp đỡ"] },
  { ref: "1 Giăng 1:9", content: "Còn nếu chúng ta xưng tội mình, thì Ngài là thành tín công bình để tha tội cho chúng ta, và làm cho chúng ta sạch mọi điều gian ác.", tags: ["tha thứ", "ăn năn"] },
  { ref: "Thi Thiên 118:24", content: "Nầy là ngày Đức Giê-hô-va làm nên, chúng tôi sẽ mừng rỡ và vui vẻ trong ngày ấy.", tags: ["vui mừng", "tạ ơn"] },
  { ref: "Giăng 14:27", content: "Ta để sự bình an lại cho các ngươi; ta ban sự bình an ta cho các ngươi; ta cho các ngươi sự bình an chẳng phải như thế gian cho. Lòng các ngươi chớ bối rối và đừng sợ hãi.", tags: ["bình an"] },
  { ref: "Châm Ngôn 31:25", content: "Sức lực và oai phong làm áo xống cho người; người cười nhạo ngày sau.", tags: ["phụ nữ", "sức mạnh"] },
  { ref: "Gia-cơ 4:7", content: "Vậy hãy phục Đức Chúa Trời; hãy chống trả ma quỉ, thì nó sẽ lánh xa anh em.", tags: ["chiến trận", "đức tin"] },
  { ref: "Ma-thi-ơ 18:20", content: "Vì nơi nào có hai ba người nhân danh ta nhóm nhau lại, thì ta ở giữa họ.", tags: ["thờ phượng", "hiệp một"] },
  { ref: "Hê-bơ-rơ 12:1-2", content: "Thế thì, vì chúng ta được nhiều người chứng kiến vây lấy như đám mây rất lớn, chúng ta cũng nên quăng hết gánh nặng và tội lỗi dễ vấn vương ta, lấy lòng nhịn nhục theo đòi cuộc chạy đua đã bày ra cho ta.", tags: ["đức tin", "kiên nhẫn"] },
  { ref: "Thi Thiên 16:11", content: "Chúa sẽ chỉ cho tôi biết con đường sự sống; trước mặt Chúa có trọn sự khoái lạc, bên tay hữu Chúa có điều vui sướng vô cùng.", tags: ["vui mừng", "sự sống"] },
  { ref: "Rô-ma 12:12", content: "Hãy vui mừng trong sự trông cậy, nhịn nhục trong sự hoạn nạn, bền lòng mà cầu nguyện.", tags: ["hy vọng", "cầu nguyện"] },
  { ref: "Ê-sai 12:2", content: "Nầy, Đức Chúa Trời là sự cứu rỗi tôi; tôi sẽ tin cậy và không sợ hãi. Vì Đức Giê-hô-va, chính Đức Giê-hô-va, là sức mạnh tôi, là bài ca của tôi; Ngài đã nên sự cứu rỗi tôi.", tags: ["cứu rỗi", "can đảm"] },
  { ref: "1 Cô-rinh-tô 10:13", content: "Không có sự cám dỗ nào đến với anh em mà vượt quá sức loài người. Đức Chúa Trời là thành tín, Ngài chẳng hề cho anh em bị cám dỗ quá sức mình đâu.", tags: ["thử thách", "trung tín"] },
  { ref: "Giăng 6:35", content: "Đức Chúa Jêsus phán rằng: Ta là bánh của sự sống; ai đến cùng ta chẳng hề đói, và ai tin ta chẳng hề khát.", tags: ["sự sống", "đức tin"] },
  { ref: "Thi Thiên 145:18", content: "Đức Giê-hô-va ở gần mọi người cầu khẩn Ngài, tức ở gần mọi người có lòng thành thực cầu khẩn Ngài.", tags: ["cầu nguyện", "gần gũi"] },
  { ref: "2 Sử Ký 7:14", content: "Nếu dân ta, là dân gọi bằng danh ta, hạ mình xuống, cầu nguyện, tìm kiếm mặt ta, và trở lại, bỏ con đường tà, thì ta sẽ ở trên trời nhậm lời, tha thứ tội chúng nó, và cứu xứ chúng nó khỏi tai vạ.", tags: ["ăn năn", "cầu nguyện"] },
  { ref: "Ê-phê-sô 3:20", content: "Vả, Đức Chúa Trời, bởi quyền lực cảm động trong chúng ta, có thể làm trổi hơn vô cùng mọi việc chúng ta cầu xin hoặc suy tưởng.", tags: ["quyền năng", "đức tin"] },
  { ref: "Ma-thi-ơ 6:25-26", content: "Vậy nên ta phán cùng các ngươi rằng: Đừng vì sự sống mình mà lo đồ ăn uống; cũng đừng vì thân thể mình mà lo đồ mặc. Sự sống há chẳng quí trọng hơn đồ ăn sao, thân thể há chẳng quí trọng hơn quần áo sao?", tags: ["bình an", "tin cậy"] },
  { ref: "Thi Thiên 4:8", content: "Hỡi Đức Giê-hô-va, tôi được nằm và ngủ bình an; vì chỉ một mình Ngài làm cho tôi được ở yên ổn.", tags: ["bình an", "nghỉ ngơi"] },
  { ref: "Châm Ngôn 11:25", content: "Lòng rộng rãi sẽ được no nê; còn ai nhuần gội, chính mình cũng sẽ được nhuần gội.", tags: ["rộng rãi", "phước hạnh"] },
  { ref: "Rô-ma 8:1", content: "Cho nên hiện nay chẳng còn có sự đoán phạt nào cho những kẻ ở trong Đức Chúa Jêsus Christ.", tags: ["tự do", "ân điển"] },
  { ref: "Giăng 4:14", content: "Nhưng uống nước ta sẽ cho, thì chẳng hề khát nữa. Nước ta cho sẽ thành một mạch nước trong người đó, văng ra cho đến sự sống đời đời.", tags: ["sự sống", "Thánh Linh"] },
  { ref: "Thi Thiên 33:4", content: "Vì lời Đức Giê-hô-va là ngay thẳng, mọi công việc Ngài đều làm cách thành tín.", tags: ["trung tín", "lời Chúa"] },
  { ref: "Ê-sai 9:5", content: "Vì có một con trẻ sanh cho chúng ta, tức là một con trai ban cho chúng ta; quyền cai trị sẽ nấy trên vai Ngài. Ngài sẽ được xưng là Đấng Lạ lùng, là Đấng Mưu luận, là Đức Chúa Trời Quyền năng, là Cha Đời đời, là Chúa Bình an.", tags: ["Chúa Jêsus", "Giáng Sinh"] },
  { ref: "1 Phi-e-rơ 2:9", content: "Nhưng anh em là dòng giống được lựa chọn, là chức thầy tế lễ nhà vua, là dân thánh, là dân thuộc về Đức Chúa Trời.", tags: ["danh phận", "kêu gọi"] },
  { ref: "Ma-thi-ơ 5:44", content: "Song ta nói cùng các ngươi rằng: Hãy yêu kẻ thù nghịch, và cầu nguyện cho kẻ bắt bớ các ngươi.", tags: ["tình yêu", "tha thứ"] },
  { ref: "Thi Thiên 62:1-2", content: "Linh hồn tôi lặng lẽ chờ đợi Đức Chúa Trời; sự cứu rỗi tôi từ nơi Ngài mà đến. Chỉ một mình Ngài là hòn đá tôi, sự cứu rỗi tôi, và là nơi cao của tôi; tôi sẽ chẳng bị rúng động nhiều.", tags: ["tin cậy", "kiên nhẫn"] },
  { ref: "Châm Ngôn 16:9", content: "Lòng người toan định đường lối mình; song Đức Giê-hô-va chỉ dẫn các bước của người.", tags: ["hướng dẫn"] },
  { ref: "Ga-la-ti 2:20", content: "Tôi đã bị đóng đinh vào thập tự giá với Đấng Christ, mà tôi sống, không phải là tôi sống nữa, nhưng Đấng Christ sống trong tôi.", tags: ["đức tin", "biến đổi"] },
  { ref: "Giăng 14:1", content: "Lòng các ngươi chớ hề bối rối; hãy tin Đức Chúa Trời, cũng hãy tin ta nữa.", tags: ["bình an", "đức tin"] },
  { ref: "Thi Thiên 73:26", content: "Thịt và lòng tôi bị tiêu hao; nhưng Đức Chúa Trời là sức lực của lòng tôi, và là phần tôi đến đời đời.", tags: ["sức mạnh", "tin cậy"] },
  { ref: "Ê-sai 43:18-19", content: "Đừng nhớ lại sự đã qua, và chớ nghĩ đến sự đời trước. Nầy, ta sắp làm một việc mới, việc ấy sẽ hiện ra ngay; các ngươi há chẳng biết sao?", tags: ["đổi mới", "hy vọng"] },
  { ref: "1 Giăng 4:4", content: "Hỡi các con cái bé mọn, phần các con, các con thuộc về Đức Chúa Trời, đã thắng được chúng nó rồi, vì Đấng ở trong các con lớn hơn kẻ ở trong thế gian.", tags: ["chiến thắng", "sức mạnh"] },
  { ref: "Ma-thi-ơ 11:29-30", content: "Ta có lòng nhu mì, khiêm nhường; nên hãy gánh lấy ách của ta, và học theo ta; thì linh hồn các ngươi sẽ được yên nghỉ. Vì ách ta dễ chịu và gánh ta nhẹ nhàng.", tags: ["bình an", "khiêm nhường"] },
  { ref: "Rô-ma 8:31", content: "Đã vậy thì chúng ta sẽ nói làm sao? Nếu Đức Chúa Trời vùa giúp chúng ta, thì còn ai nghịch với chúng ta?", tags: ["chiến thắng", "tin cậy"] },
  { ref: "Hê-bơ-rơ 4:16", content: "Vậy, chúng ta hãy vững lòng đến gần ngôi ơn phước, hầu cho được thương xót và tìm được ơn để giúp chúng ta trong thì giờ có cần dùng.", tags: ["ân điển", "cầu nguyện"] },
  { ref: "Thi Thiên 147:3", content: "Ngài chữa lành kẻ đau thương trong lòng, và bó vết thương của họ.", tags: ["chữa lành", "an ủi"] },
  { ref: "Ê-phê-sô 4:32", content: "Hãy ở với nhau cách nhân từ, đầy dẫy lòng thương xót, tha thứ nhau như Đức Chúa Trời đã tha thứ anh em trong Đấng Christ vậy.", tags: ["tha thứ", "nhân từ"] },
  { ref: "Giăng 8:12", content: "Đức Chúa Jêsus lại cất tiếng phán cùng chúng rằng: Ta là sự sáng của thế gian; người nào theo ta, chẳng đi trong nơi tối tăm, nhưng có ánh sáng của sự sống.", tags: ["ánh sáng", "Chúa Jêsus"] },
  { ref: "Châm Ngôn 3:9-10", content: "Hãy lấy tài vật và huê lợi đầu mùa của con mà tôn vinh Đức Giê-hô-va; vậy, các vựa lẫm con sẽ đầy dư dật, và các thùng con sẽ tràn rượu mới.", tags: ["dâng hiến", "phước hạnh"] },
  { ref: "1 Cô-rinh-tô 15:58", content: "Vậy, hỡi anh em yêu dấu của tôi, hãy vững vàng chớ rúng động, hãy làm công việc Chúa cách dư dật luôn, vì biết rằng công khó của anh em trong Chúa chẳng phải là vô ích đâu.", tags: ["phục vụ", "kiên nhẫn"] },
  { ref: "Thi Thiên 8:3-4", content: "Khi tôi nhìn xem các từng trời là công việc của ngón tay Chúa, mặt trăng và các ngôi sao mà Chúa đã đặt, loài người là gì mà Chúa nhớ đến? Con loài người là chi mà Chúa thăm viếng nó?", tags: ["sáng tạo", "ngợi khen"] },
  { ref: "Ma-thi-ơ 6:9-13", content: "Lạy Cha chúng tôi ở trên trời; danh Cha được thánh; nước Cha được đến; ý Cha được nên, ở đất như trời! Xin cho chúng tôi hôm nay đồ ăn đủ ngày. Xin tha tội lỗi cho chúng tôi, như chúng tôi cũng tha kẻ phạm tội nghịch cùng chúng tôi.", tags: ["cầu nguyện"] },
  { ref: "Rô-ma 3:23-24", content: "Vì mọi người đều đã phạm tội, thiếu mất sự vinh hiển của Đức Chúa Trời, và họ nhờ ân điển Ngài mà được xưng công bình nhưng không, bởi sự chuộc tội đã làm trọn trong Đức Chúa Jêsus Christ.", tags: ["cứu rỗi", "ân điển"] },
  { ref: "Ê-sai 58:11", content: "Đức Giê-hô-va sẽ cứ dắt dẫn ngươi; làm cho ngươi no lòng giữa nơi khô hạn lớn, và làm cho xương cốt ngươi mạnh. Ngươi sẽ như vườn đượm nước tưới, như suối nước không hề khô.", tags: ["hướng dẫn", "phước hạnh"] },
  { ref: "1 Ti-mô-thê 6:6", content: "Vả, sự tin kính cùng sự thỏa lòng, ấy là một lợi lớn.", tags: ["thỏa lòng", "tin kính"] },
  { ref: "Giăng 17:17", content: "Xin Cha lấy lẽ thật khiến họ nên thánh; lời Cha tức là lẽ thật.", tags: ["thánh khiết", "lời Chúa"] },
  { ref: "Thi Thiên 90:12", content: "Cầu xin Chúa dạy chúng tôi biết đếm các ngày chúng tôi, hầu cho chúng tôi được lòng khôn ngoan.", tags: ["khôn ngoan", "thời gian"] },
  { ref: "Châm Ngôn 27:17", content: "Sắt mài nhọn sắt. Cũng vậy người bổ dưỡng dung mạo bạn hữu mình.", tags: ["tình bạn", "xây dựng"] },
  { ref: "Ê-phê-sô 2:10", content: "Vì chúng ta là việc Ngài làm ra, đã được dựng nên trong Đức Chúa Jêsus Christ để làm việc lành mà Đức Chúa Trời đã sắm sẵn trước cho chúng ta làm theo.", tags: ["mục đích", "kêu gọi"] },
  { ref: "Ma-thi-ơ 17:20", content: "Nếu các ngươi có đức tin bằng một hạt cải, sẽ khiến núi nầy rằng: Hãy dời đi chỗ kia, thì nó liền dời đi, và không có sự gì mà các ngươi chẳng làm được.", tags: ["đức tin", "quyền năng"] },
  { ref: "Thi Thiên 84:11", content: "Vì Giê-hô-va Đức Chúa Trời là mặt trời và là cái thuẫn; Đức Giê-hô-va sẽ ban ân điển và vinh hiển; Ngài sẽ chẳng từ chối điều tốt lành gì cho ai ăn ở ngay thẳng.", tags: ["phước hạnh", "ân điển"] },
  { ref: "1 Giăng 3:1", content: "Hãy xem Đức Chúa Cha đã tỏ cho chúng ta sự yêu thương dường nào, mà cho chúng ta được xưng là con cái Đức Chúa Trời.", tags: ["tình yêu", "danh phận"] },
  { ref: "Rô-ma 12:1", content: "Vậy, hỡi anh em, tôi lấy sự thương xót của Đức Chúa Trời khuyên anh em dâng thân thể mình làm của lễ sống và thánh, đẹp lòng Đức Chúa Trời, ấy là sự thờ phượng phải lẽ của anh em.", tags: ["thờ phượng", "dâng hiến"] },
  { ref: "Giê-rê-mi 33:3", content: "Hãy kêu cầu ta, ta sẽ trả lời cho; ta sẽ tỏ cho ngươi những việc lớn và khó, là những việc ngươi chưa từng biết.", tags: ["cầu nguyện", "khải thị"] },
  { ref: "Ma-thi-ơ 7:24-25", content: "Vậy, kẻ nào nghe và làm theo lời ta phán đây, thì giống như một người khôn ngoan cất nhà mình trên hòn đá. Có mưa sa, nước chảy, gió lay, xô động nhà ấy; song không sập, vì đã cất trên đá.", tags: ["khôn ngoan", "vững vàng"] },
  { ref: "Thi Thiên 37:5", content: "Hãy phó thác đường lối mình cho Đức Giê-hô-va, và nhờ cậy nơi Ngài, thì Ngài sẽ làm thành việc ấy.", tags: ["tin cậy", "hướng dẫn"] },
  { ref: "2 Ti-mô-thê 3:16", content: "Cả Kinh Thánh đều là bởi Đức Chúa Trời soi dẫn, có ích cho sự dạy dỗ, bẻ trách, sửa trị, dạy người trong sự công bình.", tags: ["lời Chúa", "dạy dỗ"] },
  { ref: "Ê-sai 40:8", content: "Cỏ khô, hoa rụng; nhưng lời của Đức Chúa Trời chúng ta còn mãi đời đời!", tags: ["lời Chúa", "vĩnh cửu"] },
  { ref: "Giăng 15:13", content: "Chẳng có sự yêu thương nào lớn hơn là vì bạn hữu mà phó sự sống mình.", tags: ["tình yêu", "hy sinh"] },
  { ref: "Châm Ngôn 19:21", content: "Trong lòng loài người có nhiều mưu kế; song ý chỉ của Đức Giê-hô-va, ấy mới được thành tựu.", tags: ["hướng dẫn", "ý Chúa"] },
  { ref: "1 Cô-rinh-tô 16:13-14", content: "Hãy tỉnh thức, hãy vững vàng trong đức tin, hãy dốc chí trượng phu, hãy mạnh mẽ. Mọi điều anh em làm, hãy lấy lòng yêu thương mà làm.", tags: ["sức mạnh", "tình yêu"] },
  { ref: "Ma-thi-ơ 28:6", content: "Ngài không ở đây đâu; Ngài sống lại rồi, như lời Ngài đã phán.", tags: ["phục sinh", "vui mừng"] },
  { ref: "Thi Thiên 40:1-2", content: "Tôi đã nhịn nhục trông đợi Đức Giê-hô-va; Ngài nghiêng qua nghe tiếng kêu cầu của tôi. Ngài cũng đem tôi lên khỏi hầm gớm ghê, khỏi vũng bùn lầy, đặt chân tôi trên hòn đá, và làm cho bước tôi vững bền.", tags: ["kiên nhẫn", "giải cứu"] },
  { ref: "Rô-ma 8:18", content: "Vả, tôi tưởng rằng những sự đau đớn bây giờ chẳng đáng so sánh với sự vinh hiển ngày sau sẽ được bày ra trong chúng ta.", tags: ["hy vọng", "vinh hiển"] },
  { ref: "Ê-phê-sô 1:7", content: "Ấy là trong Đấng Christ, chúng ta được cứu chuộc bởi huyết Ngài, được tha tội, theo sự dư dật của ân điển Ngài.", tags: ["cứu rỗi", "ân điển"] },
  { ref: "Giê-rê-mi 17:7-8", content: "Đáng chúc phước thay là kẻ nhờ cậy Đức Giê-hô-va, và lấy Đức Giê-hô-va làm sự trông cậy mình. Nó cũng như một cái cây trồng nơi bờ suối, đâm rễ theo dòng nước.", tags: ["tin cậy", "phước hạnh"] },
  { ref: "Thi Thiên 30:5", content: "Vì sự giận Ngài chỉ trong một lúc, còn ơn Ngài có trọn một đời. Sự khóc lóc đến trọ ban đêm, nhưng buổi sáng bèn có sự vui mừng.", tags: ["hy vọng", "vui mừng"] },
  { ref: "Ma-thi-ơ 5:9", content: "Phước cho những kẻ làm cho người hòa thuận, vì sẽ được gọi là con Đức Chúa Trời!", tags: ["hòa bình", "phước hạnh"] },
  { ref: "Giăng 3:3", content: "Đức Chúa Jêsus cất tiếng đáp rằng: Quả thật, quả thật, ta nói cùng ngươi, nếu một người chẳng sanh lại, thì không thể thấy được nước Đức Chúa Trời.", tags: ["tái sinh", "cứu rỗi"] },
  { ref: "Châm Ngôn 15:1", content: "Lời đáp êm nhẹ làm nguôi cơn giận; còn lời xẳng xớm trêu thạnh nộ thêm.", tags: ["khôn ngoan", "lời nói"] },
  { ref: "Ê-sai 30:21", content: "Khi các ngươi xoay bên hữu hay bên tả, tai các ngươi sẽ nghe có tiếng đằng sau mình rằng: Nầy là đường đây, hãy noi theo!", tags: ["hướng dẫn"] },
  { ref: "Hê-bơ-rơ 10:25", content: "Chớ bỏ sự nhóm lại như mấy kẻ quen làm, nhưng phải khuyên bảo nhau, và hễ anh em thấy ngày ấy hầu gần chừng nào, thì càng phải làm như vậy chừng nấy.", tags: ["hội thánh", "hiệp một"] },
  { ref: "Thi Thiên 138:8", content: "Đức Giê-hô-va sẽ làm xong việc thuộc về tôi. Hỡi Đức Giê-hô-va, sự nhân từ Ngài còn đến đời đời. Xin chớ bỏ công việc tay Ngài.", tags: ["tin cậy", "hoàn tất"] },
  { ref: "Rô-ma 10:17", content: "Như vậy, đức tin đến bởi sự người ta nghe, mà người ta nghe, là khi lời của Đấng Christ được rao giảng.", tags: ["đức tin", "lời Chúa"] },
  { ref: "1 Phi-e-rơ 3:15", content: "Nhưng hãy tôn Đấng Christ, là Chúa, làm thánh trong lòng mình. Hãy thường thường sẵn sàng để trả lời mọi kẻ hỏi lẽ về sự trông cậy trong anh em.", tags: ["làm chứng", "đức tin"] },
  { ref: "Ma-thi-ơ 5:6", content: "Phước cho những kẻ đói khát sự công bình, vì sẽ được no đủ!", tags: ["phước hạnh", "công bình"] },
  { ref: "Giăng 5:24", content: "Quả thật, quả thật, ta nói cùng các ngươi, ai nghe lời ta mà tin Đấng đã sai ta, thì được sự sống đời đời, và không đến sự phán xét, song đã vượt khỏi sự chết mà đến sự sống rồi.", tags: ["sự sống", "cứu rỗi"] },
  { ref: "Thi Thiên 46:10", content: "Hãy yên lặng và biết rằng ta là Đức Chúa Trời; ta sẽ được tôn cao trong các nước, cũng sẽ được tôn cao trên đất.", tags: ["bình an", "thờ phượng"] },
  { ref: "Châm Ngôn 3:3-4", content: "Chớ để sự nhân từ và sự chân thật lìa bỏ con; hãy đeo nó nơi cổ, viết nó trên bảng lòng con; vậy, con sẽ được ơn và có sự khôn sáng trước mặt Đức Chúa Trời và loài người.", tags: ["nhân từ", "khôn ngoan"] },
  { ref: "Ê-sai 54:10", content: "Dầu núi dời, dầu đồi chuyển, nhưng lòng nhân từ ta đối với ngươi sẽ không dời khỏi ngươi, lời giao ước bình an của ta sẽ chẳng chuyển, Đức Giê-hô-va, là Đấng thương xót ngươi, phán vậy.", tags: ["tình yêu", "giao ước"] },
  { ref: "Ga-la-ti 6:9", content: "Chớ mệt nhọc về sự làm lành, vì nếu chúng ta không trễ nải, thì đến kỳ chúng ta sẽ gặt.", tags: ["kiên nhẫn", "phước hạnh"] },
  { ref: "Giăng 14:15", content: "Nếu các ngươi yêu mến ta, thì giữ gìn các điều răn ta.", tags: ["vâng lời", "tình yêu"] },
  { ref: "1 Giăng 5:14", content: "Nầy là điều chúng ta dạn dĩ ở trước mặt Chúa, nếu chúng ta theo ý muốn Ngài mà cầu xin việc gì, thì Ngài nghe chúng ta.", tags: ["cầu nguyện", "tin cậy"] },
  { ref: "Thi Thiên 23:6", content: "Quả thật, trọn đời tôi phước hạnh và sự thương xót sẽ theo tôi; tôi sẽ ở trong nhà Đức Giê-hô-va cho đến lâu dài.", tags: ["phước hạnh", "bình an"] },
  { ref: "Rô-ma 14:8", content: "Vì nếu chúng ta sống, là sống cho Chúa, và nếu chúng ta chết, là chết cho Chúa. Vậy nên chúng ta hoặc sống hoặc chết, đều thuộc về Chúa cả.", tags: ["sống cho Chúa", "dâng hiến"] },
  { ref: "Ma-thi-ơ 5:13", content: "Các ngươi là muối của đất; song nếu muối mất mặn đi, thì lấy giống chi làm cho mặn lại?", tags: ["sứ mệnh", "ảnh hưởng"] },
  { ref: "Hê-bơ-rơ 11:6", content: "Vả, không có đức tin, thì chẳng hề có thể nào ở cho vừa lòng Đức Chúa Trời; vì kẻ đến gần Đức Chúa Trời phải tin rằng có Đức Chúa Trời, và Ngài là Đấng hay thưởng cho kẻ tìm kiếm Ngài.", tags: ["đức tin"] },
  { ref: "Ê-phê-sô 6:12", content: "Vì chúng ta đánh trận, chẳng phải cùng thịt và huyết, bèn là cùng chủ quyền, cùng thế lực, cùng vua chúa của thế gian mờ tối nầy, cùng các thần dữ ở các miền trên trời vậy.", tags: ["chiến trận", "tâm linh"] },
  { ref: "Châm Ngôn 1:7", content: "Sự kính sợ Đức Giê-hô-va là khởi đầu sự tri thức; còn kẻ ngu muội khinh bỉ sự khôn ngoan và lời khuyên dạy.", tags: ["khôn ngoan", "kính sợ Chúa"] },
  { ref: "Thi Thiên 56:3-4", content: "Trong ngày sợ hãi, tôi sẽ nhờ cậy nơi Chúa. Tôi nhờ Đức Chúa Trời, và ngợi khen lời của Ngài; tôi để lòng tin cậy nơi Đức Chúa Trời, ắt sẽ chẳng sợ gì; loài xác thịt sẽ làm chi tôi?", tags: ["can đảm", "tin cậy"] },
  { ref: "Giăng 1:12", content: "Nhưng hễ ai đã nhận Ngài, thì Ngài ban cho quyền phép trở nên con cái Đức Chúa Trời, là ban cho những kẻ tin danh Ngài.", tags: ["danh phận", "cứu rỗi"] },
  { ref: "Ê-sai 61:1", content: "Thần của Chúa Giê-hô-va ngự trên ta, vì Đức Giê-hô-va đã xức dầu cho ta, đặng giảng tin lành cho kẻ khiêm nhường.", tags: ["kêu gọi", "Thánh Linh"] },
  { ref: "1 Cô-rinh-tô 2:9", content: "Song le, như có chép rằng: Ấy là sự mắt chưa thấy, tai chưa nghe, và lòng người chưa nghĩ đến, nhưng Đức Chúa Trời đã sắm sẵn điều ấy cho những người yêu mến Ngài.", tags: ["hy vọng", "thiên đàng"] },
  { ref: "Ma-thi-ơ 6:34", content: "Vậy, chớ lo lắng chi về ngày mai; vì ngày mai sẽ lo về việc ngày mai. Sự khó nhọc ngày nào đủ cho ngày ấy.", tags: ["bình an", "tin cậy"] },
  { ref: "Thi Thiên 32:8", content: "Ta sẽ dạy dỗ ngươi, chỉ cho ngươi con đường phải đi; mắt ta sẽ chăm chú ngươi mà khuyên dạy ngươi.", tags: ["hướng dẫn", "dạy dỗ"] },
  { ref: "Rô-ma 15:4", content: "Vả, mọi sự đã chép từ xưa đều để dạy dỗ chúng ta, hầu cho chúng ta nhờ sự nhịn nhục và sự yên ủi của Kinh Thánh mà có sự trông cậy.", tags: ["lời Chúa", "hy vọng"] },
  { ref: "Giê-rê-mi 31:3", content: "Phải, ta đã lấy sự yêu thương đời đời mà yêu ngươi; nên đã lấy sự nhân từ mà kéo ngươi.", tags: ["tình yêu"] },
  { ref: "Châm Ngôn 12:25", content: "Sự buồn rầu ở trong lòng người làm cho nao sờn; nhưng một lời lành làm cho vui vẻ.", tags: ["an ủi", "lời nói"] },
  { ref: "2 Cô-rinh-tô 4:16-17", content: "Vậy nên chúng tôi chẳng ngã lòng, dầu người bề ngoài hư nát, nhưng người bề trong cứ đổi mới càng ngày càng hơn. Vì sự hoạn nạn nhẹ và tạm của chúng tôi sanh cho chúng tôi sự vinh hiển cao trọng đời đời.", tags: ["hy vọng", "kiên nhẫn"] },
  { ref: "Thi Thiên 1:1-2", content: "Phước cho người nào chẳng theo mưu kế của kẻ dữ, chẳng đứng trong đường tội nhân, không ngồi chỗ của kẻ nhạo báng; song lấy làm vui vẻ về luật pháp của Đức Giê-hô-va, và suy gẫm luật pháp ấy ngày và đêm.", tags: ["phước hạnh", "lời Chúa"] },
  { ref: "Giăng 20:31", content: "Nhưng các việc nầy đã chép, để cho các ngươi tin rằng Đức Chúa Jêsus là Đấng Christ, Con Đức Chúa Trời, và để khi các ngươi tin, thì nhờ danh Ngài mà được sự sống.", tags: ["đức tin", "sự sống"] },
  { ref: "Ê-sai 1:18", content: "Đức Giê-hô-va phán: Bây giờ hãy đến, cho chúng ta biện luận cùng nhau. Dầu tội các ngươi như hồng điều, sẽ trở nên trắng như tuyết; dầu đỏ như son, sẽ trở nên trắng như lông chiên.", tags: ["tha thứ", "ân điển"] },
  { ref: "Ma-thi-ơ 16:24", content: "Đức Chúa Jêsus bèn phán cùng môn đồ rằng: Nếu ai muốn theo ta, phải liều mình, vác thập tự giá mình mà theo ta.", tags: ["môn đồ", "hy sinh"] },
  { ref: "Thi Thiên 95:1-2", content: "Hãy đến hát xướng cho Đức Giê-hô-va, cất tiếng mừng rỡ cho hòn đá về sự cứu rỗi chúng tôi! Chúng ta hãy lấy sự cảm tạ mà đến trước mặt Ngài, hãy lấy bài thơ ca mà reo mừng cho Ngài.", tags: ["ngợi khen", "thờ phượng"] },
  { ref: "Ê-phê-sô 3:16-17", content: "Tôi cầu xin Ngài tùy sự giàu có vinh hiển Ngài khiến anh em được nên mạnh mẽ bởi Thánh Linh Ngài trong người bề trong, và nhờ đức tin, Đấng Christ ngự trong lòng anh em.", tags: ["Thánh Linh", "sức mạnh"] },
  { ref: "Châm Ngôn 14:26", content: "Trong sự kính sợ Đức Giê-hô-va có nơi nương cậy vững chắc; và con cái Ngài sẽ được nơi ẩn núp.", tags: ["kính sợ Chúa", "bảo vệ"] },
  { ref: "Giăng 14:2-3", content: "Trong nhà Cha ta có nhiều chỗ ở; bằng chẳng vậy, ta đã nói cho các ngươi rồi. Ta đi sắm sẵn cho các ngươi một chỗ. Khi ta đã đi, và đã sắm sẵn cho các ngươi một chỗ rồi, ta sẽ trở lại đem các ngươi đi với ta.", tags: ["thiên đàng", "hy vọng"] },
  { ref: "Rô-ma 5:3-4", content: "Nào những thế thôi, nhưng chúng ta cũng khoe mình trong hoạn nạn nữa, vì biết rằng hoạn nạn sanh sự nhịn nhục, sự nhịn nhục sanh sự rèn tập, sự rèn tập sanh sự trông cậy.", tags: ["thử thách", "hy vọng"] },
  { ref: "Thi Thiên 107:1", content: "Hãy ngợi khen Đức Giê-hô-va, vì Ngài là thiện; sự nhân từ Ngài còn đến đời đời.", tags: ["ngợi khen", "nhân từ"] },
  { ref: "Mi-chê 6:8", content: "Hỡi người! Ngài đã tỏ cho ngươi điều gì là thiện; cái điều mà Đức Giê-hô-va đòi ngươi há chẳng phải là làm sự công bình, ưa sự nhân từ và bước đi cách khiêm nhường với Đức Chúa Trời ngươi sao?", tags: ["công bình", "khiêm nhường"] },
  { ref: "Giăng 15:16", content: "Ấy chẳng phải các ngươi đã chọn ta, bèn là ta đã chọn và lập các ngươi, để các ngươi đi và kết quả, hầu cho trái các ngươi thường đậu luôn.", tags: ["kêu gọi", "kết quả"] },
  { ref: "Ma-thi-ơ 11:28-30", content: "Hỡi những kẻ mệt mỏi và gánh nặng, hãy đến cùng ta, ta sẽ cho các ngươi được yên nghỉ. Ta có lòng nhu mì, khiêm nhường; nên hãy gánh lấy ách của ta, và học theo ta.", tags: ["bình an", "nghỉ ngơi"] },
  { ref: "Ê-sai 46:4", content: "Cho đến chừng các ngươi già cả, đầu bạc, ta cũng sẽ bồng ẵm các ngươi. Ta đã tạo nên, ta sẽ gánh vác; ta sẽ bồng ẵm và giải cứu các ngươi.", tags: ["tin cậy", "chăm sóc"] },
  { ref: "Thi Thiên 143:8", content: "Xin cho tôi nghe sự nhân từ Chúa vào buổi sáng, vì tôi để lòng tin cậy nơi Chúa. Xin chỉ cho tôi biết con đường phải đi, vì linh hồn tôi ngưỡng vọng Chúa.", tags: ["hướng dẫn", "buổi sáng"] },
  { ref: "1 Giăng 4:18", content: "Quyết chẳng có điều sợ hãi trong sự yêu thương, nhưng sự yêu thương trọn vẹn thì cất bỏ sự sợ hãi.", tags: ["tình yêu", "can đảm"] },
  { ref: "2 Phi-e-rơ 3:9", content: "Chúa không chậm trễ về lời hứa của Ngài như mấy người kia tưởng đâu, nhưng Ngài lấy lòng nhịn nhục đối với anh em, không muốn cho một người nào chết mất, song muốn cho mọi người đều ăn năn.", tags: ["nhịn nhục", "cứu rỗi"] },
  { ref: "Thi Thiên 63:1", content: "Đức Chúa Trời ơi, Chúa là Đức Chúa Trời tôi, vừa sáng tôi tìm cầu Chúa; trong một đất khô khan, cực nhọc, chẳng có nước, linh hồn tôi khát khao Chúa.", tags: ["khao khát", "tìm kiếm"] },
  { ref: "Châm Ngôn 16:24", content: "Lời nói êm dịu giống như tàng ong, ngọt cho linh hồn và khỏe mạnh cho xương cốt.", tags: ["lời nói", "khôn ngoan"] },
  { ref: "Rô-ma 8:26", content: "Cũng một lẽ ấy, Đức Thánh Linh giúp cho sự yếu đuối chúng ta. Vì chúng ta chẳng biết sự mình phải xin đặng cầu nguyện cho xứng đáng; nhưng chính Đức Thánh Linh lấy sự thở than không thể nói ra được mà cầu khẩn thay cho chúng ta.", tags: ["Thánh Linh", "cầu nguyện"] },
  { ref: "Khải Huyền 3:20", content: "Nầy, ta đứng ngoài cửa mà gõ; nếu ai nghe tiếng ta mà mở cửa cho, thì ta sẽ vào cùng người ấy, ăn bữa tối với người, và người với ta.", tags: ["mời gọi", "thông công"] },
  { ref: "Ma-thi-ơ 21:22", content: "Trong khi cầu nguyện, các ngươi lấy đức tin xin việc gì bất kỳ, thảy đều được cả.", tags: ["cầu nguyện", "đức tin"] },
  { ref: "Thi Thiên 86:5", content: "Vì, Chúa ơi, Chúa là thiện, sẵn tha thứ cho, ban sự nhân từ dư dật cho mọi người cầu khẩn cùng Chúa.", tags: ["tha thứ", "nhân từ"] },
  { ref: "Ê-phê-sô 4:2-3", content: "Phải khiêm nhường đến điều, mềm mại đến điều, phải nhịn nhục, lấy lòng thương yêu mà chìu nhau, dùng dây hòa bình mà giữ gìn sự hiệp một của Thánh Linh.", tags: ["hiệp một", "khiêm nhường"] },
  { ref: "Sáng Thế Ký 1:27", content: "Đức Chúa Trời dựng nên loài người như hình Ngài; Ngài dựng nên loài người giống như hình Đức Chúa Trời; Ngài dựng nên người nam cùng người nữ.", tags: ["sáng tạo", "danh phận"] },
  { ref: "Giăng 4:24", content: "Đức Chúa Trời là Thần, nên ai thờ phượng Ngài thì phải lấy tâm thần và lẽ thật mà thờ phượng.", tags: ["thờ phượng", "lẽ thật"] },
  { ref: "Châm Ngôn 31:30", content: "Duyên là giả dối, sắc lại hư không; nhưng người nữ nào kính sợ Đức Giê-hô-va sẽ được khen ngợi.", tags: ["phụ nữ", "kính sợ Chúa"] },
  { ref: "Rô-ma 11:33", content: "Ôi! sâu nhiệm thay là sự giàu có, khôn ngoan và thông biết của Đức Chúa Trời! Sự phán xét của Ngài nào có thể dò, đường nẻo của Ngài nào có thể tìm được!", tags: ["khôn ngoan", "ngợi khen"] },
  { ref: "Thi Thiên 127:1", content: "Nếu Đức Giê-hô-va không cất nhà, thì những thợ xây cất làm uổng công. Nhược bằng Đức Giê-hô-va không coi giữ thành, thì người canh thức canh luống công.", tags: ["tin cậy", "gia đình"] },
  { ref: "Ma-thi-ơ 4:4", content: "Đức Chúa Jêsus đáp: Có lời chép rằng: Người ta sống chẳng phải chỉ nhờ bánh mà thôi, song nhờ mọi lời nói ra từ miệng Đức Chúa Trời.", tags: ["lời Chúa", "đức tin"] },
  { ref: "Hê-bơ-rơ 13:8", content: "Đức Chúa Jêsus Christ hôm qua, ngày nay, và cho đến đời đời không hề thay đổi.", tags: ["trung tín", "Chúa Jêsus"] },
  { ref: "Ê-sai 40:28", content: "Ngươi không biết sao, không nghe sao? Đức Chúa Trời hằng sống, Đức Giê-hô-va, là Đấng đã dựng nên các đầu cùng đất, chẳng mỏi chẳng mệt; sự khôn ngoan Ngài không thể dò.", tags: ["quyền năng", "vĩnh cửu"] },
  { ref: "1 Phi-e-rơ 1:3", content: "Chúc tụng Đức Chúa Trời, là Cha Đức Chúa Jêsus Christ chúng ta, Ngài lấy lòng thương xót cả thể khiến chúng ta lại sanh, đặng chúng ta nhờ sự Đức Chúa Jêsus Christ sống lại từ trong kẻ chết mà có sự trông cậy sống.", tags: ["hy vọng", "tái sinh"] },
  { ref: "Giăng 15:7", content: "Ví bằng các ngươi cứ ở trong ta, và những lời ta ở trong các ngươi, hãy cầu xin mọi điều mình muốn, thì sẽ được điều đó.", tags: ["cầu nguyện", "ở trong Chúa"] },
  { ref: "Châm Ngôn 17:22", content: "Lòng vui mừng vốn một phương thuốc hay; còn trí nao sờn làm xương cốt khô héo.", tags: ["vui mừng", "sức khỏe"] },
  { ref: "Thi Thiên 18:2", content: "Đức Giê-hô-va là hòn đá tôi, đồn lũy tôi, Đấng giải cứu tôi; Đức Chúa Trời là hòn đá tôi, nơi tôi nương náu mình; Ngài là cái thuẫn tôi, sừng cứu rỗi tôi, và là nơi ẩn trú cao của tôi.", tags: ["bảo vệ", "sức mạnh"] },
  { ref: "Rô-ma 12:21", content: "Đừng để điều ác thắng mình, nhưng hãy lấy điều thiện thắng điều ác.", tags: ["chiến thắng", "phẩm hạnh"] },
  { ref: "Ma-thi-ơ 5:7", content: "Phước cho những kẻ hay thương xót, vì sẽ được thương xót!", tags: ["phước hạnh", "thương xót"] },
  { ref: "Ê-phê-sô 5:25", content: "Hỡi những người chồng, hãy yêu vợ mình, như Đấng Christ đã yêu Hội thánh, phó chính mình vì Hội thánh.", tags: ["hôn nhân", "tình yêu"] },
  { ref: "Khải Huyền 21:4", content: "Ngài sẽ lau ráo hết nước mắt khỏi mắt chúng, sẽ không có sự chết, cũng không có than khóc, kêu ca, hay là đau đớn nữa; vì những sự thứ nhất đã qua rồi.", tags: ["thiên đàng", "hy vọng"] },
  { ref: "Thi Thiên 34:8", content: "Khá nếm thử xem Đức Giê-hô-va tốt lành dường bao! Phước cho người nào nương náu mình nơi Ngài!", tags: ["phước hạnh", "kinh nghiệm"] },
  { ref: "Giăng 3:36", content: "Ai tin Con, thì được sự sống đời đời; ai không chịu tin Con, thì chẳng thấy sự sống đâu, nhưng cơn thạnh nộ của Đức Chúa Trời vẫn ở trên người đó.", tags: ["cứu rỗi", "đức tin"] },
  { ref: "Ê-sai 40:11", content: "Ngài sẽ chăn bầy mình như người chăn chiên; thâu các chiên con vào cánh tay mình và ẵm vào lòng; từ từ dắt các chiên cái đương cho bú.", tags: ["chăm sóc", "nhân từ"] },
  { ref: "1 Cô-rinh-tô 3:16", content: "Anh em há chẳng biết mình là đền thờ của Đức Chúa Trời, và Thánh Linh Đức Chúa Trời ở trong anh em sao?", tags: ["Thánh Linh", "danh phận"] },
  { ref: "Châm Ngôn 2:6", content: "Vì Đức Giê-hô-va ban cho sự khôn ngoan; từ miệng Ngài ra điều tri thức và thông sáng.", tags: ["khôn ngoan", "lời Chúa"] },
  { ref: "Thi Thiên 115:13-14", content: "Ngài sẽ ban phước cho những kẻ kính sợ Đức Giê-hô-va, ban phước cho kẻ nhỏ và kẻ lớn. Nguyện Đức Giê-hô-va gia thêm phước cho các ngươi, cho các ngươi và cho con cháu các ngươi.", tags: ["phước hạnh", "gia đình"] },
  { ref: "Ma-thi-ơ 5:8", content: "Phước cho những kẻ có lòng trong sạch, vì sẽ thấy Đức Chúa Trời!", tags: ["phước hạnh", "thánh khiết"] },
  { ref: "Rô-ma 13:10", content: "Sự yêu thương chẳng hề gây hại cho kẻ lân cận mình; vậy yêu thương là sự làm trọn luật pháp.", tags: ["tình yêu", "luật pháp"] },
  { ref: "Giê-rê-mi 1:5", content: "Trước khi ta chưa dựng nên ngươi trong lòng mẹ, ta đã biết ngươi rồi; trước khi ngươi chưa ra khỏi lòng mẹ, ta đã biệt riêng ngươi, lập ngươi làm kẻ tiên tri cho các nước.", tags: ["kêu gọi", "mục đích"] },
  { ref: "Phi-líp 1:6", content: "Tôi tin chắc rằng Đấng đã khởi làm việc lành trong anh em, sẽ làm trọn hết cho đến ngày của Đức Chúa Jêsus Christ.", tags: ["tin cậy", "hoàn tất"] },
  { ref: "Thi Thiên 46:5", content: "Đức Chúa Trời ở giữa thành ấy; thành ấy sẽ không bị rúng động. Vừa rạng đông Đức Chúa Trời sẽ giúp đỡ thành ấy.", tags: ["bảo vệ", "giúp đỡ"] },
  { ref: "Ê-sai 41:13", content: "Vì ta, Giê-hô-va Đức Chúa Trời ngươi, sẽ nắm tay hữu ngươi, và phán cùng ngươi rằng: Đừng sợ, ta sẽ giúp đỡ ngươi.", tags: ["an ủi", "giúp đỡ"] },
  { ref: "Giăng 8:36", content: "Vậy nếu Con buông tha các ngươi, các ngươi sẽ thật được tự do.", tags: ["tự do", "cứu rỗi"] },
  { ref: "Châm Ngôn 3:13-14", content: "Phước cho người nào tìm được sự khôn ngoan, và cho người nào được sự thông sáng! Vì thà được sự khôn ngoan hơn là được bạc, huê lợi nó sanh ra tốt hơn vàng ròng.", tags: ["khôn ngoan", "phước hạnh"] },
  { ref: "1 Tê-sa-lô-ni-ca 4:16-17", content: "Vì chính Chúa sẽ từ trời giáng xuống cùng tiếng kêu lớn, tiếng của thiên sứ lớn cùng tiếng kèn của Đức Chúa Trời, thì những kẻ chết trong Đấng Christ sẽ sống lại trước hết.", tags: ["tái lâm", "hy vọng"] },
  { ref: "Thi Thiên 145:9", content: "Đức Giê-hô-va làm lành cho muôn người, sự từ bi Ngài giáng trên các vật Ngài đã làm.", tags: ["nhân từ", "ngợi khen"] },
  { ref: "Ma-thi-ơ 9:37-38", content: "Ngài bèn phán cùng môn đồ rằng: Mùa gặt thì thật trúng, song con gặt thì ít. Vậy, hãy cầu nguyện Chúa mùa gặt sai con gặt đến trong mùa mình.", tags: ["sứ mệnh", "cầu nguyện"] },
  { ref: "Hê-bơ-rơ 11:3", content: "Bởi đức tin, chúng ta biết rằng thế gian đã làm nên bởi lời của Đức Chúa Trời, đến nỗi những vật bày ra đó đều chẳng phải từ vật thấy được mà đến.", tags: ["đức tin", "sáng tạo"] },
  { ref: "Rô-ma 8:37", content: "Trái lại, trong mọi sự đó, chúng ta nhờ Đấng yêu thương mình mà thắng hơn bội phần.", tags: ["chiến thắng", "tình yêu"] },
  { ref: "Ê-phê-sô 6:13", content: "Vậy nên, hãy lấy mọi khí giới của Đức Chúa Trời, hầu cho trong ngày khốn nạn, anh em có thể cự địch và khi thắng hơn mọi sự rồi, anh em được đứng vững vàng.", tags: ["chiến trận", "vững vàng"] },
  { ref: "Giăng 14:16-17", content: "Ta lại sẽ nài xin Cha, Ngài sẽ ban cho các ngươi một Đấng Yên ủi khác, để ở với các ngươi đời đời, tức là Thần lẽ thật.", tags: ["Thánh Linh", "an ủi"] },
  { ref: "Thi Thiên 23:5", content: "Chúa dọn bàn cho tôi trước mặt kẻ thù nghịch tôi; Chúa xức dầu cho đầu tôi, chén tôi đầy tràn.", tags: ["phước hạnh", "bảo vệ"] },
  { ref: "Ê-sai 53:3", content: "Người đã bị người ta khinh dể và chán bỏ, từng trải sự buồn bực, biết sự đau ốm, bị khinh như kẻ mà người ta che mặt chẳng thèm xem.", tags: ["Chúa Jêsus", "hy sinh"] },
  { ref: "Châm Ngôn 16:32", content: "Kẻ nào chậm nóng giận thắng hơn người dõng sĩ; và ai cai trị lòng mình thắng hơn kẻ chiếm lấy thành.", tags: ["tự chủ", "khôn ngoan"] },
  { ref: "Ga-la-ti 6:2", content: "Hãy mang lấy gánh nặng cho nhau, như vậy anh em sẽ làm trọn luật pháp của Đấng Christ.", tags: ["yêu thương", "phục vụ"] },
  { ref: "Ma-thi-ơ 7:12", content: "Ấy vậy, hễ điều chi mà các ngươi muốn người ta làm cho mình, thì cũng hãy làm điều đó cho họ, vì ấy là luật pháp và lời tiên tri.", tags: ["tình yêu", "luật vàng"] },
  { ref: "Thi Thiên 119:11", content: "Tôi đã giấu lời Chúa trong lòng tôi, để tôi không phạm tội cùng Chúa.", tags: ["lời Chúa", "thánh khiết"] },
  { ref: "Khải Huyền 1:8", content: "Chúa là Đức Chúa Trời, Đấng hiện có, đã có, và còn đến, là Đấng Toàn năng, phán rằng: Ta là An-pha và Ô-mê-ga.", tags: ["quyền năng", "vĩnh cửu"] },
  { ref: "Rô-ma 12:9-10", content: "Lòng yêu thương phải cho thành thật. Hãy gớm sự dữ mà mến sự lành. Hãy lấy lòng yêu thương mềm mại mà yêu nhau như anh em; hãy lấy sự kính nhường nhau.", tags: ["tình yêu", "phẩm hạnh"] },
  { ref: "1 Cô-rinh-tô 13:13", content: "Nên bây giờ còn có ba điều nầy: đức tin, sự trông cậy, tình yêu thương; nhưng điều trọng hơn trong ba điều đó là tình yêu thương.", tags: ["tình yêu", "đức tin"] },
  { ref: "Giăng 14:26", content: "Nhưng Đấng Yên ủi, tức là Đức Thánh Linh mà Cha sẽ nhân danh ta sai xuống, Đấng ấy sẽ dạy dỗ các ngươi mọi sự, nhắc lại cho các ngươi nhớ mọi điều ta đã phán cùng các ngươi.", tags: ["Thánh Linh", "dạy dỗ"] },
  { ref: "Thi Thiên 37:23-24", content: "Đức Giê-hô-va định liệu các bước của người, và Ngài thích đường lối người. Dầu người té, cũng không nằm sải dài; vì Đức Giê-hô-va lấy tay nâng đỡ người.", tags: ["hướng dẫn", "nâng đỡ"] },
  { ref: "Châm Ngôn 18:21", content: "Sống chết ở nơi quyền của lưỡi; kẻ ái mộ nó sẽ ăn bông trái của nó.", tags: ["lời nói", "khôn ngoan"] },
  { ref: "2 Cô-rinh-tô 9:7", content: "Mỗi người nên tùy theo lòng mình đã định mà quyên ra, không phải phàn nàn hay vì ép uổng; vì Đức Chúa Trời yêu kẻ dâng của cách vui lòng.", tags: ["dâng hiến", "vui mừng"] },
];

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // 1. Create or get category
    const { data: existingCat } = await supabase
      .from("blog_categories")
      .select("id")
      .eq("slug", "loi-chua")
      .maybeSingle();

    let categoryId: string;
    if (existingCat) {
      categoryId = existingCat.id;
    } else {
      const { data: newCat, error: catErr } = await supabase
        .from("blog_categories")
        .insert({ name: "Lời Chúa", slug: "loi-chua", icon: "✝️", sort_order: 10 })
        .select("id")
        .single();
      if (catErr) throw catErr;
      categoryId = newCat.id;
    }

    // 2. Insert verses in batches
    const batchSize = 50;
    let inserted = 0;
    const now = Date.now();
    const sixMonths = 180 * 24 * 60 * 60 * 1000;

    for (let i = 0; i < verses.length; i += batchSize) {
      const batch = verses.slice(i, i + batchSize).map((v, idx) => {
        const randomTime = new Date(now - Math.random() * sixMonths).toISOString();
        const slug = v.ref.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") + "-" + (i + idx);
        return {
          title: v.ref,
          content: v.content,
          excerpt: v.content.length > 120 ? v.content.substring(0, 120) + "..." : v.content,
          slug,
          status: "published",
          category_id: categoryId,
          published_at: randomTime,
          tags: v.tags,
        };
      });

      const { error } = await supabase.from("blog_posts").insert(batch);
      if (error) throw error;
      inserted += batch.length;
    }

    return new Response(JSON.stringify({ success: true, inserted, categoryId }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
