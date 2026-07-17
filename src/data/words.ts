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
    id: "analyse", term: "analyse", phonetic: "/ˈænəlaɪz/", pos: "v.", meaningZh: "分析", meaningEn: "to examine something in detail", band: "5", collocations: ["analyse data", "analyse the cause", "closely analyse"], example: "We need to analyse the results carefully before drawing a conclusion.", exampleZh: "我们需要仔细分析结果，再下结论。",
    senses: [
    {
    pos: "v.", meaningZh: "分析", meaningEn: "to examine something in detail", collocations: ["analyse data", "analyse the cause", "closely analyse"], example: "We need to analyse the results carefully before drawing a conclusion.", exampleZh: "我们需要仔细分析结果，再下结论。" },
    {
    pos: "vt.", meaningZh: "分析；细察；分解", meaningEn: "", collocations: [], example: "", exampleZh: "" }
    ]
  },
  {
    id: "benefit", term: "benefit", phonetic: "/ˈbɛn.ɪ.fɪt/", pos: "n. / v.", meaningZh: "益处；受益；利益", meaningEn: "an advantage or profit", band: "5", collocations: ["bring benefit", "benefit from", "mutual benefit"], example: "The new policy will benefit local communities.", exampleZh: "新政策将使当地社区受益。",
    senses: [
    {
    pos: "n. / v.", meaningZh: "益处；受益；利益", meaningEn: "an advantage or profit", collocations: ["bring benefit", "benefit from", "mutual benefit"], example: "The new policy will benefit local communities.", exampleZh: "新政策将使当地社区受益。" },
    {
    pos: "v.", meaningZh: "成为或向提供利益。", meaningEn: "To be or to provide a benefit to.", collocations: [], example: "", exampleZh: "" },
    {
    pos: "vt.", meaningZh: "有益于", meaningEn: "", collocations: [], example: "", exampleZh: "" },
    {
    pos: "vi.", meaningZh: "受益", meaningEn: "", collocations: [], example: "", exampleZh: "" }
    ]
  },
  {
    id: "environment", term: "environment", phonetic: "/-mɪnt/", pos: "n.", meaningZh: "环境；外界；围绕", meaningEn: "the natural world or surroundings", band: "5", collocations: ["protect the environment", "natural environment", "living environment"], example: "We must protect the natural environment for future generations.", exampleZh: "我们必须为子孙后代保护自然环境。",
    senses: [
    {
    pos: "n.", meaningZh: "环境；外界；围绕", meaningEn: "the natural world or surroundings", collocations: ["protect the environment", "natural environment", "living environment"], example: "We must protect the natural environment for future generations.", exampleZh: "我们必须为子孙后代保护自然环境。" }
    ]
  },
  {
    id: "increase", term: "increase", phonetic: "/ɪnˈkriːs/", pos: "v.", meaningZh: "增加", meaningEn: "to become or make larger", band: "5", collocations: ["increase rapidly", "a sharp increase", "steady increase"], example: "The population has increased significantly over the last decade.", exampleZh: "过去十年人口显著增长。",
    senses: [
    {
    pos: "v.", meaningZh: "增加", meaningEn: "to become or make larger", collocations: ["increase rapidly", "a sharp increase", "steady increase"], example: "The population has increased significantly over the last decade.", exampleZh: "过去十年人口显著增长。" },
    {
    pos: "n.", meaningZh: "增加；增进；利益", meaningEn: "An amount by which a quantity is increased.", collocations: [], example: "", exampleZh: "" },
    {
    pos: "vt.", meaningZh: "增加；加大", meaningEn: "", collocations: [], example: "", exampleZh: "" },
    {
    pos: "vi.", meaningZh: "增加；繁殖", meaningEn: "", collocations: [], example: "", exampleZh: "" }
    ]
  },
  {
    id: "policy", term: "policy", phonetic: "/ˈpɒləsi/", pos: "n.", meaningZh: "政策；方针；策略；保险单；凭单", meaningEn: "a course of action adopted by a government", band: "5", collocations: ["government policy", "education policy", "public policy"], example: "The government announced a new education policy.", exampleZh: "政府宣布了一项新的教育政策。",
    senses: [
    {
    pos: "n.", meaningZh: "政策；方针；策略；保险单；凭单", meaningEn: "a course of action adopted by a government", collocations: ["government policy", "education policy", "public policy"], example: "The government announced a new education policy.", exampleZh: "政府宣布了一项新的教育政策。" },
    {
    pos: "v.", meaningZh: "受法律管制；服从秩序。", meaningEn: "To regulate by laws; to reduce to order.", collocations: [], example: "", exampleZh: "" }
    ]
  },
  {
    id: "require", term: "require", phonetic: "/ɹɪˈkwaɪə/", pos: "v.", meaningZh: "需要", meaningEn: "to need or depend on", band: "5", collocations: ["require attention", "be required to", "require effort"], example: "The task requires careful planning and teamwork.", exampleZh: "这项任务需要周密的计划与团队协作。",
    senses: [
    {
    pos: "v.", meaningZh: "需要", meaningEn: "to need or depend on", collocations: ["require attention", "be required to", "require effort"], example: "The task requires careful planning and teamwork.", exampleZh: "这项任务需要周密的计划与团队协作。" },
    {
    pos: "vt.", meaningZh: "需要；命令；要求；需要；要求；命令", meaningEn: "", collocations: [], example: "", exampleZh: "" }
    ]
  },
  {
    id: "significant", term: "significant", phonetic: "/sɪɡˈnɪ.fɪ.kənt/", pos: "adj.", meaningZh: "重要的；显著的；有效的；有含义的；暗示的；值得注意的", meaningEn: "large or important enough to have an effect", band: "5", collocations: ["significant change", "significant impact", "statistically significant"], example: "There has been a significant improvement in student performance.", exampleZh: "学生成绩有了显著提升。",
    senses: [
    {
    pos: "adj.", meaningZh: "重要的；显著的；有效的；有含义的；暗示的；值得注意的", meaningEn: "large or important enough to have an effect", collocations: ["significant change", "significant impact", "statistically significant"], example: "There has been a significant improvement in student performance.", exampleZh: "学生成绩有了显著提升。" },
    {
    pos: "n.", meaningZh: "有意义的东西；一个标志；一个象征；一个象征。", meaningEn: "That which has significance; a sign; a token; a symbol.", collocations: [], example: "", exampleZh: "" }
    ]
  },
  {
    id: "society", term: "society", phonetic: "/səˈsaɪ.ə.ti/", pos: "n.", meaningZh: "社会；社交界；交往；社团", meaningEn: "the people in a country or community as a whole", band: "5", collocations: ["modern society", "civil society", "society as a whole"], example: "Education plays a key role in building a healthy society.", exampleZh: "教育在建设健康社会中起着关键作用。",
    senses: [
    {
    pos: "n.", meaningZh: "社会；社交界；交往；社团", meaningEn: "the people in a country or community as a whole", collocations: ["modern society", "civil society", "society as a whole"], example: "Education plays a key role in building a healthy society.", exampleZh: "教育在建设健康社会中起着关键作用。" }
    ]
  },
  {
    id: "technology", term: "technology", phonetic: "/tɛkˈnɒlədʒi/", pos: "n.", meaningZh: "技术；科技；工业技术；术语；技术学；工艺学", meaningEn: "the application of scientific knowledge for practical purposes", band: "5", collocations: ["advanced technology", "information technology", "technology development"], example: "New technology has transformed the way we communicate.", exampleZh: "新技术改变了我们的沟通方式。",
    senses: [
    {
    pos: "n.", meaningZh: "技术；科技；工业技术；术语；技术学；工艺学", meaningEn: "the application of scientific knowledge for practical purposes", collocations: ["advanced technology", "information technology", "technology development"], example: "New technology has transformed the way we communicate.", exampleZh: "新技术改变了我们的沟通方式。" }
    ]
  },
  {
    id: "available", term: "available", phonetic: "/əˈveɪləb(ə)l/", pos: "adj.", meaningZh: "可获得的；可用的；可利用的；有效的；可得的", meaningEn: "able to be obtained or used", band: "5", collocations: ["readily available", "make available", "available to"], example: "The data is freely available to all researchers.", exampleZh: "这些数据对所有研究人员免费开放。",
    senses: [
    {
    pos: "adj.", meaningZh: "可获得的；可用的；可利用的；有效的；可得的", meaningEn: "able to be obtained or used", collocations: ["readily available", "make available", "available to"], example: "The data is freely available to all researchers.", exampleZh: "这些数据对所有研究人员免费开放。" }
    ]
  },
  {
    id: "develop", term: "develop", phonetic: "/dɛˈvɛ.ləp/", pos: "v.", meaningZh: "发展；开发", meaningEn: "to grow or cause something to grow gradually", band: "5", collocations: ["develop skills", "develop a habit", "develop rapidly"], example: "Children develop language skills at different rates.", exampleZh: "儿童语言能力的发展速度各不相同。",
    senses: [
    {
    pos: "v.", meaningZh: "发展；开发", meaningEn: "to grow or cause something to grow gradually", collocations: ["develop skills", "develop a habit", "develop rapidly"], example: "Children develop language skills at different rates.", exampleZh: "儿童语言能力的发展速度各不相同。" },
    {
    pos: "vt.", meaningZh: "发展；使发达；进步；洗印；显影", meaningEn: "", collocations: [], example: "", exampleZh: "" },
    {
    pos: "vi.", meaningZh: "发展；生长", meaningEn: "", collocations: [], example: "", exampleZh: "" }
    ]
  },
  {
    id: "provide", term: "provide", phonetic: "/pɹəˈvaɪd/", pos: "v.", meaningZh: "提供", meaningEn: "to supply or make something available", band: "5", collocations: ["provide support", "provide evidence", "provide access"], example: "The app provides instant feedback on pronunciation.", exampleZh: "这款应用能即时反馈发音情况。",
    senses: [
    {
    pos: "v.", meaningZh: "提供", meaningEn: "to supply or make something available", collocations: ["provide support", "provide evidence", "provide access"], example: "The app provides instant feedback on pronunciation.", exampleZh: "这款应用能即时反馈发音情况。" },
    {
    pos: "vt.", meaningZh: "提供；供应；规定；预备", meaningEn: "", collocations: [], example: "", exampleZh: "" },
    {
    pos: "vi.", meaningZh: "作准备；抚养；规定", meaningEn: "", collocations: [], example: "", exampleZh: "" }
    ]
  },
  {
    id: "research", term: "research", phonetic: "/ɹɪˈsɜːtʃ/", pos: "n. / v.", meaningZh: "研究；调查；考察", meaningEn: "a careful study to discover new information", band: "5", collocations: ["conduct research", "research shows", "scientific research"], example: "Recent research shows a link between sleep and memory.", exampleZh: "近期研究表明睡眠与记忆之间存在关联。",
    senses: [
    {
    pos: "n. / v.", meaningZh: "研究；调查；考察", meaningEn: "a careful study to discover new information", collocations: ["conduct research", "research shows", "scientific research"], example: "Recent research shows a link between sleep and memory.", exampleZh: "近期研究表明睡眠与记忆之间存在关联。" },
    {
    pos: "v.", meaningZh: "持续仔细地搜索或检查；勤奋地寻找。", meaningEn: "To search or examine with continued care; to seek diligently.", collocations: [], example: "", exampleZh: "" },
    {
    pos: "vi.", meaningZh: "研究；调查", meaningEn: "", collocations: [], example: "", exampleZh: "" }
    ]
  },
  {
    id: "similar", term: "similar", phonetic: "/ˈsɪmələ/", pos: "adj.", meaningZh: "相似的；类似的", meaningEn: "like someone or something else", band: "5", collocations: ["similar to", "be similar", "strikingly similar"], example: "The two languages have a similar grammatical structure.", exampleZh: "这两种语言有着相似的语法结构。",
    senses: [
    {
    pos: "adj.", meaningZh: "相似的；类似的", meaningEn: "like someone or something else", collocations: ["similar to", "be similar", "strikingly similar"], example: "The two languages have a similar grammatical structure.", exampleZh: "这两种语言有着相似的语法结构。" },
    {
    pos: "n.", meaningZh: "相似的东西", meaningEn: "That which is similar to, or resembles, something else, as in quality, form, etc.", collocations: [], example: "", exampleZh: "" }
    ]
  },
  {
    id: "education", term: "education", phonetic: "/ˌɛdjʊˈkeɪʃn̩/", pos: "n.", meaningZh: "教育；训练；教育学", meaningEn: "the process of teaching and learning", band: "5", collocations: ["quality education", "access to education", "education system"], example: "Education is essential for personal and social development.", exampleZh: "教育对个人与社会发展至关重要。",
    senses: [
    {
    pos: "n.", meaningZh: "教育；训练；教育学", meaningEn: "the process of teaching and learning", collocations: ["quality education", "access to education", "education system"], example: "Education is essential for personal and social development.", exampleZh: "教育对个人与社会发展至关重要。" }
    ]
  },
  {
    id: "government", term: "government", phonetic: "/ˈɡʌvə(n)mənt/", pos: "n.", meaningZh: "政府；内阁；政治；政体", meaningEn: "the group that governs a country", band: "5", collocations: ["government policy", "local government", "the government announced"], example: "The government has invested heavily in public transport.", exampleZh: "政府大力投资公共交通。",
    senses: [
    {
    pos: "n.", meaningZh: "政府；内阁；政治；政体", meaningEn: "the group that governs a country", collocations: ["government policy", "local government", "the government announced"], example: "The government has invested heavily in public transport.", exampleZh: "政府大力投资公共交通。" }
    ]
  },
  {
    id: "economy", term: "economy", phonetic: "/iːˈkɒn.ə.mi/", pos: "n.", meaningZh: "经济；理财；节约；整体", meaningEn: "the system of producing and consuming goods", band: "5", collocations: ["national economy", "the global economy", "boost the economy"], example: "Tourism plays a vital role in the local economy.", exampleZh: "旅游业对当地经济起着至关重要的作用。",
    senses: [
    {
    pos: "n.", meaningZh: "经济；理财；节约；整体", meaningEn: "the system of producing and consuming goods", collocations: ["national economy", "the global economy", "boost the economy"], example: "Tourism plays a vital role in the local economy.", exampleZh: "旅游业对当地经济起着至关重要的作用。" }
    ]
  },
  {
    id: "population", term: "population", phonetic: "/ˌpɒpjʊˈleɪʃən/", pos: "n.", meaningZh: "人口；人口数；群体；总体", meaningEn: "the number of people in a place", band: "5", collocations: ["population growth", "a growing population", "urban population"], example: "The population of the city has doubled in thirty years.", exampleZh: "该市人口在三十年内翻了一番。",
    senses: [
    {
    pos: "n.", meaningZh: "人口；人口数；群体；总体", meaningEn: "the number of people in a place", collocations: ["population growth", "a growing population", "urban population"], example: "The population of the city has doubled in thirty years.", exampleZh: "该市人口在三十年内翻了一番。" }
    ]
  },
  {
    id: "pollution", term: "pollution", phonetic: "/pəˈl(j)uːʃn̩/", pos: "n.", meaningZh: "污染；玷污", meaningEn: "harm to the environment by waste", band: "5", collocations: ["air pollution", "reduce pollution", "water pollution"], example: "Air pollution remains a serious problem in many cities.", exampleZh: "空气污染仍是许多城市的严重问题。",
    senses: [
    {
    pos: "n.", meaningZh: "污染；玷污", meaningEn: "harm to the environment by waste", collocations: ["air pollution", "reduce pollution", "water pollution"], example: "Air pollution remains a serious problem in many cities.", exampleZh: "空气污染仍是许多城市的严重问题。" }
    ]
  },
  {
    id: "transport", term: "transport", phonetic: "/ˈtrænspɔːt/", pos: "n.", meaningZh: "交通；运输；运输工具；激动；狂喜；流放犯", meaningEn: "a system for moving people or goods", band: "5", collocations: ["public transport", "transport system", "mass transport"], example: "Reliable public transport reduces traffic congestion.", exampleZh: "可靠的公共交通能缓解交通拥堵。",
    senses: [
    {
    pos: "n.", meaningZh: "交通；运输；运输工具；激动；狂喜；流放犯", meaningEn: "a system for moving people or goods", collocations: ["public transport", "transport system", "mass transport"], example: "Reliable public transport reduces traffic congestion.", exampleZh: "可靠的公共交通能缓解交通拥堵。" },
    {
    pos: "v.", meaningZh: "从一个地方搬运或承载到另一个地方；移除；传送。", meaningEn: "To carry or bear from one place to another; to remove; to convey.", collocations: [], example: "to transport goods; to transport troops", exampleZh: "" },
    {
    pos: "vt.", meaningZh: "传送；运输；流放", meaningEn: "", collocations: [], example: "", exampleZh: "" }
    ]
  },
  {
    id: "health", term: "health", phonetic: "/hɛlθ/", pos: "n.", meaningZh: "健康；卫生；蓬勃；健康状态", meaningEn: "the state of being well", band: "5", collocations: ["public health", "mental health", "health care"], example: "Regular exercise is important for maintaining good health.", exampleZh: "规律运动对保持良好健康很重要。",
    senses: [
    {
    pos: "n.", meaningZh: "健康；卫生；蓬勃；健康状态", meaningEn: "the state of being well", collocations: ["public health", "mental health", "health care"], example: "Regular exercise is important for maintaining good health.", exampleZh: "规律运动对保持良好健康很重要。" }
    ]
  },
  {
    id: "culture", term: "culture", phonetic: "/ˈkʌlt͡ʃə/", pos: "n.", meaningZh: "文化；修养；耕种", meaningEn: "the arts and customs of a society", band: "5", collocations: ["local culture", "popular culture", "cultural exchange"], example: "Festivals are an important part of our culture.", exampleZh: "节日是我们文化中重要的一部分。",
    senses: [
    {
    pos: "n.", meaningZh: "文化；修养；耕种", meaningEn: "the arts and customs of a society", collocations: ["local culture", "popular culture", "cultural exchange"], example: "Festivals are an important part of our culture.", exampleZh: "节日是我们文化中重要的一部分。" },
    {
    pos: "v.", meaningZh: "保持在适合生长的环境中（特别是细菌） （比较培养）", meaningEn: "To maintain in an environment suitable for growth (especially of bacteria) (compare cultivate)", collocations: [], example: "", exampleZh: "" },
    {
    pos: "vt.", meaningZh: "耕种；培养", meaningEn: "", collocations: [], example: "", exampleZh: "" }
    ]
  },
  {
    id: "system", term: "system", phonetic: "/ˈsɪstəm/", pos: "n.", meaningZh: "系统；制度；体系；方式；秩序；分类原则；体制", meaningEn: "a set of connected parts forming a whole", band: "5", collocations: ["education system", "transport system", "legal system"], example: "The new legal system aims to be fairer and faster.", exampleZh: "新法律体系旨在更公正、更高效。",
    senses: [
    {
    pos: "n.", meaningZh: "系统；制度；体系；方式；秩序；分类原则；体制", meaningEn: "a set of connected parts forming a whole", collocations: ["education system", "transport system", "legal system"], example: "The new legal system aims to be fairer and faster.", exampleZh: "新法律体系旨在更公正、更高效。" }
    ]
  },
  {
    id: "problem", term: "problem", phonetic: "/ˈpɹɒbləm/", pos: "n.", meaningZh: "问题；难题", meaningEn: "a difficult situation to solve", band: "5", collocations: ["solve a problem", "a major problem", "social problem"], example: "We need to address the problem of youth unemployment.", exampleZh: "我们需要解决青年失业问题。",
    senses: [
    {
    pos: "n.", meaningZh: "问题；难题", meaningEn: "a difficult situation to solve", collocations: ["solve a problem", "a major problem", "social problem"], example: "We need to address the problem of youth unemployment.", exampleZh: "我们需要解决青年失业问题。" },
    {
    pos: "adj.", meaningZh: "成问题的；难处理的", meaningEn: "(of a person or an animal) Difficult to train or guide; unruly.", collocations: [], example: "", exampleZh: "" }
    ]
  },
  {
    id: "solution", term: "solution", phonetic: "/səˈl(j)uːʃən/", pos: "n.", meaningZh: "解决办法；解答；溶液", meaningEn: "a way to solve a problem", band: "5", collocations: ["find a solution", "a practical solution", "solution to"], example: "There is no simple solution to this issue.", exampleZh: "这个问题没有简单的解决办法。",
    senses: [
    {
    pos: "n.", meaningZh: "解决办法；解答；溶液", meaningEn: "a way to solve a problem", collocations: ["find a solution", "a practical solution", "solution to"], example: "There is no simple solution to this issue.", exampleZh: "这个问题没有简单的解决办法。" },
    {
    pos: "v.", meaningZh: "用溶液治疗。", meaningEn: "To treat with a solution.", collocations: [], example: "", exampleZh: "" }
    ]
  },
  {
    id: "process", term: "process", phonetic: "/ˈpɹoʊsɛs/", pos: "n.", meaningZh: "过程；步骤；程序；进行", meaningEn: "a series of actions to achieve a result", band: "5", collocations: ["learning process", "the process of", "a long process"], example: "Learning a language is a gradual process.", exampleZh: "学习语言是一个渐进的过程。",
    senses: [
    {
    pos: "n.", meaningZh: "过程；步骤；程序；进行", meaningEn: "a series of actions to achieve a result", collocations: ["learning process", "the process of", "a long process"], example: "Learning a language is a gradual process.", exampleZh: "学习语言是一个渐进的过程。" },
    {
    pos: "v.", meaningZh: "对事物执行特定的过程。", meaningEn: "To perform a particular process on a thing.", collocations: [], example: "", exampleZh: "" },
    {
    pos: "vt.", meaningZh: "加工；使...接受处理；对...处置；对...起诉", meaningEn: "", collocations: [], example: "", exampleZh: "" },
    {
    pos: "adj.", meaningZh: "经加工的；有特殊光效的；进程", meaningEn: "", collocations: [], example: "", exampleZh: "" }
    ]
  },
  {
    id: "method", term: "method", phonetic: "/ˈmɛθəd/", pos: "n.", meaningZh: "方法；办法；条理；秩序", meaningEn: "a planned way of doing something", band: "5", collocations: ["teaching method", "a new method", "effective method"], example: "This method has proved effective in classrooms.", exampleZh: "这种方法在课堂上已被证明有效。",
    senses: [
    {
    pos: "n.", meaningZh: "方法；办法；条理；秩序", meaningEn: "a planned way of doing something", collocations: ["teaching method", "a new method", "effective method"], example: "This method has proved effective in classrooms.", exampleZh: "这种方法在课堂上已被证明有效。" },
    {
    pos: "v.", meaningZh: "应用方法的步骤", meaningEn: "To apply a method", collocations: [], example: "", exampleZh: "" }
    ]
  },
  {
    id: "result", term: "result", phonetic: "/ɹɪˈzʌlt/", pos: "n.", meaningZh: "结果；成绩；答案", meaningEn: "what happens because of something", band: "5", collocations: ["positive result", "the result of", "produce a result"], example: "Hard work usually leads to good results.", exampleZh: "努力通常带来好结果。",
    senses: [
    {
    pos: "n.", meaningZh: "结果；成绩；答案", meaningEn: "what happens because of something", collocations: ["positive result", "the result of", "produce a result"], example: "Hard work usually leads to good results.", exampleZh: "努力通常带来好结果。" },
    {
    pos: "v.", meaningZh: "因此，要从事实、论点、前提、情况组合、咨询、思考或努力中进行。", meaningEn: "To proceed, spring up or rise, as a consequence, from facts, arguments, premises, combination of circumstances, consultation, thought or endeavor.", collocations: [], example: "", exampleZh: "" },
    {
    pos: "int.", meaningZh: "在一个有利的结果之后，喜悦的感叹。", meaningEn: "An exclamation of joy following a favorable outcome.", collocations: [], example: "", exampleZh: "" },
    {
    pos: "vi.", meaningZh: "产生；结果；致使", meaningEn: "", collocations: [], example: "", exampleZh: "" }
    ]
  },
  {
    id: "reason", term: "reason", phonetic: "/ˈɹiːzən/", pos: "n.", meaningZh: "原因；理由；理智；道理；前提；理性", meaningEn: "a cause or explanation", band: "5", collocations: ["for this reason", "main reason", "good reason"], example: "The main reason for the delay was bad weather.", exampleZh: "延误的主要原因是恶劣天气。",
    senses: [
    {
    pos: "n.", meaningZh: "原因；理由；理智；道理；前提；理性", meaningEn: "a cause or explanation", collocations: ["for this reason", "main reason", "good reason"], example: "The main reason for the delay was bad weather.", exampleZh: "延误的主要原因是恶劣天气。" },
    {
    pos: "v.", meaningZh: "通过理性来推断或得出结论", meaningEn: "To deduce or come to a conclusion by being rational", collocations: [], example: "", exampleZh: "" },
    {
    pos: "vt.", meaningZh: "说服；推论；辩论", meaningEn: "", collocations: [], example: "", exampleZh: "" },
    {
    pos: "vi.", meaningZh: "推论；劝说；思考", meaningEn: "", collocations: [], example: "", exampleZh: "" }
    ]
  },
  {
    id: "cause", term: "cause", phonetic: "/kɔːz/", pos: "n. / v.", meaningZh: "原因；导致；目标", meaningEn: "a reason something happens; to make happen", band: "5", collocations: ["cause problems", "root cause", "cause damage"], example: "Smoking can cause serious health problems.", exampleZh: "吸烟会导致严重的健康问题。",
    senses: [
    {
    pos: "n. / v.", meaningZh: "原因；导致；目标", meaningEn: "a reason something happens; to make happen", collocations: ["cause problems", "root cause", "cause damage"], example: "Smoking can cause serious health problems.", exampleZh: "吸烟会导致严重的健康问题。" },
    {
    pos: "v.", meaningZh: "引发事件或动作。", meaningEn: "To set off an event or action.", collocations: [], example: "The lightning caused thunder.", exampleZh: "" },
    {
    pos: "vt.", meaningZh: "引起；使产生；使遭受", meaningEn: "", collocations: [], example: "", exampleZh: "" }
    ]
  },
  {
    id: "effect", term: "effect", phonetic: "/ɪˈfɛkt/", pos: "n.", meaningZh: "影响；效果；结果；印象", meaningEn: "a change produced by an action", band: "5", collocations: ["side effect", "positive effect", "have an effect"], example: "Exercise has a positive effect on mood.", exampleZh: "运动对情绪有积极影响。",
    senses: [
    {
    pos: "n.", meaningZh: "影响；效果；结果；印象", meaningEn: "a change produced by an action", collocations: ["side effect", "positive effect", "have an effect"], example: "Exercise has a positive effect on mood.", exampleZh: "运动对情绪有积极影响。" },
    {
    pos: "v.", meaningZh: "制造或促成的；实现的。", meaningEn: "To make or bring about; to implement.", collocations: [], example: "The best way to effect change is to work with existing stakeholders.", exampleZh: "" },
    {
    pos: "vt.", meaningZh: "实行；引起；完成；效果", meaningEn: "", collocations: [], example: "", exampleZh: "" }
    ]
  },
  {
    id: "change", term: "change", phonetic: "/tʃeɪndʒ/", pos: "n. / v.", meaningZh: "改变；变化；找回的零钱；找头；更换", meaningEn: "to make or become different", band: "5", collocations: ["climate change", "social change", "bring about change"], example: "Technology has brought about rapid social change.", exampleZh: "技术带来了快速的社会变迁。",
    senses: [
    {
    pos: "n. / v.", meaningZh: "改变；变化；找回的零钱；找头；更换", meaningEn: "to make or become different", collocations: ["climate change", "social change", "bring about change"], example: "Technology has brought about rapid social change.", exampleZh: "技术带来了快速的社会变迁。" },
    {
    pos: "v.", meaningZh: "成为与众不同的东西。", meaningEn: "To become something different.", collocations: [], example: "The tadpole changed into a frog. Stock prices are constantly changing.", exampleZh: "" },
    {
    pos: "vt.", meaningZh: "改变；更换；兑换", meaningEn: "", collocations: [], example: "", exampleZh: "" }
    ]
  },
  {
    id: "modern", term: "modern", phonetic: "/ˈmɒd(ə)n/", pos: "adj.", meaningZh: "现代的；时髦的", meaningEn: "relating to the present time", band: "5", collocations: ["modern society", "modern technology", "modern life"], example: "Modern medicine has saved countless lives.", exampleZh: "现代医学拯救了无数生命。",
    senses: [
    {
    pos: "adj.", meaningZh: "现代的；时髦的", meaningEn: "relating to the present time", collocations: ["modern society", "modern technology", "modern life"], example: "Modern medicine has saved countless lives.", exampleZh: "现代医学拯救了无数生命。" },
    {
    pos: "n.", meaningZh: "现代人；有思想的人", meaningEn: "Someone who lives in modern times.", collocations: [], example: "", exampleZh: "" }
    ]
  },
  {
    id: "global", term: "global", phonetic: "/ˈɡləʊbl/", pos: "adj.", meaningZh: "全球的；通用的；球形的；综合的；普遍的；共用", meaningEn: "relating to the whole world", band: "5", collocations: ["global warming", "global economy", "global issue"], example: "Climate change is a global challenge.", exampleZh: "气候变化是全球性的挑战。",
    senses: [
    {
    pos: "adj.", meaningZh: "全球的；通用的；球形的；综合的；普遍的；共用", meaningEn: "relating to the whole world", collocations: ["global warming", "global economy", "global issue"], example: "Climate change is a global challenge.", exampleZh: "气候变化是全球性的挑战。" }
    ]
  },
  {
    id: "social", term: "social", phonetic: "/ˈsəʊʃəl/", pos: "adj.", meaningZh: "社会的；社交的；群居的", meaningEn: "relating to society or community", band: "5", collocations: ["social media", "social problem", "social skill"], example: "Social media has changed how we communicate.", exampleZh: "社交媒体改变了我们的沟通方式。",
    senses: [
    {
    pos: "adj.", meaningZh: "社会的；社交的；群居的", meaningEn: "relating to society or community", collocations: ["social media", "social problem", "social skill"], example: "Social media has changed how we communicate.", exampleZh: "社交媒体改变了我们的沟通方式。" },
    {
    pos: "n.", meaningZh: "联欢会", meaningEn: "A festive gathering to foster introductions.", collocations: [], example: "They organized a social at the dance club to get people to know each other.", exampleZh: "" }
    ]
  },
  {
    id: "economic", term: "economic", phonetic: "/ˌiːkəˈnɒmɪk/", pos: "adj.", meaningZh: "经济的；经济上的；实用的；节省的", meaningEn: "relating to the economy", band: "5", collocations: ["economic growth", "economic crisis", "economic development"], example: "The country is facing a period of slow economic growth.", exampleZh: "该国正面临经济增长放缓的时期。",
    senses: [
    {
    pos: "adj.", meaningZh: "经济的；经济上的；实用的；节省的", meaningEn: "relating to the economy", collocations: ["economic growth", "economic crisis", "economic development"], example: "The country is facing a period of slow economic growth.", exampleZh: "该国正面临经济增长放缓的时期。" }
    ]
  },
  {
    id: "physical", term: "physical", phonetic: "/ˈfɪzɪkəl/", pos: "adj.", meaningZh: "身体的；物理的；物质的；自然的；物理学的；好色的", meaningEn: "relating to the body or matter", band: "5", collocations: ["physical activity", "physical health", "physical environment"], example: "Physical activity is important for the health of children.", exampleZh: "身体活动对儿童健康很重要。",
    senses: [
    {
    pos: "adj.", meaningZh: "身体的；物理的；物质的；自然的；物理学的；好色的", meaningEn: "relating to the body or matter", collocations: ["physical activity", "physical health", "physical environment"], example: "Physical activity is important for the health of children.", exampleZh: "身体活动对儿童健康很重要。" },
    {
    pos: "n.", meaningZh: "体格检查", meaningEn: "Physical examination.", collocations: [], example: "How long has it been since your last physical?", exampleZh: "" }
    ]
  },
  {
    id: "financial", term: "financial", phonetic: "/faɪˈnænʃl/", pos: "adj.", meaningZh: "财政的；金融的；财务的", meaningEn: "relating to money", band: "5", collocations: ["financial support", "financial problem", "financial crisis"], example: "Many students need financial support to study abroad.", exampleZh: "许多学生需要经济资助才能留学。",
    senses: [
    {
    pos: "adj.", meaningZh: "财政的；金融的；财务的", meaningEn: "relating to money", collocations: ["financial support", "financial problem", "financial crisis"], example: "Many students need financial support to study abroad.", exampleZh: "许多学生需要经济资助才能留学。" }
    ]
  },
  {
    id: "individual", term: "individual", phonetic: "/ˌɪndɪˈvɪdʒuəl/", pos: "n. / adj.", meaningZh: "个人；个体的", meaningEn: "a single person; relating to one person", band: "5", collocations: ["every individual", "individual needs", "individual difference"], example: "Each individual has a responsibility to protect the environment.", exampleZh: "每个人都有责任保护环境。",
    senses: [
    {
    pos: "n. / adj.", meaningZh: "个人；个体的", meaningEn: "a single person; relating to one person", collocations: ["every individual", "individual needs", "individual difference"], example: "Each individual has a responsibility to protect the environment.", exampleZh: "每个人都有责任保护环境。" },
    {
    pos: "adj.", meaningZh: "个别的；个人的；独特的", meaningEn: "", collocations: [], example: "", exampleZh: "" }
    ]
  },
  {
    id: "community", term: "community", phonetic: "/k(ə)ˈmjunəti/", pos: "n.", meaningZh: "社区；群体；公众；共有；共同体；社会", meaningEn: "a group of people living in one area", band: "5", collocations: ["local community", "community service", "support the community"], example: "Volunteers play a key role in the local community.", exampleZh: "志愿者在当地社区发挥着关键作用。",
    senses: [
    {
    pos: "n.", meaningZh: "社区；群体；公众；共有；共同体；社会", meaningEn: "a group of people living in one area", collocations: ["local community", "community service", "support the community"], example: "Volunteers play a key role in the local community.", exampleZh: "志愿者在当地社区发挥着关键作用。" }
    ]
  },
  {
    id: "resource", term: "resource", phonetic: "/ɹɪˈsɔɹs/", pos: "n.", meaningZh: "资源；财力；办法；策略；急智；消遣", meaningEn: "a supply of something useful", band: "5", collocations: ["natural resources", "human resources", "limited resources"], example: "We must use natural resources more efficiently.", exampleZh: "我们必须更高效地利用自然资源。",
    senses: [
    {
    pos: "n.", meaningZh: "资源；财力；办法；策略；急智；消遣", meaningEn: "a supply of something useful", collocations: ["natural resources", "human resources", "limited resources"], example: "We must use natural resources more efficiently.", exampleZh: "我们必须更高效地利用自然资源。" },
    {
    pos: "v.", meaningZh: "提供资源。", meaningEn: "To supply with resources.", collocations: [], example: "", exampleZh: "" }
    ]
  },
  {
    id: "energy", term: "energy", phonetic: "/ˈɛnəd͡ʒi/", pos: "n.", meaningZh: "能源；能量；精力；精神；活力", meaningEn: "power from heat, fuel, etc.", band: "5", collocations: ["renewable energy", "save energy", "energy supply"], example: "Renewable energy helps reduce carbon emissions.", exampleZh: "可再生能源有助于减少碳排放。",
    senses: [
    {
    pos: "n.", meaningZh: "能源；能量；精力；精神；活力", meaningEn: "power from heat, fuel, etc.", collocations: ["renewable energy", "save energy", "energy supply"], example: "Renewable energy helps reduce carbon emissions.", exampleZh: "可再生能源有助于减少碳排放。" }
    ]
  },
  {
    id: "climate", term: "climate", phonetic: "/ˈklaɪmət/", pos: "n.", meaningZh: "气候；社会趋势；气候区", meaningEn: "the typical weather of a place", band: "5", collocations: ["climate change", "global climate", "climate crisis"], example: "The climate in this region is warm and dry.", exampleZh: "该地区的气候温暖干燥。",
    senses: [
    {
    pos: "n.", meaningZh: "气候；社会趋势；气候区", meaningEn: "the typical weather of a place", collocations: ["climate change", "global climate", "climate crisis"], example: "The climate in this region is warm and dry.", exampleZh: "该地区的气候温暖干燥。" }
    ]
  },
  {
    id: "behaviour", term: "behaviour", phonetic: "/bɪˈheɪvjə/", pos: "n.", meaningZh: "行为；举止；特性；性能；特点；动作；状态", meaningEn: "the way someone acts", band: "5", collocations: ["human behaviour", "social behaviour", "change behaviour"], example: "Parents influence the behaviour of their children.", exampleZh: "父母会影响孩子的行为。",
    senses: [
    {
    pos: "n.", meaningZh: "行为；举止；特性；性能；特点；动作；状态", meaningEn: "the way someone acts", collocations: ["human behaviour", "social behaviour", "change behaviour"], example: "Parents influence the behaviour of their children.", exampleZh: "父母会影响孩子的行为。" }
    ]
  },
  {
    id: "knowledge", term: "knowledge", phonetic: "/ˈnɒlɪdʒ/", pos: "n.", meaningZh: "知识；学问；认识；知道", meaningEn: "facts and understanding", band: "5", collocations: ["prior knowledge", "broad knowledge", "gain knowledge"], example: "Reading widely expands your knowledge.", exampleZh: "广泛阅读能拓展你的知识。",
    senses: [
    {
    pos: "n.", meaningZh: "知识；学问；认识；知道", meaningEn: "facts and understanding", collocations: ["prior knowledge", "broad knowledge", "gain knowledge"], example: "Reading widely expands your knowledge.", exampleZh: "广泛阅读能拓展你的知识。" },
    {
    pos: "v.", meaningZh: "承认为真；承认。", meaningEn: "To confess as true; to acknowledge.", collocations: [], example: "", exampleZh: "" }
    ]
  },
  {
    id: "skill", term: "skill", phonetic: "/skɪl/", pos: "n.", meaningZh: "技能；技术；技巧；熟练；熟练工人", meaningEn: "the ability to do something well", band: "5", collocations: ["communication skills", "life skills", "develop a skill"], example: "Good communication skills are valued by employers.", exampleZh: "良好的沟通技能受雇主重视。",
    senses: [
    {
    pos: "n.", meaningZh: "技能；技术；技巧；熟练；熟练工人", meaningEn: "the ability to do something well", collocations: ["communication skills", "life skills", "develop a skill"], example: "Good communication skills are valued by employers.", exampleZh: "良好的沟通技能受雇主重视。" }
    ]
  },
  {
    id: "improve", term: "improve", phonetic: "/ɪmˈpɹuːv/", pos: "v.", meaningZh: "改善；提高", meaningEn: "to make better", band: "5", collocations: ["improve performance", "improve efficiency", "improve life"], example: "Exercise can improve both body and mind.", exampleZh: "运动能改善身心。",
    senses: [
    {
    pos: "v.", meaningZh: "改善；提高", meaningEn: "to make better", collocations: ["improve performance", "improve efficiency", "improve life"], example: "Exercise can improve both body and mind.", exampleZh: "运动能改善身心。" },
    {
    pos: "vt.", meaningZh: "改良；提高...的价值；改善；利用", meaningEn: "", collocations: [], example: "", exampleZh: "" },
    {
    pos: "vi.", meaningZh: "变得更好；增加", meaningEn: "", collocations: [], example: "", exampleZh: "" }
    ]
  },
  {
    id: "reduce", term: "reduce", phonetic: "/ɹɪˈdjuːs/", pos: "v.", meaningZh: "减少；降低", meaningEn: "to make smaller", band: "5", collocations: ["reduce costs", "reduce pollution", "reduce risk"], example: "We should reduce our use of plastic.", exampleZh: "我们应减少塑料使用。",
    senses: [
    {
    pos: "v.", meaningZh: "减少；降低", meaningEn: "to make smaller", collocations: ["reduce costs", "reduce pollution", "reduce risk"], example: "We should reduce our use of plastic.", exampleZh: "我们应减少塑料使用。" },
    {
    pos: "vt.", meaningZh: "减少；分解；降低；使衰退；把...分解；把...归纳", meaningEn: "", collocations: [], example: "", exampleZh: "" },
    {
    pos: "vi.", meaningZh: "减少；减肥；缩小", meaningEn: "", collocations: [], example: "", exampleZh: "" }
    ]
  },
  {
    id: "prevent", term: "prevent", phonetic: "/pɹəˈvɛnt/", pos: "v.", meaningZh: "防止；预防；阻止；妨碍", meaningEn: "to stop something happening", band: "5", collocations: ["prevent disease", "prevent accidents", "prevent from"], example: "Vaccines help prevent serious illness.", exampleZh: "疫苗有助于预防严重疾病。",
    senses: [
    {
    pos: "v.", meaningZh: "防止；预防；阻止；妨碍", meaningEn: "to stop something happening", collocations: ["prevent disease", "prevent accidents", "prevent from"], example: "Vaccines help prevent serious illness.", exampleZh: "疫苗有助于预防严重疾病。" }
    ]
  },
  {
    id: "support", term: "support", phonetic: "/səˈpɔːt/", pos: "v. / n.", meaningZh: "支持", meaningEn: "to help or approve", band: "5", collocations: ["provide support", "strong support", "in support of"], example: "Most residents support the new park.", exampleZh: "多数居民支持新建公园。",
    senses: [
    {
    pos: "v. / n.", meaningZh: "支持", meaningEn: "to help or approve", collocations: ["provide support", "strong support", "in support of"], example: "Most residents support the new park.", exampleZh: "多数居民支持新建公园。" },
    {
    pos: "n.", meaningZh: "支持；支撑；援助；供养；支撑物", meaningEn: "(sometimes attributive) Something which supports.", collocations: [], example: "Don't move that beam! It's a support for the whole platform.", exampleZh: "" },
    {
    pos: "vt.", meaningZh: "支援；支撑；帮助；支持；忍受；供养；证实；后援；支持", meaningEn: "", collocations: [], example: "", exampleZh: "" }
    ]
  },
  {
    id: "encourage", term: "encourage", phonetic: "/ɪnˈkʌɹɪdʒ/", pos: "v.", meaningZh: "鼓励", meaningEn: "to give confidence or hope", band: "5", collocations: ["encourage learning", "encourage participation", "strongly encourage"], example: "Teachers should encourage students to ask questions.", exampleZh: "教师应鼓励学生提问。",
    senses: [
    {
    pos: "v.", meaningZh: "鼓励", meaningEn: "to give confidence or hope", collocations: ["encourage learning", "encourage participation", "strongly encourage"], example: "Teachers should encourage students to ask questions.", exampleZh: "教师应鼓励学生提问。" },
    {
    pos: "vt.", meaningZh: "鼓励；支持；激励；怂恿；煽动；助长", meaningEn: "", collocations: [], example: "", exampleZh: "" }
    ]
  },
  {
    id: "achieve", term: "achieve", phonetic: "/əˈtʃiːv/", pos: "v.", meaningZh: "实现；达成", meaningEn: "to succeed in doing or completing", band: "6", collocations: ["achieve a goal", "achieve success", "achieve progress"], example: "Students can achieve their goals through consistent effort.", exampleZh: "学生能通过持续努力达成目标。",
    senses: [
    {
    pos: "v.", meaningZh: "实现；达成", meaningEn: "to succeed in doing or completing", collocations: ["achieve a goal", "achieve success", "achieve progress"], example: "Students can achieve their goals through consistent effort.", exampleZh: "学生能通过持续努力达成目标。" },
    {
    pos: "vt.", meaningZh: "完成；达到", meaningEn: "", collocations: [], example: "", exampleZh: "" },
    {
    pos: "vi.", meaningZh: "如愿以偿", meaningEn: "", collocations: [], example: "", exampleZh: "" }
    ]
  },
  {
    id: "conclusion", term: "conclusion", phonetic: "/kənˈkluːʒən/", pos: "n.", meaningZh: "结论；结尾；推论；缔结", meaningEn: "the end or final result of something", band: "6", collocations: ["draw a conclusion", "in conclusion", "reach a conclusion"], example: "The study reached a clear conclusion about the causes.", exampleZh: "这项研究就成因得出了明确结论。",
    senses: [
    {
    pos: "n.", meaningZh: "结论；结尾；推论；缔结", meaningEn: "the end or final result of something", collocations: ["draw a conclusion", "in conclusion", "reach a conclusion"], example: "The study reached a clear conclusion about the causes.", exampleZh: "这项研究就成因得出了明确结论。" }
    ]
  },
  {
    id: "contribute", term: "contribute", phonetic: "/kənˈt(ʃ)ɹɪb.juːt/", pos: "v.", meaningZh: "贡献；促成", meaningEn: "to give or help cause something", band: "6", collocations: ["contribute to", "contribute significantly", "contribute ideas"], example: "Regular exercise contributes to good physical health.", exampleZh: "规律运动有助于身体健康。",
    senses: [
    {
    pos: "v.", meaningZh: "贡献；促成", meaningEn: "to give or help cause something", collocations: ["contribute to", "contribute significantly", "contribute ideas"], example: "Regular exercise contributes to good physical health.", exampleZh: "规律运动有助于身体健康。" },
    {
    pos: "vt.", meaningZh: "有助于；捐助；投稿", meaningEn: "", collocations: [], example: "", exampleZh: "" },
    {
    pos: "vi.", meaningZh: "出力；捐献；投稿", meaningEn: "", collocations: [], example: "", exampleZh: "" }
    ]
  },
  {
    id: "establish", term: "establish", phonetic: "/ɪˈstæb.lɪʃ/", pos: "v.", meaningZh: "建立；确立", meaningEn: "to set up or found", band: "6", collocations: ["establish a system", "establish relations", "establish a rule"], example: "The university established a new research centre.", exampleZh: "这所大学新建了一个研究中心。",
    senses: [
    {
    pos: "v.", meaningZh: "建立；确立", meaningEn: "to set up or found", collocations: ["establish a system", "establish relations", "establish a rule"], example: "The university established a new research centre.", exampleZh: "这所大学新建了一个研究中心。" },
    {
    pos: "vt.", meaningZh: "建立；确立；制定", meaningEn: "", collocations: [], example: "", exampleZh: "" },
    {
    pos: "vi.", meaningZh: "移植生长", meaningEn: "", collocations: [], example: "", exampleZh: "" }
    ]
  },
  {
    id: "factor", term: "factor", phonetic: "/ˈfæktə/", pos: "n.", meaningZh: "因素；因数；系数；基因；代理人；因式", meaningEn: "an element that contributes to a result", band: "6", collocations: ["key factor", "contributing factor", "major factor"], example: "Cost is a key factor in the final decision.", exampleZh: "成本是最终决策的关键因素。",
    senses: [
    {
    pos: "n.", meaningZh: "因素；因数；系数；基因；代理人；因式", meaningEn: "an element that contributes to a result", collocations: ["key factor", "contributing factor", "major factor"], example: "Cost is a key factor in the final decision.", exampleZh: "成本是最终决策的关键因素。" },
    {
    pos: "v.", meaningZh: "查找（一个数字或其他数学对象） （均匀分割它的对象）的所有因子。", meaningEn: "To find all the factors of (a number or other mathematical object) (the objects that divide it evenly).", collocations: [], example: "", exampleZh: "" }
    ]
  },
  {
    id: "indicate", term: "indicate", phonetic: "/ˈɪndɪkeɪt/", pos: "v.", meaningZh: "表明；显示", meaningEn: "to show or suggest", band: "6", collocations: ["indicate that", "clearly indicate", "indicate a trend"], example: "The data indicates a rising trend in temperature.", exampleZh: "数据显示气温呈上升趋势。",
    senses: [
    {
    pos: "v.", meaningZh: "表明；显示", meaningEn: "to show or suggest", collocations: ["indicate that", "clearly indicate", "indicate a trend"], example: "The data indicates a rising trend in temperature.", exampleZh: "数据显示气温呈上升趋势。" },
    {
    pos: "vt.", meaningZh: "显示；象征；指示；指出", meaningEn: "", collocations: [], example: "", exampleZh: "" }
    ]
  },
  {
    id: "demonstrate", term: "demonstrate", phonetic: "/ˈdɛmənstɹeɪt/", pos: "v.", meaningZh: "证明；演示", meaningEn: "to show clearly by giving proof or example", band: "6", collocations: ["demonstrate that", "clearly demonstrate", "demonstrate ability"], example: "The study demonstrates that exercise improves concentration.", exampleZh: "该研究证明运动能提升专注力。",
    senses: [
    {
    pos: "v.", meaningZh: "证明；演示", meaningEn: "to show clearly by giving proof or example", collocations: ["demonstrate that", "clearly demonstrate", "demonstrate ability"], example: "The study demonstrates that exercise improves concentration.", exampleZh: "该研究证明运动能提升专注力。" },
    {
    pos: "vt.", meaningZh: "示范；证明", meaningEn: "", collocations: [], example: "", exampleZh: "" },
    {
    pos: "vi.", meaningZh: "示威", meaningEn: "", collocations: [], example: "", exampleZh: "" }
    ]
  },
  {
    id: "evaluate", term: "evaluate", phonetic: "/ɨˈvaljʊeɪt/", pos: "v.", meaningZh: "评估；评价", meaningEn: "to judge the value or quality of something", band: "6", collocations: ["evaluate the impact", "carefully evaluate", "evaluate performance"], example: "We must evaluate the risks before launching the product.", exampleZh: "在推出产品前，我们必须评估风险。",
    senses: [
    {
    pos: "v.", meaningZh: "评估；评价", meaningEn: "to judge the value or quality of something", collocations: ["evaluate the impact", "carefully evaluate", "evaluate performance"], example: "We must evaluate the risks before launching the product.", exampleZh: "在推出产品前，我们必须评估风险。" },
    {
    pos: "vt.", meaningZh: "评估；评价；赋值", meaningEn: "", collocations: [], example: "", exampleZh: "" }
    ]
  },
  {
    id: "occur", term: "occur", phonetic: "/əˈkɜː/", pos: "v.", meaningZh: "发生", meaningEn: "to happen or take place", band: "6", collocations: ["occur in", "frequently occur", "occur to"], example: "Most accidents occur when drivers are distracted.", exampleZh: "多数事故发生在驾驶者分神时。",
    senses: [
    {
    pos: "v.", meaningZh: "发生", meaningEn: "to happen or take place", collocations: ["occur in", "frequently occur", "occur to"], example: "Most accidents occur when drivers are distracted.", exampleZh: "多数事故发生在驾驶者分神时。" },
    {
    pos: "vi.", meaningZh: "发生；被想到；存在", meaningEn: "", collocations: [], example: "", exampleZh: "" }
    ]
  },
  {
    id: "specific", term: "specific", phonetic: "/spəˈsɪf.ɪk/", pos: "adj.", meaningZh: "具体的；特定的；特殊的；明确的；具有特效的；特定地；具体地", meaningEn: "precise and clearly defined", band: "6", collocations: ["specific example", "specific purpose", "more specific"], example: "Can you give a specific example to support your point?", exampleZh: "你能举一个具体的例子来支持你的观点吗？",
    senses: [
    {
    pos: "adj.", meaningZh: "具体的；特定的；特殊的；明确的；具有特效的；特定地；具体地", meaningEn: "precise and clearly defined", collocations: ["specific example", "specific purpose", "more specific"], example: "Can you give a specific example to support your point?", exampleZh: "你能举一个具体的例子来支持你的观点吗？" },
    {
    pos: "n.", meaningZh: "特效药；特性", meaningEn: "A distinguishing attribute or quality.", collocations: [], example: "", exampleZh: "" }
    ]
  },
  {
    id: "structure", term: "structure", phonetic: "/ˈstɹʌktʃə(ɹ)/", pos: "n. / v.", meaningZh: "结构；组织；构造；建筑物", meaningEn: "the way parts are arranged or organized", band: "6", collocations: ["social structure", "clear structure", "well-structured"], example: "A clear structure helps the reader follow your argument.", exampleZh: "清晰的结构有助于读者理解你的论证。",
    senses: [
    {
    pos: "n. / v.", meaningZh: "结构；组织；构造；建筑物", meaningEn: "the way parts are arranged or organized", collocations: ["social structure", "clear structure", "well-structured"], example: "A clear structure helps the reader follow your argument.", exampleZh: "清晰的结构有助于读者理解你的论证。" },
    {
    pos: "v.", meaningZh: "使结构化；安排。", meaningEn: "To give structure to; to arrange.", collocations: [], example: "I'm trying to structure my time better so I'm not always late.", exampleZh: "" },
    {
    pos: "vt.", meaningZh: "构成；组织", meaningEn: "", collocations: [], example: "", exampleZh: "" }
    ]
  },
  {
    id: "tradition", term: "tradition", phonetic: "/tɹəˈdɪʃn̩/", pos: "n.", meaningZh: "传统；传说；交付；惯例；移交", meaningEn: "beliefs or customs passed down over time", band: "6", collocations: ["cultural tradition", "break with tradition", "long tradition"], example: "The festival reflects a long cultural tradition.", exampleZh: "这个节日折射出悠久的文化传统。",
    senses: [
    {
    pos: "n.", meaningZh: "传统；传说；交付；惯例；移交", meaningEn: "beliefs or customs passed down over time", collocations: ["cultural tradition", "break with tradition", "long tradition"], example: "The festival reflects a long cultural tradition.", exampleZh: "这个节日折射出悠久的文化传统。" },
    {
    pos: "v.", meaningZh: "以传统的方式传递；传下来。", meaningEn: "To transmit by way of tradition; to hand down.", collocations: [], example: "", exampleZh: "" }
    ]
  },
  {
    id: "maintain", term: "maintain", phonetic: "/meɪnˈteɪn/", pos: "v.", meaningZh: "维持；保持", meaningEn: "to keep something in a particular state", band: "6", collocations: ["maintain order", "maintain a balance", "maintain that"], example: "It is important to maintain a balance between work and rest.", exampleZh: "在工作和休息之间保持平衡很重要。",
    senses: [
    {
    pos: "v.", meaningZh: "维持；保持", meaningEn: "to keep something in a particular state", collocations: ["maintain order", "maintain a balance", "maintain that"], example: "It is important to maintain a balance between work and rest.", exampleZh: "在工作和休息之间保持平衡很重要。" },
    {
    pos: "vt.", meaningZh: "维持；维修；保持；坚持；供养；主张", meaningEn: "", collocations: [], example: "", exampleZh: "" }
    ]
  },
  {
    id: "vary", term: "vary", phonetic: "/ˈvɛəɹi/", pos: "v.", meaningZh: "变化；不同", meaningEn: "to be different in size, level, or nature", band: "6", collocations: ["vary from", "vary widely", "vary according to"], example: "Prices vary according to the season and demand.", exampleZh: "价格随季节和需求而变化。",
    senses: [
    {
    pos: "v.", meaningZh: "变化；不同", meaningEn: "to be different in size, level, or nature", collocations: ["vary from", "vary widely", "vary according to"], example: "Prices vary according to the season and demand.", exampleZh: "价格随季节和需求而变化。" },
    {
    pos: "n.", meaningZh: "更改；更改。", meaningEn: "Alteration; change.", collocations: [], example: "", exampleZh: "" },
    {
    pos: "vt.", meaningZh: "改变；使多样化", meaningEn: "", collocations: [], example: "", exampleZh: "" },
    {
    pos: "vi.", meaningZh: "变化；有不同；违反", meaningEn: "", collocations: [], example: "", exampleZh: "" }
    ]
  },
  {
    id: "analysis", term: "analysis", phonetic: "/əˈnælɪsɪs/", pos: "n.", meaningZh: "分析；分析机；分析员；分析程序", meaningEn: "detailed study of something", band: "6", collocations: ["data analysis", "in-depth analysis", "further analysis"], example: "A careful analysis revealed the cause of the failure.", exampleZh: "细致的分析揭示了失败的原因。",
    senses: [
    {
    pos: "n.", meaningZh: "分析；分析机；分析员；分析程序", meaningEn: "detailed study of something", collocations: ["data analysis", "in-depth analysis", "further analysis"], example: "A careful analysis revealed the cause of the failure.", exampleZh: "细致的分析揭示了失败的原因。" }
    ]
  },
  {
    id: "approach", term: "approach", phonetic: "/əˈpɹəʊt͡ʃ/", pos: "n. / v.", meaningZh: "方法；接近；入门", meaningEn: "a way of dealing with something", band: "6", collocations: ["a new approach", "approach to", "practical approach"], example: "We need a different approach to the problem.", exampleZh: "我们需要用不同的方法来处理这个问题。",
    senses: [
    {
    pos: "n. / v.", meaningZh: "方法；接近；入门", meaningEn: "a way of dealing with something", collocations: ["a new approach", "approach to", "practical approach"], example: "We need a different approach to the problem.", exampleZh: "我们需要用不同的方法来处理这个问题。" },
    {
    pos: "v.", meaningZh: "来或去，在适当的地方或时间；靠近；前进更近。", meaningEn: "To come or go near, in place or time; to draw nigh; to advance nearer.", collocations: [], example: "", exampleZh: "" },
    {
    pos: "vt.", meaningZh: "接近；近似；找...商量", meaningEn: "", collocations: [], example: "", exampleZh: "" },
    {
    pos: "vi.", meaningZh: "靠近", meaningEn: "", collocations: [], example: "", exampleZh: "" }
    ]
  },
  {
    id: "assess", term: "assess", phonetic: "/əˈsɛs/", pos: "v.", meaningZh: "评估", meaningEn: "to judge the quality or size", band: "6", collocations: ["assess risk", "assess performance", "carefully assess"], example: "Doctors assessed the patient’s condition quickly.", exampleZh: "医生迅速评估了病人的状况。",
    senses: [
    {
    pos: "v.", meaningZh: "评估", meaningEn: "to judge the quality or size", collocations: ["assess risk", "assess performance", "carefully assess"], example: "Doctors assessed the patient’s condition quickly.", exampleZh: "医生迅速评估了病人的状况。" },
    {
    pos: "vt.", meaningZh: "估定；对...征税；评定；估计；估价；确定(税款罚款等)的金额", meaningEn: "", collocations: [], example: "", exampleZh: "" }
    ]
  },
  {
    id: "assume", term: "assume", phonetic: "/əˈsuːm/", pos: "v.", meaningZh: "假设；认为", meaningEn: "to suppose something is true", band: "6", collocations: ["assume that", "it is assumed", "assume responsibility"], example: "We cannot assume that everyone has internet access.", exampleZh: "我们不能假设人人都能上网。",
    senses: [
    {
    pos: "v.", meaningZh: "假设；认为", meaningEn: "to suppose something is true", collocations: ["assume that", "it is assumed", "assume responsibility"], example: "We cannot assume that everyone has internet access.", exampleZh: "我们不能假设人人都能上网。" },
    {
    pos: "vt.", meaningZh: "假定；承担；呈现", meaningEn: "", collocations: [], example: "", exampleZh: "" },
    {
    pos: "vi.", meaningZh: "装腔作势；僭越", meaningEn: "", collocations: [], example: "", exampleZh: "" }
    ]
  },
  {
    id: "communication", term: "communication", phonetic: "/kəˌmjuːnɪˈkeɪʃən/", pos: "n.", meaningZh: "沟通；交流；交通；通讯；通信", meaningEn: "the exchange of information", band: "6", collocations: ["effective communication", "communication skills", "verbal communication"], example: "Good communication is vital in a team.", exampleZh: "良好的沟通对团队至关重要。",
    senses: [
    {
    pos: "n.", meaningZh: "沟通；交流；交通；通讯；通信", meaningEn: "the exchange of information", collocations: ["effective communication", "communication skills", "verbal communication"], example: "Good communication is vital in a team.", exampleZh: "良好的沟通对团队至关重要。" }
    ]
  },
  {
    id: "complex", term: "complex", phonetic: "/ˈkɒmpleks/", pos: "adj.", meaningZh: "复杂的；组合的", meaningEn: "made of many parts, hard to understand", band: "6", collocations: ["complex issue", "complex system", "increasingly complex"], example: "Climate change is a complex global problem.", exampleZh: "气候变化是一个复杂的全球性问题。",
    senses: [
    {
    pos: "adj.", meaningZh: "复杂的；组合的", meaningEn: "made of many parts, hard to understand", collocations: ["complex issue", "complex system", "increasingly complex"], example: "Climate change is a complex global problem.", exampleZh: "气候变化是一个复杂的全球性问题。" },
    {
    pos: "n.", meaningZh: "综合体；情结；络合物", meaningEn: "A network of interconnected systems.", collocations: [], example: "", exampleZh: "" },
    {
    pos: "v.", meaningZh: "与另一种物质形成复合物", meaningEn: "To form a complex with another substance", collocations: [], example: "", exampleZh: "" }
    ]
  },
  {
    id: "consider", term: "consider", phonetic: "/kənˈsɪdə/", pos: "v.", meaningZh: "考虑；认为；思考", meaningEn: "to think about carefully", band: "6", collocations: ["consider carefully", "consider doing", "widely considered"], example: "We should consider the long-term effects.", exampleZh: "我们应当考虑长远影响。",
    senses: [
    {
    pos: "v.", meaningZh: "考虑；认为；思考", meaningEn: "to think about carefully", collocations: ["consider carefully", "consider doing", "widely considered"], example: "We should consider the long-term effects.", exampleZh: "我们应当考虑长远影响。" }
    ]
  },
  {
    id: "consume", term: "consume", phonetic: "/kənˈsjuːm/", pos: "v.", meaningZh: "消耗；消费", meaningEn: "to use up; to eat or buy", band: "6", collocations: ["consume energy", "consume resources", "consume less"], example: "Cars consume a large amount of fuel.", exampleZh: "汽车消耗大量燃料。",
    senses: [
    {
    pos: "v.", meaningZh: "消耗；消费", meaningEn: "to use up; to eat or buy", collocations: ["consume energy", "consume resources", "consume less"], example: "Cars consume a large amount of fuel.", exampleZh: "汽车消耗大量燃料。" },
    {
    pos: "vt.", meaningZh: "消耗；消费；消灭", meaningEn: "", collocations: [], example: "", exampleZh: "" },
    {
    pos: "vi.", meaningZh: "耗尽；毁灭", meaningEn: "", collocations: [], example: "", exampleZh: "" }
    ]
  },
  {
    id: "create", term: "create", phonetic: "/kɹiːˈeɪt/", pos: "v.", meaningZh: "创造；创建", meaningEn: "to make something new", band: "6", collocations: ["create jobs", "create value", "create opportunities"], example: "The project will create hundreds of new jobs.", exampleZh: "该项目将创造数百个新岗位。",
    senses: [
    {
    pos: "v.", meaningZh: "创造；创建", meaningEn: "to make something new", collocations: ["create jobs", "create value", "create opportunities"], example: "The project will create hundreds of new jobs.", exampleZh: "该项目将创造数百个新岗位。" },
    {
    pos: "adj.", meaningZh: "创建，由创建产生。", meaningEn: "Created, resulting from creation.", collocations: [], example: "", exampleZh: "" },
    {
    pos: "vt.", meaningZh: "创造；建造；引起；任命", meaningEn: "", collocations: [], example: "", exampleZh: "" }
    ]
  },
  {
    id: "cultural", term: "cultural", phonetic: "/ˈkʌltʃərəl/", pos: "adj.", meaningZh: "文化的；教养的；修养的；培养的", meaningEn: "relating to culture", band: "6", collocations: ["cultural difference", "cultural heritage", "cultural exchange"], example: "Travel broadens our cultural understanding.", exampleZh: "旅行拓宽了我们的文化认知。",
    senses: [
    {
    pos: "adj.", meaningZh: "文化的；教养的；修养的；培养的", meaningEn: "relating to culture", collocations: ["cultural difference", "cultural heritage", "cultural exchange"], example: "Travel broadens our cultural understanding.", exampleZh: "旅行拓宽了我们的文化认知。" }
    ]
  },
  {
    id: "decline", term: "decline", phonetic: "/dɪˈklaɪn/", pos: "n. / v.", meaningZh: "下降；衰退；跌落", meaningEn: "to become smaller or weaker", band: "6", collocations: ["a sharp decline", "decline in", "on the decline"], example: "There has been a decline in reading habits.", exampleZh: "阅读习惯呈下降趋势。",
    senses: [
    {
    pos: "n. / v.", meaningZh: "下降；衰退；跌落", meaningEn: "to become smaller or weaker", collocations: ["a sharp decline", "decline in", "on the decline"], example: "There has been a decline in reading habits.", exampleZh: "阅读习惯呈下降趋势。" },
    {
    pos: "vt.", meaningZh: "使降低；婉谢", meaningEn: "", collocations: [], example: "", exampleZh: "" },
    {
    pos: "vi.", meaningZh: "下降；衰落；偏斜", meaningEn: "", collocations: [], example: "", exampleZh: "" }
    ]
  },
  {
    id: "demand", term: "demand", phonetic: "/dɪˈmɑːnd/", pos: "n. / v.", meaningZh: "需求；要求；需要", meaningEn: "a strong need or request", band: "6", collocations: ["meet demand", "high demand", "consumer demand"], example: "Demand for clean energy is rising.", exampleZh: "对清洁能源的需求正在上升。",
    senses: [
    {
    pos: "n. / v.", meaningZh: "需求；要求；需要", meaningEn: "a strong need or request", collocations: ["meet demand", "high demand", "consumer demand"], example: "Demand for clean energy is rising.", exampleZh: "对清洁能源的需求正在上升。" },
    {
    pos: "v.", meaningZh: "要求；查询", meaningEn: "To request forcefully.", collocations: [], example: "I demand to see the manager.", exampleZh: "" }
    ]
  },
  {
    id: "design", term: "design", phonetic: "/dɪˈzaɪn/", pos: "n. / v.", meaningZh: "设计；图样；方案；企图", meaningEn: "to plan how something will look", band: "6", collocations: ["design a system", "good design", "user-centred design"], example: "They designed a low-cost water filter.", exampleZh: "他们设计了一款低成本滤水器。",
    senses: [
    {
    pos: "n. / v.", meaningZh: "设计；图样；方案；企图", meaningEn: "to plan how something will look", collocations: ["design a system", "good design", "user-centred design"], example: "They designed a low-cost water filter.", exampleZh: "他们设计了一款低成本滤水器。" },
    {
    pos: "v.", meaningZh: "设计；计划", meaningEn: "To plan and carry out (a picture, work of art, construction etc.).", collocations: [], example: "", exampleZh: "" }
    ]
  },
  {
    id: "determine", term: "determine", phonetic: "/dɪˈtɜːmɪn/", pos: "v.", meaningZh: "决定；确定；决心", meaningEn: "to find out or decide", band: "6", collocations: ["determine the cause", "help determine", "determine whether"], example: "Tests will determine the source of the leak.", exampleZh: "检测将确定泄漏源。",
    senses: [
    {
    pos: "v.", meaningZh: "决定；确定；决心", meaningEn: "to find out or decide", collocations: ["determine the cause", "help determine", "determine whether"], example: "Tests will determine the source of the leak.", exampleZh: "检测将确定泄漏源。" }
    ]
  },
  {
    id: "distribute", term: "distribute", phonetic: "/dɨˈstɹɪbjuːt/", pos: "v.", meaningZh: "分配；分发", meaningEn: "to give out among people", band: "6", collocations: ["distribute resources", "distribute evenly", "fairly distribute"], example: "Aid was distributed to affected families.", exampleZh: "援助物资已分发给受影响家庭。",
    senses: [
    {
    pos: "v.", meaningZh: "分配；分发", meaningEn: "to give out among people", collocations: ["distribute resources", "distribute evenly", "fairly distribute"], example: "Aid was distributed to affected families.", exampleZh: "援助物资已分发给受影响家庭。" },
    {
    pos: "vt.", meaningZh: "分配；散布；分发；分配；分发", meaningEn: "", collocations: [], example: "", exampleZh: "" }
    ]
  },
  {
    id: "expand", term: "expand", phonetic: "/ɛkˈspænd/", pos: "v.", meaningZh: "扩大；扩张", meaningEn: "to become or make larger", band: "6", collocations: ["expand the market", "rapidly expand", "expand access"], example: "The company plans to expand into Asia.", exampleZh: "公司计划向亚洲扩张。",
    senses: [
    {
    pos: "v.", meaningZh: "扩大；扩张", meaningEn: "to become or make larger", collocations: ["expand the market", "rapidly expand", "expand access"], example: "The company plans to expand into Asia.", exampleZh: "公司计划向亚洲扩张。" },
    {
    pos: "vt.", meaningZh: "展开", meaningEn: "", collocations: [], example: "", exampleZh: "" },
    {
    pos: "vi.", meaningZh: "展开；展开；DOS外部命令:将原始DOS磁盘上的压缩文件解压缩并拷贝到硬盘上", meaningEn: "", collocations: [], example: "", exampleZh: "" }
    ]
  },
  {
    id: "feature", term: "feature", phonetic: "/ˈfiːtʃə/", pos: "n. / v.", meaningZh: "特征；以…为特色；面孔的一部分(如眼、口等)；容貌；特写", meaningEn: "a distinctive part", band: "6", collocations: ["key feature", "main feature", "feature in"], example: "Safety is a key feature of the new design.", exampleZh: "安全性是这一新设计的关键特征。",
    senses: [
    {
    pos: "n. / v.", meaningZh: "特征；以…为特色；面孔的一部分(如眼、口等)；容貌；特写", meaningEn: "a distinctive part", collocations: ["key feature", "main feature", "feature in"], example: "Safety is a key feature of the new design.", exampleZh: "安全性是这一新设计的关键特征。" },
    {
    pos: "v.", meaningZh: "在某种背景下赋予某事最大的重要性。", meaningEn: "To ascribe the greatest importance to something within a certain context.", collocations: [], example: "", exampleZh: "" },
    {
    pos: "vt.", meaningZh: "是...的特色；特写；放映", meaningEn: "", collocations: [], example: "", exampleZh: "" },
    {
    pos: "vi.", meaningZh: "起重要作用；特性", meaningEn: "", collocations: [], example: "", exampleZh: "" }
    ]
  },
  {
    id: "focus", term: "focus", phonetic: "/ˈfəʊ.kəs/", pos: "n. / v.", meaningZh: "焦点；集中；焦距", meaningEn: "the main point; to concentrate", band: "6", collocations: ["focus on", "main focus", "sharp focus"], example: "The report focuses on youth employment.", exampleZh: "报告聚焦于青年就业。",
    senses: [
    {
    pos: "n. / v.", meaningZh: "焦点；集中；焦距", meaningEn: "the main point; to concentrate", collocations: ["focus on", "main focus", "sharp focus"], example: "The report focuses on youth employment.", exampleZh: "报告聚焦于青年就业。" },
    {
    pos: "v.", meaningZh: "（紧接着是或紧接着是）集中注意力。", meaningEn: "(followed by on or upon) To concentrate one's attention.", collocations: [], example: "I have to focus on my work.", exampleZh: "" },
    {
    pos: "vi.", meaningZh: "聚焦；注视", meaningEn: "", collocations: [], example: "", exampleZh: "" },
    {
    pos: "vt.", meaningZh: "使聚焦；调焦；集中；焦点", meaningEn: "", collocations: [], example: "", exampleZh: "" }
    ]
  },
  {
    id: "fundamental", term: "fundamental", phonetic: "/ˌfʌndəˈmentl/", pos: "adj.", meaningZh: "基本的；根本的；重要的；原音的", meaningEn: "forming the necessary base", band: "6", collocations: ["fundamental right", "fundamental change", "fundamental issue"], example: "Education is a fundamental human right.", exampleZh: "教育是一项基本人权。",
    senses: [
    {
    pos: "adj.", meaningZh: "基本的；根本的；重要的；原音的", meaningEn: "forming the necessary base", collocations: ["fundamental right", "fundamental change", "fundamental issue"], example: "Education is a fundamental human right.", exampleZh: "教育是一项基本人权。" },
    {
    pos: "n.", meaningZh: "基本原理；原则；基波", meaningEn: "", collocations: [], example: "", exampleZh: "" }
    ]
  },
  {
    id: "identify", term: "identify", phonetic: "/aɪˈdɛn.tɪ.faɪ/", pos: "v.", meaningZh: "识别；确认", meaningEn: "to recognise or name", band: "6", collocations: ["identify the cause", "identify problems", "easily identify"], example: "We must identify the root of the problem.", exampleZh: "我们必须找出问题的根源。",
    senses: [
    {
    pos: "v.", meaningZh: "识别；确认", meaningEn: "to recognise or name", collocations: ["identify the cause", "identify problems", "easily identify"], example: "We must identify the root of the problem.", exampleZh: "我们必须找出问题的根源。" },
    {
    pos: "vt.", meaningZh: "识别；认为...等同于；确定；使参与", meaningEn: "", collocations: [], example: "", exampleZh: "" },
    {
    pos: "vi.", meaningZh: "一致；认同", meaningEn: "", collocations: [], example: "", exampleZh: "" }
    ]
  },
  {
    id: "impact", term: "impact", phonetic: "/ˈɪmpækt/", pos: "n. / v.", meaningZh: "影响；冲击；冲突；效果", meaningEn: "a strong effect", band: "6", collocations: ["have an impact", "positive impact", "environmental impact"], example: "The policy had a major impact on trade.", exampleZh: "该政策对贸易产生了重大影响。",
    senses: [
    {
    pos: "n. / v.", meaningZh: "影响；冲击；冲突；效果", meaningEn: "a strong effect", collocations: ["have an impact", "positive impact", "environmental impact"], example: "The policy had a major impact on trade.", exampleZh: "该政策对贸易产生了重大影响。" },
    {
    pos: "v.", meaningZh: "碰撞或罢工，即撞击行为。", meaningEn: "To collide or strike, the act of impinging.", collocations: [], example: "When the hammer impacts the nail, it bends.", exampleZh: "" },
    {
    pos: "vt.", meaningZh: "挤入；撞击；压紧；对...发生影响", meaningEn: "", collocations: [], example: "", exampleZh: "" }
    ]
  },
  {
    id: "implement", term: "implement", phonetic: "/ˈɪmpləmənt/", pos: "v.", meaningZh: "实施；执行", meaningEn: "to put a plan into action", band: "6", collocations: ["implement a policy", "implement changes", "successfully implement"], example: "The school implemented a new assessment system.", exampleZh: "学校实施了一套新的评估体系。",
    senses: [
    {
    pos: "v.", meaningZh: "实施；执行", meaningEn: "to put a plan into action", collocations: ["implement a policy", "implement changes", "successfully implement"], example: "The school implemented a new assessment system.", exampleZh: "学校实施了一套新的评估体系。" },
    {
    pos: "n.", meaningZh: "工具；器具；手段", meaningEn: "", collocations: [], example: "", exampleZh: "" },
    {
    pos: "vt.", meaningZh: "实现；使生效；执行", meaningEn: "", collocations: [], example: "", exampleZh: "" }
    ]
  },
  {
    id: "influence", term: "influence", phonetic: "/ˈɪnfluəns/", pos: "n. / v.", meaningZh: "影响；影响力；权力；势力", meaningEn: "the power to affect others", band: "6", collocations: ["have influence", "strong influence", "influence on"], example: "Parents have a strong influence on children.", exampleZh: "父母对孩子有很强的影响。",
    senses: [
    {
    pos: "n. / v.", meaningZh: "影响；影响力；权力；势力", meaningEn: "the power to affect others", collocations: ["have influence", "strong influence", "influence on"], example: "Parents have a strong influence on children.", exampleZh: "父母对孩子有很强的影响。" },
    {
    pos: "vt.", meaningZh: "影响；改变", meaningEn: "", collocations: [], example: "", exampleZh: "" }
    ]
  },
  {
    id: "initiate", term: "initiate", phonetic: "/ɪˈnɪʃieɪt/", pos: "v.", meaningZh: "发起；开始", meaningEn: "to start something", band: "6", collocations: ["initiate a project", "initiate change", "initiate talks"], example: "The NGO initiated a clean-water campaign.", exampleZh: "该非政府组织发起了一场清洁饮水行动。",
    senses: [
    {
    pos: "v.", meaningZh: "发起；开始", meaningEn: "to start something", collocations: ["initiate a project", "initiate change", "initiate talks"], example: "The NGO initiated a clean-water campaign.", exampleZh: "该非政府组织发起了一场清洁饮水行动。" },
    {
    pos: "n.", meaningZh: "入会；开始", meaningEn: "A new member of an organization.", collocations: [], example: "", exampleZh: "" },
    {
    pos: "adj.", meaningZh: "新加入的", meaningEn: "Unpractised; untried; new.", collocations: [], example: "", exampleZh: "" },
    {
    pos: "vt.", meaningZh: "开始；传授基本知识给", meaningEn: "", collocations: [], example: "", exampleZh: "" }
    ]
  },
  {
    id: "interpret", term: "interpret", phonetic: "/ɪnˈtɜː.pɹɪt/", pos: "v.", meaningZh: "解释；口译", meaningEn: "to explain meaning", band: "6", collocations: ["interpret data", "interpret as", "interpret the result"], example: "How should we interpret these findings?", exampleZh: "我们该如何解读这些发现？",
    senses: [
    {
    pos: "v.", meaningZh: "解释；口译", meaningEn: "to explain meaning", collocations: ["interpret data", "interpret as", "interpret the result"], example: "How should we interpret these findings?", exampleZh: "我们该如何解读这些发现？" },
    {
    pos: "vt.", meaningZh: "解释；演出；翻译；理解", meaningEn: "", collocations: [], example: "", exampleZh: "" },
    {
    pos: "vi.", meaningZh: "翻译；解释", meaningEn: "", collocations: [], example: "", exampleZh: "" }
    ]
  },
  {
    id: "involve", term: "involve", phonetic: "/ɪnˈvɒlv/", pos: "v.", meaningZh: "涉及；包含", meaningEn: "to include or require", band: "6", collocations: ["involve risk", "involve in", "closely involved"], example: "The job involves a lot of travel.", exampleZh: "这份工作涉及大量出差。",
    senses: [
    {
    pos: "v.", meaningZh: "涉及；包含", meaningEn: "to include or require", collocations: ["involve risk", "involve in", "closely involved"], example: "The job involves a lot of travel.", exampleZh: "这份工作涉及大量出差。" },
    {
    pos: "vt.", meaningZh: "包括；使陷于；潜心于；包围；累及；牵涉；包含", meaningEn: "", collocations: [], example: "", exampleZh: "" }
    ]
  },
  {
    id: "justify", term: "justify", phonetic: "/ˈdʒʌstɪfaɪ/", pos: "v.", meaningZh: "证明…正当", meaningEn: "to show something is reasonable", band: "6", collocations: ["justify the cost", "hard to justify", "justify a decision"], example: "Can you justify the high price?", exampleZh: "你能为高价给出理由吗？",
    senses: [
    {
    pos: "v.", meaningZh: "证明…正当", meaningEn: "to show something is reasonable", collocations: ["justify the cost", "hard to justify", "justify a decision"], example: "Can you justify the high price?", exampleZh: "你能为高价给出理由吗？" },
    {
    pos: "vt.", meaningZh: "替...辩护；证明", meaningEn: "", collocations: [], example: "", exampleZh: "" },
    {
    pos: "vi.", meaningZh: "证明合法；段落重排；两端对齐", meaningEn: "", collocations: [], example: "", exampleZh: "" }
    ]
  },
  {
    id: "measure", term: "measure", phonetic: "/ˈmɛʒə/", pos: "n. / v.", meaningZh: "措施；测量；尺寸；量度器；量度标准；量具；程度；范围；限度；分寸；方法", meaningEn: "an action; to find size", band: "6", collocations: ["take measures", "measure success", "strict measures"], example: "The government took measures to control inflation.", exampleZh: "政府采取措施控制通胀。",
    senses: [
    {
    pos: "n. / v.", meaningZh: "措施；测量；尺寸；量度器；量度标准；量具；程度；范围；限度；分寸；方法", meaningEn: "an action; to find size", collocations: ["take measures", "measure success", "strict measures"], example: "The government took measures to control inflation.", exampleZh: "政府采取措施控制通胀。" },
    {
    pos: "v.", meaningZh: "通过与标准的计算比较来确定材料单位的数量。", meaningEn: "To ascertain the quantity of a unit of material via calculated comparison with respect to a standard.", collocations: [], example: "We measured the temperature with a thermometer. You should measure the angle with a spirit level.", exampleZh: "" },
    {
    pos: "vt.", meaningZh: "测量；测度；估量；权衡；调节；拿(自己或自己的力量等)作较量", meaningEn: "", collocations: [], example: "", exampleZh: "" },
    {
    pos: "vi.", meaningZh: "度量", meaningEn: "", collocations: [], example: "", exampleZh: "" }
    ]
  },
  {
    id: "obtain", term: "obtain", phonetic: "/əbˈteɪn/", pos: "v.", meaningZh: "获得；取得", meaningEn: "to get or acquire", band: "6", collocations: ["obtain data", "obtain permission", "easily obtain"], example: "Researchers obtained permission to run the study.", exampleZh: "研究人员获得了开展研究的许可。",
    senses: [
    {
    pos: "v.", meaningZh: "获得；取得", meaningEn: "to get or acquire", collocations: ["obtain data", "obtain permission", "easily obtain"], example: "Researchers obtained permission to run the study.", exampleZh: "研究人员获得了开展研究的许可。" },
    {
    pos: "vt.", meaningZh: "获得；达到", meaningEn: "", collocations: [], example: "", exampleZh: "" },
    {
    pos: "vi.", meaningZh: "流行；得到公认", meaningEn: "", collocations: [], example: "", exampleZh: "" }
    ]
  },
  {
    id: "participate", term: "participate", phonetic: "/pɑːˈtɪsɪpeɪt/", pos: "v.", meaningZh: "参与；参加", meaningEn: "to take part in", band: "6", collocations: ["participate in", "actively participate", "participate fully"], example: "Over 500 students participated in the survey.", exampleZh: "超过500名学生参与了这项调查。",
    senses: [
    {
    pos: "v.", meaningZh: "参与；参加", meaningEn: "to take part in", collocations: ["participate in", "actively participate", "participate fully"], example: "Over 500 students participated in the survey.", exampleZh: "超过500名学生参与了这项调查。" },
    {
    pos: "adj.", meaningZh: "共同行动；参与。", meaningEn: "Acting in common; participating.", collocations: [], example: "", exampleZh: "" },
    {
    pos: "vi.", meaningZh: "参加；分享；参与；带有", meaningEn: "", collocations: [], example: "", exampleZh: "" },
    {
    pos: "vt.", meaningZh: "分享；分担", meaningEn: "", collocations: [], example: "", exampleZh: "" }
    ]
  },
  {
    id: "perceive", term: "perceive", phonetic: "/pəˈsiːv/", pos: "v.", meaningZh: "察觉；认为", meaningEn: "to notice or understand", band: "6", collocations: ["perceive as", "widely perceived", "perceive a difference"], example: "The change was perceived as positive.", exampleZh: "这一变化被认为是积极的。",
    senses: [
    {
    pos: "v.", meaningZh: "察觉；认为", meaningEn: "to notice or understand", collocations: ["perceive as", "widely perceived", "perceive a difference"], example: "The change was perceived as positive.", exampleZh: "这一变化被认为是积极的。" },
    {
    pos: "vt.", meaningZh: "感觉；认知；理解；意识到", meaningEn: "", collocations: [], example: "", exampleZh: "" }
    ]
  },
  {
    id: "promote", term: "promote", phonetic: "/pɹəˈməʊt/", pos: "v.", meaningZh: "促进；推广", meaningEn: "to support or advance", band: "6", collocations: ["promote growth", "promote health", "actively promote"], example: "Exercise promotes both fitness and mood.", exampleZh: "运动既促进健康也改善情绪。",
    senses: [
    {
    pos: "v.", meaningZh: "促进；推广", meaningEn: "to support or advance", collocations: ["promote growth", "promote health", "actively promote"], example: "Exercise promotes both fitness and mood.", exampleZh: "运动既促进健康也改善情绪。" },
    {
    pos: "vt.", meaningZh: "促进；晋升；创办；推销；促进；推广；推销", meaningEn: "", collocations: [], example: "", exampleZh: "" }
    ]
  },
  {
    id: "recommend", term: "recommend", phonetic: "/ɹɛkəˈmɛnd/", pos: "v.", meaningZh: "推荐；建议", meaningEn: "to suggest something good", band: "6", collocations: ["strongly recommend", "recommend that", "recommend doing"], example: "I recommend reading the full report.", exampleZh: "我建议阅读完整报告。",
    senses: [
    {
    pos: "v.", meaningZh: "推荐；建议", meaningEn: "to suggest something good", collocations: ["strongly recommend", "recommend that", "recommend doing"], example: "I recommend reading the full report.", exampleZh: "我建议阅读完整报告。" },
    {
    pos: "vt.", meaningZh: "推荐；介绍；劝告；使受欢迎；托付；建议；推荐", meaningEn: "", collocations: [], example: "", exampleZh: "" }
    ]
  },
  {
    id: "reveal", term: "reveal", phonetic: "/ɹəˈviːl/", pos: "v.", meaningZh: "揭示；显露", meaningEn: "to make known", band: "6", collocations: ["reveal the truth", "reveal that", "clearly reveal"], example: "The study revealed a surprising trend.", exampleZh: "研究揭示了一个令人惊讶的趋势。",
    senses: [
    {
    pos: "v.", meaningZh: "揭示；显露", meaningEn: "to make known", collocations: ["reveal the truth", "reveal that", "clearly reveal"], example: "The study revealed a surprising trend.", exampleZh: "研究揭示了一个令人惊讶的趋势。" },
    {
    pos: "n.", meaningZh: "窗侧；门侧", meaningEn: "The outer side of a window or door frame; the jamb.", collocations: [], example: "", exampleZh: "" },
    {
    pos: "vt.", meaningZh: "露出；显示；透露；揭露；泄露；(神)启示", meaningEn: "", collocations: [], example: "", exampleZh: "" }
    ]
  },
  {
    id: "strategy", term: "strategy", phonetic: "/ˈstɹætədʒi/", pos: "n.", meaningZh: "策略；战略", meaningEn: "a plan to achieve a goal", band: "6", collocations: ["marketing strategy", "long-term strategy", "effective strategy"], example: "A clear strategy is key to success.", exampleZh: "清晰的策略是成功的关键。",
    senses: [
    {
    pos: "n.", meaningZh: "策略；战略", meaningEn: "a plan to achieve a goal", collocations: ["marketing strategy", "long-term strategy", "effective strategy"], example: "A clear strategy is key to success.", exampleZh: "清晰的策略是成功的关键。" }
    ]
  },
  {
    id: "sufficient", term: "sufficient", phonetic: "/səˈfɪʃənt/", pos: "adj.", meaningZh: "足够的；充分的", meaningEn: "as much as needed", band: "6", collocations: ["sufficient evidence", "sufficient funds", "not sufficient"], example: "We do not have sufficient data yet.", exampleZh: "我们目前数据还不够。",
    senses: [
    {
    pos: "adj.", meaningZh: "足够的；充分的", meaningEn: "as much as needed", collocations: ["sufficient evidence", "sufficient funds", "not sufficient"], example: "We do not have sufficient data yet.", exampleZh: "我们目前数据还不够。" }
    ]
  },
  {
    id: "aspect", term: "aspect", phonetic: "/ˈæspɛkt/", pos: "n.", meaningZh: "方面；外观；面貌；方向；局面", meaningEn: "a particular part of a situation", band: "6", collocations: ["an important aspect", "every aspect", "key aspect"], example: "Cost is only one aspect of the decision.", exampleZh: "成本只是决策的其中一个方面。",
    senses: [
    {
    pos: "n.", meaningZh: "方面；外观；面貌；方向；局面", meaningEn: "a particular part of a situation", collocations: ["an important aspect", "every aspect", "key aspect"], example: "Cost is only one aspect of the decision.", exampleZh: "成本只是决策的其中一个方面。" },
    {
    pos: "v.", meaningZh: "（行星的）具有特定方面或方面的类型。", meaningEn: "(of a planet) To have a particular aspect or type of aspect.", collocations: [], example: "", exampleZh: "" }
    ]
  },
  {
    id: "coherent", term: "coherent", phonetic: "/kəʊˈhɪərənt/", pos: "adj.", meaningZh: "连贯的；有条理的；互相耦合的；清晰的；明了的，凝聚性的", meaningEn: "logical and consistent", band: "7", collocations: ["coherent argument", "coherent policy", "coherent explanation"], example: "She presented a coherent analysis of the problem.", exampleZh: "她对问题给出了连贯的分析。",
    senses: [
    {
    pos: "adj.", meaningZh: "连贯的；有条理的；互相耦合的；清晰的；明了的，凝聚性的", meaningEn: "logical and consistent", collocations: ["coherent argument", "coherent policy", "coherent explanation"], example: "She presented a coherent analysis of the problem.", exampleZh: "她对问题给出了连贯的分析。" }
    ]
  },
  {
    id: "comprise", term: "comprise", phonetic: "/kəmˈpɹaɪz/", pos: "v.", meaningZh: "由…组成", meaningEn: "to consist of", band: "7", collocations: ["be comprised of", "comprise several parts"], example: "The course comprises ten independent modules.", exampleZh: "该课程由十个独立模块组成。",
    senses: [
    {
    pos: "v.", meaningZh: "由…组成", meaningEn: "to consist of", collocations: ["be comprised of", "comprise several parts"], example: "The course comprises ten independent modules.", exampleZh: "该课程由十个独立模块组成。" },
    {
    pos: "vt.", meaningZh: "包含；构成", meaningEn: "", collocations: [], example: "", exampleZh: "" }
    ]
  },
  {
    id: "emphasize", term: "emphasize", phonetic: "/ˈɛm.fə.saɪz/", pos: "v.", meaningZh: "强调", meaningEn: "to give special importance to", band: "7", collocations: ["emphasize the importance", "strongly emphasize", "emphasize that"], example: "The report emphasizes the importance of early training.", exampleZh: "报告强调了早期培训的重要性。",
    senses: [
    {
    pos: "v.", meaningZh: "强调", meaningEn: "to give special importance to", collocations: ["emphasize the importance", "strongly emphasize", "emphasize that"], example: "The report emphasizes the importance of early training.", exampleZh: "报告强调了早期培训的重要性。" },
    {
    pos: "vt.", meaningZh: "强调；加强语气；着重", meaningEn: "", collocations: [], example: "", exampleZh: "" }
    ]
  },
  {
    id: "integrate", term: "integrate", phonetic: "/ˈɪntəɡɹeɪt/", pos: "v.", meaningZh: "整合；使融入", meaningEn: "to combine or bring together", band: "7", collocations: ["integrate into", "integrate with", "integrate theory and practice"], example: "We should integrate theory with real-world practice.", exampleZh: "我们应将理论与实践相结合。",
    senses: [
    {
    pos: "v.", meaningZh: "整合；使融入", meaningEn: "to combine or bring together", collocations: ["integrate into", "integrate with", "integrate theory and practice"], example: "We should integrate theory with real-world practice.", exampleZh: "我们应将理论与实践相结合。" },
    {
    pos: "vt.", meaningZh: "综合；使完整；使成整体", meaningEn: "", collocations: [], example: "", exampleZh: "" },
    {
    pos: "vi.", meaningZh: "成一体", meaningEn: "", collocations: [], example: "", exampleZh: "" },
    {
    pos: "adj.", meaningZh: "完整的；完全的", meaningEn: "", collocations: [], example: "", exampleZh: "" }
    ]
  },
  {
    id: "ambiguity", term: "ambiguity", phonetic: "/ˌæmbɪˈɡjuːəti/", pos: "n.", meaningZh: "歧义；含糊；不明确；二义性；多义性", meaningEn: "the quality of having more than one possible meaning", band: "7", collocations: ["avoid ambiguity", "ambiguity in", "resolve ambiguity"], example: "Academic writing should avoid ambiguity and vagueness.", exampleZh: "学术写作应避免歧义与含糊。",
    senses: [
    {
    pos: "n.", meaningZh: "歧义；含糊；不明确；二义性；多义性", meaningEn: "the quality of having more than one possible meaning", collocations: ["avoid ambiguity", "ambiguity in", "resolve ambiguity"], example: "Academic writing should avoid ambiguity and vagueness.", exampleZh: "学术写作应避免歧义与含糊。" }
    ]
  },
  {
    id: "conceptual", term: "conceptual", phonetic: "/kənˈseptʃuəl/", pos: "adj.", meaningZh: "概念上的；概念的", meaningEn: "relating to ideas or mental concepts", band: "7", collocations: ["conceptual framework", "conceptual understanding", "conceptual model"], example: "Students need a strong conceptual framework before applying methods.", exampleZh: "学生在运用方法前需要扎实的概念框架。",
    senses: [
    {
    pos: "adj.", meaningZh: "概念上的；概念的", meaningEn: "relating to ideas or mental concepts", collocations: ["conceptual framework", "conceptual understanding", "conceptual model"], example: "Students need a strong conceptual framework before applying methods.", exampleZh: "学生在运用方法前需要扎实的概念框架。" }
    ]
  },
  {
    id: "hierarchy", term: "hierarchy", phonetic: "/ˈhaɪ.ə.ɹɑː(ɹ).ki/", pos: "n.", meaningZh: "等级体系；层级；等级制度；僧侣统治；分级结构；分层结构；新闻组；新闻组分层", meaningEn: "a system ranked one level above another", band: "7", collocations: ["social hierarchy", "strict hierarchy", "hierarchy of"], example: "The report questions the traditional hierarchy of the workplace.", exampleZh: "该报告质疑了职场传统的等级体系。",
    senses: [
    {
    pos: "n.", meaningZh: "等级体系；层级；等级制度；僧侣统治；分级结构；分层结构；新闻组；新闻组分层", meaningEn: "a system ranked one level above another", collocations: ["social hierarchy", "strict hierarchy", "hierarchy of"], example: "The report questions the traditional hierarchy of the workplace.", exampleZh: "该报告质疑了职场传统的等级体系。" }
    ]
  },
  {
    id: "paradigm", term: "paradigm", phonetic: "/ˈpæ.ɹə.daɪm/", pos: "n.", meaningZh: "范式；典范；范例；式样；词形变化表；纵聚合关系语言项", meaningEn: "a typical example or model of how something works", band: "7", collocations: ["paradigm shift", "a new paradigm", "theoretical paradigm"], example: "The discovery led to a paradigm shift in medicine.", exampleZh: "这一发现带来了医学上的范式转变。",
    senses: [
    {
    pos: "n.", meaningZh: "范式；典范；范例；式样；词形变化表；纵聚合关系语言项", meaningEn: "a typical example or model of how something works", collocations: ["paradigm shift", "a new paradigm", "theoretical paradigm"], example: "The discovery led to a paradigm shift in medicine.", exampleZh: "这一发现带来了医学上的范式转变。" }
    ]
  },
  {
    id: "subsequently", term: "subsequently", phonetic: "/ˈsʌb.sɪ.kwənt.li/", pos: "adv.", meaningZh: "随后；后来", meaningEn: "after something else has happened", band: "7", collocations: ["and subsequently", "subsequently published", "subsequently found"], example: "The theory was proposed in 1990 and subsequently refined.", exampleZh: "该理论于 1990 年提出，随后不断被完善。",
    senses: [
    {
    pos: "adv.", meaningZh: "随后；后来", meaningEn: "after something else has happened", collocations: ["and subsequently", "subsequently published", "subsequently found"], example: "The theory was proposed in 1990 and subsequently refined.", exampleZh: "该理论于 1990 年提出，随后不断被完善。" }
    ]
  },
  {
    id: "undermine", term: "undermine", phonetic: "/ʌndəˈmaɪn/", pos: "v.", meaningZh: "削弱；损害", meaningEn: "to weaken or damage gradually", band: "7", collocations: ["undermine confidence", "undermine trust", "undermine the argument"], example: "Constant criticism can undermine a student’s confidence.", exampleZh: "持续的批评会削弱学生的自信。",
    senses: [
    {
    pos: "v.", meaningZh: "削弱；损害", meaningEn: "to weaken or damage gradually", collocations: ["undermine confidence", "undermine trust", "undermine the argument"], example: "Constant criticism can undermine a student’s confidence.", exampleZh: "持续的批评会削弱学生的自信。" },
    {
    pos: "vt.", meaningZh: "在...下面挖；渐渐破坏；暗地里破坏；暗中破坏；以阴谋中伤伤害", meaningEn: "", collocations: [], example: "", exampleZh: "" }
    ]
  },
  {
    id: "vicinity", term: "vicinity", phonetic: "/vəˈsɪnəti/", pos: "n.", meaningZh: "附近；邻近；附近地区；近处", meaningEn: "the area around a particular place", band: "7", collocations: ["in the vicinity", "close vicinity", "immediate vicinity"], example: "There are several cafés in the vicinity of the campus.", exampleZh: "校园附近有几家咖啡馆。",
    senses: [
    {
    pos: "n.", meaningZh: "附近；邻近；附近地区；近处", meaningEn: "the area around a particular place", collocations: ["in the vicinity", "close vicinity", "immediate vicinity"], example: "There are several cafés in the vicinity of the campus.", exampleZh: "校园附近有几家咖啡馆。" }
    ]
  },
  {
    id: "discriminate", term: "discriminate", phonetic: "/dɪsˈkɹɪmɪneɪt/", pos: "v.", meaningZh: "区分；辨别；区别；差别待遇", meaningEn: "to recognize a clear difference between things", band: "7", collocations: ["discriminate between", "discriminate clearly", "discriminate among"], example: "Readers should discriminate between fact and opinion.", exampleZh: "读者应当区分事实与观点。",
    senses: [
    {
    pos: "v.", meaningZh: "区分；辨别；区别；差别待遇", meaningEn: "to recognize a clear difference between things", collocations: ["discriminate between", "discriminate clearly", "discriminate among"], example: "Readers should discriminate between fact and opinion.", exampleZh: "读者应当区分事实与观点。" },
    {
    pos: "adj.", meaningZh: "标记差异；由某些代币区分。", meaningEn: "Having the difference marked; distinguished by certain tokens.", collocations: [], example: "", exampleZh: "" }
    ]
  },
  {
    id: "alleviate", term: "alleviate", phonetic: "/əˈli.vi.eɪt/", pos: "v.", meaningZh: "减轻；缓解", meaningEn: "to make suffering less", band: "7", collocations: ["alleviate poverty", "alleviate pain", "alleviate pressure"], example: "New policies aim to alleviate rural poverty.", exampleZh: "新政策旨在缓解农村贫困。",
    senses: [
    {
    pos: "v.", meaningZh: "减轻；缓解", meaningEn: "to make suffering less", collocations: ["alleviate poverty", "alleviate pain", "alleviate pressure"], example: "New policies aim to alleviate rural poverty.", exampleZh: "新政策旨在缓解农村贫困。" },
    {
    pos: "vt.", meaningZh: "减轻；使缓和", meaningEn: "", collocations: [], example: "", exampleZh: "" }
    ]
  },
  {
    id: "arbitrary", term: "arbitrary", phonetic: "/ˈɑɹ.bɪ.tɹɛ(ə).ɹi/", pos: "adj.", meaningZh: "任意的；武断的；专治的；霸道的", meaningEn: "based on chance, not reason", band: "7", collocations: ["arbitrary decision", "arbitrary rule", "seem arbitrary"], example: "The fine seemed completely arbitrary.", exampleZh: "这笔罚款看起来完全武断。",
    senses: [
    {
    pos: "adj.", meaningZh: "任意的；武断的；专治的；霸道的", meaningEn: "based on chance, not reason", collocations: ["arbitrary decision", "arbitrary rule", "seem arbitrary"], example: "The fine seemed completely arbitrary.", exampleZh: "这笔罚款看起来完全武断。" },
    {
    pos: "n.", meaningZh: "任何任意因素，例如算术值或费用。", meaningEn: "Anything arbitrary, such as an arithmetical value or a fee.", collocations: [], example: "", exampleZh: "" }
    ]
  },
  {
    id: "articulate", term: "articulate", phonetic: "/ɑː(ɹ)ˈtɪk.jʊ.lət/", pos: "v. / adj.", meaningZh: "清晰表达；口齿伶俐的", meaningEn: "to express clearly", band: "7", collocations: ["articulate ideas", "clearly articulate", "articulate a view"], example: "She articulated her concerns with great clarity.", exampleZh: "她非常清晰地表达了自己的担忧。",
    senses: [
    {
    pos: "v. / adj.", meaningZh: "清晰表达；口齿伶俐的", meaningEn: "to express clearly", collocations: ["articulate ideas", "clearly articulate", "articulate a view"], example: "She articulated her concerns with great clarity.", exampleZh: "她非常清晰地表达了自己的担忧。" },
    {
    pos: "n.", meaningZh: "", meaningEn: "An animal of the subkingdom Articulata.", collocations: [], example: "", exampleZh: "" },
    {
    pos: "adj.", meaningZh: "发音清晰的；口才好的", meaningEn: "Clear; effective.", collocations: [], example: "", exampleZh: "" },
    {
    pos: "vt.", meaningZh: "明白地说；以关节连接；使成为系统的整体", meaningEn: "", collocations: [], example: "", exampleZh: "" }
    ]
  },
  {
    id: "attribute", term: "attribute", phonetic: "/əˈtrɪbjuːt/", pos: "v.", meaningZh: "归因于；特性", meaningEn: "to regard as caused by", band: "7", collocations: ["attribute to", "attribute success to", "commonly attributed"], example: "Many benefits are attributed to regular exercise.", exampleZh: "许多益处被归因于规律运动。",
    senses: [
    {
    pos: "v.", meaningZh: "归因于；特性", meaningEn: "to regard as caused by", collocations: ["attribute to", "attribute success to", "commonly attributed"], example: "Many benefits are attributed to regular exercise.", exampleZh: "许多益处被归因于规律运动。" },
    {
    pos: "n.", meaningZh: "属性；标志；定语", meaningEn: "A characteristic or quality of a thing.", collocations: [], example: "His finest attribute is his kindness.", exampleZh: "" },
    {
    pos: "vt.", meaningZh: "把...归于；认为...属于；属性", meaningEn: "", collocations: [], example: "", exampleZh: "" }
    ]
  },
  {
    id: "autonomous", term: "autonomous", phonetic: "/ɔːˈtɒnəməs/", pos: "adj.", meaningZh: "自治的；自主的", meaningEn: "self-governing", band: "7", collocations: ["autonomous region", "autonomous vehicle", "remain autonomous"], example: "The team was given an autonomous budget.", exampleZh: "该团队获得了自主预算权。",
    senses: [
    {
    pos: "adj.", meaningZh: "自治的；自主的", meaningEn: "self-governing", collocations: ["autonomous region", "autonomous vehicle", "remain autonomous"], example: "The team was given an autonomous budget.", exampleZh: "该团队获得了自主预算权。" }
    ]
  },
  {
    id: "bias", term: "bias", phonetic: "/ˈbaɪəs/", pos: "n. / v.", meaningZh: "偏见；偏向；斜纹", meaningEn: "unfair favour or prejudice", band: "7", collocations: ["cultural bias", "cognitive bias", "unconscious bias"], example: "The test showed a clear gender bias.", exampleZh: "该测试显示出明显的性别偏见。",
    senses: [
    {
    pos: "n. / v.", meaningZh: "偏见；偏向；斜纹", meaningEn: "unfair favour or prejudice", collocations: ["cultural bias", "cognitive bias", "unconscious bias"], example: "The test showed a clear gender bias.", exampleZh: "该测试显示出明显的性别偏见。" },
    {
    pos: "v.", meaningZh: "施加偏见；施加影响。", meaningEn: "To place bias upon; to influence.", collocations: [], example: "Our prejudices bias our views.", exampleZh: "" },
    {
    pos: "adj.", meaningZh: "偏斜的", meaningEn: "Inclined to one side; swelled on one side.", collocations: [], example: "", exampleZh: "" },
    {
    pos: "adv.", meaningZh: "偏斜", meaningEn: "In a slanting manner; crosswise; obliquely; diagonally.", collocations: [], example: "to cut cloth bias", exampleZh: "" },
    {
    pos: "vt.", meaningZh: "使有偏见；偏流；偏压；偏磁；偏离", meaningEn: "", collocations: [], example: "", exampleZh: "" }
    ]
  },
  {
    id: "compensate", term: "compensate", phonetic: "/ˈkɒm.pən.seɪt/", pos: "v.", meaningZh: "补偿；赔偿；偿还；付报酬", meaningEn: "to make up for", band: "7", collocations: ["compensate for", "compensate workers", "fairly compensate"], example: "Higher pay compensates for long hours.", exampleZh: "更高的薪酬弥补了长工时。",
    senses: [
    {
    pos: "v.", meaningZh: "补偿；赔偿；偿还；付报酬", meaningEn: "to make up for", collocations: ["compensate for", "compensate workers", "fairly compensate"], example: "Higher pay compensates for long hours.", exampleZh: "更高的薪酬弥补了长工时。" }
    ]
  },
  {
    id: "complement", term: "complement", phonetic: "/ˈkɒmpləmənt/", pos: "v. / n.", meaningZh: "补充；complement", meaningEn: "something that completes", band: "7", collocations: ["complement each other", "perfectly complement", "a useful complement"], example: "Theory and practice complement each other.", exampleZh: "理论与实践互为补充。",
    senses: [
    {
    pos: "v. / n.", meaningZh: "补充；complement", meaningEn: "something that completes", collocations: ["complement each other", "perfectly complement", "a useful complement"], example: "Theory and practice complement each other.", exampleZh: "理论与实践互为补充。" },
    {
    pos: "n.", meaningZh: "补足物；补语；补数", meaningEn: "A protective substance that exists in the serum or other bodily fluid and is capable of killing microorganisms; complement.", collocations: [], example: "", exampleZh: "" },
    {
    pos: "vt.", meaningZh: "补充；补足；补码；反相器；补数", meaningEn: "", collocations: [], example: "", exampleZh: "" }
    ]
  },
  {
    id: "comprehensive", term: "comprehensive", phonetic: "/ˌkɒm.pɹɪˈhɛn.sɪv/", pos: "adj.", meaningZh: "全面的；综合的；广泛的；有理解力的", meaningEn: "covering everything", band: "7", collocations: ["comprehensive review", "comprehensive policy", "comprehensive study"], example: "A comprehensive plan addresses every risk.", exampleZh: "一份全面的计划应对了所有风险。",
    senses: [
    {
    pos: "adj.", meaningZh: "全面的；综合的；广泛的；有理解力的", meaningEn: "covering everything", collocations: ["comprehensive review", "comprehensive policy", "comprehensive study"], example: "A comprehensive plan addresses every risk.", exampleZh: "一份全面的计划应对了所有风险。" },
    {
    pos: "n.", meaningZh: "一所综合性学校。", meaningEn: "A comprehensive school.", collocations: [], example: "", exampleZh: "" }
    ]
  },
  {
    id: "condemn", term: "condemn", phonetic: "/kənˈdɛm/", pos: "v.", meaningZh: "谴责", meaningEn: "to express strong disapproval", band: "7", collocations: ["condemn violence", "widely condemned", "strongly condemn"], example: "Leaders condemned the attack.", exampleZh: "各方领导人谴责了这次袭击。",
    senses: [
    {
    pos: "v.", meaningZh: "谴责", meaningEn: "to express strong disapproval", collocations: ["condemn violence", "widely condemned", "strongly condemn"], example: "Leaders condemned the attack.", exampleZh: "各方领导人谴责了这次袭击。" },
    {
    pos: "vt.", meaningZh: "判刑；责备；谴责；定罪；判刑；宣告有罪", meaningEn: "", collocations: [], example: "", exampleZh: "" }
    ]
  },
  {
    id: "consequent", term: "consequent", phonetic: "/ˈkɑn.sɪ.kwənt/", pos: "adj.", meaningZh: "随之发生的；作为结果的；合乎逻辑的", meaningEn: "following as a result", band: "7", collocations: ["consequent rise", "consequent loss", "consequent changes"], example: "The storm and consequent flooding displaced many.", exampleZh: "暴风雨及其引发的水灾使许多人流离失所。",
    senses: [
    {
    pos: "adj.", meaningZh: "随之发生的；作为结果的；合乎逻辑的", meaningEn: "following as a result", collocations: ["consequent rise", "consequent loss", "consequent changes"], example: "The storm and consequent flooding displaced many.", exampleZh: "暴风雨及其引发的水灾使许多人流离失所。" },
    {
    pos: "n.", meaningZh: "随后发生的事情；结果", meaningEn: "The second half of a hypothetical proposition; Q, if the form of the proposition is \"If P, then Q.\"", collocations: [], example: "", exampleZh: "" }
    ]
  },
  {
    id: "consistent", term: "consistent", phonetic: "/kənˈsɪstənt/", pos: "adj.", meaningZh: "一致的；始终如一的；坚持的；并立的；坚固的", meaningEn: "not changing, logical", band: "7", collocations: ["consistent with", "consistent results", "remain consistent"], example: "The findings are consistent with earlier studies.", exampleZh: "这些发现与此前的研究一致。",
    senses: [
    {
    pos: "adj.", meaningZh: "一致的；始终如一的；坚持的；并立的；坚固的", meaningEn: "not changing, logical", collocations: ["consistent with", "consistent results", "remain consistent"], example: "The findings are consistent with earlier studies.", exampleZh: "这些发现与此前的研究一致。" },
    {
    pos: "n.", meaningZh: "（复数形式）共存或彼此一致的对象或事实。", meaningEn: "(in the plural) Objects or facts that are coexistent, or in agreement with one another.", collocations: [], example: "", exampleZh: "" }
    ]
  },
  {
    id: "constitute", term: "constitute", phonetic: "/ˈkɒnstɪtjuːt/", pos: "v.", meaningZh: "构成；组成", meaningEn: "to form or make up", band: "7", collocations: ["constitute a risk", "constitute a threat", "constitute the majority"], example: "These factors constitute a major challenge.", exampleZh: "这些因素构成了一个重大挑战。",
    senses: [
    {
    pos: "v.", meaningZh: "构成；组成", meaningEn: "to form or make up", collocations: ["constitute a risk", "constitute a threat", "constitute the majority"], example: "These factors constitute a major challenge.", exampleZh: "这些因素构成了一个重大挑战。" },
    {
    pos: "n.", meaningZh: "既定法律。", meaningEn: "An established law.", collocations: [], example: "", exampleZh: "" },
    {
    pos: "vt.", meaningZh: "构成；组成；任命；构造；组成", meaningEn: "", collocations: [], example: "", exampleZh: "" }
    ]
  },
  {
    id: "contemporary", term: "contemporary", phonetic: "/kənˈtɛm.p(ə).ɹi/", pos: "adj.", meaningZh: "当代的；同时代的；属于同一时期的", meaningEn: "modern; from the same time", band: "7", collocations: ["contemporary art", "contemporary society", "contemporary issue"], example: "Contemporary music reflects modern life.", exampleZh: "当代音乐反映了现代生活。",
    senses: [
    {
    pos: "adj.", meaningZh: "当代的；同时代的；属于同一时期的", meaningEn: "modern; from the same time", collocations: ["contemporary art", "contemporary society", "contemporary issue"], example: "Contemporary music reflects modern life.", exampleZh: "当代音乐反映了现代生活。" },
    {
    pos: "n.", meaningZh: "同时代的人", meaningEn: "Someone or something living at the same time, or of roughly the same age as another.", collocations: [], example: "Cervantes was a contemporary of Shakespeare.", exampleZh: "" }
    ]
  },
  {
    id: "contradict", term: "contradict", phonetic: "/kɒntɹəˈdɪkt/", pos: "v.", meaningZh: "反驳；与…矛盾", meaningEn: "to say the opposite", band: "7", collocations: ["contradict a claim", "directly contradict", "contradict evidence"], example: "New data contradict the old theory.", exampleZh: "新数据与该旧理论相矛盾。",
    senses: [
    {
    pos: "v.", meaningZh: "反驳；与…矛盾", meaningEn: "to say the opposite", collocations: ["contradict a claim", "directly contradict", "contradict evidence"], example: "New data contradict the old theory.", exampleZh: "新数据与该旧理论相矛盾。" },
    {
    pos: "vt.", meaningZh: "反驳；与...抵触；与...矛盾", meaningEn: "", collocations: [], example: "", exampleZh: "" },
    {
    pos: "vi.", meaningZh: "反驳", meaningEn: "", collocations: [], example: "", exampleZh: "" }
    ]
  },
  {
    id: "controversial", term: "controversial", phonetic: "/kɒn.tɹə.ˈvɜː.sjəl/", pos: "adj.", meaningZh: "有争议的；争论的；论争的；被议论的", meaningEn: "causing disagreement", band: "7", collocations: ["controversial issue", "highly controversial", "controversial decision"], example: "The tax reform is highly controversial.", exampleZh: "这项税改极具争议。",
    senses: [
    {
    pos: "adj.", meaningZh: "有争议的；争论的；论争的；被议论的", meaningEn: "causing disagreement", collocations: ["controversial issue", "highly controversial", "controversial decision"], example: "The tax reform is highly controversial.", exampleZh: "这项税改极具争议。" }
    ]
  },
  {
    id: "converge", term: "converge", phonetic: "/kən.ˈvɜːdʒ/", pos: "v.", meaningZh: "汇聚；趋同", meaningEn: "to come together", band: "7", collocations: ["converge on", "converge at", "gradually converge"], example: "The two roads converge at the bridge.", exampleZh: "两条路在桥处汇合。",
    senses: [
    {
    pos: "v.", meaningZh: "汇聚；趋同", meaningEn: "to come together", collocations: ["converge on", "converge at", "gradually converge"], example: "The two roads converge at the bridge.", exampleZh: "两条路在桥处汇合。" },
    {
    pos: "vi.", meaningZh: "聚合；集中于一点", meaningEn: "", collocations: [], example: "", exampleZh: "" },
    {
    pos: "vt.", meaningZh: "使集合", meaningEn: "", collocations: [], example: "", exampleZh: "" }
    ]
  },
  {
    id: "crucial", term: "crucial", phonetic: "/ˈkɹuː.ʃəl/", pos: "adj.", meaningZh: "关键的；至关重要的；决定性的；严厉的；十字形的；决断的；定局的", meaningEn: "extremely important", band: "7", collocations: ["crucial role", "crucial factor", "crucial for"], example: "Sleep is crucial for memory formation.", exampleZh: "睡眠对记忆形成至关重要。",
    senses: [
    {
    pos: "adj.", meaningZh: "关键的；至关重要的；决定性的；严厉的；十字形的；决断的；定局的", meaningEn: "extremely important", collocations: ["crucial role", "crucial factor", "crucial for"], example: "Sleep is crucial for memory formation.", exampleZh: "睡眠对记忆形成至关重要。" }
    ]
  },
  {
    id: "cumulative", term: "cumulative", phonetic: "/ˈkjuːmjʊlətɪv/", pos: "adj.", meaningZh: "累积的；蓄积的", meaningEn: "increasing by addition", band: "7", collocations: ["cumulative effect", "cumulative impact", "cumulative total"], example: "The cumulative cost surprised the committee.", exampleZh: "累积成本令委员会大为吃惊。",
    senses: [
    {
    pos: "adj.", meaningZh: "累积的；蓄积的", meaningEn: "increasing by addition", collocations: ["cumulative effect", "cumulative impact", "cumulative total"], example: "The cumulative cost surprised the committee.", exampleZh: "累积成本令委员会大为吃惊。" }
    ]
  },
  {
    id: "deliberate", term: "deliberate", phonetic: "/dɪˈlɪbərət/", pos: "adj. / v.", meaningZh: "故意的；深思熟虑；深思熟虑的；从容的", meaningEn: "done on purpose; to consider", band: "7", collocations: ["deliberate mistake", "deliberate act", "carefully deliberate"], example: "The damage appeared to be deliberate.", exampleZh: "损害似乎是蓄意的。",
    senses: [
    {
    pos: "adj. / v.", meaningZh: "故意的；深思熟虑；深思熟虑的；从容的", meaningEn: "done on purpose; to consider", collocations: ["deliberate mistake", "deliberate act", "carefully deliberate"], example: "The damage appeared to be deliberate.", exampleZh: "损害似乎是蓄意的。" },
    {
    pos: "v.", meaningZh: "仔细考虑", meaningEn: "To consider carefully; to weigh well in the mind.", collocations: [], example: "It is now time for the jury to deliberate the guilt of the defendant.", exampleZh: "" }
    ]
  },
  {
    id: "depict", term: "depict", phonetic: "/dɪˈpɪkt/", pos: "v.", meaningZh: "描绘；描写", meaningEn: "to show or describe", band: "7", collocations: ["depict a scene", "depict as", "vividly depict"], example: "The novel depicts life in a small town.", exampleZh: "小说描绘了一个小镇的生活。",
    senses: [
    {
    pos: "v.", meaningZh: "描绘；描写", meaningEn: "to show or describe", collocations: ["depict a scene", "depict as", "vividly depict"], example: "The novel depicts life in a small town.", exampleZh: "小说描绘了一个小镇的生活。" },
    {
    pos: "vt.", meaningZh: "描述；描写", meaningEn: "", collocations: [], example: "", exampleZh: "" }
    ]
  },
  {
    id: "derive", term: "derive", phonetic: "/dəˈɹaɪv/", pos: "v.", meaningZh: "源自；获得", meaningEn: "to get from a source", band: "7", collocations: ["derive from", "derive benefit", "derive pleasure"], example: "Many words derive from Latin.", exampleZh: "许多单词源自拉丁语。",
    senses: [
    {
    pos: "v.", meaningZh: "源自；获得", meaningEn: "to get from a source", collocations: ["derive from", "derive benefit", "derive pleasure"], example: "Many words derive from Latin.", exampleZh: "许多单词源自拉丁语。" },
    {
    pos: "vt.", meaningZh: "得自", meaningEn: "", collocations: [], example: "", exampleZh: "" },
    {
    pos: "vi.", meaningZh: "起源", meaningEn: "", collocations: [], example: "", exampleZh: "" }
    ]
  },
  {
    id: "diminish", term: "diminish", phonetic: "/dɪˈmɪnɪʃ/", pos: "v.", meaningZh: "减少；削弱；(使)减少；(使)变小", meaningEn: "to make or become less", band: "7", collocations: ["diminish over time", "diminish confidence", "gradually diminish"], example: "Public trust has diminished.", exampleZh: "公众信任已下降。",
    senses: [
    {
    pos: "v.", meaningZh: "减少；削弱；(使)减少；(使)变小", meaningEn: "to make or become less", collocations: ["diminish over time", "diminish confidence", "gradually diminish"], example: "Public trust has diminished.", exampleZh: "公众信任已下降。" }
    ]
  },
  {
    id: "discrete", term: "discrete", phonetic: "/dɪsˈkɹiːt/", pos: "adj.", meaningZh: "离散的；独立的；不连续的", meaningEn: "separate, individual", band: "7", collocations: ["discrete units", "discrete steps", "discrete categories"], example: "The course is split into discrete modules.", exampleZh: "课程被拆分成独立的模块。",
    senses: [
    {
    pos: "adj.", meaningZh: "离散的；独立的；不连续的", meaningEn: "separate, individual", collocations: ["discrete units", "discrete steps", "discrete categories"], example: "The course is split into discrete modules.", exampleZh: "课程被拆分成独立的模块。" }
    ]
  },
  {
    id: "diverse", term: "diverse", phonetic: "/daɪˈvɜːs/", pos: "adj.", meaningZh: "多样的；不同的；变化多的", meaningEn: "varied, different", band: "7", collocations: ["culturally diverse", "diverse range", "diverse views"], example: "The city has a diverse population.", exampleZh: "这座城市人口多元。",
    senses: [
    {
    pos: "adj.", meaningZh: "多样的；不同的；变化多的", meaningEn: "varied, different", collocations: ["culturally diverse", "diverse range", "diverse views"], example: "The city has a diverse population.", exampleZh: "这座城市人口多元。" },
    {
    pos: "adv.", meaningZh: "在不同的方向；多样化。", meaningEn: "In different directions; diversely.", collocations: [], example: "", exampleZh: "" }
    ]
  },
  {
    id: "domain", term: "domain", phonetic: "/dəʊˈmeɪn/", pos: "n.", meaningZh: "领域；范畴；领土；产业；范围；区域；支配命令", meaningEn: "a field of activity", band: "7", collocations: ["in the domain", "public domain", "specific domain"], example: "This lies outside my domain of expertise.", exampleZh: "这超出了我的专业领域。",
    senses: [
    {
    pos: "n.", meaningZh: "领域；范畴；领土；产业；范围；区域；支配命令", meaningEn: "a field of activity", collocations: ["in the domain", "public domain", "specific domain"], example: "This lies outside my domain of expertise.", exampleZh: "这超出了我的专业领域。" }
    ]
  },
  {
    id: "dynamic", term: "dynamic", phonetic: "/daɪˈnæ.mɪk/", pos: "adj. / n.", meaningZh: "动态的；充满活力的；有活力的；有力的；动力的；不断变化的", meaningEn: "continuously changing; energetic", band: "7", collocations: ["dynamic market", "social dynamics", "dynamic process"], example: "The job requires a dynamic approach.", exampleZh: "这份工作需要灵活的应对方式。",
    senses: [
    {
    pos: "adj. / n.", meaningZh: "动态的；充满活力的；有活力的；有力的；动力的；不断变化的", meaningEn: "continuously changing; energetic", collocations: ["dynamic market", "social dynamics", "dynamic process"], example: "The job requires a dynamic approach.", exampleZh: "这份工作需要灵活的应对方式。" },
    {
    pos: "n.", meaningZh: "动力；动态；动态的", meaningEn: "A characteristic or manner of an interaction; a behavior.", collocations: [], example: "Watch the dynamic between the husband and wife when they disagree.", exampleZh: "" }
    ]
  },
  {
    id: "eliminate", term: "eliminate", phonetic: "/ɪˈlɪməneɪt/", pos: "v.", meaningZh: "消除；排除", meaningEn: "to remove completely", band: "7", collocations: ["eliminate poverty", "eliminate errors", "eliminate risk"], example: "The new step eliminates a common error.", exampleZh: "新步骤消除了一个常见错误。",
    senses: [
    {
    pos: "v.", meaningZh: "消除；排除", meaningEn: "to remove completely", collocations: ["eliminate poverty", "eliminate errors", "eliminate risk"], example: "The new step eliminates a common error.", exampleZh: "新步骤消除了一个常见错误。" },
    {
    pos: "vt.", meaningZh: "除去；排除；剔除；消除", meaningEn: "", collocations: [], example: "", exampleZh: "" }
    ]
  },
  {
    id: "empirical", term: "empirical", phonetic: "/ɪmˈpɪɹɪkəl/", pos: "adj.", meaningZh: "实证的；经验主义的；完全跟据经验的", meaningEn: "based on observation", band: "7", collocations: ["empirical evidence", "empirical study", "empirical data"], example: "The claim lacks empirical support.", exampleZh: "该主张缺乏实证支持。",
    senses: [
    {
    pos: "adj.", meaningZh: "实证的；经验主义的；完全跟据经验的", meaningEn: "based on observation", collocations: ["empirical evidence", "empirical study", "empirical data"], example: "The claim lacks empirical support.", exampleZh: "该主张缺乏实证支持。" }
    ]
  },
  {
    id: "enhance", term: "enhance", phonetic: "/ɪnˈhɑːns/", pos: "v.", meaningZh: "增强；提升", meaningEn: "to improve or increase", band: "7", collocations: ["enhance performance", "enhance quality", "enhance understanding"], example: "Training enhances employee skills.", exampleZh: "培训提升了员工技能。",
    senses: [
    {
    pos: "v.", meaningZh: "增强；提升", meaningEn: "to improve or increase", collocations: ["enhance performance", "enhance quality", "enhance understanding"], example: "Training enhances employee skills.", exampleZh: "培训提升了员工技能。" },
    {
    pos: "vt.", meaningZh: "提高；加强；增加", meaningEn: "", collocations: [], example: "", exampleZh: "" }
    ]
  },
  {
    id: "estimate", term: "estimate", phonetic: "/ˈɛstɨmɨt/", pos: "v. / n.", meaningZh: "估计；估算", meaningEn: "to roughly calculate", band: "7", collocations: ["estimate the cost", "rough estimate", "estimate that"], example: "We estimate the project will take a year.", exampleZh: "我们估计该项目需要一年时间。",
    senses: [
    {
    pos: "v. / n.", meaningZh: "估计；估算", meaningEn: "to roughly calculate", collocations: ["estimate the cost", "rough estimate", "estimate that"], example: "We estimate the project will take a year.", exampleZh: "我们估计该项目需要一年时间。" },
    {
    pos: "n.", meaningZh: "估计；判断", meaningEn: "A rough calculation or assessment of the value, size, or cost of something.", collocations: [], example: "", exampleZh: "" },
    {
    pos: "vt.", meaningZh: "估计；评价；判断", meaningEn: "", collocations: [], example: "", exampleZh: "" },
    {
    pos: "vi.", meaningZh: "估计", meaningEn: "", collocations: [], example: "", exampleZh: "" }
    ]
  },
  {
    id: "evident", term: "evident", phonetic: "/ˈevɪdənt/", pos: "adj.", meaningZh: "明显的；显然的", meaningEn: "clear to see", band: "7", collocations: ["clearly evident", "evident from", "become evident"], example: "The benefits were evident within weeks.", exampleZh: "几周内益处便显而易见。",
    senses: [
    {
    pos: "adj.", meaningZh: "明显的；显然的", meaningEn: "clear to see", collocations: ["clearly evident", "evident from", "become evident"], example: "The benefits were evident within weeks.", exampleZh: "几周内益处便显而易见。" }
    ]
  },
  {
    id: "evolve", term: "evolve", phonetic: "/ɪˈvɒlv/", pos: "v.", meaningZh: "进化；演变", meaningEn: "to develop gradually", band: "7", collocations: ["evolve into", "evolve over time", "continuously evolve"], example: "Language evolves with society.", exampleZh: "语言随社会而演变。",
    senses: [
    {
    pos: "v.", meaningZh: "进化；演变", meaningEn: "to develop gradually", collocations: ["evolve into", "evolve over time", "continuously evolve"], example: "Language evolves with society.", exampleZh: "语言随社会而演变。" },
    {
    pos: "vi.", meaningZh: "进展；进化；展开", meaningEn: "", collocations: [], example: "", exampleZh: "" },
    {
    pos: "vt.", meaningZh: "使发展；使推断出；使进化", meaningEn: "", collocations: [], example: "", exampleZh: "" }
    ]
  },
  {
    id: "exacerbate", term: "exacerbate", phonetic: "/ɪkˈsæs-/", pos: "v.", meaningZh: "加剧；使恶化", meaningEn: "to make worse", band: "7", collocations: ["exacerbate the problem", "exacerbate tensions", "further exacerbate"], example: "The tax cut may exacerbate inequality.", exampleZh: "减税可能加剧不平等。",
    senses: [
    {
    pos: "v.", meaningZh: "加剧；使恶化", meaningEn: "to make worse", collocations: ["exacerbate the problem", "exacerbate tensions", "further exacerbate"], example: "The tax cut may exacerbate inequality.", exampleZh: "减税可能加剧不平等。" },
    {
    pos: "vt.", meaningZh: "使恶化；使增剧；激怒；使加剧", meaningEn: "", collocations: [], example: "", exampleZh: "" }
    ]
  },
  {
    id: "exhibit", term: "exhibit", phonetic: "/ɛɡ-/", pos: "v.", meaningZh: "展示；表现出", meaningEn: "to show or display", band: "7", collocations: ["exhibit behaviour", "exhibit a trend", "publicly exhibit"], example: "Children exhibit different learning styles.", exampleZh: "儿童表现出不同的学习风格。",
    senses: [
    {
    pos: "v.", meaningZh: "展示；表现出", meaningEn: "to show or display", collocations: ["exhibit behaviour", "exhibit a trend", "publicly exhibit"], example: "Children exhibit different learning styles.", exampleZh: "儿童表现出不同的学习风格。" },
    {
    pos: "n.", meaningZh: "显示；显现；展览品；陈列品；展览", meaningEn: "An instance of exhibiting.", collocations: [], example: "", exampleZh: "" },
    {
    pos: "vt.", meaningZh: "展现；陈列；展览", meaningEn: "", collocations: [], example: "", exampleZh: "" },
    {
    pos: "vi.", meaningZh: "开展览会", meaningEn: "", collocations: [], example: "", exampleZh: "" }
    ]
  },
  {
    id: "explicit", term: "explicit", phonetic: "/ɪkˈsplɪsɪt/", pos: "adj.", meaningZh: "明确的；清楚的；详述的；直言的", meaningEn: "stated clearly", band: "7", collocations: ["explicit instruction", "explicit consent", "explicit about"], example: "Give explicit instructions to avoid confusion.", exampleZh: "给出明确指示以避免混淆。",
    senses: [
    {
    pos: "adj.", meaningZh: "明确的；清楚的；详述的；直言的", meaningEn: "stated clearly", collocations: ["explicit instruction", "explicit consent", "explicit about"], example: "Give explicit instructions to avoid confusion.", exampleZh: "给出明确指示以避免混淆。" }
    ]
  },
  {
    id: "facilitate", term: "facilitate", phonetic: "/fəˈsɪləteɪt/", pos: "v.", meaningZh: "促进；使便利", meaningEn: "to make easier", band: "7", collocations: ["facilitate learning", "facilitate communication", "facilitate change"], example: "Technology facilitates remote work.", exampleZh: "技术让远程办公更便利。",
    senses: [
    {
    pos: "v.", meaningZh: "促进；使便利", meaningEn: "to make easier", collocations: ["facilitate learning", "facilitate communication", "facilitate change"], example: "Technology facilitates remote work.", exampleZh: "技术让远程办公更便利。" },
    {
    pos: "vt.", meaningZh: "使容易；促进；帮助；使容易；使便利；推进", meaningEn: "", collocations: [], example: "", exampleZh: "" }
    ]
  },
  {
    id: "formulate", term: "formulate", phonetic: "/ˈfɔːmjuleɪt/", pos: "v.", meaningZh: "制定；系统阐述", meaningEn: "to create or express precisely", band: "7", collocations: ["formulate a plan", "formulate policy", "carefully formulate"], example: "The committee formulated a clear strategy.", exampleZh: "委员会制定了一项清晰的策略。",
    senses: [
    {
    pos: "v.", meaningZh: "制定；系统阐述", meaningEn: "to create or express precisely", collocations: ["formulate a plan", "formulate policy", "carefully formulate"], example: "The committee formulated a clear strategy.", exampleZh: "委员会制定了一项清晰的策略。" },
    {
    pos: "vt.", meaningZh: "用公式表示；明确叙述；制订；公式化；公式表示", meaningEn: "", collocations: [], example: "", exampleZh: "" }
    ]
  },
  {
    id: "foster", term: "foster", phonetic: "/ˈfɒstə/", pos: "v.", meaningZh: "培养；促进", meaningEn: "to encourage growth", band: "7", collocations: ["foster creativity", "foster trust", "foster cooperation"], example: "Reading fosters imagination in children.", exampleZh: "阅读培养孩子的想象力。",
    senses: [
    {
    pos: "v.", meaningZh: "培养；促进", meaningEn: "to encourage growth", collocations: ["foster creativity", "foster trust", "foster cooperation"], example: "Reading fosters imagination in children.", exampleZh: "阅读培养孩子的想象力。" },
    {
    pos: "n.", meaningZh: "監護人", meaningEn: "A foster parent.", collocations: [], example: "Some fosters end up adopting.", exampleZh: "" },
    {
    pos: "adj.", meaningZh: "收养的；养育的", meaningEn: "Providing parental care to children not related to oneself.", collocations: [], example: "foster parents", exampleZh: "" },
    {
    pos: "vt.", meaningZh: "养育；抚育；培养；鼓励；抱(希望)", meaningEn: "", collocations: [], example: "", exampleZh: "" }
    ]
  },
  {
    id: "hypothesis", term: "hypothesis", phonetic: "/-əsəs/", pos: "n.", meaningZh: "假设", meaningEn: "a proposed explanation", band: "7", collocations: ["test a hypothesis", "form a hypothesis", "support the hypothesis"], example: "The data supports our original hypothesis.", exampleZh: "数据支持了我们最初的假设。",
    senses: [
    {
    pos: "n.", meaningZh: "假设", meaningEn: "a proposed explanation", collocations: ["test a hypothesis", "form a hypothesis", "support the hypothesis"], example: "The data supports our original hypothesis.", exampleZh: "数据支持了我们最初的假设。" }
    ]
  },
  {
    id: "illustrate", term: "illustrate", phonetic: "/ɪ.ˈlʌs.tɹeɪt/", pos: "v.", meaningZh: "说明；阐明", meaningEn: "to explain with examples", band: "7", collocations: ["illustrate a point", "clearly illustrate", "illustrate with"], example: "Let me illustrate with a real example.", exampleZh: "我用一个真实例子来说明。",
    senses: [
    {
    pos: "v.", meaningZh: "说明；阐明", meaningEn: "to explain with examples", collocations: ["illustrate a point", "clearly illustrate", "illustrate with"], example: "Let me illustrate with a real example.", exampleZh: "我用一个真实例子来说明。" },
    {
    pos: "vt.", meaningZh: "举例说明；作图解；阐明", meaningEn: "", collocations: [], example: "", exampleZh: "" },
    {
    pos: "vi.", meaningZh: "举例说明", meaningEn: "", collocations: [], example: "", exampleZh: "" }
    ]
  },
  {
    id: "immediate", term: "immediate", phonetic: "/ɪˈmiːdɪət/", pos: "adj.", meaningZh: "立即的；直接的；接近的", meaningEn: "happening now, direct", band: "7", collocations: ["immediate effect", "immediate response", "immediate concern"], example: "The drug had an immediate effect.", exampleZh: "药物立即起效。",
    senses: [
    {
    pos: "adj.", meaningZh: "立即的；直接的；接近的", meaningEn: "happening now, direct", collocations: ["immediate effect", "immediate response", "immediate concern"], example: "The drug had an immediate effect.", exampleZh: "药物立即起效。" }
    ]
  },
  {
    id: "imply", term: "imply", phonetic: "/ɪmˈplaɪ/", pos: "v.", meaningZh: "暗示；意味着", meaningEn: "to suggest indirectly", band: "7", collocations: ["imply that", "strongly imply", "imply a change"], example: "High scores imply good preparation.", exampleZh: "高分意味着准备充分。",
    senses: [
    {
    pos: "v.", meaningZh: "暗示；意味着", meaningEn: "to suggest indirectly", collocations: ["imply that", "strongly imply", "imply a change"], example: "High scores imply good preparation.", exampleZh: "高分意味着准备充分。" },
    {
    pos: "vt.", meaningZh: "暗示；意味；隐含", meaningEn: "", collocations: [], example: "", exampleZh: "" }
    ]
  },
  {
    id: "incentive", term: "incentive", phonetic: "/ɪnˈsentɪv/", pos: "n.", meaningZh: "激励；刺激；动机", meaningEn: "something that motivates", band: "7", collocations: ["financial incentive", "provide an incentive", "strong incentive"], example: "Tax breaks give firms an incentive to invest.", exampleZh: "税收减免激励企业投资。",
    senses: [
    {
    pos: "n.", meaningZh: "激励；刺激；动机", meaningEn: "something that motivates", collocations: ["financial incentive", "provide an incentive", "strong incentive"], example: "Tax breaks give firms an incentive to invest.", exampleZh: "税收减免激励企业投资。" },
    {
    pos: "adj.", meaningZh: "激励的", meaningEn: "", collocations: [], example: "", exampleZh: "" }
    ]
  },
  {
    id: "incidence", term: "incidence", phonetic: "/ˈɪnsɪdəns/", pos: "n.", meaningZh: "发生率；影响；负担者；入射；倾角；发生数", meaningEn: "the rate of occurrence", band: "7", collocations: ["incidence of", "high incidence", "rising incidence"], example: "The incidence of the disease is falling.", exampleZh: "该疾病的发生率正在下降。",
    senses: [
    {
    pos: "n.", meaningZh: "发生率；影响；负担者；入射；倾角；发生数", meaningEn: "the rate of occurrence", collocations: ["incidence of", "high incidence", "rising incidence"], example: "The incidence of the disease is falling.", exampleZh: "该疾病的发生率正在下降。" }
    ]
  },
  {
    id: "incorporate", term: "incorporate", phonetic: "/ɪŋˈkɔɹpɚe(ɪ)t/", pos: "v.", meaningZh: "纳入；包含", meaningEn: "to include as part", band: "7", collocations: ["incorporate into", "incorporate feedback", "incorporate ideas"], example: "We incorporated user feedback into the design.", exampleZh: "我们把用户反馈纳入了设计。",
    senses: [
    {
    pos: "v.", meaningZh: "纳入；包含", meaningEn: "to include as part", collocations: ["incorporate into", "incorporate feedback", "incorporate ideas"], example: "We incorporated user feedback into the design.", exampleZh: "我们把用户反馈纳入了设计。" },
    {
    pos: "adj.", meaningZh: "合并的；组成公司的；一体化的", meaningEn: "Corporate; incorporated; made one body, or united in one body; associated; mixed together; combined; embodied.", collocations: [], example: "", exampleZh: "" },
    {
    pos: "vt.", meaningZh: "吸收；合并；使组成公司；体现", meaningEn: "", collocations: [], example: "", exampleZh: "" },
    {
    pos: "vi.", meaningZh: "合并；混合；组成公司", meaningEn: "", collocations: [], example: "", exampleZh: "" }
    ]
  },
  {
    id: "indigenous", term: "indigenous", phonetic: "/ɪnˈdɪdʒɪnəs/", pos: "adj.", meaningZh: "本土的；土著的；国产的；固有的；原产的", meaningEn: "native to a place", band: "7", collocations: ["indigenous people", "indigenous culture", "indigenous species"], example: "Indigenous knowledge aids conservation.", exampleZh: "本土知识有助于保护。",
    senses: [
    {
    pos: "adj.", meaningZh: "本土的；土著的；国产的；固有的；原产的", meaningEn: "native to a place", collocations: ["indigenous people", "indigenous culture", "indigenous species"], example: "Indigenous knowledge aids conservation.", exampleZh: "本土知识有助于保护。" }
    ]
  },
  {
    id: "infer", term: "infer", phonetic: "/ɪnˈfɜː/", pos: "v.", meaningZh: "推断；推论", meaningEn: "to conclude from evidence", band: "7", collocations: ["infer from", "infer that", "reasonably infer"], example: "We can infer intent from the data.", exampleZh: "我们可以从数据推断意图。",
    senses: [
    {
    pos: "v.", meaningZh: "推断；推论", meaningEn: "to conclude from evidence", collocations: ["infer from", "infer that", "reasonably infer"], example: "We can infer intent from the data.", exampleZh: "我们可以从数据推断意图。" },
    {
    pos: "vt.", meaningZh: "推论出；推断", meaningEn: "", collocations: [], example: "", exampleZh: "" },
    {
    pos: "vi.", meaningZh: "作推论", meaningEn: "", collocations: [], example: "", exampleZh: "" }
    ]
  },
  {
    id: "inherent", term: "inherent", phonetic: "/ɪnˈhɛɹənt/", pos: "adj.", meaningZh: "固有的；内在的；与生俱来的；生来的", meaningEn: "existing as a natural part", band: "7", collocations: ["inherent risk", "inherent value", "inherent in"], example: "Every choice has inherent trade-offs.", exampleZh: "每个选择都有固有的权衡。",
    senses: [
    {
    pos: "adj.", meaningZh: "固有的；内在的；与生俱来的；生来的", meaningEn: "existing as a natural part", collocations: ["inherent risk", "inherent value", "inherent in"], example: "Every choice has inherent trade-offs.", exampleZh: "每个选择都有固有的权衡。" }
    ]
  },
  {
    id: "innovative", term: "innovative", phonetic: "/ɪnˈnɒ.və.tɪv/", pos: "adj.", meaningZh: "创新的；革新的；富有革新精神的", meaningEn: "introducing new ideas", band: "7", collocations: ["innovative approach", "innovative design", "highly innovative"], example: "The app uses an innovative teaching method.", exampleZh: "该应用采用了创新的教学法。",
    senses: [
    {
    pos: "adj.", meaningZh: "创新的；革新的；富有革新精神的", meaningEn: "introducing new ideas", collocations: ["innovative approach", "innovative design", "highly innovative"], example: "The app uses an innovative teaching method.", exampleZh: "该应用采用了创新的教学法。" }
    ]
  },
  {
    id: "insight", term: "insight", phonetic: "/ˈɪnsaɪt/", pos: "n.", meaningZh: "洞察；深刻见解；察看；洞察力；见识；自知力；顿悟", meaningEn: "deep understanding", band: "7", collocations: ["provide insight", "gain insight", "valuable insight"], example: "The study offers insight into student motivation.", exampleZh: "该研究洞察了学生的学习动机。",
    senses: [
    {
    pos: "n.", meaningZh: "洞察；深刻见解；察看；洞察力；见识；自知力；顿悟", meaningEn: "deep understanding", collocations: ["provide insight", "gain insight", "valuable insight"], example: "The study offers insight into student motivation.", exampleZh: "该研究洞察了学生的学习动机。" }
    ]
  },
  {
    id: "integral", term: "integral", phonetic: "/ˈɪntɪɡɹəl/", pos: "adj.", meaningZh: "不可或缺的；完整的；固有的；整体的；整数的；积分的", meaningEn: "necessary for completeness", band: "7", collocations: ["integral part", "integral to", "an integral role"], example: "Trust is integral to teamwork.", exampleZh: "信任是团队合作不可或缺的部分。",
    senses: [
    {
    pos: "adj.", meaningZh: "不可或缺的；完整的；固有的；整体的；整数的；积分的", meaningEn: "necessary for completeness", collocations: ["integral part", "integral to", "an integral role"], example: "Trust is integral to teamwork.", exampleZh: "信任是团队合作不可或缺的部分。" },
    {
    pos: "n.", meaningZh: "整体；积分；整数", meaningEn: "A number, the limit of the sums computed in a process in which the domain of a function is divided into small subsets and a possibly nominal value of the function on each subset is multiplied by the measure of that subset, all these products then being summed.", collocations: [], example: "The integral of x\\mapsto x^2 on [0,1] is \\frac{1}{3}.", exampleZh: "" }
    ]
  },
  {
    id: "intrinsic", term: "intrinsic", phonetic: "/ɪn.ˈtɹɪn.zɪk/", pos: "adj.", meaningZh: "内在的；本质的；原有的；真正的；内部的", meaningEn: "belonging naturally", band: "7", collocations: ["intrinsic value", "intrinsic motivation", "intrinsic to"], example: "Children have intrinsic curiosity.", exampleZh: "儿童天生具有好奇心。",
    senses: [
    {
    pos: "adj.", meaningZh: "内在的；本质的；原有的；真正的；内部的", meaningEn: "belonging naturally", collocations: ["intrinsic value", "intrinsic motivation", "intrinsic to"], example: "Children have intrinsic curiosity.", exampleZh: "儿童天生具有好奇心。" }
    ]
  },
  {
    id: "invoke", term: "invoke", phonetic: "/ɪnˈvoʊk/", pos: "v.", meaningZh: "援引；唤起", meaningEn: "to call upon or refer to", band: "7", collocations: ["invoke a law", "invoke an argument", "invoke memories"], example: "The report invokes several past studies.", exampleZh: "报告援引了多项既往研究。",
    senses: [
    {
    pos: "v.", meaningZh: "援引；唤起", meaningEn: "to call upon or refer to", collocations: ["invoke a law", "invoke an argument", "invoke memories"], example: "The report invokes several past studies.", exampleZh: "报告援引了多项既往研究。" },
    {
    pos: "vt.", meaningZh: "祈求；恳求；实行；援引；引起；调用；请求", meaningEn: "", collocations: [], example: "", exampleZh: "" }
    ]
  },
  {
    id: "isolate", term: "isolate", phonetic: "/ˈaɪsəleɪt/", pos: "v.", meaningZh: "隔离；孤立", meaningEn: "to set apart", band: "7", collocations: ["isolate the cause", "isolate from", "socially isolate"], example: "Researchers isolated the active compound.", exampleZh: "研究人员分离出了活性化合物。",
    senses: [
    {
    pos: "v.", meaningZh: "隔离；孤立", meaningEn: "to set apart", collocations: ["isolate the cause", "isolate from", "socially isolate"], example: "Researchers isolated the active compound.", exampleZh: "研究人员分离出了活性化合物。" },
    {
    pos: "n.", meaningZh: "隔离种群", meaningEn: "Something that has been isolated.", collocations: [], example: "", exampleZh: "" },
    {
    pos: "vt.", meaningZh: "使隔离；使孤立；使绝缘", meaningEn: "", collocations: [], example: "", exampleZh: "" }
    ]
  },
  {
    id: "legitimate", term: "legitimate", phonetic: "/lɪˈdʒɪtɪmət/", pos: "adj.", meaningZh: "合法的；合理的；正当的；婚生的", meaningEn: "lawful; reasonable", band: "7", collocations: ["legitimate concern", "legitimate reason", "legitimate claim"], example: "There is a legitimate concern about privacy.", exampleZh: "对隐私存在合理的担忧。",
    senses: [
    {
    pos: "adj.", meaningZh: "合法的；合理的；正当的；婚生的", meaningEn: "lawful; reasonable", collocations: ["legitimate concern", "legitimate reason", "legitimate claim"], example: "There is a legitimate concern about privacy.", exampleZh: "对隐私存在合理的担忧。" },
    {
    pos: "n.", meaningZh: "合法结婚夫妇所生的人。", meaningEn: "A person born to a legally married couple.", collocations: [], example: "", exampleZh: "" },
    {
    pos: "v.", meaningZh: "使合法、合法或有效；特别是通过法律手段将合法人的地位或状态置于法律面前。", meaningEn: "To make legitimate, lawful, or valid; especially, to put in the position or state of a legitimate person before the law, by legal means.", collocations: [], example: "", exampleZh: "" },
    {
    pos: "vt.", meaningZh: "认为正当；立为嫡嗣；使合法", meaningEn: "", collocations: [], example: "", exampleZh: "" }
    ]
  },
  {
    id: "objective", term: "objective", phonetic: "/ɒbˈd͡ʒɛk.tɪv/", pos: "adj. / n.", meaningZh: "客观的；目标；如实的；无偏见的；宾格的", meaningEn: "not influenced by feelings", band: "7", collocations: ["objective view", "stay objective", "main objective"], example: "Journalists must remain objective.", exampleZh: "记者必须保持客观。",
    senses: [
    {
    pos: "adj. / n.", meaningZh: "客观的；目标；如实的；无偏见的；宾格的", meaningEn: "not influenced by feelings", collocations: ["objective view", "stay objective", "main objective"], example: "Journalists must remain objective.", exampleZh: "记者必须保持客观。" },
    {
    pos: "n.", meaningZh: "目的；目标；宗旨；宾格；实物", meaningEn: "A material object that physically exists.", collocations: [], example: "", exampleZh: "" }
    ]
  },
  {
    id: "perspective", term: "perspective", phonetic: "/pɚˈspɛktɪv/", pos: "n.", meaningZh: "视角；观点；远景；透视感；(观察问题的)视角；透视法；看法；透视图", meaningEn: "a point of view", band: "7", collocations: ["from a perspective", "broaden perspective", "new perspective"], example: "The book offers a fresh perspective on history.", exampleZh: "这本书提供了看待历史的新视角。",
    senses: [
    {
    pos: "n.", meaningZh: "视角；观点；远景；透视感；(观察问题的)视角；透视法；看法；透视图", meaningEn: "a point of view", collocations: ["from a perspective", "broaden perspective", "new perspective"], example: "The book offers a fresh perspective on history.", exampleZh: "这本书提供了看待历史的新视角。" },
    {
    pos: "adj.", meaningZh: "透视的；透视法的", meaningEn: "", collocations: [], example: "", exampleZh: "" }
    ]
  },
  {
    id: "phenomenon", term: "phenomenon", phonetic: "/fɪˈnɒmənɒn/", pos: "n.", meaningZh: "现象；迹象；表现；奇迹；奇才", meaningEn: "an observable fact or event", band: "7", collocations: ["social phenomenon", "natural phenomenon", "a growing phenomenon"], example: "Urbanisation is a global phenomenon.", exampleZh: "城市化是一种全球现象。",
    senses: [
    {
    pos: "n.", meaningZh: "现象；迹象；表现；奇迹；奇才", meaningEn: "an observable fact or event", collocations: ["social phenomenon", "natural phenomenon", "a growing phenomenon"], example: "Urbanisation is a global phenomenon.", exampleZh: "城市化是一种全球现象。" }
    ]
  },
  {
    id: "potential", term: "potential", phonetic: "/pəˈtɛnʃəl/", pos: "adj. / n.", meaningZh: "潜在的；潜力；有潜力的；可能的", meaningEn: "possible, not yet real", band: "7", collocations: ["great potential", "potential risk", "realise potential"], example: "The region has great tourism potential.", exampleZh: "该地区有很大的旅游潜力。",
    senses: [
    {
    pos: "adj. / n.", meaningZh: "潜在的；潜力；有潜力的；可能的", meaningEn: "possible, not yet real", collocations: ["great potential", "potential risk", "realise potential"], example: "The region has great tourism potential.", exampleZh: "该地区有很大的旅游潜力。" },
    {
    pos: "n.", meaningZh: "潜在性；可能性；潜力；潜能；势；位", meaningEn: "Currently unrealized ability (with the most common adposition being to)", collocations: [], example: "Even from a young age it was clear that she had the potential to become a great musician.", exampleZh: "" }
    ]
  },
  {
    id: "ubiquitous", term: "ubiquitous", phonetic: "/juːˈbɪk.wə.təs/", pos: "adj.", meaningZh: "无处不在的；普遍存在的；无所不在的；到处存在的", meaningEn: "present, appearing, or found everywhere", band: "8", collocations: ["ubiquitous technology", "become ubiquitous", "ubiquitous presence"], example: "Smartphones have become ubiquitous in modern daily life.", exampleZh: "智能手机在现代日常生活中已无处不在。",
    senses: [
    {
    pos: "adj.", meaningZh: "无处不在的；普遍存在的；无所不在的；到处存在的", meaningEn: "present, appearing, or found everywhere", collocations: ["ubiquitous technology", "become ubiquitous", "ubiquitous presence"], example: "Smartphones have become ubiquitous in modern daily life.", exampleZh: "智能手机在现代日常生活中已无处不在。" }
    ]
  },
  {
    id: "corroborate", term: "corroborate", phonetic: "/kəˈɹɒbəɹeɪ̯t/", pos: "v.", meaningZh: "证实；佐证", meaningEn: "to provide evidence that supports a statement", band: "8", collocations: ["corroborate the finding", "corroborate evidence", "corroborate a claim"], example: "Later studies corroborated the original hypothesis.", exampleZh: "后续研究证实了最初的假设。",
    senses: [
    {
    pos: "v.", meaningZh: "证实；佐证", meaningEn: "to provide evidence that supports a statement", collocations: ["corroborate the finding", "corroborate evidence", "corroborate a claim"], example: "Later studies corroborated the original hypothesis.", exampleZh: "后续研究证实了最初的假设。" },
    {
    pos: "vt.", meaningZh: "巩固；确证；确证；确定；证实", meaningEn: "", collocations: [], example: "", exampleZh: "" }
    ]
  },
  {
    id: "delineate", term: "delineate", phonetic: "/dɪˈlɪniːeɪt/", pos: "v.", meaningZh: "描绘；明确界定", meaningEn: "to describe or mark the edge of something clearly", band: "8", collocations: ["delineate the scope", "clearly delineate", "delineate boundaries"], example: "The report delineates the responsibilities of each department.", exampleZh: "报告明确了各部门的职责边界。",
    senses: [
    {
    pos: "v.", meaningZh: "描绘；明确界定", meaningEn: "to describe or mark the edge of something clearly", collocations: ["delineate the scope", "clearly delineate", "delineate boundaries"], example: "The report delineates the responsibilities of each department.", exampleZh: "报告明确了各部门的职责边界。" },
    {
    pos: "vt.", meaningZh: "描绘...的轮廓；描绘；描写", meaningEn: "", collocations: [], example: "", exampleZh: "" }
    ]
  },
  {
    id: "ephemeral", term: "ephemeral", phonetic: "/əˈfɛ.mə.ɹəl/", pos: "adj.", meaningZh: "短暂的；转瞬即逝的；朝生暮死的；短命的；暂时的", meaningEn: "lasting for a very short time", band: "8", collocations: ["ephemeral trend", "ephemeral nature", "ephemeral pleasure"], example: "Fashion trends are often ephemeral and quickly forgotten.", exampleZh: "时尚潮流往往转瞬即逝，很快被遗忘。",
    senses: [
    {
    pos: "adj.", meaningZh: "短暂的；转瞬即逝的；朝生暮死的；短命的；暂时的", meaningEn: "lasting for a very short time", collocations: ["ephemeral trend", "ephemeral nature", "ephemeral pleasure"], example: "Fashion trends are often ephemeral and quickly forgotten.", exampleZh: "时尚潮流往往转瞬即逝，很快被遗忘。" },
    {
    pos: "n.", meaningZh: "持续时间很短的东西。", meaningEn: "Something which lasts for a short period of time.", collocations: [], example: "", exampleZh: "" }
    ]
  },
  {
    id: "juxtapose", term: "juxtapose", phonetic: "/ˈd͡ʒʌkstəpəʊz/", pos: "v.", meaningZh: "并列；对比摆放", meaningEn: "to place things side by side to compare or contrast", band: "8", collocations: ["juxtapose ideas", "juxtapose with", "juxtapose images"], example: "The essay juxtaposes ancient and modern views on friendship.", exampleZh: "这篇短文将古今对友谊的看法并列对照。",
    senses: [
    {
    pos: "v.", meaningZh: "并列；对比摆放", meaningEn: "to place things side by side to compare or contrast", collocations: ["juxtapose ideas", "juxtapose with", "juxtapose images"], example: "The essay juxtaposes ancient and modern views on friendship.", exampleZh: "这篇短文将古今对友谊的看法并列对照。" },
    {
    pos: "vt.", meaningZh: "并置；并列；使连接；毗连；并列", meaningEn: "", collocations: [], example: "", exampleZh: "" }
    ]
  },
  {
    id: "mitigation", term: "mitigation", phonetic: "/ˌmɪtɪˈɡeɪʃn/", pos: "n.", meaningZh: "缓解；减轻；缓和", meaningEn: "the action of reducing the severity of something", band: "8", collocations: ["risk mitigation", "climate mitigation", "mitigation measures"], example: "Early warning systems play a key role in disaster mitigation.", exampleZh: "预警系统在灾害缓解中起着关键作用。",
    senses: [
    {
    pos: "n.", meaningZh: "缓解；减轻；缓和", meaningEn: "the action of reducing the severity of something", collocations: ["risk mitigation", "climate mitigation", "mitigation measures"], example: "Early warning systems play a key role in disaster mitigation.", exampleZh: "预警系统在灾害缓解中起着关键作用。" }
    ]
  },
  {
    id: "propensity", term: "propensity", phonetic: "/pɹəˈpɛnsɪti/", pos: "n.", meaningZh: "倾向；习性；爱好", meaningEn: "a natural tendency to behave in a certain way", band: "8", collocations: ["propensity for", "have a propensity", "propensity to"], example: "Children show a propensity to imitate the behaviour of adults.", exampleZh: "儿童表现出模仿成人行为的倾向。",
    senses: [
    {
    pos: "n.", meaningZh: "倾向；习性；爱好", meaningEn: "a natural tendency to behave in a certain way", collocations: ["propensity for", "have a propensity", "propensity to"], example: "Children show a propensity to imitate the behaviour of adults.", exampleZh: "儿童表现出模仿成人行为的倾向。" }
    ]
  },
  {
    id: "salient", term: "salient", phonetic: "/ˈseɪ.li.ənt/", pos: "adj.", meaningZh: "显著的；突出的；跳跃的", meaningEn: "most important, noticeable, or prominent", band: "8", collocations: ["salient feature", "salient point", "most salient"], example: "The salient point of the debate was the question of fairness.", exampleZh: "这场辩论最突出的焦点是公平问题。",
    senses: [
    {
    pos: "adj.", meaningZh: "显著的；突出的；跳跃的", meaningEn: "most important, noticeable, or prominent", collocations: ["salient feature", "salient point", "most salient"], example: "The salient point of the debate was the question of fairness.", exampleZh: "这场辩论最突出的焦点是公平问题。" },
    {
    pos: "n.", meaningZh: "凸角；突出部分", meaningEn: "An outwardly projecting part of a fortification, trench system, or line of defense.", collocations: [], example: "", exampleZh: "" }
    ]
  },
  {
    id: "tenuous", term: "tenuous", phonetic: "/ˈtɛn.ju.əs/", pos: "adj.", meaningZh: "脆弱的；微弱的；稀薄的；微细的；纤细的；细薄的", meaningEn: "weak and unlikely to last; very thin", band: "8", collocations: ["tenuous link", "tenuous connection", "tenuous argument"], example: "The evidence provides only a tenuous link to the suspect.", exampleZh: "证据与嫌疑人之间仅有微弱关联。",
    senses: [
    {
    pos: "adj.", meaningZh: "脆弱的；微弱的；稀薄的；微细的；纤细的；细薄的", meaningEn: "weak and unlikely to last; very thin", collocations: ["tenuous link", "tenuous connection", "tenuous argument"], example: "The evidence provides only a tenuous link to the suspect.", exampleZh: "证据与嫌疑人之间仅有微弱关联。" }
    ]
  },
  {
    id: "unequivocal", term: "unequivocal", phonetic: "/ʌnɨˈkwɪvəkəl/", pos: "adj.", meaningZh: "明确的；毫不含糊的；不模棱两可的；不含混的；明白的；直率的", meaningEn: "clear and unambiguous; leaving no doubt", band: "8", collocations: ["unequivocal evidence", "unequivocal support", "unequivocal answer"], example: "The data offers unequivocal evidence of the warming trend.", exampleZh: "数据为变暖趋势提供了明确证据。",
    senses: [
    {
    pos: "adj.", meaningZh: "明确的；毫不含糊的；不模棱两可的；不含混的；明白的；直率的", meaningEn: "clear and unambiguous; leaving no doubt", collocations: ["unequivocal evidence", "unequivocal support", "unequivocal answer"], example: "The data offers unequivocal evidence of the warming trend.", exampleZh: "数据为变暖趋势提供了明确证据。" }
    ]
  },
  {
    id: "preclude", term: "preclude", phonetic: "/pɹiːˈkluːd/", pos: "v.", meaningZh: "排除；阻止", meaningEn: "to prevent something from happening", band: "8", collocations: ["preclude the possibility", "preclude further action", "not preclude"], example: "His age does not preclude him from competing.", exampleZh: "他的年龄并不妨碍他参赛。",
    senses: [
    {
    pos: "v.", meaningZh: "排除；阻止", meaningEn: "to prevent something from happening", collocations: ["preclude the possibility", "preclude further action", "not preclude"], example: "His age does not preclude him from competing.", exampleZh: "他的年龄并不妨碍他参赛。" },
    {
    pos: "vt.", meaningZh: "预先排除；预防；阻止；妨碍；预防；排除；消除", meaningEn: "", collocations: [], example: "", exampleZh: "" }
    ]
  },
  {
    id: "manifest", term: "manifest", phonetic: "/ˈmæn.ə.fɛst/", pos: "v. / adj.", meaningZh: "显现；表明", meaningEn: "to show something clearly, or to be clear to see", band: "8", collocations: ["manifest itself", "manifest in", "clearly manifest"], example: "The effects of stress often manifest in physical symptoms.", exampleZh: "压力的影响常表现为身体症状。",
    senses: [
    {
    pos: "v. / adj.", meaningZh: "显现；表明", meaningEn: "to show something clearly, or to be clear to see", collocations: ["manifest itself", "manifest in", "clearly manifest"], example: "The effects of stress often manifest in physical symptoms.", exampleZh: "压力的影响常表现为身体症状。" },
    {
    pos: "n.", meaningZh: "载货单；运货单；旅客名单", meaningEn: "A list or invoice of the passengers or goods being carried by a commercial vehicle or ship.", collocations: [], example: "", exampleZh: "" },
    {
    pos: "adj.", meaningZh: "显然的；明白的", meaningEn: "Evident to the senses, especially to the sight; apparent; distinctly perceived.", collocations: [], example: "", exampleZh: "" },
    {
    pos: "vi.", meaningZh: "显示；出现", meaningEn: "", collocations: [], example: "", exampleZh: "" },
    {
    pos: "vt.", meaningZh: "表明；表现；证明", meaningEn: "", collocations: [], example: "", exampleZh: "" }
    ]
  },
  {
    id: "proponent", term: "proponent", phonetic: "/pɹəˈpəʊnənt/", pos: "n.", meaningZh: "支持者；倡导者；建议者；提议者；辩护者", meaningEn: "a person who advocates for a theory or idea", band: "8", collocations: ["strong proponent", "proponents of", "leading proponent"], example: "She is a leading proponent of educational reform.", exampleZh: "她是教育改革的领军倡导者。",
    senses: [
    {
    pos: "n.", meaningZh: "支持者；倡导者；建议者；提议者；辩护者", meaningEn: "a person who advocates for a theory or idea", collocations: ["strong proponent", "proponents of", "leading proponent"], example: "She is a leading proponent of educational reform.", exampleZh: "她是教育改革的领军倡导者。" },
    {
    pos: "adj.", meaningZh: "提出建议；提出建议。", meaningEn: "Making proposals; proposing.", collocations: [], example: "", exampleZh: "" }
    ]
  },
  {
    id: "anomalous", term: "anomalous", phonetic: "/əˈnɒmələs/", pos: "adj.", meaningZh: "异常的；反常的；不规则的", meaningEn: "deviating from the norm", band: "8", collocations: ["anomalous data", "anomalous result", "apparently anomalous"], example: "The anomalous reading was later explained.", exampleZh: "这一异常读数后来得到了解释。",
    senses: [
    {
    pos: "adj.", meaningZh: "异常的；反常的；不规则的", meaningEn: "deviating from the norm", collocations: ["anomalous data", "anomalous result", "apparently anomalous"], example: "The anomalous reading was later explained.", exampleZh: "这一异常读数后来得到了解释。" }
    ]
  },
  {
    id: "austere", term: "austere", phonetic: "/ɒstɪə(ɹ)/", pos: "adj.", meaningZh: "朴素的；严厉的；严峻的；禁欲的；简朴的", meaningEn: "plain; severe", band: "8", collocations: ["austere life", "austere style", "austere measures"], example: "The monastery led an austere life.", exampleZh: "修道院过着简朴的生活。",
    senses: [
    {
    pos: "adj.", meaningZh: "朴素的；严厉的；严峻的；禁欲的；简朴的", meaningEn: "plain; severe", collocations: ["austere life", "austere style", "austere measures"], example: "The monastery led an austere life.", exampleZh: "修道院过着简朴的生活。" }
    ]
  },
  {
    id: "capitulate", term: "capitulate", phonetic: "/kəˈpɪtʃuleɪt/", pos: "v.", meaningZh: "屈服；投降", meaningEn: "to surrender", band: "8", collocations: ["capitulate to", "finally capitulate", "refuse to capitulate"], example: "The firm refused to capitulate to pressure.", exampleZh: "公司拒绝向压力屈服。",
    senses: [
    {
    pos: "v.", meaningZh: "屈服；投降", meaningEn: "to surrender", collocations: ["capitulate to", "finally capitulate", "refuse to capitulate"], example: "The firm refused to capitulate to pressure.", exampleZh: "公司拒绝向压力屈服。" },
    {
    pos: "vi.", meaningZh: "(有条件)投降；投降；投降", meaningEn: "", collocations: [], example: "", exampleZh: "" }
    ]
  },
  {
    id: "cogent", term: "cogent", phonetic: "/ˈkə͡ʊd͡ʒn̩t/", pos: "adj.", meaningZh: "有说服力的；使人首肯的；使人信服的；中肯切题的；无法反驳的", meaningEn: "clear and convincing", band: "8", collocations: ["cogent argument", "cogent reason", "highly cogent"], example: "She made a cogent case for reform.", exampleZh: "她就改革提出了有说服力的论证。",
    senses: [
    {
    pos: "adj.", meaningZh: "有说服力的；使人首肯的；使人信服的；中肯切题的；无法反驳的", meaningEn: "clear and convincing", collocations: ["cogent argument", "cogent reason", "highly cogent"], example: "She made a cogent case for reform.", exampleZh: "她就改革提出了有说服力的论证。" }
    ]
  },
  {
    id: "commensurate", term: "commensurate", phonetic: "/kəˈmɛnʃəɹət/", pos: "adj.", meaningZh: "相称的；相当的；同量的；同等的", meaningEn: "in proportion", band: "8", collocations: ["commensurate with", "commensurate pay", "not commensurate"], example: "Pay should be commensurate with effort.", exampleZh: "薪酬应与付出相称。",
    senses: [
    {
    pos: "adj.", meaningZh: "相称的；相当的；同量的；同等的", meaningEn: "in proportion", collocations: ["commensurate with", "commensurate pay", "not commensurate"], example: "Pay should be commensurate with effort.", exampleZh: "薪酬应与付出相称。" },
    {
    pos: "v.", meaningZh: "减少到一个共同的措施。", meaningEn: "To reduce to a common measure.", collocations: [], example: "", exampleZh: "" }
    ]
  },
  {
    id: "conducive", term: "conducive", phonetic: "/kənˈdjuːsɪv/", pos: "adj.", meaningZh: "有助于的；有益的；有益于...的；有助于...的；助长的", meaningEn: "making a situation likely", band: "8", collocations: ["conducive to", "conducive environment", "conducive atmosphere"], example: "A calm room is conducive to study.", exampleZh: "安静的房间有利于学习。",
    senses: [
    {
    pos: "adj.", meaningZh: "有助于的；有益的；有益于...的；有助于...的；助长的", meaningEn: "making a situation likely", collocations: ["conducive to", "conducive environment", "conducive atmosphere"], example: "A calm room is conducive to study.", exampleZh: "安静的房间有利于学习。" }
    ]
  },
  {
    id: "crystallize", term: "crystallize", phonetic: "/ˈkɹɪstəlaɪz/", pos: "v.", meaningZh: "使明确；结晶", meaningEn: "to become clear", band: "8", collocations: ["crystallize thinking", "crystallize into", "help crystallize"], example: "The debate helped crystallize public opinion.", exampleZh: "这场辩论使舆论逐渐清晰。",
    senses: [
    {
    pos: "v.", meaningZh: "使明确；结晶", meaningEn: "to become clear", collocations: ["crystallize thinking", "crystallize into", "help crystallize"], example: "The debate helped crystallize public opinion.", exampleZh: "这场辩论使舆论逐渐清晰。" },
    {
    pos: "vt.", meaningZh: "使结晶；使具体化", meaningEn: "", collocations: [], example: "", exampleZh: "" },
    {
    pos: "vi.", meaningZh: "结晶；具体化", meaningEn: "", collocations: [], example: "", exampleZh: "" }
    ]
  },
  {
    id: "elucidate", term: "elucidate", phonetic: "/əˈluː.sɪ.de͡ɪt/", pos: "v.", meaningZh: "阐明；解释", meaningEn: "to make clear", band: "8", collocations: ["elucidate a point", "elucidate the theory", "clearly elucidate"], example: "The diagram elucidates the process.", exampleZh: "该图示阐明了这一过程。",
    senses: [
    {
    pos: "v.", meaningZh: "阐明；解释", meaningEn: "to make clear", collocations: ["elucidate a point", "elucidate the theory", "clearly elucidate"], example: "The diagram elucidates the process.", exampleZh: "该图示阐明了这一过程。" },
    {
    pos: "vt.", meaningZh: "阐明；说明", meaningEn: "", collocations: [], example: "", exampleZh: "" }
    ]
  },
  {
    id: "emanate", term: "emanate", phonetic: "/ˈɛm.ə.ˌneɪt/", pos: "v.", meaningZh: "散发；发源", meaningEn: "to come from a source", band: "8", collocations: ["emanate from", "emanate a sense", "emanate warmth"], example: "A sense of calm emanated from the room.", exampleZh: "房间里散发出一种平和的气息。",
    senses: [
    {
    pos: "v.", meaningZh: "散发；发源", meaningEn: "to come from a source", collocations: ["emanate from", "emanate a sense", "emanate warmth"], example: "A sense of calm emanated from the room.", exampleZh: "房间里散发出一种平和的气息。" },
    {
    pos: "vi.", meaningZh: "散发；发出；发源", meaningEn: "", collocations: [], example: "", exampleZh: "" }
    ]
  },
  {
    id: "engender", term: "engender", phonetic: "/ɛnˈdʒɛn.də/", pos: "v.", meaningZh: "产生；引起", meaningEn: "to cause a feeling", band: "8", collocations: ["engender trust", "engender debate", "engender support"], example: "Open dialogue engenders trust.", exampleZh: "开放的对话能建立信任。",
    senses: [
    {
    pos: "v.", meaningZh: "产生；引起", meaningEn: "to cause a feeling", collocations: ["engender trust", "engender debate", "engender support"], example: "Open dialogue engenders trust.", exampleZh: "开放的对话能建立信任。" },
    {
    pos: "vt.", meaningZh: "产生；引起", meaningEn: "", collocations: [], example: "", exampleZh: "" },
    {
    pos: "vi.", meaningZh: "发生；形成", meaningEn: "", collocations: [], example: "", exampleZh: "" }
    ]
  },
  {
    id: "epitome", term: "epitome", phonetic: "/əˈpɪt.ə.mi/", pos: "n.", meaningZh: "典型；缩影；概要；象征", meaningEn: "a perfect example", band: "8", collocations: ["the epitome of", "epitome of style", "true epitome"], example: "She is the epitome of professionalism.", exampleZh: "她是专业精神的典型化身。",
    senses: [
    {
    pos: "n.", meaningZh: "典型；缩影；概要；象征", meaningEn: "a perfect example", collocations: ["the epitome of", "epitome of style", "true epitome"], example: "She is the epitome of professionalism.", exampleZh: "她是专业精神的典型化身。" }
    ]
  },
  {
    id: "immutable", term: "immutable", phonetic: "/ɪˈmjuːtəbl/", pos: "adj.", meaningZh: "不可改变的；不可变的；不变的；不能变的", meaningEn: "unchanging", band: "8", collocations: ["immutable law", "immutable fact", "immutable principle"], example: "Some principles seem immutable.", exampleZh: "某些原则似乎不可改变。",
    senses: [
    {
    pos: "adj.", meaningZh: "不可改变的；不可变的；不变的；不能变的", meaningEn: "unchanging", collocations: ["immutable law", "immutable fact", "immutable principle"], example: "Some principles seem immutable.", exampleZh: "某些原则似乎不可改变。" },
    {
    pos: "n.", meaningZh: "这是无法改变的东西", meaningEn: "Something that cannot be changed", collocations: [], example: "", exampleZh: "" }
    ]
  },
  {
    id: "indispensable", term: "indispensable", phonetic: "/ɪndɪˈspɛnsəbəl/", pos: "adj.", meaningZh: "不可或缺的；不可缺少的；责无旁贷的；绝对必要的", meaningEn: "absolutely necessary", band: "8", collocations: ["indispensable tool", "indispensable to", "become indispensable"], example: "The internet is indispensable at work.", exampleZh: "互联网在工作中不可或缺。",
    senses: [
    {
    pos: "adj.", meaningZh: "不可或缺的；不可缺少的；责无旁贷的；绝对必要的", meaningEn: "absolutely necessary", collocations: ["indispensable tool", "indispensable to", "become indispensable"], example: "The internet is indispensable at work.", exampleZh: "互联网在工作中不可或缺。" },
    {
    pos: "n.", meaningZh: "不可缺少之物", meaningEn: "A thing that is not dispensable; a necessity.", collocations: [], example: "", exampleZh: "" }
    ]
  },
  {
    id: "inexorable", term: "inexorable", phonetic: "/ɪnˈeksərəbl/", pos: "adj.", meaningZh: "不可阻挡的；无情的；冷酷的", meaningEn: "impossible to stop", band: "8", collocations: ["inexorable rise", "inexorable decline", "inexorable progress"], example: "The inexorable march of time worries us.", exampleZh: "时间无情的流逝令我们忧心。",
    senses: [
    {
    pos: "adj.", meaningZh: "不可阻挡的；无情的；冷酷的", meaningEn: "impossible to stop", collocations: ["inexorable rise", "inexorable decline", "inexorable progress"], example: "The inexorable march of time worries us.", exampleZh: "时间无情的流逝令我们忧心。" }
    ]
  },
  {
    id: "innocuous", term: "innocuous", phonetic: "/ɪˈnɒkjuəs/", pos: "adj.", meaningZh: "无害的；无伤大雅的；良性的", meaningEn: "harmless", band: "8", collocations: ["innocuous comment", "apparently innocuous", "innocuous substance"], example: "The remark seemed innocuous at first.", exampleZh: "这句话起初看起来无害。",
    senses: [
    {
    pos: "adj.", meaningZh: "无害的；无伤大雅的；良性的", meaningEn: "harmless", collocations: ["innocuous comment", "apparently innocuous", "innocuous substance"], example: "The remark seemed innocuous at first.", exampleZh: "这句话起初看起来无害。" }
    ]
  },
  {
    id: "nuanced", term: "nuanced", phonetic: "/ˈnjuːɑːnst/", pos: "adj.", meaningZh: "细致入微的；有细微差别的", meaningEn: "showing subtle difference", band: "8", collocations: ["nuanced view", "nuanced understanding", "highly nuanced"], example: "The issue requires a nuanced response.", exampleZh: "这个问题需要细致入微的回应。",
    senses: [
    {
    pos: "adj.", meaningZh: "细致入微的；有细微差别的", meaningEn: "showing subtle difference", collocations: ["nuanced view", "nuanced understanding", "highly nuanced"], example: "The issue requires a nuanced response.", exampleZh: "这个问题需要细致入微的回应。" },
    {
    pos: "v.", meaningZh: "以微妙的方式应用细微差别;以微妙的方式更改或重新定义。", meaningEn: "To apply a nuance to; to change or redefine in a subtle way.", collocations: [], example: "", exampleZh: "" }
    ]
  },
  {
    id: "pervasive", term: "pervasive", phonetic: "/pəˈveɪ.sɪv/", pos: "adj.", meaningZh: "遍布的；普遍的；流行的；到处蔓延的；到处渗透的", meaningEn: "spreading through everything", band: "8", collocations: ["pervasive influence", "pervasive problem", "pervasive fear"], example: "Technology has a pervasive influence on life.", exampleZh: "技术对生活的影响无处不在。",
    senses: [
    {
    pos: "adj.", meaningZh: "遍布的；普遍的；流行的；到处蔓延的；到处渗透的", meaningEn: "spreading through everything", collocations: ["pervasive influence", "pervasive problem", "pervasive fear"], example: "Technology has a pervasive influence on life.", exampleZh: "技术对生活的影响无处不在。" }
    ]
  },
  {
    id: "quintessential", term: "quintessential", phonetic: "/ˌkwɪnt.əˈsɛn.ʃəl/", pos: "adj.", meaningZh: "最典型的；精髓的；精萃的；典范的", meaningEn: "the most typical example", band: "8", collocations: ["quintessential example", "quintessential British", "quintessential form"], example: "He is the quintessential English gentleman.", exampleZh: "他是典型的英国绅士。",
    senses: [
    {
    pos: "adj.", meaningZh: "最典型的；精髓的；精萃的；典范的", meaningEn: "the most typical example", collocations: ["quintessential example", "quintessential British", "quintessential form"], example: "He is the quintessential English gentleman.", exampleZh: "他是典型的英国绅士。" }
    ]
  },
  {
    id: "reconcile", term: "reconcile", phonetic: "/ˈɹɛkənsaɪl/", pos: "v.", meaningZh: "调和；使和解", meaningEn: "to make consistent", band: "8", collocations: ["reconcile with", "reconcile differences", "reconcile the two"], example: "We must reconcile growth with ecology.", exampleZh: "我们必须在增长与生态间取得平衡。",
    senses: [
    {
    pos: "v.", meaningZh: "调和；使和解", meaningEn: "to make consistent", collocations: ["reconcile with", "reconcile differences", "reconcile the two"], example: "We must reconcile growth with ecology.", exampleZh: "我们必须在增长与生态间取得平衡。" },
    {
    pos: "vt.", meaningZh: "使和解；调停；使和谐；使一致；使听从；对帐；使一致", meaningEn: "", collocations: [], example: "", exampleZh: "" }
    ]
  },
  {
    id: "subtle", term: "subtle", phonetic: "/ˈsʌt(ə)l/", pos: "adj.", meaningZh: "微妙的；细微的；敏锐的；精细的；狡猾的；稀薄的；灵巧的；锐敏的", meaningEn: "not obvious, delicate", band: "8", collocations: ["subtle difference", "subtle change", "subtle hint"], example: "There is a subtle difference in tone.", exampleZh: "语气上有微妙的差别。",
    senses: [
    {
    pos: "adj.", meaningZh: "微妙的；细微的；敏锐的；精细的；狡猾的；稀薄的；灵巧的；锐敏的", meaningEn: "not obvious, delicate", collocations: ["subtle difference", "subtle change", "subtle hint"], example: "There is a subtle difference in tone.", exampleZh: "语气上有微妙的差别。" }
    ]
  },
  {
    id: "unprecedented", term: "unprecedented", phonetic: "/ʌnˈpɹɛsɪdɛntɪd/", pos: "adj.", meaningZh: "前所未有的；空前的；无前例的", meaningEn: "never happened before", band: "8", collocations: ["unprecedented scale", "unprecedented growth", "unprecedented level"], example: "The pandemic caused unprecedented disruption.", exampleZh: "疫情造成了前所未有的冲击。",
    senses: [
    {
    pos: "adj.", meaningZh: "前所未有的；空前的；无前例的", meaningEn: "never happened before", collocations: ["unprecedented scale", "unprecedented growth", "unprecedented level"], example: "The pandemic caused unprecedented disruption.", exampleZh: "疫情造成了前所未有的冲击。" }
    ]
  },
  {
    id: "stringent", term: "stringent", phonetic: "/ˈstrɪndʒənt/", pos: "adj.", meaningZh: "严格的；严厉的；迫切的；银根紧的；约束的；紧迫的", meaningEn: "very strict", band: "8", collocations: ["stringent rules", "stringent standards", "stringent controls"], example: "The new law sets stringent emission limits.", exampleZh: "新法律设定了严格的排放限值。",
    senses: [
    {
    pos: "adj.", meaningZh: "严格的；严厉的；迫切的；银根紧的；约束的；紧迫的", meaningEn: "very strict", collocations: ["stringent rules", "stringent standards", "stringent controls"], example: "The new law sets stringent emission limits.", exampleZh: "新法律设定了严格的排放限值。" }
    ]
  },
  {
    id: "vindicate", term: "vindicate", phonetic: "/ˈvɪndɪkeɪt/", pos: "v.", meaningZh: "证明正确；为…辩护", meaningEn: "to show to be right", band: "8", collocations: ["vindicate a claim", "vindicate the theory", "fully vindicate"], example: "Later evidence vindicated her warning.", exampleZh: "后来的证据证明了她的警告是正确的。",
    senses: [
    {
    pos: "v.", meaningZh: "证明正确；为…辩护", meaningEn: "to show to be right", collocations: ["vindicate a claim", "vindicate the theory", "fully vindicate"], example: "Later evidence vindicated her warning.", exampleZh: "后来的证据证明了她的警告是正确的。" },
    {
    pos: "vt.", meaningZh: "辩护；证明...无辜；维护；辩护；辩解；辩明", meaningEn: "", collocations: [], example: "", exampleZh: "" }
    ]
  }
];

export const SEED_WORDS: VocabEntry[] = [...SEED_CORE, ...SEED_BULK];

/**
 * 种子版本号。每当内置词表内容（释义/词性/例句）更新时，改这个值即可触发
 * 用户本地库的「一次性的内置词刷新」——把早期版本里残缺（仅有中文释义）的种子词
 * 用最新富文本覆盖更新，且不影响用户导入的词与 FSRS 学习进度。
 */
export const SEED_VERSION = '2026-07-17-ecdict-dictapi';
