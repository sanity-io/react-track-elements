import * as React from 'react'
import {createScope} from '../../src'
import {ResizeObserverEntry} from '@juggle/resize-observer'
import {useOnScroll} from '../ScrollContainer'
import {createSharedResizeObserver} from './createSharedResizeObserver'

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

const resizeObserver = createSharedResizeObserver()

function useResizeObserver(
  ref: {current: HTMLDivElement | null},
  onResize: (event: ResizeObserverEntry) => void,
) {
  React.useEffect(() => {
    if (ref.current) {
      return resizeObserver.observe(ref.current, onResize)
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
        width: `${5 + Math.random() * 18}vh`,
        height: `${5 + Math.random() * 18}vh`,
        outline: `1px dotted ${rgb(bg)}`,
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
const rgb = (color: Color) => `rgb(${color.join(',')})`

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
    borderRadius: value.element.offsetWidth,
  }))

  return (
    <div
      style={{position: 'absolute', top: 0, left: 0, bottom: 0, right: 0, pointerEvents: 'none'}}
    >
      {prepared.map((rect) => (
        <div
          style={{
            transitionProperty: 'all',
            transitionDuration: '1s',
            position: 'absolute',
            ...rect,
            backgroundColor: rgb(rect.bgColor),
          }}
          key={rect.id}
        />
      ))}
    </div>
  )
}

export function Example1() {
  const rootRef = React.useRef<HTMLDivElement | null>(null)
  return (
    <Tracker>
      <div style={{position: 'relative'}} ref={rootRef}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <MyReporter id="first" message="hello" />
          <MyReporter id="second" message="world" />
          <MyReporter id="third" message="third" />
          <MyReporter id="fourth" message="fourth" />
          <MyReporter id="fifth" message="fifth" />
        </div>
        <Overlay rootRef={rootRef} />
      </div>
    </Tracker>
  )
}
