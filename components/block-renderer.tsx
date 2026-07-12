import { Lightbulb, AlertTriangle, KeyRound, Ban } from "lucide-react"
import type { Block } from "@/lib/curriculum"
import { CodeBlock } from "@/components/code-block"

const calloutStyles = {
  tip: { icon: Lightbulb, cls: "border-emerald-500/60 bg-emerald-500/10", ic: "text-emerald-400" },
  warn: { icon: AlertTriangle, cls: "border-amber-500/60 bg-amber-500/10", ic: "text-amber-400" },
  key: { icon: KeyRound, cls: "border-sky-500/60 bg-sky-500/10", ic: "text-sky-400" },
  danger: { icon: Ban, cls: "border-red-500/60 bg-red-500/10", ic: "text-red-400" },
} as const

export function BlockRenderer({ block }: { block: Block }) {
  if (block.type === "text") {
    return (
      <div className="mb-5">
        {block.title && <h3 className="mb-2 text-lg font-semibold text-foreground">{block.title}</h3>}
        <p className="leading-relaxed text-muted-foreground">{block.body}</p>
      </div>
    )
  }

  if (block.type === "code") {
    return <CodeBlock code={block.code} lang={block.lang} />
  }

  if (block.type === "list") {
    return (
      <div className="mb-5 rounded-lg border border-border bg-card p-5">
        {block.title && <h4 className="mb-3 font-semibold text-foreground">{block.title}</h4>}
        <ul className="flex flex-col gap-2">
          {block.items.map((item, i) => (
            <li key={i} className="flex gap-2.5 text-sm leading-relaxed text-muted-foreground">
              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  // callout
  const { icon: Icon, cls, ic } = calloutStyles[block.variant]
  return (
    <div className={`mb-5 flex gap-3 rounded-lg border-l-4 p-4 ${cls}`}>
      <Icon className={`mt-0.5 size-5 shrink-0 ${ic}`} />
      <p className="text-sm leading-relaxed text-foreground/90">{block.body}</p>
    </div>
  )
}
