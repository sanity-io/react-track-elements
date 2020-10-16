import * as React from 'react'
import {createScope} from '../src'

const {Tracker, useReporter, useReportedValues} = createScope<Data>()

interface Data {
  ref: HTMLDivElement
  message: string
}

interface ReporterProps {
  id: string
  message: string
}

function ElementReporter(props: ReporterProps) {
  const ref = React.useRef<HTMLDivElement>(null)
  useReporter(props.id, () => ({ref: ref.current!, message: props.message}))
  return <div ref={ref}>Hello I'm reporting my ref and the message {props.message}</div>
}

function UseReportedValues() {
  const reportedValues = useReportedValues()
  return (
    <div>
      Reported values:{' '}
      <pre>
        {JSON.stringify(
          reportedValues.map(([id, value]) => ({
            message: value.message,
            width: value.ref.offsetWidth,
          })),
          null,
          2,
        )}
      </pre>
    </div>
  )
}

export function ElementReporterExample() {
  return (
    <>
      <Tracker>
        <div>
          <div>
            <ElementReporter id="first" message="hello" />
          </div>
          <div>
            <ElementReporter id="second" message="world" />
          </div>
          <div>
            <ElementReporter id="third" message="foobar" />
          </div>
        </div>
        <UseReportedValues />
      </Tracker>
    </>
  )
}
