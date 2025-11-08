type BorderedContainerProps = {
  children?: React.ReactNode
  className?: string
  onClick?: () => void
}

const BorderedContainer = ({ children, className, onClick }: BorderedContainerProps) => {
  return (
    <div className={`flex rounded-md border border-[#E8E8E8] p-3 ${className}`} onClick={onClick}>
      {children}
    </div>
  )
}

export default BorderedContainer
