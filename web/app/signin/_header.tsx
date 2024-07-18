'use client'
import React from 'react'
import { useContext } from 'use-context-selector'
import Select from '@/app/components/base/select/locale'
import { languages } from '@/i18n/language'
import { type Locale } from '@/i18n'
import I18n from '@/context/i18n'
import LogoSite from '@/app/components/base/logo/logo-site'

const Header = () => {
  const { locale, setLocaleOnClient } = useContext(I18n)

  return <div className='flex items-center p-6 w-full'>
    <LogoSite />
    <span className='ml-4 text-[22px] font-semibold'>交付中心AI交付作业平台</span>
    {/* <Select
      value={locale}
      items={languages.filter(item => item.supported)}
      onChange={(value) => {
        setLocaleOnClient(value as Locale)
      }}
    /> */}

  </div>
}

export default Header
