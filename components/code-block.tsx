"use client"

import { useState } from "react"
import { Check, Copy } from "lucide-react"
import { highlight } from "@/lib/highlight"

export function CodeBlock({ code, lang }: { code: string; lang?: string }) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // ignore
    }
  }

  return (
    <div className="group relative my-4 overflow-hidden rounded-xl border border-border bg-[#0b0e1a] shadow-md">
      <div className="flex items-center justify-between border-b border-border/60 bg-[#12152a] px-4 py-2">
        <span className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
          <span className="flex gap-1.5" aria-hidden>
            <span className="size-2.5 rounded-full bg-danger/70" />
            <span className="size-2.5 rounded-full bg-warn/70" />
            <span className="size-2.5 rounded-full bg-ok/70" />
          </span>
          <span className="ml-1 uppercase tracking-wide text-brand/80">{lang ?? "code"}</span>
        </span>
        <button
          onClick={copy}
          className="flex items-center gap-1.5 rounded-md border border-border/60 px-2 py-1 text-xs text-muted-foreground transition-colors hover:border-brand hover:text-brand"
          aria-label="Копировать код"
        >
          {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
          {copied ? "Скопировано" : "Копировать"}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 text-[13px] leading-relaxed">
        <code className="font-mono text-[#cdd3f0]">{highlight(code, lang)}</code>
      </pre>
    </div>
  )
}
