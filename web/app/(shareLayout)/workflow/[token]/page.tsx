import React from 'react'

import Main from '@/app/components/share/text-generation'
import { AiDeliveryProvider } from '@/context/ai-delivery-context'

const Workflow = () => {
  return (
    <AiDeliveryProvider>
      <Main isWorkflow />
    </AiDeliveryProvider>
  )
}

export default React.memo(Workflow)
