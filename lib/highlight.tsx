import type { ReactNode } from "react"

// Палитра токенов — совпадает с react-guide.html
const COLORS = {
  comment: "#5a6187",
  string: "#c3e88d",
  number: "#f78c6c",
  keyword: "#c792ea",
  fn: "#82aaff",
  text: "#cdd3f0",
} as const

const KEYWORDS = new Set([
  "const", "let", "var", "function", "return", "if", "else", "for", "while", "do",
  "import", "export", "from", "default", "type", "interface", "extends", "implements",
  "class", "new", "async", "await", "try", "catch", "finally", "throw", "switch",
  "case", "break", "continue", "of", "in", "typeof", "instanceof", "as", "enum",
  "public", "private", "protected", "readonly", "void", "null", "undefined", "true",
  "false", "this", "super", "yield", "static", "get", "set", "namespace", "declare",
  "satisfies", "keyof", "infer", "abstract", "override",
])

// Ключевые слова для Dockerfile / YAML / SQL / bash
const SHELL_KEYWORDS = new Set([
  "FROM", "RUN", "CMD", "COPY", "ADD", "WORKDIR", "EXPOSE", "ENV", "ENTRYPOINT",
  "USER", "ARG", "LABEL", "VOLUME", "HEALTHCHECK", "AS",
  "SELECT", "INSERT", "UPDATE", "DELETE", "FROM", "WHERE", "JOIN", "LEFT", "INNER",
  "GROUP", "ORDER", "BY", "LIMIT", "CREATE", "TABLE", "INDEX", "PRIMARY", "KEY",
  "FOREIGN", "REFERENCES", "NOT", "NULL", "AND", "OR", "ON", "INTO", "VALUES", "SET",
])

function isShellLang(lang?: string) {
  return lang === "dockerfile" || lang === "yaml" || lang === "yml" || lang === "sql" || lang === "bash" || lang === "sh"
}

export function highlight(code: string, lang?: string): ReactNode[] {
  const shell = isShellLang(lang)
  const commentPart = shell ? "#[^\\n]*|--[^\\n]*|\\/\\/[^\\n]*" : "\\/\\/[^\\n]*|\\/\\*[\\s\\S]*?\\*\\/"
  const master = new RegExp(
    "(`(?:\\\\.|[^`\\\\])*`|\"(?:\\\\.|[^\"\\\\])*\"|'(?:\\\\.|[^'\\\\])*')" + // strings
    "|(" + commentPart + ")" + // comments
    "|(\\b\\d[\\d_.]*\\b)" + // numbers
    "|([A-Za-z_$][\\w$]*)", // identifiers
    "g",
  )

  const out: ReactNode[] = []
  let last = 0
  let key = 0
  let m: RegExpExecArray | null

  const push = (text: string, color?: string, italic?: boolean) => {
    if (!text) return
    if (!color) {
      out.push(text)
    } else {
      out.push(
        <span key={key++} style={{ color, fontStyle: italic ? "italic" : undefined }}>
          {text}
        </span>,
      )
    }
  }

  while ((m = master.exec(code)) !== null) {
    if (m.index > last) push(code.slice(last, m.index))
    const [full, str, comment, num, ident] = m
    if (str) {
      push(full, COLORS.string)
    } else if (comment) {
      push(full, COLORS.comment, true)
    } else if (num) {
      push(full, COLORS.number)
    } else if (ident) {
      if (KEYWORDS.has(ident) || (shell && SHELL_KEYWORDS.has(ident))) {
        push(full, COLORS.keyword)
      } else if (code[m.index + full.length] === "(") {
        push(full, COLORS.fn)
      } else {
        push(full)
      }
    }
    last = m.index + full.length
  }
  if (last < code.length) push(code.slice(last))
  return out
}
