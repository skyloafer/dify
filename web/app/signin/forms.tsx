'use client'
import React from 'react'
import { useSearchParams } from 'next/navigation'

import cn from 'classnames'
import NormalForm from './normalForm'
import OneMoreStep from './oneMoreStep'
import style from './forms.module.css'

const Forms = () => {
  const searchParams = useSearchParams()
  const step = searchParams.get('step')

  const getForm = () => {
    switch (step) {
      case 'next':
        return <OneMoreStep />
      default:
        return <NormalForm />
    }
  }
  return <div className={
    cn(
      style.fromContainer,
      'flex flex-col items-center grow justify-center bg-white shadow rounded-2xl',
      'my-20',
      'md:px-[60px]',
    )
  }>
    <div className='flex flex-col md:w-[400px]'>
      {getForm()}
    </div>
  </div>
}

export default Forms
