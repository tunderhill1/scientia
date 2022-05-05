import React, { ReactNode, useRef, useState } from 'react'
import { TabsWrapper, TabsHighlight, Tab } from '../styles/tabs.style'

/**
 * NOTE: The following code was heavily inspired by Emil Kowalski's blog on tabs and the accompanying code sandbox:
 * https://emilkowal.ski/ui/tabs
 */

export enum Alignment {
  Vertical,
  Horizontal,
  Mixed /* TODO: Add support for this (not priority) */,
}

export const Tabs = ({
  data,
  generator,
  alignment = Alignment.Vertical,
}: {
  data: any
  generator: (tab: any) => ReactNode
  alignment?: Alignment
}) => {
  const [tabBoundingBox, setTabBoundingBox] = useState<any>(null)
  const [wrapperBoundingBox, setWrapperBoundingBox] = useState<any>(null)
  const [highlightedTab, setHighlightedTab] = useState(null)
  const [isHoveredFromNull, setIsHoveredFromNull] = useState(true)

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

  if (tabBoundingBox && wrapperBoundingBox) {
    highlightStyles.transitionDuration = isHoveredFromNull ? '0ms' : '150ms'
    highlightStyles.opacity = highlightedTab ? 1 : 0
    highlightStyles.width = `${tabBoundingBox.width}px`
    highlightStyles.transform = `translate(${tabBoundingBox.left - wrapperBoundingBox.left}px, ${
      tabBoundingBox.top - wrapperBoundingBox.top
    }px)`
  }

  return (
    <TabsWrapper ref={wrapperRef} onMouseLeave={resetHighlight} css={wrapperStyles}>
      <TabsHighlight ref={highlightRef} css={highlightStyles} />
      {data &&
        data.map((tab: any) => (
          <Tab key={tab.title} onMouseOver={(event: any) => repositionHighlight(event, tab)} href="/">
            {generator(tab)}
          </Tab>
        ))}
    </TabsWrapper>
  )
}
