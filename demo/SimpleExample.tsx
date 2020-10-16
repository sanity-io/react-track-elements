import * as React from 'react'
import {createScope} from '../src'

const {Tracker, useReporter, useReportedValues} = createScope<string | number>()

interface ReporterProps {
  id: string
  message: string
}

function ClickReporter() {
  const [clicks, setClicks] = React.useState(0)
  useReporter('clicks', clicks)
  return <button onClick={() => setClicks(() => clicks + 1)}>Click ({clicks})</button>
}

function MyReporter(props: ReporterProps) {
  useReporter(props.id, props.message)
  return <div>Hello I'm reporting the message {props.message}</div>
}

function ShowReportedValues() {
  const reportedValues = useReportedValues()
  return (
    <div>
      Reported values: <pre>{JSON.stringify(reportedValues, null, 2)}</pre>
    </div>
  )
}

export function SimpleExample() {
  return (
    <>
      <Tracker>
        <div>
          <div>
            <MyReporter id="first" message="hello" />
            <MyReporter id="second" message="world" />
            <ClickReporter />
          </div>
        </div>
        <h2>Values</h2>
        <ShowReportedValues />
      </Tracker>
    </>
  )
}
