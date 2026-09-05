import type { Project, Service } from "./types";
import { DEFAULT_LOCALE, type Locale } from "./i18n";

/*
 * ---------------------------------------------------------------------------
 * BEFORE DEPLOYING — two things in here are not real yet:
 *
 * 1. liveUrl / githubUrl are example.com placeholders. They are deliberately
 *    obvious rather than plausible-looking (github.com/devzfy/<something>
 *    would read as real and 404). Replace them with real URLs, or delete the
 *    fields — the case study only renders a button when the field is set, so
 *    deleting them is safe and leaves no gap. These are client projects, so
 *    for most of them "no public link" is probably the correct answer.
 *
 * 2. The problem / approach / result copy is inferred from the metrics and
 *    tech stack below, not from any source document. It is plausible and
 *    internally consistent, but it is not attested — read it for factual
 *    accuracy before it represents you.
 *
 * imageUrl is intentionally left unset. Per-project openGraph images are
 * generated at build time from this data (app/projects/[slug]/opengraph-image.tsx),
 * so no stock placeholder is needed. Set imageUrl only when you have a real
 * project image to show in the page hero.
 * ---------------------------------------------------------------------------
 */

const EN_PROJECTS: Project[] = [
  {
    id: "elearning",
    title: "Global E-learning Platform",
    description:
      "Engineered the frontend of a large-scale education platform for 2.5 million+ learners.",
    longDescription:
      "Frontend engineering for an education platform serving more than 2.5 million active learners. The work centred on the Next.js and TypeScript application layer — component architecture, state management with Redux, motion design with Framer Motion — together with the performance work that brought load times down by 30%.",
    problem:
      "Serving 2.5 million active learners puts every frontend decision under load. Slow paint on the heaviest course routes and an inconsistent component model were costing engagement at exactly the moment a learner decides whether to keep going.",
    approach:
      "Rebuilt the application layer on Next.js and TypeScript behind a strict component contract, moved shared state into Redux with predictable selectors, and treated motion as part of the interface rather than decoration. The performance work went straight at the render path: bundle splitting, image strategy, and removing layout thrash on the routes that carried the most traffic.",
    result:
      "Load times improved by 30% and engagement rose 20% on the back of the UX changes — on a codebase 2.5 million active users now depend on.",
    techStack: [
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Redux",
      "Framer Motion",
    ],
    metrics: [
      "2.5M+ active users",
      "30% improvement in load times",
      "Increased engagement by 20% through UX optimizations",
    ],
    // PLACEHOLDER LINKS — see the note at the top of this file.
    liveUrl: "https://example.com/elearning-platform",
    githubUrl: "https://example.com/elearning-repo",
  },
  {
    id: "ecommerce",
    title: "E-commerce Web App Overhaul",
    description:
      "Revamped a legacy e-commerce site with Next.js and modern UI components, integrating Stripe.",
    longDescription:
      "A full overhaul of a legacy storefront. The old frontend was replaced with a Next.js application built on a modern component architecture using shadcn/ui, with the Stripe API wired in for multi-method payments and a checkout flow rebuilt to complete 50% faster.",
    problem:
      "A legacy storefront where checkout was the bottleneck. Every additional payment method meant more branching through code that was already difficult to change safely, so the cost of each new option kept rising.",
    approach:
      "Replaced the legacy frontend with a Next.js application on a composable shadcn/ui component layer, and rebuilt checkout around the Stripe API so an additional payment method became configuration rather than a new code path. Product and order data moved onto PostgreSQL.",
    result:
      "Checkout completes 50% faster, multi-method payments work without special-casing, and the component architecture makes the next change cheap instead of risky.",
    techStack: ["React", "Next.js", "Stripe API", "shadcn/ui", "PostgreSQL"],
    metrics: [
      "Modern component architecture",
      "Seamless multi-payment integration",
      "50% faster checkout flow",
    ],
    // PLACEHOLDER LINK — see the note at the top of this file.
    liveUrl: "https://example.com/storefront",
  },
  {
    id: "logistics",
    title: "Real-time Logistics Dashboard",
    description:
      "Handles 5,000+ daily operations and ~1,000 concurrent users with real-time data visualization.",
    longDescription:
      "A real-time operations dashboard handling over 5,000 daily operations for roughly 1,000 concurrent users. Live asset positions stream in over Socket.io and are visualised with D3.js, alongside a built-in predictive analytics view and a real-time chat channel between customers and the company. Data latency dropped by 60%.",
    problem:
      "Operations teams were making decisions on stale data. At 5,000+ daily operations and roughly 1,000 concurrent users, polling could not keep the picture current, and customers had no direct line to the company from inside the product.",
    approach:
      "Moved live asset positions onto Socket.io streams and visualised them with D3.js, with TanStack Query owning server state so the interface never re-fetched what it already had. A predictive analytics view sits on the same stream, as does a real-time chat channel between customers and the company.",
    result:
      "Data latency fell 60%, 5,000+ assets are tracked live, and roughly 1,000 concurrent users now work from the same current picture instead of their own stale copies.",
    techStack: [
      "React",
      "Socket.io",
      "D3.js",
      "Node.js",
      "TypeScript",
      "TanStack Query",
    ],
    metrics: [
      "60% reduction in data latency",
      "Real-time tracking of 5k+ assets",
      "Built-in predictive analytics view",
      "Built a real-time chat between customers and company",
    ],
    // PLACEHOLDER LINK — see the note at the top of this file.
    githubUrl: "https://example.com/logistics-repo",
  },
  {
    id: "admin-crm",
    title: "Enterprise Admin Dashboard",
    description:
      "Internal tools managing 10k+ records with automated workflows to cut manual operations.",
    longDescription:
      "Internal tooling for managing more than 10,000 customer records. Twelve core business workflows were automated, halving manual data entry, and a real-time chat channel between leads and admins was built on Socket.io. Data is surfaced through Chart.js dashboards with TanStack Query handling server state.",
    problem:
      "Internal teams were hand-carrying more than 10,000 customer records through processes that existed only as convention. The cost was not only the hours — it was the error rate that comes with any manual data entry at that volume.",
    approach:
      "Automated twelve core business workflows behind a single admin surface, with TanStack Query managing server state and Chart.js turning record-level data into something a manager can act on. Leads and admins talk over a Socket.io channel inside the same tool.",
    result:
      "Manual data entry halved, twelve workflows now run without intervention, and 10,000+ records sit under one roof with an audit trail instead of in spreadsheets.",
    techStack: ["React", "TanStack Query", "Tailwind", "Chart.js", "Socket.io"],
    metrics: [
      "50% less manual data entry",
      "Managed 10,000+ customer records",
      "Automated 12 core business workflows",
      "Built a real-time chat between leads and admins",
    ],
  },
];

const UZ_PROJECTS: Project[] = [
  {
    ...EN_PROJECTS[0]!,
    title: "2,5 mln+ foydalanuvchili ta’lim platformasi",
    description:
      "Millionlab o‘quvchilar foydalanadigan platforma uchun tezkor, qulay va katta yuklamaga tayyor interfeys yaratdik.",
    longDescription:
      "Ushbu ta’lim platformasidan 2,5 milliondan ortiq faol foydalanuvchi foydalanadi. Biz Next.js va TypeScript asosidagi interfeys arxitekturasini qayta ko‘rib chiqdik, umumiy holatni Redux orqali tartibga soldik, Framer Motion yordamida tabiiy animatsiyalar yaratdik va asosiy sahifalarni tezlashtirdik.",
    problem:
      "Kurs sahifalari sekin ochilar, interfeys qismlari esa yagona tartib asosida qurilmagan edi. Foydalanuvchilar soni millionlab bo‘lgan sharoitda kichik kechikishning o‘zi ham o‘qish jarayoni va faollikka sezilarli ta’sir qilardi.",
    approach:
      "Biz interfeysni qayta foydalaniladigan komponentlar asosida tartibga keltirdik. Kodni bo‘laklarga ajratdik, rasmlarni yuklash usulini yaxshiladik va sahifadagi keraksiz qayta chizishlarni kamaytirdik. Animatsiyalarni bezak sifatida emas, foydalanuvchiga yo‘l ko‘rsatuvchi vosita sifatida ishlatdik.",
    result:
      "Sahifalar 30% tezroq yuklana boshladi, foydalanish qulayligi bo‘yicha o‘zgarishlar esa faollikni 20% oshirdi. Yechim 2,5 milliondan ortiq faol foydalanuvchi uchun barqaror ishlamoqda.",
    metrics: [
      "2.5M+ faol foydalanuvchi",
      "30% tezroq sahifa yuklanishi",
      "20% yuqori foydalanuvchi faolligi",
    ],
  },
  {
    ...EN_PROJECTS[1]!,
    title: "Internet-do‘konni to‘liq yangilash",
    description:
      "Eskirgan internet-do‘konni zamonaviy ko‘rinish, qulay xarid jarayoni va bir nechta to‘lov usuli bilan qayta yaratdik.",
    longDescription:
      "Biz internet-do‘konning eski interfeysini Next.js va shadcn/ui asosida boshidan qayta qurdik. Mahsulot tanlashdan to‘lovgacha bo‘lgan yo‘lni soddalashtirdik, Stripe orqali bir nechta to‘lov turini yagona tizimga birlashtirdik va buyurtma berish jarayonini sezilarli tezlashtirdik.",
    problem:
      "Xaridorlar buyurtmani rasmiylashtirishda ortiqcha bosqichlardan o‘tardi. Eski kodga yangi to‘lov usulini qo‘shish qiyin va xatarga boy bo‘lib, do‘konni rivojlantirishni sekinlashtirardi.",
    approach:
      "Biz xarid jarayonini foydalanuvchi nuqtayi nazaridan qayta loyihaladik. Interfeysni yagona komponentlar tizimiga o‘tkazdik, to‘lovlarni Stripe orqali boshqardik, mahsulot va buyurtma ma’lumotlarini esa PostgreSQL bazasida tartibli saqladik.",
    result:
      "Buyurtma berish 50% tezlashdi. Xaridorlar o‘ziga qulay to‘lov usulini tanlay oladi, biznes esa yangi imkoniyatlarni tizimga ancha tez va xavfsiz qo‘sha oladi.",
    metrics: [
      "Yagona va kengayuvchan interfeys tizimi",
      "Bir nechta to‘lov usuli",
      "50% tezroq buyurtma berish jarayoni",
    ],
  },
  {
    ...EN_PROJECTS[2]!,
    title: "Jonli logistika boshqaruv tizimi",
    description:
      "Kuniga 5 000 dan ortiq operatsiyani boshqarish va obyektlarni xaritada jonli kuzatish uchun yagona tizim yaratdik.",
    longDescription:
      "Biz logistika jamoasi uchun transport va boshqa obyektlar holatini bir oynada kuzatish imkonini beradigan boshqaruv tizimini yaratdik. Ma’lumotlar Socket.io orqali uzluksiz yangilanadi va D3.js yordamida tushunarli ko‘rinishda aks etadi. Tizimga tahliliy ko‘rsatkichlar hamda mijoz bilan kompaniya o‘rtasidagi jonli muloqotni ham qo‘shdik.",
    problem:
      "Jamoa tez eskirib qoladigan ma’lumotlar bilan ishlardi. Kuniga minglab operatsiya bajarilganda oddiy davriy so‘rovlar vaziyatni o‘z vaqtida ko‘rsata olmas, mijoz bilan aloqa esa alohida kanallarda olib borilardi.",
    approach:
      "Biz jonli ma’lumotlarni Socket.io oqimiga o‘tkazdik, xarita va ko‘rsatkichlarni D3.js bilan vizuallashtirdik. TanStack Query yordamida ortiqcha so‘rovlarni kamaytirdik. Tahlil va chatni ham shu yagona tizim ichiga joylashtirdik.",
    result:
      "Ma’lumotlarning kechikishi 60% kamaydi. Endi 5 000 dan ortiq obyekt jonli kuzatiladi, qariyb 1 000 foydalanuvchi esa bir vaqtning o‘zida yagona va dolzarb ma’lumot bilan ishlaydi.",
    metrics: [
      "60% kamroq ma’lumot kechikishi",
      "5k+ obyektni jonli kuzatish",
      "Qaror qabul qilish uchun tahliliy ko‘rsatkichlar",
      "Mijoz va kompaniya o‘rtasida jonli chat",
    ],
  },
  {
    ...EN_PROJECTS[3]!,
    title: "Biznes jarayonlarini boshqarish paneli",
    description:
      "10 000 dan ortiq mijoz yozuvi va kundalik ish jarayonlarini yagona joyda boshqaradigan ichki tizim yaratdik.",
    longDescription:
      "Biz kompaniyaning mijozlar bazasi, ko‘rsatkichlari va takrorlanuvchi vazifalarini yagona boshqaruv paneliga birlashtirdik. O‘n ikkita asosiy jarayonni avtomatlashtirdik, ma’lumotlarni Chart.js grafiklarida aniq ko‘rsatdik, lidlar va administratorlar uchun esa Socket.io asosida jonli chat yaratdik.",
    problem:
      "Jamoa 10 000 dan ortiq mijoz yozuvini ko‘p jihatdan qo‘lda boshqarardi. Takroriy vazifalar vaqtni olar, turli jadvallarda saqlangan ma’lumotlar esa xatolar va nazoratning yo‘qolishiga sabab bo‘lardi.",
    approach:
      "Biz asosiy ish jarayonlarini tahlil qilib, o‘n ikkita takroriy vazifani avtomatlashtirdik. TanStack Query yordamida ma’lumotlarni doim dolzarb saqladik, Chart.js orqali rahbarlar uchun muhim ko‘rsatkichlarni ko‘rsatdik va ichki chat bilan muloqotni bir joyga jamladik.",
    result:
      "Qo‘lda ma’lumot kiritish 50% kamaydi, 12 ta jarayon avtomatik ishlay boshladi va 10 000 dan ortiq yozuv o‘zgarishlar tarixi bilan yagona tizimda boshqarilmoqda.",
    metrics: [
      "50% kamroq qo‘lda ma’lumot kiritish",
      "10,000+ mijoz yozuvi yagona tizimda",
      "12 ta asosiy biznes jarayoni avtomatlashtirildi",
      "Lidlar va administratorlar uchun jonli chat",
    ],
  },
];

const RU_PROJECTS: Project[] = [
  {
    ...EN_PROJECTS[0]!,
    title: "Образовательная платформа для 2,5 млн+ пользователей",
    description:
      "Быстрый, удобный и готовый к высоким нагрузкам интерфейс для платформы, которой пользуются миллионы учащихся.",
    longDescription:
      "Образовательной платформой пользуются более 2,5 млн активных учащихся. В рамках проекта была переработана архитектура интерфейса на Next.js и TypeScript, упорядочено управление состоянием через Redux, добавлены естественные анимации на Framer Motion и ускорена загрузка ключевых страниц.",
    problem:
      "Страницы курсов загружались медленно, а элементы интерфейса не были объединены в единую систему. При миллионной аудитории даже небольшая задержка заметно влияла на учебный процесс и вовлечённость.",
    approach:
      "Интерфейс был собран из переиспользуемых компонентов. Разделение кода, оптимизация изображений и устранение лишних перерисовок ускорили основные разделы. Анимации стали частью пользовательского сценария, а не просто украшением.",
    result:
      "Страницы стали загружаться на 30% быстрее, а улучшения пользовательского опыта повысили вовлечённость на 20%. Решение стабильно работает для аудитории более 2,5 млн человек.",
    metrics: [
      "2.5M+ активных пользователей",
      "30% быстрее загружаются страницы",
      "20% рост вовлечённости пользователей",
    ],
  },
  {
    ...EN_PROJECTS[1]!,
    title: "Полное обновление интернет-магазина",
    description:
      "Устаревший интернет-магазин получил современный интерфейс, простой путь к покупке и несколько способов оплаты.",
    longDescription:
      "Интерфейс интернет-магазина был заново собран на Next.js и shadcn/ui. Путь от выбора товара до оплаты стал короче и понятнее, несколько способов оплаты объединились через Stripe, а оформление заказа заметно ускорилось.",
    problem:
      "Покупателям приходилось проходить лишние шаги при оформлении заказа. Добавление новых способов оплаты в устаревший код занимало много времени и повышало риск ошибок.",
    approach:
      "Процесс покупки был перепроектирован с точки зрения клиента. Интерфейс переведён на единую систему компонентов, платежи подключены через Stripe, а данные товаров и заказов организованы в PostgreSQL.",
    result:
      "Оформление заказа стало на 50% быстрее. Покупатели могут выбрать удобный способ оплаты, а бизнес — безопасно и быстро развивать магазин.",
    metrics: [
      "Единая и расширяемая система интерфейса",
      "Несколько способов оплаты",
      "На 50% быстрее оформление заказа",
    ],
  },
  {
    ...EN_PROJECTS[2]!,
    title: "Система управления логистикой в реальном времени",
    description:
      "Единая система для 5 000+ операций в день и отслеживания объектов на карте в реальном времени.",
    longDescription:
      "Для команды логистики создана панель, в которой видно текущее состояние транспорта и других объектов. Данные обновляются через Socket.io и наглядно отображаются с помощью D3.js. В систему также встроены аналитика и чат между клиентом и компанией.",
    problem:
      "Команда принимала решения на основе данных, которые быстро устаревали. При тысячах ежедневных операций периодические запросы не успевали показывать актуальную ситуацию, а общение с клиентами происходило в отдельных каналах.",
    approach:
      "Потоковые обновления были реализованы через Socket.io, карта и показатели — через D3.js. TanStack Query сократил лишние запросы, а аналитика и чат стали частью одной рабочей среды.",
    result:
      "Задержка данных снизилась на 60%. Более 5 000 объектов отслеживаются онлайн, а около 1 000 пользователей одновременно работают с единой актуальной информацией.",
    metrics: [
      "60% снижение задержки данных",
      "5k+ объектов отслеживаются онлайн",
      "Аналитика для принятия решений",
      "Чат между клиентами и компанией",
    ],
  },
  {
    ...EN_PROJECTS[3]!,
    title: "Панель управления бизнес-процессами",
    description:
      "Внутренняя система для управления 10 000+ клиентских записей и автоматизации ежедневных операций.",
    longDescription:
      "Клиентская база, показатели и повторяющиеся задачи компании были объединены в одной панели. Двенадцать ключевых процессов автоматизированы, данные представлены в понятных графиках Chart.js, а для лидов и администраторов создан чат на Socket.io.",
    problem:
      "Команда вручную обрабатывала более 10 000 клиентских записей. Повторяющиеся операции отнимали время, а данные в разных таблицах приводили к ошибкам и усложняли контроль.",
    approach:
      "После анализа рабочих процессов двенадцать повторяющихся операций были автоматизированы. TanStack Query поддерживает данные в актуальном состоянии, Chart.js показывает важные руководителю показатели, а встроенный чат объединяет коммуникацию.",
    result:
      "Объём ручного ввода сократился на 50%, двенадцать процессов работают автоматически, а более 10 000 записей управляются в единой системе с историей изменений.",
    metrics: [
      "50% меньше ручного ввода данных",
      "10,000+ клиентских записей в одной системе",
      "Автоматизировано 12 ключевых процессов",
      "Встроенный чат для лидов и администраторов",
    ],
  },
];

const EN_SERVICES: Service[] = [
  {
    id: "ui-dev",
    title: "Interactive UI Development",
    description:
      "Fluid, Responsive UI Development – Building interfaces with Javascript/TypeScript (React/Next) and Tailwind that feel smooth on every device.",
    icon: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4",
  },
  {
    id: "mobile-app",
    title: "Mobile App Development",
    description:
      "Cross-platform mobile apps built with React Native – native feel, fast delivery, and a single codebase.",
    icon: "M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3",
  },
  {
    id: "telegram-bot",
    title: "Telegram Bot Development",
    description:
      "Building robust Telegram bots with Node.js and Telegraf – automated, secure, and fast messaging workflows.",
    icon: "M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.631 8.41m5.96 5.96a14.926 14.926 0 0 1-5.841 2.58m-.119-8.54a6 6 0 0 0-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 0 0-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 0 1-2.448-2.448 14.9 14.9 0 0 1 .06-.312m-2.24 2.39a4.493 4.493 0 0 0-1.757 4.306 4.493 4.493 0 0 0 4.306-1.758M16.5 9a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z",
  },
  {
    id: "ai-integration",
    title: "AI Integration",
    description:
      "Seamlessly integrating AI into web and mobile products — from intelligent chat to automated workflows and data-driven features.",
    icon: "M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z",
  },
  {
    id: "desktop-app",
    title: "Desktop App (Electron)",
    description:
      "Cross-platform desktop apps using Electron.js — combining web tech with native performance.",
    icon: "M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0V12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12V5.25",
  },
  {
    id: "performance",
    title: "Performance Optimization",
    description:
      "Optimizing for speed and load times, achieving 20–40% faster page loads in production environments.",
    icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6",
  },
  {
    id: "motion-webgl",
    title: "Advanced Animations & WebGL",
    description:
      "Crafting standout experiences with Framer Motion, GSAP, and Three.js for that extra wow-factor.",
    icon: "M13 10V3L4 14h7v7l9-11h-7z",
  },
];

const SERVICE_COPY: Record<Exclude<Locale, "en">, Array<Pick<Service, "title" | "description">>> = {
  uz: [
    {
      title: "Veb-sayt va veb-ilovalar",
      description:
        "Biznes maqsadingizga mos, telefon va kompyuterda birdek qulay ishlaydigan zamonaviy sayt hamda veb-ilovalar yaratamiz.",
    },
    {
      title: "Mobil ilovalar",
      description:
        "React Native yordamida iOS va Android uchun tezkor, qulay va yagona kod bazasida boshqariladigan mobil ilovalar ishlab chiqamiz.",
    },
    {
      title: "Telegram botlar",
      description:
        "Buyurtma qabul qilish, mijozlarga xizmat ko‘rsatish va kundalik vazifalarni avtomatlashtirish uchun ishonchli Telegram botlar yaratamiz.",
    },
    {
      title: "Sun’iy intellekt yechimlari",
      description:
        "Aqlli yordamchi, avtomatik tahlil yoki takroriy ishlarni bajaruvchi vositalar orqali sun’iy intellektni mahsulotingizga amaliy foyda bilan qo‘shamiz.",
    },
    {
      title: "Kompyuter uchun ilovalar",
      description:
        "Electron.js asosida Windows va macOS tizimlarida ishlaydigan, qulay va boshqarish oson dasturlar yaratamiz.",
    },
    {
      title: "Sayt tezligini oshirish",
      description:
        "Sekin ishlayotgan sahifalarni tahlil qilib, yuklanish vaqtini qisqartiramiz va foydalanuvchi tajribasini yaxshilaymiz. Amaliy loyihalarda 20–40% gacha tezlashishga erishilgan.",
    },
    {
      title: "Animatsiya va WebGL",
      description:
        "Framer Motion, GSAP va Three.js yordamida brendingizni ajratib turadigan, esda qoladigan interaktiv tajribalar yaratamiz.",
    },
  ],
  ru: [
    {
      title: "Сайты и веб-приложения",
      description:
        "Создаём современные сайты и веб-приложения под задачи бизнеса — быстрые, понятные и удобные на телефоне и компьютере.",
    },
    {
      title: "Мобильные приложения",
      description:
        "Разрабатываем быстрые и удобные приложения для iOS и Android на React Native с единой кодовой базой.",
    },
    {
      title: "Telegram-боты",
      description:
        "Создаём надёжных ботов для приёма заказов, поддержки клиентов и автоматизации повседневных задач.",
    },
    {
      title: "Решения на базе ИИ",
      description:
        "Добавляем в продукты умных помощников, автоматический анализ и инструменты, которые снимают с команды повторяющуюся работу.",
    },
    {
      title: "Приложения для компьютера",
      description:
        "Разрабатываем на Electron.js удобные приложения, которые работают на Windows и macOS.",
    },
    {
      title: "Ускорение сайтов",
      description:
        "Находим причины медленной загрузки и улучшаем пользовательский опыт. В реальных проектах страницы становились быстрее на 20–40%.",
    },
    {
      title: "Анимация и WebGL",
      description:
        "Создаём на Framer Motion, GSAP и Three.js интерактивные визуальные решения, которые выделяют бренд и запоминаются.",
    },
  ],
};

function localizeServices(locale: Locale): Service[] {
  if (locale === "en") return EN_SERVICES;
  return EN_SERVICES.map((service, index) => ({
    ...service,
    ...SERVICE_COPY[locale][index],
  }));
}

export const PROJECTS_BY_LOCALE: Record<Locale, Project[]> = {
  uz: UZ_PROJECTS,
  ru: RU_PROJECTS,
  en: EN_PROJECTS,
};

export const SERVICES_BY_LOCALE: Record<Locale, Service[]> = {
  uz: localizeServices("uz"),
  ru: localizeServices("ru"),
  en: EN_SERVICES,
};

/** Default-language exports kept for static assets and compatibility. */
export const PROJECTS = PROJECTS_BY_LOCALE[DEFAULT_LOCALE];
export const SERVICES = SERVICES_BY_LOCALE[DEFAULT_LOCALE];

export function getProjects(locale: Locale = DEFAULT_LOCALE): Project[] {
  return PROJECTS_BY_LOCALE[locale];
}

export function getServices(locale: Locale = DEFAULT_LOCALE): Service[] {
  return SERVICES_BY_LOCALE[locale];
}

/** Slugs for /projects/[slug] — driven by Project.id. */
export function getProjectSlugs(): string[] {
  return PROJECTS.map((project) => project.id);
}

export function getProjectBySlug(
  slug: string,
  locale: Locale = DEFAULT_LOCALE,
): Project | undefined {
  return getProjects(locale).find((project) => project.id === slug);
}

/** 0-based position, used for the "Case Study 0N" label. */
export function getProjectIndex(slug: string): number {
  return PROJECTS.findIndex((project) => project.id === slug);
}

/**
 * The next project in the array, wrapping around at the end so the case study
 * pages form a loop. Returns undefined only if the slug is unknown.
 */
export function getNextProject(
  slug: string,
  locale: Locale = DEFAULT_LOCALE,
): Project | undefined {
  const index = getProjectIndex(slug);
  if (index === -1) return undefined;
  const projects = getProjects(locale);
  return projects[(index + 1) % projects.length];
}

export interface ParsedMetric {
  /** The headline figure, e.g. "2.5M+", "30%", "12". Null when the metric is qualitative. */
  value: string | null;
  /** The metric with the figure removed, or the whole string when there is no figure. */
  label: string;
  /**
   * True when the figure led the string and was cleanly lifted out of the
   * label. False means the label still contains the figure. Callers with tight
   * space (the openGraph card) can prefer the clean ones.
   */
  leads: boolean;
}

/**
 * Splits a metric string into a big number and its caption.
 *
 * The figure is only lifted out of the caption when it leads the string
 * ("2.5M+ active users" -> "2.5M+" / "active users"). When it sits mid-sentence
 * the caption is left whole, because removing it strands the preposition —
 * "Increased engagement by 20% through UX optimizations" would otherwise become
 * "Increased engagement by through UX optimizations". The figure repeats in
 * those cases, which is redundant but always grammatical.
 *
 * Metrics with no figure at all ("Modern component architecture") return
 * value: null and get rendered as statements instead.
 */
export function parseMetric(metric: string): ParsedMetric {
  const match = metric.match(/\d[\d.,]*\s*(?:%|[MKk]\+?|x)?\+?/);
  if (!match) {
    return { value: null, label: metric, leads: false };
  }

  const value = match[0].trim();
  const leads = match.index === 0;
  if (!leads) {
    return { value, label: metric, leads: false };
  }

  const label = metric.slice(match[0].length).replace(/\s{2,}/g, " ").trim();
  return {
    value,
    label: label.length > 0 ? label : metric,
    leads: true,
  };
}
