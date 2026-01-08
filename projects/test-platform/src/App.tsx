import { useEffect, useMemo, useRef, useState } from 'react'
import './App.css'

import {
  formatEmbedScriptTag,
  getCurrentWidgetId,
  getHistory,
  parseWidgetId,
  pushHistory,
  setCurrentWidgetId
} from './embedTester'

type ConsoleLevel = 'log' | 'info' | 'warn' | 'error' | 'debug'

type ConsoleEntry = {
  ts: number
  level: ConsoleLevel
  text: string
}

const formatConsoleArgs = (args: unknown[]) => {
  const seen = new WeakSet<object>()
  const formatValue = (value: unknown) => {
    if (typeof value === 'string') return value
    if (typeof value === 'number' || typeof value === 'boolean' || typeof value === 'bigint')
      return String(value)
    if (value === null) return 'null'
    if (value === undefined) return 'undefined'
    if (value instanceof Error) return value.stack || value.message
    if (typeof value === 'function') return `[Function ${value.name || 'anonymous'}]`
    if (typeof value === 'symbol') return value.toString()
    if (typeof value === 'object') {
      try {
        return JSON.stringify(
          value,
          (_, v) => {
            if (typeof v === 'object' && v !== null) {
              if (seen.has(v)) return '[Circular]'
              seen.add(v)
            }
            if (typeof v === 'bigint') return `${v.toString()}n`
            if (v instanceof Error) return { name: v.name, message: v.message, stack: v.stack }
            return v
          },
          2
        )
      } catch {
        try {
          return String(value)
        } catch {
          return '[Unserializable]'
        }
      }
    }
    try {
      return String(value)
    } catch {
      return '[Unserializable]'
    }
  }

  return args.map(formatValue).join(' ')
}

function App() {
  const current = getCurrentWidgetId()
  const [value, setValue] = useState(current)
  const [embedTag, setEmbedTag] = useState(formatEmbedScriptTag(current))
  const history = useMemo(() => getHistory(), [])
  const [consoleEntries, setConsoleEntries] = useState<ConsoleEntry[]>([])
  const consoleRef = useRef<HTMLTextAreaElement | null>(null)

  useEffect(() => {
    if (!import.meta.env.DEV) return

    let unmounted = false
    const pushEntry = (level: ConsoleLevel, args: unknown[]) => {
      if (unmounted) return
      const ts = Date.now()
      const text = formatConsoleArgs(args)
      setConsoleEntries(prev => {
        const next = prev.length > 2000 ? prev.slice(prev.length - 2000) : prev
        return [...next, { ts, level, text }]
      })
    }

    const original = {
      log: console.log,
      info: console.info,
      warn: console.warn,
      error: console.error,
      debug: console.debug,
      clear: console.clear
    }

    console.log = (...args: unknown[]) => {
      pushEntry('log', args)
      original.log.apply(console, args as never[])
    }
    console.info = (...args: unknown[]) => {
      pushEntry('info', args)
      original.info.apply(console, args as never[])
    }
    console.warn = (...args: unknown[]) => {
      pushEntry('warn', args)
      original.warn.apply(console, args as never[])
    }
    console.error = (...args: unknown[]) => {
      pushEntry('error', args)
      original.error.apply(console, args as never[])
    }
    console.debug = (...args: unknown[]) => {
      pushEntry('debug', args)
      original.debug.apply(console, args as never[])
    }
    console.clear = () => {
      setConsoleEntries([])
      original.clear.apply(console)
    }

    const onError = (e: ErrorEvent) => {
      const parts: unknown[] = ['window.error', e.message]
      if (e.error instanceof Error) parts.push(e.error.stack || e.error.message)
      else if (e.error) parts.push(e.error)
      pushEntry('error', parts)
    }

    const onUnhandledRejection = (e: PromiseRejectionEvent) => {
      const reason = e.reason
      if (reason instanceof Error) pushEntry('error', ['unhandledrejection', reason.stack || reason.message])
      else pushEntry('error', ['unhandledrejection', reason])
    }

    window.addEventListener('error', onError)
    window.addEventListener('unhandledrejection', onUnhandledRejection)

    return () => {
      unmounted = true
      console.log = original.log
      console.info = original.info
      console.warn = original.warn
      console.error = original.error
      console.debug = original.debug
      console.clear = original.clear
      window.removeEventListener('error', onError)
      window.removeEventListener('unhandledrejection', onUnhandledRejection)
    }
  }, [])

  // Keep the textarea in sync with the currently loaded widgetId.
  useEffect(() => {
    setEmbedTag(formatEmbedScriptTag(current))
    setValue(current)
  }, [current])

  const consoleText = useMemo(() => {
    const pad2 = (n: number) => String(n).padStart(2, '0')
    return consoleEntries
      .map(e => {
        const d = new Date(e.ts)
        const time = `${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())}.${String(
          d.getMilliseconds()
        ).padStart(3, '0')}`
        return `${time} [${e.level}] ${e.text}`
      })
      .join('\n')
  }, [consoleEntries])

  useEffect(() => {
    const el = consoleRef.current
    if (!el) return
    el.scrollTop = el.scrollHeight
  }, [consoleText])

  return (
    <>
      <div className="card">
        <h2 className="tp-title">Embed script tester</h2>
        <p className="tp-subtitle">
          Current widgetId: <code>{current || '(not set)'}</code>
        </p>

        <div className="tp-section">
          <div className="tp-label">Paste embed script tag:</div>
          <textarea
            value={embedTag}
            onChange={e => setEmbedTag(e.target.value)}
            rows={3}
            spellCheck={false}
            className="tp-textarea"
          />
        </div>

        <div className="tp-row">
          <input
            value={value}
            onChange={e => setValue(e.target.value)}
            placeholder="widgetId (e.g. cmiv69y9l0001fln0tqtma359)"
            className="tp-input"
          />
          <button
            onClick={() => {
              const fromTag = parseWidgetId(embedTag)
              const id = (fromTag || value).trim()
              if (!id) {
                alert('Укажи widgetId (вставь <script ...> или введи widgetId)')
                return
              }
              pushHistory(id)
              setCurrentWidgetId(id)
            }}
          >
            Load
          </button>
          <button onClick={() => window.location.reload()}>Reload</button>
          <button
            onClick={() => {
              window.sessionStorage.clear()
              window.location.reload()
            }}
          >
            Clear sessionStorage
          </button>
          <button onClick={() => setCurrentWidgetId('')}>Clear widgetId</button>
        </div>

        {history.length ? (
          <div className="tp-recent">
            <div className="tp-label">Recent:</div>
            <div className="tp-recentRow">
              {history.map(id => (
                <button
                  key={id}
                  onClick={() => {
                    pushHistory(id)
                    setCurrentWidgetId(id)
                  }}
                  className="tp-recentBtn"
                  title={id}
                >
                  {id.slice(0, 10)}…
                </button>
              ))}
            </div>
          </div>
        ) : null}

        <div className="tp-section" style={{ marginTop: 16 }}>
          <div className="tp-label">Console log (DEV only):</div>
          <textarea
            ref={consoleRef}
            value={consoleText}
            readOnly
            rows={12}
            spellCheck={false}
            className="tp-textarea"
          />
        </div>
      </div>
      <p className="read-the-docs">Tip: you can also set it via URL: <code>?widgetId=...</code></p>
    </>
  )
}

export default App
