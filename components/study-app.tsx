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

export function StudyApp() {
  const [activeId, setActiveId] = useState(curriculum[0].id)
  const [level, setLevel] = useState<Level>("junior")
  const [navOpen, setNavOpen] = useState(false)

  const topic = useMemo(() => curriculum.find((t) => t.id === activeId)!, [activeId])
  const blocks = topic.levels[level]
  const levelMeta = LEVELS.find((l) => l.id === level)!

  const selectTopic = (id: string) => {
    setActiveId(id)
    setNavOpen(false)
    if (typeof window !== "undefined") window.scrollTo({ top: 0 })
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Mobile top bar */}
      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-card px-4 py-3 lg:hidden">
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
          } fixed inset-x-0 top-[57px] z-20 max-h-[calc(100vh-57px)] overflow-y-auto border-b border-border bg-card px-4 py-4 lg:sticky lg:top-0 lg:block lg:h-screen lg:w-72 lg:shrink-0 lg:border-b-0 lg:border-r lg:py-8`}
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

          <p className="mb-2 px-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">Темы</p>
          <nav className="flex flex-col gap-0.5">
            {curriculum.map((t) => {
              const Icon = icons[t.icon] ?? Atom
              const active = t.id === activeId
              return (
                <button
                  key={t.id}
                  onClick={() => selectTopic(t.id)}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                    active
                      ? "bg-primary/15 font-medium text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <Icon className="size-4 shrink-0" />
                  {t.title}
                </button>
              )
            })}
          </nav>
        </aside>

        {/* Content */}
        <main className="min-w-0 flex-1 px-5 py-8 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-3xl">
            <header className="mb-6">
              <div className="mb-2 flex items-center gap-2 text-sm text-primary">
                {(() => {
                  const Icon = icons[topic.icon] ?? Atom
                  return <Icon className="size-4" />
                })()}
                <span>{topic.title}</span>
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-balance">{topic.tagline}</h1>
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
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground"
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
