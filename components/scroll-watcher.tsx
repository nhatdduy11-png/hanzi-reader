'use client'

import { useEffect } from 'react'

const DELTA = 8
const HIDE_AFTER = 96
const SCROLLED_AFTER = 48

/**
 * Mirrors scroll state onto <html> as data attributes so sticky bars can collapse
 * with pure CSS. No React state is touched, so scrolling never triggers re-renders.
 */
export function ScrollWatcher() {
  useEffect(() => {
    const root = document.documentElement
    let lastY = window.scrollY
    let ticking = false

    const set = (name: string, value: string) => {
      if (root.getAttribute(name) !== value) root.setAttribute(name, value)
    }

    const update = () => {
      ticking = false
      const y = Math.max(0, window.scrollY)
      set('data-scrolled', y > SCROLLED_AFTER ? 'true' : 'false')
      if (y < HIDE_AFTER) {
        set('data-scroll', 'up')
      } else if (y - lastY > DELTA) {
        set('data-scroll', 'down')
      } else if (lastY - y > DELTA) {
        set('data-scroll', 'up')
      }
      if (Math.abs(y - lastY) > DELTA) lastY = y
    }

    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return null
}
