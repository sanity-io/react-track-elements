import * as React from 'react'
import {createScope} from '../../src'
import {createSharedResizeObserver} from './createSharedResizeObserver'
import {ResizeObserverEntry} from '@juggle/resize-observer'
import {ScrollContainer, useOnScroll} from '../ScrollContainer'

type Color = [number, number, number]
type TrackedValue = {
  element: HTMLDivElement
  bgColor: Color
}

const {Tracker, useReporter, useReportedValues} = createScope<TrackedValue>()

interface ReporterProps {
  id: string
  message: string
}

const resizeListener = createSharedResizeObserver()

function useResizeObserver(
  ref: {current: HTMLDivElement | null},
  onResize: (event: ResizeObserverEntry) => void,
) {
  React.useEffect(() => {
    if (ref.current) {
      return resizeListener.observe(ref.current, onResize)
    }
  }, [])
}

const rand255 = () => Math.floor(Math.random() * 255)
const getRandomColor = (): Color => [rand255(), rand255(), rand255()]

function MyReporter(props: ReporterProps) {
  const ref = React.useRef<HTMLDivElement>(null)
  const [bg, setBg] = React.useState<Color>(getRandomColor())
  useReporter(props.id, () => ({
    bgColor: bg,
    element: ref.current!,
  }))

  return (
    <div
      ref={ref}
      onClick={() => {
        setBg(getRandomColor())
      }}
      style={{
        backgroundColor: `rgb(${bg.join(', ')})`,
        height: `${5 + Math.random() * 4}vh`,
      }}
    />
  )
}

function getRelativeOffsets(el: HTMLElement, parent: HTMLElement) {
  let top = 0
  let left = 0
  while (el && el !== parent) {
    top += el.offsetTop
    left += el.offsetLeft
    el = el.offsetParent as HTMLElement
  }
  return {top, left}
}

function Overlay(props: {rootRef: {current: HTMLDivElement | null}}) {
  const reportedValues = useReportedValues()
  const [, forceUpdate] = React.useReducer((x) => x + 1, 0)
  useResizeObserver(props.rootRef, forceUpdate)
  useOnScroll(forceUpdate)

  const prepared = reportedValues.map(([id, value]) => ({
    id: id,
    bgColor: value.bgColor,
    ...getRelativeOffsets(value.element, props.rootRef.current!),
    height: value.element.offsetHeight,
    width: value.element.offsetWidth,
  }))

  return (
    <div
      style={{position: 'absolute', top: 0, left: 0, bottom: 0, right: 0, pointerEvents: 'none'}}
    >
      {prepared.map((rect) => (
        <div
          style={{
            position: 'absolute',
            ...rect,
            backgroundColor: `rgb(${rect.bgColor.join(', ')})`, //'rgba(100, 100, 100, 0.4)',
          }}
          key={rect.id}
        >
          rgb({rect.bgColor.join(', ')})
        </div>
      ))}
    </div>
  )
}

export function Example2({nest = true}: {nest?: boolean}) {
  const rootRef = React.useRef<HTMLDivElement | null>(null)
  return (
    <Tracker>
      <ScrollContainer style={{position: 'relative', height: 200, overflow: 'auto'}}>
        <div style={{position: 'relative'}} ref={rootRef}>
          <div>
            <MyReporter id="first" message="hello" />
            <MyReporter id="second" message="world" />
            <MyReporter id="third" message="third" />
            <MyReporter id="fourth" message="fourth" />
            <MyReporter id="fifth" message="fifth" />
            <ScrollContainer style={{position: 'relative', height: 200, overflow: 'auto'}}>
              <div style={{height: 400}}></div>
            </ScrollContainer>
          </div>
          <div>{nest && <Example2 nest={false} />}</div>
        </div>
        <Overlay rootRef={rootRef} />
      </ScrollContainer>
    </Tracker>
  )
}
