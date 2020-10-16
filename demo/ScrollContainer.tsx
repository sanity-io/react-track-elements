import React from 'react'
import createPubSub, {PubSub, Subscriber} from 'nano-pubsub'

type ScrollEventHandler = (event: Event) => void

export const Context = React.createContext<PubSub<Event>>(createPubSub())

export function useOnScroll(callback: Subscriber<Event>) {
  const manager = React.useContext(Context)
  React.useEffect(() => manager.subscribe(callback), [])
}

export function ScrollMonitor({
  onScroll,
  children,
}: {
  onScroll: ScrollEventHandler
  children?: React.ReactNode
}) {
  const dispatcher = React.useContext(Context)
  React.useEffect(() => {
    return dispatcher.subscribe(onScroll)
  }, [dispatcher, onScroll])

  return children
}

/**
 * This provides a utility function for use within Sanity Studios to create scrollable containers
 * It also provides a way for components inside a scrollable container to track onScroll on their first parent scroll container
 * Note: this is used by different studio utilities to track positions of elements on screen
 * Note: It will call any given `onScroll` callback with a Native DOM Event, and not a React Synthetic event
 * Note: It will not make sure the element is actually scrollable, this still needs to be done with css as usual
 */
export function ScrollContainer<T extends React.ElementType = 'div'>({
  onScroll,
  as = 'div',
  ...props
}: React.ComponentProps<T> & {
  onScroll?: ScrollEventHandler
  as?: T
}) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const parentDispatcher = React.useContext(Context)
  const childDispatcher = React.useMemo(() => createPubSub<Event>(), [])

  const handleScroll = React.useCallback((event: Event) => {
    childDispatcher.publish(event)
  }, [])

  React.useEffect(() => {
    if (onScroll) {
      // emit scroll events from children
      return childDispatcher.subscribe(onScroll)
    }
  }, [onScroll])

  React.useEffect(() => {
    // let events bubble up
    return childDispatcher.subscribe(parentDispatcher.publish)
  }, [])

  React.useEffect(() => {
    containerRef.current!.addEventListener('scroll', handleScroll, {
      passive: true,
    })
    return () => {
      containerRef.current!.removeEventListener('scroll', handleScroll)
    }
  }, [onScroll])

  return (
    <Context.Provider value={childDispatcher}>
      {React.createElement(as, {ref: containerRef, ...props})}
    </Context.Provider>
  )
}
