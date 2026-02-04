const FreePlanBrandingLink = ({ color = '#797979' }) => {
  return (
    <a
      href="https://lemnity.ru"
      target="_blank"
      className="hover:underline text-xs leading-3 self-center"
      style={{ color: color }}
    >
      Создано на Lemnity
    </a>
  )
}

export default FreePlanBrandingLink
