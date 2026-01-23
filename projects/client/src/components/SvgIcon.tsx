import { useQuery } from '@tanstack/react-query'

export interface SvgIconProps {
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
  const { data: processedSvg } = useQuery({
    queryKey: ['svg', src, preserveOriginalColors],
    queryFn: async () => {
      const response = await fetch(src)
      const text = await response.text()

      const parser = new DOMParser()
      const svgDoc = parser.parseFromString(text, 'image/svg+xml')
      const svgElement = svgDoc.querySelector('svg')

      if (!svgElement) {
        throw new Error('Invalid SVG')
      }

      svgElement.querySelectorAll('script, object, embed, iframe').forEach(el => el.remove())

      svgElement.querySelectorAll('*').forEach(el => {
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

      return svgElement.outerHTML
    },
    staleTime: Infinity,
    gcTime: Infinity
  })

  return (
    <div
      className={`w-full h-full flex items-center justify-center ${className} select-none`}
      style={{ width: size, height: size }}
      role="img"
      aria-label={alt}
      dangerouslySetInnerHTML={processedSvg ? { __html: processedSvg } : undefined}
    />
  )
}

export default SvgIcon
