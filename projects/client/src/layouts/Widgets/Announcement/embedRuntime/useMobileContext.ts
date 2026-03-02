import { useContext } from 'react'
import { MobileContext } from './MobileContext'

export const useMobileContext = () => {
  const context = useContext(MobileContext)
  // if (context === undefined) {
  //   throw new Error('useMobileContext must be used within MobileProvider')
  // }
  return context
}
