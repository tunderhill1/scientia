import { Fragment, ReactNode, useRef, useState } from 'react'

import { DragDropOptions, addDroppable } from '../lib/dragDrop.service'
import { Hr } from '../styles/_app.style'
import { Tab, TabsHighlight, TabsWrapper } from '../styles/tabs.style'

/**
 * NOTE: The following code was heavily inspired by Emil Kowalski's blog on tabs and the accompanying code sandbox:
 * https://emilkowal.ski/ui/tabs
 */

export enum Alignment {
  Vertical,
  Horizontal,
  Mixed /* TODO: Add support for this (not priority) */,
}

/**
 * TODO: Stress test this component to see how many tabs it can handle.
 * Identify performance improvements if required
 * NOTE: The attribute string describes the name of the property in data that uniquely identifies each entry.
 */
export const Tabs = ({
  data,
  generator,
  alignment = Alignment.Vertical,
  attribute = 'title',
  animate = false,
  href = (_: any) => '#',
  target = '_self',
  dragDropOptions = null,
  dividers = false,
}: {
  data: any
  generator: (_: any) => ReactNode
  alignment?: Alignment
  attribute?: string
  animate?: boolean
  href?: (tab: any) => string
  target?: string
  dragDropOptions?: DragDropOptions | null
  dividers?: boolean
}) => {
  const [tabBoundingBox, setTabBoundingBox] = useState<any>(null)
  const [wrapperBoundingBox, setWrapperBoundingBox] = useState<any>(null)
  const [highlightedTab, setHighlightedTab] = useState(null)
  const [isHoveredFromNull, setIsHoveredFromNull] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)

  /* NOTE: The prefix is a random string used to help uniquely identify a tab */
  const prefixRef = useRef(Math.random().toString(36).slice(2))
  const highlightRef = useRef(null)
  const wrapperRef = useRef<HTMLDivElement>(null)

  const highlightStyles: any = {}
  /* TODO: Add support for user-provided styling overrides */
  const wrapperStyles: any = (() => {
    switch (alignment) {
      case Alignment.Vertical:
        return { flexDirection: 'column' }
      default:
        return {} /* NOTE: No styling overrides for other orientations */
    }
  })()

  const resetHighlight = () => setHighlightedTab(null)
  const repositionHighlight = (e: any, tab: any) => {
    setTabBoundingBox(e.currentTarget.getBoundingClientRect())
    setWrapperBoundingBox(wrapperRef.current?.getBoundingClientRect())
    setIsHoveredFromNull(!highlightedTab)
    setHighlightedTab(tab)
  }
  const keyHandler = (e: any) => {
    /* NOTE: Valid navigation keys that move the highlight */
    const keys = ['ArrowDown', 'ArrowUp', 'Home', 'End', 'j', 'k', 'g', 'G']

    if (keys.includes(e.key)) {
      e.preventDefault()
      let nextIndex = 0
      switch (e.key) {
        case 'ArrowDown':
        case 'j':
          nextIndex = (currentIndex + 1) % data.length
          break
        case 'ArrowUp':
        case 'k':
          nextIndex = currentIndex === 0 ? data.length - 1 : currentIndex - 1
          break
        case 'Home':
        case 'g':
          nextIndex = 0
          break
        case 'End':
        case 'G':
          nextIndex = data.length - 1
          break
      }

      const id = prefixRef.current.toString() + nextIndex.toString()
      /* TODO: Need to investigate performance as this is most likely inefficient */
      document.getElementById(id)?.focus()
      document
        .getElementById(id)
        ?.scrollIntoView({ block: 'center', inline: 'nearest', behavior: 'smooth' })
      setCurrentIndex(nextIndex)
    } else if (e.key === 'Tab') {
      /* NOTE: We only update the index as the default tab event behavior moves the focus around */
      if (e.shiftKey) {
        setCurrentIndex(currentIndex === 0 ? data.length - 1 : currentIndex - 1)
      } else {
        setCurrentIndex((currentIndex + 1) % data.length)
      }
    }
  }

  if (tabBoundingBox && wrapperBoundingBox) {
    highlightStyles.transitionDuration = isHoveredFromNull && animate ? '0ms' : '150ms'
    highlightStyles.transitionProperty = animate ? 'width, height, transform, opacity' : 'opacity'
    highlightStyles.opacity = highlightedTab ? 1 : 0
    highlightStyles.width = `${tabBoundingBox.width}px`
    highlightStyles.height = `${tabBoundingBox.height}px`
    highlightStyles.transform = `translate(${tabBoundingBox.left - wrapperBoundingBox.left}px, ${
      tabBoundingBox.top - wrapperBoundingBox.top
    }px)`
  }
  if (dividers) highlightStyles.borderRadius = 0

  const renderTab = (tab: any, index: number, props: { [_: string]: any } = {}) => (
    <Fragment key={tab[attribute]}>
      {dividers && index > 0 && <Hr />}
      <Tab
        {...props}
        to={href(tab)}
        target={target}
        /* NOTE: Unique identifier to find the element */
        id={prefixRef.current.toString() + index.toString()}
        onMouseOver={(event: any) => repositionHighlight(event, tab)}
        onFocus={(event: any) => {
          /* NOTE: Repositions the highlight on a focus event (e.g. tab key press) */
          repositionHighlight(event, tab)
        }}
        onKeyPress={(event: any) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.currentTarget.click()
          }
        }}
      >
        {generator(tab)}
      </Tab>
    </Fragment>
  )

  return (
    <TabsWrapper
      ref={wrapperRef}
      onMouseLeave={resetHighlight}
      css={wrapperStyles}
      onBlur={(e) => {
        /**
         * NOTE: The following code was yanked from the following source:
         * https://muffinman.io/blog/catching-the-blur-event-on-an-element-and-its-children/
         */
        const currentTarget = e.currentTarget

        /* Give browser time to focus the next element */
        requestAnimationFrame(() => {
          /* Check if the new focused element is a child of the original container */
          if (!currentTarget.contains(document.activeElement)) {
            setCurrentIndex(0)
            resetHighlight()
          }
        })
      }}
      onKeyDown={keyHandler}
    >
      <TabsHighlight ref={highlightRef} css={highlightStyles} />

      {dragDropOptions !== null
        ? addDroppable(data, attribute, dragDropOptions, renderTab)
        : data?.map((d: any, i: number) => renderTab(d, i))}
    </TabsWrapper>
  )
}
