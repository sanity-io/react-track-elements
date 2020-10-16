import * as React from 'react'
import {createScope} from '../src'

interface ReporterProps {
  id: string
  foo: string
  bar: string
}

type ReportedProps = Omit<ReporterProps, 'id'>

const {Tracker, useReporter, useReportedValues} = createScope<ReportedProps>()

const MyReporter = React.memo(({id, foo, bar}: ReporterProps) => {
  useReporter(id, {foo, bar})
  return (
    <div>
      Hello I'm reporting the props foo={foo} and bar={bar}
    </div>
  )
})

function ShowReportedValues() {
  const reportedValues = useReportedValues()
  return (
    <div>
      Reported values: <pre>{JSON.stringify(reportedValues, null, 2)}</pre>
    </div>
  )
}
export function AdvancedExample() {
  const [show, setShow] = React.useState<{first: boolean; second: boolean}>({
    first: true,
    second: false,
  })

  const toggle = (id: 'first' | 'second') => () => setShow((curr) => ({...curr, [id]: !curr[id]}))

  return (
    <>
      <Tracker>
        <div>
          <div>
            <button onClick={toggle('first')}>Toggle first</button>
            <button onClick={toggle('second')}>Toggle second</button>
            {show.first && <MyReporter id="first" foo="foo value" bar="bar value" />}
            {show.second && <MyReporter id="second" foo="foo two" bar="bar two" />}
          </div>
        </div>
        <ShowReportedValues />
      </Tracker>
    </>
  )
}
