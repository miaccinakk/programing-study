"use client"

import { useMemo, useState } from "react"
import {
  Atom,
  Container,
  Database,
  FileType,
  FlaskConical,
  GitBranch,
  ListChecks,
  Menu,
  Server,
  Sparkles,
  Triangle,
  X,
  type LucideIcon,
} from "lucide-react"
import { curriculum, LEVELS, type Level } from "@/lib/curriculum"
import { BlockRenderer } from "@/components/block-renderer"

const icons: Record<string, LucideIcon> = {
  FileType,
  Atom,
  Triangle,
  Server,
  Database,
  ListChecks,
  Container,
  GitBranch,
  FlaskConical,
  Sparkles,
}

// Группировка тем для боковой навигации (как nav-group в мануале)
const groups: { label: string; ids: string[] }[] = [
  { label: "Язык", ids: ["typescript"] },
  { label: "Фронтенд", ids: ["react", "nextjs"] },
  { label: "Бэкенд", ids: ["nestjs", "postgres", "queues"] },
  { label: "Инфраструктура", ids: ["docker", "git"] },
  { label: "Качество и AI", ids: ["testing", "ai"] },
]

export function StudyApp() {
  const [activeId, setActiveId] = useState(curriculum[0].id)
  const [level, setLevel] = useState<Level>("junior")
  const [navOpen, setNavOpen] = useState(false)

  const topic = useMemo(() => curriculum.find((t) => t.id === activeId)!, [activeId])
  const blocks = topic.levels[level]
  const levelMeta = LEVELS.find((l) => l.id === level)!

  // Пилюли для hero — ключевые понятия из заголовков текущего уровня
  const pills = useMemo(
    () =>
      blocks
        .filter((b) => (b.type === "text" || b.type === "list") && b.title)
        .map((b) => (b as { title: string }).title)
        .slice(0, 6),
    [blocks],
  )

  const selectTopic = (id: string) => {
    setActiveId(id)
    setNavOpen(false)
    if (typeof window !== "undefined") window.scrollTo({ top: 0 })
  }

  const TopicIcon = icons[topic.icon] ?? Atom

  return (
    <div className="min-h-screen text-foreground">
      {/* Mobile top bar */}
      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-background-soft/95 px-4 py-3 backdrop-blur lg:hidden">
        <div className="flex items-center gap-2">
          <Sparkles className="size-5 text-primary" />
          <span className="font-semibold">Dev Prep</span>
        </div>
        <button
          onClick={() => setNavOpen((v) => !v)}
          aria-label="Меню"
          className="rounded-md p-1.5 text-muted-foreground hover:text-foreground"
        >
          {navOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      <div className="mx-auto flex max-w-7xl">
        {/* Sidebar */}
        <aside
          className={`${
            navOpen ? "block" : "hidden"
          } fixed inset-x-0 top-[57px] z-20 max-h-[calc(100vh-57px)] overflow-y-auto border-b border-border bg-background-soft px-4 py-4 lg:sticky lg:top-0 lg:block lg:h-screen lg:w-72 lg:shrink-0 lg:border-b-0 lg:border-r lg:py-8`}
        >
          <div className="mb-6 hidden items-center gap-2.5 px-2 lg:flex">
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary/15">
              <Sparkles className="size-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold leading-tight">Dev Prep</p>
              <p className="text-xs text-muted-foreground">подготовка к вакансии</p>
            </div>
          </div>

          <nav className="flex flex-col gap-1">
            {groups.map((group) => (
              <div key={group.label} className="mb-1">
                <p className="mb-1 mt-3 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                  {group.label}
                </p>
                {group.ids.map((id) => {
                  const t = curriculum.find((c) => c.id === id)
                  if (!t) return null
                  const Icon = icons[t.icon] ?? Atom
                  const active = t.id === activeId
                  return (
                    <button
                      key={t.id}
                      onClick={() => selectTopic(t.id)}
                      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                        active
                          ? "bg-card-2 font-medium text-primary"
                          : "text-muted-foreground hover:bg-card hover:text-foreground"
                      }`}
                    >
                      <Icon className="size-4 shrink-0" />
                      {t.title}
                    </button>
                  )
                })}
              </div>
            ))}
          </nav>
        </aside>

        {/* Content */}
        <main className="min-w-0 flex-1 px-5 py-8 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-3xl">
            {/* Hero */}
            <header className="relative mb-8 overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-primary/12 to-primary/[0.03] p-7 shadow-lg sm:p-9">
              <div className="pointer-events-none absolute -right-16 -top-16 size-60 rounded-full bg-primary/20 blur-3xl" />
              <div className="relative">
                <div className="mb-3 flex items-center gap-2.5 text-sm text-primary">
                  <span className="flex size-9 items-center justify-center rounded-lg bg-primary/15">
                    <TopicIcon className="size-5" />
                  </span>
                  <span className="font-medium">{topic.title}</span>
                </div>
                <h1 className="text-balance text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
                  {topic.tagline}
                </h1>
                {pills.length > 0 && (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {pills.map((p) => (
                      <span
                        key={p}
                        className="rounded-full border border-border bg-card-2 px-3 py-1 text-xs text-muted-foreground"
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </header>

            {/* Level tabs */}
            <div className="mb-2 grid grid-cols-3 gap-2 rounded-xl border border-border bg-card p-1.5">
              {LEVELS.map((l) => {
                const active = l.id === level
                return (
                  <button
                    key={l.id}
                    onClick={() => setLevel(l.id)}
                    className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      active
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:bg-card-2 hover:text-foreground"
                    }`}
                  >
                    {l.label}
                  </button>
                )
              })}
            </div>
            <p className="mb-8 text-sm text-muted-foreground">{levelMeta.hint}</p>

            {/* Blocks */}
            <article>
              {blocks.map((block, i) => (
                <BlockRenderer key={`${activeId}-${level}-${i}`} block={block} />
              ))}
            </article>

            <footer className="mt-12 border-t border-border pt-6 text-sm text-muted-foreground">
              Стек ориентирован на вакансию Fullstack (TypeScript, NestJS + Next.js). Проходи темы по уровням от начального к продвинутому.
            </footer>
          </div>
        </main>
      </div>
    </div>
  )
}
