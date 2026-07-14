import { Lightbulb, AlertTriangle, KeyRound, Ban, X, Check } from "lucide-react"
import type { Block } from "@/lib/curriculum"
import { CodeBlock } from "@/components/code-block"

const calloutStyles = {
  tip: { icon: Lightbulb, cls: "border-ok/70 bg-ok/10", ic: "text-ok" },
  warn: { icon: AlertTriangle, cls: "border-warn/70 bg-warn/10", ic: "text-warn" },
  key: { icon: KeyRound, cls: "border-brand/70 bg-brand/10", ic: "text-brand" },
  danger: { icon: Ban, cls: "border-danger/70 bg-danger/10", ic: "text-danger" },
} as const

// Нумерованный бейдж секции (как .num в react-guide.html)
function NumBadge({ num }: { num: number }) {
  return (
    <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-brand text-[13px] font-bold text-[#0a0d18]">
      {num}
    </span>
  )
}

export function BlockRenderer({ block, id, num }: { block: Block; id?: string; num?: number }) {
  if (block.type === "text") {
    return (
      <div id={id} className="mb-6 scroll-mt-24">
        {block.title && (
          <h3 className="mb-2.5 flex items-center gap-2.5 text-xl font-semibold text-foreground">
            {num !== undefined && <NumBadge num={num} />}
            {block.title}
          </h3>
        )}
        <p className="leading-relaxed text-muted-foreground">{block.body}</p>
      </div>
    )
  }

  if (block.type === "code") {
    return <CodeBlock code={block.code} lang={block.lang} />
  }

  if (block.type === "list") {
    return (
      <div id={id} className="mb-6 scroll-mt-24 rounded-xl border border-border bg-card p-5 shadow-sm">
        {block.title && (
          <h4 className="mb-3 flex items-center gap-2.5 font-semibold text-foreground">
            {num !== undefined && <NumBadge num={num} />}
            {block.title}
          </h4>
        )}
        <ul className="flex flex-col gap-2.5">
          {block.items.map((item, i) => (
            <li key={i} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
              <Check className="mt-0.5 size-4 shrink-0 text-brand" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  if (block.type === "mistakes") {
    return (
      <div id={id} className="mb-6 scroll-mt-24 rounded-xl border border-warn/40 bg-warn/[0.04] p-5 shadow-sm">
        <h4 className="mb-4 flex items-center gap-2.5 font-semibold text-foreground">
          {num !== undefined ? <NumBadge num={num} /> : <AlertTriangle className="size-4 text-warn" />}
          {block.title ?? "Частые ошибки"}
        </h4>
        <div className="flex flex-col gap-3">
          {block.items.map((m, i) => (
            <div key={i} className="grid gap-2 rounded-lg border border-border bg-background-soft p-3.5 sm:grid-cols-2">
              <div className="flex gap-2">
                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-danger/15">
                  <X className="size-3.5 text-danger" />
                </span>
                <span className="text-sm leading-relaxed text-muted-foreground">{m.bad}</span>
              </div>
              <div className="flex gap-2 sm:border-l sm:border-border sm:pl-3">
                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-ok/15">
                  <Check className="size-3.5 text-ok" />
                </span>
                <span className="text-sm leading-relaxed text-foreground/90">{m.good}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (block.type === "flow") {
    return (
      <div id={id} className="mb-6 scroll-mt-24">
        {block.title && (
          <h4 className="mb-4 flex items-center gap-2.5 font-semibold text-foreground">
            {num !== undefined && <NumBadge num={num} />}
            {block.title}
          </h4>
        )}
        <ol className="flex flex-col gap-3">
          {block.steps.map((s, i) => (
            <li key={i} className="flex gap-3.5">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-brand/15 text-sm font-semibold text-brand">
                {i + 1}
              </span>
              <div className="min-w-0 flex-1 rounded-lg border border-border bg-card p-3.5">
                <p className="mb-0.5 font-medium text-foreground">{s.title}</p>
                <p className="text-sm leading-relaxed text-muted-foreground">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    )
  }

  if (block.type === "table") {
    return (
      <div id={id} className="mb-6 scroll-mt-24">
        {block.title && (
          <h4 className="mb-3 flex items-center gap-2.5 font-semibold text-foreground">
            {num !== undefined && <NumBadge num={num} />}
            {block.title}
          </h4>
        )}
        <div className="overflow-x-auto rounded-xl border border-border shadow-sm">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="bg-card-2">
                {block.headers.map((h, i) => (
                  <th key={i} className="whitespace-nowrap px-4 py-2.5 font-semibold text-brand">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, ri) => (
                <tr key={ri} className="border-t border-border bg-card">
                  {row.map((cell, ci) => (
                    <td key={ci} className="px-4 py-2.5 align-top leading-relaxed text-muted-foreground">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  // callout
  const { icon: Icon, cls, ic } = calloutStyles[block.variant]
  return (
    <div className={`mb-6 flex gap-3 rounded-xl border-l-4 p-4 ${cls}`}>
      <Icon className={`mt-0.5 size-5 shrink-0 ${ic}`} />
      <p className="text-sm leading-relaxed text-foreground/90">{block.body}</p>
    </div>
  )
}
