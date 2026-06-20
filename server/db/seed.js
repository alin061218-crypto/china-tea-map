const { getDb, initDb } = require('./database');

const teas = [
  // ===== 绿茶 (Green Tea) =====
  {
    name: '西湖龙井',
    province: '浙江',
    city: '杭州',
    latitude: 30.25, longitude: 120.15,
    category: '绿茶',
    maturity_months: '3月,4月',
    seasons: '春',
    local_characteristics: '杭州人讲究"明前龙井"，用虎跑泉水冲泡，配以青瓷盖碗，先闻香后品茗。西湖边茶馆林立，春日游人如织，手捧一杯龙井，坐看湖光山色，是杭州独有的生活方式。',
    appearance: '扁平光滑，挺直尖削，色泽嫩绿光润，叶底细嫩呈朵',
    history: '龙井茶始于唐，盛于宋，闻名于清。乾隆皇帝六下江南，四访龙井，御赐十八棵御茶。传说乾隆曾在龙井村胡公庙前亲手采茶，并将茶树封为"御茶"，至今这十八棵茶树仍被保护在狮峰山下。',
    spirit: '清正廉洁，君子之风',
    meaning: '龙井茶象征着清正雅致的君子品格，其"色绿、香郁、味甘、形美"四绝，代表着中国传统文人对完美人格的追求——外修其形，内养其德。',
    image_url: '/images/teas/longjing.jpg',
    is_mountain: 0
  },
  {
    name: '碧螺春',
    province: '江苏',
    city: '苏州',
    latitude: 31.30, longitude: 120.62,
    category: '绿茶',
    maturity_months: '3月,4月',
    seasons: '春',
    local_characteristics: '苏州人品碧螺春讲究"细啜慢饮"，以透明玻璃杯冲泡，观茶叶在水中徐徐舒展如螺，配以苏式糕点，在园林亭台间品茗，尽显江南文人的精致情趣。',
    appearance: '条索纤细，卷曲如螺，满身披毫，银白隐翠，叶底嫩匀明亮',
    history: '碧螺春原名"吓煞人香"，产于苏州太湖洞庭山。康熙皇帝南巡时品此茶，觉原名不雅，见其色碧形曲似螺，采于早春，遂赐名"碧螺春"。从此列为贡茶，名扬天下。',
    spirit: '灵动婉约，江南柔情',
    meaning: '碧螺春如同江南女子，纤细柔美中蕴含着坚韧。其卷曲如螺的形态寓意生命虽曲折但终会舒展绽放，是江南文化精致内敛精神的完美体现。',
    image_url: '/images/teas/biluochun.jpg',
    is_mountain: 0
  },
  {
    name: '黄山毛峰',
    province: '安徽',
    city: '黄山',
    latitude: 30.10, longitude: 118.17,
    category: '绿茶',
    maturity_months: '4月,5月',
    seasons: '春',
    local_characteristics: '黄山人饮毛峰多用粗瓷大碗，取其质朴自然。在黄山云海之中品茗，茶香与山雾交融，配以徽州酥饼，感受"五岳归来不看山，黄山归来不看岳"的豪迈。',
    appearance: '形似雀舌，白毫披身，芽尖锋芒，色泽象牙黄绿，叶底肥壮成朵',
    history: '黄山毛峰创制于清光绪年间，由歙县漕溪人谢正安创制。黄山自古产茶，唐代陆羽《茶经》即有记载。谢正安以黄山云雾茶为基础，精研制茶工艺，终成一代名茶，后世誉之为"黄山之魂"。',
    spirit: '巍峨挺拔，超然物外',
    meaning: '黄山毛峰生长于奇松怪石之间，吸天地之灵气，象征着不屈不挠的精神和超脱世俗的境界。品此茶如登黄山，有"会当凌绝顶，一览众山小"的胸怀。',
    image_url: '/images/teas/huangshan.jpg',
    is_mountain: 0
  },
  {
    name: '六安瓜片',
    province: '安徽',
    city: '六安',
    latitude: 31.73, longitude: 116.50,
    category: '绿茶',
    maturity_months: '4月,5月',
    seasons: '春',
    local_characteristics: '六安人饮瓜片喜用盖碗，沸水冲泡后先闻盖香。当地有"饭前一杯瓜片，饭后一杯瓜片"的习俗，茶已融入日常三餐。配以皖西咸货，茶香解腻，相得益彰。',
    appearance: '单片不带芽梗，形如瓜子，叶缘微翘，色泽宝绿带霜，叶底黄绿匀亮',
    history: '六安瓜片是中国唯一无芽无梗的单叶茶。明代徐光启《农政全书》已有记载。清代为朝廷贡茶，慈禧太后尤爱此茶。1905年巴拿马万国博览会上，六安瓜片荣获金质奖章，驰名中外。',
    spirit: '朴实无华，内秀其中',
    meaning: '六安瓜片外表朴实无华，但内质醇厚，象征着不事张扬、脚踏实地的品格。其独特的单叶形态也寓意"独一无二，不可替代"的价值。',
    image_url: '/images/teas/liuan.jpg',
    is_mountain: 0
  },
  {
    name: '信阳毛尖',
    province: '河南',
    city: '信阳',
    latitude: 32.15, longitude: 114.07,
    category: '绿茶',
    maturity_months: '4月,5月',
    seasons: '春',
    local_characteristics: '信阳人饮毛尖以玻璃杯为佳，用80℃水温冲泡，观茶叶如银针般竖立水中。配上信阳热干面或胡辣汤，一清一浓，是中原饮食文化的缩影。',
    appearance: '细圆光直，多白毫，色泽翠绿光润，叶底嫩绿匀齐',
    history: '信阳毛尖历史悠久，唐代即为贡茶。宋代大文豪苏东坡曾赞其"淮南茶，信阳第一"。1915年获巴拿马万国博览会金奖，成为中国十大名茶之一。信阳地处中国南北分界线上，独特的气候孕育了其特有的品质。',
    spirit: '刚柔并济，中正平和',
    meaning: '信阳地处中国南北交界，信阳毛尖也兼具南茶的清雅和北茶的厚重，象征着中庸之道。其"尖"字寓意锐意进取的精神，刚柔相济，体现了中原文化的包容大气。',
    image_url: '/images/teas/xinyang.jpg',
    is_mountain: 0
  },
  {
    name: '太平猴魁',
    province: '安徽',
    city: '黄山',
    latitude: 30.28, longitude: 118.13,
    category: '绿茶',
    maturity_months: '4月,5月',
    seasons: '春',
    local_characteristics: '黄山太平县人饮猴魁喜用高筒玻璃杯，观其如兰似剑的茶条在水中竖立起舞。配以黄山烧饼，茶香配酥脆，是徽州人待客的最高礼遇。',
    appearance: '两叶抱一芽，扁平挺直，自然舒展，白毫隐伏，色泽苍绿匀润，叶底嫩绿明亮',
    history: '太平猴魁创制于1900年，产于黄山太平县猴坑村。相传有一山民在猴坑采得奇茶，制成后茶条魁伟，故名"猴魁"。1915年巴拿马博览会获金奖，后成为国礼茶。',
    spirit: '魁伟不群，卓尔不凡',
    meaning: '太平猴魁外形魁伟，在绿茶中独树一帜，象征着出类拔萃、勇于超越的品格。"猴"字的灵动与"魁"字的威严结合，寓意智勇双全。',
    image_url: '/images/teas/houkui.jpg',
    is_mountain: 0
  },
  {
    name: '都匀毛尖',
    province: '贵州',
    city: '都匀',
    latitude: 26.27, longitude: 107.52,
    category: '绿茶',
    maturity_months: '3月,4月',
    seasons: '春',
    local_characteristics: '贵州人饮毛尖以山泉水冲泡，配以苗家糯米粑。黔南多民族聚居，茶在苗族、布依族等少数民族文化中占有重要地位，是待客和节庆的必备。',
    appearance: '条索紧细卷曲，白毫满布，色泽翠绿，叶底嫩绿匀亮',
    history: '都匀毛尖产自贵州黔南，明代已为贡茶。1915年与茅台酒同获巴拿马万国博览会金奖，被誉为"贵州双绝"。毛泽东曾赞誉"都匀毛尖，可以喝的好茶"。',
    spirit: '坚韧不拔，自强不息',
    meaning: '都匀毛尖生长在贵州崇山峻岭之中，象征着在艰苦环境中依然能绽放光彩的精神。与茅台酒并称"贵州双绝"，代表着贵州人民自强不息的品格。',
    image_url: '/images/teas/duyun.jpg',
    is_mountain: 0
  },
  {
    name: '庐山云雾',
    province: '江西',
    city: '九江',
    latitude: 29.57, longitude: 115.98,
    category: '绿茶',
    maturity_months: '4月,5月,6月',
    seasons: '春,夏',
    local_characteristics: '九江人品庐山云雾喜用山泉水，在庐山牯岭镇的老茶馆中，隔窗望云海品茗。配以九江茶饼，茶香与饼香交融，是庐山独有的文化记忆。',
    appearance: '条索紧结，青翠多毫，色泽翠绿光润，叶底嫩绿',
    history: '庐山云雾始于东汉，是中国最早的名茶之一。唐代陆羽曾隐居庐山品泉评茶。宋代列为贡茶，文人墨客登庐山必饮此茶。白居易有诗云："药圃茶园为产业，野麋林鹤是交游"。',
    spirit: '高远飘逸，超凡入圣',
    meaning: '庐山云雾生长在云深雾浓之处，采天地之灵气，象征着不随波逐流、保持清高品质的人生态度。如庐山一样，"不识庐山真面目，只缘身在此山中"。',
    image_url: '/images/teas/lushan.jpg',
    is_mountain: 0
  },
  {
    name: '安吉白茶',
    province: '浙江',
    city: '安吉',
    latitude: 30.63, longitude: 119.68,
    category: '绿茶',
    maturity_months: '3月,4月',
    seasons: '春',
    local_characteristics: '安吉人品白茶以透明玻璃杯冲泡，观赏其形如凤羽的叶片在水中舒展。安吉是"中国竹乡"，在竹林间品白茶，茶香竹韵相得益彰。配以安吉笋干，清雅绝俗。',
    appearance: '形似凤羽，色泽翠绿带金黄，白毫显露，叶底玉白，筋脉翠绿',
    history: '安吉白茶虽名"白茶"，实为绿茶，因其茶树在特定温度下叶色变白而得名。宋徽宗赵佶在《大观茶论》中曾专门论述。其氨基酸含量是普通绿茶的2-3倍，滋味极鲜爽。',
    spirit: '纯净高洁，返璞归真',
    meaning: '安吉白茶的白化特性被视作返璞归真的象征，其极简的白色蕴含丰富的内涵，寓意"大道至简"。生长在竹海中，更添一份清雅脱俗的气质。',
    image_url: '/images/teas/anji.jpg',
    is_mountain: 0
  },
  {
    name: '蒙顶甘露',
    province: '四川',
    city: '雅安',
    latitude: 30.00, longitude: 103.00,
    category: '绿茶',
    maturity_months: '3月,4月',
    seasons: '春',
    local_characteristics: '雅安人饮蒙顶甘露以盖碗冲泡，在蒙顶山上的茶园中品茗，俯瞰青衣江蜿蜒而过。当地有"扬子江中水，蒙山顶上茶"的民谚，配以雅鱼，是蜀中独有的风雅。',
    appearance: '紧卷多毫，嫩绿色润，叶底嫩绿匀亮',
    history: '蒙顶甘露是中国最古老的名茶之一，始于西汉，距今已有2000多年历史。吴理真在蒙顶山种下七株茶树，被尊为"茶祖"。唐代列为贡茶之首，宋代在蒙顶山设"茶马司"，以茶易马。',
    spirit: '源远流长，开创先河',
    meaning: '蒙顶甘露是中国茶文化的源头之一，象征着开创与传承。其千年不断的茶脉寓意着文化的生生不息，是"茶之始祖"精神的体现。',
    image_url: '/images/teas/mengding.jpg',
    is_mountain: 0
  },
  {
    name: '恩施玉露',
    province: '湖北',
    city: '恩施',
    latitude: 30.28, longitude: 109.48,
    category: '绿茶',
    maturity_months: '4月,5月',
    seasons: '春',
    local_characteristics: '恩施土家族苗族自治州饮玉露以白瓷盖碗冲泡，在吊脚楼上听土家山歌品茶。配以恩施土豆和腊肉，土家族人的热情与茶香一样醇厚。',
    appearance: '条索紧细，圆直如针，色泽翠绿，叶底嫩绿匀整',
    history: '恩施玉露是中国为数不多的蒸青绿茶，工艺源自唐代。恩施地处"世界硒都"，土壤富含硒元素，所产茶叶天然富硒。清代康熙年间，恩施茶农改进蒸青工艺，创制出独具特色的玉露茶。',
    spirit: '珍稀独特，匠心传承',
    meaning: '恩施玉露保留了中国最古老的蒸青工艺，象征着对传统技艺的坚守。生长在富硒土地上，更蕴含了"天人合一"的健康理念，是自然馈赠与人类智慧的结晶。',
    image_url: '/images/teas/enshi.jpg',
    is_mountain: 0
  },
  {
    name: '崂山绿茶',
    province: '山东',
    city: '青岛',
    latitude: 36.10, longitude: 120.48,
    category: '绿茶',
    maturity_months: '5月,6月',
    seasons: '春,夏',
    local_characteristics: '青岛人饮崂山绿茶以紫砂壶冲泡，在海风轻拂的崂山道观中品茗。作为中国纬度最高的茶区之一，崂山茶配以青岛啤酒和海鲜，山海之间别有风味。',
    appearance: '条索紧结，色泽灰绿，白毫显露，叶底黄绿',
    history: '崂山绿茶是中国最北端的茶，有"江北第一名茶"之称。崂山自古是道教名山，太清宫的千年银杏与茶树相伴而生。相传丘处机在崂山修道时，以茶养生，崂山茶由此与道教文化结下不解之缘。',
    spirit: '道法自然，北国独秀',
    meaning: '崂山绿茶在北方严寒中生长，打破了"茶不过黄河"的定论，象征着突破和超越。与道教文化相融，蕴含了"道法自然、天人合一"的哲学思想。',
    image_url: '/images/teas/laoshan.jpg',
    is_mountain: 0
  },

  // ===== 乌龙茶 (Oolong Tea) =====
  {
    name: '大红袍',
    province: '福建',
    city: '武夷山',
    latitude: 27.73, longitude: 118.03,
    category: '乌龙茶',
    maturity_months: '5月,6月',
    seasons: '春,夏',
    local_characteristics: '武夷山人饮大红袍以紫砂小壶冲泡，用"功夫茶"的方式小杯细啜。在武夷山九曲溪畔，配以武夷岩茶特有的"岩韵"，听溪水潺潺，品茶香馥郁，是闽北独有的闲适。',
    appearance: '条索紧结，色泽褐绿油润，叶底软亮，红边明显',
    history: '大红袍被誉为"茶中之王"，母树仅六株，生长在武夷山九龙窠的悬崖峭壁上，已有360余年历史。传说一位进京赶考的书生路过武夷山时腹痛难忍，寺僧以茶汤救之。书生高中状元后，以红袍披茶树，大红袍由此得名。2006年母树大红袍停止采摘，现存茶叶为国家博物馆收藏。',
    spirit: '王者风范，尊贵无双',
    meaning: '大红袍是乌龙茶中的帝王，象征着尊贵和至高无上的地位。其母树生长于悬崖绝壁之上，更寓意着在险境中成就非凡的品质，"高处不胜寒"的孤勇精神。',
    image_url: '/images/teas/dahongpao.jpg',
    is_mountain: 0
  },
  {
    name: '铁观音',
    province: '福建',
    city: '安溪',
    latitude: 25.06, longitude: 118.18,
    category: '乌龙茶',
    maturity_months: '4月,5月,10月',
    seasons: '春,秋',
    local_characteristics: '安溪人品铁观音用白瓷盖碗，以功夫茶道冲泡。在闽南古厝的天井中，一家人围坐品茶，配上安溪柿饼或花生糖，是闽南人最日常也最讲究的生活仪式。',
    appearance: '条索卷曲，肥壮圆结，色泽砂绿，整体呈蜻蜓头状',
    history: '铁观音创制于清雍正年间，安溪茶农魏荫梦中得观音指引，在观音岩发现一株奇异茶树，移回家中精心培育，制成的茶醇厚甘鲜。魏荫感念观音托梦，取名"铁观音"。铁观音因独特的"观音韵"而享誉海内外。',
    spirit: '慈悲为怀，温润如玉',
    meaning: '铁观音之名源自观音菩萨，象征着慈悲与智慧。其独特的"观音韵"不可言传只可意会，寓意着内敛深厚、耐人寻味的品格。"七泡有余香"更是其坚韧持久精神的体现。',
    image_url: '/images/teas/tieguanyin.jpg',
    is_mountain: 0
  },
  {
    name: '凤凰单丛',
    province: '广东',
    city: '潮州',
    latitude: 23.67, longitude: 116.63,
    category: '乌龙茶',
    maturity_months: '4月,5月',
    seasons: '春',
    local_characteristics: '潮州人品凤凰单丛以朱泥小壶冲泡，用"潮汕功夫茶"的礼仪待客。在潮州古城的骑楼下，三五好友围坐，一壶三杯，轮流品饮，配上潮州腐乳饼，是潮汕人刻在骨子里的生活方式。',
    appearance: '条索紧结，肥壮匀整，色泽乌润带褐，叶底绿腹红边',
    history: '凤凰单丛产于潮州凤凰山，种茶历史可追溯至南宋。凤凰山上有200余株百年以上的古茶树，最老的"宋种"已有700余年树龄。潮汕功夫茶文化以凤凰单丛为载体，流传到东南亚乃至全世界。',
    spirit: '精益求精，匠人之心',
    meaning: '凤凰单丛的制作工艺极其复杂，每一道工序都需匠人精心把控，象征着对完美的极致追求。其"凤凰"之名寓意浴火重生、不断超越的精神境界。',
    image_url: '/images/teas/fenghuang.jpg',
    is_mountain: 0
  },
  {
    name: '冻顶乌龙',
    province: '台湾',
    city: '南投',
    latitude: 23.92, longitude: 120.68,
    category: '乌龙茶',
    maturity_months: '4月,5月,11月',
    seasons: '春,冬',
    local_characteristics: '南投鹿谷乡人品冻顶乌龙以紫砂壶冲泡，在阿里山和日月潭之间的茶园中，伴着山岚云雾品茗。配以凤梨酥或太阳饼，是台湾高山茶文化的代表。',
    appearance: '条索紧结弯曲，呈半球形，色泽墨绿油润，叶底软亮',
    history: '冻顶乌龙相传是清咸丰年间，鹿谷乡人林凤池赴福建应试，带回武夷山茶苗36株，种于冻顶山。因山高路滑，上山必须"冻着脚尖"（绷紧脚尖），故名冻顶山。此后冻顶乌龙成为台湾乌龙茶的代表。',
    spirit: '不忘本源，开枝散叶',
    meaning: '冻顶乌龙源自武夷山而在台湾发扬光大，象征着文化的传承与创新。其"冻顶"之名也寓意着艰难跋涉才能到达高处，暗合"不经一番寒彻骨，怎得梅花扑鼻香"的道理。',
    image_url: '/images/teas/dongding.jpg',
    is_mountain: 0
  },

  // ===== 红茶 (Black Tea) =====
  {
    name: '祁门红茶',
    province: '安徽',
    city: '祁门',
    latitude: 29.85, longitude: 117.73,
    category: '红茶',
    maturity_months: '4月,5月,6月',
    seasons: '春,夏',
    local_characteristics: '祁门人品红茶多用白瓷杯，加奶加糖或清饮皆宜。在徽派老宅的天井里，一杯祁红配上徽州臭鳜鱼或毛豆腐，中西合璧的饮法在祁门习以为常，因为祁红曾是远销欧洲的外贸名品。',
    appearance: '条索紧细匀整，锋苗秀丽，色泽乌润带金毫，叶底红亮',
    history: '祁门红茶创制于清光绪元年（1875年），由黟县人余干臣仿效闽红工艺制成。问世后迅速风靡欧洲，成为英国皇室的御用茶。1915年获巴拿马万国博览会金奖，被誉为"红茶皇后"，是世界三大高香红茶之一。',
    spirit: '中西合璧，兼容并包',
    meaning: '祁门红茶从中国走向世界，被西方人赞为"祁门香"，象征着中国文化开放包容、走向世界的精神。其独特的复合花果香，也寓意着博采众长、自成一家。',
    image_url: '/images/teas/qimen.jpg',
    is_mountain: 0
  },
  {
    name: '正山小种',
    province: '福建',
    city: '武夷山',
    latitude: 27.75, longitude: 117.68,
    category: '红茶',
    maturity_months: '5月,6月',
    seasons: '春,夏',
    local_characteristics: '武夷山桐木关人饮正山小种以粗陶大碗，在海拔千米的竹楼里，守着火塘品茗。配以竹筒饭和山野腊味，在原始森林的气息中感受茶与自然的融合。',
    appearance: '条索肥壮紧结，色泽乌黑油润，叶底红亮匀整',
    history: '正山小种是世界红茶的鼻祖，产自武夷山桐木关。明朝末年，一支军队路过桐木关，茶农为躲避战乱，未及时加工茶青，茶叶发酵变红。茶农急中生智用松木烘干，意外创制出带有松烟香的独特红茶。17世纪传入欧洲，引发了欧洲的下午茶文化。',
    spirit: '化险为夷，开创纪元',
    meaning: '正山小种的诞生本身就是一次美丽的意外，象征着在困境中创新求变的精神。作为世界红茶之源，它改变了全球的饮茶方式，寓意着"星星之火，可以燎原"的开创力量。',
    image_url: '/images/teas/zhengshan.jpg',
    is_mountain: 0
  },
  {
    name: '滇红',
    province: '云南',
    city: '凤庆',
    latitude: 24.58, longitude: 99.92,
    category: '红茶',
    maturity_months: '3月,4月,5月,6月',
    seasons: '春,夏',
    local_characteristics: '凤庆人饮滇红以陶壶冲泡，在澜沧江畔的傣家竹楼中，配以傣族烤鱼和糯米香竹饭。滇西少数民族将茶视为待客的最高礼仪，一杯滇红满含边疆人民的热情。',
    appearance: '条索肥硕紧结，色泽棕褐油润，金毫显露，叶底红匀明亮',
    history: '滇红创制于1939年，由"滇红之父"冯绍裘在云南凤庆试制成功。抗战时期，东南茶区沦陷，滇红的诞生保证了中国的茶叶出口。1940年代，滇红远销苏联、东欧，为中国换取了宝贵的外汇和战略物资，被誉为"抗战红茶"。',
    spirit: '雪中送炭，家国情怀',
    meaning: '滇红诞生于民族危难之际，承载着深厚的家国情怀。其金毫闪耀象征着希望之光，在国家最需要的时刻挺身而出，体现了"苟利国家生死以"的爱国精神。',
    image_url: '/images/teas/dianhong.jpg',
    is_mountain: 0
  },

  // ===== 白茶 (White Tea) =====
  {
    name: '白毫银针',
    province: '福建',
    city: '福鼎',
    latitude: 27.32, longitude: 120.22,
    category: '白茶',
    maturity_months: '3月,4月',
    seasons: '春',
    local_characteristics: '福鼎人饮白毫银针以透明玻璃杯冲泡，用80℃水温，观银针竖立如笋。在太姥山下的茶园中，配以福鼎肉片和槟榔芋，清淡的茶香与闽东风味相映成趣。',
    appearance: '芽头肥壮，遍披白毫，挺直如针，色白如银，叶底嫩匀完整',
    history: '白毫银针是中国白茶中的极品，产于福鼎太姥山。相传太姥娘娘在此种茶济世，以白茶救治瘟疫中的百姓。白茶制作工艺最为自然，不炒不揉，仅经萎凋和干燥，最大程度保留了茶叶的天然成分。',
    spirit: '天然去雕饰，大道至简',
    meaning: '白毫银针的制作工艺最简单也最考验天时，象征着"大道至简、回归本真"的哲学。其银白的色泽和极简的工艺，如同君子坦荡荡，不作任何伪饰。',
    image_url: '/images/teas/baihao.jpg',
    is_mountain: 0
  },

  // ===== 黄茶 (Yellow Tea) =====
  {
    name: '君山银针',
    province: '湖南',
    city: '岳阳',
    latitude: 29.37, longitude: 113.09,
    category: '黄茶',
    maturity_months: '4月',
    seasons: '春',
    local_characteristics: '岳阳人品君山银针以玻璃杯冲泡，欣赏茶叶"三起三落"的奇观——茶芽在杯中上下浮沉。在洞庭湖畔的岳阳楼下品茗，感怀"先天下之忧而忧，后天下之乐而乐"的千古名句。',
    appearance: '芽头肥壮，紧实挺直，满披茸毛，色泽金黄光亮，叶底嫩黄匀亮',
    history: '君山银针产于洞庭湖君山岛，唐代即为贡茶。相传舜帝的妃子娥皇女英在君山播下茶种，君山茶由此而来。宋代时，君山岛上每岁贡茶仅一斤，可见其珍贵。乾隆皇帝曾指定君山银针为御茶。',
    spirit: '忧乐天下，家国情怀',
    meaning: '君山银针与岳阳楼相伴，承载着范仲淹"先忧后乐"的精神。其茶芽在杯中三起三落的姿态，如同人生沉浮起落，但终将归于平静，寓意着豁达从容的人生态度。',
    image_url: '/images/teas/junshan.jpg',
    is_mountain: 0
  },

  // ===== 黑茶 (Dark Tea) =====
  {
    name: '普洱茶',
    province: '云南',
    city: '普洱',
    latitude: 22.78, longitude: 100.97,
    category: '黑茶',
    maturity_months: '3月,4月,5月,9月,10月',
    seasons: '春,秋',
    local_characteristics: '普洱人品普洱茶以紫砂壶或陶壶冲泡，在茶马古道上的老茶馆中，用炭火慢煮。配以云南鲜花饼和过桥米线，在普洱茶山云雾缭绕的意境中，感受岁月的醇厚。',
    appearance: '条索肥壮，色泽褐红或墨绿，叶底油润柔软',
    history: '普洱茶历史悠久，可追溯至东汉。唐宋时期，普洱茶通过茶马古道远销西藏、缅甸、印度。明清两代，普洱茶被列为贡茶。茶马古道上的马帮驮着普洱茶翻越横断山脉，以茶易马，开辟了南方丝绸之路。普洱茶越陈越香，被誉为"可以喝的古董"。',
    spirit: '岁月沉淀，愈久弥香',
    meaning: '普洱茶是茶中唯一越陈越香的品种，象征着时间的力量和岁月的价值。如同人生，经历时光的打磨才能绽放最美的光华。茶马古道的精神也赋予其不畏艰险、开拓进取的品格。',
    image_url: '/images/teas/puer.jpg',
    is_mountain: 0
  },
  {
    name: '六堡茶',
    province: '广西',
    city: '梧州',
    latitude: 23.48, longitude: 111.30,
    category: '黑茶',
    maturity_months: '5月,6月,9月,10月',
    seasons: '夏,秋',
    local_characteristics: '梧州人品六堡茶以粗陶壶煮饮，在骑楼老街的茶馆中，配以龟苓膏和纸包鸡。六堡茶是两广华侨的乡愁记忆，远在东南亚的侨胞至今保留着饮用六堡茶的传统。',
    appearance: '条索粗壮，色泽黑褐油润，叶底褐红',
    history: '六堡茶产自广西梧州六堡镇，清嘉庆年间即以槟榔香闻名。19世纪，大批华工下南洋，六堡茶作为压舱货随船远航。在异国他乡，六堡茶成为华工消暑祛湿的良药和慰藉乡愁的寄托。至今在马来西亚、新加坡等地仍深受欢迎。',
    spirit: '乡愁如茶，侨胞纽带',
    meaning: '六堡茶承载着华侨的集体记忆，是连接海内外华人的文化纽带。其独特的槟榔香穿越时空，象征着无论走多远，根永远在中国的故土情怀。',
    image_url: '/images/teas/liubao.jpg',
    is_mountain: 0
  },

  // ===== 再加工茶 =====
  {
    name: '福州茉莉花茶',
    province: '福建',
    city: '福州',
    latitude: 26.07, longitude: 119.30,
    category: '花茶',
    maturity_months: '5月,6月,7月,8月',
    seasons: '夏',
    local_characteristics: '福州人品茉莉花茶以白瓷盖碗冲泡，在茉莉花盛开的夏夜，满城花香中品茶。配以福州鱼丸和肉燕，花香茶香与闽菜的鲜美完美融合。福州三坊七巷的老茶馆中，仍有传统窨制花茶的技艺展示。',
    appearance: '条索紧细匀整，色泽褐绿，茉莉花瓣洁白点缀其间',
    history: '福州是茉莉花茶的发源地，始于宋代。福州茉莉花茶以其独特的"窨制"工艺闻名，将茶叶与茉莉鲜花层层交替，让茶叶充分吸收花香。清代慈禧太后酷爱茉莉花茶，每日必饮。福州茉莉花茶远销40多个国家和地区。',
    spirit: '清香悠远，海纳百川',
    meaning: '茉莉花茶是茶与花的完美结合，象征着包容与融合的智慧。其清香悠远而不浓烈，如同君子之交淡如水，也体现了福州作为海上丝绸之路起点的开放包容。',
    image_url: '/images/teas/moli.jpg',
    is_mountain: 0
  },

  // ===== 更多名茶 =====
  {
    name: '午子仙毫',
    province: '陕西',
    city: '汉中',
    latitude: 33.07, longitude: 107.03,
    category: '绿茶',
    maturity_months: '4月,5月',
    seasons: '春',
    local_characteristics: '汉中人饮午子仙毫以青瓷碗冲泡，在秦岭巴山之间的古镇中，配以汉中面皮和菜豆腐，一碗面皮一杯茶，是陕南人最惬意的早餐。',
    appearance: '状似兰花，色泽翠绿，满披白毫，叶底嫩绿成朵',
    history: '午子仙毫产于陕西汉中西乡县午子山，是陕西名茶的代表。汉中是汉文化的发祥地，刘邦曾在此称王。唐代陆羽《茶经》已将汉中列为茶区。午子仙毫因山得名，午子山形似五指，云雾缭绕，自古就是茶中珍品。',
    spirit: '汉源流长，根脉相承',
    meaning: '午子仙毫生长在汉文化的源头之地，承载着中华文明的根脉记忆。其"仙毫"之名寓意超凡脱俗，象征着汉文化的博大精深和生生不息。',
    image_url: '/images/teas/wuzi.jpg',
    is_mountain: 0
  },
  {
    name: '五指山红茶',
    province: '海南',
    city: '五指山',
    latitude: 18.78, longitude: 109.52,
    category: '红茶',
    maturity_months: '3月,4月,5月',
    seasons: '春',
    local_characteristics: '五指山黎族同胞饮红茶以椰壳为器，在热带雨林的吊脚屋中，配以椰子饭和竹筒饭。海南岛的热带风情赋予红茶独特的海岛韵味。',
    appearance: '条索紧结肥壮，色泽乌润，金毫显露，叶底红匀明亮',
    history: '五指山红茶产自海南岛五指山区，是中国最南端的红茶。海南岛早在唐代已有种茶记载，苏东坡贬谪海南时曾赞当地茶"色香味俱佳"。五指山海拔1867米，常年云雾环绕，是天然优质茶区。',
    spirit: '南国明珠，热带风情',
    meaning: '五指山红茶是中国最南端的茶区代表，象征着天涯海角也能孕育出优秀文化。生长在热带雨林中，蕴含着热情奔放又坚韧不屈的品格。',
    image_url: '/images/teas/wuzhishan.jpg',
    is_mountain: 0
  },
  {
    name: '易贡茶',
    province: '西藏',
    city: '林芝',
    latitude: 30.00, longitude: 94.85,
    category: '绿茶',
    maturity_months: '5月,6月',
    seasons: '夏',
    local_characteristics: '林芝藏胞饮易贡茶以木碗盛之，加入酥油和盐制成酥油茶。在雪山脚下的藏式民居中，一碗酥油茶配糌粑，是雪域高原上最温暖的生活画面。',
    appearance: '条索紧结，色泽翠绿带毫，叶底嫩绿',
    history: '易贡茶场位于西藏林芝，海拔2200米，是世界上海拔最高的茶园之一。1960年代，解放军在西藏高原试种茶树成功，结束了西藏不产茶的历史。如今易贡茶场出产的茶叶被誉为"雪域珍品"。',
    spirit: '雪域奇迹，高原精神',
    meaning: '易贡茶在极端环境中生长，象征着生命的顽强和人类改造自然的勇气。在世界屋脊上种出茶叶，本身就是一种"敢叫日月换新天"的奋斗精神的体现。',
    image_url: '/images/teas/yigong.jpg',
    is_mountain: 0
  },
  {
    name: '金骏眉',
    province: '福建',
    city: '武夷山',
    latitude: 27.75, longitude: 117.70,
    category: '红茶',
    maturity_months: '4月,5月',
    seasons: '春',
    local_characteristics: '武夷山桐木关人品金骏眉以白瓷盖碗冲泡，在高山竹楼中细品。金骏眉是红茶中的新贵，代表着中国红茶的最新成就。',
    appearance: '条索紧细如眉，色泽金黄黑相间，绒毛密布，叶底红匀鲜亮',
    history: '金骏眉创制于2005年，由正山小种第24代传人江元勋带领团队研发，用武夷山桐木关海拔1500米以上的野生茶树芽尖制成。一斤金骏眉需6-8万颗芽头，堪称红茶中的极品。它的诞生填补了中国高端红茶的空白。',
    spirit: '锐意创新，精益求精',
    meaning: '金骏眉是中国茶人在传统基础上的创新之作，象征着在传承中创新的精神。其名中的"金"代表珍贵，"骏"代表骏马奔腾，寓意中国红茶走向世界的新征程。',
    image_url: '/images/teas/jinjunmei.jpg',
    is_mountain: 0
  },

  // ===== 无茶地区 (山脉标记) =====
  {
    name: '青藏高原',
    province: '青海',
    city: '西宁',
    latitude: 36.62, longitude: 101.78,
    category: '无产茶',
    maturity_months: '',
    seasons: '',
    local_characteristics: '青海地区因高海拔寒冷气候不产茶，但藏族同胞以砖茶煮制奶茶，茶文化以饮用和贸易为主。青海是古茶马古道的重要节点。',
    appearance: '巍峨雪山，连绵起伏',
    history: '青海虽不产茶，但在茶马古道上扮演着重要角色。唐宋以来，青海是中原茶叶运往西藏的必经之路。青海湖周边出土的茶马交易文物证明了这段悠久的历史。',
    spirit: '雪域昆仑，圣洁高远',
    meaning: '青海虽不产茶，但昆仑山脉的巍峨象征着中华民族的脊梁。其不产茶的地理特征反衬出茶的珍贵和茶马古道的重要意义。',
    image_url: '/images/mountains/qinghai.jpg',
    is_mountain: 1
  },
  {
    name: '祁连山脉',
    province: '甘肃',
    city: '兰州',
    latitude: 36.06, longitude: 103.83,
    category: '产茶区',
    maturity_months: '4月,5月',
    seasons: '春',
    local_characteristics: '甘肃陇南地区近年来发展茶产业，碧口龙井、康县翠峰等茶品逐渐崭露头角。兰州人品茶多以三炮台盖碗茶为主，加入桂圆、枸杞、冰糖等，是西北独有的饮茶方式。',
    appearance: '群山连绵，绿洲点点',
    history: '甘肃产茶历史不长，但三炮台文化源远流长。古丝绸之路上，茶与丝绸、瓷器一起西行。甘肃作为丝绸之路的咽喉要道，见证了中国茶走向世界的千年历程。',
    spirit: '丝路驼铃，中西交汇',
    meaning: '甘肃是古丝绸之路的黄金路段，虽产茶不多，但其三炮台茶文化和丝路历史使茶在这里具有了跨文化交流的象征意义。',
    image_url: '/images/mountains/gansu.jpg',
    is_mountain: 1
  },
  {
    name: '贺兰山脉',
    province: '宁夏',
    city: '银川',
    latitude: 38.48, longitude: 106.22,
    category: '无产茶',
    maturity_months: '',
    seasons: '',
    local_characteristics: '宁夏因干旱气候不产茶，但回族同胞创造的八宝茶享誉全国，以茶叶为基底，加入枸杞、红枣、桂圆、芝麻、冰糖等八种食材，是宁夏最具特色的茶饮文化。',
    appearance: '贺兰山巍峨，黄河蜿蜒',
    history: '宁夏八宝茶的历史可追溯至唐代，是回族饮食文化的重要组成部分。宁夏虽不产茶，但作为枸杞之乡，其八宝茶文化独树一帜。西夏王朝时期，宁夏也是茶马交易的重要区域。',
    spirit: '塞上江南，兼容并蓄',
    meaning: '宁夏虽不产茶，但其八宝茶融多种食材于一壶，象征着兼容并蓄、融合创新的智慧。"塞上江南"的美誉也体现了在艰苦环境中创造美好生活的精神。',
    image_url: '/images/mountains/ningxia.jpg',
    is_mountain: 1
  },
  {
    name: '天山山脉',
    province: '新疆',
    city: '乌鲁木齐',
    latitude: 43.83, longitude: 87.60,
    category: '无产茶',
    maturity_months: '',
    seasons: '',
    local_characteristics: '新疆不产茶，但维吾尔族同胞的奶茶和清茶文化深厚。新疆是古丝绸之路的要道，也是茶叶西传欧洲的重要通道。新疆人饮茶以茯砖茶为主，配以馕和羊肉，是草原民族的独特饮食方式。',
    appearance: '天山雪峰入云，草原无边无际',
    history: '新疆在茶叶西传中扮演着关键角色。唐宋时期，茶叶通过丝绸之路经新疆传入中亚、波斯和阿拉伯世界，最终到达欧洲。喀什曾是中亚最大的茶叶贸易中心。',
    spirit: '西域驼铃，丝路纽带',
    meaning: '新疆是茶叶西传的桥梁，虽不产茶却连接了东方茶文化和西方饮茶习俗。天山脚下的茶香跨越了文明的边界，象征着文化交流与互鉴的力量。',
    image_url: '/images/mountains/xinjiang.jpg',
    is_mountain: 1
  },
  {
    name: '大兴安岭',
    province: '内蒙古',
    city: '呼和浩特',
    latitude: 40.82, longitude: 111.75,
    category: '无产茶',
    maturity_months: '',
    seasons: '',
    local_characteristics: '内蒙古不产茶，但蒙古族同胞的奶茶文化是草原文明的标志。以青砖茶或黑砖茶煮沸，加入鲜奶和盐，配以手抓肉和奶豆腐，是草原民族千年不变的生活传统。',
    appearance: '草原辽阔，兴安岭绵延',
    history: '蒙古族饮茶历史可追溯至元朝，成吉思汗的骑兵以茶解腻提神。明清时期，晋商通过"茶叶之路"将南方茶叶经内蒙古运往蒙古和俄罗斯。草原奶茶文化是中国茶文化中独特的一支。',
    spirit: '草原胸怀，马背精神',
    meaning: '内蒙古的奶茶文化体现了草原民族的豪迈与热情。虽不产茶，但将茶文化内化为本民族的灵魂，象征着文化的包容与生命力的强大。',
    image_url: '/images/mountains/neimenggu.jpg',
    is_mountain: 1
  },
];

function seed() {
  const db = getDb();

  // Clear existing data
  db.prepare('DELETE FROM checkins').run();
  db.prepare('DELETE FROM favorites').run();
  db.prepare('DELETE FROM teas').run();
  db.prepare('DELETE FROM users WHERE role != ?').run('admin');

  const insert = db.prepare(`
    INSERT INTO teas (name, province, city, latitude, longitude, category, maturity_months, seasons, local_characteristics, appearance, history, spirit, meaning, image_url, is_mountain)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertMany = db.transaction((teas) => {
    for (const tea of teas) {
      insert.run(
        tea.name, tea.province, tea.city, tea.latitude, tea.longitude,
        tea.category, tea.maturity_months, tea.seasons, tea.local_characteristics,
        tea.appearance, tea.history, tea.spirit, tea.meaning, tea.image_url, tea.is_mountain
      );
    }
  });

  insertMany(teas);
  console.log(`✅ 已导入 ${teas.length} 条茶叶数据`);

  // Create default admin user (password: admin123)
  const bcrypt = require('bcryptjs');
  const adminPwd = bcrypt.hashSync('admin123', 10);
  const existingAdmin = db.prepare('SELECT id FROM users WHERE username = ?').get('admin');
  if (!existingAdmin) {
    db.prepare('INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)').run('admin', 'admin@teayun.cn', adminPwd, 'admin');
    console.log('✅ 已创建管理员账户: admin / admin123');
  } else {
    console.log('ℹ️  管理员账户已存在');
  }
}

// Run directly
if (require.main === module) {
  (async () => {
    await initDb();
    seed();
    console.log('🌱 种子数据导入完成！');
  })();
}

module.exports = { seed, teas };
