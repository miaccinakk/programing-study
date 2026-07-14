import { Lightbulb, AlertTriangle, KeyRound, Ban } from "lucide-react"
import type { Block } from "@/lib/curriculum"
import { CodeBlock } from "@/components/code-block"

const calloutStyles = {
  tip: { icon: Lightbulb, cls: "border-ok/70 bg-ok/10", ic: "text-ok" },
  warn: { icon: AlertTriangle, cls: "border-warn/70 bg-warn/10", ic: "text-warn" },
  key: { icon: KeyRound, cls: "border-brand/70 bg-brand/10", ic: "text-brand" },
  danger: { icon: Ban, cls: "border-danger/70 bg-danger/10", ic: "text-danger" },
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
