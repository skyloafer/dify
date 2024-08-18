import {
  useCallback,
  useEffect,
  useState,
} from 'react'
import { useTranslation } from 'react-i18next'
import { useChatWithHistoryContext } from '../context'
import List from './list'
import { init } from './waline.js'
import AppIcon from '@/app/components/base/app-icon'
import Button from '@/app/components/base/button'
import { Edit05 } from '@/app/components/base/icons/src/vender/line/general'
import type { ConversationItem } from '@/models/share'
import Confirm from '@/app/components/base/confirm'
import RenameModal from '@/app/components/base/chat/chat-with-history/sidebar/rename-modal'

// import { init } from 'https://unpkg.com/@waline/client@v3/dist/waline.js';

import './waline.css'

const Sidebar = () => {
  const { t } = useTranslation()
  const {
    appData,
    pinnedConversationList,
    conversationList,
    handleNewConversation,
    currentConversationId,
    handleChangeConversation,
    handlePinConversation,
    handleUnpinConversation,
    conversationRenaming,
    handleRenameConversation,
    handleDeleteConversation,
    isMobile,
  } = useChatWithHistoryContext()
  const [showConfirm, setShowConfirm] = useState<ConversationItem | null>(null)
  const [showRename, setShowRename] = useState<ConversationItem | null>(null)

  const handleOperate = useCallback((type: string, item: ConversationItem) => {
    if (type === 'pin')
      handlePinConversation(item.id)

    if (type === 'unpin')
      handleUnpinConversation(item.id)

    if (type === 'delete')
      setShowConfirm(item)

    if (type === 'rename')
      setShowRename(item)
  }, [handlePinConversation, handleUnpinConversation])
  const handleCancelConfirm = useCallback(() => {
    setShowConfirm(null)
  }, [])
  const handleDelete = useCallback(() => {
    if (showConfirm)
      handleDeleteConversation(showConfirm.id, { onSuccess: handleCancelConfirm })
  }, [showConfirm, handleDeleteConversation, handleCancelConfirm])
  const handleCancelRename = useCallback(() => {
    setShowRename(null)
  }, [])
  const handleRename = useCallback((newName: string) => {
    if (showRename)
      handleRenameConversation(showRename.id, newName, { onSuccess: handleCancelRename })
  }, [showRename, handleRenameConversation, handleCancelRename])

  // const { data: userProfileResponse } = useSWR({ url: '/account/profile', params: {} }, fetchUserProfile)

  // const updateUserProfileAndVersion = useCallback(async () => {
  //   if (userProfileResponse && !userProfileResponse.bodyUsed) {
  //     const result = await userProfileResponse.json()
  //     if (result) {
  //       init({
  //         el: '#waline',
  //         serverURL: 'https://wss.so/waline/',
  //         login: 'disable',
  //         meta: ['nick', 'mail'],
  //         userInfo: {
  //           email: result?.email,
  //           nick: result?.name
  //         },
  //         pageSize: 5,
  //       });
  //       // quoteComment({
  //       //   selector: ".wl-editor",
  //       //   content: 'test'
  //       // })
  //     }

  //   }
  // }, [userProfileResponse])

  const initProfile = useCallback(() => {
    const userProfile = localStorage.getItem('user_profile')
    if (userProfile) {
      const result = JSON.parse(userProfile)
      init({
        el: '#waline',
        serverURL: 'https://wss.so/waline/',
        login: 'disable',
        meta: ['nick', 'mail'],
        userInfo: {
          email: result?.email,
          nick: result?.name,
        },
        pageSize: 5,
      })
    }
  }, [])

  useEffect(() => {
    // const result = await userProfileResponse.json()
    // updateUserProfileAndVersion()
    // 下面这段代码用于初始化评论控件
    // initProfile();
  }, [])

  return (
    <div className='overflow-y-auto shrink-0 h-full flex flex-col w-[360px] border-r border-r-gray-100'>
      {
        !isMobile && (
          <div className='shrink-0 flex p-4'>
            <AppIcon
              className='mr-3'
              size='small'
              icon={appData?.site.icon}
              background={appData?.site.icon_background}
            />
            <div className='py-1 text-base font-semibold text-gray-800'>
              {appData?.site.title}
            </div>
          </div>
        )
      }
      <div className='shrink-0 p-4'>
        <Button
          variant='secondary-accent'
          className='justify-start w-full'
          onClick={handleNewConversation}
        >
          <Edit05 className='mr-2 w-4 h-4' />
          {t('share.chat.newChat')}
        </Button>
      </div>
      <div className='grow px-4 py-2 overflow-y-auto'>
        {/* 置顶记录 */}
        {
          !!pinnedConversationList.length && (
            <div className='mb-4'>
              <List
                isPin
                title={t('share.chat.pinnedTitle') || ''}
                list={pinnedConversationList}
                onChangeConversation={handleChangeConversation}
                onOperate={handleOperate}
                currentConversationId={currentConversationId}
              />
            </div>
          )
        }
        {/* 非置顶记录 */}
        {
          !!conversationList.length && (
            <List
              title={(pinnedConversationList.length && t('share.chat.unpinnedTitle')) || ''}
              list={conversationList}
              onChangeConversation={handleChangeConversation}
              onOperate={handleOperate}
              currentConversationId={currentConversationId}
            />
          )
        }
      </div>
      <div className='pb-4 text-xs'>
        <div id="waline">

        </div>
      </div>
      <div className='px-4 pb-4 text-xs text-gray-400'>
        © {appData?.site.copyright || appData?.site.title} {(new Date()).getFullYear()}
      </div>
      {!!showConfirm && (
        <Confirm
          title={t('share.chat.deleteConversation.title')}
          content={t('share.chat.deleteConversation.content') || ''}
          isShow
          onClose={handleCancelConfirm}
          onCancel={handleCancelConfirm}
          onConfirm={handleDelete}
        />
      )}
      {showRename && (
        <RenameModal
          isShow
          onClose={handleCancelRename}
          saveLoading={conversationRenaming}
          name={showRename?.name || ''}
          onSave={handleRename}
        />
      )}
    </div>
  )
}

export default Sidebar
