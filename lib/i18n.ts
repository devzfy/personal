export const LOCALES = ["uz", "ru", "en"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "uz";
export const LOCALE_COOKIE = "locale";

export const LOCALE_LABELS: Record<Locale, string> = {
  uz: "UZ",
  ru: "RU",
  en: "EN",
};

export const LOCALE_NAMES: Record<Locale, string> = {
  uz: "O‘zbekcha",
  ru: "Русский",
  en: "English",
};

const uz = {
  site: {
    jobTitle: "Dasturiy ta’minot muhandisi",
    description:
      "Biznesingiz uchun tezkor, qulay va zamonaviy raqamli mahsulotlar yaratamiz: veb va mobil ilovalar, Telegram botlar hamda sun’iy intellekt yechimlari. Har bir loyihani aniq maqsad, puxta dizayn va ishonchli kod asosida quramiz.",
    ogAlt: "Javokhir Shokirov — dasturiy ta’minot muhandisi",
  },
  nav: { work: "Bosh sahifa", archive: "Loyihalar", contact: "Bog‘lanish" },
  language: { label: "Tilni tanlash" },
  hero: {
    headline: "G‘oyadan Tayyor Mahsulotgacha",
    particleStages: [
      "G‘oyadan\nTayyor\nMahsulotgacha",
      "Veb-sayt, ilova\nyoki bot —\nbarchasini\nyaratamiz.",
      "Chiroyli Ko‘rinish.\nQulay Tajriba.\nIshonchli Natija.",
      "Loyihalar Bilan\nTanishing",
    ],
    visionBefore: "Veb-sayt, ilova yoki bot —",
    visionAfter: "barchasini yaratamiz.",
    missionBefore: "Chiroyli ko‘rinish. Qulay tajriba.",
    missionAfter: "Ishonchli natija.",
    continue: "Loyihalar bilan tanishing",
  },
  about: {
    portraitAlt: "Javokhir Shokirov portreti",
    years: "Yildan ortiq tajriba",
    eyebrow: "Men haqimda",
    title: "Toshkentda yashayman,\nDunyo bo‘ylab ishlayman.",
    paragraphs: [
      "Men Javokhir Shokirov — 5 yildan ortiq tajribaga ega dasturiy ta’minot muhandisiman. Startaplar va bizneslar uchun tez ishlaydigan, foydalanish oson va keyinchalik kengaytirish mumkin bo‘lgan raqamli mahsulotlar yarataman.",
      "Ishim faqat kod yozish bilan tugamaydi. Avval biznes maqsadini tushunaman, so‘ng foydalanuvchi uchun qulay yechimni loyihalab, uni puxta texnik asosda ishga tushiraman. Natijada chiroyli ko‘rinadigan, barqaror ishlaydigan va biznesga foyda keltiradigan mahsulot paydo bo‘ladi.",
    ],
    learners: "Foydalanuvchi",
    efficiency: "Samaradorlik o‘sishi",
    principlesTitle: "Ish jarayonida amal qiladigan uch tamoyil",
    principles: [
      {
        title: "Maqsadni tushunish",
        description:
          "Texnologiyani tanlashdan oldin biznes vazifasi, auditoriya va kutilayotgan natijani birgalikda aniqlab olamiz.",
      },
      {
        title: "Ochiq jarayon",
        description:
          "Siz ishning har bir bosqichidan xabardor bo‘lasiz: nima qilinyapti, nega qilinyapti va keyingi qadam nima.",
      },
      {
        title: "Uzoq muddatli sifat",
        description:
          "Mahsulotni faqat bugungi vazifa uchun emas, keyinchalik rivojlantirish va qo‘llab-quvvatlash oson bo‘lishi uchun quramiz.",
      },
    ],
  },
  services: {
    eyebrow: "Xizmatlar",
    title: "Sizga qanday yordam bera olaman",
    aria: "Taklif etiladigan xizmatlar",
    gridTitle: "G‘oyangiz uchun kerakli texnik yechimlar.",
    gridDescription:
      "Maqsadingizga mos texnologiyani tanlab, tezkor va ishonchli mahsulot yaratamiz.",
  },
  home: {
    selectedWork: "Amalga oshirilgan loyihalar",
    notableSuccesses: "Natija bergan yechimlar.",
    featuredDescription:
      "Har bir loyiha ortida aniq vazifa, o‘ylangan yechim va o‘lchanadigan natija bor.",
    viewArchive: "Barcha loyihalarni ko‘rish",
    caseStudyAria: (title: string) => `${title} loyihasi haqida batafsil o‘qish`,
  },
  project: {
    caseStudy: "Bajarilgan loyiha",
    techStack: "Ishlatilgan texnologiyalar",
    impact: "Asosiy natija",
    archiveTitle: "Loyihalar.",
    archiveDescription:
      "Murakkab vazifalar uchun yaratilgan amaliy yechimlar. Har bir loyihada muammo, tanlangan yondashuv va erishilgan natijani ko‘rishingiz mumkin.",
    archiveMetaDescription:
      "Javokhir Shokirov yaratgan raqamli mahsulotlar: 2,5 mln+ foydalanuvchili ta’lim platformasi, internet-do‘kon, jonli logistika tizimi va korporativ boshqaruv paneli.",
    notFound: "Loyiha topilmadi",
    back: "Barcha loyihalarga qaytish",
    viewLive: "Jonli loyihani ko‘rish",
    source: "Manba kodi",
    overview: "Loyiha haqida",
    problem: "Muammo",
    approach: "Yondashuv",
    result: "Natija",
    next: "Keyingi loyiha",
    nextAria: "Keyingi bajarilgan loyiha",
    similar: "Sizda ham shunday loyiha bormi?",
    startConversation: "Loyihani muhokama qilish",
    interfaceAlt: (title: string) => `${title} interfeysi`,
  },
  contact: {
    eyebrow: "Hamkorlikni boshlaymiz",
    titleBefore: "Loyihangizni",
    titleAccent: "muhokama qilamiz.",
    intro:
      "G‘oyangiz, tayyor texnik topshirig‘ingiz yoki yechim talab qilayotgan muammoingiz bormi? Qisqacha yozing — eng maqbul yo‘lni birga topamiz.",
    fullName: "Ism va familiya *",
    email: "Elektron pochta *",
    phone: "Telefon raqami (ixtiyoriy)",
    message: "Xabar *",
    messagePlaceholder: "Loyiha, muddat va kutilayotgan natija haqida qisqacha yozing...",
    send: "Loyihani muhokama qilish",
    sent: "Rahmat! Bu forma hozircha sinov rejimida. Tezkor aloqa uchun Telegram yoki elektron pochtadan foydalaning.",
    socials: "Qulay kanalda bog‘laning",
    location: "Joylashuv",
    locationValue: "Toshkent, O‘zbekiston (UTC+5)",
    status: "Holat",
    statusValue: "Yangi loyihalar uchun ochiqman — odatda 24 soat ichida javob beraman",
    background: "JAVOKHIR SHOKIROV • G‘OYADAN TAYYOR MAHSULOTGACHA",
  },
  footer: {
    eyebrow: "Yangi loyiha boshlamoqchimisiz?",
    title: "G‘oyangizni birga amalga oshiramiz.",
    email: "Elektron xat yozish",
    copy: "Manzilni nusxalash",
    copied: "Elektron pochta manzili nusxalandi!",
    rights: "Barcha huquqlar himoyalangan.",
  },
  loading: "Sayt yuklanmoqda",
  signature: "JS • G‘OYA • YECHIM • NATIJA",
  notFound: {
    title: "Bu sahifa topilmadi.",
    description:
      "Havola eskirgan yoki manzil noto‘g‘ri yozilgan bo‘lishi mumkin. Bosh sahifaga qayting yoki loyihalarni ko‘rib chiqing.",
    home: "Bosh sahifaga",
    archive: "Arxivni ko'rish",
  },
} as const;

type Widen<T> = T extends string
  ? string
  : T extends (...args: infer A) => infer R
    ? (...args: A) => R
    : T extends readonly unknown[]
      ? { [K in keyof T]: Widen<T[K]> }
      : T extends object
        ? { [K in keyof T]: Widen<T[K]> }
        : T;

export type Dictionary = Widen<typeof uz>;

const ru: Dictionary = {
  site: {
    jobTitle: "Инженер-программист",
    description:
      "Создаём быстрые, удобные и современные цифровые продукты для бизнеса: веб- и мобильные приложения, Telegram-боты и решения на базе ИИ. В основе каждого проекта — понятная цель, продуманный дизайн и надёжный код.",
    ogAlt: "Javokhir Shokirov — инженер-программист",
  },
  nav: { work: "Главная", archive: "Проекты", contact: "Связаться" },
  language: { label: "Выбрать язык" },
  hero: {
    headline: "От Идеи До Готового Продукта",
    particleStages: [
      "От Идеи\nДо Готового\nПродукта",
      "Сайт, приложение\nили бот —\nмы воплотим идею\nв жизнь.",
      "Красивый Дизайн.\nУдобный Опыт.\nНадёжный Результат.",
      "Посмотрите\nПроекты",
    ],
    visionBefore: "Сайт, приложение или бот —",
    visionAfter: "мы воплотим идею в жизнь.",
    missionBefore: "Красивый дизайн. Удобный опыт.",
    missionAfter: "Надёжный результат.",
    continue: "Посмотрите проекты",
  },
  about: {
    portraitAlt: "Портрет Javokhir Shokirov",
    years: "Года опыта",
    eyebrow: "Обо мне",
    title: "Живу в Ташкенте,\nРаботаю по всему миру.",
    paragraphs: [
      "Я Javokhir Shokirov, инженер-программист с опытом более пяти лет. Помогаю стартапам и компаниям создавать быстрые, понятные пользователю и готовые к развитию цифровые продукты.",
      "Моя работа не ограничивается написанием кода. Сначала я разбираюсь в бизнес-задаче, затем проектирую удобное решение и запускаю его на надёжной технической основе. В итоге клиент получает продукт, который хорошо выглядит, стабильно работает и приносит пользу бизнесу.",
    ],
    learners: "Пользователей продукта",
    efficiency: "Рост эффективности",
    principlesTitle: "Три принципа моей работы",
    principles: [
      {
        title: "Понимание цели",
        description:
          "До выбора технологий мы вместе определяем бизнес-задачу, аудиторию и результат, которого должен достичь продукт.",
      },
      {
        title: "Прозрачный процесс",
        description:
          "На каждом этапе понятно, что уже сделано, почему принято то или иное решение и что будет дальше.",
      },
      {
        title: "Качество надолго",
        description:
          "Создаём продукт так, чтобы его было удобно развивать, поддерживать и масштабировать после запуска.",
      },
    ],
  },
  services: {
    eyebrow: "Услуги",
    title: "Чем я могу помочь",
    aria: "Предлагаемые услуги",
    gridTitle: "Технические решения для вашей идеи.",
    gridDescription:
      "Подберу подходящие технологии и создам быстрый, надёжный продукт под задачи вашего бизнеса.",
  },
  home: {
    selectedWork: "Реализованные проекты",
    notableSuccesses: "Решения, которые дали результат.",
    featuredDescription:
      "За каждым проектом стоят конкретная задача, продуманное решение и измеримый результат.",
    viewArchive: "Смотреть все проекты",
    caseStudyAria: (title: string) => `Подробнее о проекте ${title}`,
  },
  project: {
    caseStudy: "Реализованный проект",
    techStack: "Использованные технологии",
    impact: "Главный результат",
    archiveTitle: "Проекты.",
    archiveDescription:
      "Практические решения для сложных задач. В каждом проекте показаны исходная проблема, выбранный подход и достигнутый результат.",
    archiveMetaDescription:
      "Цифровые продукты Javokhir Shokirov: образовательная платформа для 2,5 млн+ пользователей, интернет-магазин, логистическая система реального времени и корпоративная панель управления.",
    notFound: "Проект не найден",
    back: "Назад ко всем проектам",
    viewLive: "Открыть проект",
    source: "Исходный код",
    overview: "О проекте",
    problem: "Задача",
    approach: "Подход",
    result: "Результат",
    next: "Следующий проект",
    nextAria: "Следующий реализованный проект",
    similar: "У вас есть похожая задача?",
    startConversation: "Обсудить проект",
    interfaceAlt: (title: string) => `Интерфейс ${title}`,
  },
  contact: {
    eyebrow: "Начнём сотрудничество",
    titleBefore: "Обсудим",
    titleAccent: "ваш проект.",
    intro:
      "Есть идея, готовое техническое задание или задача, которой нужно решение? Коротко расскажите о ней — вместе найдём оптимальный путь.",
    fullName: "Полное имя *",
    email: "Электронная почта *",
    phone: "Номер телефона (необязательно)",
    message: "Сообщение *",
    messagePlaceholder: "Коротко опишите проект, сроки и ожидаемый результат...",
    send: "Обсудить проект",
    sent: "Спасибо! Сейчас форма работает в тестовом режиме. Для быстрой связи напишите в Telegram или на электронную почту.",
    socials: "Свяжитесь удобным способом",
    location: "Местоположение",
    locationValue: "Ташкент, Узбекистан (UTC+5)",
    status: "Статус",
    statusValue: "Открыт для новых проектов — обычно отвечаю в течение 24 часов",
    background: "JAVOKHIR SHOKIROV • ОТ ИДЕИ ДО ГОТОВОГО ПРОДУКТА",
  },
  footer: {
    eyebrow: "Планируете новый проект?",
    title: "Давайте вместе воплотим вашу идею.",
    email: "Написать на почту",
    copy: "Скопировать адрес",
    copied: "Адрес электронной почты скопирован!",
    rights: "Все права защищены.",
  },
  loading: "Сайт загружается",
  signature: "JS • ИДЕЯ • РЕШЕНИЕ • РЕЗУЛЬТАТ",
  notFound: {
    title: "Эта страница не найдена.",
    description:
      "Возможно, ссылка устарела или адрес введён неверно. Вернитесь на главную или посмотрите проекты.",
    home: "На главную",
    archive: "Открыть архив",
  },
};

const en: Dictionary = {
  site: {
    jobTitle: "Software Engineer",
    description:
      "We create fast, intuitive, and modern digital products for businesses — from web and mobile apps to Telegram bots and AI-powered solutions.",
    ogAlt: "Javokhir Shokirov — Software Engineer",
  },
  nav: { work: "Work", archive: "Archive", contact: "Contact" },
  language: { label: "Choose language" },
  hero: {
    headline: "Crafting Products That Resonate",
    particleStages: [
      "Crafting\nProducts That\nResonate",
      "Whatever it is —\nwe make it real.",
      "Where Precision\nMeets Emotion.",
      "Continue\nExploring",
    ],
    visionBefore: "Whatever it is —",
    visionAfter: "we make it real.",
    missionBefore: "Where Precision",
    missionAfter: "Meets Emotion.",
    continue: "Continue Exploring",
  },
  about: {
    portraitAlt: "Javokhir Shokirov portrait",
    years: "Years of Exp",
    eyebrow: "Expertise & Story",
    title: "Based in Uzbekistan,\nWorking Globally.",
    paragraphs: [
      "Software Engineer with 5+ years of experience building high-quality web applications with modern JavaScript/TypeScript (React, Next.js, Astro), emphasizing robust, scalable, high-performance solutions.",
      "Expert in React, TypeScript, Next.js and animation libraries, with a strong eye for UI/UX and detail. My work focuses on bridging the gap between functional code and aesthetic brilliance.",
    ],
    learners: "Learners Served",
    efficiency: "Efficiency Gained",
    principlesTitle: "Three principles behind every collaboration",
    principles: [
      {
        title: "Understand the goal",
        description:
          "Before choosing technology, I clarify the business challenge, the audience, and the outcome the product needs to deliver.",
      },
      {
        title: "Keep the process clear",
        description:
          "At every stage, you know what is being built, why decisions were made, and what comes next.",
      },
      {
        title: "Build for the long term",
        description:
          "I create products that remain easy to improve, maintain, and scale well beyond launch.",
      },
    ],
  },
  services: {
    eyebrow: "Capabilities",
    title: "Selected Services",
    aria: "Selected services",
    gridTitle: "Value I Bring to Your Projects.",
    gridDescription:
      "Focused on delivering premium digital experiences through cutting-edge engineering.",
  },
  home: {
    selectedWork: "Selected Work",
    notableSuccesses: "Notable Successes.",
    featuredDescription:
      "Every project starts with a clear challenge and ends with a thoughtful, measurable result.",
    viewArchive: "View Full Archive",
    caseStudyAria: (title: string) => `Read the ${title} case study`,
  },
  project: {
    caseStudy: "Case Study",
    techStack: "Tech Stack",
    impact: "Impact",
    archiveTitle: "Archive.",
    archiveDescription:
      "A curated list of projects, experiments, and collaborations that showcase my approach to frontend architecture and design.",
    archiveMetaDescription:
      "A curated list of projects, experiments, and collaborations that showcase my approach to frontend architecture and design — e-learning at 2.5M+ users, real-time logistics, e-commerce and enterprise dashboards.",
    notFound: "Project not found",
    back: "Back to Archive",
    viewLive: "View Live",
    source: "Source",
    overview: "Overview",
    problem: "Problem",
    approach: "Approach",
    result: "Result",
    next: "Next Project",
    nextAria: "Next case study",
    similar: "Interested in something similar?",
    startConversation: "Start a Conversation",
    interfaceAlt: (title: string) => `${title} interface`,
  },
  contact: {
    eyebrow: "Get In Touch",
    titleBefore: "Work",
    titleAccent: "With Me.",
    intro: "Have a vision? Let's bring it to life through code.",
    fullName: "Full Name *",
    email: "Email Address *",
    phone: "Phone Number (Optional)",
    message: "Message *",
    messagePlaceholder: "Tell me about your project...",
    send: "Send Message",
    sent: "Thank you for your message! This is a demo submission.",
    socials: "Or reach out via:",
    location: "Location",
    locationValue: "Tashkent, Uzbekistan (UTC+5)",
    status: "Status",
    statusValue: "Currently Open for Freelance",
    background: "JAVOKHIR SHOKIROV • PREMIUM ENGINEERING",
  },
  footer: {
    eyebrow: "Let's Connect",
    title: "Interested in working together?",
    email: "Email Me",
    copy: "Copy Email",
    copied: "Email address copied to clipboard!",
    rights: "All rights reserved.",
  },
  loading: "Loading Excellence",
  signature: "JS • PRECISE • EMOTIVE",
  notFound: {
    title: "Lost the thread.",
    description: "This page does not exist. The archive is probably where you were headed.",
    home: "Back Home",
    archive: "View Archive",
  },
};

export const DICTIONARIES: Record<Locale, Dictionary> = { uz, ru, en };

export function isLocale(value: string | undefined): value is Locale {
  return LOCALES.includes(value as Locale);
}

export function getDictionary(locale: Locale): Dictionary {
  return DICTIONARIES[locale];
}
