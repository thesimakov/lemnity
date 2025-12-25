type BorderedContainerProps = {
  children?: React.ReactNode
  className?: string
  onClick?: () => void
}

const BorderedContainer = ({ children, className, onClick }: BorderedContainerProps) => {
  return (
    <div className={`flex rounded-[14px] border border-[#E8E8E8] p-4.5 ${className}`} onClick={onClick}>
      {children}
    </div>
  )
}

export default BorderedContainer
