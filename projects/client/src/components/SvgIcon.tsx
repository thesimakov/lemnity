// import React, { useEffect } from 'react'
// import DOMPurify from 'dompurify'
// import { cn } from '@heroui/theme'

// interface SvgIconProps {
//   src: string
//   className?: string
//   size?: number | string
//   alt?: string
//   preserveOriginalColors?: boolean
// }

// const SvgIcon: React.FC<SvgIconProps> = ({
//   src,
//   className = '',
//   size = '100%',
//   alt = 'icon',
//   preserveOriginalColors = false
// }) => {
//   const containerRef = React.useRef<HTMLDivElement>(null)

//   useEffect(() => {
//     if (!containerRef.current) return

//     fetch(src)
//       .then(res => res.text())
//       .then(text => {
//         const purifier = DOMPurify()

//         purifier.addHook('afterSanitizeElements', (node) => {
//           if (node instanceof Element && !preserveOriginalColors) {
//             const fillValue = node.getAttribute('fill')
//             if (fillValue) {
//               node.setAttribute('fill', 'currentColor')
//             }
//           }
//         })

//         const sanitizedSvgString = purifier.sanitize(text, {
//           USE_PROFILES: { svg: true, svgFilters: true },
//           // ADD_ATTR: ['xlink:href'],
//         })

//         console.log(purifier.removed)

//         if (!containerRef.current) return

//         containerRef.current.innerHTML = sanitizedSvgString
//         const svgElement = containerRef.current.querySelector('svg')

//         if (svgElement) {
//           svgElement.setAttribute('width', size.toString())
//           svgElement.setAttribute('height', size.toString())
//         }
//       })
//   }, [src])

//   return (
//     <div
//       ref={containerRef}
//       className={cn(
//         'w-full h-full flex items-center justify-center select-none',
//         className,
//       )}
//       role="img"
//       aria-label={alt}
//     />
//   )
// }

// export default SvgIcon

import React from 'react'

interface SvgIconProps {
  src: string
  className?: string
  size?: number | string
  alt?: string
  preserveOriginalColors?: boolean
}

const SvgIcon: React.FC<SvgIconProps> = ({
  src,
  className = '',
  size = '100%',
  alt = 'icon',
  preserveOriginalColors = false
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (!containerRef.current) return

    fetch(src)
      .then(res => res.text())
      .then(text => {
        const parser = new DOMParser()
        const svgDoc = parser.parseFromString(text, 'image/svg+xml')
        const svgElement = svgDoc.querySelector('svg')

        if (svgElement) {
          // Удаляем потенциально опасные элементы и атрибуты
          const dangerousElements = svgElement.querySelectorAll('script, object, embed, iframe')
          dangerousElements.forEach(el => el.remove())

          const allElements = svgElement.querySelectorAll('*')

          allElements.forEach(el => {
            // Удаляем event handlers
            const attributes = [...el.attributes]
            attributes.forEach(attr => {
              const attrValue = attr.value ?? ''
              const isHrefAttr = attr.name === 'href' || attr.name === 'xlink:href'
              const isInternalRef = isHrefAttr && attrValue.startsWith('#')
              const isDataUri = isHrefAttr && attrValue.startsWith('data:')
              const keepsDataUri = isDataUri && preserveOriginalColors

              const shouldStripHref = isHrefAttr && !isInternalRef && !keepsDataUri

              if (attr.name.startsWith('on') || shouldStripHref) {
                el.removeAttribute(attr.name)
              }
            })

            if (!preserveOriginalColors && el.hasAttribute('fill')) {
              const fillValue = el.getAttribute('fill')
              // Сохраняем градиенты (url(...))
              if (!fillValue || !fillValue.startsWith('url(')) {
                el.setAttribute('fill', 'currentColor')
              }
            }
          })

          svgElement.setAttribute('width', size.toString())
          svgElement.setAttribute('height', size.toString())

          // Очищаем контейнер и добавляем SVG
          containerRef.current!.innerHTML = ''
          containerRef.current!.appendChild(svgElement)
        }
      })
  }, [src, size, preserveOriginalColors])

  return (
    <div
      ref={containerRef}
      className={`w-full h-full flex items-center justify-center ${className} select-none`}
      role="img"
      aria-label={alt}
    />
  )
}

export default SvgIcon
