import { pinyin } from 'pinyin-pro'
import { RAW_EXTRA } from './vocab-extra'
import { RAW_EXTRA_2 } from './vocab-extra-2'

export type Level = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'Native'
export type Category =
  | 'basics'
  | 'people'
  | 'food'
  | 'travel'
  | 'work'
  | 'tech'
  | 'feelings'
  | 'health'
  | 'society'
  | 'shopping'
  | 'idiom'
  | 'slang'

export interface Word {
  id: number
  zh: string
  py: string
  en: string
  vi: string
  lvl: Level
  cat: Category
}

export const LEVELS: Level[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'Native']
export const CATEGORIES: Category[] = [
  'basics',
  'people',
  'food',
  'travel',
  'shopping',
  'work',
  'tech',
  'feelings',
  'health',
  'society',
  'idiom',
  'slang',
]

// Format: zh | English | Tiếng Việt  — grouped by level and category.
const RAW: Record<Level, Partial<Record<Category, string[]>>> = {
  A1: {
    basics: [
      '你好|Hello|Xin chào',
      '谢谢|Thank you|Cảm ơn',
      '不客气|You are welcome|Không có gì',
      '对不起|Sorry|Xin lỗi',
      '没关系|It is okay|Không sao',
      '再见|Goodbye|Tạm biệt',
      '请|Please|Xin mời / làm ơn',
      '是|To be / yes|Là / vâng',
      '不|No / not|Không',
      '好|Good|Tốt',
      '大|Big|Lớn',
      '小|Small|Nhỏ',
      '今天|Today|Hôm nay',
      '明天|Tomorrow|Ngày mai',
      '昨天|Yesterday|Hôm qua',
      '现在|Now|Bây giờ',
      '什么|What|Cái gì',
      '谁|Who|Ai',
      '哪里|Where|Ở đâu',
      '多少钱|How much?|Bao nhiêu tiền?',
      '一|One|Một',
      '二|Two|Hai',
      '三|Three|Ba',
      '十|Ten|Mười',
      '百|Hundred|Trăm',
    ],
    people: [
      '我|I / me|Tôi',
      '你|You|Bạn',
      '他|He / him|Anh ấy',
      '她|She / her|Cô ấy',
      '我们|We / us|Chúng tôi',
      '朋友|Friend|Bạn bè',
      '家人|Family|Gia đình',
      '妈妈|Mom|Mẹ',
      '爸爸|Dad|Bố',
      '老师|Teacher|Giáo viên',
      '学生|Student|Học sinh',
      '孩子|Child|Đứa trẻ',
    ],
    food: [
      '水|Water|Nước',
      '茶|Tea|Trà',
      '咖啡|Coffee|Cà phê',
      '米饭|Cooked rice|Cơm',
      '面条|Noodles|Mì',
      '苹果|Apple|Quả táo',
      '鸡蛋|Egg|Trứng gà',
      '吃|To eat|Ăn',
      '喝|To drink|Uống',
      '好吃|Delicious|Ngon',
    ],
    travel: [
      '去|To go|Đi',
      '来|To come|Đến',
      '家|Home|Nhà',
      '学校|School|Trường học',
      '中国|China|Trung Quốc',
      '越南|Vietnam|Việt Nam',
    ],
    feelings: [
      '喜欢|To like|Thích',
      '爱|To love|Yêu',
      '想|To want / to think|Muốn / nghĩ',
      '高兴|Happy|Vui mừng',
    ],
    work: [
      '看|To look / to watch|Nhìn / xem',
      '听|To listen|Nghe',
      '说|To speak|Nói',
      '学习|To study|Học tập',
      '写|To write|Viết',
      '读|To read|Đọc',
    ],
  },
  A2: {
    travel: [
      '旅行|Travel|Du lịch',
      '火车|Train|Tàu hỏa',
      '飞机|Airplane|Máy bay',
      '机场|Airport|Sân bay',
      '护照|Passport|Hộ chiếu',
      '酒店|Hotel|Khách sạn',
      '地铁|Subway|Tàu điện ngầm',
      '出租车|Taxi|Taxi',
      '地图|Map|Bản đồ',
      '行李|Luggage|Hành lý',
      '签证|Visa|Thị thực',
      '景点|Tourist attraction|Điểm tham quan',
    ],
    basics: [
      '天气|Weather|Thời tiết',
      '下雨|To rain|Mưa',
      '热|Hot|Nóng',
      '冷|Cold|Lạnh',
      '周末|Weekend|Cuối tuần',
      '生日|Birthday|Sinh nhật',
      '颜色|Color|Màu sắc',
      '红色|Red|Màu đỏ',
      '蓝色|Blue|Màu xanh dương',
      '问题|Question / problem|Câu hỏi / vấn đề',
    ],
    work: [
      '工作|Work / job|Công việc',
      '公司|Company|Công ty',
      '同事|Colleague|Đồng nghiệp',
      '开会|To have a meeting|Họp',
      '帮助|To help|Giúp đỡ',
      '需要|To need|Cần',
      '开始|To begin|Bắt đầu',
      '结束|To end|Kết thúc',
    ],
    tech: [
      '电话|Telephone|Điện thoại',
      '手机|Mobile phone|Điện thoại di động',
      '电脑|Computer|Máy tính',
      '电视|Television|Ti vi',
    ],
    health: [
      '医院|Hospital|Bệnh viện',
      '医生|Doctor|Bác sĩ',
      '生病|To get sick|Bị ốm',
      '头疼|Headache|Đau đầu',
      '药|Medicine|Thuốc',
      '休息|To rest|Nghỉ ngơi',
    ],
    shopping: [
      '超市|Supermarket|Siêu thị',
      '衣服|Clothes|Quần áo',
      '鞋子|Shoes|Giày',
      '买|To buy|Mua',
      '便宜|Cheap|Rẻ',
      '贵|Expensive|Đắt',
      '礼物|Gift|Quà tặng',
    ],
    feelings: [
      '明白|To understand|Hiểu',
      '忘记|To forget|Quên',
      '记得|To remember|Nhớ',
      '打算|To plan|Dự định',
      '邀请|To invite|Mời',
      '电影|Movie|Phim',
      '音乐|Music|Âm nhạc',
      '运动|Sports / exercise|Thể thao',
    ],
  },
  B1: {
    society: [
      '经济|Economy|Kinh tế',
      '文化|Culture|Văn hóa',
      '传统|Tradition|Truyền thống',
      '历史|History|Lịch sử',
      '社会|Society|Xã hội',
      '环境|Environment|Môi trường',
      '改善|To improve|Cải thiện',
      '关系|Relationship|Mối quan hệ',
      '影响|Influence / to affect|Ảnh hưởng',
      '习惯|Habit|Thói quen',
    ],
    work: [
      '经验|Experience|Kinh nghiệm',
      '机会|Opportunity|Cơ hội',
      '决定|To decide / decision|Quyết định',
      '申请|To apply|Xin / nộp đơn',
      '面试|Interview|Phỏng vấn',
      '简历|Résumé|Sơ yếu lý lịch',
      '工资|Salary|Tiền lương',
      '目标|Goal|Mục tiêu',
      '计划|Plan|Kế hoạch',
      '方法|Method|Phương pháp',
      '预订|To book|Đặt trước',
      '取消|To cancel|Hủy bỏ',
      '通知|Notice / to notify|Thông báo',
    ],
    feelings: [
      '重要|Important|Quan trọng',
      '压力|Pressure / stress|Áp lực',
      '担心|To worry|Lo lắng',
      '满意|Satisfied|Hài lòng',
      '失望|Disappointed|Thất vọng',
      '成功|Success|Thành công',
      '失败|Failure|Thất bại',
      '努力|To work hard|Nỗ lực',
    ],
    basics: [
      '比较|To compare / rather|So sánh / khá',
      '解释|To explain|Giải thích',
      '讨论|To discuss|Thảo luận',
      '同意|To agree|Đồng ý',
      '反对|To oppose|Phản đối',
      '建议|Suggestion|Đề nghị',
    ],
    health: [
      '健康|Health / healthy|Sức khỏe',
      '锻炼|To exercise|Rèn luyện',
      '营养|Nutrition|Dinh dưỡng',
      '睡眠|Sleep|Giấc ngủ',
    ],
    tech: [
      '网络|Network / internet|Mạng internet',
      '软件|Software|Phần mềm',
      '下载|To download|Tải xuống',
      '密码|Password|Mật khẩu',
      '安全|Safe / security|An toàn',
      '隐私|Privacy|Quyền riêng tư',
    ],
  },
  B2: {
    work: [
      '挑战|Challenge|Thách thức',
      '效率|Efficiency|Hiệu suất',
      '竞争|Competition|Cạnh tranh',
      '合作|Cooperation|Hợp tác',
      '谈判|Negotiation|Đàm phán',
      '合同|Contract|Hợp đồng',
      '预算|Budget|Ngân sách',
      '投资|Investment|Đầu tư',
      '风险|Risk|R��i ro',
      '利润|Profit|Lợi nhuận',
      '市���|Market|Thị trường',
      '创新|Innovation|Đổi mới',
      '通货膨胀|Inflation|Lạm phát',
    ],
    tech: [
      '技术|Technology|Công nghệ',
      '人工智能|Artificial intelligence|Trí tuệ nhân tạo',
      '数据|Data|Dữ liệu',
      '分析|Analysis|Phân tích',
      '算法|Algorithm|Thuật toán',
    ],
    society: [
      '观点|Viewpoint|Quan điểm',
      '持续|To continue / sustained|Duy trì / liên tục',
      '趋势|Trend|Xu hướng',
      '责任|Responsibility|Trách nhiệm',
      '义务|Obligation|Nghĩa vụ',
      '权利|Right|Quyền lợi',
      '公平|Fair|Công bằng',
      '平衡|Balance|Cân bằng',
      '尊重|Respect|Tôn trọng',
      '偏见|Prejudice|Định kiến',
      '评估|To assess|Đánh giá',
    ],
    basics: [
      '可靠|Reliable|Đáng tin cậy',
      '灵活|Flexible|Linh hoạt',
      '逐渐|Gradually|Dần dần',
      '至少|At least|Ít nhất',
    ],
  },
  C1: {
    society: [
      '可持续发展|Sustainable development|Phát triển bền vững',
      '全球化|Globalization|Toàn cầu hóa',
      '多元化|Diversification / pluralism|Đa dạng hóa',
      '局限性|Limitation|Tính hạn chế',
      '悖论|Paradox|Nghịch lý',
      '前所未有|Unprecedented|Chưa từng có',
      '潜移默化|To influence subtly over time|Thấm dần từng chút một',
    ],
    feelings: [
      '复杂性|Complexity|Tính phức tạp',
      '洞察力|Insight|Khả năng thấu hiểu',
      '适应能力|Adaptability|Khả năng thích ứng',
      '微妙|Subtle|Tinh tế / vi diệu',
      '矛盾|Contradiction|Mâu thuẫn',
    ],
    basics: [
      '不可否认|Undeniably|Không thể phủ nhận',
      '举足轻重|Of decisive importance|Có vai trò then chốt',
      '与时俱进|To keep pace with the times|Bắt kịp thời đại',
      '因地制宜|To adapt to local conditions|Tùy nơi mà liệu',
      '责无旁贷|Duty-bound|Trách nhiệm không thể chối bỏ',
    ],
    work: [
      '战略|Strategy|Chiến lược',
      '协调|To coordinate|Điều phối',
      '落实|To implement|Triển khai',
      '权衡|To weigh up|Cân nhắc',
    ],
  },
  Native: {
    idiom: [
      '一举两得|Kill two birds with one stone|Một mũi tên trúng hai đích',
      '画蛇添足|Gild the lily|Vẽ rắn thêm chân',
      '对牛弹琴|Cast pearls before swine|Đàn gảy tai trâu',
      '守株待兔|Wait for windfalls|Ôm cây đợi thỏ',
      '亡羊补牢|Better late than never|Mất bò mới lo làm chuồng',
      '塞翁失马|A blessing in disguise|Tái ông thất mã',
      '井底之蛙|A frog in a well|Ếch ngồi đáy giếng',
      '入乡随俗|When in Rome, do as the Romans do|Nhập gia tùy tục',
      '半途而废|To give up halfway|Bỏ dở giữa chừng',
      '画龙点睛|The finishing touch|Điểm nhãn cho rồng',
      '马马虎虎|So-so / careless|Tàm tạm / qua loa',
      '一见钟情|Love at first sight|Yêu từ cái nhìn đầu tiên',
      '雪中送炭|To help in time of need|Đưa than trong tuyết',
      '掩耳盗铃|To bury one\'s head in the sand|Bịt tai trộm chuông',
      '水到渠成|Things work out naturally|Nước chảy thành sông',
      '事半功倍|Double the result with half the effort|Làm ít được nhiều',
      '三天打鱼两天晒网|To work by fits and starts|Ba ngày đánh cá hai ngày phơi lưới',
      '胸有成竹|To have a plan in mind|Nắm chắc trong lòng',
    ],
    slang: [
      '加油|Come on! / Keep it up!|Cố lên!',
      '给力|Awesome / powerful|Tuyệt vời / mạnh mẽ',
      '靠谱|Reliable|Đáng tin cậy',
      '内卷|Involution / rat race|Cạnh tranh nội bộ đến kiệt sức',
      '躺平|To lie flat / to opt out|Sống buông, không chạy đua',
      '摸鱼|To slack off at work|Lười biếng / trốn việc',
      '打工人|Wage worker (self-mocking)|Dân làm công ăn lương',
      '吃瓜|To watch the drama unfold|Hóng drama',
      '社恐|Social anxiety|Sợ giao tiếp xã hội',
      '破防|To be emotionally moved / to lose composure|Bị chạm đến cảm xúc',
      '种草|To be sold on a product|Bị cuốn vào món đồ muốn mua',
      '佛系|Laid-back / easygoing|Sống thong thả, chẳng tranh giành',
      '接地气|Down to earth|Gần gũi, thực tế',
      '宝藏|Hidden gem|Báu vật / thứ đáng giá',
      '无语|Speechless|Cạn lời',
      '真香|Actually pretty good after all|Hóa ra lại thơm',
      '老铁|Bro / buddy|Anh em thân thiết',
      '够意思|Loyal / generous|Chịu chơi / nghĩa khí',
      '随便|Whatever / anything|Sao cũng được',
      '凑合|To make do|Tạm được / làm tạm',
      '唠嗑|To chat (Northeastern slang)|Tán gẫu',
      '没问题|No problem|Không thành vấn đề',
      '太棒了|Fantastic!|Tuyệt quá!',
    ],
  },
}

function build(): Word[] {
  const out: Word[] = []
  const seen = new Set<string>()
  let id = 0
  for (const source of [RAW, RAW_EXTRA, RAW_EXTRA_2]) {
  for (const lvl of LEVELS) {
    const cats = source[lvl]
    for (const cat of Object.keys(cats) as Category[]) {
      for (const line of cats[cat] ?? []) {
        const [zh, en, vi] = line.split('|')
        if (seen.has(zh)) continue
        seen.add(zh)
        out.push({
          id: id++,
          zh,
          py: pinyin(zh, { toneType: 'symbol' }),
          en,
          vi,
          lvl,
          cat,
        })
      }
    }
  }
  }
  return out
}

export const WORDS: Word[] = build()

export function stripPinyin(py: string) {
  return py
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ü/g, 'v')
    .replace(/\s+/g, '')
    .toLowerCase()
}
