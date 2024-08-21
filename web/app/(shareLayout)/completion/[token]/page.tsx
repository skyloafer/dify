import React from 'react'
import Main from '@/app/components/share/text-generation'
import { AiDeliveryProvider } from '@/context/ai-delivery-context'

const Completion = () => {
  return (
    <AiDeliveryProvider>
      <Main />
    </AiDeliveryProvider>
  )
}

export default React.memo(Completion)
