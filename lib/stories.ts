import type { Level } from './vocab'

export interface Line {
  zh: string
  en: string
  vi: string
}

export interface Story {
  id: string
  level: Level
  hue: number
  glyph: string
  minutes: number
  title: { zh: string; en: string; vi: string }
  topic: { en: string; vi: string }
  lines: Line[]
}

export const STORIES: Story[] = [
  {
    id: 'coffee',
    level: 'A1',
    hue: 28,
    glyph: '茶',
    minutes: 2,
    title: { zh: '咖啡店的一天', en: 'A Day at the Café', vi: 'Một ngày ở quán cà phê' },
    topic: { en: 'Ordering & politeness', vi: 'Gọi món & giao tiếp lịch sự' },
    lines: [
      { zh: '今天是星期六。', en: 'Today is Saturday.', vi: 'Hôm nay là thứ Bảy.' },
      { zh: '小林去附近的咖啡店学习。', en: 'Xiaolin goes to a nearby café to study.', vi: 'Tiểu Lâm đến quán cà phê gần nhà để học.' },
      { zh: '他对店员说：“你好，我要一杯咖啡。”', en: 'He says to the staff, "Hello, I would like a coffee."', vi: 'Cậu nói với nhân viên: “Xin chào, cho tôi một ly cà phê.”' },
      { zh: '店员问：“还需要别的吗？”', en: 'The staff asks, "Anything else?"', vi: 'Nhân viên hỏi: “Bạn còn cần gì nữa không?”' },
      { zh: '小林想了想，说：“再来一块蛋糕。”', en: 'Xiaolin thinks for a moment and says, "One piece of cake as well."', vi: 'Tiểu Lâm nghĩ một lát rồi nói: “Cho thêm một miếng bánh.”' },
      { zh: '一共三十八块。', en: 'It comes to 38 yuan in total.', vi: 'Tổng cộng ba mươi tám tệ.' },
      { zh: '小林笑着说：“谢谢！”', en: 'Xiaolin smiles and says, "Thank you!"', vi: 'Tiểu Lâm mỉm cười nói: “Cảm ơn!”' },
    ],
  },
  {
    id: 'weekend',
    level: 'A2',
    hue: 190,
    glyph: '周',
    minutes: 3,
    title: { zh: '小明的周末', en: "Xiaoming's Weekend", vi: 'Cuối tuần của Tiểu Minh' },
    topic: { en: 'Hobbies & plans', vi: 'Sở thích & kế hoạch' },
    lines: [
      { zh: '周末的时候，小明通常不会起得太晚。', en: 'On weekends, Xiaoming usually does not get up too late.', vi: 'Cuối tuần, Tiểu Minh thường không dậy quá muộn.' },
      { zh: '上午，他和朋友一起去公园跑步。', en: 'In the morning, he goes running in the park with friends.', vi: 'Buổi sáng, cậu cùng bạn ra công viên chạy bộ.' },
      { zh: '跑完步，他们在路边买了冰水。', en: 'After running, they buy iced water by the roadside.', vi: 'Chạy xong, họ mua nước đá ở ven đường.' },
      { zh: '下午，他们回家看电影。', en: 'In the afternoon, they go home to watch a movie.', vi: 'Buổi chiều, họ về nhà xem phim.' },
      { zh: '他们还讨论了下个月的旅行计划。', en: "They also discuss next month's travel plan.", vi: 'Họ còn bàn về kế hoạch du lịch tháng sau.' },
      { zh: '小明说：“我想去台湾，你呢？”', en: 'Xiaoming says, "I want to go to Taiwan. How about you?"', vi: 'Tiểu Minh nói: “Mình muốn đi Đài Loan, còn bạn?”' },
      { zh: '朋友笑着回答：“我也想去，我们一起订机票吧！”', en: 'His friend answers with a smile, "I want to go too. Let\'s book the tickets together!"', vi: 'Người bạn cười đáp: “Mình cũng muốn đi, cùng đặt vé máy bay nhé!”' },
    ],
  },
  {
    id: 'night-market',
    level: 'A2',
    hue: 340,
    glyph: '夜',
    minutes: 3,
    title: { zh: '夜市奇遇', en: 'Night Market Adventure', vi: 'Một buổi tối ở chợ đêm' },
    topic: { en: 'Food & culture', vi: 'Ẩm thực & văn hóa' },
    lines: [
      { zh: '晚上七点，我和妹妹去夜市。', en: 'At seven in the evening, my younger sister and I go to the night market.', vi: 'Bảy giờ tối, tôi và em gái đi chợ đêm.' },
      { zh: '夜市里人很多，空气中都是好吃的味道。', en: 'The night market is crowded, and the air is full of delicious smells.', vi: 'Chợ đêm rất đông, không khí tràn ngập mùi đồ ăn thơm ngon.' },
      { zh: '我们先买了一杯珍珠奶茶。', en: 'First, we buy a bubble tea.', vi: 'Chúng tôi mua trước một ly trà sữa trân châu.' },
      { zh: '老板说：“今天的臭豆腐特别好吃，要不要试试？”', en: 'The vendor says, "The stinky tofu is especially good today. Want to try it?"', vi: 'Ông chủ nói: “Hôm nay đậu phụ thối đặc biệt ngon, bạn có muốn thử không?”' },
      { zh: '妹妹捏着鼻子说：“好臭啊！”', en: 'My sister pinches her nose and says, "It stinks!"', vi: 'Em gái bịt mũi nói: “Thối quá!”' },
      { zh: '可是吃了一口以后，她马上说：“真香！”', en: 'But after one bite, she immediately says, "It\'s actually delicious!"', vi: 'Nhưng ăn một miếng xong, em lập tức nói: “Thơm thật!”' },
      { zh: '我们一边走一边吃，玩得非常开心。', en: 'We walk and eat at the same time, having a wonderful time.', vi: 'Chúng tôi vừa đi vừa ăn, chơi rất vui.' },
    ],
  },
  {
    id: 'train',
    level: 'B1',
    hue: 160,
    glyph: '车',
    minutes: 4,
    title: { zh: '开往台南的火车', en: 'The Train to Tainan', vi: 'Chuyến tàu đến Đài Nam' },
    topic: { en: 'Travel & reflection', vi: 'Du lịch & suy ngẫm' },
    lines: [
      { zh: '第一次去台南的时候，我选择坐火车。', en: 'The first time I went to Tainan, I chose to take the train.', vi: 'Lần đầu đến Đài Nam, tôi chọn đi tàu hỏa.' },
      { zh: '一路上，我看到了很多不同的风景。', en: 'Along the way, I saw many different landscapes.', vi: 'Suốt dọc đường, tôi thấy rất nhiều phong cảnh khác nhau.' },
      { zh: '窗外有稻田、小镇，还有远处的山。', en: 'Outside the window were rice fields, small towns, and distant mountains.', vi: 'Ngoài cửa sổ có ruộng lúa, thị trấn nhỏ và những ngọn núi phía xa.' },
      { zh: '坐在我旁边的老奶奶给我讲了她年轻时的故事。', en: 'The old lady sitting next to me told me stories from her youth.', vi: 'Bà cụ ngồi cạnh kể cho tôi nghe chuyện thời trẻ của bà.' },
      { zh: '虽然旅程比我想象的长，但是我一点也不觉得无聊。', en: 'Although the journey was longer than I imagined, I did not feel bored at all.', vi: 'Dù hành trình dài hơn tôi tưởng, tôi chẳng thấy chán chút nào.' },
      { zh: '到站的时候，我忽然发现，这段时间让我真正放慢了生活的节奏。', en: 'When we arrived, I suddenly realized that this time had truly slowed down the pace of my life.', vi: 'Khi tàu đến ga, tôi chợt nhận ra khoảng thời gian ấy đã giúp tôi thực sự sống chậm lại.' },
    ],
  },
  {
    id: 'interview',
    level: 'B2',
    hue: 255,
    glyph: '职',
    minutes: 5,
    title: { zh: '重要的面试', en: 'The Big Interview', vi: 'Buổi phỏng vấn quan trọng' },
    topic: { en: 'Career & confidence', vi: 'Sự nghiệp & sự tự tin' },
    lines: [
      { zh: '面试前一天晚上，李华几乎没有睡着。', en: 'The night before the interview, Li Hua barely slept.', vi: 'Đêm trước buổi phỏng vấn, Lý Hoa gần như không ngủ được.' },
      { zh: '她反复练习自我介绍，生怕忘记任何重要的细节。', en: 'She rehearsed her self-introduction over and over, afraid of forgetting any important detail.', vi: 'Cô luyện đi luyện lại phần tự giới thiệu, sợ quên bất kỳ chi tiết quan trọng nào.' },
      { zh: '面试官问她：“你认为自己最大的优点是什么？”', en: 'The interviewer asks her, "What do you consider your greatest strength?"', vi: 'Người phỏng vấn hỏi cô: “Bạn cho rằng ưu điểm lớn nhất của mình là gì?”' },
      { zh: '她停顿了一下，认真地回答：“我善于在压力下解决问题。”', en: 'She pauses for a moment and answers earnestly, "I am good at solving problems under pressure."', vi: 'Cô dừng lại một chút rồi nghiêm túc đáp: “Tôi giỏi giải quyết vấn đề dưới áp lực.”' },
      { zh: '面试官点点头，又问：“能举一个具体的例子吗？”', en: 'The interviewer nods and asks, "Can you give a specific example?"', vi: 'Người phỏng vấn gật đầu, hỏi tiếp: “Bạn có thể nêu một ví dụ cụ thể không?”' },
      { zh: '李华讲起了去年她如何带领团队在三天内完成一个紧急项目。', en: 'Li Hua described how last year she led her team to complete an urgent project in three days.', vi: 'Lý Hoa kể về việc năm ngoái cô dẫn dắt nhóm hoàn thành một dự án khẩn cấp trong ba ngày.' },
      { zh: '走出大楼时，她虽然还不知道结果，但是心里踏实多了。', en: 'Walking out of the building, although she did not yet know the result, she felt much more at ease.', vi: 'Bước ra khỏi tòa nhà, dù chưa biết kết quả, lòng cô đã yên tâm hơn nhiều.' },
    ],
  },
  {
    id: 'rabbit',
    level: 'Native',
    hue: 45,
    glyph: '兔',
    minutes: 5,
    title: { zh: '守株待兔', en: 'Waiting by the Stump', vi: 'Ôm cây đợi thỏ' },
    topic: { en: 'Classic fable (chengyu)', vi: 'Ngụ ngôn kinh điển (thành ngữ)' },
    lines: [
      { zh: '从前，宋国有一个农夫，每天辛勤地在田里耕作。', en: 'Long ago, in the state of Song, there was a farmer who toiled in his field every day.', vi: 'Ngày xưa, ở nước Tống có một người nông dân ngày nào cũng cần mẫn làm ruộng.' },
      { zh: '有一天，一只兔子飞快地跑过来，一头撞在田边的树桩上死了。', en: 'One day, a rabbit dashed past, crashed headfirst into a tree stump at the edge of the field, and died.', vi: 'Một hôm, một con thỏ chạy vụt qua, đâm đầu vào gốc cây bên bờ ruộng rồi chết.' },
      { zh: '农夫毫不费力地捡到了一顿丰盛的晚餐，心里美滋滋的。', en: 'The farmer effortlessly picked up a hearty dinner and was delighted.', vi: 'Người nông dân chẳng tốn chút sức nào mà có được bữa tối thịnh soạn, trong lòng vô cùng phấn khởi.' },
      { zh: '从那以后，他再也不愿意干活，整天坐在树桩旁边，等着兔子再来。', en: 'From then on, he no longer wanted to work and sat by the stump all day, waiting for another rabbit.', vi: 'Từ đó, ông không muốn làm việc nữa, cả ngày ngồi bên gốc cây chờ thỏ đến.' },
      { zh: '日子一天天过去，兔子没有再出现，田里却长满了杂草。', en: 'Days went by; no rabbit ever appeared again, while the field filled with weeds.', vi: 'Ngày tháng trôi qua, thỏ không xuất hiện nữa, còn ruộng thì cỏ dại mọc đầy.' },
      { zh: '人们都嘲笑他，把侥幸当成了常态。', en: 'Everyone laughed at him for mistaking a stroke of luck for the norm.', vi: 'Ai cũng cười nhạo ông vì đã xem may mắn nhất thời là lẽ thường.' },
      { zh: '这个故事告诉我们：成功不能依靠运气，只有脚踏实地才能收获真正的成果。', en: 'The story teaches us: success cannot rely on luck; only by being down-to-earth can we reap real results.', vi: 'Câu chuyện dạy chúng ta: thành công không thể dựa vào may rủi, chỉ có làm việc thực chất mới gặt hái được thành quả thật sự.' },
    ],
  },
]

export function getStory(id: string) {
  return STORIES.find((s) => s.id === id)
}
