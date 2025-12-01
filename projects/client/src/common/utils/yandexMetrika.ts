import { useEffect } from 'react'

// Оригинальный код счётчика Яндекс.Метрики (ничего не выкидываем):
//
// <!-- Yandex.Metrika counter -->
// <script type="text/javascript">
// (function(m,e,t,r,i,k,a){
// m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
// m[i].l=1*new Date();
// for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
// k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
// })(window, document,'script','https://mc.yandex.ru/metrika/tag.js?id=105351889', 'ym');
// ym(105351889, 'init', {ssr:true, webvisor:true, clickmap:true, ecommerce:"dataLayer", accurateTrackBounce:true, trackLinks:true});
// </script>
// <noscript><div><img src="https://mc.yandex.ru/watch/105351889" style="position:absolute; left:-9999px;" alt="" /></div></noscript>
// <!-- /Yandex.Metrika counter -->

const YM_ID = 105351889

export default function YandexMetrika(): null {
  useEffect(() => {
    // не инициализируем счётчик в dev/test
    if (!import.meta.env.PROD) return
    ;(function (m: Window, e: Document, t: string, r: string, i: string) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mm = m as any
      mm[i] =
        mm[i] ||
        function (...args: unknown[]) {
          ;(mm[i].a = mm[i].a || []).push(args)
        }
      mm[i].l = 1 * new Date().getTime()
      for (let j = 0; j < e.scripts.length; j++) {
        if (e.scripts[j].src === r) {
          return
        }
      }
      const k = e.createElement(t) as HTMLScriptElement
      const a = e.getElementsByTagName(t)[0]
      k.async = true
      k.src = r
      a?.parentNode?.insertBefore(k, a)
    })(window, document, 'script', `https://mc.yandex.ru/metrika/tag.js?id=${YM_ID}`, 'ym')

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(window as any).ym(YM_ID, 'init', {
      ssr: true,
      webvisor: true,
      clickmap: true,
      ecommerce: 'dataLayer',
      accurateTrackBounce: true,
      trackLinks: true
    })

    // noscript fallback — максимально близко к оригиналу
    const noscriptEl = document.createElement('noscript')
    noscriptEl.innerHTML = `<div><img src="https://mc.yandex.ru/watch/${YM_ID}" style="position:absolute; left:-9999px;" alt="" /></div>`
    document.body.appendChild(noscriptEl)

    // cleanup при размонтировании (полезно для HMR/тестов)
    return () => {
      try {
        if (noscriptEl.parentNode) noscriptEl.parentNode.removeChild(noscriptEl)
      } catch {
        // ignore
      }
    }
  }, [])

  return null
}
