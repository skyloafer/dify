'use client'

import { createContext, useContext } from 'use-context-selector'
import HeaderWrapper from '@/app/components/header/header-wrapper'
import Header from '@/app/components/header'

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
  if(!currentIsIframe) {
    return (
      <AiDeliveryContext.Provider value={{
        isIframe: currentIsIframe,
      }}>
        <HeaderWrapper>
          <Header />
        </HeaderWrapper>
        {children}
      </AiDeliveryContext.Provider>
    )
  }
  else {
    return (
      <AiDeliveryContext.Provider value={{
        isIframe: currentIsIframe,
      }}>{children}</AiDeliveryContext.Provider>
    )
  }
}

export const useAiDeliveryContext = () => useContext(AiDeliveryContext)

export default AiDeliveryContext
