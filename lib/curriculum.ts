export type Level = "junior" | "middle" | "advanced"

export type Block =
  | { type: "text"; title?: string; body: string }
  | { type: "code"; lang?: string; code: string }
  | { type: "list"; title?: string; items: string[] }
  | { type: "callout"; variant: "tip" | "warn" | "key" | "danger"; body: string }
  | { type: "mistakes"; title?: string; items: { bad: string; good: string }[] }
  | { type: "flow"; title?: string; steps: { title: string; body: string }[] }
  | { type: "table"; title?: string; headers: string[]; rows: string[][] }

export type QuizQuestion = {
  q: string
  options: string[]
  answer: number
  explain: string
}

export type Topic = {
  id: string
  title: string
  icon: string
  tagline: string
  levels: Record<Level, Block[]>
  quiz: QuizQuestion[]
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
          body: "TypeScript — это надстройка над JavaScript, которая добавляет статические типы. Главная ценность: ошибки ловятся на этапе компиляции в редакторе, а не в проде у пользователя. TS не выполняется в браузере или Node напрямую — компилятор (tsc или сборщик вроде esbuild/swc) стирает типы и выдаёт обычный JavaScript. Типы — это чисто «инструмент разработчика»: в рантайме их не существует.",
        },
        {
          type: "text",
          title: "Аннотации типов и вывод типов",
          body: "Тип можно указать явно (аннотация), но чаще его выводит сам компилятор (type inference). Хороший стиль — не писать типы там, где TS и так их понимает, и аннотировать границы: параметры функций, возвращаемые значения публичных функций, форму данных из API.",
        },
        {
          type: "code",
          lang: "ts",
          code: `// базовые примитивы
let age: number = 25
let username: string = "Аня"
let active: boolean = true

// вывод типа: аннотация не нужна, TS сам поймёт что это number
let count = 0

// массивы и кортежи (tuple)
let ids: number[] = [1, 2, 3]
let pair: [string, number] = ["age", 25]

// объект через type
type User = { id: number; name: string; email?: string } // ? — необязательное поле

function greet(u: User): string {
  return \`Привет, \${u.name}\`
}`,
        },
        {
          type: "text",
          title: "type vs interface",
          body: "Для описания формы объекта они почти взаимозаменяемы. interface умеет расширяться (extends) и «сливаться» при повторном объявлении (declaration merging). type мощнее: через него делают union, пересечения, кортежи, mapped-типы. Практическое правило: объекты и публичные контракты — interface, всё остальное (union, утилиты) — type. Главное — единообразие в проекте.",
        },
        {
          type: "code",
          lang: "ts",
          code: `interface Animal { name: string }
interface Dog extends Animal { breed: string } // расширение

// union и литеральные типы — это про type
type Size = "sm" | "md" | "lg"
type Id = string | number

// функциональный тип
type Handler = (event: string) => void`,
        },
        {
          type: "list",
          title: "Что точно нужно знать на входе",
          items: [
            "Примитивы: string, number, boolean, null, undefined, symbol, bigint",
            "union-типы (string | number) и литеральные типы ('sm' | 'md' | 'lg')",
            "Массивы, кортежи, enum и когда лучше union литералов вместо enum",
            "any / unknown / never — и чем они отличаются",
            "Опциональные поля ?, readonly, значения по умолчанию в функциях",
            "Type assertion (as) — и почему им злоупотреблять опасно",
          ],
        },
        {
          type: "callout",
          variant: "danger",
          body: "any полностью отключает проверку типов — это дыра, через которую в прод просачиваются баги. На вакансии прямо написано «минимум any». Если тип реально неизвестен — используй unknown и сужай его проверками (typeof/in), прежде чем работать со значением.",
        },
      ],
      middle: [
        {
          type: "text",
          title: "Дженерики (generics)",
          body: "Дженерики — это «типы-параметры». Они позволяют писать переиспользуемый код, который сохраняет типы вместо того, чтобы сваливаться в any. Дженерик как бы говорит: «я не знаю конкретный тип сейчас, но запомню его и верну обратно». Их можно ограничивать через extends.",
        },
        {
          type: "code",
          lang: "ts",
          code: `function first<T>(arr: T[]): T | undefined {
  return arr[0]
}
first([1, 2, 3])   // T = number, результат number | undefined
first(["a", "b"])  // T = string

// ограничение дженерика: T обязан иметь поле id
function byId<T extends { id: number }>(items: T[], id: number) {
  return items.find((i) => i.id === id)
}

// дженерик-обёртка ответа API
type ApiResponse<T> = { data: T; error: string | null }`,
        },
        {
          type: "text",
          title: "Utility types",
          body: "Встроенные хелперы, которые трансформируют существующие типы. Их постоянно спрашивают на собеседованиях, потому что они экономят ручное дублирование типов. Особенно важны Partial, Pick, Omit, Record и ReturnType.",
        },
        {
          type: "code",
          lang: "ts",
          code: `type User = { id: number; name: string; email: string }

Partial<User>              // { id?; name?; email? } — все поля необязательны
Required<User>             // все обязательны
Readonly<User>             // все только для чтения
Pick<User, "id" | "name">  // только выбранные поля
Omit<User, "email">        // все поля кроме email
Record<string, number>     // словарь: ключ string -> значение number

// извлечь тип из функции / промиса
type R = ReturnType<typeof greet>       // возвращаемый тип
type A = Awaited<Promise<number>>       // number`,
        },
        {
          type: "text",
          title: "Сужение типов (narrowing)",
          body: "Когда переменная имеет union-тип, компилятор умеет сужать его внутри условий. typeof, instanceof, оператор in, проверка на null и «guard-функции» дают TS понять, с каким именно вариантом мы работаем в конкретной ветке.",
        },
        {
          type: "code",
          lang: "ts",
          code: `function format(value: string | number) {
  if (typeof value === "string") {
    return value.trim()      // здесь value: string
  }
  return value.toFixed(2)    // здесь value: number
}

// пользовательский type guard
function isUser(x: unknown): x is User {
  return typeof x === "object" && x !== null && "email" in x
}`,
        },
        {
          type: "list",
          title: "Уровень Middle",
          items: [
            "keyof, typeof, indexed access types (T[\"field\"])",
            "Пользовательские type guards (value is Type)",
            "Enum vs union литералов (union чаще предпочтительнее)",
            "Настройка tsconfig: strict, esModuleInterop, paths (алиасы @/)",
            "Типизация async-функций и Promise<T>",
            "Отличие структурной типизации TS от номинальной (утиная типизация)",
          ],
        },
        {
          type: "callout",
          variant: "tip",
          body: "TypeScript использует структурную типизацию: два типа совместимы, если совпадает их «форма», а не имя. Поэтому объект с нужными полями подойдёт туда, где ждут именованный тип, даже без явного наследования.",
        },
      ],
      advanced: [
        {
          type: "text",
          title: "Продвинутые типы",
          body: "Conditional, mapped и infer-типы позволяют описывать логику на уровне типов — по сути мини-программирование в системе типов. На собеседовании не обязательно писать их с нуля, но нужно понимать идею и уметь читать чужой сложный тип.",
        },
        {
          type: "code",
          lang: "ts",
          code: `// conditional type — тип-ветвление
type IsString<T> = T extends string ? true : false

// mapped type + модификаторы (глубокий readonly)
type ReadonlyDeep<T> = { readonly [K in keyof T]: T[K] }

// infer — «вытащить» тип из другого типа
type ElementType<T> = T extends (infer U)[] ? U : never
type Num = ElementType<number[]>   // number

// template literal types
type Route = \`/api/\${string}\`
const r: Route = "/api/users"`,
        },
        {
          type: "text",
          title: "Валидация рантайма (Zod)",
          body: "Типы TS исчезают в рантайме, поэтому данные из внешнего мира (тело запроса, ответ стороннего API, env-переменные) нельзя доверять только типам. Zod валидирует данные в рантайме И выводит из схемы статический тип — один источник правды.",
        },
        {
          type: "code",
          lang: "ts",
          code: `import { z } from "zod"

const UserSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  role: z.enum(["admin", "user"]),
})

type User = z.infer<typeof UserSchema>   // тип выведен из схемы

// парсим непроверенные данные из запроса
const user = UserSchema.parse(req.body)  // бросит ошибку, если форма не та`,
        },
        {
          type: "list",
          title: "Что показать как сильный кандидат",
          items: [
            "Строгий tsconfig: strict, noUncheckedIndexedAccess, exactOptionalPropertyTypes",
            "Discriminated unions для состояний (loading/success/error)",
            "as const и satisfies вместо приведения через as",
            "Понимание, что тип !== рантайм-проверка (отсюда Zod/валидация)",
            "Осознанная работа с дженерик-ограничениями и variance",
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

function render(s: State) {
  switch (s.status) {
    case "loading": return "..."
    case "error":   return s.message   // TS знает про message
    case "success": return s.data.length
  }
}

// satisfies: проверяет соответствие, но сохраняет узкий тип
const config = { port: 3000, host: "localhost" } satisfies Record<string, unknown>
config.port  // остаётся number, а не unknown`,
        },
        {
          type: "callout",
          variant: "key",
          body: "Ключевая связка для fullstack: типы можно шарить между бэком и фронтом. Схема Zod на сервере → z.infer даёт тип → тот же тип использует клиент. Так контракт API остаётся единым и не расходится.",
        },
        {
          type: "mistakes",
          title: "Частые ошибки",
          items: [
            {
              bad: "Затыкать ошибки типов через as any или // @ts-ignore, лишь бы компилятор молчал.",
              good: "Разобраться в типе: сузить через unknown + проверки, поправить сигнатуру или описать корректный тип.",
            },
            {
              bad: "Дублировать один и тот же интерфейс на бэке и фронте руками.",
              good: "Держать один источник истины (схема Zod / общий пакет) и выводить тип через z.infer.",
            },
            {
              bad: "Писать типы там, где TS всё выводит сам: const n: number = 5.",
              good: "Аннотировать только границы — параметры, возвращаемые значения публичных функций, форму данных из API.",
            },
            {
              bad: "Использовать enum по привычке из других языков.",
              good: "Чаще брать union литералов ('sm' | 'md' | 'lg') — легче, без рантайм-кода и лучше для tree-shaking.",
            },
          ],
        },
      ],
    },
    quiz: [
      {
        q: "Что происходит с типами TypeScript в рантайме?",
        options: [
          "Они проверяются движком JS при выполнении",
          "Они стираются при компиляции, в JS их нет",
          "Они превращаются в runtime-ассерты",
          "Они хранятся в отдельном .d.ts и грузятся браузером",
        ],
        answer: 1,
        explain: "Типы существуют только на этапе разработки/компиляции. tsc стирает их — в браузер уходит обычный JS. Поэтому для внешних данных нужна рантайм-валидация (например Zod).",
      },
      {
        q: "Чем unknown безопаснее any?",
        options: [
          "Ничем, это синонимы",
          "unknown нельзя использовать без предварительного сужения типа",
          "any медленнее компилируется",
          "unknown запрещает null",
        ],
        answer: 1,
        explain: "any отключает проверки полностью. unknown заставляет сузить тип (typeof/in/guard) прежде чем что-то с ним делать — компилятор остаётся на страже.",
      },
      {
        q: "Какой utility type сделает все поля объекта необязательными?",
        options: ["Required<T>", "Readonly<T>", "Partial<T>", "Pick<T>"],
        answer: 2,
        explain: "Partial<T> делает каждое поле опциональным. Required — наоборот, Readonly — только для чтения, Pick — выбирает подмножество полей.",
      },
      {
        q: "Для чего удобнее всего discriminated union?",
        options: [
          "Для описания состояний loading/error/success",
          "Для замены enum числами",
          "Для ускорения рантайма",
          "Для импорта модулей",
        ],
        answer: 0,
        explain: "Общее поле-дискриминатор (status) позволяет компилятору точно знать, какие ещё поля доступны в каждой ветке — идеально для состояний UI/запросов.",
      },
    ],
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
          body: "React — библиотека для построения UI из компонентов. Главная ментальная модель: UI = f(state). Ты описываешь, как выглядит интерфейс при данном состоянии, а не дёргаешь DOM руками. Когда состояние меняется, React перерисовывает компонент, сравнивает результат (reconciliation через Virtual DOM) и обновляет в реальном DOM только то, что действительно изменилось.",
        },
        {
          type: "text",
          title: "JSX",
          body: "JSX — это синтаксис, похожий на HTML, который компилируется в вызовы React.createElement. Отличия от HTML: className вместо class, camelCase для атрибутов (onClick, htmlFor), обязательное закрытие тегов, выражения в фигурных скобках {}. Компонент обязан возвращать один корневой узел (можно обернуть во Fragment <>...</>).",
        },
        {
          type: "code",
          lang: "tsx",
          code: `function Counter() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <p>Кликов: {count}</p>
      <button onClick={() => setCount(count + 1)}>+1</button>
      {count > 5 && <span>Много!</span>}   {/* условный рендер */}
    </div>
  )
}`,
        },
        {
          type: "text",
          title: "Props и State",
          body: "Props — входные параметры компонента, передаются сверху вниз и доступны только для чтения (компонент не меняет свои props). State — внутреннее состояние компонента, которое меняется через сеттер и вызывает ререндер. Правило: данные текут вниз (one-way data flow), а события — вверх через колбэки.",
        },
        {
          type: "code",
          lang: "tsx",
          code: `type Props = { label: string; onDelete: (id: number) => void; id: number }

function Item({ label, onDelete, id }: Props) {
  return (
    <li>
      {label}
      <button onClick={() => onDelete(id)}>Удалить</button>
    </li>
  )
}`,
        },
        {
          type: "list",
          title: "База Junior",
          items: [
            "Функциональные компоненты (имя с большой буквы) и JSX",
            "Props (только чтение, сверху вниз) vs State (внутри, через сеттер)",
            "Списки через .map с уникальным key (не index, если список меняется/сортируется)",
            "Условный рендер: {cond && <X/>} и тернарник cond ? a : b",
            "Обработка событий: onClick, onChange, onSubmit + preventDefault",
            "Controlled inputs: value + onChange связаны со state",
          ],
        },
        {
          type: "callout",
          variant: "danger",
          body: "Никогда не мутируй state напрямую. Не делай items.push(x) или state.field = y — React сравнивает ссылки и не увидит изменение. Всегда создавай новый объект/массив: setItems([...items, x]) или setUser({ ...user, name }).",
        },
      ],
      middle: [
        {
          type: "text",
          title: "Хуки: правила и основные",
          body: "Хуки — функции, начинающиеся с use, дающие компонентам состояние и побочные эффекты. Два правила: (1) вызывать только на верхнем уровне компонента, не в условиях/циклах; (2) вызывать только из компонентов или других хуков. React опознаёт хуки по порядку вызова — поэтому порядок должен быть стабильным.",
        },
        {
          type: "code",
          lang: "tsx",
          code: `// useEffect: побочные эффекты (подписки, таймеры, синхронизация)
useEffect(() => {
  const id = setInterval(tick, 1000)
  return () => clearInterval(id)  // cleanup — вызовется при размонтировании/смене deps
}, [])                            // [] = один раз при монтировании

// useRef: ссылка, которая не вызывает ререндер
const inputRef = useRef<HTMLInputElement>(null)

// useMemo: мемоизация тяжёлого вычисления
const total = useMemo(() => items.reduce((a, b) => a + b.price, 0), [items])

// useCallback: стабильная ссылка на функцию
const handleClick = useCallback(() => save(id), [id])`,
        },
        {
          type: "text",
          title: "Массив зависимостей",
          body: "Второй аргумент useEffect/useMemo/useCallback — deps. Эффект перезапускается, когда любое значение из deps изменилось (сравнение по ссылке, Object.is). Пропущенная зависимость — частый источник багов (устаревшее замыкание, stale closure). Пустой массив — только на монтирование; отсутствие массива — на каждый рендер.",
        },
        {
          type: "text",
          title: "Кастомные хуки",
          body: "Переиспользуемую логику со state/эффектами выносят в кастомный хук (useDebounce, useAuth, useLocalStorage). Это не про переиспользование состояния между компонентами, а про переиспользование логики — состояние у каждого вызова своё.",
        },
        {
          type: "code",
          lang: "tsx",
          code: `function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(id)
  }, [value, delay])
  return debounced
}`,
        },
        {
          type: "list",
          title: "Уровень Middle",
          items: [
            "Подъём состояния (lifting state up) и композиция вместо пропс-дриллинга",
            "useContext для сквозных данных (тема, юзер) — но не как замена стейт-менеджеру",
            "useReducer для сложной логики состояния с несколькими действиями",
            "TanStack Query для серверного состояния вместо ручного useEffect + fetch",
            "Zustand/Redux для клиентского глобального стейта",
            "Формы: react-hook-form + zod вместо ручного управления полями",
          ],
        },
        {
          type: "callout",
          variant: "tip",
          body: "Правило вакансии: серверные данные — это НЕ useState. Кэш, повторные запросы, статусы loading/error и инвалидация — задача TanStack Query. useState/Zustand оставь для локального UI-состояния (модалка открыта, вкладка активна).",
        },
      ],
      advanced: [
        {
          type: "text",
          title: "Ререндеры и производительность",
          body: "Компонент перерисовывается, когда меняется его state, меняются props или перерисовался родитель. Лишние ререндеры сами по себе не всегда проблема (React быстрый), но становятся ею на больших списках и тяжёлых деревьях. Инструменты борьбы: React.memo, useMemo, useCallback, разбиение компонентов и стабильные ссылки.",
        },
        {
          type: "code",
          lang: "tsx",
          code: `// React.memo — не ререндерить, если props не изменились (поверхностно)
const Row = React.memo(function Row({ item }: { item: Item }) {
  return <div>{item.name}</div>
})

// стабильная ссылка на колбэк, чтобы memo сработал
const onSelect = useCallback((id: number) => setSelected(id), [])`,
        },
        {
          type: "text",
          title: "React 19: новое",
          body: "Server Components рендерятся на сервере и не отправляют свой JS в браузер (меньше бандл). Actions упрощают мутации форм. Новые хуки: useActionState (состояние экшена/формы), useOptimistic (оптимистичный UI), use() (читать промис/контекст в рендере). React Compiler умеет авто-мемоизировать, снижая нужду в ручных useMemo/useCallback.",
        },
        {
          type: "code",
          lang: "tsx",
          code: `// оптимистичный апдейт: показываем результат до ответа сервера
const [optimistic, addOptimistic] = useOptimistic(
  messages,
  (state, newMsg: string) => [...state, { text: newMsg, pending: true }]
)

async function send(text: string) {
  addOptimistic(text)      // UI обновился сразу
  await saveMessage(text)  // затем реальный запрос
}`,
        },
        {
          type: "list",
          title: "Что показать как сильный кандидат",
          items: [
            "Виртуализация длинных списков (TanStack Virtual / react-window)",
            "Профилирование через React DevTools Profiler, поиск причины ререндеров",
            "Понимание reconciliation и роли key при переупорядочивании",
            "Suspense и границы загрузки, Error Boundary для ошибок рендера",
            "Разделение Server/Client Components и «поднятие» интерактива вниз по дереву",
            "Утечки в useEffect: подписки без cleanup, гонки при fetch (AbortController)",
          ],
        },
        {
          type: "callout",
          variant: "warn",
          body: "Частая ошибка: класть в deps объект/массив/функцию, которые создаются заново каждый рендер — тогда эффект/мемо срабатывает всегда. Стабилизируй ссылки (useMemo/useCallback) или клади в deps примитивы.",
        },
        {
          type: "mistakes",
          title: "Частые ошибки",
          items: [
            {
              bad: "Мутировать state напрямую: state.push(x); setState(state).",
              good: "Создавать новый объект/массив: setState(prev => [...prev, x]).",
            },
            {
              bad: "Использовать индекс массива как key в динамических списках.",
              good: "Брать стабильный уникальный id элемента — иначе React перепутает элементы при сортировке/удалении.",
            },
            {
              bad: "Класть в массив зависимостей useEffect не все используемые значения.",
              good: "Указывать все зависимости; лишние ререндеры чинить через useCallback/useMemo, а не удалением из deps.",
            },
            {
              bad: "Делать fetch данных прямо в useEffect без отмены и состояния загрузки/ошибки.",
              good: "Использовать SWR/React Query (кэш, статусы, дедупликация) или загружать данные в серверном компоненте.",
            },
          ],
        },
      ],
    },
    quiz: [
      {
        q: "Почему нельзя мутировать state напрямую (например state.push)?",
        options: [
          "Это медленнее",
          "React сравнивает ссылки и не заметит изменение — UI не обновится",
          "Так запрещено синтаксисом JS",
          "Мутация ломает TypeScript",
        ],
        answer: 1,
        explain: "React определяет изменение по новой ссылке (Object.is). Мутация того же объекта/массива оставляет ссылку прежней, поэтому ререндер может не произойти. Нужно создавать новую копию.",
      },
      {
        q: "Что делает функция, возвращаемая из useEffect?",
        options: [
          "Запускается перед первым рендером",
          "Это cleanup: выполняется при размонтировании или перед повторным запуском эффекта",
          "Возвращает новое состояние",
          "Кэширует результат",
        ],
        answer: 1,
        explain: "Возвращаемая функция — очистка (отписки, таймеры). React вызывает её при размонтировании и перед каждым повторным запуском эффекта из-за смены зависимостей.",
      },
      {
        q: "Где должны жить серверные данные согласно современному подходу?",
        options: [
          "В useState с ручным fetch в useEffect",
          "В глобальной переменной",
          "В библиотеке серверного состояния (TanStack Query)",
          "В localStorage",
        ],
        answer: 2,
        explain: "TanStack Query берёт на себя кэш, повторные запросы, статусы и инвалидацию. useState/Zustand — для локального UI-состояния, а не для данных с сервера.",
      },
      {
        q: "Что даёт useOptimistic в React 19?",
        options: [
          "Кэширует запросы",
          "Показывает предполагаемый результат до ответа сервера",
          "Заменяет useEffect",
          "Оптимизирует бандл",
        ],
        answer: 1,
        explain: "useOptimistic позволяет мгновенно отрисовать ожидаемое состояние (например добавленное сообщение) и откатить его, если серверный запрос не удался.",
      },
    ],
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
          body: "Next.js — фреймворк над React. Он берёт на себя то, что в чистом React пришлось бы собирать руками: маршрутизацию по файловой системе, рендер на сервере (SSR), статическую генерацию (SSG), API-эндпоинты, оптимизацию изображений и шрифтов, code splitting. Актуальный режим — App Router (папка app/), старый — Pages Router (папка pages/).",
        },
        {
          type: "text",
          title: "Файловая маршрутизация",
          body: "Маршрут определяется структурой папок внутри app/. Специальные имена файлов задают роль: page (страница), layout (общая обёртка), loading (скелетон при загрузке), error (обработчик ошибок), not-found. Квадратные скобки — динамический сегмент, круглые — группа маршрутов без влияния на URL.",
        },
        {
          type: "code",
          lang: "tsx",
          code: `// app/page.tsx              -> /
// app/blog/page.tsx         -> /blog
// app/blog/[id]/page.tsx    -> /blog/:id
// app/(marketing)/about/page.tsx -> /about  (группа скобок не в URL)

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return <h1>Пост</h1>
}`,
        },
        {
          type: "list",
          title: "База App Router",
          items: [
            "page.tsx — страница; layout.tsx — обёртка, сохраняется между переходами",
            "loading.tsx / error.tsx / not-found.tsx — служебные состояния",
            "По умолчанию компоненты — серверные (Server Components)",
            '"use client" сверху файла — делает компонент клиентским (стейт/эффекты/события)',
            "Навигация через <Link> и useRouter (без полной перезагрузки)",
            "app/api/.../route.ts — HTTP-эндпоинты (Route Handlers)",
          ],
        },
        {
          type: "callout",
          variant: "key",
          body: 'Ключевая развилка: серверный компонент по умолчанию (можно await данные, ходить в БД, не тащит JS в браузер). Как только нужен useState/useEffect/onClick — доба��ляешь "use client" и компонент становится клиентским.',
        },
      ],
      middle: [
        {
          type: "text",
          title: "Server vs Client Components",
          body: "Server Components выполняются на сервере: не увеличивают JS-бандл, могут читать секреты и ходить в БД напрямую, отдают готовый HTML. Client Components нужны для интерактива — стейт, эффекты, обработчики, доступ к window. Оптимальная архитектура: держать интерактивные части маленькими и «внизу» дерева, а данные грузить в серверных компонентах выше.",
        },
        {
          type: "code",
          lang: "tsx",
          code: `// Server Component — можно await прямо в теле
export default async function Users() {
  const users = await db.user.findMany()  // прямой доступ к БД
  return <UserList users={users} />
}

// Route Handler: app/api/users/route.ts
export async function GET(req: Request) {
  const users = await db.user.findMany()
  return Response.json(users)
}`,
        },
        {
          type: "text",
          title: "Server Actions",
          body: 'Server Actions — функции с директивой "use server", которые вызываются с клиента, но выполняются на сервере. Позволяют делать мутации (создать/обновить/удалить) прямо из формы без ручного написания API-роута, с прогрессивным улучшением и типобезопасностью.',
        },
        {
          type: "code",
          lang: "tsx",
          code: `// действие на сервере
async function createTodo(formData: FormData) {
  "use server"
  const title = formData.get("title") as string
  await db.todo.create({ data: { title } })
  revalidatePath("/todos")   // обновить кэш страницы
}

// форма вызывает его напрямую
export default function Form() {
  return (
    <form action={createTodo}>
      <input name="title" />
      <button type="submit">Добавить</button>
    </form>
  )
}`,
        },
        {
          type: "list",
          title: "Middle",
          items: [
            "Динамический vs статический рендер, generateStaticParams для [id]",
            "Метаданные и SEO: экспорт metadata / generateMetadata",
            "next/image (оптимизация, lazy) и next/font (без layout shift)",
            "Route groups, вложенные layout'ы, параллельные загрузки данных",
            "Обработка ошибок и загрузки через error.tsx / loading.tsx + Suspense",
            "Middleware (в Next 16 — proxy) для редиректов, авторизации, гео",
          ],
        },
        {
          type: "callout",
          variant: "warn",
          body: "В Next 15 params, searchParams, cookies() и headers() стали асинхронными — их нужно await. Это популярный вопрос про миграцию и частая причина ошибок при переходе со старых версий.",
        },
      ],
      advanced: [
        {
          type: "text",
          title: "Модель кэширования",
          body: "Самая сложная тема Next. Есть несколько слоёв кэша: Request Memoization (дедупликация одинаковых fetch в рамках одного рендера), Data Cache (переживает запросы/деплой), Full Route Cache (закэшированный HTML статических маршрутов) и Router Cache (клиентский кэш переходов). Нужно понимать, как ревалидировать данные и когда рендер становится динамическим.",
        },
        {
          type: "code",
          lang: "tsx",
          code: `// ISR: перегенерировать не чаще, чем раз в 60 секунд
fetch(url, { next: { revalidate: 60 } })

// пометить данные тегом и ревалидировать после мутации
fetch(url, { next: { tags: ["products"] } })
import { revalidateTag, revalidatePath } from "next/cache"
revalidateTag("products")     // сбросить всё с этим тегом
revalidatePath("/products")   // сбросить конкретный маршрут

// полностью без кэша (всегда свежие данные)
fetch(url, { cache: "no-store" })`,
        },
        {
          type: "text",
          title: "Streaming и Suspense",
          body: "Next умеет стримить HTML по частям: быстрый каркас отдаётся сразу, а медленные секции подгружаются потоково внутри <Suspense fallback={...}>. Это улучшает TTFB и воспринимаемую скорость — пользователь видит контент, пока тяжёлый запрос ещё идёт.",
        },
        {
          type: "list",
          title: "Продвинуто",
          items: [
            "Parallel и Intercepting Routes (модалки поверх страницы, @slot)",
            "Route Handlers vs Server Actions — когда что выбирать",
            "Edge vs Node.js runtime: ограничения и когда нужен edge",
            "Next 16: Turbopack по умолчанию, Cache Components и директива 'use cache'",
            "revalidateTag с профилями cacheLife, updateTag для read-your-writes",
            "Развёртывание: standalone output, переменные окружения, Docker-образ",
          ],
        },
        {
          type: "callout",
          variant: "tip",
          body: "На собеседовании важно уметь объяснить: почему страница стала динамической (использование cookies()/headers()/no-store) и как вернуть статику + ISR. Понимание кэша Next — то, что отличает уверенного middle.",
        },
        {
          type: "mistakes",
          title: "Частые ошибки",
          items: [
            {
              bad: "Ставить 'use client' в самый верх дерева, превращая всё в клиентские компоненты.",
              good: "Держать серверные компоненты по умолчанию, а 'use client' опускать как можно ниже — только там, где нужен стейт/эффекты.",
            },
            {
              bad: "Обращаться к секретам и БД прямо из клиентского компонента.",
              good: "Работать с секретами только на сервере (Server Component, Route Handler, Server Action); в браузер отдавать лишь публичные NEXT_PUBLIC_* переменные.",
            },
            {
              bad: "Забыть await у cookies(), headers(), params, searchParams в Next.js 15/16.",
              good: "Помнить, что теперь это async — await cookies(), await params и т.д.",
            },
            {
              bad: "Тянуть тяжёлые данные на клиент через useEffect после загрузки страницы.",
              good: "Загружать данные на сервере (fetch с кэшем) и передавать готовыми в разметку — быстрее и лучше для SEO.",
            },
          ],
        },
      ],
    },
    quiz: [
      {
        q: "Какой компонент в App Router по умолчанию?",
        options: ["Клиентский", "Серверный (Server Component)", "Статический HTML без React", "Зависит от расширения файла"],
        answer: 1,
        explain: 'В App Router компоненты серверные по умолчанию. Чтобы сделать клиентский (со стейтом/эффектами/событиями), добавляют директиву "use client" в начало файла.',
      },
      {
        q: "Что изменилось в Next.js 15 с params, cookies() и headers()?",
        options: [
          "Их удалили",
          "Они стали синхронными",
          "Они стали асинхронными — их нужно await",
          "Их вынесли в отдельный пакет",
        ],
        answer: 2,
        explain: "В Next 15 эти API асинхронные. Забытый await — типичная ошибка миграции со старых версий.",
      },
      {
        q: "Как отдавать всегда свежие данные без кэша в fetch?",
        options: [
          "{ next: { revalidate: 60 } }",
          "{ cache: 'no-store' }",
          "{ cache: 'force-cache' }",
          "ничего не указывать",
        ],
        answer: 1,
        explain: "cache: 'no-store' отключает Data Cache и делает запрос динамическим. revalidate задаёт ISR, force-cache — наоборот кэширует.",
      },
      {
        q: "Зачем нужны Server Actions?",
        options: [
          "Для стилизации компонентов",
          "Чтобы делать мутации на сервере прямо из формы без ручного API-роута",
          "Для клиентского роутинга",
          "Для оптимизации изображений",
        ],
        answer: 1,
        explain: 'Server Actions ("use server") выполняются на сервере, вызываются с клиента (в т.ч. через action формы) и удобны для мутаций с ревалидацией кэша.',
      },
    ],
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
          body: "NestJS — бэкенд-фреймворк на TypeScript поверх Express (или Fastify). Он навязывает архитектуру: приложение делится на модули, внутри — контроллеры (HTTP) и провайдеры/сервисы (логика). В основе лежит Dependency Injection (внедрение зависимостей): ты не создаёшь объекты вручную через new, а объявляешь зависимости в конструкторе, и Nest сам их подставляет.",
        },
        {
          type: "text",
          title: "Декораторы",
          body: "Nest активно использует декораторы — специальные аннотации со знаком @. @Controller, @Get, @Post задают маршруты; @Injectable помечает класс как провайдер; @Body, @Param, @Query достают данные из запроса. Декораторы — это метаданные, которые Nest читает при старте для построения приложения.",
        },
        {
          type: "code",
          lang: "ts",
          code: `@Controller("users")
export class UsersController {
  constructor(private readonly users: UsersService) {} // DI через конструктор

  @Get()
  findAll() {
    return this.users.findAll()
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.users.findOne(id)
  }

  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.users.create(dto)
  }
}`,
        },
        {
          type: "list",
          title: "Три кита Nest",
          items: [
            "Controller — принимает HTTP-запрос, маршрутизирует, отдаёт ответ",
            "Service (Provider) — бизнес-логика, инжектится в контроллер",
            "Module — группирует контроллеры и провайдеры, объявляет imports/exports",
            "@Injectable() + конструкторная инъекция = основа DI",
          ],
        },
        {
          type: "callout",
          variant: "tip",
          body: "Идея DI: контроллер не знает, как создаётся сервис, — он лишь просит его в конструкторе. Это упрощает тестирование (можно подсунуть мок) и слабую связанность. Nest хранит провайдеры в контейнере как синглтоны по умолчанию.",
        },
      ],
      middle: [
        {
          type: "text",
          title: "Валидация и DTO",
          body: "DTO (Data Transfer Object) — класс, описывающий форму входных данных. В связке с class-validator и class-transformer глобальный ValidationPipe автоматически проверяет тело запроса и отклоняет невалидное с 400. whitelist убирает лишние поля, transform приводит типы.",
        },
        {
          type: "code",
          lang: "ts",
          code: `export class CreateUserDto {
  @IsEmail()
  email: string

  @IsString()
  @MinLength(8)
  password: string

  @IsOptional()
  @IsInt()
  age?: number
}

// в main.ts:
app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }))`,
        },
        {
          type: "text",
          title: "Строительные блоки запроса",
          body: "Nest даёт несколько типов «перехватчиков» вокруг обработчика: Guards решают, пустить ли запрос (авторизация); Pipes валидируют/трансформируют входные данные; Interceptors оборачивают логику до и после (логирование, маппинг ответа, кэш); Exception Filters ловят и форматируют ошибки; Middleware — низкоуровневая обработка запроса до роутинга.",
        },
        {
          type: "code",
          lang: "ts",
          code: `// Guard: разрешить только аутентифицированным
@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(ctx: ExecutionContext): boolean {
    const req = ctx.switchToHttp().getRequest()
    return Boolean(req.headers.authorization)
  }
}

@UseGuards(AuthGuard)
@Get("me")
me(@Req() req) { return req.user }`,
        },
        {
          type: "list",
          title: "Middle-инструменты",
          items: [
            "Pipes, Guards, Interceptors, Exception Filters, Middleware — и их назначение",
            "Swagger/OpenAPI из декораторов — автодокументация API",
            "ConfigModule + валидация env, разделение по фича-модулям",
            "TypeORM/Prisma-модуль, репозитории и транзакции",
            "Кастомные декораторы (@CurrentUser) для чистоты контроллеров",
          ],
        },
        {
          type: "callout",
          variant: "key",
          body: "Порядок обработки запроса: Middleware → Guards → Interceptors (до) → Pipes → Handler → Interceptors (после) → Exception Filters. Этот порядок любят спрашивать на собеседованиях.",
        },
      ],
      advanced: [
        {
          type: "text",
          title: "Scopes и жизненный цикл",
          body: "По умолчанию провайдеры — синглтоны (DEFAULT scope), создаются один раз. REQUEST scope создаёт новый экземпляр на каждый запрос (нужно для мультитенантности/контекста, но медленнее и «заражает» зависимые провайдеры). TRANSIENT — новый экземпляр на каждого потребителя. Есть хуки жизненного цикла: onModuleInit, onApplicationShutdown.",
        },
        {
          type: "code",
          lang: "ts",
          code: `// CASL: проверяем право на действие над сущностью
@UseGuards(JwtAuthGuard)
@Post()
create(@Req() req, @Body() dto: CreatePostDto) {
  const ability = this.caslFactory.createForUser(req.user)
  if (ability.cannot("create", "Post")) {
    throw new ForbiddenException()
  }
  return this.posts.create(dto)
}`,
        },
        {
          type: "list",
          title: "Уровень вакансии",
          items: [
            "Кастомные провайдеры (useValue/useFactory/useClass) и async-провайдеры",
            "Асинхронные пайплайны на очередях (BullMQ) + процессоры-воркеры",
            "Auth: Passport-стратегии, JWT/refresh, JWKS, RBAC/CASL для прав",
            "Микросервисы и транспорты (TCP, Redis, RabbitMQ, Kafka)",
            "Health-checks (Terminus), graceful shutdown, обработка сигналов",
            "Тестирование: Test.createTestingModule, e2e через supertest",
          ],
        },
        {
          type: "callout",
          variant: "tip",
          body: "Мультитенантность (из вакансии): изоляция данных по tenant_id обычно живёт в guard/interceptor или в request-scoped провайдере, который подмешивает tenant в каждый запрос к БД. Умение объяснить это — сильный сигнал для fullstack-роли.",
        },
        {
          type: "mistakes",
          title: "Частые ошибки",
          items: [
            {
              bad: "Писать бизнес-логику прямо в контроллере.",
              good: "Контроллер только принимает запрос и вызывает сервис; вся логика — в сервисах (провайдерах).",
            },
            {
              bad: "Принимать req.body как есть, без валидации.",
              good: "Описывать DTO с class-validator и включать глобальный ValidationPipe с whitelist: true.",
            },
            {
              bad: "Создавать экземпляры сервисов вручную через new вместо DI.",
              good: "Регистрировать в providers и получать через конструктор — так работают тесты, скоупы и подмена зависимостей.",
            },
            {
              bad: "Возвращать наружу сущность БД целиком (с паролем/хешем).",
              good: "Отдавать явный ответный DTO или применять сериализацию (ClassSerializerInterceptor, @Exclude).",
            },
          ],
        },
      ],
    },
    quiz: [
      {
        q: "Что такое Dependency Injection в NestJS?",
        options: [
          "Способ импортировать npm-пакеты",
          "Механизм, где зависимости объявляются в конструкторе, а Nest сам их создаёт и подставляет",
          "Внедрение JS в HTML",
          "Тип базы данных",
        ],
        answer: 1,
        explain: "DI избавляет от ручного new: класс просит зависимости в конструкторе, а IoC-контейнер Nest предоставляет их. Это упрощает тесты и снижает связанность.",
      },
      {
        q: "За что отвечает Guard?",
        options: [
          "За валидацию тела запроса",
          "За форматирование ошибок",
          "За решение, пропустить ли запрос (авторизация/доступ)",
          "За логирование ответа",
        ],
        answer: 2,
        explain: "Guard реализует canActivate и решает, допустить ли выполнение обработчика — типично для аутентификации/авторизации. Валидацией занимаются Pipes.",
      },
      {
        q: "Каков порядок обработки запроса в Nest?",
        options: [
          "Pipes → Guards → Handler → Middleware",
          "Middleware → Guards → Interceptors → Pipes → Handler → Filters",
          "Handler → Guards → Pipes",
          "Filters → Handler → Guards",
        ],
        answer: 1,
        explain: "Сначала Middleware, затем Guards, Interceptors (до), Pipes, сам Handler, Interceptors (после), и Exception Filters ловят ошибки.",
      },
      {
        q: "Зачем нужен DTO с class-validator?",
        options: [
          "Для стилизации",
          "Чтобы автоматически валидировать и типизировать входные данные запроса",
          "Для кэширования",
          "Для маршрутизации",
        ],
        answer: 1,
        explain: "DTO описывает форму входа, а ValidationPipe + class-validator автоматически отклоняют невалидные данные (400) и могут отсекать лишние поля.",
      },
    ],
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
          title: "Реляционная модель",
          body: "PostgreSQL — реляционная СУБД. Данные хранятся в таблицах со строгой схемой (колонки, типы, ограничения). Таблицы связаны через внешние ключи (foreign key). Основные связи: один-ко-многим (у пользователя много заказов), многие-ко-многим (через промежуточную таблицу). Ограничения (PRIMARY KEY, UNIQUE, NOT NULL, CHECK) защищают целостность данных.",
        },
        {
          type: "text",
          title: "Базовый SQL",
          body: "Нужно уверенно читать и писать SELECT с фильтрацией (WHERE), сортировкой (ORDER BY), ограничением (LIMIT/OFFSET), группировкой (GROUP BY + агрегаты count/sum/avg) и соединениями таблиц (JOIN). Понимать разницу INNER JOIN (только совпадения) и LEFT JOIN (все слева + совпадения справа).",
        },
        {
          type: "code",
          lang: "sql",
          code: `SELECT u.name, count(o.id) AS orders
FROM users u
LEFT JOIN orders o ON o.user_id = u.id
WHERE u.active = true
GROUP BY u.name
HAVING count(o.id) > 0
ORDER BY orders DESC
LIMIT 10;`,
        },
        {
          type: "text",
          title: "Prisma — быстрый старт",
          body: "Prisma — типобезопасная ORM для Node/TS. Схема данных описывается в schema.prisma; из неё генерируется клиент с автодополнением и типами. Ты пишешь запросы на TS-подобном API, а Prisma превращает их в SQL. Миграции создаются командой prisma migrate.",
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
  id       Int    @id @default(autoincrement())
  title    String
  author   User   @relation(fields: [authorId], references: [id])
  authorId Int
}`,
        },
        {
          type: "code",
          lang: "ts",
          code: `// запросы Prisma
const users = await prisma.user.findMany({
  where: { email: { endsWith: "@mail.ru" } },
  orderBy: { id: "desc" },
  take: 10,
})

await prisma.post.create({ data: { title: "Hi", authorId: 1 } })`,
        },
      ],
      middle: [
        {
          type: "text",
          title: "Индексы",
          body: "Индекс — вспомогательная структура (обычно B-tree), ускоряющая поиск по колонке за счёт дополнительного места на диске и замедления записи. Без индекса БД делает Seq Scan (полный перебор таблицы). Индексы ставят на колонки, часто участвующие в WHERE, JOIN и ORDER BY. В составном индексе важен порядок колонок.",
        },
        {
          type: "list",
          title: "Что знать про индексы",
          items: [
            "B-tree — дефолт, для =, <, >, BETWEEN и сортировки",
            "Уникальные и составные индексы; левый префикс составного индекса",
            "EXPLAIN ANALYZE — увидеть реальный план и время выполнения",
            "Частичные индексы (WHERE) и индексы по выражению",
            "GIN-индексы для jsonb/полнотекстового поиска",
            "Индекс не бесплатен: замедляет INSERT/UPDATE и занимает место",
          ],
        },
        {
          type: "text",
          title: "Транзакции и ACID",
          body: "Транзакция — группа операций по принципу «всё или ничего». ACID: Atomicity (атомарность), Consistency (согласованность), Isolation (изоляция от других транзакций), Durability (сохранность после коммита). Если внутри что-то падает — происходит откат (ROLLBACK), и БД остаётся в согласованном состоянии.",
        },
        {
          type: "code",
          lang: "ts",
          code: `// перевод денег: обе операции либо выполнятся, либо откатятся
await prisma.$transaction(async (tx) => {
  await tx.account.update({
    where: { id: from }, data: { balance: { decrement: 100 } },
  })
  await tx.account.update({
    where: { id: to }, data: { balance: { increment: 100 } },
  })
})`,
        },
        {
          type: "callout",
          variant: "warn",
          body: "OFFSET для пагинации на больших таблицах медленный (БД всё равно перебирает пропущенные строки). Для больших списков используют keyset-пагинацию (WHERE id > last_id ORDER BY id LIMIT n).",
        },
      ],
      advanced: [
        {
          type: "text",
          title: "N+1 проблема",
          body: "Классическая проблема ORM: сначала грузим список сущностей одним запросом, а потом в цикле делаем по запросу на каждую связанную запись — получается 1 + N запросов. Решение: загрузить связанные данные сразу через include (Prisma сделает JOIN или батч-запрос) или через dataloader для батчинга.",
        },
        {
          type: "code",
          lang: "ts",
          code: `// плохо — N+1: запрос в цикле
for (const u of users) {
  u.posts = await prisma.post.findMany({ where: { authorId: u.id } })
}

// хорошо — один запрос с include
const users = await prisma.user.findMany({
  include: { posts: true },
})`,
        },
        {
          type: "list",
          title: "Продвинутый уровень",
          items: [
            "Уровни изоляции (Read Committed, Repeatable Read, Serializable)",
            "Deadlock и race condition; блокировки SELECT ... FOR UPDATE",
            "Миграции Prisma: migrate dev в разработке, migrate deploy в CI/CD",
            "Пулы соединений (PgBouncer), лимиты в serverless-среде",
            "Денормализация, материализованные представления, партиционирование",
            "jsonb, полнотекстовый поиск, расширение pgvector для эмбеддингов",
          ],
        },
        {
          type: "callout",
          variant: "key",
          body: "Миграционная дисциплина (из вакансии): миграции коммитятся в репозиторий и накатываются автоматически в CI/CD через prisma migrate deploy. Прод-схему не меняют руками — иначе состояние БД разъезжается с кодом.",
        },
        {
          type: "mistakes",
          title: "Частые ошибки",
          items: [
            {
              bad: "Проблема N+1: в цикле по списку делать отдельный запрос на каждую строку.",
              good: "Один запрос с JOIN или include, либо загрузка пачкой по массиву id (IN / whereIn).",
            },
            {
              bad: "Клеить SQL строками с пользовательским вводом — SQL-инъекция.",
              good: "Всегда параметризованные запросы ($1, $2) или методы ORM с плейсхолдерами.",
            },
            {
              bad: "Фильтровать/сортировать по колонке без индекса на больших таблицах.",
              good: "Добавлять индексы под реальные запросы и проверять план через EXPLAIN ANALYZE.",
            },
            {
              bad: "Несколько связанных изменений без транзакции — данные бьются при сбое посередине.",
              good: "Оборачивать связанные операции в одну транзакцию (BEGIN/COMMIT, $transaction).",
            },
          ],
        },
      ],
    },
    quiz: [
      {
        q: "Что делает LEFT JOIN в отличие от INNER JOIN?",
        options: [
          "Возвращает только совпавшие строки",
          "Возвращает все строки левой таблицы + совпадения из правой (иначе NULL)",
          "Соединяет три таблицы",
          "Удаляет дубликаты",
        ],
        answer: 1,
        explain: "LEFT JOIN сохраняет все строки левой таблицы; если справа нет пары — правые колонки будут NULL. INNER JOIN оставляет только совпадения.",
      },
      {
        q: "Что такое N+1 проблема?",
        options: [
          "Ошибка типа в TypeScript",
          "Когда после одного запроса за списком делается по запросу на каждый элемент",
          "Переполнение индекса",
          "Дедлок транзакций",
        ],
        answer: 1,
        explain: "1 запрос за списком + N запросов за связанными данными в цикле. Решается загрузкой связей сразу (include/JOIN) или dataloader-батчингом.",
      },
      {
        q: "Что гарантирует свойство Atomicity в транзакции?",
        options: [
          "Данные не займут лишнее место",
          "Операции выполнятся все или ни одна (при ошибке — откат)",
          "Запросы будут быстрыми",
          "Индексы обновятся автоматически",
        ],
        answer: 1,
        explain: "Атомарность = «всё или ничего»: при сбое внутри транзакции происходит ROLLBACK, и частичных изменений не остаётся.",
      },
      {
        q: "Как правильно накатывать миграции на прод в CI/CD?",
        options: [
          "prisma migrate dev",
          "Менять схему в БД руками",
          "prisma migrate deploy",
          "prisma db push каждый раз",
        ],
        answer: 2,
        explain: "migrate deploy применяет уже созданные и закоммиченные миграции детерминированно. migrate dev — для локальной разработки, ручные правки прод-схемы запрещены.",
      },
    ],
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
          body: "Тяжёлые и долгие задачи (отправка письма, генерация изображения, обработка видео, экспорт отчёта) нельзя выполнять прямо в HTTP-запросе — иначе пользователь ждёт, а таймауты и ошибки роняют UX. Такие задачи кладут в очередь и обрабатывают асинхронно фоновыми процессами. Веб-сервер отвечает пользователю сразу («задача принята»).",
        },
        {
          type: "text",
          title: "Что такое Redis",
          body: "Redis — быстрое in-memory хранилище структур данных типа ключ-значение. Благодаря скорости используется под кэш, сессии, счётчики, rate limiting, распределённые локи и как транспорт для очередей. BullMQ хранит задачи именно в Redis. Данные живут в оперативной памяти (с опциональной персистентностью), поэтому доступ очень быстрый.",
        },
        {
          type: "callout",
          variant: "key",
          body: "Модель producer/worker: Producer кладёт job в очередь → Redis хранит задачи → Worker забирает и выполняет. Компоненты развязаны: воркеров можно масштабировать отдельно от веб-сервера, а всплеск нагрузки сглаживается очередью.",
        },
      ],
      middle: [
        {
          type: "text",
          title: "BullMQ на практике",
          body: "BullMQ — популярная библиотека очередей для Node поверх Redis. Ключевые сущности: Queue (добавить задачу), Worker (обработать), QueueEvents (события). Поддерживает ретраи с backoff, задержки (delay), приоритеты, повторяющиеся задачи (cron) и ограничение частоты.",
        },
        {
          type: "code",
          lang: "ts",
          code: `// producer — добавляем задачу
const queue = new Queue("emails", { connection })
await queue.add(
  "welcome",
  { userId },
  { attempts: 3, backoff: { type: "exponential", delay: 1000 } },
)

// worker — обрабатываем
new Worker(
  "emails",
  async (job) => {
    await sendEmail(job.data.userId)
  },
  { connection, concurrency: 5 },
)`,
        },
        {
          type: "text",
          title: "Идемпотентность",
          body: "Задача может выполниться повторно (ретрай после падения, дубликат при сбое сети). Обработчик должен быть идемпотентным — повторный запуск не должен приводить к двойному эффекту (двум письмам, двойному списанию). Приём: уникальный jobId/ключ и проверка «уже сделано» перед выполнением.",
        },
        {
          type: "list",
          title: "Middle",
          items: [
            "Ретраи с экспоненциальным backoff и лимитом попыток",
            "Идемпотентность обработчиков (уникальные ключи, проверки)",
            "Concurrency воркера и rate limiting под внешние API",
            "Обработка failed jobs, dead-letter логика, ручной ретрай",
            "В NestJS: @nestjs/bullmq, @Processor и @Process",
          ],
        },
      ],
      advanced: [
        {
          type: "text",
          title: "Fan-out и надёжность",
          body: "Fan-out — паттерн, где одна задача порождает много под-задач (например «обработать альбом» → задача на каждое фото). В BullMQ это делают через Flows (родитель с детьми). Важны надёжность (задача не теряется при деплое), наблюдаемость (метрики задержки, длина очереди) и корректное завершение воркеров.",
        },
        {
          type: "list",
          title: "Уровень вакансии",
          items: [
            "Flows / дочерние задачи для fan-out и агрегации результатов",
            "Идемпотентность и exactly-once семантика на практике (at-least-once + дедуп)",
            "Мониторинг очередей (Bull Board), алерты на рост очереди",
            "Graceful shutdown воркеров, чтобы не терять задачи при деплое",
            "Приоритеты, отложенные и повторяющиеся (repeatable) задачи",
          ],
        },
        {
          type: "callout",
          variant: "tip",
          body: "Redis полезен не только под очереди: кэш (снять нагрузку с Postgres), rate limiter, распределённый лок, pub/sub, хранение сессий. Умение назвать эти сценарии на собеседовании — большой плюс.",
        },
        {
          type: "mistakes",
          title: "Частые ошибки",
          items: [
            {
              bad: "Делать тяжёлую работу (отправка почты, генерация отчёта) прямо в HTTP-обработчике.",
              good: "Класть задачу в очередь и сразу отвечать клиенту; воркер обрабатывает её в фоне.",
            },
            {
              bad: "Считать, что задача выполнится ровно один раз.",
              good: "Делать обработчик идемпотентным — повтор при ретрае не должен дублировать эффект (проверка по ключу/статусу).",
            },
            {
              bad: "Не ограничивать число попыток — «ядовитая» задача крутится вечно.",
              good: "Задавать attempts + backoff и отправлять безнадёжные задачи в dead-letter очередь для разбора.",
            },
            {
              bad: "Хранить в задаче огромный payload целиком.",
              good: "Класть в задачу только id/ссылку, а данные подтягивать из БД внутри воркера.",
            },
          ],
        },
      ],
    },
    quiz: [
      {
        q: "Почему тяжёлую задачу выносят в очередь, а не делают в HTTP-запросе?",
        options: [
          "Так меньше кода",
          "Чтобы не заставлять пользователя ждать и не упираться в таймауты",
          "Очереди безопаснее HTTPS",
          "Redis шифрует данные",
        ],
        answer: 1,
        explain: "Долгая работа в запросе блокирует ответ, ведёт к таймаутам и плохому UX. Задачу кладут в очередь, отвечают сразу, а воркер обрабатывает её фоново.",
      },
      {
        q: "Что значит идемпотентность обработчика задачи?",
        options: [
          "Он выполняется мгновенно",
          "Повторный запуск не приводит к повторному эффекту",
          "Он не использует Redis",
          "Он всегда падает один раз",
        ],
        answer: 1,
        explain: "Так как задача может выполниться повторно (ретрай/дубликат), обработчик должен давать тот же результат без побочных дублей — через уникальные ключи и проверки.",
      },
      {
        q: "Где BullMQ хранит задачи?",
        options: ["В PostgreSQL", "В файловой системе", "В Redis", "В оперативной памяти Node-процесса"],
        answer: 2,
        explain: "BullMQ работает поверх Redis — именно там хранятся задачи, их статусы и метаданные.",
      },
    ],
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
          body: "Образ (image) — неизменяемый шаблон: файловая система + приложение + зависимости + команда запуска. Контейнер — запущенный экземпляр образа (как объект из класса). Docker решает проблему «у меня работает»: окружение одинаковое на всех машинах и в CI. В отличие от виртуальных машин, контейнеры делят ядро ОС и потому лёгкие и быстрые.",
        },
        {
          type: "text",
          title: "Dockerfile",
          body: "Dockerfile — рецепт сборки образа. Каждая инструкция создаёт слой (layer); слои кэшируются, поэтому порядок важен: то, что меняется редко (установка зависимостей), ставят раньше исходников. Сначала копируют package*.json и ставят зависимости, и только потом копируют код — так пересборка при изменении кода не переустанавливает пакеты.",
        },
        {
          type: "code",
          lang: "dockerfile",
          code: `FROM node:20-alpine
WORKDIR /app

# сначала зависимости — слой закэшируется
COPY package*.json ./
RUN npm ci

# потом исходники
COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]`,
        },
        {
          type: "list",
          title: "База команд",
          items: [
            "docker build -t app . — собрать образ из Dockerfile",
            "docker run -p 3000:3000 app — запустить контейнер, пробросить порт",
            "docker ps / docker logs / docker exec -it <id> sh — смотреть и заходить внутрь",
            "docker images / docker rm / docker rmi — управление образами и контейнерами",
            "Слои кэшируются — порядок инструкций влияет на скорость пересборки",
          ],
        },
      ],
      middle: [
        {
          type: "text",
          title: "docker compose",
          body: "Compose описывает многосервисное приложение в одном YAML и поднимает всё одной командой (docker compose up). Типичный набор для этого стека: приложение + PostgreSQL + Redis. Сервисы автоматически попадают в общую сеть и обращаются друг к другу по имени сервиса (db, redis), а не по IP.",
        },
        {
          type: "code",
          lang: "yaml",
          code: `services:
  app:
    build: .
    ports: ["3000:3000"]
    environment:
      DATABASE_URL: postgres://postgres:secret@db:5432/app
    depends_on: [db, redis]
  db:
    image: postgres:16
    environment:
      POSTGRES_PASSWORD: secret
    volumes: ["pgdata:/var/lib/postgresql/data"]
  redis:
    image: redis:7
volumes:
  pgdata: {}`,
        },
        {
          type: "list",
          title: "Middle",
          items: [
            "Volumes (данные переживают перезапуск) vs bind mounts (код с хоста)",
            "ENV-переменные и .env; секреты не зашивать в образ",
            "Сеть между сервисами: обращение по имени (db:5432, redis:6379)",
            ".dockerignore — не тащить node_modules и .git в контекст сборки",
            "depends_on + healthcheck, чтобы приложение стартовало после БД",
          ],
        },
        {
          type: "callout",
          variant: "warn",
          body: "depends_on гарантирует порядок старта, но НЕ готовность сервиса. БД может ещё инициализироваться. Нужны healthcheck и/или retry-логика подключения в приложении.",
        },
      ],
      advanced: [
        {
          type: "text",
          title: "Multi-stage build",
          body: "Разделяем этапы сборки и рантайма. На стадии build ставим все зависимости и собираем проект; в финальный образ копируем только собранный результат и прод-зависимости. Итог — меньший размер образа, меньше площадь атаки, быстрее деплой.",
        },
        {
          type: "code",
          lang: "dockerfile",
          code: `FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
USER node
CMD ["node", "dist/main.js"]`,
        },
        {
          type: "list",
          title: "Продвинуто",
          items: [
            "Healthcheck, non-root user (USER node), минимальные базовые образы",
            "Кэш слоёв в CI (buildkit, cache mounts), ускорение сборки",
            "Тэги образов по версии/коммиту, пуш в registry",
            "Мультисервисная среда (app + Postgres + Redis + воркеры) — прямо из вакансии",
            "Разница alpine/slim/distroless, безопасность образов",
          ],
        },
        {
          type: "mistakes",
          title: "Частые ошибки",
          items: [
            {
              bad: "Копировать весь проект и только потом ставить зависимости — кэш слоёв не работает.",
              good: "Сначала COPY package*.json + RUN npm ci, потом COPY остального кода — переустановка только при смене зависимостей.",
            },
            {
              bad: "Собирать финальный образ поверх полного node с dev-зависимостями и исходниками.",
              good: "Multi-stage build: собрать в одном слое, в финальный образ положить только рантайм и сборку.",
            },
            {
              bad: "Хранить секреты и .env прямо в образе или в Dockerfile.",
              good: "Передавать секреты через переменные окружения/секреты при запуске, а .env и node_modules класть в .dockerignore.",
            },
            {
              bad: "Держать важные данные внутри контейнера — при удалении они пропадают.",
              good: "Выносить состояние в volume или внешнюю БД; контейнер должен быть одноразовым.",
            },
          ],
        },
      ],
    },
    quiz: [
      {
        q: "В чём разница между образом и контейнером?",
        options: [
          "Это синонимы",
          "Образ — неизменяемый шаблон, контейнер — его запущенный экземпляр",
          "Контейнер тяжелее виртуальной машины",
          "Образ запускается, контейнер собирается",
        ],
        answer: 1,
        explain: "Образ — как класс (шаблон), контейнер — как объект (запущенный экземпляр). Из одного образа можно запустить много контейнеров.",
      },
      {
        q: "Почему в Dockerfile сначала копируют package.json и ставят зависимости, а код — потом?",
        options: [
          "Так требует синтаксис",
          "Чтобы слой с зависимостями кэшировался и не пересобирался при изменении кода",
          "Иначе не запустится npm",
          "Для безопасности",
        ],
        answer: 1,
        explain: "Слои кэшируются. Если код меняется, а package.json нет, Docker переиспользует закэшированный слой с установленными зависимостями — пересборка быстрее.",
      },
      {
        q: "Что даёт multi-stage build?",
        options: [
          "Несколько портов",
          "Меньший финальный образ: сборочные зависимости не попадают в рантайм",
          "Автоматические миграции",
          "Шифрование образа",
        ],
        answer: 1,
        explain: "Собираем на одной стадии, копируем в финальную только нужный результат. Итоговый образ меньше и безопаснее.",
      },
      {
        q: "Как сервисы в docker compose обращаются друг к другу?",
        options: [
          "По внешнему IP",
          "По localhost",
          "По имени сервиса (например db, redis) в общей сети",
          "Только через порт хоста",
        ],
        answer: 2,
        explain: "Compose создаёт общую сеть, где каждый сервис доступен по своему имени как хосту (db:5432, redis:6379).",
      },
    ],
  },
  {
    id: "git",
    title: "Git + CI/CD",
    icon: "GitBranch",
    tagline: "Ветки, pull request'ы, автоматизация",
    levels: {
      junior: [
        {
          type: "text",
          title: "Модель Git",
          body: "Git — распределённая система контроля версий. Есть три «зоны»: рабочая директория, индекс (staging, куда добавляют через add) и репозиторий (куда фиксируют через commit). Коммит — это снимок состояния с ссылкой на родителя; история — граф коммитов. Ветка — просто подвижный указатель на коммит.",
        },
        {
          type: "list",
          title: "База Git",
          items: [
            "add → commit → push; статус и история (status, log)",
            "Ветки: branch, switch/checkout -b, merge",
            "Remote (origin): разница fetch (скачать) и pull (скачать + слить)",
            "Осмысленные сообщения коммитов, .gitignore для мусора",
            "diff — что изменилось; reset/restore — откатить изменения",
          ],
        },
        {
          type: "code",
          lang: "bash",
          code: `git switch -c feature/login       # создать ветку и перейти
git add .
git commit -m "feat: add login form"
git push -u origin feature/login  # запушить и связать с remote
# затем открыть Pull Request в интерфейсе GitHub/GitLab`,
        },
      ],
      middle: [
        {
          type: "text",
          title: "Флоу разработки",
          body: "Вакансия прямо просит: работа через ветки и pull request'ы, доска Kanban, задача проходит все этапы. Типичный цикл: создаёшь feature-ветку от main → делаешь коммиты → открываешь PR → проходит ревью и CI → merge в main. Прямой push в main запрещён (защищённая ветка).",
        },
        {
          type: "text",
          title: "merge vs rebase",
          body: "merge объединяет ветки, создавая merge-коммит и сохраняя реальную историю. rebase «переносит» твои коммиты поверх свежего main, делая историю линейной, но переписывая её. Правило: rebase — для локальных, ещё не запушенных или личных веток; не rebase'ить общие ветки, которые уже у других.",
        },
        {
          type: "code",
          lang: "bash",
          code: `# подтянуть свежий main в свою ветку без merge-коммита
git switch feature/x
git fetch origin
git rebase origin/main
# при конфликте: править файлы, затем
git add . && git rebase --continue`,
        },
        {
          type: "list",
          title: "Middle",
          items: [
            "Разрешение конфликтов слияния осознанно, а не наугад",
            "Интерактивный rebase (squash/fixup) для чистой истории перед мержем",
            "Conventional Commits (feat/fix/chore/refactor) — читаемая история и авто-changelog",
            "git stash, cherry-pick, revert (безопасный откат в общей истории)",
            "Защита веток, обязательные ревью и зелёный CI перед merge",
          ],
        },
      ],
      advanced: [
        {
          type: "text",
          title: "CI/CD",
          body: "Continuous Integration — на каждый PR автоматически прогонять линт, проверку типов и тесты, чтобы в main не попадал сломанный код. Continuous Delivery/Deployment — автоматически собирать и (авто или по кнопке) выкатывать после мержа. Пайплайн описывают в YAML (GitHub Actions, GitLab CI).",
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
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: pnpm }
      - run: pnpm install --frozen-lockfile
      - run: pnpm lint && pnpm typecheck
      - run: pnpm test`,
        },
        {
          type: "list",
          title: "Продвинуто",
          items: [
            "Стадии пайплайна: install → lint → typecheck → test → build → deploy",
            "Кэширование зависимостей и артефактов для скорости",
            "Миграции БД в пайплайне (prisma migrate deploy) и сборка Docker-образа",
            "Секреты в CI (не в коде), окружения (staging/prod), ручные approvals",
            "Матрицы (несколько версий Node), параллельные джобы",
          ],
        },
        {
          type: "callout",
          variant: "tip",
          body: "«Проверять результат перед мержем» из вакансии = зелёный CI + прошедшее ревью. На собеседовании ценят понимание, зачем каждая стадия и как ускорять пайплайн кэшем и параллелизмом.",
        },
        {
          type: "mistakes",
          title: "Частые ошибки",
          items: [
            {
              bad: "Коммитить прямо в main и пушить туда без ревью.",
              good: "Работать в feature-ветке и вливать через Pull Request с проверкой CI и код-ревью.",
            },
            {
              bad: "Делать git push --force в общую ветку и переписывать чужую историю.",
              good: "Использовать git push --force-with-lease и только в своих ветках, согласовав с командой.",
            },
            {
              bad: "Один гигантский коммит «сделал всё» с расплывчатым сообщением.",
              good: "Небольшие атомарные коммиты с понятными сообщениями (часто в стиле Conventional Commits).",
            },
            {
              bad: "Закоммитить .env, node_modules или ключи в репозиторий.",
              good: "Добавить их в .gitignore заранее; утёкший секрет считать скомпрометированным и ротировать.",
            },
          ],
        },
      ],
    },
    quiz: [
      {
        q: "Что такое ветка (branch) в Git?",
        options: [
          "Копия всего репозитория на диске",
          "Подвижный указатель на коммит",
          "Отдельный сервер",
          "Формат файла",
        ],
        answer: 1,
        explain: "Ветка — это лёгкий движущийся указатель на определённый коммит. Создание веток дёшево, поэтому под каждую фичу заводят отдельную.",
      },
      {
        q: "Когда безопасно использовать rebase?",
        options: [
          "На общей ветке, которую уже используют другие",
          "На своей локальной/личной ветке, не запушенной или только твоей",
          "Всегда вместо merge на main",
          "Никогда",
        ],
        answer: 1,
        explain: "rebase переписывает историю, поэтому его применяют к личным веткам. Rebase общей ветки ломает историю у коллег.",
      },
      {
        q: "Что делает CI на каждый pull request?",
        options: [
          "Автоматически деплоит в прод",
          "Прогоняет линт, типы и тесты, не давая слить сломанный код",
          "Удаляет ветку",
          "Создаёт релиз",
        ],
        answer: 1,
        explain: "Continuous Integration автоматически проверяет код (lint/typecheck/test) на каждый PR — это гейт качества перед мержем.",
      },
    ],
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
          body: "Тесты защищают от регрессий: изменил код — прогнал тесты — уверен, что не сломал существующее. Пирамида тестирования: много быстрых unit-тестов (отдельные функции/модули), меньше интеграционных (несколько модулей вместе, с БД), и совсем немного медленных end-to-end (весь путь пользователя). Инструменты: Jest или Vitest для unit/интеграции, Playwright для e2e.",
        },
        {
          type: "code",
          lang: "ts",
          code: `import { describe, it, expect } from "vitest"
import { sum } from "./sum"

describe("sum", () => {
  it("складывает два числа", () => {
    expect(sum(2, 3)).toBe(5)
  })

  it("работает с отрицательными", () => {
    expect(sum(-1, 1)).toBe(0)
  })
})`,
        },
        {
          type: "list",
          title: "База Junior",
          items: [
            "Структура: describe (группа) → it/test (случай) → expect (проверка)",
            "Матчеры: toBe, toEqual, toContain, toThrow",
            "Что тестировать в первую очередь: бизнес-логику и граничные случаи",
            "Тест должен быть детерминированным (не зависеть от времени/сети)",
          ],
        },
      ],
      middle: [
        {
          type: "text",
          title: "Паттерн AAA и моки",
          body: "AAA: Arrange (подготовили данные и окружение) → Act (выполнили действие) → Assert (проверили результат). Внешние зависимости (БД, HTTP, время) заменяют моками/стабами, чтобы unit-тест был быстрым и изолированным. Важно мокать границы, а не всё подряд.",
        },
        {
          type: "code",
          lang: "tsx",
          code: `import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

test("счётчик увеличивается по клику", async () => {
  render(<Counter />)                                  // Arrange
  await userEvent.click(screen.getByRole("button"))    // Act
  expect(screen.getByText("Кликов: 1")).toBeInTheDocument() // Assert
})`,
        },
        {
          type: "list",
          title: "Middle",
          items: [
            "Тестирование React через Testing Library — по поведению, не по реализации",
            "Запросы по роли/тексту (getByRole) вместо классов/id",
            "Моки модулей и функций (vi.mock, jest.fn), фейковые таймеры",
            "Coverage как ориентир, а не самоцель (100% ≠ качество)",
            "Тесты Server Actions / API — с тестовой БД или моком слоя данных",
          ],
        },
        {
          type: "callout",
          variant: "tip",
          body: "Тестируй поведение, а не детали реализации. Если тест ломается при рефакторинге, который не менял поведение, — он проверяет реализацию. Запросы по роли/тексту устойчивее к изменениям вёрстки.",
        },
      ],
      advanced: [
        {
          type: "text",
          title: "Интеграционные и e2e",
          body: "Интеграционные тесты проверяют связку модулей (например контроллер + сервис + реальная тестов��я БД в Docker). e2e через Playwright гоняют реальный браузер по сценарию пользователя. В NestJS e2e делают через supertest и те��товый модуль приложения. Данные между тестами изолируют (транзакция с откатом или чистка БД).",
        },
        {
          type: "code",
          lang: "ts",
          code: `import * as request from "supertest"

it("POST /users создаёт пользователя", async () => {
  const res = await request(app.getHttpServer())
    .post("/users")
    .send({ email: "a@b.c", password: "12345678" })
    .expect(201)

  expect(res.body.email).toBe("a@b.c")
})`,
        },
        {
          type: "list",
          title: "Уровень вакансии",
          items: [
            "e2e в NestJS через supertest + Test.createTestingModule",
            "Тестовая БД в Docker, изоляция данных (транзакции/усечение таблиц)",
            "Playwright для сквозных сценариев фронта (логин → действие → результат)",
            "Тесты как обязательный гейт в CI перед мержем (из вакансии)",
            "Flaky-тесты: причины (гонки, время, порядок) и борьба с ними",
          ],
        },
        {
          type: "mistakes",
          title: "Частые ошибки",
          items: [
            {
              bad: "Тестировать детали реализации: приватные методы, конкретные вызовы внутри.",
              good: "Проверять поведение через публичный интерфейс — что на входе, что на выходе.",
            },
            {
              bad: "Гнаться за 100% покрытия ради цифры.",
              good: "Покрывать в первую очередь бизнес-логику и граничные случаи; покрытие — ориентир, а не цель.",
            },
            {
              bad: "Флейки-тесты, зависящие от времени, случайностей и реальной сети.",
              good: "Мокать время/рандом и внешние сервисы, делать тесты детерминированными и изолированными.",
            },
            {
              bad: "Писать только e2e-тесты на всё — медленно и хрупко.",
              good: "Держать пирамиду: много быстрых unit, меньше интеграционных, минимум e2e на ключевые сценарии.",
            },
          ],
        },
      ],
    },
    quiz: [
      {
        q: "Что описывает пирамида тестирования?",
        options: [
          "Больше e2e, меньше unit",
          "Много быстрых unit, меньше интеграционных, мало медленных e2e",
          "Только e2e-тесты",
          "Равное количество всех типов",
        ],
        answer: 1,
        explain: "Основание пирамиды — быстрые дешёвые unit-тесты, выше — интеграционные, на вершине немного медленных e2e. Так покрытие остаётся быстрым и надёжным.",
      },
      {
        q: "Что означает паттерн AAA?",
        options: [
          "Async-Await-Assert",
          "Arrange-Act-Assert",
          "Api-Auth-Access",
          "Add-Alter-Apply",
        ],
        answer: 1,
        explain: "Arrange (подготовка), Act (действие), Assert (проверка) — стандартная структура понятного теста.",
      },
      {
        q: "Почему тестировать поведение лучше, чем реализацию?",
        options: [
          "Так быстрее пишется",
          "Тест не ломается при рефакторинге, если поведение не изменилось",
          "Не нужны матчеры",
          "Это требование TypeScript",
        ],
        answer: 1,
        explain: "Тесты на поведение (по роли/тексту, по результату) устойчивы к изменениям внутренней реализации и вёрстки — рефакторинг их не ломает.",
      },
    ],
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
          title: "LLM в продукте",
          body: "LLM (large language model) — большая языковая модель (GPT, Claude, Gemini), предсказывающая следующий токен. В продукт встраивается через API: отправляешь промпт — получаешь текст или структурированный JSON. Есть также модели генерации изображений/аудио. Важно понимать границы: модель может «галлюцинировать» (уверенно выдумывать), поэтому критичные данные нужно проверять.",
        },
        {
          type: "list",
          title: "База",
          items: [
            "System prompt (роль/правила) vs user prompt (конкретный запрос)",
            "Токены, контекстное окно (лимит текста), температура (креативность vs предсказуемость)",
            "Стриминг ответа токен за токеном для хорошего UX",
            "AI-инструменты разработчика: Cursor, Copilot, v0, Claude Code",
            "Стоимость: платишь за токены ввода и вывода — это влияет на архитектуру",
          ],
        },
        {
          type: "code",
          lang: "ts",
          code: `import { generateText } from "ai"

const { text } = await generateText({
  model: "openai/gpt-4o-mini",
  system: "Ты помощник, отвечай кратко по-русски.",
  prompt: "Объясни, что такое индекс в PostgreSQL",
})`,
        },
      ],
      middle: [
        {
          type: "text",
          title: "Структурированный вывод",
          body: "Чтобы LLM отдавала не свободный текст, а валидный объект нужной формы, используют structured output со схемой (например Zod). Модель обязуют вернуть JSON, соответствующий схеме — это делает AI-фичи предсказуемыми, типобезопасными и удобными для дальнейшей обработки в коде.",
        },
        {
          type: "code",
          lang: "ts",
          code: `import { generateObject } from "ai"
import { z } from "zod"

const { object } = await generateObject({
  model: "openai/gpt-4o",
  schema: z.object({
    title: z.string(),
    tags: z.array(z.string()),
    summary: z.string(),
  }),
  prompt: "Сгенерируй заголовок, теги и краткое описание статьи о Postgres",
})
// object типизирован по схеме`,
        },
        {
          type: "list",
          title: "Middle",
          items: [
            "Промпт-инжиниринг: чёткие инструкции, примеры (few-shot), ограничения",
            "Выбор модели под задачу: баланс цена / скорость / качество",
            "Контроль качества: валидация вывода, ретраи при невалидном JSON",
            "Стриминг в UI (useChat из AI SDK) и обработка ошибок/лимитов",
            "Единый API-слой для текста и изображений (Vercel AI SDK / AI Gateway)",
          ],
        },
      ],
      advanced: [
        {
          type: "text",
          title: "RAG (Retrieval-Augmented Generation)",
          body: "RAG решает проблему устаревших знаний и галлюцinaций: перед ответом мы находим в своей базе знаний релевантные фрагменты и подмешиваем их в промпт как контекст. Модель отвечает по актуальным данным, а не по памяти. Поиск релевантного делают через эмбеддинги и векторное сходство.",
        },
        {
          type: "code",
          lang: "ts",
          code: `// 1) индексация: текст -> эмбеддинг -> в векторную БД (pgvector)
const { embedding } = await embed({ model: "openai/text-embedding-3-small", value: chunk })

// 2) поиск похожих кусков по косинусной близости (SQL с pgvector)
//    SELECT content FROM docs ORDER BY embedding <=> $query LIMIT 5

// 3) подмешиваем найденное в промпт и генерируем ответ`,
        },
        {
          type: "list",
          title: "Продвинуто (большой плюс по вакансии)",
          items: [
            "Эмбеддинги + векторный поиск (pgvector прямо в Postgres)",
            "Чанкинг документов и настройка релевантности выдачи",
            "Агенты и tool calling — модель вызывает твои функции/API",
            "Фоновая AI-генерация через очереди (BullMQ) для тяжёлых задач",
            "Оценка качества (evals), защита от prompt injection, лимиты и стоимость",
          ],
        },
        {
          type: "callout",
          variant: "key",
          body: "Связка тем стека: тяжёлая AI-генерация (картинки/большой контент) долгая → уходит в очередь (BullMQ) → результат в объектное хранилище → пользователю через websocket/поллинг. Умение соединить AI + очереди + БД = сильный сигнал fullstack-уровня.",
        },
        {
          type: "mistakes",
          title: "Частые ошибки",
          items: [
            {
              bad: "Слепо доверять ответу LLM и класть его в прод без проверки.",
              good: "Валидировать вывод (схемой/проверками), а факты подтверждать источниками — модель может уверенно ошибаться.",
            },
            {
              bad: "Слать API-ключ модели прямо из браузера.",
              good: "Ходить к провайдеру только с сервера (Route Handler/Server Action), ключ держать в серверных env.",
            },
            {
              bad: "Пихать в промпт весь контекст и всю историю без ограничений.",
              good: "Держать компактный системный промпт, обрезать историю и подмешивать только релевантные куски (RAG).",
            },
            {
              bad: "Вставлять пользовательский текст прямо в инструкцию модели.",
              good: "Отделять данные от инструкций и учитывать риск prompt injection, ограничивая права инструментов модели.",
            },
          ],
        },
      ],
    },
    quiz: [
      {
        q: "Что такое галлюцинация LLM?",
        options: [
          "Ошибка сети",
          "Модель уверенно выдаёт неверную/выдуманную информацию",
          "Превышение контекстного окна",
          "Медленный ответ",
        ],
        answer: 1,
        explain: "LLM предсказывает вероятный текст и может уверенно выдумывать факты. Поэтому критичные данные проверяют, а для актуальности используют RAG.",
      },
      {
        q: "Зачем нужен structured output (схема Zod)?",
        options: [
          "Чтобы ускорить модель",
          "Чтобы получить предсказуемый типизированный JSON вместо свободного текста",
          "Чтобы уменьшить стоимость токенов",
          "Чтобы включить стриминг",
        ],
        answer: 1,
        explain: "Схема заставляет модель вернуть валидный объект нужной формы — фича становится предсказуемой и типобезопасной для дальнейшей обработки в коде.",
      },
      {
        q: "В чём суть RAG?",
        options: [
          "Дообучение модели на своих данных",
          "Поиск релевантных фрагментов в своей базе и подмешивание их в промпт",
          "Сжатие промпта",
          "Кэширование ответов",
        ],
        answer: 1,
        explain: "Retrieval-Augmented Generation находит релевантный контекст (обычно через эмбеддинги и векторный поиск) и добавляет его в промпт, чтобы ответ опирался на актуальные данные.",
      },
      {
        q: "Куда логично вынести тяжёлую AI-генерацию изображений?",
        options: [
          "В синхронный HTTP-запрос",
          "В фоновую очередь (BullMQ), а результат отдать позже",
          "В localStorage",
          "В middleware",
        ],
        answer: 1,
        explain: "Долгие задачи выносят в очередь, чтобы не блокировать запрос; результат кладут в хранилище и уведомляют клиента через websocket/поллинг.",
      },
    ],
  },
]
