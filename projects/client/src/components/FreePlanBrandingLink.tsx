const FreePlanBrandingLink = ({ color = '#797979' }) => {
  return (
    <a
      href="https://lemnity.ru"
      target="_blank"
      className="hover:underline text-[12px] leading-3 h-3"
      style={{ color: color }}
    >
      Создано на Lemnity
    </a>
  )
}

export default FreePlanBrandingLink
