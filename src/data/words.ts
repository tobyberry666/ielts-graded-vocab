// 词表数据层（Data）。M1 用精选种子词证明结构；M2 接入完整 1000-2000 词
// （柯林斯分级思路：初级≈Band5-6 / 中级≈Band6-7 / 高级≈Band7-8+）。
//
// 字段对齐「柯林斯式闪卡」：音标、词性、中英释义、搭配、原版例句+译文。

export type Band = '5' | '6' | '7' | '8' | '9';

export interface VocabEntry {
  id: string;
  term: string;
  phonetic: string;
  pos: string; // part of speech
  meaningZh: string;
  meaningEn: string;
  band: Band;
  collocations: string[];
  example: string;
  exampleZh: string;
  senses?: VocabSense[];
}

import { SEED_BULK } from './seed-bulk';


export interface VocabSense {
  pos: string;
  meaningZh: string;
  meaningEn: string;
  collocations: string[];
  example: string;
  exampleZh: string;
}

export function getSenses(w: VocabEntry): VocabSense[] {
  if (w.senses && w.senses.length) return w.senses;
  return [{
    pos: w.pos,
    meaningZh: w.meaningZh,
    meaningEn: w.meaningEn,
    collocations: w.collocations,
    example: w.example,
    exampleZh: w.exampleZh,
  }];
}

export function primarySense(w: VocabEntry): VocabSense {
  return getSenses(w)[0];
}

const SEED_CORE: VocabEntry[] = [
  {
    id: "analyse", term: "analyse", phonetic: "/ˈænəlaɪz/", pos: "v.", meaningZh: "分析，细察；分解，化验；对……进行心理分析", meaningEn: "To subject to analysis.", band: "5", collocations: ["analyse data", "analyse the cause", "closely analyse"], example: "He tried to analyse his feelings.", exampleZh: "他试图分析自己的感情。",
    senses: [
    {
    pos: "v.", meaningZh: "分析，细察；分解，化验；对……进行心理分析", meaningEn: "To subject to analysis.", collocations: ["analyse data", "analyse the cause", "closely analyse"], example: "He tried to analyse his feelings.", exampleZh: "他试图分析自己的感情。" },
    {
    pos: "vt.", meaningZh: "分析；细察；分解", meaningEn: "", collocations: [], example: "We need to analyse what went wrong.", exampleZh: "我们需要分析是什么出了差错。" }
    ]
  },
  {
    id: "benefit", term: "benefit", phonetic: "/ˈbɛn.ɪ.fɪt/", pos: "n.", meaningZh: "益处；受益；好处，益处；救济金，补助金；额外奖励，保险金；慈善活动", meaningEn: "An advantage; help or aid from something.", band: "5", collocations: ["bring benefit", "benefit from", "mutual benefit"], example: "I've had the benefit of a good education.", exampleZh: "我得益于受过良好教育。",
    senses: [
    {
    pos: "n.", meaningZh: "益处；受益；好处，益处；救济金，补助金；额外奖励，保险金；慈善活动", meaningEn: "An advantage; help or aid from something.", collocations: ["bring benefit", "benefit from", "mutual benefit"], example: "I've had the benefit of a good education.", exampleZh: "我得益于受过良好教育。" },
    {
    pos: "v.", meaningZh: "对（某人）有用，使受益；得益于，得利于", meaningEn: "To be or to provide a benefit to.", collocations: [], example: "I might benefit from getting my teeth fixed.", exampleZh: "把牙齿补好可能对我有好处。" },
    {
    pos: "vt.", meaningZh: "有益于", meaningEn: "", collocations: [], example: "He's not entitled to claim unemployment benefit.", exampleZh: "他无权要求领取失业救济金。" },
    {
    pos: "vi.", meaningZh: "受益", meaningEn: "", collocations: [], example: "Each family farms individually and reaps the benefit of its labour.", exampleZh: "每个家庭独立耕作，收获各自的劳动成果。" }
    ]
  },
  {
    id: "environment", term: "environment", phonetic: "/-mɪnt/", pos: "n.", meaningZh: "自然环境，生态环境；周围状况，条件；工作平台，软件包", meaningEn: "The surroundings of, and influences on, a particular item of interest.", band: "5", collocations: ["protect the environment", "natural environment", "living environment"], example: "Children need a caring environment.", exampleZh: "儿童需要一个充满关怀的环境。",
    senses: [
    {
    pos: "n.", meaningZh: "自然环境，生态环境；周围状况，条件；工作平台，软件包", meaningEn: "The surroundings of, and influences on, a particular item of interest.", collocations: ["protect the environment", "natural environment", "living environment"], example: "Children need a caring environment.", exampleZh: "儿童需要一个充满关怀的环境。" }
    ]
  },
  {
    id: "increase", term: "increase", phonetic: "/ɪnˈkriːs/", pos: "v.", meaningZh: "增加；增长，增强，增大", meaningEn: "(of a quantity, etc.) To become larger or greater.", band: "5", collocations: ["increase rapidly", "a sharp increase", "steady increase"], example: "Prices will increase pro rata.", exampleZh: "价格将相应提高。",
    senses: [
    {
    pos: "v.", meaningZh: "增加；增长，增强，增大", meaningEn: "(of a quantity, etc.) To become larger or greater.", collocations: ["increase rapidly", "a sharp increase", "steady increase"], example: "Prices will increase pro rata.", exampleZh: "价格将相应提高。" },
    {
    pos: "n.", meaningZh: "增长；增长量", meaningEn: "An amount by which a quantity is increased.", collocations: [], example: "We need to increase productivity.", exampleZh: "我们需要提高生产力。" },
    {
    pos: "vt.", meaningZh: "增加；加大", meaningEn: "", collocations: [], example: "Car usage is predicted to increase.", exampleZh: "汽车的使用率预计会增长。" },
    {
    pos: "vi.", meaningZh: "增加；繁殖", meaningEn: "", collocations: [], example: "The population continues to increase.", exampleZh: "人口持续增长。" }
    ]
  },
  {
    id: "policy", term: "policy", phonetic: "/ˈpɒləsi/", pos: "n.", meaningZh: "政策，方针；(处事) 原则，策略；保险单", meaningEn: "A principle of behaviour, conduct etc. thought to be desirable or necessary, especially as formally expressed by a government or other authoritative body.", band: "5", collocations: ["government policy", "education policy", "public policy"], example: "They are arguing over foreign policy.", exampleZh: "他们在讨论外交政策。",
    senses: [
    {
    pos: "n.", meaningZh: "政策，方针；(处事) 原则，策略；保险单", meaningEn: "A principle of behaviour, conduct etc. thought to be desirable or necessary, especially as formally expressed by a government or other authoritative body.", collocations: ["government policy", "education policy", "public policy"], example: "They are arguing over foreign policy.", exampleZh: "他们在讨论外交政策。" },
    {
    pos: "v.", meaningZh: "", meaningEn: "To regulate by laws; to reduce to order.", collocations: [], example: "She staunchly defended the new policy.", exampleZh: "她坚定地维护新政策。" }
    ]
  },
  {
    id: "require", term: "require", phonetic: "/ɹɪˈkwaɪə/", pos: "v.", meaningZh: "需要；要求做（某事），规定", meaningEn: "To ask (someone) for something; to request.", band: "5", collocations: ["require attention", "be required to", "require effort"], example: "All decisions would require unanimity.", exampleZh: "所有决定都需要全体一致同意。",
    senses: [
    {
    pos: "v.", meaningZh: "需要；要求做（某事），规定", meaningEn: "To ask (someone) for something; to request.", collocations: ["require attention", "be required to", "require effort"], example: "All decisions would require unanimity.", exampleZh: "所有决定都需要全体一致同意。" },
    {
    pos: "vt.", meaningZh: "需要；命令；要求；需要；要求；命令", meaningEn: "", collocations: [], example: "Bitmapped maps require huge storage space.", exampleZh: "位元映射地图需要巨大的存储空间。" }
    ]
  },
  {
    id: "significant", term: "significant", phonetic: "/sɪɡˈnɪ.fɪ.kənt/", pos: "adj.", meaningZh: "重要的；显著的；显著的，相当数量的；重要的，意义重大的； 别有含义的，意味深长的", meaningEn: "Signifying something; carrying meaning.", band: "5", collocations: ["significant change", "significant impact", "statistically significant"], example: "There remained one significant problem.", exampleZh: "还有一个非常重要的问题。",
    senses: [
    {
    pos: "adj.", meaningZh: "重要的；显著的；显著的，相当数量的；重要的，意义重大的； 别有含义的，意味深长的", meaningEn: "Signifying something; carrying meaning.", collocations: ["significant change", "significant impact", "statistically significant"], example: "There remained one significant problem.", exampleZh: "还有一个非常重要的问题。" },
    {
    pos: "n.", meaningZh: "<古>象征，有意义的事物", meaningEn: "That which has significance; a sign; a token; a symbol.", collocations: [], example: "Your work has shown a significant improvement.", exampleZh: "你的工作有了显著改进。" }
    ]
  },
  {
    id: "society", term: "society", phonetic: "/səˈsaɪ.ə.ti/", pos: "n.", meaningZh: "社会（以群体形式生活在一起的人的总称）；社群（某国家、地区、时期等的群体组织）；社团，协会；上层社会；交往，相伴；阶层，界；植物的群落，动物的群体", meaningEn: "A long-standing group of people sharing cultural aspects such as language, dress, norms of behavior and artistic forms.", band: "5", collocations: ["modern society", "civil society", "society as a whole"], example: "We live in a capitalist society.", exampleZh: "我们生活在资本主义社会。",
    senses: [
    {
    pos: "n.", meaningZh: "社会（以群体形式生活在一起的人的总称）；社群（某国家、地区、时期等的群体组织）；社团，协会；上层社会；交往，相伴；阶层，界；植物的群落，动物的群体", meaningEn: "A long-standing group of people sharing cultural aspects such as language, dress, norms of behavior and artistic forms.", collocations: ["modern society", "civil society", "society as a whole"], example: "We live in a capitalist society.", exampleZh: "我们生活在资本主义社会。" }
    ]
  },
  {
    id: "technology", term: "technology", phonetic: "/tɛkˈnɒlədʒi/", pos: "n.", meaningZh: "技术；科技；科技，技术；技术设备，先进机器；技术学，工艺学；术语", meaningEn: "the application of scientific knowledge for practical purposes", band: "5", collocations: ["advanced technology", "information technology", "technology development"], example: "Technology is changing fast.", exampleZh: "技术日新月异。",
    senses: [
    {
    pos: "n.", meaningZh: "技术；科技；科技，技术；技术设备，先进机器；技术学，工艺学；术语", meaningEn: "the application of scientific knowledge for practical purposes", collocations: ["advanced technology", "information technology", "technology development"], example: "Technology is changing fast.", exampleZh: "技术日新月异。" }
    ]
  },
  {
    id: "available", term: "available", phonetic: "/əˈveɪləb(ə)l/", pos: "adj.", meaningZh: "可获得的；可用的；可用的，可获得的；有空的，有闲暇的；未婚的，单身的", meaningEn: "Such as one may avail oneself of; capable of being used for the accomplishment of a purpose.", band: "5", collocations: ["readily available", "make available", "available to"], example: "All the options are currently available.", exampleZh: "所有的方案现在均可选择。",
    senses: [
    {
    pos: "adj.", meaningZh: "可获得的；可用的；可用的，可获得的；有空的，有闲暇的；未婚的，单身的", meaningEn: "Such as one may avail oneself of; capable of being used for the accomplishment of a purpose.", collocations: ["readily available", "make available", "available to"], example: "All the options are currently available.", exampleZh: "所有的方案现在均可选择。" }
    ]
  },
  {
    id: "develop", term: "develop", phonetic: "/dɛˈvɛ.ləp/", pos: "v.", meaningZh: "发展；开发；（使）成长，发育，发展；逐渐形成，逐渐养成；开发，研制；出现，产生；修建，开发土地；提高，加强；患病；阐释，展开；冲洗，使底片显影；（修改旋律、和声或节奏以）展开（音乐主题）；（棋）出子", meaningEn: "To change with a specific direction, progress.", band: "5", collocations: ["develop skills", "develop a habit", "develop rapidly"], example: "How fast would the disease develop?", exampleZh: "这种疾病发展有多快？",
    senses: [
    {
    pos: "v.", meaningZh: "发展；开发；（使）成长，发育，发展；逐渐形成，逐渐养成；开发，研制；出现，产生；修建，开发土地；提高，加强；患病；阐释，展开；冲洗，使底片显影；（修改旋律、和声或节奏以）展开（音乐主题）；（棋）出子", meaningEn: "To change with a specific direction, progress.", collocations: ["develop skills", "develop a habit", "develop rapidly"], example: "How fast would the disease develop?", exampleZh: "这种疾病发展有多快？" },
    {
    pos: "vt.", meaningZh: "发展；使发达；进步；洗印；显影", meaningEn: "", collocations: [], example: "We need to develop local industries.", exampleZh: "我们需要发展地方工业。" },
    {
    pos: "vi.", meaningZh: "发展；生长", meaningEn: "", collocations: [], example: "These clashes could develop into open warfare.", exampleZh: "这些冲突可能会发展成公开的战争。" }
    ]
  },
  {
    id: "provide", term: "provide", phonetic: "/pɹəˈvaɪd/", pos: "v.", meaningZh: "提供，供给；配备，准备好；（法律或规章）规定；供养，提供生计；为（可能事件）作充分准备；<史>任命（牧师）担任有俸神职", meaningEn: "To make a living; earn money for necessities.", band: "5", collocations: ["provide support", "provide evidence", "provide access"], example: "He refused to provide a specimen.", exampleZh: "他拒绝提供抽样。",
    senses: [
    {
    pos: "v.", meaningZh: "提供，供给；配备，准备好；（法律或规章）规定；供养，提供生计；为（可能事件）作充分准备；<史>任命（牧师）担任有俸神职", meaningEn: "To make a living; earn money for necessities.", collocations: ["provide support", "provide evidence", "provide access"], example: "He refused to provide a specimen.", exampleZh: "他拒绝提供抽样。" },
    {
    pos: "vt.", meaningZh: "提供；供应；规定；预备", meaningEn: "", collocations: [], example: "They would not provide any details.", exampleZh: "他们不肯提供任何细节。" },
    {
    pos: "vi.", meaningZh: "作准备；抚养；规定", meaningEn: "", collocations: [], example: "Can you provide any proof of identity ?", exampleZh: "你能提供什么身份证明吗？" }
    ]
  },
  {
    id: "research", term: "research", phonetic: "/ɹɪˈsɜːtʃ/", pos: "n.", meaningZh: "（尤指大学或科研机构进行的）研究，探讨；研究工作，调查工作", meaningEn: "Diligent inquiry or examination to seek or revise facts, principles, theories, applications, etc.; laborious or continued search after truth.", band: "5", collocations: ["conduct research", "research shows", "scientific research"], example: "Embryo research is an emotive issue.", exampleZh: "胚胎研究是个让人情绪激动的问题。",
    senses: [
    {
    pos: "n.", meaningZh: "（尤指大学或科研机构进行的）研究，探讨；研究工作，调查工作", meaningEn: "Diligent inquiry or examination to seek or revise facts, principles, theories, applications, etc.; laborious or continued search after truth.", collocations: ["conduct research", "research shows", "scientific research"], example: "Embryo research is an emotive issue.", exampleZh: "胚胎研究是个让人情绪激动的问题。" },
    {
    pos: "v.", meaningZh: "研究，探索；为……收集资料，调查", meaningEn: "To search or examine with continued care; to seek diligently.", collocations: [], example: "I'm doing some research on the subject.", exampleZh: "我正就这一课题进行研究。" },
    {
    pos: "vi.", meaningZh: "研究；调查", meaningEn: "", collocations: [], example: "Research has so far proved inconclusive.", exampleZh: "迄今为止研究还没有任何定论。" }
    ]
  },
  {
    id: "similar", term: "similar", phonetic: "/ˈsɪmələ/", pos: "adj.", meaningZh: "相像的，类似的；（几何图形）相似的", meaningEn: "Having traits or characteristics in common; alike, comparable.", band: "5", collocations: ["similar to", "be similar", "strikingly similar"], example: "They have uncannily similar voices.", exampleZh: "他们有着出奇相似的嗓音。",
    senses: [
    {
    pos: "adj.", meaningZh: "相像的，类似的；（几何图形）相似的", meaningEn: "Having traits or characteristics in common; alike, comparable.", collocations: ["similar to", "be similar", "strikingly similar"], example: "They have uncannily similar voices.", exampleZh: "他们有着出奇相似的嗓音。" },
    {
    pos: "n.", meaningZh: "<古>相似之人（或物）；顺势药物（指疗效与某些疾病症状相似的药物，为顺势疗法的基础）", meaningEn: "That which is similar to, or resembles, something else, as in quality, form, etc.", collocations: [], example: "They themselves had had a similar experience.", exampleZh: "他们本身就曾有过类似的经历。" }
    ]
  },
  {
    id: "education", term: "education", phonetic: "/ˌɛdjʊˈkeɪʃn̩/", pos: "n.", meaningZh: "（尤指学校）教育；培养，训练；教育机构，教育界人士；教育学；有教益的经历", meaningEn: "The process of imparting knowledge, skill and judgment.", band: "5", collocations: ["quality education", "access to education", "education system"], example: "Education is a top priority.", exampleZh: "教育是当务之急。",
    senses: [
    {
    pos: "n.", meaningZh: "（尤指学校）教育；培养，训练；教育机构，教育界人士；教育学；有教益的经历", meaningEn: "The process of imparting knowledge, skill and judgment.", collocations: ["quality education", "access to education", "education system"], example: "Education is a top priority.", exampleZh: "教育是当务之急。" }
    ]
  },
  {
    id: "government", term: "government", phonetic: "/ˈɡʌvə(n)mənt/", pos: "n.", meaningZh: "政府，内阁；政体，国家体制；（国家等的）治理，管理；政府掌控经济和社会活动的程度；（语法）支配关系", meaningEn: "The body with the power to make and/or enforce laws to control a country, land area, people or organization.", band: "5", collocations: ["government policy", "local government", "the government announced"], example: "The government took swift action.", exampleZh: "政府立即采取了行动。",
    senses: [
    {
    pos: "n.", meaningZh: "政府，内阁；政体，国家体制；（国家等的）治理，管理；政府掌控经济和社会活动的程度；（语法）支配关系", meaningEn: "The body with the power to make and/or enforce laws to control a country, land area, people or organization.", collocations: ["government policy", "local government", "the government announced"], example: "The government took swift action.", exampleZh: "政府立即采取了行动。" }
    ]
  },
  {
    id: "economy", term: "economy", phonetic: "/iːˈkɒn.ə.mi/", pos: "n.", meaningZh: "经济；节省，简练；经济舱", meaningEn: "the system of producing and consuming goods", band: "5", collocations: ["national economy", "the global economy", "boost the economy"], example: "China's economy galloped ahead.", exampleZh: "中国的经济飞速向前发展。",
    senses: [
    {
    pos: "n.", meaningZh: "经济；节省，简练；经济舱", meaningEn: "the system of producing and consuming goods", collocations: ["national economy", "the global economy", "boost the economy"], example: "China's economy galloped ahead.", exampleZh: "中国的经济飞速向前发展。" },
    {
    pos: "adj.", meaningZh: "经济实惠的", meaningEn: "", collocations: [], example: "The economy continues to grow.", exampleZh: "经济持续增长。" }
    ]
  },
  {
    id: "population", term: "population", phonetic: "/ˌpɒpjʊˈleɪʃən/", pos: "n.", meaningZh: "（地区、国家等的）人口，人口数量；（某领域的）生物，族群，人口；（统计）总体，母体；（天文）星族；（物理）布居数", meaningEn: "The people living within a political or geographical boundary.", band: "5", collocations: ["population growth", "a growing population", "urban population"], example: "The population continues to increase.", exampleZh: "人口持续增长。",
    senses: [
    {
    pos: "n.", meaningZh: "（地区、国家等的）人口，人口数量；（某领域的）生物，族群，人口；（统计）总体，母体；（天文）星族；（物理）布居数", meaningEn: "The people living within a political or geographical boundary.", collocations: ["population growth", "a growing population", "urban population"], example: "The population continues to increase.", exampleZh: "人口持续增长。" }
    ]
  },
  {
    id: "pollution", term: "pollution", phonetic: "/pəˈl(j)uːʃn̩/", pos: "n.", meaningZh: "污染；污染物；噪音污染，（夜间扰人的）强烈灯光", meaningEn: "The desecration of something holy or sacred; defilement, profanation.", band: "5", collocations: ["air pollution", "reduce pollution", "water pollution"], example: "Pollution can aggravate asthma.", exampleZh: "污染会使气喘加重。",
    senses: [
    {
    pos: "n.", meaningZh: "污染；污染物；噪音污染，（夜间扰人的）强烈灯光", meaningEn: "The desecration of something holy or sacred; defilement, profanation.", collocations: ["air pollution", "reduce pollution", "water pollution"], example: "Pollution can aggravate asthma.", exampleZh: "污染会使气喘加重。" }
    ]
  },
  {
    id: "transport", term: "transport", phonetic: "/ˈtrænspɔːt/", pos: "n.", meaningZh: "交通；运输；运输，运送；交通工具，运输方式；交通运输系统；（运送部队、给养等的）运输船，运输机；强烈的感情，狂喜；<史>流放犯", meaningEn: "An act of transporting; conveyance.", band: "5", collocations: ["public transport", "transport system", "mass transport"], example: "The goods were damaged during transport.", exampleZh: "货物在运输期间受损。",
    senses: [
    {
    pos: "n.", meaningZh: "交通；运输；运输，运送；交通工具，运输方式；交通运输系统；（运送部队、给养等的）运输船，运输机；强烈的感情，狂喜；<史>流放犯", meaningEn: "An act of transporting; conveyance.", collocations: ["public transport", "transport system", "mass transport"], example: "The goods were damaged during transport.", exampleZh: "货物在运输期间受损。" },
    {
    pos: "v.", meaningZh: "（用交通工具）运输，运送；（以自然方式）运输，传播；使产生身临其境的感觉；流放，放逐（犯人）；使狂喜，使（某人）充满强烈情感（尤指快乐）", meaningEn: "To carry or bear from one place to another; to remove; to convey.", collocations: [], example: "Transport not incl.", exampleZh: "不包括运输" },
    {
    pos: "vt.", meaningZh: "传送；运输；流放", meaningEn: "", collocations: [], example: "Applicants must have their own transport.", exampleZh: "申请人必须有自己的交通工具。" }
    ]
  },
  {
    id: "health", term: "health", phonetic: "/hɛlθ/", pos: "n.", meaningZh: "身体状况；健康；医疗，卫生；（组织或系统的）运行状况，运作状况；发达，兴旺", meaningEn: "the state of being well", band: "5", collocations: ["public health", "mental health", "health care"], example: "Her health degenerated quickly.", exampleZh: "她的健康状况迅速恶化。",
    senses: [
    {
    pos: "n.", meaningZh: "身体状况；健康；医疗，卫生；（组织或系统的）运行状况，运作状况；发达，兴旺", meaningEn: "the state of being well", collocations: ["public health", "mental health", "health care"], example: "Her health degenerated quickly.", exampleZh: "她的健康状况迅速恶化。" }
    ]
  },
  {
    id: "culture", term: "culture", phonetic: "/ˈkʌlt͡ʃə/", pos: "n.", meaningZh: "文化，文明；（团体或组织中共同的）态度，习俗；文化群落，（处于历史上特定时期的）社会；艺术活动；修养；（细胞、细菌等的）培养，培养物；栽培，养殖", meaningEn: "The arts, customs, lifestyles, background, and habits that characterize a particular society or nation.", band: "5", collocations: ["local culture", "popular culture", "cultural exchange"], example: "We are living in a consumer culture.", exampleZh: "我们生活在一种消费文化之中。",
    senses: [
    {
    pos: "n.", meaningZh: "文化，文明；（团体或组织中共同的）态度，习俗；文化群落，（处于历史上特定时期的）社会；艺术活动；修养；（细胞、细菌等的）培养，培养物；栽培，养殖", meaningEn: "The arts, customs, lifestyles, background, and habits that characterize a particular society or nation.", collocations: ["local culture", "popular culture", "cultural exchange"], example: "We are living in a consumer culture.", exampleZh: "我们生活在一种消费文化之中。" },
    {
    pos: "v.", meaningZh: "培育，养殖", meaningEn: "To maintain in an environment suitable for growth (especially of bacteria) (compare cultivate)", collocations: [], example: "This tradition has no parallel in our culture.", exampleZh: "这种传统在我们的文化中是没有的。" },
    {
    pos: "vt.", meaningZh: "耕种；培养", meaningEn: "", collocations: [], example: "She's very keen to learn about Japanese culture.", exampleZh: "她渴望学习日本文化。" }
    ]
  },
  {
    id: "system", term: "system", phonetic: "/ˈsɪstəm/", pos: "n.", meaningZh: "系统；制度；（协同工作的）系统；（计算机、警报器等的）系统；体制，制度，方式，方法；现行体制，既成制度（the system）；身体，（器官）系统；人体的活动方式（尤指消化和排泄方式）；（度量，分类中的）方法（或规则）；条理，秩序；（交通、通信）网，网络；（地质）（年代地层学用语）系；（天文）系；下赌注法；（乐）用弧线连为一体的谱表；晶系（crystal system 的简称）", meaningEn: "a set of connected parts forming a whole", band: "5", collocations: ["education system", "transport system", "legal system"], example: "Trust is implicit in the system.", exampleZh: "信任是这种体制里内含的。",
    senses: [
    {
    pos: "n.", meaningZh: "系统；制度；（协同工作的）系统；（计算机、警报器等的）系统；体制，制度，方式，方法；现行体制，既成制度（the system）；身体，（器官）系统；人体的活动方式（尤指消化和排泄方式）；（度量，分类中的）方法（或规则）；条理，秩序；（交通、通信）网，网络；（地质）（年代地层学用语）系；（天文）系；下赌注法；（乐）用弧线连为一体的谱表；晶系（crystal system 的简称）", meaningEn: "a set of connected parts forming a whole", collocations: ["education system", "transport system", "legal system"], example: "Trust is implicit in the system.", exampleZh: "信任是这种体制里内含的。" }
    ]
  },
  {
    id: "problem", term: "problem", phonetic: "/ˈpɹɒbləm/", pos: "n.", meaningZh: "问题，难题，困难；疾病；（通过算数或仔细思考而解决的）题；（感觉上）不喜欢，不情愿；（尤指国际象棋等）棋式，排局", meaningEn: "A difficulty that has to be resolved or dealt with.", band: "5", collocations: ["solve a problem", "a major problem", "social problem"], example: "Lawlessness is a major problem.", exampleZh: "违反法律是一个严重的问题。",
    senses: [
    {
    pos: "n.", meaningZh: "问题，难题，困难；疾病；（通过算数或仔细思考而解决的）题；（感觉上）不喜欢，不情愿；（尤指国际象棋等）棋式，排局", meaningEn: "A difficulty that has to be resolved or dealt with.", collocations: ["solve a problem", "a major problem", "social problem"], example: "Lawlessness is a major problem.", exampleZh: "违反法律是一个严重的问题。" },
    {
    pos: "adj.", meaningZh: "难对付的，成问题的", meaningEn: "(of a person or an animal) Difficult to train or guide; unruly.", collocations: [], example: "She's a good problem solver.", exampleZh: "她是解决问题的高手。" }
    ]
  },
  {
    id: "solution", term: "solution", phonetic: "/səˈl(j)uːʃən/", pos: "n.", meaningZh: "（问题、困难等的）解决办法；（练习或竞赛的）解答，答案；溶液；溶解过程，溶解状态；（满足特定需要的）产品（或服务）（solutions）", meaningEn: "A homogeneous mixture, which may be liquid, gas or solid, formed by dissolving one or more substances.", band: "5", collocations: ["find a solution", "a practical solution", "solution to"], example: "Do you have a better solution?", exampleZh: "你有更好的解决办法吗？",
    senses: [
    {
    pos: "n.", meaningZh: "（问题、困难等的）解决办法；（练习或竞赛的）解答，答案；溶液；溶解过程，溶解状态；（满足特定需要的）产品（或服务）（solutions）", meaningEn: "A homogeneous mixture, which may be liquid, gas or solid, formed by dissolving one or more substances.", collocations: ["find a solution", "a practical solution", "solution to"], example: "Do you have a better solution?", exampleZh: "你有更好的解决办法吗？" },
    {
    pos: "v.", meaningZh: "", meaningEn: "To treat with a solution.", collocations: [], example: "A solution proffered itself.", exampleZh: "一个解答自然出现了。" }
    ]
  },
  {
    id: "process", term: "process", phonetic: "/ˈpɹoʊsɛs/", pos: "n.", meaningZh: "过程；步骤；步骤，程序；（自然或偶然的）变化过程；（为达到某目标的）过程，进程；制作方法，加工方法；<法律>传票；（生，剖）端突，突起", meaningEn: "A series of events which produce a result (the product).", band: "5", collocations: ["learning process", "the process of", "a long process"], example: "The process was needlessly slow.", exampleZh: "进程过于缓慢了。",
    senses: [
    {
    pos: "n.", meaningZh: "过程；步骤；步骤，程序；（自然或偶然的）变化过程；（为达到某目标的）过程，进程；制作方法，加工方法；<法律>传票；（生，剖）端突，突起", meaningEn: "A series of events which produce a result (the product).", collocations: ["learning process", "the process of", "a long process"], example: "The process was needlessly slow.", exampleZh: "进程过于缓慢了。" },
    {
    pos: "adj.", meaningZh: "（印刷）三原色的，三色版的； 经过特殊加工的；照相板的", meaningEn: "", collocations: [], example: "History is an interpretive process.", exampleZh: "历史是一个解释过程。" },
    {
    pos: "v.", meaningZh: "（用化学物品或机器）处理，加工；审核，受理（正式文件或请求）；（计算机）处理（数据）；冲洗（照片）；加工（食品）；<正式>列队行进；把（头发）弄成直发", meaningEn: "To perform a particular process on a thing.", collocations: [], example: "The whole process started all over again.", exampleZh: "整个过程又重新开始了。" },
    {
    pos: "vt.", meaningZh: "加工；使...接受处理；对...处置；对...起诉", meaningEn: "", collocations: [], example: "There was total agreement to start the peace process as soon as possible.", exampleZh: "全体同意尽快启动和平进程。" }
    ]
  },
  {
    id: "method", term: "method", phonetic: "/ˈmɛθəd/", pos: "n.", meaningZh: "方法；办法；方法，办法；条理；体验派表演方法", meaningEn: "A process by which a task is completed; a way of doing something (followed by the adposition of, to or for before the purpose of the process):", band: "5", collocations: ["teaching method", "a new method", "effective method"], example: "There is just one method that might work.", exampleZh: "只有一个方法可能起作用。",
    senses: [
    {
    pos: "n.", meaningZh: "方法；办法；方法，办法；条理；体验派表演方法", meaningEn: "A process by which a task is completed; a way of doing something (followed by the adposition of, to or for before the purpose of the process):", collocations: ["teaching method", "a new method", "effective method"], example: "There is just one method that might work.", exampleZh: "只有一个方法可能起作用。" },
    {
    pos: "v.", meaningZh: "", meaningEn: "To apply a method", collocations: [], example: "The most frequently used method is radiocarbon dating.", exampleZh: "最常用的方法是放射性碳定年法。" }
    ]
  },
  {
    id: "result", term: "result", phonetic: "/ɹɪˈzʌlt/", pos: "n.", meaningZh: "结果，后果；（比赛或选举的）结果；（通过调查、研究、计算而获得的）结果；<英> 考试成绩；成效，成果（results）；经营业绩（results）；<英，非正式>（体育比赛中）胜局，获胜", meaningEn: "That which results; the conclusion or end to which any course or condition of things leads, or which is obtained by any process or operation; consequence or effect.", band: "5", collocations: ["positive result", "the result of", "produce a result"], example: "They were elated at the result.", exampleZh: "他们对这一结果感到欢欣鼓舞。",
    senses: [
    {
    pos: "n.", meaningZh: "结果，后果；（比赛或选举的）结果；（通过调查、研究、计算而获得的）结果；<英> 考试成绩；成效，成果（results）；经营业绩（results）；<英，非正式>（体育比赛中）胜局，获胜", meaningEn: "That which results; the conclusion or end to which any course or condition of things leads, or which is obtained by any process or operation; consequence or effect.", collocations: ["positive result", "the result of", "produce a result"], example: "They were elated at the result.", exampleZh: "他们对这一结果感到欢欣鼓舞。" },
    {
    pos: "v.", meaningZh: "发生，产生；导致，造成（注明的结局或结果）", meaningEn: "To proceed, spring up or rise, as a consequence, from facts, arguments, premises, combination of circumstances, consultation, thought or endeavor.", collocations: [], example: "She was delighted at the result.", exampleZh: "对这个结果她感到高兴。" },
    {
    pos: "int.", meaningZh: "<非正式> 成功了！（Result!）", meaningEn: "An exclamation of joy following a favorable outcome.", collocations: [], example: "Are you pleased with the result?", exampleZh: "你对结果满意吗？" },
    {
    pos: "vi.", meaningZh: "产生；结果；致使", meaningEn: "", collocations: [], example: "Compensation is available for people who have developed asthma as a direct result of their work.", exampleZh: "直接因工作原因患哮喘的人会获得赔偿。" }
    ]
  },
  {
    id: "reason", term: "reason", phonetic: "/ˈɹiːzən/", pos: "n.", meaningZh: "原因；理由；原因，理由；充分理由，正当理由；道理，情理；判断力，理智", meaningEn: "A cause:", band: "5", collocations: ["for this reason", "main reason", "good reason"], example: "I had no reason to doubt him.", exampleZh: "我没有理由不相信他。",
    senses: [
    {
    pos: "n.", meaningZh: "原因；理由；原因，理由；充分理由，正当理由；道理，情理；判断力，理智", meaningEn: "A cause:", collocations: ["for this reason", "main reason", "good reason"], example: "I had no reason to doubt him.", exampleZh: "我没有理由不相信他。" },
    {
    pos: "v.", meaningZh: "推理，逻辑思考；推论出，推断出（reason sth. out）；对（某人）以理相劝，劝告（reason with）", meaningEn: "To deduce or come to a conclusion by being rational", collocations: [], example: "The reason is blindingly obvious.", exampleZh: "原因十分明显。" },
    {
    pos: "vt.", meaningZh: "说服；推论；辩论", meaningEn: "", collocations: [], example: "That's the only reason I'm actually going.", exampleZh: "这是我确实要走的唯一理由。" },
    {
    pos: "vi.", meaningZh: "推论；劝说；思考", meaningEn: "", collocations: [], example: "There is a reason for every important thing that happens.", exampleZh: "发生的每一件重要事情都是有原因的。" }
    ]
  },
  {
    id: "cause", term: "cause", phonetic: "/kɔːz/", pos: "n.", meaningZh: "原因；导致；原因；事业；理由", meaningEn: "(often with of, typically of adverse results) The source of, or reason for, an event or action; that which produces or effects a result.", band: "5", collocations: ["cause problems", "root cause", "cause damage"], example: "He died for a noble cause.", exampleZh: "他为了高尚的事业而牺牲。",
    senses: [
    {
    pos: "n.", meaningZh: "原因；导致；原因；事业；理由", meaningEn: "(often with of, typically of adverse results) The source of, or reason for, an event or action; that which produces or effects a result.", collocations: ["cause problems", "root cause", "cause damage"], example: "He died for a noble cause.", exampleZh: "他为了高尚的事业而牺牲。" },
    {
    pos: "v.", meaningZh: "引起", meaningEn: "To set off an event or action.", collocations: [], example: "The drugs tend to cause drowsiness.", exampleZh: "这些药常常使人昏昏欲睡。" },
    {
    pos: "vt.", meaningZh: "引起；使产生；使遭受", meaningEn: "", collocations: [], example: "The immediate cause of death is unknown.", exampleZh: "造成死亡的直接原因不明。" }
    ]
  },
  {
    id: "effect", term: "effect", phonetic: "/ɪˈfɛkt/", pos: "n.", meaningZh: "影响；效果；作用，影响；（刻意制造的）效果，印象；所有物，财产；生效，实行", meaningEn: "The result or outcome of a cause.", band: "5", collocations: ["side effect", "positive effect", "have an effect"], example: "His voice had an almost hypnotic effect.", exampleZh: "他的声音有一种近乎催眠的作用。",
    senses: [
    {
    pos: "n.", meaningZh: "影响；效果；作用，影响；（刻意制造的）效果，印象；所有物，财产；生效，实行", meaningEn: "The result or outcome of a cause.", collocations: ["side effect", "positive effect", "have an effect"], example: "His voice had an almost hypnotic effect.", exampleZh: "他的声音有一种近乎催眠的作用。" },
    {
    pos: "v.", meaningZh: "实现，引起", meaningEn: "To make or bring about; to implement.", collocations: [], example: "His words had exactly the opposite effect.", exampleZh: "他的话产生了截然相反的效果。" },
    {
    pos: "vt.", meaningZh: "实行；引起；完成；效果", meaningEn: "", collocations: [], example: "The effect is almost impossible to describe.", exampleZh: "这影响几乎无法言表。" }
    ]
  },
  {
    id: "change", term: "change", phonetic: "/tʃeɪndʒ/", pos: "n.", meaningZh: "改变；变化；变化，变革；找回的钱，零钱；换乘；替代物，替换衣物；全新体验；转成新月；钟乐敲打的一种套路", meaningEn: "The process of becoming different.", band: "5", collocations: ["climate change", "social change", "bring about change"], example: "Leaves change colour in autumn.", exampleZh: "树叶在秋天改变颜色。",
    senses: [
    {
    pos: "n.", meaningZh: "改变；变化；变化，变革；找回的钱，零钱；换乘；替代物，替换衣物；全新体验；转成新月；钟乐敲打的一种套路", meaningEn: "The process of becoming different.", collocations: ["climate change", "social change", "bring about change"], example: "Leaves change colour in autumn.", exampleZh: "树叶在秋天改变颜色。" },
    {
    pos: "v.", meaningZh: "改变，变化；更换，替换；换乘；兑换，找零；交换，互换", meaningEn: "To become something different.", collocations: [], example: "Needs change while policies fossilize.", exampleZh: "政策僵化，需求就产生变化。" },
    {
    pos: "vt.", meaningZh: "改变；更换；兑换", meaningEn: "", collocations: [], example: "Can we change seats?", exampleZh: "咱们可以交换一下座位吗？" }
    ]
  },
  {
    id: "modern", term: "modern", phonetic: "/ˈmɒd(ə)n/", pos: "adj.", meaningZh: "近代的，现代的；当代风格的，现代派的；现代化的，新式的；摩登的，时髦的", meaningEn: "Pertaining to a current or recent time and style; not ancient.", band: "5", collocations: ["modern society", "modern technology", "modern life"], example: "He collects modern sculpture.", exampleZh: "他收藏现代雕塑。",
    senses: [
    {
    pos: "adj.", meaningZh: "近代的，现代的；当代风格的，现代派的；现代化的，新式的；摩登的，时髦的", meaningEn: "Pertaining to a current or recent time and style; not ancient.", collocations: ["modern society", "modern technology", "modern life"], example: "He collects modern sculpture.", exampleZh: "他收藏现代雕塑。" },
    {
    pos: "n.", meaningZh: "现代人；现代派艺术家；主张现代风格的人，宣扬现代价值观的人", meaningEn: "Someone who lives in modern times.", collocations: [], example: "She is very modern in outlook.", exampleZh: "她的看法很时髦。" }
    ]
  },
  {
    id: "global", term: "global", phonetic: "/ˈɡləʊbl/", pos: "adj.", meaningZh: "全球的，全世界的；全面的，整体的；（计算机）全局的；球形的", meaningEn: "relating to the whole world", band: "5", collocations: ["global warming", "global economy", "global issue"], example: "Global warming is a real problem.", exampleZh: "全球变暖是个确实存在的问题。",
    senses: [
    {
    pos: "adj.", meaningZh: "全球的，全世界的；全面的，整体的；（计算机）全局的；球形的", meaningEn: "relating to the whole world", collocations: ["global warming", "global economy", "global issue"], example: "Global warming is a real problem.", exampleZh: "全球变暖是个确实存在的问题。" }
    ]
  },
  {
    id: "social", term: "social", phonetic: "/ˈsəʊʃəl/", pos: "adj.", meaningZh: "社会的；社交的；社会的；社会地位的，社会阶层的；社交的，交际的；好交际的，合群的；群居的", meaningEn: "Being extroverted or outgoing.", band: "5", collocations: ["social media", "social problem", "social skill"], example: "I have a fantastic social life.", exampleZh: "我有着极好的社交生活。",
    senses: [
    {
    pos: "adj.", meaningZh: "社会的；社交的；社会的；社会地位的，社会阶层的；社交的，交际的；好交际的，合群的；群居的", meaningEn: "Being extroverted or outgoing.", collocations: ["social media", "social problem", "social skill"], example: "I have a fantastic social life.", exampleZh: "我有着极好的社交生活。" },
    {
    pos: "n.", meaningZh: "社交聚会，联欢会；<英>社会保障（the social）", meaningEn: "A festive gathering to foster introductions.", collocations: [], example: "She has a full social life.", exampleZh: "她的社交活动非常频繁。" }
    ]
  },
  {
    id: "economic", term: "economic", phonetic: "/ˌiːkəˈnɒmɪk/", pos: "adj.", meaningZh: "经济的，经济学的；有利可图的；节约的", meaningEn: "relating to the economy", band: "5", collocations: ["economic growth", "economic crisis", "economic development"], example: "Economic recovery is here.", exampleZh: "经济复苏现在开始了。",
    senses: [
    {
    pos: "adj.", meaningZh: "经济的，经济学的；有利可图的；节约的", meaningEn: "relating to the economy", collocations: ["economic growth", "economic crisis", "economic development"], example: "Economic recovery is here.", exampleZh: "经济复苏现在开始了。" }
    ]
  },
  {
    id: "physical", term: "physical", phonetic: "/ˈfɪzɪkəl/", pos: "adj.", meaningZh: "身体的；物理的；身体的，肉体的；物质的，有形的；外形的，外在的；物理的，物理学的；根据自然规律的，符合自然法则的；粗暴的，粗野的；性欲的，肉欲的；（人）喜欢动手动脚的；肢体活动的", meaningEn: "Of medicine.", band: "5", collocations: ["physical activity", "physical health", "physical environment"], example: "Bob failed his physical.", exampleZh: "鲍勃没有通过体格检查。",
    senses: [
    {
    pos: "adj.", meaningZh: "身体的；物理的；身体的，肉体的；物质的，有形的；外形的，外在的；物理的，物理学的；根据自然规律的，符合自然法则的；粗暴的，粗野的；性欲的，肉欲的；（人）喜欢动手动脚的；肢体活动的", meaningEn: "Of medicine.", collocations: ["physical activity", "physical health", "physical environment"], example: "Bob failed his physical.", exampleZh: "鲍勃没有通过体格检查。" },
    {
    pos: "n.", meaningZh: "体格检查；（股票）（与期货相对的）现货股票", meaningEn: "Physical examination.", collocations: [], example: "Physical activity promotes good health.", exampleZh: "身体运动促进健康。" }
    ]
  },
  {
    id: "financial", term: "financial", phonetic: "/faɪˈnænʃl/", pos: "adj.", meaningZh: "财政的；金融的；财政的，金融的；<澳新，非正式>有钱的；<澳新>（俱乐部或社团成员）已缴费的", meaningEn: "relating to money", band: "5", collocations: ["financial support", "financial problem", "financial crisis"], example: "It's not just a financial matter.", exampleZh: "这不只是个财务问题。",
    senses: [
    {
    pos: "adj.", meaningZh: "财政的；金融的；财政的，金融的；<澳新，非正式>有钱的；<澳新>（俱乐部或社团成员）已缴费的", meaningEn: "relating to money", collocations: ["financial support", "financial problem", "financial crisis"], example: "It's not just a financial matter.", exampleZh: "这不只是个财务问题。" },
    {
    pos: "n.", meaningZh: "（组织或个人的）财务状况；金融公司股票", meaningEn: "", collocations: [], example: "Tokyo is a major financial centre.", exampleZh: "东京是主要的金融中心。" }
    ]
  },
  {
    id: "individual", term: "individual", phonetic: "/ˌɪndɪˈvɪdʒuəl/", pos: "n.", meaningZh: "个人；个体的；个人，个体；与众不同的人，有个性的人；某种类型的人", meaningEn: "a single person; relating to one person", band: "5", collocations: ["every individual", "individual needs", "individual difference"], example: "Some individual investors exulted at the record.", exampleZh: "一些个人投资者为这一记录欢欣鼓舞。",
    senses: [
    {
    pos: "n.", meaningZh: "个人；个体的；个人，个体；与众不同的人，有个性的人；某种类型的人", meaningEn: "a single person; relating to one person", collocations: ["every individual", "individual needs", "individual difference"], example: "Some individual investors exulted at the record.", exampleZh: "一些个人投资者为这一记录欢欣鼓舞。" },
    {
    pos: "adj.", meaningZh: "单独的，个别的；个人的；独特的，与众不同的", meaningEn: "", collocations: [], example: "It's impossible to hold any individual responsible.", exampleZh: "不可能让任何个人承担责任。" }
    ]
  },
  {
    id: "community", term: "community", phonetic: "/k(ə)ˈmjunəti/", pos: "n.", meaningZh: "社区；群体；社区，社会；（由同国籍、同宗教等构成的）群体，界；（多个国家的）共同体；归属感；（动植物的）群落", meaningEn: "A group sharing a common understanding, and often the same language, law, manners, and/or tradition.", band: "5", collocations: ["local community", "community service", "support the community"], example: "The sense of community is lost.", exampleZh: "团体意识没有了。",
    senses: [
    {
    pos: "n.", meaningZh: "社区；群体；社区，社会；（由同国籍、同宗教等构成的）群体，界；（多个国家的）共同体；归属感；（动植物的）群落", meaningEn: "A group sharing a common understanding, and often the same language, law, manners, and/or tradition.", collocations: ["local community", "community service", "support the community"], example: "The sense of community is lost.", exampleZh: "团体意识没有了。" }
    ]
  },
  {
    id: "resource", term: "resource", phonetic: "/ɹɪˈsɔɹs/", pos: "n.", meaningZh: "自然资源；资源（指钱、物、人等）；有助于实现目标的东西，资料；（对付困境所需的）个人素质（resources）；（逆境中的）出路，应付办法；<正式> 谋略，智谋", meaningEn: "Something that one uses to achieve an objective, e.g. raw materials or personnel.", band: "5", collocations: ["natural resources", "human resources", "limited resources"], example: "A country's principal resource is its brainpower.", exampleZh: "一个国家最重要的资源是其人才库。",
    senses: [
    {
    pos: "n.", meaningZh: "自然资源；资源（指钱、物、人等）；有助于实现目标的东西，资料；（对付困境所需的）个人素质（resources）；（逆境中的）出路，应付办法；<正式> 谋略，智谋", meaningEn: "Something that one uses to achieve an objective, e.g. raw materials or personnel.", collocations: ["natural resources", "human resources", "limited resources"], example: "A country's principal resource is its brainpower.", exampleZh: "一个国家最重要的资源是其人才库。" },
    {
    pos: "v.", meaningZh: "向……提供资金（或设备）", meaningEn: "To supply with resources.", collocations: [], example: "When necessary, instinct is the most reliable resource you can fall back on.", exampleZh: "必要时，本能是你可使用的最可靠的资源。" }
    ]
  },
  {
    id: "energy", term: "energy", phonetic: "/ˈɛnəd͡ʒi/", pos: "n.", meaningZh: "能源；能量；能力，力气；精力，活力；能源；能，能量", meaningEn: "The impetus behind all motion and all activity.", band: "5", collocations: ["renewable energy", "save energy", "energy supply"], example: "She's always full of energy.", exampleZh: "她总是充满活力。",
    senses: [
    {
    pos: "n.", meaningZh: "能源；能量；能力，力气；精力，活力；能源；能，能量", meaningEn: "The impetus behind all motion and all activity.", collocations: ["renewable energy", "save energy", "energy supply"], example: "She's always full of energy.", exampleZh: "她总是充满活力。" }
    ]
  },
  {
    id: "climate", term: "climate", phonetic: "/ˈklaɪmət/", pos: "n.", meaningZh: "气候；气候区；氛围，局势", meaningEn: "the typical weather of a place", band: "5", collocations: ["climate change", "global climate", "climate crisis"], example: "The economic climate remains uncertain.", exampleZh: "经济气候依然是不确定。",
    senses: [
    {
    pos: "n.", meaningZh: "气候；气候区；氛围，局势", meaningEn: "the typical weather of a place", collocations: ["climate change", "global climate", "climate crisis"], example: "The economic climate remains uncertain.", exampleZh: "经济气候依然是不确定。" }
    ]
  },
  {
    id: "behaviour", term: "behaviour", phonetic: "/bɪˈheɪvjə/", pos: "n.", meaningZh: "行为，举止，态度；活动方式，特点，特性；习惯", meaningEn: "The way a living creature behaves or acts.", band: "5", collocations: ["human behaviour", "social behaviour", "change behaviour"], example: "Their behaviour was noxious.", exampleZh: "他们的行为令人生厌。",
    senses: [
    {
    pos: "n.", meaningZh: "行为，举止，态度；活动方式，特点，特性；习惯", meaningEn: "The way a living creature behaves or acts.", collocations: ["human behaviour", "social behaviour", "change behaviour"], example: "Their behaviour was noxious.", exampleZh: "他们的行为令人生厌。" }
    ]
  },
  {
    id: "knowledge", term: "knowledge", phonetic: "/ˈnɒlɪdʒ/", pos: "n.", meaningZh: "知识，学问；知道，了解；计算机系统存储的信息；（与见解相对的）认知", meaningEn: "The fact of knowing about something; general understanding or familiarity with a subject, place, situation etc.", band: "5", collocations: ["prior knowledge", "broad knowledge", "gain knowledge"], example: "His knowledge of music is extensive.", exampleZh: "他音乐知识很广博。",
    senses: [
    {
    pos: "n.", meaningZh: "知识，学问；知道，了解；计算机系统存储的信息；（与见解相对的）认知", meaningEn: "The fact of knowing about something; general understanding or familiarity with a subject, place, situation etc.", collocations: ["prior knowledge", "broad knowledge", "gain knowledge"], example: "His knowledge of music is extensive.", exampleZh: "他音乐知识很广博。" },
    {
    pos: "v.", meaningZh: "", meaningEn: "To confess as true; to acknowledge.", collocations: [], example: "His knowledge of French is only fair.", exampleZh: "他的法语知识还算可以。" }
    ]
  },
  {
    id: "skill", term: "skill", phonetic: "/skɪl/", pos: "n.", meaningZh: "技巧， 技艺；（特定的）技术，技能", meaningEn: "the ability to do something well", band: "5", collocations: ["communication skills", "life skills", "develop a skill"], example: "They competed with skill and tenacity.", exampleZh: "他们竞争靠的是技术和顽强意志。",
    senses: [
    {
    pos: "n.", meaningZh: "技巧， 技艺；（特定的）技术，技能", meaningEn: "the ability to do something well", collocations: ["communication skills", "life skills", "develop a skill"], example: "They competed with skill and tenacity.", exampleZh: "他们竞争靠的是技术和顽强意志。" },
    {
    pos: "v.", meaningZh: "培训（工人）", meaningEn: "", collocations: [], example: "Her job demands a high degree of skill.", exampleZh: "她的工作要求有高超的技能。" }
    ]
  },
  {
    id: "improve", term: "improve", phonetic: "/ɪmˈpɹuːv/", pos: "v.", meaningZh: "改善；提高；康复，健康好转；超过，胜过；提高……的价值；改善，变得更好", meaningEn: "To make (something) better; to increase the value or productivity (of something).", band: "5", collocations: ["improve performance", "improve efficiency", "improve life"], example: "I need to improve my English.", exampleZh: "我需要提高我的英语水平。",
    senses: [
    {
    pos: "v.", meaningZh: "改善；提高；康复，健康好转；超过，胜过；提高……的价值；改善，变得更好", meaningEn: "To make (something) better; to increase the value or productivity (of something).", collocations: ["improve performance", "improve efficiency", "improve life"], example: "I need to improve my English.", exampleZh: "我需要提高我的英语水平。" },
    {
    pos: "vt.", meaningZh: "改良；提高...的价值；改善；利用", meaningEn: "", collocations: [], example: "I need to improve my French.", exampleZh: "我得提高我的法语水平。" },
    {
    pos: "vi.", meaningZh: "变得更好；增加", meaningEn: "", collocations: [], example: "Don't expect it to improve overnight.", exampleZh: "不要指望这事一下子就改善了。" }
    ]
  },
  {
    id: "reduce", term: "reduce", phonetic: "/ɹɪˈdjuːs/", pos: "v.", meaningZh: "减少；降低；减少，降低；（烹调中）使变浓稠，收汁；<美>节食减肥；使沦为，使陷入（不好的境地）；迫使，使不得不（做）；（通过破裂、燃烧等）使变成，使化为；归纳，简化；将分数约到（最小项）；（使）进行还原反应；减薄（底片或图片）；（语音）弱化；使（脱臼，断骨）复位；<古>攻克，征服（尤指围攻并占领城镇或要塞）", meaningEn: "To bring down the size, quantity, quality, value or intensity of something; to diminish, to lower.", band: "5", collocations: ["reduce costs", "reduce pollution", "reduce risk"], example: "The packets are measured to reduce waste.", exampleZh: "测量包裹尺寸以减少浪费。",
    senses: [
    {
    pos: "v.", meaningZh: "减少；降低；减少，降低；（烹调中）使变浓稠，收汁；<美>节食减肥；使沦为，使陷入（不好的境地）；迫使，使不得不（做）；（通过破裂、燃烧等）使变成，使化为；归纳，简化；将分数约到（最小项）；（使）进行还原反应；减薄（底片或图片）；（语音）弱化；使（脱臼，断骨）复位；<古>攻克，征服（尤指围攻并占领城镇或要塞）", meaningEn: "To bring down the size, quantity, quality, value or intensity of something; to diminish, to lower.", collocations: ["reduce costs", "reduce pollution", "reduce risk"], example: "The packets are measured to reduce waste.", exampleZh: "测量包裹尺寸以减少浪费。" },
    {
    pos: "vt.", meaningZh: "减少；分解；降低；使衰退；把...分解；把...归纳", meaningEn: "", collocations: [], example: "The government is looking to reduce inflation.", exampleZh: "政府正在力求降低通货膨胀率。" },
    {
    pos: "vi.", meaningZh: "减少；减肥；缩小", meaningEn: "", collocations: [], example: "These sunglasses are designed to reduce glare.", exampleZh: "这些太阳镜是为减少刺眼的强光而设计的。" }
    ]
  },
  {
    id: "prevent", term: "prevent", phonetic: "/pɹəˈvɛnt/", pos: "v.", meaningZh: "防止；预防；阻止，阻碍；防止，预防；设置障碍", meaningEn: "To stop (an outcome); to keep from (doing something).", band: "5", collocations: ["prevent disease", "prevent accidents", "prevent from"], example: "These methods prevent pregnancy.", exampleZh: "这些方法预防怀孕。",
    senses: [
    {
    pos: "v.", meaningZh: "防止；预防；阻止，阻碍；防止，预防；设置障碍", meaningEn: "To stop (an outcome); to keep from (doing something).", collocations: ["prevent disease", "prevent accidents", "prevent from"], example: "These methods prevent pregnancy.", exampleZh: "这些方法预防怀孕。" }
    ]
  },
  {
    id: "support", term: "support", phonetic: "/səˈpɔːt/", pos: "v.", meaningZh: "支持，拥护，鼓励；帮助，援助；支撑，承受（人或建筑物等的重量）；供养，赡养；资助，赞助；追随（或支持）（某个运动队）；证实，确认；（计算机，操作系统）支持（程序，语言，装置的）运行 ；支持……的生存；忍受，容忍；（在流行音乐会上）当助演，担任演出嘉宾；支付……费用，（尤指）用钱维持（不良嗜好，如毒品）；胜任", meaningEn: "To keep from falling.", band: "5", collocations: ["provide support", "strong support", "in support of"], example: "We assured him of our support.", exampleZh: "我们向他保证给予支持。",
    senses: [
    {
    pos: "v.", meaningZh: "支持，拥护，鼓励；帮助，援助；支撑，承受（人或建筑物等的重量）；供养，赡养；资助，赞助；追随（或支持）（某个运动队）；证实，确认；（计算机，操作系统）支持（程序，语言，装置的）运行 ；支持……的生存；忍受，容忍；（在流行音乐会上）当助演，担任演出嘉宾；支付……费用，（尤指）用钱维持（不良嗜好，如毒品）；胜任", meaningEn: "To keep from falling.", collocations: ["provide support", "strong support", "in support of"], example: "We assured him of our support.", exampleZh: "我们向他保证给予支持。" },
    {
    pos: "n.", meaningZh: "支持，拥护；帮助，援助；赞助，资助；支撑物，支柱；（身体部位的）支持器，托；支撑，支承；（音乐会、演出的）助演演员，助演乐队；证实，证明；信息供应，信息支持；（战争中的）支援；抚养，供养；支持者，拥护者", meaningEn: "(sometimes attributive) Something which supports.", collocations: [], example: "We offer free technical support.", exampleZh: "我们免费提供技术支持。" },
    {
    pos: "vt.", meaningZh: "支援；支撑；帮助；支持；忍受；供养；证实；后援；支持", meaningEn: "", collocations: [], example: "I gave her my unqualified support.", exampleZh: "我全力支持她。" }
    ]
  },
  {
    id: "encourage", term: "encourage", phonetic: "/ɪnˈkʌɹɪdʒ/", pos: "v.", meaningZh: "鼓励，激励；鼓动，怂恿；刺激，促进", meaningEn: "to give confidence or hope", band: "5", collocations: ["encourage learning", "encourage participation", "strongly encourage"], example: "Parents encourage every activity imaginable.", exampleZh: "父母鼓励一切可能的活动。",
    senses: [
    {
    pos: "v.", meaningZh: "鼓励，激励；鼓动，怂恿；刺激，促进", meaningEn: "to give confidence or hope", collocations: ["encourage learning", "encourage participation", "strongly encourage"], example: "Parents encourage every activity imaginable.", exampleZh: "父母鼓励一切可能的活动。" },
    {
    pos: "vt.", meaningZh: "鼓励；支持；激励；怂恿；煽动；助长", meaningEn: "", collocations: [], example: "They encourage boys to be sensitive and artistic.", exampleZh: "他们鼓励男孩子们要反应敏感并有美术才能。" }
    ]
  },
  {
    id: "achieve", term: "achieve", phonetic: "/əˈtʃiːv/", pos: "v.", meaningZh: "实现；达成；（经努力）达到，取得，实现；获得成功", meaningEn: "To succeed in something, now especially in academic performance.", band: "6", collocations: ["achieve a goal", "achieve success", "achieve progress"], example: "The medicine did not achieve the desired effect.", exampleZh: "这种药未达到预期效果。",
    senses: [
    {
    pos: "v.", meaningZh: "实现；达成；（经努力）达到，取得，实现；获得成功", meaningEn: "To succeed in something, now especially in academic performance.", collocations: ["achieve a goal", "achieve success", "achieve progress"], example: "The medicine did not achieve the desired effect.", exampleZh: "这种药未达到预期效果。" },
    {
    pos: "vt.", meaningZh: "完成；达到", meaningEn: "", collocations: [], example: "Teamwork is required in order to achieve these aims.", exampleZh: "要达到这些目标需要齐心协力。" },
    {
    pos: "vi.", meaningZh: "如愿以偿", meaningEn: "", collocations: [], example: "Set yourself targets that you can reasonably hope to achieve.", exampleZh: "给自己制订有望达到的指标。" }
    ]
  },
  {
    id: "conclusion", term: "conclusion", phonetic: "/kənˈkluːʒən/", pos: "n.", meaningZh: "结论，推论；结局，结尾；缔结，商定；（根据所给前提得出的）命题", meaningEn: "The end, finish, close or last part of something.", band: "6", collocations: ["draw a conclusion", "in conclusion", "reach a conclusion"], example: "What led you to this conclusion?", exampleZh: "你是如何得出这个结论的？",
    senses: [
    {
    pos: "n.", meaningZh: "结论，推论；结局，结尾；缔结，商定；（根据所给前提得出的）命题", meaningEn: "The end, finish, close or last part of something.", collocations: ["draw a conclusion", "in conclusion", "reach a conclusion"], example: "What led you to this conclusion?", exampleZh: "你是如何得出这个结论的？" }
    ]
  },
  {
    id: "contribute", term: "contribute", phonetic: "/kənˈt(ʃ)ɹɪb.juːt/", pos: "v.", meaningZh: "捐赠，捐助；（为……）做贡献；促成，是……的原因之一；撰稿，投稿；发表意见，提议", meaningEn: "To give something that is or becomes part of a larger whole.", band: "6", collocations: ["contribute to", "contribute significantly", "contribute ideas"], example: "Do you wish to contribute?", exampleZh: "你想捐助吗？",
    senses: [
    {
    pos: "v.", meaningZh: "捐赠，捐助；（为……）做贡献；促成，是……的原因之一；撰稿，投稿；发表意见，提议", meaningEn: "To give something that is or becomes part of a larger whole.", collocations: ["contribute to", "contribute significantly", "contribute ideas"], example: "Do you wish to contribute?", exampleZh: "你想捐助吗？" },
    {
    pos: "vt.", meaningZh: "有助于；捐助；投稿", meaningEn: "", collocations: [], example: "You need not feel obliged to contribute.", exampleZh: "你不必认为你非得捐款。" },
    {
    pos: "vi.", meaningZh: "出力；捐献；投稿", meaningEn: "", collocations: [], example: "Local businesses have agreed to contribute.", exampleZh: "当地的公司已经同意捐助了。" }
    ]
  },
  {
    id: "establish", term: "establish", phonetic: "/ɪˈstæb.lɪʃ/", pos: "v.", meaningZh: "建立；确立；建立，设立；证实，确定；发现，找出；使被接受，使得到承认；使（故事的角色）真实；（桥牌）（通过出大牌）使（某）花色所剩的牌都能赢", meaningEn: "to set up or found", band: "6", collocations: ["establish a system", "establish relations", "establish a rule"], example: "Ukraine indicated that it would establish its own army, 400,000 strong.", exampleZh: "乌克兰表示它将建立自己的军队，多达40万人。",
    senses: [
    {
    pos: "v.", meaningZh: "建立；确立；建立，设立；证实，确定；发现，找出；使被接受，使得到承认；使（故事的角色）真实；（桥牌）（通过出大牌）使（某）花色所剩的牌都能赢", meaningEn: "to set up or found", collocations: ["establish a system", "establish relations", "establish a rule"], example: "Ukraine indicated that it would establish its own army, 400,000 strong.", exampleZh: "乌克兰表示它将建立自己的军队，多达40万人。" },
    {
    pos: "vt.", meaningZh: "建立；确立；制定", meaningEn: "", collocations: [], example: "We're trying to establish linkages between these groups and financial institutions.", exampleZh: "我们正试图建立这些团体和金融机构间的联系。" },
    {
    pos: "vi.", meaningZh: "移植生长", meaningEn: "", collocations: [], example: "Police are trying to establish the cause of death.", exampleZh: "警方在设法确定死因。" }
    ]
  },
  {
    id: "factor", term: "factor", phonetic: "/ˈfæktə/", pos: "n.", meaningZh: "因素，要素；等级，系数；因数，因子；遗传因子，基因；（血液中的）凝血因子；代理公司，代理商；<苏格兰>地产管理人，管家；测量水平", meaningEn: "A doer, maker; a person who does things for another person or organization.", band: "6", collocations: ["key factor", "contributing factor", "major factor"], example: "Lack of cash is a limiting factor.", exampleZh: "现金短缺是一个制约因素。",
    senses: [
    {
    pos: "n.", meaningZh: "因素，要素；等级，系数；因数，因子；遗传因子，基因；（血液中的）凝血因子；代理公司，代理商；<苏格兰>地产管理人，管家；测量水平", meaningEn: "A doer, maker; a person who does things for another person or organization.", collocations: ["key factor", "contributing factor", "major factor"], example: "Lack of cash is a limiting factor.", exampleZh: "现金短缺是一个制约因素。" },
    {
    pos: "v.", meaningZh: "把……作为因素计入，把……包括在内（factor in）；把……作为因素排除，不把……包括在内（factor out）；将……分解为因子；代理经营，（代管）产业；做代理商", meaningEn: "To find all the factors of (a number or other mathematical object) (the objects that divide it evenly).", collocations: [], example: "Haemophiliacs have no factor 8 in their blood.", exampleZh: "血友病患者的血液中缺乏凝血因子 VIII。" }
    ]
  },
  {
    id: "indicate", term: "indicate", phonetic: "/ˈɪndɪkeɪt/", pos: "v.", meaningZh: "表明；显示；表明，标示；象征，暗示；间接提及，示意；指示，指出；<英>（用灯光或手臂）打行车转向信号；有必要，被建议", meaningEn: "to show or suggest", band: "6", collocations: ["indicate that", "clearly indicate", "indicate a trend"], example: "The extent of the rise might indicate that it had been overdone.", exampleZh: "上涨的程度可能显示事情做得过头了。",
    senses: [
    {
    pos: "v.", meaningZh: "表明；显示；表明，标示；象征，暗示；间接提及，示意；指示，指出；<英>（用灯光或手臂）打行车转向信号；有必要，被建议", meaningEn: "to show or suggest", collocations: ["indicate that", "clearly indicate", "indicate a trend"], example: "The extent of the rise might indicate that it had been overdone.", exampleZh: "上涨的程度可能显示事情做得过头了。" },
    {
    pos: "vt.", meaningZh: "显示；象征；指示；指出", meaningEn: "", collocations: [], example: "Early results indicate that the government will be returned to power.", exampleZh: "早期的结果预示这个政府将重新执政。" }
    ]
  },
  {
    id: "demonstrate", term: "demonstrate", phonetic: "/ˈdɛmənstɹeɪt/", pos: "v.", meaningZh: "证明；演示；证明；示范，演示；表露；游行，示威", meaningEn: "to show clearly by giving proof or example", band: "6", collocations: ["demonstrate that", "clearly demonstrate", "demonstrate ability"], example: "We want to demonstrate our commitment to human rights.", exampleZh: "我们想表明我们对人权的信念。",
    senses: [
    {
    pos: "v.", meaningZh: "证明；演示；证明；示范，演示；表露；游行，示威", meaningEn: "to show clearly by giving proof or example", collocations: ["demonstrate that", "clearly demonstrate", "demonstrate ability"], example: "We want to demonstrate our commitment to human rights.", exampleZh: "我们想表明我们对人权的信念。" },
    {
    pos: "vt.", meaningZh: "示范；证明", meaningEn: "", collocations: [], example: "These results demonstrate convincingly that our campaign is working.", exampleZh: "这些结果有力地证明，我们的运动正在发挥作用。" },
    {
    pos: "vi.", meaningZh: "示威", meaningEn: "", collocations: [], example: "They are anxious to demonstrate to the voters that they have practical policies.", exampleZh: "他们急于向选民证明他们有切实可行的政策。" }
    ]
  },
  {
    id: "evaluate", term: "evaluate", phonetic: "/ɨˈvaljʊeɪt/", pos: "v.", meaningZh: "评估；评价；评价，评估，估值；求（方程式，公式，函数）的数值", meaningEn: "To draw conclusions from examining; to assess.", band: "6", collocations: ["evaluate the impact", "carefully evaluate", "evaluate performance"], example: "The market situation is difficult to evaluate.", exampleZh: "市场形势难以评估。",
    senses: [
    {
    pos: "v.", meaningZh: "评估；评价；评价，评估，估值；求（方程式，公式，函数）的数值", meaningEn: "To draw conclusions from examining; to assess.", collocations: ["evaluate the impact", "carefully evaluate", "evaluate performance"], example: "The market situation is difficult to evaluate.", exampleZh: "市场形势难以评估。" },
    {
    pos: "vt.", meaningZh: "评估；评价；赋值", meaningEn: "", collocations: [], example: "We need to learn how to evaluate them properly.", exampleZh: "我们需要学习如何正确地评估它们。" }
    ]
  },
  {
    id: "occur", term: "occur", phonetic: "/əˈkɜː/", pos: "v.", meaningZh: "（尤指意外地）发生；存在，出现；（想法）产生", meaningEn: "To happen or take place.", band: "6", collocations: ["occur in", "frequently occur", "occur to"], example: "When exactly did the incident occur?", exampleZh: "这一事件究竟是什么时候发生的？",
    senses: [
    {
    pos: "v.", meaningZh: "（尤指意外地）发生；存在，出现；（想法）产生", meaningEn: "To happen or take place.", collocations: ["occur in", "frequently occur", "occur to"], example: "When exactly did the incident occur?", exampleZh: "这一事件究竟是什么时候发生的？" },
    {
    pos: "vi.", meaningZh: "发生；被想到；存在", meaningEn: "", collocations: [], example: "These snails do not occur on low-lying coral islands.", exampleZh: "这些蜗牛不会出现在低洼的珊瑚岛上。" }
    ]
  },
  {
    id: "specific", term: "specific", phonetic: "/spəˈsɪf.ɪk/", pos: "adj.", meaningZh: "明确的，具体的；特定的；特有的，独特的；有特殊功能的，有特效的；（生物）种的；（关税，税）按数量（根据固定税率）征取而非按货价征取的；（物理）（与参照物同一性质成）比率的", meaningEn: "Explicit or definite", band: "6", collocations: ["specific example", "specific purpose", "more specific"], example: "I gave you specific instructions.", exampleZh: "我给过你明确的指示。",
    senses: [
    {
    pos: "adj.", meaningZh: "明确的，具体的；特定的；特有的，独特的；有特殊功能的，有特效的；（生物）种的；（关税，税）按数量（根据固定税率）征取而非按货价征取的；（物理）（与参照物同一性质成）比率的", meaningEn: "Explicit or definite", collocations: ["specific example", "specific purpose", "more specific"], example: "I gave you specific instructions.", exampleZh: "我给过你明确的指示。" },
    {
    pos: "n.", meaningZh: "细节，详情；特效药", meaningEn: "A distinguishing attribute or quality.", collocations: [], example: "His charge was to obtain specific information.", exampleZh: "他的任务是收集具体的信息。" }
    ]
  },
  {
    id: "structure", term: "structure", phonetic: "/ˈstɹʌktʃə(ɹ)/", pos: "n.", meaningZh: "结构；组织；结构，构造；结构体，（尤指）大型建筑物；周密安排，精心组织；机构，组织，体系", meaningEn: "A cohesive whole built up of distinct parts.", band: "6", collocations: ["social structure", "clear structure", "well-structured"], example: "Your essay needs (a) structure.", exampleZh: "你这篇文章组织不好。",
    senses: [
    {
    pos: "n.", meaningZh: "结构；组织；结构，构造；结构体，（尤指）大型建筑物；周密安排，精心组织；机构，组织，体系", meaningEn: "A cohesive whole built up of distinct parts.", collocations: ["social structure", "clear structure", "well-structured"], example: "Your essay needs (a) structure.", exampleZh: "你这篇文章组织不好。" },
    {
    pos: "v.", meaningZh: "计划，组织，安排", meaningEn: "To give structure to; to arrange.", collocations: [], example: "How well does the teacher structure the lessons?", exampleZh: "老师对课程组织安排得如何？" },
    {
    pos: "vt.", meaningZh: "构成；组织", meaningEn: "", collocations: [], example: "Sections of the structure have been left unsupported.", exampleZh: "这个结构有几部分没有支撑。" }
    ]
  },
  {
    id: "tradition", term: "tradition", phonetic: "/tɹəˈdɪʃn̩/", pos: "n.", meaningZh: "传统，惯例；传统故事，传说，传统信仰；和著名历史人物有共同品质的人；（神学）圣传", meaningEn: "A part of culture that is passed from person to person or generation to generation, possibly differing in detail from family to family, such as the way to celebrate holidays.", band: "6", collocations: ["cultural tradition", "break with tradition", "long tradition"], example: "This region is steeped in tradition.", exampleZh: "这个地区有着深厚的传统。",
    senses: [
    {
    pos: "n.", meaningZh: "传统，惯例；传统故事，传说，传统信仰；和著名历史人物有共同品质的人；（神学）圣传", meaningEn: "A part of culture that is passed from person to person or generation to generation, possibly differing in detail from family to family, such as the way to celebrate holidays.", collocations: ["cultural tradition", "break with tradition", "long tradition"], example: "This region is steeped in tradition.", exampleZh: "这个地区有着深厚的传统。" },
    {
    pos: "v.", meaningZh: "", meaningEn: "To transmit by way of tradition; to hand down.", collocations: [], example: "It was a radical departure from tradition.", exampleZh: "这从根本上违背了传统。" }
    ]
  },
  {
    id: "maintain", term: "maintain", phonetic: "/meɪnˈteɪn/", pos: "v.", meaningZh: "维持；保持；保持，维持；维修，保养；断言，主张；赡养，抚养；<旧>支持，维护", meaningEn: "to keep something in a particular state", band: "6", collocations: ["maintain order", "maintain a balance", "maintain that"], example: "The house costs a fortune to maintain.", exampleZh: "维修这房子花费巨大。",
    senses: [
    {
    pos: "v.", meaningZh: "维持；保持；保持，维持；维修，保养；断言，主张；赡养，抚养；<旧>支持，维护", meaningEn: "to keep something in a particular state", collocations: ["maintain order", "maintain a balance", "maintain that"], example: "The house costs a fortune to maintain.", exampleZh: "维修这房子花费巨大。" },
    {
    pos: "vt.", meaningZh: "维持；维修；保持；坚持；供养；主张", meaningEn: "", collocations: [], example: "It's hard to maintain competitive pricing.", exampleZh: "很难保持有竞争力的定价。" }
    ]
  },
  {
    id: "vary", term: "vary", phonetic: "/ˈvɛəɹi/", pos: "v.", meaningZh: "变化；不同；（使）不同，（使）呈现差异；（根据情况而）变化，改变；改变，使……变化；变奏", meaningEn: "To change with time or a similar parameter.", band: "6", collocations: ["vary from", "vary widely", "vary according to"], example: "Her novels vary in length.", exampleZh: "她的小说篇幅长短不一。",
    senses: [
    {
    pos: "v.", meaningZh: "变化；不同；（使）不同，（使）呈现差异；（根据情况而）变化，改变；改变，使……变化；变奏", meaningEn: "To change with time or a similar parameter.", collocations: ["vary from", "vary widely", "vary according to"], example: "Her novels vary in length.", exampleZh: "她的小说篇幅长短不一。" },
    {
    pos: "n.", meaningZh: "", meaningEn: "Alteration; change.", collocations: [], example: "Other services vary dramatically in quality.", exampleZh: "其它服务在质量上差异很大。" },
    {
    pos: "vt.", meaningZh: "改变；使多样化", meaningEn: "", collocations: [], example: "Prices vary according to the quantity ordered.", exampleZh: "价格根据所订数量而变化。" },
    {
    pos: "vi.", meaningZh: "变化；有不同；违反", meaningEn: "", collocations: [], example: "As they're handmade, each one varies slightly.", exampleZh: "由于它们是手工制作的，每一件都会略有不同。" }
    ]
  },
  {
    id: "analysis", term: "analysis", phonetic: "/əˈnælɪsɪs/", pos: "n.", meaningZh: "分析；化验分析；心理分析，精神分析；分析报告", meaningEn: "Decomposition into components in order to study (a complex thing, concept, theory etc.).", band: "6", collocations: ["data analysis", "in-depth analysis", "further analysis"], example: "I agree with her analysis of the situation.", exampleZh: "我赞成她对形势的分析。",
    senses: [
    {
    pos: "n.", meaningZh: "分析；化验分析；心理分析，精神分析；分析报告", meaningEn: "Decomposition into components in order to study (a complex thing, concept, theory etc.).", collocations: ["data analysis", "in-depth analysis", "further analysis"], example: "I agree with her analysis of the situation.", exampleZh: "我赞成她对形势的分析。" }
    ]
  },
  {
    id: "approach", term: "approach", phonetic: "/əˈpɹəʊt͡ʃ/", pos: "n.", meaningZh: "方法；接近；方法，态度；靠近，接近；接洽，要求；通道，路径；进场着陆；近似物", meaningEn: "The act of drawing near; a coming or advancing near.", band: "6", collocations: ["a new approach", "approach to", "practical approach"], example: "I have an analytical approach to every survey.", exampleZh: "我对每项调查都采用一种分析的方法。",
    senses: [
    {
    pos: "n.", meaningZh: "方法；接近；方法，态度；靠近，接近；接洽，要求；通道，路径；进场着陆；近似物", meaningEn: "The act of drawing near; a coming or advancing near.", collocations: ["a new approach", "approach to", "practical approach"], example: "I have an analytical approach to every survey.", exampleZh: "我对每项调查都采用一种分析的方法。" },
    {
    pos: "v.", meaningZh: "靠近，临近；接洽，交谈；对付，处理；近似，接近于", meaningEn: "To come or go near, in place or time; to draw nigh; to advance nearer.", collocations: [], example: "There's a certain novelty value in this approach.", exampleZh: "这种方法有一定的新意。" },
    {
    pos: "vt.", meaningZh: "接近；近似；找...商量", meaningEn: "", collocations: [], example: "He took a very scientific approach to management.", exampleZh: "他采取了一种非常科学的管理方法。" },
    {
    pos: "vi.", meaningZh: "靠近", meaningEn: "", collocations: [], example: "He didn't approach the front door at once.", exampleZh: "他没有立即走近前门。" }
    ]
  },
  {
    id: "assess", term: "assess", phonetic: "/əˈsɛs/", pos: "v.", meaningZh: "评估；评价，评定；估价，估计；征税，处以罚金", meaningEn: "To determine, estimate or judge the value of; to evaluate", band: "6", collocations: ["assess risk", "assess performance", "carefully assess"], example: "It's difficult to assess the effects of these changes.", exampleZh: "这些变化带来的效果难以评估。",
    senses: [
    {
    pos: "v.", meaningZh: "评估；评价，评定；估价，估计；征税，处以罚金", meaningEn: "To determine, estimate or judge the value of; to evaluate", collocations: ["assess risk", "assess performance", "carefully assess"], example: "It's difficult to assess the effects of these changes.", exampleZh: "这些变化带来的效果难以评估。" },
    {
    pos: "vt.", meaningZh: "估定；对...征税；评定；估计；估价；确定(税款罚款等)的金额", meaningEn: "", collocations: [], example: "The test was to assess aptitude rather than academic achievement.", exampleZh: "该测试将评估能力而不是学业成绩。" }
    ]
  },
  {
    id: "assume", term: "assume", phonetic: "/əˈsuːm/", pos: "v.", meaningZh: "假设；认为；假定，假设，认为；装出，做出；承担，就职；呈现，具有；夺取，篡夺", meaningEn: "To authenticate by means of belief; to surmise; to suppose to be true, especially without proof", band: "6", collocations: ["assume that", "it is assumed", "assume responsibility"], example: "We were wrong to assume she'd agree.", exampleZh: "我们错误地以为她会同意。",
    senses: [
    {
    pos: "v.", meaningZh: "假设；认为；假定，假设，认为；装出，做出；承担，就职；呈现，具有；夺取，篡夺", meaningEn: "To authenticate by means of belief; to surmise; to suppose to be true, especially without proof", collocations: ["assume that", "it is assumed", "assume responsibility"], example: "We were wrong to assume she'd agree.", exampleZh: "我们错误地以为她会同意。" },
    {
    pos: "vt.", meaningZh: "假定；承担；呈现", meaningEn: "", collocations: [], example: "We were wrong to assume that she'd agree.", exampleZh: "我们错误地以为她会同意。" },
    {
    pos: "vi.", meaningZh: "装腔作势；僭越", meaningEn: "", collocations: [], example: "Assume A knows B is guilty.", exampleZh: "假定甲知道乙应负罪责。" }
    ]
  },
  {
    id: "communication", term: "communication", phonetic: "/kəˌmjuːnɪˈkeɪʃən/", pos: "n.", meaningZh: "沟通；交流；表达，交流，交际；信息，书信，电话；通讯，交通联系；传播学", meaningEn: "the exchange of information", band: "6", collocations: ["effective communication", "communication skills", "verbal communication"], example: "Good communication is key to our success.", exampleZh: "良好的沟通是我们成功的关键。",
    senses: [
    {
    pos: "n.", meaningZh: "沟通；交流；表达，交流，交际；信息，书信，电话；通讯，交通联系；传播学", meaningEn: "the exchange of information", collocations: ["effective communication", "communication skills", "verbal communication"], example: "Good communication is key to our success.", exampleZh: "良好的沟通是我们成功的关键。" }
    ]
  },
  {
    id: "complex", term: "complex", phonetic: "/ˈkɒmpleks/", pos: "adj.", meaningZh: "复杂的，难懂的；组合的，合成的；（句子）复合的；复数的，复的；配合的，络合的", meaningEn: "Made up of multiple parts; composite; not simple.", band: "6", collocations: ["complex issue", "complex system", "increasingly complex"], example: "He was an unusually complex man.", exampleZh: "他是个异常复杂的人。",
    senses: [
    {
    pos: "adj.", meaningZh: "复杂的，难懂的；组合的，合成的；（句子）复合的；复数的，复的；配合的，络合的", meaningEn: "Made up of multiple parts; composite; not simple.", collocations: ["complex issue", "complex system", "increasingly complex"], example: "He was an unusually complex man.", exampleZh: "他是个异常复杂的人。" },
    {
    pos: "n.", meaningZh: "综合大楼，建筑群；复合体，综合体；情结；强烈（或过度）的关心（或忧虑）；配合物，络合物", meaningEn: "A network of interconnected systems.", collocations: [], example: "Now, the next point is quite complex.", exampleZh: "请注意，下一点非常复杂。" },
    {
    pos: "v.", meaningZh: "", meaningEn: "To form a complex with another substance", collocations: [], example: "It is a complex yet stimulating book.", exampleZh: "这是一本复杂却能引发兴趣的书。" }
    ]
  },
  {
    id: "consider", term: "consider", phonetic: "/kənˈsɪdə/", pos: "v.", meaningZh: "考虑；认为；考虑，斟酌；认为，视为；体贴，顾及；细看，端详；探讨，讨论", meaningEn: "To think about seriously.", band: "6", collocations: ["consider carefully", "consider doing", "widely considered"], example: "I'd like some time to consider.", exampleZh: "我希望有些时间考虑一下。",
    senses: [
    {
    pos: "v.", meaningZh: "考虑；认为；考虑，斟酌；认为，视为；体贴，顾及；细看，端详；探讨，讨论", meaningEn: "To think about seriously.", collocations: ["consider carefully", "consider doing", "widely considered"], example: "I'd like some time to consider.", exampleZh: "我希望有些时间考虑一下。" }
    ]
  },
  {
    id: "consume", term: "consume", phonetic: "/kənˈsjuːm/", pos: "v.", meaningZh: "消耗；消费；消耗，消费；吃，喝；吞噬，烧毁；使……着迷，充满", meaningEn: "To use up.", band: "6", collocations: ["consume energy", "consume resources", "consume less"], example: "Many people are unaware of just how much food and drink they consume.", exampleZh: "许多人不知道自己到底消耗掉多少食物和饮料。",
    senses: [
    {
    pos: "v.", meaningZh: "消耗；消费；消耗，消费；吃，喝；吞噬，烧毁；使……着迷，充满", meaningEn: "To use up.", collocations: ["consume energy", "consume resources", "consume less"], example: "Many people are unaware of just how much food and drink they consume.", exampleZh: "许多人不知道自己到底消耗掉多少食物和饮料。" },
    {
    pos: "vt.", meaningZh: "消耗；消费；消灭", meaningEn: "", collocations: [], example: "Some of the most efficient refrigerators consume 70 percent less electricity than traditional models.", exampleZh: "一些能效最高的冰箱比传统型号少消耗70%的电。" },
    {
    pos: "vi.", meaningZh: "耗尽；毁灭", meaningEn: "", collocations: [], example: "Fat people consume more energy than slim people.", exampleZh: "胖的人比瘦的人消耗更多的能量。" }
    ]
  },
  {
    id: "create", term: "create", phonetic: "/kɹiːˈeɪt/", pos: "v.", meaningZh: "创造；创建；创造，创建；设计，创作；造成，引起；授予，册封；<英，非正式>大惊小怪，抱怨", meaningEn: "To bring into existence; (sometimes in particular:)", band: "6", collocations: ["create jobs", "create value", "create opportunities"], example: "We set business free to create more jobs.", exampleZh: "我们让企业自由以创造更多的就业机会。",
    senses: [
    {
    pos: "v.", meaningZh: "创造；创建；创造，创建；设计，创作；造成，引起；授予，册封；<英，非正式>大惊小怪，抱怨", meaningEn: "To bring into existence; (sometimes in particular:)", collocations: ["create jobs", "create value", "create opportunities"], example: "We set business free to create more jobs.", exampleZh: "我们让企业自由以创造更多的就业机会。" },
    {
    pos: "adj.", meaningZh: "", meaningEn: "Created, resulting from creation.", collocations: [], example: "We want to create jobs for the unemployed.", exampleZh: "我们想为失业者创造更多的工作。" },
    {
    pos: "vt.", meaningZh: "创造；建造；引起；任命", meaningEn: "", collocations: [], example: "The main purpose of industry is to create wealth.", exampleZh: "工业的主要宗旨是创造财富。" }
    ]
  },
  {
    id: "cultural", term: "cultural", phonetic: "/ˈkʌltʃərəl/", pos: "adj.", meaningZh: "文化的，与文化有关的；艺术的，文艺的", meaningEn: "relating to culture", band: "6", collocations: ["cultural difference", "cultural heritage", "cultural exchange"], example: "We are the inheritors of a great cultural tradition.", exampleZh: "我们是一个伟大文化传统的继承者。",
    senses: [
    {
    pos: "adj.", meaningZh: "文化的，与文化有关的；艺术的，文艺的", meaningEn: "relating to culture", collocations: ["cultural difference", "cultural heritage", "cultural exchange"], example: "We are the inheritors of a great cultural tradition.", exampleZh: "我们是一个伟大文化传统的继承者。" }
    ]
  },
  {
    id: "decline", term: "decline", phonetic: "/dɪˈklaɪn/", pos: "n.", meaningZh: "下降；衰退；减少，衰退", meaningEn: "to become smaller or weaker", band: "6", collocations: ["a sharp decline", "decline in", "on the decline"], example: "The industry has slid into decline.", exampleZh: "这个行业已成衰退之势。",
    senses: [
    {
    pos: "n.", meaningZh: "下降；衰退；减少，衰退", meaningEn: "to become smaller or weaker", collocations: ["a sharp decline", "decline in", "on the decline"], example: "The industry has slid into decline.", exampleZh: "这个行业已成衰退之势。" },
    {
    pos: "v.", meaningZh: "下降，衰退；拒绝，谢绝；变格，词形变化", meaningEn: "", collocations: [], example: "Support for the party continues to decline.", exampleZh: "对该党的支持继续下降。" },
    {
    pos: "vt.", meaningZh: "使降低；婉谢", meaningEn: "", collocations: [], example: "They failed to arrest the company's decline.", exampleZh: "他们未能阻止公司的衰落。" },
    {
    pos: "vi.", meaningZh: "下降；衰落；偏斜", meaningEn: "", collocations: [], example: "The number of staff has declined from 217,000 to 114,000.", exampleZh: "员工人数已从217000人减少到114000人。" }
    ]
  },
  {
    id: "demand", term: "demand", phonetic: "/dɪˈmɑːnd/", pos: "n.", meaningZh: "需求；要求；坚决的要求；需求，需求量；（困难的）要求", meaningEn: "The desire to purchase goods and services.", band: "6", collocations: ["meet demand", "high demand", "consumer demand"], example: "Demand is outstripping supply.", exampleZh: "需求快超过供给了。",
    senses: [
    {
    pos: "n.", meaningZh: "需求；要求；坚决的要求；需求，需求量；（困难的）要求", meaningEn: "The desire to purchase goods and services.", collocations: ["meet demand", "high demand", "consumer demand"], example: "Demand is outstripping supply.", exampleZh: "需求快超过供给了。" },
    {
    pos: "v.", meaningZh: "强烈要求；需要，需求", meaningEn: "To request forcefully.", collocations: [], example: "Demand is outpacing production.", exampleZh: "需求正在超过生产。" }
    ]
  },
  {
    id: "design", term: "design", phonetic: "/dɪˈzaɪn/", pos: "n.", meaningZh: "设计，布局，安排；设计艺术，构思；设计图，图纸；图案，花纹；计划，意图", meaningEn: "A specification of an object or process, referring to requirements to be satisfied and thus conditions to be met for them to solve a problem.", band: "6", collocations: ["design a system", "good design", "user-centred design"], example: "She's good at art and design.", exampleZh: "她擅长美术和设计。",
    senses: [
    {
    pos: "n.", meaningZh: "设计，布局，安排；设计艺术，构思；设计图，图纸；图案，花纹；计划，意图", meaningEn: "A specification of an object or process, referring to requirements to be satisfied and thus conditions to be met for them to solve a problem.", collocations: ["design a system", "good design", "user-centred design"], example: "She's good at art and design.", exampleZh: "她擅长美术和设计。" },
    {
    pos: "v.", meaningZh: "设计，制图，构思；筹划，制订；预定，指定", meaningEn: "To plan and carry out (a picture, work of art, construction etc.).", collocations: [], example: "The product is at the design stage.", exampleZh: "产品处于设计阶段。" }
    ]
  },
  {
    id: "determine", term: "determine", phonetic: "/dɪˈtɜːmɪn/", pos: "v.", meaningZh: "决定；确定；决定，控制；查明，确定；下定决心；判决，裁定；求出，解出；限定；<古>终止", meaningEn: "To set the boundaries or limits of.", band: "6", collocations: ["determine the cause", "help determine", "determine whether"], example: "You alone should determine what is right for you.", exampleZh: "只有你应该决定什么对你是合适的。",
    senses: [
    {
    pos: "v.", meaningZh: "决定；确定；决定，控制；查明，确定；下定决心；判决，裁定；求出，解出；限定；<古>终止", meaningEn: "To set the boundaries or limits of.", collocations: ["determine the cause", "help determine", "determine whether"], example: "You alone should determine what is right for you.", exampleZh: "只有你应该决定什么对你是合适的。" }
    ]
  },
  {
    id: "distribute", term: "distribute", phonetic: "/dɨˈstɹɪbjuːt/", pos: "v.", meaningZh: "分配；分发；分发，分配；配送，分销；散布，使分布；（印刷）拆（版）还字；周延", meaningEn: "To divide into portions and dispense.", band: "6", collocations: ["distribute resources", "distribute evenly", "fairly distribute"], example: "Aid workers helped distribute corn, milk and other staples.", exampleZh: "救助人员协助分发谷物、牛奶及其他必需的食物。",
    senses: [
    {
    pos: "v.", meaningZh: "分配；分发；分发，分配；配送，分销；散布，使分布；（印刷）拆（版）还字；周延", meaningEn: "To divide into portions and dispense.", collocations: ["distribute resources", "distribute evenly", "fairly distribute"], example: "Aid workers helped distribute corn, milk and other staples.", exampleZh: "救助人员协助分发谷物、牛奶及其他必需的食物。" },
    {
    pos: "vt.", meaningZh: "分配；散布；分发；分配；分发", meaningEn: "", collocations: [], example: "UN peacekeepers are trying to distribute supplies to 30,000 civilians.", exampleZh: "联合国维和士兵正努力将供给分发给三万平民。" }
    ]
  },
  {
    id: "expand", term: "expand", phonetic: "/ɛkˈspænd/", pos: "v.", meaningZh: "扩大；扩张；扩大，增加；扩展，发展；细谈，详述；变得更自信（善谈）；（宇宙）膨胀", meaningEn: "To change (something) from a smaller form and/or size to a larger one; to spread out or lay open.", band: "6", collocations: ["expand the market", "rapidly expand", "expand access"], example: "We have to expand the size of the image.", exampleZh: "我们不得不扩大图像的尺寸。",
    senses: [
    {
    pos: "v.", meaningZh: "扩大；扩张；扩大，增加；扩展，发展；细谈，详述；变得更自信（善谈）；（宇宙）膨胀", meaningEn: "To change (something) from a smaller form and/or size to a larger one; to spread out or lay open.", collocations: ["expand the market", "rapidly expand", "expand access"], example: "We have to expand the size of the image.", exampleZh: "我们不得不扩大图像的尺寸。" },
    {
    pos: "vt.", meaningZh: "展开", meaningEn: "", collocations: [], example: "It was just a passing comment, he didn't expand.", exampleZh: "那只是顺便提到的评论，他没有展开。" },
    {
    pos: "vi.", meaningZh: "展开；展开；DOS外部命令:将原始DOS磁盘上的压缩文件解压缩并拷贝到硬盘上", meaningEn: "", collocations: [], example: "We've been given the nod to expand the business.", exampleZh: "我们得到允许扩大企业规模。" }
    ]
  },
  {
    id: "feature", term: "feature", phonetic: "/ˈfiːtʃə/", pos: "n.", meaningZh: "特征；以…为特色；特点，特征；五官，面貌（特征）；地貌；特写，专题节目；正片； 特点，特征", meaningEn: "One's structure or make-up: form, shape, bodily proportions.", band: "6", collocations: ["key feature", "main feature", "feature in"], example: "His eyes are his most notable feature.", exampleZh: "他的双眼是他最明显的特征。",
    senses: [
    {
    pos: "n.", meaningZh: "特征；以…为特色；特点，特征；五官，面貌（特征）；地貌；特写，专题节目；正片； 特点，特征", meaningEn: "One's structure or make-up: form, shape, bodily proportions.", collocations: ["key feature", "main feature", "feature in"], example: "His eyes are his most notable feature.", exampleZh: "他的双眼是他最明显的特征。" },
    {
    pos: "v.", meaningZh: "以……为特色，以……为主要组成；起重要作用，占重要地位；放映，上演；担任主演", meaningEn: "To ascribe the greatest importance to something within a certain context.", collocations: [], example: "This feature is designed to aid inexperienced users.", exampleZh: "这个特色是为帮助没有经验的用户而设计的。" },
    {
    pos: "vt.", meaningZh: "是...的特色；特写；放映", meaningEn: "", collocations: [], example: "Teamwork is a key feature of the training programme.", exampleZh: "团队合作是这项训练计划的重要特点。" },
    {
    pos: "vi.", meaningZh: "起重要作用；特性", meaningEn: "", collocations: [], example: "Patriotic songs have long been a feature of Kuwaiti life.", exampleZh: "爱国歌曲长期以来一直是科威特人生活的一个特点。" }
    ]
  },
  {
    id: "focus", term: "focus", phonetic: "/ˈfəʊ.kəs/", pos: "n.", meaningZh: "焦点；集中；重点，中心点；关注，注意；震源；目的，意图；焦距；病灶；调焦装置；目的明确，专注；（椭圆、抛物线等曲线的）焦点", meaningEn: "A point at which reflected or refracted rays of light converge.", band: "6", collocations: ["focus on", "main focus", "sharp focus"], example: "He prefers to focus on the positive.", exampleZh: "他更愿意关注积极面。",
    senses: [
    {
    pos: "n.", meaningZh: "焦点；集中；重点，中心点；关注，注意；震源；目的，意图；焦距；病灶；调焦装置；目的明确，专注；（椭圆、抛物线等曲线的）焦点", meaningEn: "A point at which reflected or refracted rays of light converge.", collocations: ["focus on", "main focus", "sharp focus"], example: "He prefers to focus on the positive.", exampleZh: "他更愿意关注积极面。" },
    {
    pos: "v.", meaningZh: "集中，关注；聚焦，调焦；<语言学>以（句子的一部分）为焦点（或重心）", meaningEn: "(followed by on or upon) To concentrate one's attention.", collocations: [], example: "Now the focus is on draining the water.", exampleZh: "现在的焦点是排水。" },
    {
    pos: "vi.", meaningZh: "聚焦；注视", meaningEn: "", collocations: [], example: "His comments provided a focus for debate.", exampleZh: "他的评论提供了辩论的重点。" },
    {
    pos: "vt.", meaningZh: "使聚焦；调焦；集中；焦点", meaningEn: "", collocations: [], example: "The research effort has focused on tracing the effects of growing levels of five compounds.", exampleZh: "研究集中跟踪5种化合物水平上升带来的影响。" }
    ]
  },
  {
    id: "fundamental", term: "fundamental", phonetic: "/ˌfʌndəˈmentl/", pos: "adj.", meaningZh: "基本的；根本的；根本的，基本的；必需的，必不可少的；不能再分的", meaningEn: "forming the necessary base", band: "6", collocations: ["fundamental right", "fundamental change", "fundamental issue"], example: "Hard work is fundamental to success.", exampleZh: "勤奋工作是成功的基础。",
    senses: [
    {
    pos: "adj.", meaningZh: "基本的；根本的；根本的，基本的；必需的，必不可少的；不能再分的", meaningEn: "forming the necessary base", collocations: ["fundamental right", "fundamental change", "fundamental issue"], example: "Hard work is fundamental to success.", exampleZh: "勤奋工作是成功的基础。" },
    {
    pos: "n.", meaningZh: "基本原理；基音，基频", meaningEn: "", collocations: [], example: "The argument is full of fundamental flaws.", exampleZh: "这段论述充满根本性的错误。" }
    ]
  },
  {
    id: "identify", term: "identify", phonetic: "/aɪˈdɛn.tɪ.faɪ/", pos: "v.", meaningZh: "识别；确认；认出，识别；查明，确认；发现；证明（身份），表明；认同，理解；认为……和……一致；和（某人）打成一片", meaningEn: "To establish the identity of someone or something.", band: "6", collocations: ["identify the cause", "identify problems", "easily identify"], example: "First of all we must identify the problem areas.", exampleZh: "首先我们必须找出问题所在。",
    senses: [
    {
    pos: "v.", meaningZh: "识别；确认；认出，识别；查明，确认；发现；证明（身份），表明；认同，理解；认为……和……一致；和（某人）打成一片", meaningEn: "To establish the identity of someone or something.", collocations: ["identify the cause", "identify problems", "easily identify"], example: "First of all we must identify the problem areas.", exampleZh: "首先我们必须找出问题所在。" },
    {
    pos: "vt.", meaningZh: "识别；认为...等同于；确定；使参与", meaningEn: "", collocations: [], example: "The new technique has been used to identify the sex of fetuses.", exampleZh: "这项新技术已被用来鉴定胎儿的性别。" },
    {
    pos: "vi.", meaningZh: "一致；认同", meaningEn: "", collocations: [], example: "Sales departments try to identify a product's USP or 'unique selling point'.", exampleZh: "销售部门试图确定一种产品的“独有卖点”。" }
    ]
  },
  {
    id: "impact", term: "impact", phonetic: "/ˈɪmpækt/", pos: "n.", meaningZh: "影响；冲击；撞击，冲击力；巨大影响，强大作用", meaningEn: "The striking of one body against another; collision.", band: "6", collocations: ["have an impact", "positive impact", "environmental impact"], example: "A violent impact hurtled her forward.", exampleZh: "一股剧烈的冲击力将她猛地向前抛了出去。",
    senses: [
    {
    pos: "n.", meaningZh: "影响；冲击；撞击，冲击力；巨大影响，强大作用", meaningEn: "The striking of one body against another; collision.", collocations: ["have an impact", "positive impact", "environmental impact"], example: "A violent impact hurtled her forward.", exampleZh: "一股剧烈的冲击力将她猛地向前抛了出去。" },
    {
    pos: "v.", meaningZh: "冲击，撞击；挤入，压紧；（对……）产生影响", meaningEn: "To collide or strike, the act of impinging.", collocations: [], example: "Her speech made a profound impact on everyone.", exampleZh: "她的讲话对每个人都有深远的影响。" },
    {
    pos: "vt.", meaningZh: "挤入；撞击；压紧；对...发生影响", meaningEn: "", collocations: [], example: "Such schemes mean little unless they impact people.", exampleZh: "除非能对人们造成影响，否则这样的计划意义不大。" }
    ]
  },
  {
    id: "implement", term: "implement", phonetic: "/ˈɪmpləmənt/", pos: "v.", meaningZh: "实施；执行；执行，贯彻；为……提供工具", meaningEn: "to put a plan into action", band: "6", collocations: ["implement a policy", "implement changes", "successfully implement"], example: "Leadership is about the ability to implement change.", exampleZh: "领导才能是一种实行变革的能力。",
    senses: [
    {
    pos: "v.", meaningZh: "实施；执行；执行，贯彻；为……提供工具", meaningEn: "to put a plan into action", collocations: ["implement a policy", "implement changes", "successfully implement"], example: "Leadership is about the ability to implement change.", exampleZh: "领导才能是一种实行变革的能力。" },
    {
    pos: "n.", meaningZh: "工具，器具；<苏格兰>履行；手段", meaningEn: "", collocations: [], example: "The government promised to implement a new system to control financial loan institutions.", exampleZh: "政府许诺要实施新的制度来控制金融贷款机构。" },
    {
    pos: "vt.", meaningZh: "实现；使生效；执行", meaningEn: "", collocations: [], example: "Now, let me scramble for my implement here.", exampleZh: "现在，让我在这里夺回我的工具。" }
    ]
  },
  {
    id: "influence", term: "influence", phonetic: "/ˈɪnfluəns/", pos: "n.", meaningZh: "影响；影响力；影响，作用；势力，影响力；有影响的人（或事物）", meaningEn: "the power to affect others", band: "6", collocations: ["have influence", "strong influence", "influence on"], example: "He's never had any influence over her.", exampleZh: "他对她从没有过任何影响。",
    senses: [
    {
    pos: "n.", meaningZh: "影响；影响力；影响，作用；势力，影响力；有影响的人（或事物）", meaningEn: "the power to affect others", collocations: ["have influence", "strong influence", "influence on"], example: "He's never had any influence over her.", exampleZh: "他对她从没有过任何影响。" },
    {
    pos: "v.", meaningZh: "影响，对……起作用", meaningEn: "", collocations: [], example: "Don't let me influence you either way.", exampleZh: "何去何从都别受我的影响。" },
    {
    pos: "vt.", meaningZh: "影响；改变", meaningEn: "", collocations: [], example: "His influence has diminished with time.", exampleZh: "随着时间的推移，他的影响已不如从前了。" }
    ]
  },
  {
    id: "initiate", term: "initiate", phonetic: "/ɪˈnɪʃieɪt/", pos: "v.", meaningZh: "发起；开始；开始实施，发起；使了解，传授；（尤指在秘密仪式上）使加入，接纳", meaningEn: "To begin; to start.", band: "6", collocations: ["initiate a project", "initiate change", "initiate talks"], example: "They wanted to initiate a discussion on economics.", exampleZh: "他们想发起一次关于经济学的讨论。",
    senses: [
    {
    pos: "v.", meaningZh: "发起；开始；开始实施，发起；使了解，传授；（尤指在秘密仪式上）使加入，接纳", meaningEn: "To begin; to start.", collocations: ["initiate a project", "initiate change", "initiate talks"], example: "They wanted to initiate a discussion on economics.", exampleZh: "他们想发起一次关于经济学的讨论。" },
    {
    pos: "n.", meaningZh: "新加入某组织的人，新入会的人", meaningEn: "A new member of an organization.", collocations: [], example: "People who are talked to have equally positive experiences as those who initiate a conversation.", exampleZh: "被交谈的人与主动发起谈话的人有着同样积极的体验。" },
    {
    pos: "adj.", meaningZh: "新加入的", meaningEn: "Unpractised; untried; new.", collocations: [], example: "Next the researcher introduced a third option, a third paddle that would initiate a new trial, giving the dolphin the choice of passing on difficult trials.", exampleZh: "接下来，研究人员引入了第三种选择，用第三只桨启动一个新的试验，让海豚选择跳过困难的试验。" },
    {
    pos: "vt.", meaningZh: "开始；传授基本知识给", meaningEn: "", collocations: [], example: "They wanted to initiate a discussion on economics.", exampleZh: "他们想发起一次关于经济学的讨论。" }
    ]
  },
  {
    id: "interpret", term: "interpret", phonetic: "/ɪnˈtɜː.pɹɪt/", pos: "v.", meaningZh: "解释；口译；解释，说明；口译；把……理解为；演绎", meaningEn: "To explain or tell the meaning of; to translate orally into intelligible or familiar language or terms. applied especially to language, but also to dreams, signs, conduct, mysteries, etc.", band: "6", collocations: ["interpret data", "interpret as", "interpret the result"], example: "The students were asked to interpret the poem.", exampleZh: "学生们被要求诠释那首诗的意义。",
    senses: [
    {
    pos: "v.", meaningZh: "解释；口译；解释，说明；口译；把……理解为；演绎", meaningEn: "To explain or tell the meaning of; to translate orally into intelligible or familiar language or terms. applied especially to language, but also to dreams, signs, conduct, mysteries, etc.", collocations: ["interpret data", "interpret as", "interpret the result"], example: "The students were asked to interpret the poem.", exampleZh: "学生们被要求诠释那首诗的意义。" },
    {
    pos: "vt.", meaningZh: "解释；演出；翻译；理解", meaningEn: "", collocations: [], example: "She couldn't speak much English so her children had to interpret for her.", exampleZh: "她讲不了几句英语，所以她的孩子们得给她翻译。" },
    {
    pos: "vi.", meaningZh: "翻译；解释", meaningEn: "", collocations: [], example: "The chambermaid spoke little English, so her husband came with her to interpret.", exampleZh: "那个女服务员几乎不会说英语，所以她丈夫来给她作口译。" }
    ]
  },
  {
    id: "involve", term: "involve", phonetic: "/ɪnˈvɒlv/", pos: "v.", meaningZh: "牵涉，涉及；包含，需要；使陷入，使卷入；（使）参加，加入；使承担，使面对", meaningEn: "To roll or fold up; to wind round; to entwine.", band: "6", collocations: ["involve risk", "involve in", "closely involved"], example: "The treatment does not involve the use of any artificial drugs.", exampleZh: "这种疗法不涉及任何人造药物的使用。",
    senses: [
    {
    pos: "v.", meaningZh: "牵涉，涉及；包含，需要；使陷入，使卷入；（使）参加，加入；使承担，使面对", meaningEn: "To roll or fold up; to wind round; to entwine.", collocations: ["involve risk", "involve in", "closely involved"], example: "The treatment does not involve the use of any artificial drugs.", exampleZh: "这种疗法不涉及任何人造药物的使用。" },
    {
    pos: "vt.", meaningZh: "包括；使陷于；潜心于；包围；累及；牵涉；包含", meaningEn: "", collocations: [], example: "Most political questions involve morality in some form or other.", exampleZh: "多数政治问题牵涉到这样或那样的道义性。" }
    ]
  },
  {
    id: "justify", term: "justify", phonetic: "/ˈdʒʌstɪfaɪ/", pos: "v.", meaningZh: "证明…正当；是……的正当理由；对……作出解释，为……辩解；使（文本）对齐；（在上帝的眼中）称义，使有义；证明合法；整理版面", meaningEn: "To provide an acceptable explanation for.", band: "6", collocations: ["justify the cost", "hard to justify", "justify a decision"], example: "How can they justify paying such huge salaries?", exampleZh: "他们怎能证明付这么大笔薪金是正当的呢？",
    senses: [
    {
    pos: "v.", meaningZh: "证明…正当；是……的正当理由；对……作出解释，为……辩解；使（文本）对齐；（在上帝的眼中）称义，使有义；证明合法；整理版面", meaningEn: "To provide an acceptable explanation for.", collocations: ["justify the cost", "hard to justify", "justify a decision"], example: "How can they justify paying such huge salaries?", exampleZh: "他们怎能证明付这么大笔薪金是正当的呢？" },
    {
    pos: "vt.", meaningZh: "替...辩护；证明", meaningEn: "", collocations: [], example: "He made a half-hearted attempt to justify himself.", exampleZh: "他没有尽力证明自己有理。" },
    {
    pos: "vi.", meaningZh: "证明合法；段落重排；两端对齐", meaningEn: "", collocations: [], example: "No amount of rationalization could justify his actions.", exampleZh: "无论怎么解释，他的行为都不能说是正当的。" }
    ]
  },
  {
    id: "measure", term: "measure", phonetic: "/ˈmɛʒə/", pos: "n.", meaningZh: "措施；测量；措施，办法；适量，适度；判断，衡量；度量单位，计量标准；（酒的）标准量；<美>小节，拍子；象征，迹象；议案，法案；格律单位；计量工具，量器；<古>（尤指庄重或肃穆的）舞蹈，舞步；岩层；（数）除数；（印刷）行宽，页宽", meaningEn: "A prescribed quantity or extent.", band: "6", collocations: ["take measures", "measure success", "strict measures"], example: "The Richter Scale is a measure of ground motion.", exampleZh: "里氏震级是测量地动的单位。",
    senses: [
    {
    pos: "n.", meaningZh: "措施；测量；措施，办法；适量，适度；判断，衡量；度量单位，计量标准；（酒的）标准量；<美>小节，拍子；象征，迹象；议案，法案；格律单位；计量工具，量器；<古>（尤指庄重或肃穆的）舞蹈，舞步；岩层；（数）除数；（印刷）行宽，页宽", meaningEn: "A prescribed quantity or extent.", collocations: ["take measures", "measure success", "strict measures"], example: "The Richter Scale is a measure of ground motion.", exampleZh: "里氏震级是测量地动的单位。" },
    {
    pos: "v.", meaningZh: "测量；（指尺寸、长短、数量等）量度为；估量，判定（重要性、价值或影响等）；走过；显示，记录；用作……的量器", meaningEn: "To ascertain the quantity of a unit of material via calculated comparison with respect to a standard.", collocations: [], example: "He irritated me beyond measure.", exampleZh: "他使我非常生气。" },
    {
    pos: "vt.", meaningZh: "测量；测度；估量；权衡；调节；拿(自己或自己的力量等)作较量", meaningEn: "", collocations: [], example: "It's got four beats to a measure.", exampleZh: "1小节有4拍。" },
    {
    pos: "vi.", meaningZh: "度量", meaningEn: "", collocations: [], example: "I continued to measure his progress against the charts in the doctor's office.", exampleZh: "我继续根据医生办公室里的图表来估量他的进展。" }
    ]
  },
  {
    id: "obtain", term: "obtain", phonetic: "/əbˈteɪn/", pos: "v.", meaningZh: "获得；取得；（尤指通过艰难的过程）得到，获得；<正式>（规则或情况）存在，通用", meaningEn: "To get hold of; to gain possession of, to procure; to acquire, in any way.", band: "6", collocations: ["obtain data", "obtain permission", "easily obtain"], example: "He admitted conspiring to obtain property by deception.", exampleZh: "他承认曾密谋通过欺骗获取财产。",
    senses: [
    {
    pos: "v.", meaningZh: "获得；取得；（尤指通过艰难的过程）得到，获得；<正式>（规则或情况）存在，通用", meaningEn: "To get hold of; to gain possession of, to procure; to acquire, in any way.", collocations: ["obtain data", "obtain permission", "easily obtain"], example: "He admitted conspiring to obtain property by deception.", exampleZh: "他承认曾密谋通过欺骗获取财产。" },
    {
    pos: "vt.", meaningZh: "获得；达到", meaningEn: "", collocations: [], example: "Can plants obtain adequate nourishment from such poor soil?", exampleZh: "土壤这样贫瘠，植物能获得足够的养分吗？" },
    {
    pos: "vi.", meaningZh: "流行；得到公认", meaningEn: "", collocations: [], example: "I could obtain with the snap of my fingers anything I chose.", exampleZh: "只要打一下响指，我就可以得到我选中的任何东西。" }
    ]
  },
  {
    id: "participate", term: "participate", phonetic: "/pɑːˈtɪsɪpeɪt/", pos: "v.", meaningZh: "参与；参加；参加，参与；<古>分担，分享；<古>具有，带有（特殊的性质）", meaningEn: "To join in, to take part, to involve oneself (in something).", band: "6", collocations: ["participate in", "actively participate", "participate fully"], example: "She didn't participate in the discussion.", exampleZh: "她没有参加讨论。",
    senses: [
    {
    pos: "v.", meaningZh: "参与；参加；参加，参与；<古>分担，分享；<古>具有，带有（特殊的性质）", meaningEn: "To join in, to take part, to involve oneself (in something).", collocations: ["participate in", "actively participate", "participate fully"], example: "She didn't participate in the discussion.", exampleZh: "她没有参加讨论。" },
    {
    pos: "adj.", meaningZh: "", meaningEn: "Acting in common; participating.", collocations: [], example: "They expected him to participate in the ceremony.", exampleZh: "他们希望他参加这个典礼。" },
    {
    pos: "vi.", meaningZh: "参加；分享；参与；带有", meaningEn: "", collocations: [], example: "Over half the population of this country participate in sports.", exampleZh: "这个国家一半以上的人参加体育运动。" },
    {
    pos: "vt.", meaningZh: "分享；分担", meaningEn: "", collocations: [], example: "They expected him to participate in the ceremony.", exampleZh: "他们希望他参加这个典礼。" }
    ]
  },
  {
    id: "perceive", term: "perceive", phonetic: "/pəˈsiːv/", pos: "v.", meaningZh: "察觉；认为", meaningEn: "to notice or understand", band: "6", collocations: ["perceive as", "widely perceived", "perceive a difference"], example: "Voters perceive him as a decisive and resolute international leader.", exampleZh: "选民认识到他是一位果断、坚定的国际领袖。",
    senses: [
    {
    pos: "v.", meaningZh: "察觉；认为", meaningEn: "to notice or understand", collocations: ["perceive as", "widely perceived", "perceive a difference"], example: "Voters perceive him as a decisive and resolute international leader.", exampleZh: "选民认识到他是一位果断、坚定的国际领袖。" },
    {
    pos: "vt.", meaningZh: "认为，理解；察觉，注意到；意识到", meaningEn: "", collocations: [], example: "Look for cues about how others perceive you.", exampleZh: "寻找关于别人如何看待你的线索。" }
    ]
  },
  {
    id: "promote", term: "promote", phonetic: "/pɹəˈməʊt/", pos: "v.", meaningZh: "促进；推广；促进，提倡；升职，晋升；促销，推广； 将（运动队）晋级；使（学生）升年级；负责筹办，主办（大型活动，如音乐会或体育比赛）；促使（议会私法议案）通过；使（卒）升格为（尤指后等）；<英>（先打大牌）使（小牌）赢得一墩；使（催化剂）更活泼", meaningEn: "to support or advance", band: "6", collocations: ["promote growth", "promote health", "actively promote"], example: "Is it ethical to promote cigarettes through advertising?", exampleZh: "通过广告推销香烟合乎道德吗？",
    senses: [
    {
    pos: "v.", meaningZh: "促进；推广；促进，提倡；升职，晋升；促销，推广； 将（运动队）晋级；使（学生）升年级；负责筹办，主办（大型活动，如音乐会或体育比赛）；促使（议会私法议案）通过；使（卒）升格为（尤指后等）；<英>（先打大牌）使（小牌）赢得一墩；使（催化剂）更活泼", meaningEn: "to support or advance", collocations: ["promote growth", "promote health", "actively promote"], example: "Is it ethical to promote cigarettes through advertising?", exampleZh: "通过广告推销香烟合乎道德吗？" },
    {
    pos: "vt.", meaningZh: "促进；晋升；创办；推销；促进；推广；推销", meaningEn: "", collocations: [], example: "We need to promote an open exchange of ideas and information.", exampleZh: "我们需要促进思想和信息的公开交流。" }
    ]
  },
  {
    id: "recommend", term: "recommend", phonetic: "/ɹɛkəˈmɛnd/", pos: "v.", meaningZh: "推荐；建议；建议，劝告 ；推荐，介绍；使显得吸引人，使受欢迎；<古> 把……交托给，把……托付给", meaningEn: "To bestow commendation on; to represent favourably; to suggest, endorse or encourage as an appropriate choice.", band: "6", collocations: ["strongly recommend", "recommend that", "recommend doing"], example: "I recommend (that) he see a lawyer.", exampleZh: "我建议他去找个律师。",
    senses: [
    {
    pos: "v.", meaningZh: "推荐；建议；建议，劝告 ；推荐，介绍；使显得吸引人，使受欢迎；<古> 把……交托给，把……托付给", meaningEn: "To bestow commendation on; to represent favourably; to suggest, endorse or encourage as an appropriate choice.", collocations: ["strongly recommend", "recommend that", "recommend doing"], example: "I recommend (that) he see a lawyer.", exampleZh: "我建议他去找个律师。" },
    {
    pos: "vt.", meaningZh: "推荐；介绍；劝告；使受欢迎；托付；建议；推荐", meaningEn: "", collocations: [], example: "What course of action would you recommend?", exampleZh: "你想推荐什么办法呢？" }
    ]
  },
  {
    id: "reveal", term: "reveal", phonetic: "/ɹəˈviːl/", pos: "v.", meaningZh: "揭示；显露；揭示，透露；表明，证明；展示，显示；（通过神或超自然手段）启示", meaningEn: "To uncover; to show and display that which was hidden.", band: "6", collocations: ["reveal the truth", "reveal that", "clearly reveal"], example: "These poems reveal her gentle side.", exampleZh: "这些诗显示出她温柔的一面。",
    senses: [
    {
    pos: "v.", meaningZh: "揭示；显露；揭示，透露；表明，证明；展示，显示；（通过神或超自然手段）启示", meaningEn: "To uncover; to show and display that which was hidden.", collocations: ["reveal the truth", "reveal that", "clearly reveal"], example: "These poems reveal her gentle side.", exampleZh: "这些诗显示出她温柔的一面。" },
    {
    pos: "n.", meaningZh: "（电视节目最后的）揭示；门侧，窗侧", meaningEn: "The outer side of a window or door frame; the jamb.", collocations: [], example: "Officers could not reveal how he died.", exampleZh: "警察们不能透露他的死因。" },
    {
    pos: "vt.", meaningZh: "露出；显示；透露；揭露；泄露；(神)启示", meaningEn: "", collocations: [], example: "She has refused to reveal the whereabouts of her daughter.", exampleZh: "她已拒绝透露她女儿的行踪。" }
    ]
  },
  {
    id: "strategy", term: "strategy", phonetic: "/ˈstɹætədʒi/", pos: "n.", meaningZh: "策略；战略；（尤指为获得某物制定长期的）策略，行动计划；战略，战略学", meaningEn: "a plan to achieve a goal", band: "6", collocations: ["marketing strategy", "long-term strategy", "effective strategy"], example: "The strategy worked brilliantly.", exampleZh: "这项策略非常成功。",
    senses: [
    {
    pos: "n.", meaningZh: "策略；战略；（尤指为获得某物制定长期的）策略，行动计划；战略，战略学", meaningEn: "a plan to achieve a goal", collocations: ["marketing strategy", "long-term strategy", "effective strategy"], example: "The strategy worked brilliantly.", exampleZh: "这项策略非常成功。" }
    ]
  },
  {
    id: "sufficient", term: "sufficient", phonetic: "/səˈfɪʃənt/", pos: "adj.", meaningZh: "足够的，充足的；（理由、条件）充足的，充分的", meaningEn: "Equal to the end proposed; adequate to what is needed; enough", band: "6", collocations: ["sufficient evidence", "sufficient funds", "not sufficient"], example: "Is it available in sufficient quantity?", exampleZh: "这东西能不能足量供应？",
    senses: [
    {
    pos: "adj.", meaningZh: "足够的，充足的；（理由、条件）充足的，充分的", meaningEn: "Equal to the end proposed; adequate to what is needed; enough", collocations: ["sufficient evidence", "sufficient funds", "not sufficient"], example: "Is it available in sufficient quantity?", exampleZh: "这东西能不能足量供应？" }
    ]
  },
  {
    id: "aspect", term: "aspect", phonetic: "/ˈæspɛkt/", pos: "n.", meaningZh: "方面，特色；朝向，方位；外表，外观；（动词的）体", meaningEn: "Any specific feature, part, or element of something.", band: "6", collocations: ["an important aspect", "every aspect", "key aspect"], example: "They were royally received in every aspect.", exampleZh: "他们在各个方面都受到了隆重接待。",
    senses: [
    {
    pos: "n.", meaningZh: "方面，特色；朝向，方位；外表，外观；（动词的）体", meaningEn: "Any specific feature, part, or element of something.", collocations: ["an important aspect", "every aspect", "key aspect"], example: "They were royally received in every aspect.", exampleZh: "他们在各个方面都受到了隆重接待。" },
    {
    pos: "v.", meaningZh: "（行星与另一天体）形成角度关系", meaningEn: "(of a planet) To have a particular aspect or type of aspect.", collocations: [], example: "Religion informs every aspect of their lives.", exampleZh: "宗教影响着他们生活的各个方面。" }
    ]
  },
  {
    id: "coherent", term: "coherent", phonetic: "/kəʊˈhɪərənt/", pos: "adj.", meaningZh: "连贯的；有条理的；有条理的，连贯的；说话条理清晰的，易于理解的；团结一致的，凝聚的；（波）相干的，相参的；黏着的，黏连的", meaningEn: "logical and consistent", band: "7", collocations: ["coherent argument", "coherent policy", "coherent explanation"], example: "The subjects of the curriculum form a coherent whole.", exampleZh: "课程中的科目构成了一个连贯的整体。",
    senses: [
    {
    pos: "adj.", meaningZh: "连贯的；有条理的；有条理的，连贯的；说话条理清晰的，易于理解的；团结一致的，凝聚的；（波）相干的，相参的；黏着的，黏连的", meaningEn: "logical and consistent", collocations: ["coherent argument", "coherent policy", "coherent explanation"], example: "The subjects of the curriculum form a coherent whole.", exampleZh: "课程中的科目构成了一个连贯的整体。" }
    ]
  },
  {
    id: "comprise", term: "comprise", phonetic: "/kəmˈpɹaɪz/", pos: "v.", meaningZh: "由…组成；包括，包含；构成，组成", meaningEn: "To be made up of; to consist of (especially a comprehensive list of parts).", band: "7", collocations: ["be comprised of", "comprise several parts"], example: "Older people comprise a large proportion of those living in poverty.", exampleZh: "在那些生活贫困的人中，老年人占有很大的比例。",
    senses: [
    {
    pos: "v.", meaningZh: "由…组成；包括，包含；构成，组成", meaningEn: "To be made up of; to consist of (especially a comprehensive list of parts).", collocations: ["be comprised of", "comprise several parts"], example: "Older people comprise a large proportion of those living in poverty.", exampleZh: "在那些生活贫困的人中，老年人占有很大的比例。" },
    {
    pos: "vt.", meaningZh: "包含；构成", meaningEn: "", collocations: [], example: "People with disabilities comprise a large part of the population.", exampleZh: "残疾人占人口的很大一部分。" }
    ]
  },
  {
    id: "emphasize", term: "emphasize", phonetic: "/ˈɛm.fə.saɪz/", pos: "v.", meaningZh: "强调，着重；重读（单词或短语）；使突出（或明显）", meaningEn: "To stress, give emphasis or extra weight to (something).", band: "7", collocations: ["emphasize the importance", "strongly emphasize", "emphasize that"], example: "He flourished the glass to emphasize the point.", exampleZh: "他挥舞着杯子来强调这一点。",
    senses: [
    {
    pos: "v.", meaningZh: "强调，着重；重读（单词或短语）；使突出（或明显）", meaningEn: "To stress, give emphasis or extra weight to (something).", collocations: ["emphasize the importance", "strongly emphasize", "emphasize that"], example: "He flourished the glass to emphasize the point.", exampleZh: "他挥舞着杯子来强调这一点。" },
    {
    pos: "vt.", meaningZh: "强调；加强语气；着重", meaningEn: "", collocations: [], example: "I tried to emphasize my good points without sounding boastful.", exampleZh: "我在强调自己的优点时尽量不让人觉得是在自我吹嘘。" }
    ]
  },
  {
    id: "integrate", term: "integrate", phonetic: "/ˈɪntəɡɹeɪt/", pos: "v.", meaningZh: "整合；使融入；（使）合并，成为一体；（使）加入，融入群体；（使）取消种族隔离；求……的积分；表示（面积、温度等）的总和，表示……的平均值", meaningEn: "To form into one whole; to make entire; to complete; to renew; to restore; to perfect.", band: "7", collocations: ["integrate into", "integrate with", "integrate theory and practice"], example: "He didn't integrate successfully into the Italian way of life.", exampleZh: "他没有成功融入到意大利的生活方式中去。",
    senses: [
    {
    pos: "v.", meaningZh: "整合；使融入；（使）合并，成为一体；（使）加入，融入群体；（使）取消种族隔离；求……的积分；表示（面积、温度等）的总和，表示……的平均值", meaningEn: "To form into one whole; to make entire; to complete; to renew; to restore; to perfect.", collocations: ["integrate into", "integrate with", "integrate theory and practice"], example: "He didn't integrate successfully into the Italian way of life.", exampleZh: "他没有成功融入到意大利的生活方式中去。" },
    {
    pos: "adj.", meaningZh: "整合的", meaningEn: "", collocations: [], example: "They have not made any effort to integrate with the local community.", exampleZh: "他们完全没有尝试融入本地社区。" },
    {
    pos: "vt.", meaningZh: "综合；使完整；使成整体", meaningEn: "", collocations: [], example: "The strategy is to integrate the development of these cities for a better economic structure.", exampleZh: "策略就是整合这些城市的发展，以便形成更好的经济结构。" },
    {
    pos: "vi.", meaningZh: "成一体", meaningEn: "", collocations: [], example: "He didn't integrate successfully into the Italian way of life.", exampleZh: "他没有成功融入到意大利的生活方式中去。" }
    ]
  },
  {
    id: "ambiguity", term: "ambiguity", phonetic: "/ˌæmbɪˈɡjuːəti/", pos: "n.", meaningZh: "歧义；含糊；模棱两可，不明确；含混不清的语句；一语多义；暧昧，难以理解的感情（或想法）", meaningEn: "the quality of having more than one possible meaning", band: "7", collocations: ["avoid ambiguity", "ambiguity in", "resolve ambiguity"], example: "It's a work full of paradox and ambiguity.", exampleZh: "这部作品充满了似非而是及模棱两可之处。",
    senses: [
    {
    pos: "n.", meaningZh: "歧义；含糊；模棱两可，不明确；含混不清的语句；一语多义；暧昧，难以理解的感情（或想法）", meaningEn: "the quality of having more than one possible meaning", collocations: ["avoid ambiguity", "ambiguity in", "resolve ambiguity"], example: "It's a work full of paradox and ambiguity.", exampleZh: "这部作品充满了似非而是及模棱两可之处。" }
    ]
  },
  {
    id: "conceptual", term: "conceptual", phonetic: "/kənˈseptʃuəl/", pos: "adj.", meaningZh: "概念上的；概念的，观念的", meaningEn: "relating to ideas or mental concepts", band: "7", collocations: ["conceptual framework", "conceptual understanding", "conceptual model"], example: "The two systems are, at bottom, conceptual models.", exampleZh: "这两个系统实际上是概念模型。",
    senses: [
    {
    pos: "adj.", meaningZh: "概念上的；概念的，观念的", meaningEn: "relating to ideas or mental concepts", collocations: ["conceptual framework", "conceptual understanding", "conceptual model"], example: "The two systems are, at bottom, conceptual models.", exampleZh: "这两个系统实际上是概念模型。" }
    ]
  },
  {
    id: "hierarchy", term: "hierarchy", phonetic: "/ˈhaɪ.ə.ɹɑː(ɹ).ki/", pos: "n.", meaningZh: "等级体系；层级；等级制度；统治集团；等级体系", meaningEn: "A body of authoritative officials organized in nested ranks.", band: "7", collocations: ["social hierarchy", "strict hierarchy", "hierarchy of"], example: "Like most other American companies with a rigid hierarchy, workers and managers had strictly defined duties.", exampleZh: "像大多数其他等级制度森严的美国公司一样，工人和管理人员都有严格界定的职责。",
    senses: [
    {
    pos: "n.", meaningZh: "等级体系；层级；等级制度；统治集团；等级体系", meaningEn: "A body of authoritative officials organized in nested ranks.", collocations: ["social hierarchy", "strict hierarchy", "hierarchy of"], example: "Like most other American companies with a rigid hierarchy, workers and managers had strictly defined duties.", exampleZh: "像大多数其他等级制度森严的美国公司一样，工人和管理人员都有严格界定的职责。" }
    ]
  },
  {
    id: "paradigm", term: "paradigm", phonetic: "/ˈpæ.ɹə.daɪm/", pos: "n.", meaningZh: "范式；典范；典范，范例；样板，范式；词形变化表；纵聚合关系语言项", meaningEn: "A pattern, a way of doing something, especially a pattern of thought, a system of beliefs, a conceptual framework.", band: "7", collocations: ["paradigm shift", "a new paradigm", "theoretical paradigm"], example: "\"It's a different paradigm of how to treat disease,\" says Dr. Brenda Rea.", exampleZh: "“这是治疗疾病的另一范式。”布伦达·雷亚博士说。",
    senses: [
    {
    pos: "n.", meaningZh: "范式；典范；典范，范例；样板，范式；词形变化表；纵聚合关系语言项", meaningEn: "A pattern, a way of doing something, especially a pattern of thought, a system of beliefs, a conceptual framework.", collocations: ["paradigm shift", "a new paradigm", "theoretical paradigm"], example: "\"It's a different paradigm of how to treat disease,\" says Dr. Brenda Rea.", exampleZh: "“这是治疗疾病的另一范式。”布伦达·雷亚博士说。" }
    ]
  },
  {
    id: "subsequently", term: "subsequently", phonetic: "/ˈsʌb.sɪ.kwənt.li/", pos: "adv.", meaningZh: "随后；后来；后来，随后", meaningEn: "Following, afterwards in either time or place.", band: "7", collocations: ["and subsequently", "subsequently published", "subsequently found"], example: "The original interview notes were subsequently lost.", exampleZh: "采访记录原稿后来丢失了。",
    senses: [
    {
    pos: "adv.", meaningZh: "随后；后来；后来，随后", meaningEn: "Following, afterwards in either time or place.", collocations: ["and subsequently", "subsequently published", "subsequently found"], example: "The original interview notes were subsequently lost.", exampleZh: "采访记录原稿后来丢失了。" }
    ]
  },
  {
    id: "undermine", term: "undermine", phonetic: "/ʌndəˈmaɪn/", pos: "v.", meaningZh: "削弱；损害；逐渐削弱（损害）；故意破坏（某人）的形象（或威信）；在……下面挖，（尤指）从根基处损坏", meaningEn: "To dig underneath (something), to make a passage for destructive or military purposes; to sap.", band: "7", collocations: ["undermine confidence", "undermine trust", "undermine the argument"], example: "He accused me of slandering him and trying to undermine his position.", exampleZh: "他指控我诽谤他并想削弱他的地位。",
    senses: [
    {
    pos: "v.", meaningZh: "削弱；损害；逐渐削弱（损害）；故意破坏（某人）的形象（或威信）；在……下面挖，（尤指）从根基处损坏", meaningEn: "To dig underneath (something), to make a passage for destructive or military purposes; to sap.", collocations: ["undermine confidence", "undermine trust", "undermine the argument"], example: "He accused me of slandering him and trying to undermine his position.", exampleZh: "他指控我诽谤他并想削弱他的地位。" },
    {
    pos: "vt.", meaningZh: "在...下面挖；渐渐破坏；暗地里破坏；暗中破坏；以阴谋中伤伤害", meaningEn: "", collocations: [], example: "The continued fighting threatens to undermine efforts to negotiate an agreement.", exampleZh: "持续的战斗有可能破坏通过谈判达成协议的努力。" }
    ]
  },
  {
    id: "vicinity", term: "vicinity", phonetic: "/vəˈsɪnəti/", pos: "n.", meaningZh: "附近；邻近；周围地区，邻近地区，附近", meaningEn: "Proximity; the state of being near.", band: "7", collocations: ["in the vicinity", "close vicinity", "immediate vicinity"], example: "There is no hospital in the immediate vicinity.", exampleZh: "附近没有医院。",
    senses: [
    {
    pos: "n.", meaningZh: "附近；邻近；周围地区，邻近地区，附近", meaningEn: "Proximity; the state of being near.", collocations: ["in the vicinity", "close vicinity", "immediate vicinity"], example: "There is no hospital in the immediate vicinity.", exampleZh: "附近没有医院。" }
    ]
  },
  {
    id: "discriminate", term: "discriminate", phonetic: "/dɪsˈkɹɪmɪneɪt/", pos: "v.", meaningZh: "区分；辨别；区分，辨别；歧视，区别对待", meaningEn: "To make distinctions.", band: "7", collocations: ["discriminate between", "discriminate clearly", "discriminate among"], example: "When do babies learn to discriminate voices?", exampleZh: "婴儿什么时候学会辨别嗓音呢？",
    senses: [
    {
    pos: "v.", meaningZh: "区分；辨别；区分，辨别；歧视，区别对待", meaningEn: "To make distinctions.", collocations: ["discriminate between", "discriminate clearly", "discriminate among"], example: "When do babies learn to discriminate voices?", exampleZh: "婴儿什么时候学会辨别嗓音呢？" },
    {
    pos: "adj.", meaningZh: "", meaningEn: "Having the difference marked; distinguished by certain tokens.", collocations: [], example: "Employers cannot discriminate on grounds of age.", exampleZh: "雇主不得有年龄歧视。" }
    ]
  },
  {
    id: "alleviate", term: "alleviate", phonetic: "/əˈli.vi.eɪt/", pos: "v.", meaningZh: "减轻；缓解；减轻，缓和", meaningEn: "To make less severe, as a pain or difficulty.", band: "7", collocations: ["alleviate poverty", "alleviate pain", "alleviate pressure"], example: "A number of measures were taken to alleviate the problem.", exampleZh: "采取了一系列措施缓解这个问题。",
    senses: [
    {
    pos: "v.", meaningZh: "减轻；缓解；减轻，缓和", meaningEn: "To make less severe, as a pain or difficulty.", collocations: ["alleviate poverty", "alleviate pain", "alleviate pressure"], example: "A number of measures were taken to alleviate the problem.", exampleZh: "采取了一系列措施缓解这个问题。" },
    {
    pos: "vt.", meaningZh: "减轻；使缓和", meaningEn: "", collocations: [], example: "Feeling close to objects can alleviate loneliness.", exampleZh: "感觉接近物体可以减轻孤独感。" }
    ]
  },
  {
    id: "arbitrary", term: "arbitrary", phonetic: "/ˈɑɹ.bɪ.tɹɛ(ə).ɹi/", pos: "adj.", meaningZh: "任意的；武断的；任意的，随心所欲的；专横的，武断的", meaningEn: "(usually of a decision) Based on individual discretion or judgment; not based on any objective distinction, perhaps even made at random.", band: "7", collocations: ["arbitrary decision", "arbitrary rule", "seem arbitrary"], example: "He makes unpredictable, arbitrary decisions.", exampleZh: "他做的决定难以预料，主观武断。",
    senses: [
    {
    pos: "adj.", meaningZh: "任意的；武断的；任意的，随心所欲的；专横的，武断的", meaningEn: "(usually of a decision) Based on individual discretion or judgment; not based on any objective distinction, perhaps even made at random.", collocations: ["arbitrary decision", "arbitrary rule", "seem arbitrary"], example: "He makes unpredictable, arbitrary decisions.", exampleZh: "他做的决定难以预料，主观武断。" },
    {
    pos: "n.", meaningZh: "", meaningEn: "Anything arbitrary, such as an arithmetical value or a fee.", collocations: [], example: "The choice of players for the team seemed completely arbitrary.", exampleZh: "看来这个队的队员完全是随意选定的。" }
    ]
  },
  {
    id: "articulate", term: "articulate", phonetic: "/ɑː(ɹ)ˈtɪk.jʊ.lət/", pos: "v.", meaningZh: "清晰表达；口齿伶俐的；明确表达，清楚说明；口齿清楚地说，清晰地发音；用关节连接，连结", meaningEn: "To make clear or effective.", band: "7", collocations: ["articulate ideas", "clearly articulate", "articulate a view"], example: "She is an articulate young woman.", exampleZh: "她是个善表达的年轻女子。",
    senses: [
    {
    pos: "v.", meaningZh: "清晰表达；口齿伶俐的；明确表达，清楚说明；口齿清楚地说，清晰地发音；用关节连接，连结", meaningEn: "To make clear or effective.", collocations: ["articulate ideas", "clearly articulate", "articulate a view"], example: "She is an articulate young woman.", exampleZh: "她是个善表达的年轻女子。" },
    {
    pos: "adj.", meaningZh: "善于表达的；口齿清楚的，发音清晰的；有关节的", meaningEn: "Clear; effective.", collocations: [], example: "He was too drunk to articulate properly.", exampleZh: "他醉得连话都说不清楚。" },
    {
    pos: "n.", meaningZh: "", meaningEn: "An animal of the subkingdom Articulata.", collocations: [], example: "She struggled to articulate her thoughts.", exampleZh: "她竭力表明她的想法。" },
    {
    pos: "vt.", meaningZh: "明白地说；以关节连接；使成为系统的整体", meaningEn: "", collocations: [], example: "She is an articulate young woman.", exampleZh: "她是个善表达的年轻女子。" }
    ]
  },
  {
    id: "attribute", term: "attribute", phonetic: "/əˈtrɪbjuːt/", pos: "v.", meaningZh: "归因于；特性；把……归因于；认为是……所作；认为……具有某种特质", meaningEn: "To ascribe (something) to a given cause, reason etc.", band: "7", collocations: ["attribute to", "attribute success to", "commonly attributed"], example: "Each level should have exactly one caption attribute.", exampleZh: "每个级别都应该有一个标题属性。",
    senses: [
    {
    pos: "v.", meaningZh: "归因于；特性；把……归因于；认为是……所作；认为……具有某种特质", meaningEn: "To ascribe (something) to a given cause, reason etc.", collocations: ["attribute to", "attribute success to", "commonly attributed"], example: "Each level should have exactly one caption attribute.", exampleZh: "每个级别都应该有一个标题属性。" },
    {
    pos: "n.", meaningZh: "属性，特质；标志，象征；定语", meaningEn: "A characteristic or quality of a thing.", collocations: [], example: "People were beginning to attribute superhuman qualities to him.", exampleZh: "人们开始赋予他超人的品质。" },
    {
    pos: "vt.", meaningZh: "把...归于；认为...属于；属性", meaningEn: "", collocations: [], example: "The committee refused to attribute blame without further information.", exampleZh: "如果没有进一步的情况，委员会拒绝归罪于任何人。" }
    ]
  },
  {
    id: "autonomous", term: "autonomous", phonetic: "/ɔːˈtɒnəməs/", pos: "adj.", meaningZh: "自治的；自主的；自治的，有自治权的；自主的，有自主权的；自动的", meaningEn: "self-governing", band: "7", collocations: ["autonomous region", "autonomous vehicle", "remain autonomous"], example: "Five of the six provinces are to become autonomous regions in a new federal system of government.", exampleZh: "在新的联邦政府体制下，6个省中的5个将成为自治区。",
    senses: [
    {
    pos: "adj.", meaningZh: "自治的；自主的；自治的，有自治权的；自主的，有自主权的；自动的", meaningEn: "self-governing", collocations: ["autonomous region", "autonomous vehicle", "remain autonomous"], example: "Five of the six provinces are to become autonomous regions in a new federal system of government.", exampleZh: "在新的联邦政府体制下，6个省中的5个将成为自治区。" }
    ]
  },
  {
    id: "bias", term: "bias", phonetic: "/ˈbaɪəs/", pos: "n.", meaningZh: "偏见；偏向；偏见，成见；偏好，天赋；倾向，趋势；斜纹；（统计）偏差，偏倚；偏重心球形；偏压，偏统", meaningEn: "Inclination towards something; predisposition, partiality, prejudice, preference, predilection.", band: "7", collocations: ["cultural bias", "cognitive bias", "unconscious bias"], example: "The course has a strong practical bias.", exampleZh: "这个课程偏重实用。",
    senses: [
    {
    pos: "n.", meaningZh: "偏见；偏向；偏见，成见；偏好，天赋；倾向，趋势；斜纹；（统计）偏差，偏倚；偏重心球形；偏压，偏统", meaningEn: "Inclination towards something; predisposition, partiality, prejudice, preference, predilection.", collocations: ["cultural bias", "cognitive bias", "unconscious bias"], example: "The course has a strong practical bias.", exampleZh: "这个课程偏重实用。" },
    {
    pos: "v.", meaningZh: "使有偏见，使偏心；加偏压（或偏流）于", meaningEn: "To place bias upon; to influence.", collocations: [], example: "Bias against women permeates every level of the judicial system.", exampleZh: "对妇女的偏见全面影响司法体系的各个层面。" },
    {
    pos: "adj.", meaningZh: "偏斜的", meaningEn: "Inclined to one side; swelled on one side.", collocations: [], example: "Be careful you don't leave yourself open to charges of political bias.", exampleZh: "你要小心别留下把柄，让人家指责你带有政治偏见。" },
    {
    pos: "adv.", meaningZh: "偏斜地", meaningEn: "In a slanting manner; crosswise; obliquely; diagonally.", collocations: [], example: "...his desire to avoid the appearance of bias in favour of one candidate or another.", exampleZh: "…他想避免表现出对这个或那个候选人有偏好。" },
    {
    pos: "vt.", meaningZh: "使有偏见；偏流；偏压；偏磁；偏离", meaningEn: "", collocations: [], example: "We mustn't allow it to bias our teaching.", exampleZh: "我们不允许它使我们的教学产生偏见。" }
    ]
  },
  {
    id: "compensate", term: "compensate", phonetic: "/ˈkɒm.pən.seɪt/", pos: "v.", meaningZh: "补偿；赔偿；赔偿，偿付；弥补，补偿；抵消；酬报（某人）", meaningEn: "To do (something good) after (something bad) happens", band: "7", collocations: ["compensate for", "compensate workers", "fairly compensate"], example: "Nothing can compensate for the loss of a loved one.", exampleZh: "失去心爱的人是无法补偿的。",
    senses: [
    {
    pos: "v.", meaningZh: "补偿；赔偿；赔偿，偿付；弥补，补偿；抵消；酬报（某人）", meaningEn: "To do (something good) after (something bad) happens", collocations: ["compensate for", "compensate workers", "fairly compensate"], example: "Nothing can compensate for the loss of a loved one.", exampleZh: "失去心爱的人是无法补偿的。" }
    ]
  },
  {
    id: "complement", term: "complement", phonetic: "/ˈkɒmpləmənt/", pos: "v.", meaningZh: "补充；complement；补充，补足", meaningEn: "To complete, to bring to perfection, to make whole.", band: "7", collocations: ["complement each other", "perfectly complement", "a useful complement"], example: "There will be a written examination to complement the practical test.", exampleZh: "会有一次书面考试来补充实践测试。",
    senses: [
    {
    pos: "v.", meaningZh: "补充；complement；补充，补足", meaningEn: "To complete, to bring to perfection, to make whole.", collocations: ["complement each other", "perfectly complement", "a useful complement"], example: "There will be a written examination to complement the practical test.", exampleZh: "会有一次书面考试来补充实践测试。" },
    {
    pos: "n.", meaningZh: "补足物，衬托物；足数，足额；补语；余角；补体，防御素", meaningEn: "A protective substance that exists in the serum or other bodily fluid and is capable of killing microorganisms; complement.", collocations: [], example: "The therapy can be a useful technique to complement traditional forms of psychotherapy.", exampleZh: "这种疗法可以作为一个有效的技巧，作为传统心理疗法的补充。" },
    {
    pos: "vt.", meaningZh: "补充；补足；补码；反相器；补数", meaningEn: "", collocations: [], example: "We must aim to complement the rationality of the machine, rather than to compete with it.", exampleZh: "我们必须致力于补足机器的理性，而不是与它竞争。" }
    ]
  },
  {
    id: "comprehensive", term: "comprehensive", phonetic: "/ˌkɒm.pɹɪˈhɛn.sɪv/", pos: "adj.", meaningZh: "全面的；综合的；综合性的，全面的；有理解力的", meaningEn: "Broadly or completely covering; including a large proportion of something.", band: "7", collocations: ["comprehensive review", "comprehensive policy", "comprehensive study"], example: "Streaming within comprehensive schools is common practice.", exampleZh: "综合中学常把学生按能力分班。",
    senses: [
    {
    pos: "adj.", meaningZh: "全面的；综合的；综合性的，全面的；有理解力的", meaningEn: "Broadly or completely covering; including a large proportion of something.", collocations: ["comprehensive review", "comprehensive policy", "comprehensive study"], example: "Streaming within comprehensive schools is common practice.", exampleZh: "综合中学常把学生按能力分班。" },
    {
    pos: "n.", meaningZh: "综合中学；专业综合测验", meaningEn: "A comprehensive school.", collocations: [], example: "The idea was to create a comprehensive road map of the Web.", exampleZh: "这个想法原是为万维网做一个综合指南。" }
    ]
  },
  {
    id: "condemn", term: "condemn", phonetic: "/kənˈdɛm/", pos: "v.", meaningZh: "谴责，严厉指责；宣判，判决；使陷入（不愉快的境地）；宣布……不安全；证明（或表明）有罪", meaningEn: "To strongly criticise or denounce; to excoriate the perpetrators of.", band: "7", collocations: ["condemn violence", "widely condemned", "strongly condemn"], example: "The Church has a duty to condemn violence.", exampleZh: "基督教会有义务谴责暴力。",
    senses: [
    {
    pos: "v.", meaningZh: "谴责，严厉指责；宣判，判决；使陷入（不愉快的境地）；宣布……不安全；证明（或表明）有罪", meaningEn: "To strongly criticise or denounce; to excoriate the perpetrators of.", collocations: ["condemn violence", "widely condemned", "strongly condemn"], example: "The Church has a duty to condemn violence.", exampleZh: "基督教会有义务谴责暴力。" },
    {
    pos: "vt.", meaningZh: "判刑；责备；谴责；定罪；判刑；宣告有罪", meaningEn: "", collocations: [], example: "Like everyone else, I deplore and condemn this killing.", exampleZh: "我同所有人一样强烈谴责这桩凶杀案。" }
    ]
  },
  {
    id: "consequent", term: "consequent", phonetic: "/ˈkɑn.sɪ.kwənt/", pos: "adj.", meaningZh: "随之发生的；作为结果的；随之发生的，由此引起的；（河流，山谷）顺向的", meaningEn: "Following as a result, inference, or natural effect.", band: "7", collocations: ["consequent rise", "consequent loss", "consequent changes"], example: "The warming of the Earth and the consequent climatic changes affect us all.", exampleZh: "全球变暖以及随之而来的气候变化影响我们每个人。",
    senses: [
    {
    pos: "adj.", meaningZh: "随之发生的；作为结果的；随之发生的，由此引起的；（河流，山谷）顺向的", meaningEn: "Following as a result, inference, or natural effect.", collocations: ["consequent rise", "consequent loss", "consequent changes"], example: "The warming of the Earth and the consequent climatic changes affect us all.", exampleZh: "全球变暖以及随之而来的气候变化影响我们每个人。" },
    {
    pos: "n.", meaningZh: "后件，推断；（音乐）答题，答句", meaningEn: "The second half of a hypothetical proposition; Q, if the form of the proposition is \"If P, then Q.\"", collocations: [], example: "The reduction in bullying—and the consequent improvement in pupil happiness—is surely a worthwhile objective.", exampleZh: "减少恃强凌弱现象——进而提高小学生的幸福感——无疑是一个值得追求的目标。" }
    ]
  },
  {
    id: "consistent", term: "consistent", phonetic: "/kənˈsɪstənt/", pos: "adj.", meaningZh: "一致的；始终如一的；始终如一的，一贯的；持续的，连续的；固守的，坚持的；一致的，吻合的", meaningEn: "Of a regularly occurring, dependable nature.", band: "7", collocations: ["consistent with", "consistent results", "remain consistent"], example: "A theory should be internally consistent.", exampleZh: "一套理论应当内在一致。",
    senses: [
    {
    pos: "adj.", meaningZh: "一致的；始终如一的；始终如一的，一贯的；持续的，连续的；固守的，坚持的；一致的，吻合的", meaningEn: "Of a regularly occurring, dependable nature.", collocations: ["consistent with", "consistent results", "remain consistent"], example: "A theory should be internally consistent.", exampleZh: "一套理论应当内在一致。" },
    {
    pos: "n.", meaningZh: "", meaningEn: "(in the plural) Objects or facts that are coexistent, or in agreement with one another.", collocations: [], example: "We must be consistent in applying the rules.", exampleZh: "我们在实施这些规则时必须保持一致。" }
    ]
  },
  {
    id: "constitute", term: "constitute", phonetic: "/ˈkɒnstɪtjuːt/", pos: "v.", meaningZh: "构成；组成；组成，构成；是，被视为；成立，设立；任命", meaningEn: "To set up; to establish; to enact.", band: "7", collocations: ["constitute a risk", "constitute a threat", "constitute the majority"], example: "China's ethnic minorities constitute less than 7 percent of its total population.", exampleZh: "中国的少数民族构成总人口的不到7%。",
    senses: [
    {
    pos: "v.", meaningZh: "构成；组成；组成，构成；是，被视为；成立，设立；任命", meaningEn: "To set up; to establish; to enact.", collocations: ["constitute a risk", "constitute a threat", "constitute the majority"], example: "China's ethnic minorities constitute less than 7 percent of its total population.", exampleZh: "中国的少数民族构成总人口的不到7%。" },
    {
    pos: "n.", meaningZh: "", meaningEn: "An established law.", collocations: [], example: "Testing patients without their consent would constitute a professional and legal offence.", exampleZh: "未得病人同意即对其进行试验会构成职业和法律犯罪。" },
    {
    pos: "vt.", meaningZh: "构成；组成；任命；构造；组成", meaningEn: "", collocations: [], example: "Both of these lobes together constitute a pi bond.", exampleZh: "上下两片叶一起组成了一根 π 键。" }
    ]
  },
  {
    id: "contemporary", term: "contemporary", phonetic: "/kənˈtɛm.p(ə).ɹi/", pos: "adj.", meaningZh: "当代的；同时代的；当代的，现代的；同时期的，同时代的", meaningEn: "From the same time period, coexistent in time.", band: "7", collocations: ["contemporary art", "contemporary society", "contemporary issue"], example: "Contemporary African cinema has much to offer.", exampleZh: "当代非洲电影制作艺术有很多贡献。",
    senses: [
    {
    pos: "adj.", meaningZh: "当代的；同时代的；当代的，现代的；同时期的，同时代的", meaningEn: "From the same time period, coexistent in time.", collocations: ["contemporary art", "contemporary society", "contemporary issue"], example: "Contemporary African cinema has much to offer.", exampleZh: "当代非洲电影制作艺术有很多贡献。" },
    {
    pos: "n.", meaningZh: "同时代的人；同龄人，同辈", meaningEn: "Someone or something living at the same time, or of roughly the same age as another.", collocations: [], example: "We weren't out to design a contemporary utopia.", exampleZh: "我们不想去设计一个当代乌托邦。" }
    ]
  },
  {
    id: "contradict", term: "contradict", phonetic: "/kɒntɹəˈdɪkt/", pos: "v.", meaningZh: "反驳；与…矛盾；反驳，否认；相抵触，相矛盾；发生矛盾", meaningEn: "To deny the truth of (a statement or statements).", band: "7", collocations: ["contradict a claim", "directly contradict", "contradict evidence"], example: "She dared not contradict him.", exampleZh: "她不敢反驳他。",
    senses: [
    {
    pos: "v.", meaningZh: "反驳；与…矛盾；反驳，否认；相抵触，相矛盾；发生矛盾", meaningEn: "To deny the truth of (a statement or statements).", collocations: ["contradict a claim", "directly contradict", "contradict evidence"], example: "She dared not contradict him.", exampleZh: "她不敢反驳他。" },
    {
    pos: "vt.", meaningZh: "反驳；与...抵触；与...矛盾", meaningEn: "", collocations: [], example: "Bowen and Greene's results contradict that argument.", exampleZh: "鲍恩和格林的结果与该论点相矛盾。" },
    {
    pos: "vi.", meaningZh: "反驳", meaningEn: "", collocations: [], example: "\"I am sorry,\" said the Owl, \"to have to contradict the Crow, my famous friend and colleague.\"", exampleZh: "“很抱歉，”猫头鹰说，“我不得不反驳乌鸦，我杰出的朋友和同事。”" }
    ]
  },
  {
    id: "controversial", term: "controversial", phonetic: "/kɒn.tɹə.ˈvɜː.sjəl/", pos: "adj.", meaningZh: "有争议的，引发争论的", meaningEn: "Arousing controversy—a debate or discussion of opposing opinions.", band: "7", collocations: ["controversial issue", "highly controversial", "controversial decision"], example: "Immigration is a controversial issue in many countries.", exampleZh: "移民在很多国家都是一个有争议的问题。",
    senses: [
    {
    pos: "adj.", meaningZh: "有争议的，引发争论的", meaningEn: "Arousing controversy—a debate or discussion of opposing opinions.", collocations: ["controversial issue", "highly controversial", "controversial decision"], example: "Immigration is a controversial issue in many countries.", exampleZh: "移民在很多国家都是一个有争议的问题。" }
    ]
  },
  {
    id: "converge", term: "converge", phonetic: "/kən.ˈvɜːdʒ/", pos: "v.", meaningZh: "汇聚；趋同；（使）汇聚，集中；（观点、目标）趋同；（数）收敛", meaningEn: "Of two or more entities, to approach each other; to get closer and closer.", band: "7", collocations: ["converge on", "converge at", "gradually converge"], example: "The adult ones converge on remaining portions of healthy coral and feed hungrily.", exampleZh: "成年珊瑚聚集在健康珊瑚的剩余部分上，饥饿地进食。",
    senses: [
    {
    pos: "v.", meaningZh: "汇聚；趋同；（使）汇聚，集中；（观点、目标）趋同；（数）收敛", meaningEn: "Of two or more entities, to approach each other; to get closer and closer.", collocations: ["converge on", "converge at", "gradually converge"], example: "The adult ones converge on remaining portions of healthy coral and feed hungrily.", exampleZh: "成年珊瑚聚集在健康珊瑚的剩余部分上，饥饿地进食。" },
    {
    pos: "vi.", meaningZh: "聚合；集中于一点", meaningEn: "", collocations: [], example: "As they flow south, the five rivers converge.", exampleZh: "这5条河向南流，最终汇合在一起。" },
    {
    pos: "vt.", meaningZh: "使集合", meaningEn: "", collocations: [], example: "Hundreds of tractors will converge on the capital.", exampleZh: "成百上千的拖拉机将向首都聚集。" }
    ]
  },
  {
    id: "crucial", term: "crucial", phonetic: "/ˈkɹuː.ʃəl/", pos: "adj.", meaningZh: "关键的；至关重要的；至关重要的，决定性的；<非正式>极好的", meaningEn: "Essential or decisive for determining the outcome or future of something; extremely important.", band: "7", collocations: ["crucial role", "crucial factor", "crucial for"], example: "Defence of the realm is crucial.", exampleZh: "王国的防御是至关重要的。",
    senses: [
    {
    pos: "adj.", meaningZh: "关键的；至关重要的；至关重要的，决定性的；<非正式>极好的", meaningEn: "Essential or decisive for determining the outcome or future of something; extremely important.", collocations: ["crucial role", "crucial factor", "crucial for"], example: "Defence of the realm is crucial.", exampleZh: "王国的防御是至关重要的。" }
    ]
  },
  {
    id: "cumulative", term: "cumulative", phonetic: "/ˈkjuːmjʊlətɪv/", pos: "adj.", meaningZh: "积累的，渐增的；累计的，累积的", meaningEn: "increasing by addition", band: "7", collocations: ["cumulative effect", "cumulative impact", "cumulative total"], example: "It's very close, but overall the cumulative effects of cloud are to cool Earth rather than heat it.", exampleZh: "这十分相近，但是总体上来说，云的累积作用是降低地球的温度而不是让地球升温。",
    senses: [
    {
    pos: "adj.", meaningZh: "积累的，渐增的；累计的，累积的", meaningEn: "increasing by addition", collocations: ["cumulative effect", "cumulative impact", "cumulative total"], example: "It's very close, but overall the cumulative effects of cloud are to cool Earth rather than heat it.", exampleZh: "这十分相近，但是总体上来说，云的累积作用是降低地球的温度而不是让地球升温。" }
    ]
  },
  {
    id: "deliberate", term: "deliberate", phonetic: "/dɪˈlɪbərət/", pos: "adj.", meaningZh: "故意的；深思熟虑；故意的，蓄意的；从容的，小心翼翼的；深思熟虑的", meaningEn: "Done on purpose; intentional.", band: "7", collocations: ["deliberate mistake", "deliberate act", "carefully deliberate"], example: "This was a deliberate piece of misinformation.", exampleZh: "这是一条故意提供的虚假消息。",
    senses: [
    {
    pos: "adj.", meaningZh: "故意的；深思熟虑；故意的，蓄意的；从容的，小心翼翼的；深思熟虑的", meaningEn: "Done on purpose; intentional.", collocations: ["deliberate mistake", "deliberate act", "carefully deliberate"], example: "This was a deliberate piece of misinformation.", exampleZh: "这是一条故意提供的虚假消息。" },
    {
    pos: "v.", meaningZh: "仔细考虑，认真商讨", meaningEn: "To consider carefully; to weigh well in the mind.", collocations: [], example: "Witnesses say the firing was deliberate and sustained.", exampleZh: "目击者说这次射击是蓄意的，而且还持续了一段时间。" }
    ]
  },
  {
    id: "depict", term: "depict", phonetic: "/dɪˈpɪkt/", pos: "v.", meaningZh: "描绘；描写；描述，描绘", meaningEn: "to show or describe", band: "7", collocations: ["depict a scene", "depict as", "vividly depict"], example: "Although we still depict nostalgic snow scenes on Christmas cards, winters are now very much warmer.", exampleZh: "虽然我们还在圣诞卡上描绘引人怀旧的雪景，但现在冬天温暖多了。",
    senses: [
    {
    pos: "v.", meaningZh: "描绘；描写；描述，描绘", meaningEn: "to show or describe", collocations: ["depict a scene", "depict as", "vividly depict"], example: "Although we still depict nostalgic snow scenes on Christmas cards, winters are now very much warmer.", exampleZh: "虽然我们还在圣诞卡上描绘引人怀旧的雪景，但现在冬天温暖多了。" },
    {
    pos: "vt.", meaningZh: "描述；描写", meaningEn: "", collocations: [], example: "It proved hard to depict objectively.", exampleZh: "事实证明很难客观地描述它。" }
    ]
  },
  {
    id: "derive", term: "derive", phonetic: "/dəˈɹaɪv/", pos: "v.", meaningZh: "源自；获得；获得，取得；起源于，来自；提取，衍生（化学物质）", meaningEn: "To obtain or receive (something) from something else.", band: "7", collocations: ["derive from", "derive benefit", "derive pleasure"], example: "Most patients derive enjoyment from leafing through old picture albums.", exampleZh: "大部分病人能从翻阅旧相册中获得乐趣。",
    senses: [
    {
    pos: "v.", meaningZh: "源自；获得；获得，取得；起源于，来自；提取，衍生（化学物质）", meaningEn: "To obtain or receive (something) from something else.", collocations: ["derive from", "derive benefit", "derive pleasure"], example: "Most patients derive enjoyment from leafing through old picture albums.", exampleZh: "大部分病人能从翻阅旧相册中获得乐趣。" },
    {
    pos: "vt.", meaningZh: "得自", meaningEn: "", collocations: [], example: "Mr. Ying is one of those happy people who derive pleasure from helping others.", exampleZh: "英先生是那种助人为乐的快活人。" },
    {
    pos: "vi.", meaningZh: "起源", meaningEn: "", collocations: [], example: "They derive greater pleasure from buying things.", exampleZh: "他们从买东西中获得更大的快乐。" }
    ]
  },
  {
    id: "diminish", term: "diminish", phonetic: "/dɪˈmɪnɪʃ/", pos: "v.", meaningZh: "减少；削弱；减弱，降低，减少；贬低，轻视", meaningEn: "To make smaller.", band: "7", collocations: ["diminish over time", "diminish confidence", "gradually diminish"], example: "Deserts in sub-Saharan Africa will diminish gradually.", exampleZh: "撒哈拉以南非洲的沙漠将逐渐减少。",
    senses: [
    {
    pos: "v.", meaningZh: "减少；削弱；减弱，降低，减少；贬低，轻视", meaningEn: "To make smaller.", collocations: ["diminish over time", "diminish confidence", "gradually diminish"], example: "Deserts in sub-Saharan Africa will diminish gradually.", exampleZh: "撒哈拉以南非洲的沙漠将逐渐减少。" }
    ]
  },
  {
    id: "discrete", term: "discrete", phonetic: "/dɪsˈkɹiːt/", pos: "adj.", meaningZh: "离散的；独立的；分离的，各别的", meaningEn: "separate, individual", band: "7", collocations: ["discrete units", "discrete steps", "discrete categories"], example: "Social structures are not discrete objects; they overlap and interweave.", exampleZh: "社会结构不是离散的客体；他们重叠并交织在一起。",
    senses: [
    {
    pos: "adj.", meaningZh: "离散的；独立的；分离的，各别的", meaningEn: "separate, individual", collocations: ["discrete units", "discrete steps", "discrete categories"], example: "Social structures are not discrete objects; they overlap and interweave.", exampleZh: "社会结构不是离散的客体；他们重叠并交织在一起。" }
    ]
  },
  {
    id: "diverse", term: "diverse", phonetic: "/daɪˈvɜːs/", pos: "adj.", meaningZh: "多样的；不同的；不同的，各式各样的", meaningEn: "Consisting of many different elements; various.", band: "7", collocations: ["culturally diverse", "diverse range", "diverse views"], example: "Cuba is a composite of diverse traditions and people.", exampleZh: "古巴是一个不同传统和民族的融合体。",
    senses: [
    {
    pos: "adj.", meaningZh: "多样的；不同的；不同的，各式各样的", meaningEn: "Consisting of many different elements; various.", collocations: ["culturally diverse", "diverse range", "diverse views"], example: "Cuba is a composite of diverse traditions and people.", exampleZh: "古巴是一个不同传统和民族的融合体。" },
    {
    pos: "adv.", meaningZh: "", meaningEn: "In different directions; diversely.", collocations: [], example: "The company owns a very diverse library of Arabic music.", exampleZh: "公司收藏有多种多样的阿拉伯音乐。" }
    ]
  },
  {
    id: "domain", term: "domain", phonetic: "/dəʊˈmeɪn/", pos: "n.", meaningZh: "领域；范畴；领域，范围；领土，势力范围；（因特网上的）域；（函数的）定义域；地产", meaningEn: "a field of activity", band: "7", collocations: ["in the domain", "public domain", "specific domain"], example: "Physics used to be very much a male domain.", exampleZh: "物理学曾在很大程度上是男人的领域。",
    senses: [
    {
    pos: "n.", meaningZh: "领域；范畴；领域，范围；领土，势力范围；（因特网上的）域；（函数的）定义域；地产", meaningEn: "a field of activity", collocations: ["in the domain", "public domain", "specific domain"], example: "Physics used to be very much a male domain.", exampleZh: "物理学曾在很大程度上是男人的领域。" }
    ]
  },
  {
    id: "dynamic", term: "dynamic", phonetic: "/daɪˈnæ.mɪk/", pos: "adj.", meaningZh: "动态的；充满活力的；充满活力的，精力充沛的；动态的，发展变化的；力的，动力的", meaningEn: "Changing; active; in motion.", band: "7", collocations: ["dynamic market", "social dynamics", "dynamic process"], example: "The dynamic of the market demands constant change and adjustment.", exampleZh: "市场的动力要求有不断的变化和调整。",
    senses: [
    {
    pos: "adj.", meaningZh: "动态的；充满活力的；充满活力的，精力充沛的；动态的，发展变化的；力的，动力的", meaningEn: "Changing; active; in motion.", collocations: ["dynamic market", "social dynamics", "dynamic process"], example: "The dynamic of the market demands constant change and adjustment.", exampleZh: "市场的动力要求有不断的变化和调整。" },
    {
    pos: "n.", meaningZh: "动力，活力；相互作用，动态；动力学", meaningEn: "A characteristic or manner of an interaction; a behavior.", collocations: [], example: "The programme is 90 minutes of dynamic Indian folk dance, live music, and storytelling.", exampleZh: "该节目为90 分钟，由动感印度民间舞蹈、现场音乐表演和说书组成。" }
    ]
  },
  {
    id: "eliminate", term: "eliminate", phonetic: "/ɪˈlɪməneɪt/", pos: "v.", meaningZh: "消除；排除；剔除，根除；对……不予考虑，把……排除在外；（比赛中）淘汰；铲除，杀害；（生理）排除，排泄；消去", meaningEn: "To completely remove, get rid of, put an end to.", band: "7", collocations: ["eliminate poverty", "eliminate errors", "eliminate risk"], example: "This diet claims to eliminate toxins from the body.", exampleZh: "这种饮食据称具有排除体内毒素的作用。",
    senses: [
    {
    pos: "v.", meaningZh: "消除；排除；剔除，根除；对……不予考虑，把……排除在外；（比赛中）淘汰；铲除，杀害；（生理）排除，排泄；消去", meaningEn: "To completely remove, get rid of, put an end to.", collocations: ["eliminate poverty", "eliminate errors", "eliminate risk"], example: "This diet claims to eliminate toxins from the body.", exampleZh: "这种饮食据称具有排除体内毒素的作用。" },
    {
    pos: "vt.", meaningZh: "除去；排除；剔除；消除", meaningEn: "", collocations: [], example: "We called up three economists to ask how to eliminate the deficit and they obliged with very straightforward answers.", exampleZh: "我们致电3位经济学家咨询消除赤字的方法，他们满足了我们的要求，给出了非常直接的答复。" }
    ]
  },
  {
    id: "empirical", term: "empirical", phonetic: "/ɪmˈpɪɹɪkəl/", pos: "adj.", meaningZh: "实证的；经验主义的；经验主义的，以经验为依据的", meaningEn: "Pertaining to or based on experience.", band: "7", collocations: ["empirical evidence", "empirical study", "empirical data"], example: "There is no empirical evidence to support his thesis.", exampleZh: "没有实证根据来支持他的论点。",
    senses: [
    {
    pos: "adj.", meaningZh: "实证的；经验主义的；经验主义的，以经验为依据的", meaningEn: "Pertaining to or based on experience.", collocations: ["empirical evidence", "empirical study", "empirical data"], example: "There is no empirical evidence to support his thesis.", exampleZh: "没有实证根据来支持他的论点。" }
    ]
  },
  {
    id: "enhance", term: "enhance", phonetic: "/ɪnˈhɑːns/", pos: "v.", meaningZh: "增强；提升；增强，提高，改善", meaningEn: "to improve or increase", band: "7", collocations: ["enhance performance", "enhance quality", "enhance understanding"], example: "This is an opportunity to enhance the reputation of the company.", exampleZh: "这是提高公司声誉的机会。",
    senses: [
    {
    pos: "v.", meaningZh: "增强；提升；增强，提高，改善", meaningEn: "to improve or increase", collocations: ["enhance performance", "enhance quality", "enhance understanding"], example: "This is an opportunity to enhance the reputation of the company.", exampleZh: "这是提高公司声誉的机会。" },
    {
    pos: "vt.", meaningZh: "提高；加强；增加", meaningEn: "", collocations: [], example: "The White House is eager to protect and enhance that reputation.", exampleZh: "白宫急于保护并提高那声望。" }
    ]
  },
  {
    id: "estimate", term: "estimate", phonetic: "/ˈɛstɨmɨt/", pos: "v.", meaningZh: "估计；估算；估计；判断，评价", meaningEn: "To calculate roughly, often from imperfect data.", band: "7", collocations: ["estimate the cost", "rough estimate", "estimate that"], example: "My estimate was bang on target.", exampleZh: "我的估计完全准确。",
    senses: [
    {
    pos: "v.", meaningZh: "估计；估算；估计；判断，评价", meaningEn: "To calculate roughly, often from imperfect data.", collocations: ["estimate the cost", "rough estimate", "estimate that"], example: "My estimate was bang on target.", exampleZh: "我的估计完全准确。" },
    {
    pos: "n.", meaningZh: "估计，估价；估价单；看法，判断", meaningEn: "A rough calculation or assessment of the value, size, or cost of something.", collocations: [], example: "That estimate was right on the mark.", exampleZh: "那个估计分毫不差。" },
    {
    pos: "vt.", meaningZh: "估计；评价；判断", meaningEn: "", collocations: [], example: "Police estimate the crowd at 30 000.", exampleZh: "警方估计聚集的人有3万。" },
    {
    pos: "vi.", meaningZh: "估计", meaningEn: "", collocations: [], example: "Try to estimate how many steps it will take to get to a close object.", exampleZh: "估计一下需要多少步才能到达一个近距目标。" }
    ]
  },
  {
    id: "evident", term: "evident", phonetic: "/ˈevɪdənt/", pos: "adj.", meaningZh: "明显的；清楚的，显然的", meaningEn: "clear to see", band: "7", collocations: ["clearly evident", "evident from", "become evident"], example: "The threat of inflation is already evident in bond prices.", exampleZh: "通货膨胀的威胁在证券价格上已经是明显可见的。",
    senses: [
    {
    pos: "adj.", meaningZh: "明显的；清楚的，显然的", meaningEn: "clear to see", collocations: ["clearly evident", "evident from", "become evident"], example: "The threat of inflation is already evident in bond prices.", exampleZh: "通货膨胀的威胁在证券价格上已经是明显可见的。" }
    ]
  },
  {
    id: "evolve", term: "evolve", phonetic: "/ɪˈvɒlv/", pos: "v.", meaningZh: "进化；演变；进化，演化；逐步发展，逐渐演变", meaningEn: "to develop gradually", band: "7", collocations: ["evolve into", "evolve over time", "continuously evolve"], example: "It is interesting that Chinese characters evolve from pictures and signs.", exampleZh: "有趣的是，汉字是由图画和符号演变而来的。",
    senses: [
    {
    pos: "v.", meaningZh: "进化；演变；进化，演化；逐步发展，逐渐演变", meaningEn: "to develop gradually", collocations: ["evolve into", "evolve over time", "continuously evolve"], example: "It is interesting that Chinese characters evolve from pictures and signs.", exampleZh: "有趣的是，汉字是由图画和符号演变而来的。" },
    {
    pos: "vi.", meaningZh: "进展；进化；展开", meaningEn: "", collocations: [], example: "So why would animals evolve a characteristic that seems to endanger them?", exampleZh: "那么，为什么动物会进化出一种似乎会危及它们自身的特性呢？" },
    {
    pos: "vt.", meaningZh: "使发展；使推断出；使进化", meaningEn: "", collocations: [], example: "Sometimes primary group relationships evolve out of secondary group relationships.", exampleZh: "有时主要的群体关系从次要的群体关系演变而来。" }
    ]
  },
  {
    id: "exacerbate", term: "exacerbate", phonetic: "/ɪkˈsæs-/", pos: "v.", meaningZh: "加剧；使恶化；使恶化，使加剧", meaningEn: "To make worse (a problem, bad situation, negative feeling, etc.); aggravate; exasperate.", band: "7", collocations: ["exacerbate the problem", "exacerbate tensions", "further exacerbate"], example: "Noise in classrooms can only exacerbate their difficulty in comprehending and processing verbal communication with other children and instructions from the teacher.", exampleZh: "教室里的噪音只会加剧他们与其他孩子的口头交流和对老师的指令的理解和处理的困难。",
    senses: [
    {
    pos: "v.", meaningZh: "加剧；使恶化；使恶化，使加剧", meaningEn: "To make worse (a problem, bad situation, negative feeling, etc.); aggravate; exasperate.", collocations: ["exacerbate the problem", "exacerbate tensions", "further exacerbate"], example: "Noise in classrooms can only exacerbate their difficulty in comprehending and processing verbal communication with other children and instructions from the teacher.", exampleZh: "教室里的噪音只会加剧他们与其他孩子的口头交流和对老师的指令的理解和处理的困难。" },
    {
    pos: "vt.", meaningZh: "使恶化；使增剧；激怒；使加剧", meaningEn: "", collocations: [], example: "Moreover, putting young people in prison can exacerbate the problems—a system of mentors and helpers could be provided for those who unthinkingly break the law.", exampleZh: "此外，把年轻人关进监狱可能使问题更加严重——那些不假思索的违法者可能得到一个导师和帮手系统。" }
    ]
  },
  {
    id: "exhibit", term: "exhibit", phonetic: "/ɛɡ-/", pos: "v.", meaningZh: "展示；表现出；表现出；卖弄，炫耀；提出（证据等）；展览，展出", meaningEn: "To display or show (something) for others to see, especially at an exhibition or contest.", band: "7", collocations: ["exhibit behaviour", "exhibit a trend", "publicly exhibit"], example: "This exhibit was kindly loaned by the artist's family.", exampleZh: "这件展品是艺术家的家人惠借而展出的。",
    senses: [
    {
    pos: "v.", meaningZh: "展示；表现出；表现出；卖弄，炫耀；提出（证据等）；展览，展出", meaningEn: "To display or show (something) for others to see, especially at an exhibition or contest.", collocations: ["exhibit behaviour", "exhibit a trend", "publicly exhibit"], example: "This exhibit was kindly loaned by the artist's family.", exampleZh: "这件展品是艺术家的家人惠借而展出的。" },
    {
    pos: "n.", meaningZh: "展品；（法庭上出示的）证物；<美>展览，展出", meaningEn: "An instance of exhibiting.", collocations: [], example: "The new exhibit will tour a dozen US cities next year.", exampleZh: "这批新展品明年将在美国十二个城市巡回展出。" },
    {
    pos: "vt.", meaningZh: "展现；陈列；展览", meaningEn: "", collocations: [], example: "He had kindly offered to loan us all the plants required for the exhibit.", exampleZh: "他友好地主动提出了借给我们展览会所需的全部植物。" },
    {
    pos: "vi.", meaningZh: "开展览会", meaningEn: "", collocations: [], example: "He has exhibited symptoms of anxiety and overwhelming worry.", exampleZh: "他已表现出焦虑和忧心如焚的症状。" }
    ]
  },
  {
    id: "explicit", term: "explicit", phonetic: "/ɪkˈsplɪsɪt/", pos: "adj.", meaningZh: "明确的；清楚的；清楚明白的，明确的，详述的；直截了当的，坦率的；赤裸裸表现性爱（或暴力）的，露骨的", meaningEn: "Very specific, clear, or detailed.", band: "7", collocations: ["explicit instruction", "explicit consent", "explicit about"], example: "He gave me very explicit directions on how to get there.", exampleZh: "他清楚地向我说明了去那儿的路线。",
    senses: [
    {
    pos: "adj.", meaningZh: "明确的；清楚的；清楚明白的，明确的，详述的；直截了当的，坦率的；赤裸裸表现性爱（或暴力）的，露骨的", meaningEn: "Very specific, clear, or detailed.", collocations: ["explicit instruction", "explicit consent", "explicit about"], example: "He gave me very explicit directions on how to get there.", exampleZh: "他清楚地向我说明了去那儿的路线。" },
    {
    pos: "n.", meaningZh: "（手稿、早期印刷品或礼拜仪式上唱诗的）结束语", meaningEn: "", collocations: [], example: "Should they have explicit permission?", exampleZh: "他们应该有明确的许可吗？" }
    ]
  },
  {
    id: "facilitate", term: "facilitate", phonetic: "/fəˈsɪləteɪt/", pos: "v.", meaningZh: "促进；使便利；使更容易，使便利；促进，推动", meaningEn: "To make easy or easier.", band: "7", collocations: ["facilitate learning", "facilitate communication", "facilitate change"], example: "The new airport will facilitate the development of tourism.", exampleZh: "新机场将促进旅游业的发展。",
    senses: [
    {
    pos: "v.", meaningZh: "促进；使便利；使更容易，使便利；促进，推动", meaningEn: "To make easy or easier.", collocations: ["facilitate learning", "facilitate communication", "facilitate change"], example: "The new airport will facilitate the development of tourism.", exampleZh: "新机场将促进旅游业的发展。" },
    {
    pos: "vt.", meaningZh: "使容易；促进；帮助；使容易；使便利；推进", meaningEn: "", collocations: [], example: "It may facilitate independent learning.", exampleZh: "它可以促进自主学习。" }
    ]
  },
  {
    id: "formulate", term: "formulate", phonetic: "/ˈfɔːmjuleɪt/", pos: "v.", meaningZh: "制定；系统阐述；制定，规划；确切表达，认真阐述；用公式表示", meaningEn: "To reduce to, or express in, a formula; to put in a clear and definite form of statement or expression.", band: "7", collocations: ["formulate a plan", "formulate policy", "carefully formulate"], example: "Governments need to formulate energy policies that promote economically and environmentally sound development.", exampleZh: "各国政府需要制订促进经济和环境充分发展的能源政策。",
    senses: [
    {
    pos: "v.", meaningZh: "制定；系统阐述；制定，规划；确切表达，认真阐述；用公式表示", meaningEn: "To reduce to, or express in, a formula; to put in a clear and definite form of statement or expression.", collocations: ["formulate a plan", "formulate policy", "carefully formulate"], example: "Governments need to formulate energy policies that promote economically and environmentally sound development.", exampleZh: "各国政府需要制订促进经济和环境充分发展的能源政策。" },
    {
    pos: "vt.", meaningZh: "用公式表示；明确叙述；制订；公式化；公式表示", meaningEn: "", collocations: [], example: "Computers increasingly become principal actors in leveraging data to formulate questions, which requires radically new ways of reasoning.", exampleZh: "计算机日益成为利用数据来制定问题的主要角色，而这需要全新的推理方法。" }
    ]
  },
  {
    id: "foster", term: "foster", phonetic: "/ˈfɒstə/", pos: "v.", meaningZh: "培养；促进；促进，培养；领养，收养", meaningEn: "To nurture or bring up offspring, or to provide similar parental care to an unrelated child.", band: "7", collocations: ["foster creativity", "foster trust", "foster cooperation"], example: "Mr. Foster romped home with 141 votes.", exampleZh: "福斯特先生以141票轻松获胜。",
    senses: [
    {
    pos: "v.", meaningZh: "培养；促进；促进，培养；领养，收养", meaningEn: "To nurture or bring up offspring, or to provide similar parental care to an unrelated child.", collocations: ["foster creativity", "foster trust", "foster cooperation"], example: "Mr. Foster romped home with 141 votes.", exampleZh: "福斯特先生以141票轻松获胜。" },
    {
    pos: "adj.", meaningZh: "代养的，寄养的", meaningEn: "Providing parental care to children not related to oneself.", collocations: [], example: "The children were placed with foster parents.", exampleZh: "这些小孩已安顿好，交给寄养父母了。" },
    {
    pos: "n.", meaningZh: "", meaningEn: "A foster parent.", collocations: [], example: "We couldn't adopt a child, so we decided to foster.", exampleZh: "我们不能领养孩子，所以决定代养一个。" },
    {
    pos: "vt.", meaningZh: "养育；抚育；培养；鼓励；抱(希望)", meaningEn: "", collocations: [], example: "Little Jack was placed with foster parents.", exampleZh: "小杰克被安置在养父母家。" }
    ]
  },
  {
    id: "hypothesis", term: "hypothesis", phonetic: "/-əsəs/", pos: "n.", meaningZh: "假说，假设；（凭空的）猜想，猜测；前提", meaningEn: "Used loosely, a tentative conjecture explaining an observation, phenomenon or scientific problem that can be tested by further observation, investigation and/or experimentation. As a scientific term of art, see the attached quotation. Compare to theory, and quotation given there.", band: "7", collocations: ["test a hypothesis", "form a hypothesis", "support the hypothesis"], example: "Work will now begin to test the hypothesis in rats.", exampleZh: "在老鼠身上验证这一假设的工作现在要开始了。",
    senses: [
    {
    pos: "n.", meaningZh: "假说，假设；（凭空的）猜想，猜测；前提", meaningEn: "Used loosely, a tentative conjecture explaining an observation, phenomenon or scientific problem that can be tested by further observation, investigation and/or experimentation. As a scientific term of art, see the attached quotation. Compare to theory, and quotation given there.", collocations: ["test a hypothesis", "form a hypothesis", "support the hypothesis"], example: "Work will now begin to test the hypothesis in rats.", exampleZh: "在老鼠身上验证这一假设的工作现在要开始了。" }
    ]
  },
  {
    id: "illustrate", term: "illustrate", phonetic: "/ɪ.ˈlʌs.tɹeɪt/", pos: "v.", meaningZh: "说明；阐明；加插图于；说明，阐明；证明，证实", meaningEn: "To shed light upon.", band: "7", collocations: ["illustrate a point", "clearly illustrate", "illustrate with"], example: "Let me illustrate what I mean with an old story.", exampleZh: "让我用一个老故事来说明我指的是什么吧。",
    senses: [
    {
    pos: "v.", meaningZh: "说明；阐明；加插图于；说明，阐明；证明，证实", meaningEn: "To shed light upon.", collocations: ["illustrate a point", "clearly illustrate", "illustrate with"], example: "Let me illustrate what I mean with an old story.", exampleZh: "让我用一个老故事来说明我指的是什么吧。" },
    {
    pos: "vt.", meaningZh: "举例说明；作图解；阐明", meaningEn: "", collocations: [], example: "One example will suffice to illustrate the point.", exampleZh: "举一个例子就足以说明这一点。" },
    {
    pos: "vi.", meaningZh: "举例说明", meaningEn: "", collocations: [], example: "To illustrate my point , let me tell you a little story.", exampleZh: "为了说明我的观点，让我来给你们讲个小故事。" }
    ]
  },
  {
    id: "immediate", term: "immediate", phonetic: "/ɪˈmiːdɪət/", pos: "adj.", meaningZh: "立即的；直接的；立刻的，即时的；目前的，紧迫的；附近的，紧接的；（关系或级别）最接近的，直系的；（两者间）直接的；（感知，反应）直觉的", meaningEn: "Happening right away, instantly, with no delay.", band: "7", collocations: ["immediate effect", "immediate response", "immediate concern"], example: "She demanded an immediate explanation.", exampleZh: "她要求立即作出解释。",
    senses: [
    {
    pos: "adj.", meaningZh: "立即的；直接的；立刻的，即时的；目前的，紧迫的；附近的，紧接的；（关系或级别）最接近的，直系的；（两者间）直接的；（感知，反应）直觉的", meaningEn: "Happening right away, instantly, with no delay.", collocations: ["immediate effect", "immediate response", "immediate concern"], example: "She demanded an immediate explanation.", exampleZh: "她要求立即作出解释。" }
    ]
  },
  {
    id: "imply", term: "imply", phonetic: "/ɪmˈplaɪ/", pos: "v.", meaningZh: "暗示；意味着；暗示，暗指；意味着；必然包含", meaningEn: "(of a proposition) to have as a necessary consequence", band: "7", collocations: ["imply that", "strongly imply", "imply a change"], example: "How dare she imply that I was lying?", exampleZh: "她竟敢暗示我在撒谎？",
    senses: [
    {
    pos: "v.", meaningZh: "暗示；意味着；暗示，暗指；意味着；必然包含", meaningEn: "(of a proposition) to have as a necessary consequence", collocations: ["imply that", "strongly imply", "imply a change"], example: "How dare she imply that I was lying?", exampleZh: "她竟敢暗示我在撒谎？" },
    {
    pos: "vt.", meaningZh: "暗示；意味；隐含", meaningEn: "", collocations: [], example: "What does the woman imply?", exampleZh: "这位女士在暗示什么？" }
    ]
  },
  {
    id: "incentive", term: "incentive", phonetic: "/ɪnˈsentɪv/", pos: "n.", meaningZh: "激励；刺激；激励，刺激", meaningEn: "something that motivates", band: "7", collocations: ["financial incentive", "provide an incentive", "strong incentive"], example: "There will be a strong incentive to enter into a process of negotiation.", exampleZh: "将会有一个强烈的刺激来进入谈判的过程。",
    senses: [
    {
    pos: "n.", meaningZh: "激励；刺激；激励，刺激", meaningEn: "something that motivates", collocations: ["financial incentive", "provide an incentive", "strong incentive"], example: "There will be a strong incentive to enter into a process of negotiation.", exampleZh: "将会有一个强烈的刺激来进入谈判的过程。" },
    {
    pos: "adj.", meaningZh: "激励的", meaningEn: "", collocations: [], example: "Neither side would have a real incentive to start a war. Ergo, peace would reign.", exampleZh: "双方都没有发动战争的真实动机。因此，和平将会到来。" }
    ]
  },
  {
    id: "incidence", term: "incidence", phonetic: "/ˈɪnsɪdəns/", pos: "n.", meaningZh: "发生率；入射", meaningEn: "the rate of occurrence", band: "7", collocations: ["incidence of", "high incidence", "rising incidence"], example: "The incidence of breast cancer increases with age.", exampleZh: "乳腺癌的发病率随着年龄的增长而上升。",
    senses: [
    {
    pos: "n.", meaningZh: "发生率；入射", meaningEn: "the rate of occurrence", collocations: ["incidence of", "high incidence", "rising incidence"], example: "The incidence of breast cancer increases with age.", exampleZh: "乳腺癌的发病率随着年龄的增长而上升。" }
    ]
  },
  {
    id: "incorporate", term: "incorporate", phonetic: "/ɪŋˈkɔɹpɚe(ɪ)t/", pos: "v.", meaningZh: "纳入；包含；包含，合并；组成公司；掺和，混合（成分）；使具体化，体现", meaningEn: "To include (something) as a part.", band: "7", collocations: ["incorporate into", "incorporate feedback", "incorporate ideas"], example: "The new cars will incorporate a number of major improvements.", exampleZh: "这种新型汽车将包含许多重大的改进。",
    senses: [
    {
    pos: "v.", meaningZh: "纳入；包含；包含，合并；组成公司；掺和，混合（成分）；使具体化，体现", meaningEn: "To include (something) as a part.", collocations: ["incorporate into", "incorporate feedback", "incorporate ideas"], example: "The new cars will incorporate a number of major improvements.", exampleZh: "这种新型汽车将包含许多重大的改进。" },
    {
    pos: "adj.", meaningZh: "合成一体的，合并的；具体化的；组成公司（或社团）的", meaningEn: "Corporate; incorporated; made one body, or united in one body; associated; mixed together; combined; embodied.", collocations: [], example: "TV and movie producers often incorporate an element of bad behavior.", exampleZh: "电视和电影制作人通常会融入不良行为的元素。" },
    {
    pos: "vt.", meaningZh: "吸收；合并；使组成公司；体现", meaningEn: "", collocations: [], example: "For example, universities could incorporate IDPs into their graduate curricula to help students discuss, plan, prepare for, and achieve their long-term career goals.", exampleZh: "例如，大学可以将个人发展计划纳入研究生课程，帮助学生们讨论、计划、准备和实现长期职业目标。" },
    {
    pos: "vi.", meaningZh: "合并；混合；组成公司", meaningEn: "", collocations: [], example: "The new cars will incorporate a number of major improvements.", exampleZh: "这种新型汽车将包含许多重大的改进。" }
    ]
  },
  {
    id: "indigenous", term: "indigenous", phonetic: "/ɪnˈdɪdʒɪnəs/", pos: "adj.", meaningZh: "本土的；土著的；本土的，固有的", meaningEn: "Born or originating in, native to a land or region, especially before an intrusion.", band: "7", collocations: ["indigenous people", "indigenous culture", "indigenous species"], example: "Indigenous foods like salt marsh lamb are in vogue.", exampleZh: "像盐沼羊肉这样的本土食物正在流行。",
    senses: [
    {
    pos: "adj.", meaningZh: "本土的；土著的；本土的，固有的", meaningEn: "Born or originating in, native to a land or region, especially before an intrusion.", collocations: ["indigenous people", "indigenous culture", "indigenous species"], example: "Indigenous foods like salt marsh lamb are in vogue.", exampleZh: "像盐沼羊肉这样的本土食物正在流行。" }
    ]
  },
  {
    id: "infer", term: "infer", phonetic: "/ɪnˈfɜː/", pos: "v.", meaningZh: "推断；推论；推断，推论；暗示，暗指", meaningEn: "To introduce (something) as a reasoned conclusion; to conclude by reasoning or deduction, as from premises or evidence.", band: "7", collocations: ["infer from", "infer that", "reasonably infer"], example: "What can we infer about the author from the text?", exampleZh: "从文章中我们能推断出作者的什么信息？",
    senses: [
    {
    pos: "v.", meaningZh: "推断；推论；推断，推论；暗示，暗指", meaningEn: "To introduce (something) as a reasoned conclusion; to conclude by reasoning or deduction, as from premises or evidence.", collocations: ["infer from", "infer that", "reasonably infer"], example: "What can we infer about the author from the text?", exampleZh: "从文章中我们能推断出作者的什么信息？" },
    {
    pos: "vt.", meaningZh: "推论出；推断", meaningEn: "", collocations: [], example: "What can we infer from the passage about the author?", exampleZh: "我们可以从文章中推断出关于作者的什么信息？" },
    {
    pos: "vi.", meaningZh: "作推论", meaningEn: "", collocations: [], example: "You should learn how to infer a conclusion from statistics.", exampleZh: "你应该学会如何从数据中推断出一个结论。" }
    ]
  },
  {
    id: "inherent", term: "inherent", phonetic: "/ɪnˈhɛɹənt/", pos: "adj.", meaningZh: "固有的；内在的；内在的，固有的；<法律>（权利，特权）固定属于（某人）的；（形容词）作定语和表语时意义相同的", meaningEn: "Naturally as part or consequence of something.", band: "7", collocations: ["inherent risk", "inherent value", "inherent in"], example: "Individuality is a valued and inherent part of the British character.", exampleZh: "个性是英国人重视并固有的特征。",
    senses: [
    {
    pos: "adj.", meaningZh: "固有的；内在的；内在的，固有的；<法律>（权利，特权）固定属于（某人）的；（形容词）作定语和表语时意义相同的", meaningEn: "Naturally as part or consequence of something.", collocations: ["inherent risk", "inherent value", "inherent in"], example: "Individuality is a valued and inherent part of the British character.", exampleZh: "个性是英国人重视并固有的特征。" }
    ]
  },
  {
    id: "innovative", term: "innovative", phonetic: "/ɪnˈnɒ.və.tɪv/", pos: "adj.", meaningZh: "创新的；革新的，新颖的；富有革新精神的", meaningEn: "Characterized by the creation of new ideas or inventions.", band: "7", collocations: ["innovative approach", "innovative design", "highly innovative"], example: "For assistance, they turned to one of the city's most innovative museums.", exampleZh: "为了寻求帮助，他们求助于该市最具创新精神的博物馆中的一座。",
    senses: [
    {
    pos: "adj.", meaningZh: "创新的；革新的，新颖的；富有革新精神的", meaningEn: "Characterized by the creation of new ideas or inventions.", collocations: ["innovative approach", "innovative design", "highly innovative"], example: "For assistance, they turned to one of the city's most innovative museums.", exampleZh: "为了寻求帮助，他们求助于该市最具创新精神的博物馆中的一座。" }
    ]
  },
  {
    id: "insight", term: "insight", phonetic: "/ˈɪnsaɪt/", pos: "n.", meaningZh: "洞察；深刻见解；洞悉，了解；洞察力", meaningEn: "A sight or view of the interior of anything; a deep inspection or view; introspection; frequently used with into.", band: "7", collocations: ["provide insight", "gain insight", "valuable insight"], example: "He was a man of forceful character, with considerable insight and diplomatic skills.", exampleZh: "他是个性格坚强的人，有着非凡的洞察力和交际手腕。",
    senses: [
    {
    pos: "n.", meaningZh: "洞察；深刻见解；洞悉，了解；洞察力", meaningEn: "A sight or view of the interior of anything; a deep inspection or view; introspection; frequently used with into.", collocations: ["provide insight", "gain insight", "valuable insight"], example: "He was a man of forceful character, with considerable insight and diplomatic skills.", exampleZh: "他是个性格坚强的人，有着非凡的洞察力和交际手腕。" }
    ]
  },
  {
    id: "integral", term: "integral", phonetic: "/ˈɪntɪɡɹəl/", pos: "adj.", meaningZh: "不可或缺的；完整的；必需的，必要的，不可或缺的；作为组成部分的；完整的；整的，积分的", meaningEn: "Constituting a whole together with other parts or factors; not omittable or removable", band: "7", collocations: ["integral part", "integral to", "an integral role"], example: "As an integral part of learning, it brings about positive changes, making people develop and grow.", exampleZh: "作为学习的一个组成部分，它带来了积极的变化，使人发展和成长。",
    senses: [
    {
    pos: "adj.", meaningZh: "不可或缺的；完整的；必需的，必要的，不可或缺的；作为组成部分的；完整的；整的，积分的", meaningEn: "Constituting a whole together with other parts or factors; not omittable or removable", collocations: ["integral part", "integral to", "an integral role"], example: "As an integral part of learning, it brings about positive changes, making people develop and grow.", exampleZh: "作为学习的一个组成部分，它带来了积极的变化，使人发展和成长。" },
    {
    pos: "n.", meaningZh: "积分；完整", meaningEn: "A number, the limit of the sums computed in a process in which the domain of a function is divided into small subsets and a possibly nominal value of the function on each subset is multiplied by the measure of that subset, all these products then being summed.", collocations: [], example: "Materials and methods of construction are integral parts of the design of architecture structures.", exampleZh: "建筑材料和施工方法是建筑结构设计的重要组成部分。" }
    ]
  },
  {
    id: "intrinsic", term: "intrinsic", phonetic: "/ɪn.ˈtɹɪn.zɪk/", pos: "adj.", meaningZh: "内在的；本质的；内在的，固有的", meaningEn: "belonging naturally", band: "7", collocations: ["intrinsic value", "intrinsic motivation", "intrinsic to"], example: "Diamonds have little intrinsic value and their price depends almost entirely on their scarcity.", exampleZh: "钻石没有多少内在价值，它们的价格几乎完全取决于其稀有程度。",
    senses: [
    {
    pos: "adj.", meaningZh: "内在的；本质的；内在的，固有的", meaningEn: "belonging naturally", collocations: ["intrinsic value", "intrinsic motivation", "intrinsic to"], example: "Diamonds have little intrinsic value and their price depends almost entirely on their scarcity.", exampleZh: "钻石没有多少内在价值，它们的价格几乎完全取决于其稀有程度。" }
    ]
  },
  {
    id: "invoke", term: "invoke", phonetic: "/ɪnˈvoʊk/", pos: "v.", meaningZh: "援引；唤起；行使，实施（法权）；援用，援引（法律）；提及，援引（某人、某理论、实例等作为支持）；提及（某著名人物）；唤起，引起（感情或想象）；（尤指向神灵）祈祷，祈求；用法术召唤（魔鬼）；（计算机）调用，激活", meaningEn: "To call upon (a person, a god) for help, assistance or guidance.", band: "7", collocations: ["invoke a law", "invoke an argument", "invoke memories"], example: "You also have to invoke the stored procedure once.", exampleZh: "您还必须调用一次存储过程。",
    senses: [
    {
    pos: "v.", meaningZh: "援引；唤起；行使，实施（法权）；援用，援引（法律）；提及，援引（某人、某理论、实例等作为支持）；提及（某著名人物）；唤起，引起（感情或想象）；（尤指向神灵）祈祷，祈求；用法术召唤（魔鬼）；（计算机）调用，激活", meaningEn: "To call upon (a person, a god) for help, assistance or guidance.", collocations: ["invoke a law", "invoke an argument", "invoke memories"], example: "You also have to invoke the stored procedure once.", exampleZh: "您还必须调用一次存储过程。" },
    {
    pos: "vt.", meaningZh: "祈求；恳求；实行；援引；引起；调用；请求", meaningEn: "", collocations: [], example: "In choosing a method for determining climatic conditions that existed in the past, paleoclimatologists invoke four principal criteria.", exampleZh: "在选择确定过去存在的气候条件的方法时，古气候学家援引了四个主要标准。" }
    ]
  },
  {
    id: "isolate", term: "isolate", phonetic: "/ˈaɪsəleɪt/", pos: "v.", meaningZh: "隔离；孤立；孤立，分离；隔离；单独考虑，区别看待；使（某物质、细胞等）分离", meaningEn: "To set apart or cut off from others.", band: "7", collocations: ["isolate the cause", "isolate from", "socially isolate"], example: "Researchers are still trying to isolate the gene that causes this abnormality.", exampleZh: "研究人员仍然在试图分离导致这种畸形的基因。",
    senses: [
    {
    pos: "v.", meaningZh: "隔离；孤立；孤立，分离；隔离；单独考虑，区别看待；使（某物质、细胞等）分离", meaningEn: "To set apart or cut off from others.", collocations: ["isolate the cause", "isolate from", "socially isolate"], example: "Researchers are still trying to isolate the gene that causes this abnormality.", exampleZh: "研究人员仍然在试图分离导致这种畸形的基因。" },
    {
    pos: "n.", meaningZh: "被隔离的人（或物）；（用于研究的）分离菌，隔离群", meaningEn: "Something that has been isolated.", collocations: [], example: "This policy could isolate the country from the other permanent members of the United Nations Security Council.", exampleZh: "这项政策可能会将这个国家从联合国安理会的其他常任理事国中孤立出来。" },
    {
    pos: "adj.", meaningZh: "孤独的，孤立的", meaningEn: "", collocations: [], example: "Element 43's radioactivity makes it easy to isolate and measure.", exampleZh: "43号元素的放射性使其易于分离和测量。" },
    {
    pos: "vt.", meaningZh: "使隔离；使孤立；使绝缘", meaningEn: "", collocations: [], example: "This policy could isolate the country from the other permanent members of the United Nations Security Council.", exampleZh: "这项政策可能会将这个国家从联合国安理会的其他常任理事国中孤立出来。" }
    ]
  },
  {
    id: "legitimate", term: "legitimate", phonetic: "/lɪˈdʒɪtɪmət/", pos: "adj.", meaningZh: "合法的；合理的；正当的，合理的；合法的，依法的；合法婚姻所生的；（君主）有合法王位继承权的；（与音乐喜剧、滑稽剧相对）正剧的", meaningEn: "In accordance with the law or established legal forms and requirements.", band: "7", collocations: ["legitimate concern", "legitimate reason", "legitimate claim"], example: "Is his business strictly legitimate?", exampleZh: "他的生意是否绝对合法？",
    senses: [
    {
    pos: "adj.", meaningZh: "合法的；合理的；正当的，合理的；合法的，依法的；合法婚姻所生的；（君主）有合法王位继承权的；（与音乐喜剧、滑稽剧相对）正剧的", meaningEn: "In accordance with the law or established legal forms and requirements.", collocations: ["legitimate concern", "legitimate reason", "legitimate claim"], example: "Is his business strictly legitimate?", exampleZh: "他的生意是否绝对合法？" },
    {
    pos: "v.", meaningZh: "<美>使合法化，使正当化", meaningEn: "To make legitimate, lawful, or valid; especially, to put in the position or state of a legitimate person before the law, by legal means.", collocations: [], example: "The empire could not cohere as a legitimate whole.", exampleZh: "这个帝国无法凝聚成一个合法的整体。" },
    {
    pos: "n.", meaningZh: "", meaningEn: "A person born to a legally married couple.", collocations: [], example: "The government said that it has suspended all aid to Haiti until that country's legitimate government is restored.", exampleZh: "政府说它已经暂停对海地的所有援助，直到海地恢复合法政府为止。" },
    {
    pos: "vt.", meaningZh: "认为正当；立为嫡嗣；使合法", meaningEn: "", collocations: [], example: "The French government has condemned the coup in Haiti and has demanded the restoration of the legitimate government.", exampleZh: "法国政府已经谴责了海地的政变，并要求恢复合法政府。" }
    ]
  },
  {
    id: "objective", term: "objective", phonetic: "/ɒbˈd͡ʒɛk.tɪv/", pos: "adj.", meaningZh: "客观的；目标；客观的，不带个人情感的；客观存在的；宾格的；目标的", meaningEn: "Of or relating to a material object, actual existence or reality.", band: "7", collocations: ["objective view", "stay objective", "main objective"], example: "What is the main objective of this project?", exampleZh: "这个项目的主要目标是什么？",
    senses: [
    {
    pos: "adj.", meaningZh: "客观的；目标；客观的，不带个人情感的；客观存在的；宾格的；目标的", meaningEn: "Of or relating to a material object, actual existence or reality.", collocations: ["objective view", "stay objective", "main objective"], example: "What is the main objective of this project?", exampleZh: "这个项目的主要目标是什么？" },
    {
    pos: "n.", meaningZh: "目的，目标；出击目标（尤指在军事攻击中)；（望远镜或显微镜中的）物镜；出击目标（尤指在军事攻击中）；宾格", meaningEn: "A material object that physically exists.", collocations: [], example: "Winning is not the prime objective in this sport.", exampleZh: "获胜不是这项体育运动的主要目的。" }
    ]
  },
  {
    id: "perspective", term: "perspective", phonetic: "/pɚˈspɛktɪv/", pos: "n.", meaningZh: "视角；观点；（观察问题的）视角，观点；透视（画）法；（几何）透视关系，投影比例；洞察力，判断力；景观，远景；角度；（声音）立体效果", meaningEn: "a point of view", band: "7", collocations: ["from a perspective", "broaden perspective", "new perspective"], example: "In his art he broke the laws of scientific linear perspective.", exampleZh: "他在自己的绘画艺术中打破了科学的直线透视法规律。",
    senses: [
    {
    pos: "n.", meaningZh: "视角；观点；（观察问题的）视角，观点；透视（画）法；（几何）透视关系，投影比例；洞察力，判断力；景观，远景；角度；（声音）立体效果", meaningEn: "a point of view", collocations: ["from a perspective", "broaden perspective", "new perspective"], example: "In his art he broke the laws of scientific linear perspective.", exampleZh: "他在自己的绘画艺术中打破了科学的直线透视法规律。" },
    {
    pos: "adj.", meaningZh: "透视的", meaningEn: "", collocations: [], example: "I let things get out of perspective.", exampleZh: "我没能正确地看待事物。" }
    ]
  },
  {
    id: "phenomenon", term: "phenomenon", phonetic: "/fɪˈnɒmənɒn/", pos: "n.", meaningZh: "现象；杰出的人，非凡的人（或事物）；（哲学）现象", meaningEn: "an observable fact or event", band: "7", collocations: ["social phenomenon", "natural phenomenon", "a growing phenomenon"], example: "This phenomenon piqued Dr. Morris' interest.", exampleZh: "该现象引起莫里思博士的兴趣。",
    senses: [
    {
    pos: "n.", meaningZh: "现象；杰出的人，非凡的人（或事物）；（哲学）现象", meaningEn: "an observable fact or event", collocations: ["social phenomenon", "natural phenomenon", "a growing phenomenon"], example: "This phenomenon piqued Dr. Morris' interest.", exampleZh: "该现象引起莫里思博士的兴趣。" }
    ]
  },
  {
    id: "potential", term: "potential", phonetic: "/pəˈtɛnʃəl/", pos: "adj.", meaningZh: "潜在的；潜力；潜在的，可能的", meaningEn: "Existing in possibility, not in actuality.", band: "7", collocations: ["great potential", "potential risk", "realise potential"], example: "Their potential is unrealized.", exampleZh: "他们没有发挥出潜力。",
    senses: [
    {
    pos: "adj.", meaningZh: "潜在的；潜力；潜在的，可能的", meaningEn: "Existing in possibility, not in actuality.", collocations: ["great potential", "potential risk", "realise potential"], example: "Their potential is unrealized.", exampleZh: "他们没有发挥出潜力。" },
    {
    pos: "n.", meaningZh: "（事物的）潜力，可能性；（人的）潜能，潜力；电势，电位，电压", meaningEn: "Currently unrealized ability (with the most common adposition being to)", collocations: [], example: "The boy has great potential.", exampleZh: "这个男孩有很大的潜力。" }
    ]
  },
  {
    id: "ubiquitous", term: "ubiquitous", phonetic: "/juːˈbɪk.wə.təs/", pos: "adj.", meaningZh: "无处不在的；普遍存在的；普遍存在的，无所不在的", meaningEn: "Being everywhere at once: omnipresent.", band: "8", collocations: ["ubiquitous technology", "become ubiquitous", "ubiquitous presence"], example: "The ubiquitous BAM is starting a new trend and I am convinced that many will follow it.", exampleZh: "无处不在的 BAM 正在开始一种新趋势，我坚信许多人将追随这一趋势。",
    senses: [
    {
    pos: "adj.", meaningZh: "无处不在的；普遍存在的；普遍存在的，无所不在的", meaningEn: "Being everywhere at once: omnipresent.", collocations: ["ubiquitous technology", "become ubiquitous", "ubiquitous presence"], example: "The ubiquitous BAM is starting a new trend and I am convinced that many will follow it.", exampleZh: "无处不在的 BAM 正在开始一种新趋势，我坚信许多人将追随这一趋势。" }
    ]
  },
  {
    id: "corroborate", term: "corroborate", phonetic: "/kəˈɹɒbəɹeɪ̯t/", pos: "v.", meaningZh: "证实；佐证", meaningEn: "To confirm or support something with additional evidence; to attest or vouch for.", band: "8", collocations: ["corroborate the finding", "corroborate evidence", "corroborate a claim"], example: "Our findings corroborate the view that the lodicules of grasses are homologous to eudicot petals.", exampleZh: "本研究还证明了禾本科植物的浆片和双子叶植物中花瓣是同源器官的观点。",
    senses: [
    {
    pos: "v.", meaningZh: "证实；佐证", meaningEn: "To confirm or support something with additional evidence; to attest or vouch for.", collocations: ["corroborate the finding", "corroborate evidence", "corroborate a claim"], example: "Our findings corroborate the view that the lodicules of grasses are homologous to eudicot petals.", exampleZh: "本研究还证明了禾本科植物的浆片和双子叶植物中花瓣是同源器官的观点。" },
    {
    pos: "vt.", meaningZh: "证实；使坚固", meaningEn: "", collocations: [], example: "Your friend will corroborate this - ask them.", exampleZh: "问问你的朋友，他会向你证实这一点的。" }
    ]
  },
  {
    id: "delineate", term: "delineate", phonetic: "/dɪˈlɪniːeɪt/", pos: "v.", meaningZh: "描绘；明确界定；（详细地）描述，解释；标明，标示（边界）", meaningEn: "to describe or mark the edge of something clearly", band: "8", collocations: ["delineate the scope", "clearly delineate", "delineate boundaries"], example: "Many species have evolved clear signals to delineate playfulness.", exampleZh: "很多动物进化出了明确表述玩耍的信号。",
    senses: [
    {
    pos: "v.", meaningZh: "描绘；明确界定；（详细地）描述，解释；标明，标示（边界）", meaningEn: "to describe or mark the edge of something clearly", collocations: ["delineate the scope", "clearly delineate", "delineate boundaries"], example: "Many species have evolved clear signals to delineate playfulness.", exampleZh: "很多动物进化出了明确表述玩耍的信号。" },
    {
    pos: "vt.", meaningZh: "描绘...的轮廓；描绘；描写", meaningEn: "", collocations: [], example: "White lines delineate city limits.", exampleZh: "白线是城市边界。" }
    ]
  },
  {
    id: "ephemeral", term: "ephemeral", phonetic: "/əˈfɛ.mə.ɹəl/", pos: "adj.", meaningZh: "短暂的；转瞬即逝的；短暂的；（主指植物）短生的，短命的", meaningEn: "Lasting for a short period of time.", band: "8", collocations: ["ephemeral trend", "ephemeral nature", "ephemeral pleasure"], example: "He talked about the country's ephemeral unity being shattered by the defeat.", exampleZh: "他谈到战败彻底粉碎了国家的短暂统一。",
    senses: [
    {
    pos: "adj.", meaningZh: "短暂的；转瞬即逝的；短暂的；（主指植物）短生的，短命的", meaningEn: "Lasting for a short period of time.", collocations: ["ephemeral trend", "ephemeral nature", "ephemeral pleasure"], example: "He talked about the country's ephemeral unity being shattered by the defeat.", exampleZh: "他谈到战败彻底粉碎了国家的短暂统一。" },
    {
    pos: "n.", meaningZh: "只生存一天的事物；短生植物", meaningEn: "Something which lasts for a short period of time.", collocations: [], example: "RAM is this memory recall or, as you'll soon find in problems set one, that's used for ephemeral purposes.", exampleZh: "内存是随机存储器，你们很快就会在习题集一中发现，它是用来短暂存储的。" }
    ]
  },
  {
    id: "juxtapose", term: "juxtapose", phonetic: "/ˈd͡ʒʌkstəpəʊz/", pos: "v.", meaningZh: "并列；对比摆放", meaningEn: "To place side by side, especially for contrast or comparison.", band: "8", collocations: ["juxtapose ideas", "juxtapose with", "juxtapose images"], example: "The technique Mr. Wilson uses most often is to juxtapose things for dramatic effect.", exampleZh: "威尔逊先生最常用的技巧是把事物并列起来以获得戏剧性效果。",
    senses: [
    {
    pos: "v.", meaningZh: "并列；对比摆放", meaningEn: "To place side by side, especially for contrast or comparison.", collocations: ["juxtapose ideas", "juxtapose with", "juxtapose images"], example: "The technique Mr. Wilson uses most often is to juxtapose things for dramatic effect.", exampleZh: "威尔逊先生最常用的技巧是把事物并列起来以获得戏剧性效果。" },
    {
    pos: "vt.", meaningZh: "并列；并置", meaningEn: "", collocations: [], example: "He tried to juxtapose the photos of his girlfriend on the desk to show his love.", exampleZh: "他把女朋友的照片在桌上加以并列以表示他的爱。" }
    ]
  },
  {
    id: "mitigation", term: "mitigation", phonetic: "/ˌmɪtɪˈɡeɪʃn/", pos: "n.", meaningZh: "缓解；减轻；减轻，缓和；<法律>减轻罪行的辩护", meaningEn: "the action of reducing the severity of something", band: "8", collocations: ["risk mitigation", "climate mitigation", "mitigation measures"], example: "The developing countries also need to take due adaptation and mitigation actions in the context of sustainable development.", exampleZh: "发展中国家也需要在可持续发展的背景下采取适当的适应和减缓行动。",
    senses: [
    {
    pos: "n.", meaningZh: "缓解；减轻；减轻，缓和；<法律>减轻罪行的辩护", meaningEn: "the action of reducing the severity of something", collocations: ["risk mitigation", "climate mitigation", "mitigation measures"], example: "The developing countries also need to take due adaptation and mitigation actions in the context of sustainable development.", exampleZh: "发展中国家也需要在可持续发展的背景下采取适当的适应和减缓行动。" }
    ]
  },
  {
    id: "propensity", term: "propensity", phonetic: "/pɹəˈpɛnsɪti/", pos: "n.", meaningZh: "倾向；习性；<正式>倾向，习性", meaningEn: "An inclination, disposition, tendency, preference, or attraction.", band: "8", collocations: ["propensity for", "have a propensity", "propensity to"], example: "He showed a propensity for violence.", exampleZh: "他表现出暴力倾向。",
    senses: [
    {
    pos: "n.", meaningZh: "倾向；习性；<正式>倾向，习性", meaningEn: "An inclination, disposition, tendency, preference, or attraction.", collocations: ["propensity for", "have a propensity", "propensity to"], example: "He showed a propensity for violence.", exampleZh: "他表现出暴力倾向。" }
    ]
  },
  {
    id: "salient", term: "salient", phonetic: "/ˈseɪ.li.ənt/", pos: "adj.", meaningZh: "显著的；突出的；突出的，显著的；（角）凸出的；（纹章，动物）后腿站立前爪举起的", meaningEn: "Worthy of note; pertinent or relevant.", band: "8", collocations: ["salient feature", "salient point", "most salient"], example: "In many cases, goals have economic rewards that make them more salient or powerful.", exampleZh: "在很多情况下，目标有了经济回报，会变得更加显著或强大。",
    senses: [
    {
    pos: "adj.", meaningZh: "显著的；突出的；突出的，显著的；（角）凸出的；（纹章，动物）后腿站立前爪举起的", meaningEn: "Worthy of note; pertinent or relevant.", collocations: ["salient feature", "salient point", "most salient"], example: "In many cases, goals have economic rewards that make them more salient or powerful.", exampleZh: "在很多情况下，目标有了经济回报，会变得更加显著或强大。" },
    {
    pos: "n.", meaningZh: "（防御工事的）凸出部分", meaningEn: "An outwardly projecting part of a fortification, trench system, or line of defense.", collocations: [], example: "Economists label the problem \"present bias\": we are vulnerable to fast, salient stimulation.", exampleZh: "经济学家给这个问题贴上了“当前偏见”的标签：我们很容易受到快速、显著的刺激。" }
    ]
  },
  {
    id: "tenuous", term: "tenuous", phonetic: "/ˈtɛn.ju.əs/", pos: "adj.", meaningZh: "脆弱的；微弱的；纤细的；稀薄的；贫乏的", meaningEn: "weak and unlikely to last; very thin", band: "8", collocations: ["tenuous link", "tenuous connection", "tenuous argument"], example: "He did not speculate on the future of his tenuous career.", exampleZh: "他没有考虑到自己不稳定的职业前景。",
    senses: [
    {
    pos: "adj.", meaningZh: "脆弱的；微弱的；纤细的；稀薄的；贫乏的", meaningEn: "weak and unlikely to last; very thin", collocations: ["tenuous link", "tenuous connection", "tenuous argument"], example: "He did not speculate on the future of his tenuous career.", exampleZh: "他没有考虑到自己不稳定的职业前景。" }
    ]
  },
  {
    id: "unequivocal", term: "unequivocal", phonetic: "/ʌnɨˈkwɪvəkəl/", pos: "adj.", meaningZh: "明确的；毫不含糊的；明确的；不含糊的", meaningEn: "Unambiguous; without equivocation or ambiguity; singularly clear, unmistakable, or unquestionable", band: "8", collocations: ["unequivocal evidence", "unequivocal support", "unequivocal answer"], example: "The reply was an unequivocal 'no'.", exampleZh: "回答是个干脆利落的“不”字。",
    senses: [
    {
    pos: "adj.", meaningZh: "明确的；毫不含糊的；明确的；不含糊的", meaningEn: "Unambiguous; without equivocation or ambiguity; singularly clear, unmistakable, or unquestionable", collocations: ["unequivocal evidence", "unequivocal support", "unequivocal answer"], example: "The reply was an unequivocal 'no'.", exampleZh: "回答是个干脆利落的“不”字。" }
    ]
  },
  {
    id: "preclude", term: "preclude", phonetic: "/pɹiːˈkluːd/", pos: "v.", meaningZh: "排除；阻止；<正式>阻止，妨碍（preclude sb. from）", meaningEn: "Remove the possibility of; rule out; prevent or exclude; to make impossible.", band: "8", collocations: ["preclude the possibility", "preclude further action", "not preclude"], example: "That will preclude him from escaping.", exampleZh: "那将阻止他逃走，那将使他无法逃走。",
    senses: [
    {
    pos: "v.", meaningZh: "排除；阻止；<正式>阻止，妨碍（preclude sb. from）", meaningEn: "Remove the possibility of; rule out; prevent or exclude; to make impossible.", collocations: ["preclude the possibility", "preclude further action", "not preclude"], example: "That will preclude him from escaping.", exampleZh: "那将阻止他逃走，那将使他无法逃走。" },
    {
    pos: "vt.", meaningZh: "预先排除；预防；阻止；妨碍；预防；排除；消除", meaningEn: "", collocations: [], example: "Black holes are dense, but their event horizons preclude observations.", exampleZh: "黑洞密度足够高，但是他们的视界阻止了观察者。" }
    ]
  },
  {
    id: "manifest", term: "manifest", phonetic: "/ˈmæn.ə.fɛst/", pos: "v.", meaningZh: "显现；表明；显示，表明；（鬼魂或神灵）显灵，出现；（病症）显现；把……列入货单；显化（指通过可视化和积极思考来帮助梦想成真）", meaningEn: "To show plainly; to make to appear distinctly, usually to the mind; to put beyond question or doubt; to display; to exhibit.", band: "8", collocations: ["manifest itself", "manifest in", "clearly manifest"], example: "If you take a look at his biography, you can get a good idea of how his life experiences manifest themselves in his theories of beauty.", exampleZh: "如果你看一下他的传记，就可以知道他的人生经历是如何体现在他的美学理论中的。",
    senses: [
    {
    pos: "v.", meaningZh: "显现；表明；显示，表明；（鬼魂或神灵）显灵，出现；（病症）显现；把……列入货单；显化（指通过可视化和积极思考来帮助梦想成真）", meaningEn: "To show plainly; to make to appear distinctly, usually to the mind; to put beyond question or doubt; to display; to exhibit.", collocations: ["manifest itself", "manifest in", "clearly manifest"], example: "If you take a look at his biography, you can get a good idea of how his life experiences manifest themselves in his theories of beauty.", exampleZh: "如果你看一下他的传记，就可以知道他的人生经历是如何体现在他的美学理论中的。" },
    {
    pos: "adj.", meaningZh: "明显的，显而易见的", meaningEn: "Evident to the senses, especially to the sight; apparent; distinctly perceived.", collocations: [], example: "The virus needs two weeks to manifest itself.", exampleZh: "这种病毒需要两周才能发作。" },
    {
    pos: "n.", meaningZh: "旅客名单，载货清单；货运列车编组清单", meaningEn: "A list or invoice of the passengers or goods being carried by a commercial vehicle or ship.", collocations: [], example: "The anger he felt is manifest in his paintings.", exampleZh: "他的愤怒明显地表现在他的绘画之中。" },
    {
    pos: "vi.", meaningZh: "显示；出现", meaningEn: "", collocations: [], example: "...the manifest failure of the policies.", exampleZh: "…这些政策明显的失败。" },
    {
    pos: "vt.", meaningZh: "表明；表现；证明", meaningEn: "", collocations: [], example: "She manifestly failed to last the mile-and-a-half of the race.", exampleZh: "她显然没有跑完1.5英里的比赛。" }
    ]
  },
  {
    id: "proponent", term: "proponent", phonetic: "/pɹəˈpəʊnənt/", pos: "n.", meaningZh: "支持者；倡导者；<正式>支持者，建议者；提出认证遗嘱者", meaningEn: "One who supports something; an advocate", band: "8", collocations: ["strong proponent", "proponents of", "leading proponent"], example: "Halsey was identified as a leading proponent of the values of progressive education.", exampleZh: "哈尔西被认为是进步教育价值观的首要支持者。",
    senses: [
    {
    pos: "n.", meaningZh: "支持者；倡导者；<正式>支持者，建议者；提出认证遗嘱者", meaningEn: "One who supports something; an advocate", collocations: ["strong proponent", "proponents of", "leading proponent"], example: "Halsey was identified as a leading proponent of the values of progressive education.", exampleZh: "哈尔西被认为是进步教育价值观的首要支持者。" },
    {
    pos: "adj.", meaningZh: "", meaningEn: "Making proposals; proposing.", collocations: [], example: "The most influential proponent of the coastal migration route has been Canadian archaeologist Knut Fladmark.", exampleZh: "沿海移民路线最具影响力的支持者是加拿大考古学家克努特·弗拉德马克。" }
    ]
  },
  {
    id: "anomalous", term: "anomalous", phonetic: "/əˈnɒmələs/", pos: "adj.", meaningZh: "异常的；反常的；异常的；不规则的；不恰当的", meaningEn: "Deviating from the normal; marked by incongruity or contradiction; aberrant or abnormal.", band: "8", collocations: ["anomalous data", "anomalous result", "apparently anomalous"], example: "For years this anomalous behaviour has baffled scientists.", exampleZh: "多年来，这种反常的行为使科学家们感到困惑。",
    senses: [
    {
    pos: "adj.", meaningZh: "异常的；反常的；异常的；不规则的；不恰当的", meaningEn: "Deviating from the normal; marked by incongruity or contradiction; aberrant or abnormal.", collocations: ["anomalous data", "anomalous result", "apparently anomalous"], example: "For years this anomalous behaviour has baffled scientists.", exampleZh: "多年来，这种反常的行为使科学家们感到困惑。" }
    ]
  },
  {
    id: "austere", term: "austere", phonetic: "/ɒstɪə(ɹ)/", pos: "adj.", meaningZh: "朴素的；严厉的；朴实的，质朴的；（人）严肃的，严厉的；（生活）简朴的，苦行的；（开支）紧缩的，节制的", meaningEn: "Grim or severe in manner or appearance", band: "8", collocations: ["austere life", "austere style", "austere measures"], example: "The life of the troops was still comparatively austere.", exampleZh: "部队生活相对而言仍然简朴。",
    senses: [
    {
    pos: "adj.", meaningZh: "朴素的；严厉的；朴实的，质朴的；（人）严肃的，严厉的；（生活）简朴的，苦行的；（开支）紧缩的，节制的", meaningEn: "Grim or severe in manner or appearance", collocations: ["austere life", "austere style", "austere measures"], example: "The life of the troops was still comparatively austere.", exampleZh: "部队生活相对而言仍然简朴。" }
    ]
  },
  {
    id: "capitulate", term: "capitulate", phonetic: "/kəˈpɪtʃuleɪt/", pos: "v.", meaningZh: "屈服；投降", meaningEn: "to surrender", band: "8", collocations: ["capitulate to", "finally capitulate", "refuse to capitulate"], example: "The whole course of my life proves that I never capitulate.", exampleZh: "我的全部生活历程证明我是从来不曾投降过。",
    senses: [
    {
    pos: "v.", meaningZh: "屈服；投降", meaningEn: "to surrender", collocations: ["capitulate to", "finally capitulate", "refuse to capitulate"], example: "The whole course of my life proves that I never capitulate.", exampleZh: "我的全部生活历程证明我是从来不曾投降过。" },
    {
    pos: "vi.", meaningZh: "认输，屈服；屈从，停止反抗；有条件投降；让步", meaningEn: "", collocations: [], example: "Neither wants to appear to capitulate, given that both face significant internal challenges.", exampleZh: "考虑到双方都面对巨大的国内挑战，因此他们似乎将会屈服于舆论影响。" }
    ]
  },
  {
    id: "cogent", term: "cogent", phonetic: "/ˈkə͡ʊd͡ʒn̩t/", pos: "adj.", meaningZh: "有说服力的，令人信服的；清晰的，合乎逻辑的", meaningEn: "Reasonable and convincing; based on evidence.", band: "8", collocations: ["cogent argument", "cogent reason", "highly cogent"], example: "She put forward some cogent reasons for abandoning the plan.", exampleZh: "她为放弃这个计划提出了一些具有说服力的理由。",
    senses: [
    {
    pos: "adj.", meaningZh: "有说服力的，令人信服的；清晰的，合乎逻辑的", meaningEn: "Reasonable and convincing; based on evidence.", collocations: ["cogent argument", "cogent reason", "highly cogent"], example: "She put forward some cogent reasons for abandoning the plan.", exampleZh: "她为放弃这个计划提出了一些具有说服力的理由。" }
    ]
  },
  {
    id: "commensurate", term: "commensurate", phonetic: "/kəˈmɛnʃəɹət/", pos: "adj.", meaningZh: "相称的；相当的；相称的；同量的；同样大小的", meaningEn: "Of a proportionate or similar measurable standard.", band: "8", collocations: ["commensurate with", "commensurate pay", "not commensurate"], example: "Salary will be commensurate with experience.", exampleZh: "薪金将会与资历相称。",
    senses: [
    {
    pos: "adj.", meaningZh: "相称的；相当的；相称的；同量的；同样大小的", meaningEn: "Of a proportionate or similar measurable standard.", collocations: ["commensurate with", "commensurate pay", "not commensurate"], example: "Salary will be commensurate with experience.", exampleZh: "薪金将会与资历相称。" },
    {
    pos: "v.", meaningZh: "", meaningEn: "To reduce to a common measure.", collocations: [], example: "Employees are paid salaries commensurate with those of teachers.", exampleZh: "发给雇员的薪水与发给教师的薪水相当。" }
    ]
  },
  {
    id: "conducive", term: "conducive", phonetic: "/kənˈdjuːsɪv/", pos: "adj.", meaningZh: "有助于的；有益的；有助的，有益的", meaningEn: "Tending to contribute to, encourage, or bring about some result.", band: "8", collocations: ["conducive to", "conducive environment", "conducive atmosphere"], example: "In short, team spirit and effective communication are conducive to employee and business performance alike.", exampleZh: "总之，团队精神和有效的沟通有利于员工和企业的绩效。",
    senses: [
    {
    pos: "adj.", meaningZh: "有助于的；有益的；有助的，有益的", meaningEn: "Tending to contribute to, encourage, or bring about some result.", collocations: ["conducive to", "conducive environment", "conducive atmosphere"], example: "In short, team spirit and effective communication are conducive to employee and business performance alike.", exampleZh: "总之，团队精神和有效的沟通有利于员工和企业的绩效。" }
    ]
  },
  {
    id: "crystallize", term: "crystallize", phonetic: "/ˈkɹɪstəlaɪz/", pos: "v.", meaningZh: "使明确；结晶；（使）结晶；（使）明确化，（使）具体化；给（水果或花瓣）裹上糖霜；（财政）将浮动费用改为固定费用", meaningEn: "To make something form into crystals", band: "8", collocations: ["crystallize thinking", "crystallize into", "help crystallize"], example: "Don't stir or the sugar will crystallize.", exampleZh: "不要搅，否则糖会结晶的。",
    senses: [
    {
    pos: "v.", meaningZh: "使明确；结晶；（使）结晶；（使）明确化，（使）具体化；给（水果或花瓣）裹上糖霜；（财政）将浮动费用改为固定费用", meaningEn: "To make something form into crystals", collocations: ["crystallize thinking", "crystallize into", "help crystallize"], example: "Don't stir or the sugar will crystallize.", exampleZh: "不要搅，否则糖会结晶的。" },
    {
    pos: "vt.", meaningZh: "使结晶；使具体化", meaningEn: "", collocations: [], example: "Our ideas began to crystallize into a definite plan.", exampleZh: "我们的想法开始形成了一个明确的计划。" },
    {
    pos: "vi.", meaningZh: "结晶；具体化", meaningEn: "", collocations: [], example: "He has managed to crystallize the feelings of millions of ordinary Russians.", exampleZh: "他成功地阐明了数百万普通俄国人的感情。" }
    ]
  },
  {
    id: "elucidate", term: "elucidate", phonetic: "/əˈluː.sɪ.de͡ɪt/", pos: "v.", meaningZh: "阐明；解释；<正式>阐明，解释", meaningEn: "To make clear; to clarify; to shed light upon.", band: "8", collocations: ["elucidate a point", "elucidate the theory", "clearly elucidate"], example: "Let me elucidate.", exampleZh: "让我来说明一下吧。",
    senses: [
    {
    pos: "v.", meaningZh: "阐明；解释；<正式>阐明，解释", meaningEn: "To make clear; to clarify; to shed light upon.", collocations: ["elucidate a point", "elucidate the theory", "clearly elucidate"], example: "Let me elucidate.", exampleZh: "让我来说明一下吧。" },
    {
    pos: "vt.", meaningZh: "阐明；说明", meaningEn: "", collocations: [], example: "I will try to elucidate what I think the problems are.", exampleZh: "我将尽力阐明我认为问题的所在。" }
    ]
  },
  {
    id: "emanate", term: "emanate", phonetic: "/ˈɛm.ə.ˌneɪt/", pos: "v.", meaningZh: "散发；发源；产生；（抽象可感的东西）散发；表现出（品质）", meaningEn: "To come from a source; issue from.", band: "8", collocations: ["emanate from", "emanate a sense", "emanate warmth"], example: "These chemicals can emanate certain poisonous gases.", exampleZh: "这些化学药品会散发出某些有毒的气味。",
    senses: [
    {
    pos: "v.", meaningZh: "散发；发源；产生；（抽象可感的东西）散发；表现出（品质）", meaningEn: "To come from a source; issue from.", collocations: ["emanate from", "emanate a sense", "emanate warmth"], example: "These chemicals can emanate certain poisonous gases.", exampleZh: "这些化学药品会散发出某些有毒的气味。" },
    {
    pos: "vi.", meaningZh: "散发；发出；发源", meaningEn: "", collocations: [], example: "What rule, then, could emanate from that unreasonable order?", exampleZh: "那么，从这种不合理的秩序中显现出了什么准则呢？" }
    ]
  },
  {
    id: "engender", term: "engender", phonetic: "/ɛnˈdʒɛn.də/", pos: "v.", meaningZh: "产生；引起；产生，引起（某种感觉或情况）", meaningEn: "To beget (of a man); to bear or conceive (of a woman).", band: "8", collocations: ["engender trust", "engender debate", "engender support"], example: "Business and nonprofit leaders should be aware of dark patterns and try to avoid the gray areas they engender.", exampleZh: "企业和非营利组织的领导人们应该了解黑暗模式，并尽量避开它们所产生的灰色地带。",
    senses: [
    {
    pos: "v.", meaningZh: "产生；引起；产生，引起（某种感觉或情况）", meaningEn: "To beget (of a man); to bear or conceive (of a woman).", collocations: ["engender trust", "engender debate", "engender support"], example: "Business and nonprofit leaders should be aware of dark patterns and try to avoid the gray areas they engender.", exampleZh: "企业和非营利组织的领导人们应该了解黑暗模式，并尽量避开它们所产生的灰色地带。" },
    {
    pos: "vt.", meaningZh: "产生；引起", meaningEn: "", collocations: [], example: "It helps engender a sense of common humanity.", exampleZh: "它有助于引发一种共同的人道主义精神。" },
    {
    pos: "vi.", meaningZh: "发生；形成", meaningEn: "", collocations: [], example: "This will help engender good will in others.", exampleZh: "这将有助于激发他人的善意。" }
    ]
  },
  {
    id: "epitome", term: "epitome", phonetic: "/əˈpɪt.ə.mi/", pos: "n.", meaningZh: "典型；缩影；典型，缩影；摘要，概要", meaningEn: "The embodiment or encapsulation of a class of items.", band: "8", collocations: ["the epitome of", "epitome of style", "true epitome"], example: "Man is the world's epitome.", exampleZh: "人是世界的缩影。",
    senses: [
    {
    pos: "n.", meaningZh: "典型；缩影；典型，缩影；摘要，概要", meaningEn: "The embodiment or encapsulation of a class of items.", collocations: ["the epitome of", "epitome of style", "true epitome"], example: "Man is the world's epitome.", exampleZh: "人是世界的缩影。" }
    ]
  },
  {
    id: "immutable", term: "immutable", phonetic: "/ɪˈmjuːtəbl/", pos: "adj.", meaningZh: "永恒的，不可改变的", meaningEn: "Unable to be changed without exception.", band: "8", collocations: ["immutable law", "immutable fact", "immutable principle"], example: "This universal consistency among education experts indisputably demonstrates an immutable principle of learning: initiative and correct methods are fundamental to academic success.", exampleZh: "教育专家的这种普遍共识无可争辩地证明了一个不可改变的学习原则：主动性和正确的方法是学术上成功的基础。",
    senses: [
    {
    pos: "adj.", meaningZh: "永恒的，不可改变的", meaningEn: "Unable to be changed without exception.", collocations: ["immutable law", "immutable fact", "immutable principle"], example: "This universal consistency among education experts indisputably demonstrates an immutable principle of learning: initiative and correct methods are fundamental to academic success.", exampleZh: "教育专家的这种普遍共识无可争辩地证明了一个不可改变的学习原则：主动性和正确的方法是学术上成功的基础。" },
    {
    pos: "n.", meaningZh: "", meaningEn: "Something that cannot be changed", collocations: [], example: "Willpower isn't some immutable trait we're either born with or not.", exampleZh: "意志力不是我们与生俱来且不可改变的特质。" }
    ]
  },
  {
    id: "indispensable", term: "indispensable", phonetic: "/ɪndɪˈspɛnsəbəl/", pos: "adj.", meaningZh: "不可或缺的，必需的；不能撇开的，责无旁贷的", meaningEn: "Not admitting ecclesiastical dispensation; not subject to release or exemption; that cannot be allowed by bending the canonical rules.", band: "8", collocations: ["indispensable tool", "indispensable to", "become indispensable"], example: "She was becoming indispensable to him.", exampleZh: "对他来说她正变得不可或缺。",
    senses: [
    {
    pos: "adj.", meaningZh: "不可或缺的，必需的；不能撇开的，责无旁贷的", meaningEn: "Not admitting ecclesiastical dispensation; not subject to release or exemption; that cannot be allowed by bending the canonical rules.", collocations: ["indispensable tool", "indispensable to", "become indispensable"], example: "She was becoming indispensable to him.", exampleZh: "对他来说她正变得不可或缺。" },
    {
    pos: "n.", meaningZh: "不可缺少之物，必不可少的人", meaningEn: "A thing that is not dispensable; a necessity.", collocations: [], example: "She made herself indispensable to the department.", exampleZh: "她成为这个部门不可缺少的一分子。" }
    ]
  },
  {
    id: "inexorable", term: "inexorable", phonetic: "/ɪnˈeksərəbl/", pos: "adj.", meaningZh: "不可阻挡的；无情的；<正式>不可阻止的，难以阻挡的；（人）不为恳求所动的，无动于衷的", meaningEn: "impossible to stop", band: "8", collocations: ["inexorable rise", "inexorable decline", "inexorable progress"], example: "Although the same law holds for a living organism, the result of this law is not inexorable in the same way.", exampleZh: "尽管同样的法则也适用于生物体，但是在相同的方式下，这一法则的作用结果并不是无法改变。",
    senses: [
    {
    pos: "adj.", meaningZh: "不可阻挡的；无情的；<正式>不可阻止的，难以阻挡的；（人）不为恳求所动的，无动于衷的", meaningEn: "impossible to stop", collocations: ["inexorable rise", "inexorable decline", "inexorable progress"], example: "Although the same law holds for a living organism, the result of this law is not inexorable in the same way.", exampleZh: "尽管同样的法则也适用于生物体，但是在相同的方式下，这一法则的作用结果并不是无法改变。" }
    ]
  },
  {
    id: "innocuous", term: "innocuous", phonetic: "/ɪˈnɒkjuəs/", pos: "adj.", meaningZh: "无害的；无伤大雅的", meaningEn: "Harmless; producing no ill effect.", band: "8", collocations: ["innocuous comment", "apparently innocuous", "innocuous substance"], example: "Modern readers can, with some effort, discover that sixteenth-century teachers selected some seemingly dangerous classical texts while excluding other seemingly innocuous texts.", exampleZh: "现代读者通过一些努力可以发现，十六世纪的教师选择了一些看似危险的经典文本，而排除了其他看似无害的文本。",
    senses: [
    {
    pos: "adj.", meaningZh: "无害的；无伤大雅的", meaningEn: "Harmless; producing no ill effect.", collocations: ["innocuous comment", "apparently innocuous", "innocuous substance"], example: "Modern readers can, with some effort, discover that sixteenth-century teachers selected some seemingly dangerous classical texts while excluding other seemingly innocuous texts.", exampleZh: "现代读者通过一些努力可以发现，十六世纪的教师选择了一些看似危险的经典文本，而排除了其他看似无害的文本。" }
    ]
  },
  {
    id: "nuanced", term: "nuanced", phonetic: "/ˈnjuːɑːnst/", pos: "adj.", meaningZh: "细致入微的；有细微差别的；微妙的；具有细微差别的", meaningEn: "Having nuances; possessed of multiple layers of detail, pattern, or meaning", band: "8", collocations: ["nuanced view", "nuanced understanding", "highly nuanced"], example: "We are long past being surprised when complicated and nuanced problems are, amid an electoral whirlwind, turned into reductionist rallying cries.", exampleZh: "我们过去一直很惊讶，在选举旋风当中，简化论者会把所有复杂和琐碎的问题都会呼天抢地地吵闹一番。",
    senses: [
    {
    pos: "adj.", meaningZh: "细致入微的；有细微差别的；微妙的；具有细微差别的", meaningEn: "Having nuances; possessed of multiple layers of detail, pattern, or meaning", collocations: ["nuanced view", "nuanced understanding", "highly nuanced"], example: "We are long past being surprised when complicated and nuanced problems are, amid an electoral whirlwind, turned into reductionist rallying cries.", exampleZh: "我们过去一直很惊讶，在选举旋风当中，简化论者会把所有复杂和琐碎的问题都会呼天抢地地吵闹一番。" },
    {
    pos: "v.", meaningZh: "精确细腻地表演；细致入微地描绘（nuance 的过去分词）", meaningEn: "To apply a nuance to; to change or redefine in a subtle way.", collocations: [], example: "Mr Carroll takes a more nuanced view.", exampleZh: "卡罗尔先生对此从一个更微妙的角度来看。" }
    ]
  },
  {
    id: "pervasive", term: "pervasive", phonetic: "/pəˈveɪ.sɪv/", pos: "adj.", meaningZh: "遍布的；普遍的；弥漫的，遍布的", meaningEn: "Manifested throughout; pervading, permeating, penetrating or affecting everything.", band: "8", collocations: ["pervasive influence", "pervasive problem", "pervasive fear"], example: "The most pervasive problem is less obvious: our own behaviour.", exampleZh: "最普遍的问题不那么明显：即，我们自己的行为。",
    senses: [
    {
    pos: "adj.", meaningZh: "遍布的；普遍的；弥漫的，遍布的", meaningEn: "Manifested throughout; pervading, permeating, penetrating or affecting everything.", collocations: ["pervasive influence", "pervasive problem", "pervasive fear"], example: "The most pervasive problem is less obvious: our own behaviour.", exampleZh: "最普遍的问题不那么明显：即，我们自己的行为。" }
    ]
  },
  {
    id: "quintessential", term: "quintessential", phonetic: "/ˌkwɪnt.əˈsɛn.ʃəl/", pos: "adj.", meaningZh: "最典型的；精髓的；典型的，完美的；<正式>本质的，精髓的", meaningEn: "Of the nature of a quintessence (in all senses); ultimate.", band: "8", collocations: ["quintessential example", "quintessential British", "quintessential form"], example: "Clad in leather chaps, a denim shirt and a white rancher's hat, he looks the quintessential cowpoke.", exampleZh: "他身穿皮套裤和一件斜纹粗布衬衫，头戴一顶农场主的白帽，显出一副典型的牛仔模样。",
    senses: [
    {
    pos: "adj.", meaningZh: "最典型的；精髓的；典型的，完美的；<正式>本质的，精髓的", meaningEn: "Of the nature of a quintessence (in all senses); ultimate.", collocations: ["quintessential example", "quintessential British", "quintessential form"], example: "Clad in leather chaps, a denim shirt and a white rancher's hat, he looks the quintessential cowpoke.", exampleZh: "他身穿皮套裤和一件斜纹粗布衬衫，头戴一顶农场主的白帽，显出一副典型的牛仔模样。" }
    ]
  },
  {
    id: "reconcile", term: "reconcile", phonetic: "/ˈɹɛkənsaɪl/", pos: "v.", meaningZh: "调和；使和解；调和，使协调一致；（使）和解，（使）恢复友好关系；调停，调解（争吵）；使顺从于，使接受；核对，查核（账目）", meaningEn: "To restore a friendly relationship; to bring back to harmony.", band: "8", collocations: ["reconcile with", "reconcile differences", "reconcile the two"], example: "He could not reconcile himself to the prospect of losing her.", exampleZh: "他一想到有可能失去她，就觉得难以忍受。",
    senses: [
    {
    pos: "v.", meaningZh: "调和；使和解；调和，使协调一致；（使）和解，（使）恢复友好关系；调停，调解（争吵）；使顺从于，使接受；核对，查核（账目）", meaningEn: "To restore a friendly relationship; to bring back to harmony.", collocations: ["reconcile with", "reconcile differences", "reconcile the two"], example: "He could not reconcile himself to the prospect of losing her.", exampleZh: "他一想到有可能失去她，就觉得难以忍受。" },
    {
    pos: "vt.", meaningZh: "使和解；调停；使和谐；使一致；使听从；对帐；使一致", meaningEn: "", collocations: [], example: "It was hard to reconcile his career ambitions with the needs of his children.", exampleZh: "他很难兼顾事业上的抱负和孩子们的需要。" }
    ]
  },
  {
    id: "subtle", term: "subtle", phonetic: "/ˈsʌt(ə)l/", pos: "adj.", meaningZh: "微妙的；细微的；不易察觉的，微妙的；敏锐的，有洞察力的；灵活的，巧妙的；含蓄的，隐晦的；<古>狡猾的", meaningEn: "Hard to grasp; not obvious or easily understood; barely noticeable.", band: "8", collocations: ["subtle difference", "subtle change", "subtle hint"], example: "But TV images require subtle gradations of light and shade.", exampleZh: "但是电视影像需要有细微的光影变化。",
    senses: [
    {
    pos: "adj.", meaningZh: "微妙的；细微的；不易察觉的，微妙的；敏锐的，有洞察力的；灵活的，巧妙的；含蓄的，隐晦的；<古>狡猾的", meaningEn: "Hard to grasp; not obvious or easily understood; barely noticeable.", collocations: ["subtle difference", "subtle change", "subtle hint"], example: "But TV images require subtle gradations of light and shade.", exampleZh: "但是电视影像需要有细微的光影变化。" }
    ]
  },
  {
    id: "unprecedented", term: "unprecedented", phonetic: "/ʌnˈpɹɛsɪdɛntɪd/", pos: "adj.", meaningZh: "前所未有的，史无前例的；（大小、数量、程度等）前所未知的，空前的", meaningEn: "Never before seen, done, or experienced; without precedent.", band: "8", collocations: ["unprecedented scale", "unprecedented growth", "unprecedented level"], example: "The mission has been hailed as an unprecedented success.", exampleZh: "这次使命已被宣布为一次空前的成功。",
    senses: [
    {
    pos: "adj.", meaningZh: "前所未有的，史无前例的；（大小、数量、程度等）前所未知的，空前的", meaningEn: "Never before seen, done, or experienced; without precedent.", collocations: ["unprecedented scale", "unprecedented growth", "unprecedented level"], example: "The mission has been hailed as an unprecedented success.", exampleZh: "这次使命已被宣布为一次空前的成功。" }
    ]
  },
  {
    id: "stringent", term: "stringent", phonetic: "/ˈstrɪndʒənt/", pos: "adj.", meaningZh: "严格的；严厉的；（规定或条件）严格的；紧缩的，银根紧的", meaningEn: "Strict; binding strongly; making strict requirements; restrictive; rigid; severe", band: "8", collocations: ["stringent rules", "stringent standards", "stringent controls"], example: "He announced that there would be more stringent controls on the possession of weapons.", exampleZh: "他宣布在武器的持有方面将会有更严格的控制。",
    senses: [
    {
    pos: "adj.", meaningZh: "严格的；严厉的；（规定或条件）严格的；紧缩的，银根紧的", meaningEn: "Strict; binding strongly; making strict requirements; restrictive; rigid; severe", collocations: ["stringent rules", "stringent standards", "stringent controls"], example: "He announced that there would be more stringent controls on the possession of weapons.", exampleZh: "他宣布在武器的持有方面将会有更严格的控制。" }
    ]
  },
  {
    id: "vindicate", term: "vindicate", phonetic: "/ˈvɪndɪkeɪt/", pos: "v.", meaningZh: "证明正确；为…辩护", meaningEn: "To clear of an accusation, suspicion or criticism.", band: "8", collocations: ["vindicate a claim", "vindicate the theory", "fully vindicate"], example: "He tried hard to vindicate his honor.", exampleZh: "他拼命维护自己的名誉。",
    senses: [
    {
    pos: "v.", meaningZh: "证明正确；为…辩护", meaningEn: "To clear of an accusation, suspicion or criticism.", collocations: ["vindicate a claim", "vindicate the theory", "fully vindicate"], example: "He tried hard to vindicate his honor.", exampleZh: "他拼命维护自己的名誉。" },
    {
    pos: "vt.", meaningZh: "维护；证明……无辜；证明……正确", meaningEn: "", collocations: [], example: "The 2010 harvest did not seem to vindicate his judgment.", exampleZh: "但2010年的收成却似乎不能佐证其判断。" }
    ]
  }
];

export const SEED_WORDS: VocabEntry[] = [...SEED_CORE, ...SEED_BULK];

/**
 * 种子版本号。每当内置词表内容（释义/词性/例句）更新时，改这个值即可触发
 * 用户本地库的「一次性的内置词刷新」——把早期版本里残缺（仅有中文释义）的种子词
 * 用最新富文本覆盖更新，且不影响用户导入的词与 FSRS 学习进度。
 */
export const SEED_VERSION = '2026-07-18-youdao-ec-bilingual';
