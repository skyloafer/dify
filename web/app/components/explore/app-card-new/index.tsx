'use client'
import cn from 'classnames'
import { useTranslation } from 'react-i18next'
import { PlusIcon } from '@heroicons/react/20/solid'
import Button from '../../base/button'
import type { App } from '@/models/explore'
import AppIcon from '@/app/components/base/app-icon'
import { AiText, ChatBot, CuteRobote } from '@/app/components/base/icons/src/vender/solid/communication'
import { Route } from '@/app/components/base/icons/src/vender/solid/mapsAndTravel'
export type AppCardProps = {
  app: App
  canCreate: boolean
  onCreate: () => void
  isExplore: boolean
  onExplore: () => void
}

const AppCard = ({
  app,
  canCreate,
  onCreate,
  isExplore,
  onExplore,
}: AppCardProps) => {
  const { t } = useTranslation()
  const { app: appBasicInfo } = app
  return (
    <div onClick={() => { onExplore() }} className={cn('group flex col-span-1 bg-white border-2 border-solid border-transparent rounded-lg shadow-md min-h-[160px] flex flex-col transition-all duration-200 ease-in-out cursor-pointer hover:shadow-lg')}>
      <div className='flex pt-[14px] px-[14px] pb-3 h-[66px] items-center gap-3 grow-0 shrink-0 h100'>
        <div className='relative shrink-0'>
          {/* <AppIcon pageType={isExplore} size='large' icon={app.app.icon} background={app.app.icon_background} /> */}
          
          {isExplore?(<img src={app.app.icon} style={{width: 100, height:100}} />):(<AppIcon size='large' icon={app.app.icon} background={app.app.icon_background} />)}
          {/* <span className='absolute bottom-[-3px] right-[-3px] w-4 h-4 p-0.5 bg-white rounded border-[0.5px] border-[rgba(0,0,0,0.02)] shadow-sm'>
            {appBasicInfo.mode === 'advanced-chat' && (
              <ChatBot className='w-3 h-3 text-[#1570EF]' />
            )}
            {appBasicInfo.mode === 'agent-chat' && (
              <CuteRobote className='w-3 h-3 text-indigo-600' />
            )}
            {appBasicInfo.mode === 'chat' && (
              <ChatBot className='w-3 h-3 text-[#1570EF]' />
            )}
            {appBasicInfo.mode === 'completion' && (
              <AiText className='w-3 h-3 text-[#0E9384]' />
            )}
            {appBasicInfo.mode === 'workflow' && (
              <Route className='w-3 h-3 text-[#f79009]' />
            )}
          </span> */}
        </div>
        <div className='grow w-0 py-[1px] h78'>
          <div className='flex items-center text-[16px] marg-b12 leading-5 font-semibold text-gray-800'>
            <div className='truncate' title={appBasicInfo.name}>{appBasicInfo.name}</div>
          </div>
          <div className='flex items-center text-[10px] leading-[18px] text-gray-500 font-medium'>
            <div className='mb-1 text-xs leading-normal text-gray-500 line-clamp-3'>{appBasicInfo.description}</div>
            {/* {appBasicInfo.mode === 'advanced-chat' && <div className='truncate'>{t('app.types.chatbot').toUpperCase()}</div>}
            {appBasicInfo.mode === 'chat' && <div className='truncate'>{t('app.types.chatbot').toUpperCase()}</div>}
            {appBasicInfo.mode === 'agent-chat' && <div className='truncate'>{t('app.types.agent').toUpperCase()}</div>}
            {appBasicInfo.mode === 'workflow' && <div className='truncate'>{t('app.types.workflow').toUpperCase()}</div>}
            {appBasicInfo.mode === 'completion' && <div className='truncate'>{t('app.types.completion').toUpperCase()}</div>} */}
          </div>
        </div>
      </div>
      {/* <div className='mb-1 px-[14px] text-xs leading-normal text-gray-500 line-clamp-4 group-hover:line-clamp-2 group-hover:h-9'>{app.description}</div> */}
      {/* {isExplore && canCreate && (
        <div className={cn('hidden items-center flex-wrap min-h-[42px] px-[14px] pt-2 pb-[10px] group-hover:flex')}>
          <div className={cn('flex items-center w-full space-x-2')}>
            <Button variant='primary' className='grow h-7' onClick={() => onCreate()}>
              <PlusIcon className='w-4 h-4 mr-1' />
              <span className='text-xs'>{t('explore.appCard.addToWorkspace')}</span>
            </Button>
          </div>
        </div>
      ) */}
      {/* {!isExplore && (
        <div className={cn('hidden items-center flex-wrap min-h-[42px] px-[14px] pt-2 pb-[10px] group-hover:flex')}>
          <div className={cn('flex items-center w-full space-x-2')}>
            <Button variant='primary' className='grow h-7' onClick={() => onCreate()}>
              <PlusIcon className='w-4 h-4 mr-1' />
              <span className='text-xs'>{t('app.newApp.useTemplate')}</span>
            </Button>
          </div>
        </div>
      )} */}
    </div>
  )
}

export default AppCard
