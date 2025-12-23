import { useEffect, useMemo, useState } from 'react'
import './App.css'

import {
  formatEmbedScriptTag,
  getCurrentWidgetId,
  getHistory,
  parseWidgetId,
  pushHistory,
  setCurrentWidgetId
} from './embedTester'

function App() {
  const current = getCurrentWidgetId()
  const [value, setValue] = useState(current)
  const [embedTag, setEmbedTag] = useState(formatEmbedScriptTag(current))
  const history = useMemo(() => getHistory(), [current])

  // Keep the textarea in sync with the currently loaded widgetId.
  useEffect(() => {
    setEmbedTag(formatEmbedScriptTag(current))
    setValue(current)
  }, [current])

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
          <button onClick={() => setCurrentWidgetId('')}>Clear</button>
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
      </div>
      <p className="read-the-docs">Tip: you can also set it via URL: <code>?widgetId=...</code></p>
    </>
  )
}

export default App
