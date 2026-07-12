export type Level = "junior" | "middle" | "advanced"

export type Block =
  | { type: "text"; title?: string; body: string }
  | { type: "code"; lang?: string; code: string }
  | { type: "list"; title?: string; items: string[] }
  | { type: "callout"; variant: "tip" | "warn" | "key" | "danger"; body: string }

export type Topic = {
  id: string
  title: string
  icon: string
  tagline: string
  levels: Record<Level, Block[]>
}

export const LEVELS: { id: Level; label: string; hint: string }[] = [
  { id: "junior", label: "Начальный", hint: "База, которую спросят на первом этапе" },
  { id: "middle", label: "Средний", hint: "То, что отличает Junior+ от Middle" },
  { id: "advanced", label: "Продвинутый", hint: "Глубина, которая закрывает вакансию" },
]

export const curriculum: Topic[] = [
  {
    id: "typescript",
    title: "TypeScript",
    icon: "FileType",
    tagline: "Строгая типизация на бэке и фронте, минимум any",
    levels: {
      junior: [
        {
          type: "text",
          title: "Зачем TypeScript",
          body: "TS — это надстройка над JavaScript, которая добавляет статические типы. Ошибки ловятся на этапе компиляции, а не в проде. В браузер/Node уходит уже обычный JS после компиляции (tsc / сборщик).",
        },
        {
          type: "code",
          lang: "ts",
          code: `// базовые типы
let age: number = 25
let name: string = "Аня"
let active: boolean = true
let ids: number[] = [1, 2, 3]

// объект через type
type User = { id: number; name: string; email?: string } // ? — необязательное поле

function greet(u: User): string {
  return \`Привет, \${u.name}\`
}`,
        },
        {
          type: "list",
          title: "Что точно нужно знать",
          items: [
            "Разница type vs interface (для объектов почти взаимозаменяемы)",
            "union-типы: string | number, литеральные типы: 'sm' | 'md' | 'lg'",
            "Массивы, кортежи, enum, any / unknown / never",
            "Опциональные поля ? и readonly",
          ],
        },
        {
          type: "callout",
          variant: "danger",
          body: "any отключает проверку типов — это дыра. На вакансии прямо написано «минимум any». Если тип неизвестен — используй unknown и сужай его проверками.",
        },
      ],
      middle: [
        {
          type: "text",
          title: "Дженерики (generics)",
          body: "Дженерики — это «типы-параметры». Они позволяют писать переиспользуемый код, который сохраняет типы, а не сваливается в any.",
        },
        {
          type: "code",
          lang: "ts",
          code: `function first<T>(arr: T[]): T | undefined {
  return arr[0]
}
first([1, 2, 3])      // T = number
first(["a", "b"])     // T = string

// дженерик-обёртка ответа API
type ApiResponse<T> = { data: T; error: string | null }`,
        },
        {
          type: "text",
          title: "Utility types",
          body: "Встроенные хелперы для трансформации типов — их часто спрашивают.",
        },
        {
          type: "code",
          lang: "ts",
          code: `type User = { id: number; name: string; email: string }

Partial<User>              // все поля необязательны
Required<User>             // все обязательны
Pick<User, "id" | "name">  // только выбранные
Omit<User, "email">        // все кроме email
Record<string, number>     // словарь ключ->значение`,
        },
        {
          type: "callout",
          variant: "tip",
          body: "Type narrowing: typeof, instanceof, in и проверки на null сужают union. Компилятор понимает контекст и убирает undefined/null внутри if.",
        },
      ],
      advanced: [
        {
          type: "text",
          title: "Продвинутые типы",
          body: "Conditional, mapped и infer-типы позволяют описывать сложную логику на уровне типов. На собеседовании достаточно понимать идею и уметь читать.",
        },
        {
          type: "code",
          lang: "ts",
          code: `// conditional
type IsString<T> = T extends string ? true : false

// mapped + modifiers
type ReadonlyDeep<T> = { readonly [K in keyof T]: T[K] }

// infer — вытащить тип из другого типа
type ElementType<T> = T extends (infer U)[] ? U : never
type Num = ElementType<number[]> // number`,
        },
        {
          type: "list",
          title: "Что показать как сильный кандидат",
          items: [
            "Строгий tsconfig: strict, noUncheckedIndexedAccess, exactOptionalPropertyTypes",
            "Валидация рантайма через Zod и вывод типа: z.infer<typeof schema>",
            "Discriminated unions для состояний (loading/success/error)",
            "as const и satisfies вместо приведения типов через as",
          ],
        },
        {
          type: "code",
          lang: "ts",
          code: `// discriminated union — идеально для стейта запроса
type State =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "success"; data: User[] }

// satisfies проверяет соответствие, но сохраняет узкий тип
const config = { port: 3000, host: "localhost" } satisfies Record<string, unknown>`,
        },
      ],
    },
  },
  {
    id: "react",
    title: "React",
    icon: "Atom",
    tagline: "React 19: компоненты, хуки, состояние, производительность",
    levels: {
      junior: [
        {
          type: "text",
          title: "Суть React",
          body: "React — библиотека для UI. Главная формула: UI = f(state). Ты описываешь, как выглядит интерфейс при данном состоянии, а React через Virtual DOM обновляет только изменившиеся узлы.",
        },
        {
          type: "code",
          lang: "tsx",
          code: `function Counter() {
  const [count, setCount] = useState(0)
  return (
    <button onClick={() => setCount(count + 1)}>
      Кликов: {count}
    </button>
  )
}`,
        },
        {
          type: "list",
          title: "База Junior",
          items: [
            "Функциональные компоненты (с большой буквы), JSX и className",
            "Props (сверху вниз, только чтение) vs State (внутри, меняется через сеттер)",
            "Списки через .map с уникальным key (не index, если список меняется)",
            "Условный рендер: {cond && <X/>} и тернарник",
          ],
        },
        {
          type: "callout",
          variant: "danger",
          body: "Никогда не мутируй state напрямую. Не push в массив стейта — создавай новый: setItems([...items, next]). Иначе React не увидит изменение.",
        },
      ],
      middle: [
        {
          type: "text",
          title: "Хуки, которые спросят",
          body: "useState, useEffect, useContext, useRef, useMemo/useCallback. Важно понимать массив зависимостей и когда эффект перезапускается.",
        },
        {
          type: "code",
          lang: "tsx",
          code: `useEffect(() => {
  const id = setInterval(tick, 1000)
  return () => clearInterval(id) // cleanup — обязательно
}, []) // [] = один раз при монтировании

// мемоизация тяжёлого вычисления
const total = useMemo(() => items.reduce((a, b) => a + b.price, 0), [items])`,
        },
        {
          type: "list",
          title: "Уровень Middle",
          items: [
            "Кастомные хуки — выносим переиспользуемую логику (useDebounce, useAuth)",
            "Подъём состояния (lifting state up) и композиция вместо пропс-дриллинга",
            "Контролируемые формы и обработка событий",
            "TanStack Query для серверного состояния вместо ручного useEffect+fetch",
          ],
        },
        {
          type: "callout",
          variant: "tip",
          body: "Правило вакансии: серверные данные — это НЕ useState. Кэш, повторные запросы, инвалидация — задача TanStack Query. Локальный UI-стейт — Zustand или useState.",
        },
      ],
      advanced: [
        {
          type: "text",
          title: "Производительность и рендер",
          body: "Понимай, что вызывает лишние ререндеры и как их убирать. React 19 добавил Compiler (авто-мемоизация), но принципы знать нужно.",
        },
        {
          type: "list",
          title: "Оптимизация",
          items: [
            "React.memo, useMemo, useCallback — против лишних ререндеров дочерних",
            "Виртуализация длинных списков (TanStack Virtual)",
            "Стабильные ссылки на функции/объекты в зависимостях",
            "Профилирование через React DevTools Profiler",
          ],
        },
        {
          type: "text",
          title: "React 19: новое",
          body: "Server Components, экшены и хуки под них: useActionState, useOptimistic, use(). Компонент может быть async и рендериться на сервере без отправки JS в браузер.",
        },
        {
          type: "code",
          lang: "tsx",
          code: `// оптимистичный апдейт UI до ответа сервера
const [optimistic, addOptimistic] = useOptimistic(
  messages,
  (state, newMsg: string) => [...state, { text: newMsg, pending: true }]
)`,
        },
      ],
    },
  },
  {
    id: "nextjs",
    title: "Next.js",
    icon: "Triangle",
    tagline: "Next.js 15: App Router, Server Components, кэш",
    levels: {
      junior: [
        {
          type: "text",
          title: "Что даёт Next.js",
          body: "Фреймворк над React: файловая маршрутизация, рендер на сервере (SSR), статика (SSG), API-роуты, оптимизация изображений и шрифтов. Основной режим сейчас — App Router (папка app/).",
        },
        {
          type: "code",
          lang: "tsx",
          code: `// app/page.tsx        -> маршрут /
// app/blog/page.tsx   -> /blog
// app/blog/[id]/page.tsx -> /blog/:id

export default function Page() {
  return <h1>Главная</h1>
}`,
        },
        {
          type: "list",
          title: "База App Router",
          items: [
            "page.tsx — страница, layout.tsx — общая обёртка",
            "loading.tsx / error.tsx / not-found.tsx — служебные состояния",
            "По умолчанию всё это Server Components",
            "\"use client\" — директива для интерактивных клиентских компонентов",
          ],
        },
      ],
      middle: [
        {
          type: "text",
          title: "Server vs Client Components",
          body: "Server Components выполняются на сервере, не тащат JS в бандл, могут ходить в БД напрямую. Client Components нужны для интерактива (стейт, эффекты, обработчики событий).",
        },
        {
          type: "code",
          lang: "tsx",
          code: `// Server Component — можно await прямо в теле
export default async function Users() {
  const users = await db.user.findMany()
  return <UserList users={users} />
}

// Route Handler: app/api/users/route.ts
export async function GET() {
  return Response.json(await db.user.findMany())
}`,
        },
        {
          type: "list",
          title: "Middle",
          items: [
            "Server Actions — мутации формой без ручного API (\"use server\")",
            "Динамический vs статический рендер, generateStaticParams",
            "Работа с cookies()/headers() — в Next 15 они async, нужен await",
            "next/image, next/font, метаданные для SEO",
          ],
        },
        {
          type: "callout",
          variant: "warn",
          body: "В Next 15 params, searchParams, cookies() и headers() асинхронные — их надо await. Это частый вопрос на миграцию.",
        },
      ],
      advanced: [
        {
          type: "text",
          title: "Кэширование",
          body: "Самая сложная тема Next. Есть несколько слоёв: Request Memoization, Data Cache, Full Route Cache, Router Cache. Нужно понимать, как ревалидировать данные.",
        },
        {
          type: "code",
          lang: "tsx",
          code: `// ISR по времени
fetch(url, { next: { revalidate: 60 } })

// ревалидация по тегу после мутации
import { revalidateTag } from "next/cache"
revalidateTag("products")

// отключить кэш
fetch(url, { cache: "no-store" })`,
        },
        {
          type: "list",
          title: "Продвинуто",
          items: [
            "Streaming и Suspense — постепенная отдача UI",
            "Parallel и Intercepting Routes (модалки поверх страницы)",
            "Route Handlers vs Server Actions — когда что",
            "Turbopack как дефолтный сборщик, edge vs node runtime",
          ],
        },
      ],
    },
  },
  {
    id: "nestjs",
    title: "NestJS",
    icon: "Server",
    tagline: "DI-фреймворк на Node: модули, провайдеры, пайплайны",
    levels: {
      junior: [
        {
          type: "text",
          title: "Что такое NestJS",
          body: "Бэкенд-фреймворк на TypeScript поверх Express/Fastify. Строится на Dependency Injection (внедрение зависимостей) и декораторах. Код делится на модули, контроллеры и сервисы.",
        },
        {
          type: "code",
          lang: "ts",
          code: `@Controller("users")
export class UsersController {
  constructor(private readonly users: UsersService) {} // DI

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.users.findOne(id)
  }
}`,
        },
        {
          type: "list",
          title: "Три кита Nest",
          items: [
            "Controller — принимает HTTP-запрос, отдаёт ответ",
            "Service (Provider) — бизнес-логика, инжектится в контроллер",
            "Module — группирует контроллеры и провайдеры",
          ],
        },
      ],
      middle: [
        {
          type: "text",
          title: "Валидация и DTO",
          body: "DTO (Data Transfer Object) описывает форму входных данных. class-validator + class-transformer + ValidationPipe автоматически валидируют тело запроса.",
        },
        {
          type: "code",
          lang: "ts",
          code: `export class CreateUserDto {
  @IsEmail() email: string
  @IsString() @MinLength(8) password: string
}

// глобально: app.useGlobalPipes(new ValidationPipe({ whitelist: true }))`,
        },
        {
          type: "list",
          title: "Middle-инструменты",
          items: [
            "Pipes (валидация/трансформация), Guards (авторизация), Interceptors (логика вокруг ответа)",
            "Middleware и Exception Filters для ошибок",
            "Swagger/OpenAPI из декораторов — автодокументация API",
            "ConfigModule, разделение по фичам-модулям",
          ],
        },
        {
          type: "callout",
          variant: "key",
          body: "Порядок обработки запроса: Middleware → Guards → Interceptors → Pipes → Handler → Interceptors → Filters. Это любят спрашивать.",
        },
      ],
      advanced: [
        {
          type: "list",
          title: "Уровень вакансии",
          items: [
            "Кастомные провайдеры, scopes (DEFAULT/REQUEST/TRANSIENT)",
            "Асинхронные пайплайны на очередях (BullMQ) + процессоры-воркеры",
            "Auth: Passport-стратегии, JWT, JWKS, guard + CASL для прав доступа",
            "Микросервисы/транспорты, health-checks, graceful shutdown",
          ],
        },
        {
          type: "code",
          lang: "ts",
          code: `// CASL: проверяем право на действие над сущностью
@UseGuards(JwtAuthGuard)
@Post()
create(@Req() req, @Body() dto: CreatePostDto) {
  const ability = this.caslFactory.createForUser(req.user)
  if (ability.cannot("create", "Post")) throw new ForbiddenException()
  return this.posts.create(dto)
}`,
        },
        {
          type: "callout",
          variant: "tip",
          body: "Мультитенантность (из вакансии): изоляция данных по tenant_id обычно живёт в guard/interceptor или в request-scoped провайдере, который подмешивает tenant в каждый запрос к БД.",
        },
      ],
    },
  },
  {
    id: "postgres",
    title: "PostgreSQL + Prisma",
    icon: "Database",
    tagline: "SQL, индексы, транзакции и ORM Prisma",
    levels: {
      junior: [
        {
          type: "text",
          title: "Основы SQL",
          body: "PostgreSQL — реляционная БД. Данные в таблицах со схемой и связями. Нужно уверенно писать базовые запросы и понимать связи один-ко-многим / многие-ко-многим.",
        },
        {
          type: "code",
          lang: "sql",
          code: `SELECT u.name, count(o.id) AS orders
FROM users u
LEFT JOIN orders o ON o.user_id = u.id
WHERE u.active = true
GROUP BY u.name
ORDER BY orders DESC
LIMIT 10;`,
        },
        {
          type: "text",
          title: "Prisma — быстрый старт",
          body: "Prisma — типобезопасная ORM. Схема описывается в schema.prisma, из неё генерируется клиент с автодополнением и типами.",
        },
        {
          type: "code",
          lang: "prisma",
          code: `model User {
  id    Int    @id @default(autoincrement())
  email String @unique
  posts Post[]
}
model Post {
  id       Int  @id @default(autoincrement())
  author   User @relation(fields: [authorId], references: [id])
  authorId Int
}`,
        },
      ],
      middle: [
        {
          type: "text",
          title: "Индексы",
          body: "Индекс ускоряет поиск за счёт места и замедления записи. Ставится на колонки в WHERE/JOIN/ORDER BY. Без индекса БД делает полный перебор (seq scan).",
        },
        {
          type: "list",
          title: "Что знать про индексы",
          items: [
            "B-tree — дефолт, для =, <, > и сортировки",
            "Уникальные и составные индексы (порядок колонок важен)",
            "EXPLAIN ANALYZE — смотреть реальный план запроса",
            "Индекс не бесплатен: замедляет INSERT/UPDATE",
          ],
        },
        {
          type: "text",
          title: "Транзакции",
          body: "Транзакция — группа операций «всё или ничего» (ACID). Если что-то упало — откат (rollback).",
        },
        {
          type: "code",
          lang: "ts",
          code: `await prisma.$transaction(async (tx) => {
  await tx.account.update({ where: { id: from }, data: { balance: { decrement: 100 } } })
  await tx.account.update({ where: { id: to },   data: { balance: { increment: 100 } } })
})`,
        },
      ],
      advanced: [
        {
          type: "list",
          title: "Продвинутый уровень",
          items: [
            "Уровни изоляции транзакций и что такое deadlock / race condition",
            "N+1 проблема и её решение (include/JOIN, dataloader)",
            "Миграции Prisma: migrate dev/deploy, дисциплина в команде",
            "Пулы соединений (PgBouncer), connection limits в serverless",
          ],
        },
        {
          type: "code",
          lang: "ts",
          code: `// N+1: плохо — запрос в цикле
for (const u of users) u.posts = await getPosts(u.id)

// хорошо — один запрос с include
const users = await prisma.user.findMany({ include: { posts: true } })`,
        },
        {
          type: "callout",
          variant: "warn",
          body: "Миграционная дисциплина из вакансии: миграции коммитятся в репозиторий, накатываются автоматически в CI/CD через prisma migrate deploy. Не менять прод-БД руками.",
        },
      ],
    },
  },
  {
    id: "queues",
    title: "Redis + очереди",
    icon: "ListChecks",
    tagline: "BullMQ, воркеры и фоновые задачи",
    levels: {
      junior: [
        {
          type: "text",
          title: "Зачем очереди",
          body: "Тяжёлые/долгие задачи (отправка email, генерация картинок, обработка файлов) нельзя делать прямо в HTTP-запросе — пользователь ждёт. Их кладут в очередь и обрабатывают фоново.",
        },
        {
          type: "text",
          title: "Redis",
          body: "Быстрое in-memory хранилище ключ-значение. Используется под кэш, сессии, rate limiting и как транспорт для очередей (BullMQ работает поверх Redis).",
        },
        {
          type: "callout",
          variant: "key",
          body: "Producer кладёт job в очередь → Redis хранит → Worker забирает и выполняет. Веб-сервер отвечает пользователю сразу, не дожидаясь выполнения.",
        },
      ],
      middle: [
        {
          type: "text",
          title: "BullMQ на практике",
          body: "Библиотека очередей для Node. Есть Queue (добавить задачу) и Worker (обработать). Поддерживает ретраи, задержки, приоритеты и повторяющиеся задачи.",
        },
        {
          type: "code",
          lang: "ts",
          code: `// producer
const queue = new Queue("emails", { connection })
await queue.add("welcome", { userId }, {
  attempts: 3,
  backoff: { type: "exponential", delay: 1000 },
})

// worker
new Worker("emails", async (job) => {
  await sendEmail(job.data.userId)
}, { connection })`,
        },
        {
          type: "list",
          title: "Middle",
          items: [
            "Ретраи с backoff и идемпотентность обработчиков",
            "Concurrency воркера и rate limiting",
            "Обработка failed jobs и dead-letter логика",
            "В Nest: @nestjs/bullmq, @Processor и @Process",
          ],
        },
      ],
      advanced: [
        {
          type: "list",
          title: "Fan-out и надёжность (из вакансии)",
          items: [
            "Fan-out: одна задача порождает много под-задач (flow / children jobs)",
            "Идемпотентность: повтор задачи не должен ломать данные",
            "Мониторинг очередей (Bull Board), метрики задержки",
            "Graceful shutdown воркеров, чтобы не терять задачи при деплое",
          ],
        },
        {
          type: "callout",
          variant: "tip",
          body: "Redis ещё полезен как кэш (снять нагрузку с Postgres), распределённый лок и rate limiter. На собеседовании плюс — назвать эти сценарии.",
        },
      ],
    },
  },
  {
    id: "docker",
    title: "Docker",
    icon: "Container",
    tagline: "Контейнеры, образы и compose",
    levels: {
      junior: [
        {
          type: "text",
          title: "Контейнеры vs образы",
          body: "Образ (image) — неизменяемый шаблон с приложением и зависимостями. Контейнер — запущенный экземпляр образа. Docker решает проблему «у меня работает» — окружение одинаковое везде.",
        },
        {
          type: "code",
          lang: "dockerfile",
          code: `FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
CMD ["npm", "start"]`,
        },
        {
          type: "list",
          title: "База команд",
          items: [
            "docker build -t app . — собрать образ",
            "docker run -p 3000:3000 app — запустить",
            "docker ps / logs / exec — смотреть и заходить внутрь",
            "Слои кэшируются — порядок инструкций важен",
          ],
        },
      ],
      middle: [
        {
          type: "text",
          title: "docker-compose",
          body: "Compose поднимает несколько сервисов вместе (приложение + Postgres + Redis) одной командой и связывает их сетью.",
        },
        {
          type: "code",
          lang: "yaml",
          code: `services:
  app:
    build: .
    ports: ["3000:3000"]
    depends_on: [db, redis]
  db:
    image: postgres:16
    environment:
      POSTGRES_PASSWORD: secret
    volumes: ["pgdata:/var/lib/postgresql/data"]
  redis:
    image: redis:7
volumes: { pgdata: {} }`,
        },
        {
          type: "list",
          title: "Middle",
          items: [
            "Volumes (данные переживают перезапуск) vs bind mounts",
            "ENV-переменные и .env, секреты не в образ",
            "Сети между сервисами, обращение по имени сервиса (db, redis)",
            ".dockerignore — не тащить node_modules в контекст",
          ],
        },
      ],
      advanced: [
        {
          type: "text",
          title: "Multi-stage build",
          body: "Разделяем сборку и рантайм: финальный образ содержит только собранное приложение — меньше размер и площадь атаки.",
        },
        {
          type: "code",
          lang: "dockerfile",
          code: `FROM node:20-alpine AS build
WORKDIR /app
COPY . .
RUN npm ci && npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
CMD ["node", "dist/main.js"]`,
        },
        {
          type: "list",
          title: "Продвинуто",
          items: [
            "Healthcheck, non-root user, минимальные базовые образы",
            "Кэш слоёв в CI, layer-оптимизация",
            "Мультисервисная среда — то, что прямо в вакансии",
          ],
        },
      ],
    },
  },
  {
    id: "git",
    title: "Git + CI/CD",
    icon: "GitBranch",
    tagline: "Ветки, pull request'ы, автоматизация",
    levels: {
      junior: [
        {
          type: "list",
          title: "База Git",
          items: [
            "add → commit → push, статус и история (status, log)",
            "Ветки: branch, checkout -b, merge",
            "Понимать remote (origin), pull vs fetch",
            "Осмысленные коммиты, .gitignore",
          ],
        },
        {
          type: "code",
          lang: "bash",
          code: `git checkout -b feature/login
git add .
git commit -m "feat: add login form"
git push -u origin feature/login
# затем открыть Pull Request`,
        },
      ],
      middle: [
        {
          type: "text",
          title: "Флоу разработки",
          body: "Вакансия прямо просит: ветки + pull request'ы, работа по Kanban, задача проходит все этапы. Feature-ветка → PR → ревью → мерж в основную ветку.",
        },
        {
          type: "list",
          title: "Middle",
          items: [
            "Rebase vs merge, разрешение конфликтов",
            "Интерактивный rebase, squash коммитов перед мержем",
            "Conventional Commits (feat/fix/chore)",
            "git stash, cherry-pick, revert",
          ],
        },
      ],
      advanced: [
        {
          type: "text",
          title: "CI/CD",
          body: "Continuous Integration — автоматически прогонять линт, типы и тесты на каждый PR. Continuous Delivery/Deployment — автоматический билд и деплой после мержа.",
        },
        {
          type: "code",
          lang: "yaml",
          code: `# .github/workflows/ci.yml
on: [pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: pnpm install
      - run: pnpm lint && pnpm typecheck
      - run: pnpm test`,
        },
        {
          type: "callout",
          variant: "tip",
          body: "«Проверять результат перед мержем» из вакансии = зелёный CI + прошли ревью. Пайплайн часто включает миграции БД (prisma migrate deploy) и сборку Docker-образа.",
        },
      ],
    },
  },
  {
    id: "testing",
    title: "Тестирование",
    icon: "FlaskConical",
    tagline: "Unit и e2e, проверка кода перед мержем",
    levels: {
      junior: [
        {
          type: "text",
          title: "Зачем и какие тесты",
          body: "Тесты защищают от регрессий. Пирамида: много быстрых unit-тестов, меньше интеграционных, ещё меньше медленных e2e. Инструменты: Jest/Vitest, для e2e — Playwright.",
        },
        {
          type: "code",
          lang: "ts",
          code: `import { sum } from "./sum"

test("складывает числа", () => {
  expect(sum(2, 3)).toBe(5)
})`,
        },
      ],
      middle: [
        {
          type: "list",
          title: "Middle",
          items: [
            "Структура AAA: Arrange → Act → Assert",
            "Моки и стабы для внешних зависимостей (БД, HTTP)",
            "Тестирование React-компонентов (Testing Library) — по поведению, не по реализации",
            "Coverage как ориентир, а не самоцель",
          ],
        },
        {
          type: "code",
          lang: "tsx",
          code: `render(<Counter />)
await userEvent.click(screen.getByRole("button"))
expect(screen.getByText("Кликов: 1")).toBeInTheDocument()`,
        },
      ],
      advanced: [
        {
          type: "list",
          title: "e2e и Nest",
          items: [
            "e2e в NestJS через supertest + тестовый модуль",
            "Тестовая БД в Docker, изоляция данных между тестами",
            "Playwright для сквозных сценариев фронта",
            "Тесты в CI — обязательный гейт перед мержем (из вакансии)",
          ],
        },
        {
          type: "code",
          lang: "ts",
          code: `const res = await request(app.getHttpServer())
  .post("/users")
  .send({ email: "a@b.c", password: "12345678" })
  .expect(201)
expect(res.body.email).toBe("a@b.c")`,
        },
      ],
    },
  },
  {
    id: "ai",
    title: "AI / LLM",
    icon: "Sparkles",
    tagline: "Интеграция LLM в продукт, промптинг, RAG",
    levels: {
      junior: [
        {
          type: "text",
          title: "Что такое LLM в продукте",
          body: "LLM — большая языковая модель (GPT, Claude, Gemini). В продукт встраивается через API: отправляем промпт — получаем текст/JSON. Также есть генерация изображений. Вакансия ждёт понимание границ этих инструментов.",
        },
        {
          type: "list",
          title: "База",
          items: [
            "System prompt vs user prompt — роль и задача",
            "Токены, контекстное окно, температура (креативность)",
            "Стриминг ответа для UX",
            "AI-инструменты в работе: Cursor, Copilot, Claude Code",
          ],
        },
      ],
      middle: [
        {
          type: "text",
          title: "Структурированный вывод",
          body: "Чтобы LLM отдавала не текст, а валидный объект — используем structured output со схемой (Zod). Это делает AI-фичи предсказуемыми и типобезопасными.",
        },
        {
          type: "code",
          lang: "ts",
          code: `// Vercel AI SDK
const { object } = await generateObject({
  model: "openai/gpt-4o",
  schema: z.object({ title: z.string(), tags: z.array(z.string()) }),
  prompt: "Сгенерируй заголовок и теги для статьи о Postgres",
})`,
        },
        {
          type: "list",
          title: "Middle",
          items: [
            "Промпт-инжиниринг: примеры (few-shot), чёткие инструкции",
            "Выбор модели под задачу (цена/скорость/качество)",
            "Оценка и контроль качества вывода (валидация, ретраи)",
            "Генерация текста и изображений через единый API-слой",
          ],
        },
      ],
      advanced: [
        {
          type: "text",
          title: "RAG и агенты",
          body: "RAG (Retrieval-Augmented Generation) — подмешиваем в промпт релевантные куски из своей базы знаний, чтобы модель отвечала по актуальным данным, а не выдумывала.",
        },
        {
          type: "list",
          title: "Продвинуто (большой плюс по вакансии)",
          items: [
            "Эмбеддинги + векторный поиск (pgvector в Postgres)",
            "Чанкинг документов и релевантность выдачи",
            "Агенты и tool calling — модель вызывает твои функции",
            "Фоновая AI-генерация через очереди (BullMQ) — тяжёлые задачи вне запроса",
          ],
        },
        {
          type: "callout",
          variant: "key",
          body: "Связка тем: AI-генерация картинок/контента — долгая → уходит в очередь (BullMQ) → результат в S3/MinIO → пользователю через websocket/поллинг. Умение связать это = сильный сигнал.",
        },
      ],
    },
  },
]
