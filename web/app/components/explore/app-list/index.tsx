'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useContext } from 'use-context-selector'
import s from './style.module.css'
import cn from '@/utils/classnames'
import ExploreContext from '@/context/explore-context'
import type { App } from '@/models/explore'
import AppCard from '@/app/components/explore/app-card-new'
import { fetchAppDetail } from '@/service/explore'
import { useTabSearchParams } from '@/hooks/use-tab-searchparams'
import CreateAppModal from '@/app/components/explore/create-app-modal'
import type { CreateAppModalProps } from '@/app/components/explore/create-app-modal'
import Loading from '@/app/components/base/loading'
import { RiApps2Line } from '@remixicon/react'
import { DotsGrid } from '@/app/components/base/icons/src/vender/line/general'
import { Colors } from '@/app/components/base/icons/src/vender/line/others'
import { Route } from '@/app/components/base/icons/src/vender/line/mapsAndTravel'
import {
  DSLImportMode,
} from '@/models/app'
import { useImportDSL } from '@/hooks/use-import-dsl'
import DSLConfirmModal from '@/app/components/app/create-from-dsl-modal/dsl-confirm-modal'
import TabSliderNew from '@/app/components/base/tab-slider-new'
import {
  fetchAppDetail as fetchAppDetailByID,
} from '@/service/apps'

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
  const { hasEditPermission } = useContext(ExploreContext)
  // 2025.09.11新增
  const { installedApps, setInstalledApps } = useContext(ExploreContext)
  const [activeTab, setActiveTab] = useTabSearchParams({
    defaultTab: 'all',
  })
  const categories = [
    { value: 'all', text: t('app.types.all'), icon: <RiApps2Line className='mr-1 h-[14px] w-[14px]' /> },
    { value: 'manager', text: '项目管理', icon: <Colors className='mr-1 h-[14px] w-[14px]' /> },
    { value: 'demand', text: '需求管理', icon: <Route className='mr-1 h-[14px] w-[14px]' /> },

    { value: 'develop', text: '设计开发', icon: <DotsGrid className='mr-1 h-[14px] w-[14px]' /> },
    { value: 'test', text: '项目测试', icon: <Colors className='mr-1 h-[14px] w-[14px]' /> },
    { value: 'DevOps', text: '项目运维', icon: <Route className='mr-1 h-[14px] w-[14px]' /> },
  ]
  // 2025.09.11新增
  const fetchInstalledAppList = async () => {
    // const { installed_apps }: any = await doFetchInstalledAppList()
    // const data: any = await getPayUrl('/data/app-list.json')
    const data: any = [{
      id: '56b79405-3788-45c1-97eb-cc04460f635c',
      app: {
        id: '99401274-028e-428c-b4ed-b44bce4c21d6',
        name: '交付条款风险智能识别',
        mode: 'chat',
        icon: '/icon/1.png',
        icon_background: '#FFEAD5',
        description: '基于公司自有风险库和AI通用风险能力识别合同中可能的风险，并给出合适建议。',
      },
      app_owner_tenant_id: '2034c95f-cda8-4f73-8877-57d6cbbae1b1',
      is_pinned: true,
      last_used_at: 1721096278,
      editable: true,
      uninstallable: true,
      tag: 'manager',
    },
    {
      id: '56b79405-3788-45c1-97eb-cc04460f6c53',
      app: {
        id: '99401274-028e-428c-b4ed-b44bce4c6des',
        name: 'DRX材料智能自审',
        mode: 'chat',
        icon: '/icon/2.png',
        icon_background: '#FFEAD5',
        url: 'https://kimi.moonshot.cn/',
        description: '通过AI基于checklist关键词内容进行PPT文稿材料的解析、审核与优化建议。',
      },
      app_owner_tenant_id: '2034c95f-cda8-4f73-8877-57d6cbbae1b1',
      is_pinned: true,
      last_used_at: 1721096278,
      editable: true,
      uninstallable: true,
      tag: 'manager',
    },
    {
      id: 'b6085240-8012-47f9-bc2f-5518ed3bc60e',
      app: {
        id: 'ad1ff6b7-888d-4356-9a22-efc7d70137ca',
        name: '智汇需规生成器',
        mode: 'chat',
        icon: '/icon/3.png',
        icon_background: '#FFEAD5',
        description: '内置需规模板与生成规则，输入生成需求说明，利用AI多轮对话能力智能生成需求规格说明书内容。',
      },
      app_owner_tenant_id: '2034c95f-cda8-4f73-8877-57d6cbbae1b1',
      is_pinned: true,
      last_used_at: 1721096278,
      editable: true,
      uninstallable: true,
      tag: 'demand',
    },
    {
      id: 'b6085240-8012-47f9-bc2f-5518ed3bce60',
      app: {
        id: 'ad1ff6b7-888d-4356-9a22-efc7d701csaw',
        name: '数据库物理模型设计助手',
        mode: 'chat',
        icon: '/icon/4.png',
        icon_background: '#FFEAD5',
        url: 'https://tongyi.aliyun.com/qianwen/',
        description: '利用AI能力对需求规格说明书进行分析提取关键信息，完成初步数据库表结构设计。',
      },
      app_owner_tenant_id: '2034c95f-cda8-4f73-8877-57d6cbbae1b1',
      is_pinned: true,
      last_used_at: 1721096278,
      editable: true,
      uninstallable: true,
      tag: 'develop',
    },
    {
      id: 'ea028186-e46f-4a7d-8c4f-1d65ea1822be',
      app: {
        id: '7787ad6d-4a9b-4e73-b3ea-6575c40665ef',
        name: 'SQL开发与优化助手',
        mode: 'chat',
        icon: '/icon/5.png',
        icon_background: '#FFEAD5',
        description: '①SQL开发：自然语言转SQL ②SQL解析：SQL转自然语言 ③SQL转换：异构库间非标SQL兼容转换 ④SQL优化：对存在性能问题的慢SQL给出优化建议。',
      },
      app_owner_tenant_id: '2034c95f-cda8-4f73-8877-57d6cbbae1b1',
      is_pinned: true,
      last_used_at: 1721096278,
      editable: true,
      uninstallable: true,
      tag: 'develop',
    },
    {
      id: '11b5d182-ae89-466a-a9c0-532d208b9273',
      app: {
        id: '4f6ce6ad-0aac-4826-a9b2-24b629012c42',
        name: '单元测试生成助手',
        mode: 'workflow',
        icon: '/icon/6.png',
        icon_background: '#FFEAD5',
        description: '对代码进行分析并生成单元测试代码。',
      },
      app_owner_tenant_id: '2034c95f-cda8-4f73-8877-57d6cbbae1b1',
      is_pinned: true,
      last_used_at: 1721096278,
      editable: true,
      uninstallable: true,
      tag: 'develop',
    },
    {
      id: '97436837-fb5e-4369-bd27-e86596ca1453',
      app: {
        id: '5b320472-4b71-4176-9a0b-17395f499b57',
        name: '代码审查助手',
        mode: 'chat',
        icon: '/icon/7.png',
        icon_background: '#FFEAD5',
        description: '对代码进行分析并指出代码中可能存在的问题并给出优化建议 ，可以基于知识库定义自己的代码规范。',
      },
      app_owner_tenant_id: '2034c95f-cda8-4f73-8877-57d6cbbae1b1',
      is_pinned: true,
      last_used_at: 1721096278,
      editable: true,
      uninstallable: true,
      tag: 'develop',
    },
    {
      id: '3447382b-7e8f-43e0-91db-abccd7297378',
      app: {
        id: '10a2b823-95d3-4d16-8ab0-569c52595f41',
        name: '测试用例AI生成器',
        mode: 'chat',
        icon: '/icon/8.png',
        icon_background: '#FFEAD5',
        description: '利用DIFY平台的API功能，通过python脚本，对需求文档进行解析并生成测试用例与对应的测试用例大纲，大纲用于评审，用例用于执行与统计。',
      },
      app_owner_tenant_id: '2034c95f-cda8-4f73-8877-57d6cbbae1b1',
      is_pinned: true,
      last_used_at: 1721096278,
      editable: true,
      uninstallable: true,
      tag: 'test',
    },
    {
      id: '4d5c21df-d62e-4b13-b6a8-88a44cb0f2d9',
      app: {
        id: 'c5433cdd-2e11-44e1-9139-1b539f289d2f',
        name: '运维知识问答',
        mode: 'chat',
        icon: '/icon/9.png',
        icon_background: '#FFEAD5',
        description: '通过梳理系统的各类业务问题和业务逻辑以及操作流程等，通过大模型实现知识的一问一答。',
      },
      app_owner_tenant_id: '2034c95f-cda8-4f73-8877-57d6cbbae1b1',
      is_pinned: true,
      last_used_at: 1721096278,
      editable: true,
      uninstallable: true,
      tag: 'DevOps',
    }]
    setInstalledApps(data)
  }
  useEffect(() => {
    fetchInstalledAppList()
  }, [])

  const changeTab = (tab: string) => {
    console.log(tab)
    setActiveTab(tab)
  }
  const filteredList = useMemo(() => {
    if(activeTab === 'all') return installedApps
    return installedApps.filter((item: any) => item.tag === activeTab)
  }, [activeTab, installedApps])

  const getAppDetail = async (appId: string) => {
    const app: any = await fetchAppDetailByID({ url: '/apps', id: appId })
    const { app_base_url, access_token } = app.site
    let appMode = app.mode
    if (appMode === 'agent-chat' || appMode === 'advanced-chat')
      appMode = 'chat'

    const appUrl = `${app_base_url}/${appMode}/${access_token}`
    window.open(appUrl, '_blank')
  }

  const [currApp, setCurrApp] = React.useState<App | null>(null)
  const [isShowCreateModal, setIsShowCreateModal] = React.useState(false)

  const {
    handleImportDSL,
    handleImportDSLConfirm,
    versions,
    isFetching,
  } = useImportDSL()
  const [showDSLConfirmModal, setShowDSLConfirmModal] = useState(false)
  const onCreate: CreateAppModalProps['onConfirm'] = async ({
    name,
    icon_type,
    icon,
    icon_background,
    description,
  }) => {
    const { export_data } = await fetchAppDetail(
      currApp?.app.id as string,
    )
    const payload = {
      mode: DSLImportMode.YAML_CONTENT,
      yaml_content: export_data,
      name,
      icon_type,
      icon,
      icon_background,
      description,
    }
    await handleImportDSL(payload, {
      onSuccess: () => {
        setIsShowCreateModal(false)
      },
      onPending: () => {
        setShowDSLConfirmModal(true)
      },
    })
  }

  const onConfirmDSL = useCallback(async () => {
    await handleImportDSLConfirm({
      onSuccess,
    })
  }, [handleImportDSLConfirm, onSuccess])

  if (!categories || categories.length === 0) {
    return (
      <div className="flex h-full items-center">
        <Loading type="area" />
      </div>
    )
  }

  return (
    <div className={cn(
      'flex h-full flex-col border-l-[0.5px] border-divider-regular',
    )}>

      {/* <div className='shrink-0 px-12 pt-6'>
        <div className={`mb-1 ${s.textGradient} text-xl font-semibold`}>{t('explore.apps.title')}</div>
        <div className='text-sm text-text-tertiary'>{t('explore.apps.description')}</div>
      </div> */}
      {pageType === PageType.EXPLORE && (
        <div className={cn(s.h248, 'shrink-0 px-12 pt-6')} >
          {/* <div className={`mb-1 ${s.textGradient} text-xl font-semibold`}>{t('explore.apps.title')}</div>
          <div className='text-gray-500 text-sm'>{t('explore.apps.description')}</div> */}
        </div>
      )}
      {pageType === PageType.EXPLORE && (
        <div className={cn(s.positionRE)} >
          <div className={cn(s.boxTab)}>
            <TabSliderNew
              value={activeTab}
              onChange={changeTab}
              options={categories}
            />
          </div>
          <div className={cn(s.boxShadowTw)}></div>
        </div>
      )}

      <div className={cn(
        'relative flex flex-1 shrink-0 grow flex-col overflow-auto pb-6',
        pageType === PageType.EXPLORE ? 'mt-6' : 'mt-0 pt-2',
      )}>
        <nav
          className={cn(
            s.appList,
            'grid shrink-0 content-start',
            pageType === PageType.EXPLORE ? 'gap-6 px-6 sm:px-12' : 'gap-3 px-8  sm:!grid-cols-2 md:!grid-cols-3 lg:!grid-cols-4',
          )}>
          {filteredList.map((app: any) => (
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
                if(app.app.url)
                  window.open(app.app.url, '_blank')

                else
                  getAppDetail(app.app.id)
              }
              }
            />
          ))}
        </nav>
      </div>
      {isShowCreateModal && (
        <CreateAppModal
          appIconType={currApp?.app.icon_type || 'emoji'}
          appIcon={currApp?.app.icon || ''}
          appIconBackground={currApp?.app.icon_background || ''}
          appIconUrl={currApp?.app.icon_url}
          appName={currApp?.app.name || ''}
          appDescription={currApp?.app.description || ''}
          show={isShowCreateModal}
          onConfirm={onCreate}
          confirmDisabled={isFetching}
          onHide={() => setIsShowCreateModal(false)}
        />
      )}
      {
        showDSLConfirmModal && (
          <DSLConfirmModal
            versions={versions}
            onCancel={() => setShowDSLConfirmModal(false)}
            onConfirm={onConfirmDSL}
            confirmDisabled={isFetching}
          />
        )
      }
    </div>
  )
}

export default React.memo(Apps)
