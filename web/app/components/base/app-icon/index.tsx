'use client'

import type { FC } from 'react'
import { init } from 'emoji-mart'
import data from '@emoji-mart/data'
import style from './style.module.css'
import classNames from '@/utils/classnames'
import type { AppIconType } from '@/types/app'

init({ data })

export type AppIconProps = {
  size?: 'xs' | 'tiny' | 'small' | 'medium' | 'large'
  rounded?: boolean
  iconType?: AppIconType | null
  icon?: string
  background?: string | null
  imageUrl?: string | null
  className?: string
  pageType?: boolean
  innerIcon?: React.ReactNode
  onClick?: () => void
}

const AppIcon: FC<AppIconProps> = ({
  size = 'medium',
  rounded = false,
  iconType,
  icon,
  background,
  imageUrl,
  className,
  innerIcon,
  pageType,
  onClick,
}) => {
  return (
    <span
      className={classNames(
        style.appIcon,
        size !== 'medium' && style[size],
        rounded && style.rounded,
        className ?? '',
      )}
      style={pageType ? {
        background,
        width: 100,
        height: 100,
      } :{
        background
      }}
      onClick={onClick}
    >
      {innerIcon || ((icon && icon !== '') ? <em-emoji id={icon} /> : <em-emoji id='🤖' />)}
    </span>
  )

  const isValidImageIcon = iconType === 'image' && imageUrl

  return <span
    className={wrapperClassName}
    style={{ background: isValidImageIcon ? undefined : (background || '#FFEAD5') }}
    onClick={onClick}
  >
    {isValidImageIcon
      ? <img src={imageUrl} className="w-full h-full" alt="app icon" />
      : (innerIcon || ((icon && icon !== '') ? <em-emoji id={icon} /> : <em-emoji id='🤖' />))
    }
  </span>
}

export default AppIcon
