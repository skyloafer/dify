/**
 * 获取是否加载至iframe种
 */
export const getIsIframe = (): Boolean => {
  if (typeof window === 'undefined')
    return false
  return window.top !== window
}
