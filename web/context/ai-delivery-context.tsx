'use client'

import { createContext, useContext } from 'use-context-selector'

export type AiDeliveryContextValue = {
  isIframe: boolean
}

const AiDeliveryContext = createContext<AiDeliveryContextValue>({
  isIframe: false,
})

type IAiDeliveryProviderProps = {
  children: React.ReactNode
}

export const AiDeliveryProvider = ({ children }: IAiDeliveryProviderProps) => {
  const currentIsIframe = window.top !== window
  return (
    <AiDeliveryContext.Provider value={{
      isIframe: currentIsIframe,
    }}>{children}</AiDeliveryContext.Provider>
  )
}

export const useAiDeliveryContext = () => useContext(AiDeliveryContext)

export default AiDeliveryContext
