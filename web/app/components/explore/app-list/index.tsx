'use client'

import cn from 'classnames'
import React, { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { useContext } from 'use-context-selector'
import { RiApps2Line } from '@remixicon/react'
import Toast from '../../base/toast'
import s from './style.module.css'
import ExploreContext from '@/context/explore-context'
import type { App } from '@/models/explore'
import Category from '@/app/components/explore/category'
import AppCard from '@/app/components/explore/app-card-new'
import { fetchInstalledAppList as doFetchInstalledAppList, fetchAppDetail } from '@/service/explore'
import {
  fetchAppDetail as fetchAppDetailByID,
  importApp,
} from '@/service/apps'
import { getPayUrl } from '@/service/common'

import { useTabSearchParams } from '@/hooks/use-tab-searchparams'
import CreateAppModal from '@/app/components/explore/create-app-modal'
import AppTypeSelector from '@/app/components/app/type-selector'
import type { CreateAppModalProps } from '@/app/components/explore/create-app-modal'
import Loading from '@/app/components/base/loading'
import { NEED_REFRESH_APP_LIST_KEY } from '@/config'
import { useAppContext } from '@/context/app-context'
import { getRedirection } from '@/utils/app-redirection'
import { DotsGrid } from '@/app/components/base/icons/src/vender/line/general'
import { Colors } from '@/app/components/base/icons/src/vender/line/others'
import { Route } from '@/app/components/base/icons/src/vender/line/mapsAndTravel'
import TabSliderNew from '@/app/components/base/tab-slider-new'

type AppsProps = {
  pageType?: PageType
  onSuccess?: () => void
}

export enum PageType {
  EXPLORE = 'explore',
  CREATE = 'create',
}

const Apps = ({
  pageType = PageType.EXPLORE,
  onSuccess,
}: AppsProps) => {
  const { t } = useTranslation()
  const { isCurrentWorkspaceEditor } = useAppContext()
  const { push } = useRouter()
  const { hasEditPermission } = useContext(ExploreContext)
  const allCategoriesEn = t('explore.apps.allCategories', { lng: 'en' })
  const { installedApps, setInstalledApps } = useContext(ExploreContext)
  const [currentType, setCurrentType] = useState<string>('')
  // const [currCategory, setCurrCategory] = useTabSearchParams({
  //   defaultTab: allCategoriesEn,
  //   disableSearchParams: pageType !== PageType.EXPLORE,
  // })
  const [activeTab, setActiveTab] = useTabSearchParams({
    defaultTab: 'all',
  })

  const options = [
    { value: 'all', text: t('app.types.all'), icon: <RiApps2Line className='w-[14px] h-[14px] mr-1' /> },
    { value: 'manager', text: '项目管理', icon: <Colors className='w-[14px] h-[14px] mr-1' /> },
    { value: 'demand', text: '需求管理', icon: <Route className='w-[14px] h-[14px] mr-1' /> },

    { value: 'develop', text: '设计开发', icon: <DotsGrid className='w-[14px] h-[14px] mr-1' /> },
    { value: 'test', text: '项目测试', icon: <Colors className='w-[14px] h-[14px] mr-1' /> },
    { value: 'DevOps', text: '项目运维', icon: <Route className='w-[14px] h-[14px] mr-1' /> },
  ]

  const categories: any = []
  const allList: Array<any> = []
  // const {
  //   data: { categories, allList },
  // } = useSWR(
  //   ['/explore/apps'],
  //   () =>
  //     fetchAppList().then(({ categories, recommended_apps }) => ({
  //       categories,
  //       allList: recommended_apps.sort((a, b) => a.position - b.position),
  //     })),
  //   {
  //     fallbackData: {
  //       categories: [],
  //       allList: [],
  //     },
  //   },
  // )

  const fetchInstalledAppList = async () => {
    // const { installed_apps }: any = await doFetchInstalledAppList()
    const data: any = await getPayUrl('/data/app-list.json')
    setInstalledApps(data)
  }

  const getAppDetail = async (appId: string) => {
    fetchAppDetailByID({ url: '/apps', id: appId }).then((res) => {
      const { app_base_url, access_token } = res.site
      let appMode = res.mode
      if (appMode === 'agent-chat'||appMode === 'advanced-chat') {
        appMode = 'chat'
      }
      const appUrl = `${app_base_url}/${appMode}/${access_token}`
      window.open(appUrl, '_blank')
    })
  }

  const changeTab = (tab: string) => {
    console.log(tab);
    setActiveTab(tab)
  }

  useEffect(() => {
    fetchInstalledAppList()
  }, [])

  const filteredList = useMemo(() => {
    if(activeTab==='all') return installedApps
    console.log(activeTab);
    return installedApps.filter(item => item.tag===activeTab)
  }, [allCategoriesEn, allList])

  const [currApp, setCurrApp] = React.useState<App | null>(null)
  const [isShowCreateModal, setIsShowCreateModal] = React.useState(false)
  const onCreate: CreateAppModalProps['onConfirm'] = async ({
    name,
    icon,
    icon_background,
    description,
  }) => {
    const { export_data } = await fetchAppDetail(
      currApp?.app.id as string,
    )
    try {
      const app = await importApp({
        data: export_data,
        name,
        icon,
        icon_background,
        description,
      })
      setIsShowCreateModal(false)
      Toast.notify({
        type: 'success',
        message: t('app.newApp.appCreated'),
      })
      if (onSuccess)
        onSuccess()
      localStorage.setItem(NEED_REFRESH_APP_LIST_KEY, '1')
      getRedirection(isCurrentWorkspaceEditor, app, push)
    }
    catch (e) {
      Toast.notify({ type: 'error', message: t('app.newApp.appCreateFailed') })
    }
  }

  if (!categories) {
    return (
      <div className="flex h-full items-center">
        <Loading type="area" />
      </div>
    )
  }

  return (
    <div className={cn(
      'flex flex-col',
      pageType === PageType.EXPLORE ? 'h-full border-l border-gray-200' : 'h-[calc(100%-56px)]',
    )}>
      {pageType === PageType.EXPLORE && (
        <div className='shrink-0 pt-6 px-12 h248' >
          {/* <div className={`mb-1 ${s.textGradient} text-xl font-semibold`}>{t('explore.apps.title')}</div>
          <div className='text-gray-500 text-sm'>{t('explore.apps.description')}</div> */}
        </div>
      )}
      {pageType === PageType.EXPLORE && (
        <div className='positionRE' >
          <div className='box-tab'>
            <TabSliderNew
              value={activeTab}
              onChange={changeTab}
              options={options}
            />
          </div>
          <div className='box-shadow-tw'></div>
        </div>
      )}
      {/* <div className={cn(
        'flex items-center mt-6',
        pageType === PageType.EXPLORE ? 'px-12' : 'px-8',
      )}>
        {pageType !== PageType.EXPLORE && (
          <>
            <AppTypeSelector value={currentType} onChange={setCurrentType} />
            <div className='mx-2 w-[1px] h-3.5 bg-gray-200'/>
          </>
        )}
        <Category
          list={categories}
          value={currCategory}
          onChange={setCurrCategory}
          allCategoriesEn={allCategoriesEn}
        />
      </div> */}
      <div className={cn(
        'relative flex flex-1 pb-6 flex-col overflow-auto shrink-0 grow',
        pageType === PageType.EXPLORE ? 'mt-6' : 'mt-0 pt-2',
      )}>
        <nav
          className={cn(
            s.appList,
            'grid content-start shrink-0',
            pageType === PageType.EXPLORE ? 'gap-6 px-6 sm:px-12' : 'gap-3 px-8  sm:!grid-cols-2 md:!grid-cols-3 lg:!grid-cols-4',
          )}>
          {filteredList.map(app => (
            <AppCard
              key={app?.id}
              isExplore={pageType === PageType.EXPLORE}
              app={app}
              canCreate={hasEditPermission}
              onCreate={() => {
                setCurrApp(app)
                setIsShowCreateModal(true)
              }}
              onExplore={() => {
                // if (!hasEditPermission){}
                if(app.app.url){
                  window.open(app.app.url, '_blank')
                }else{
                  getAppDetail(app.app.id)
                }
              }
              }
            />
          ))}
        </nav>
      </div>
      {isShowCreateModal && (
        <CreateAppModal
          appIcon={currApp?.app.icon || ''}
          appIconBackground={currApp?.app.icon_background || ''}
          appName={currApp?.app.name || ''}
          appDescription={currApp?.app.description || ''}
          show={isShowCreateModal}
          onConfirm={onCreate}
          onHide={() => setIsShowCreateModal(false)}
        />
      )}
    </div>
  )
}

export default React.memo(Apps)
