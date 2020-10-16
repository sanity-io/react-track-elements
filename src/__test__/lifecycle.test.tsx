import {render} from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import * as React from 'react'
import {createScope} from '../'

const {useReporter, useReportedValues, Tracker} = createScope()

function MyReporter(props: {id: string; message: string}) {
  useReporter(props.id, props.message)
  return <>Reporting: {props.message}</>
}

function ShowReportedValues() {
  const reportedValues = useReportedValues()
  return <>Reported: [{reportedValues.map(([id, value]) => `${id}=${value}`)}]</>
}

export function SimpleDemo(props: {greeting?: string; showSecond?: boolean}) {
  return (
    <Tracker>
      <MyReporter id="first" message={props.greeting || 'Hello, world!'} />
      {props.showSecond !== false && <MyReporter id="second" message="Hello, moon!" />}
      <ShowReportedValues />
    </Tracker>
  )
}

test('keeps track of reported values throughout the lifecycle of a reporting component', () => {

  // Initial
  const {container, rerender} = render(<SimpleDemo />)
  expect(container).toMatchInlineSnapshot(`
    <div>
      Reporting: 
      Hello, world!
      Reporting: 
      Hello, moon!
      Reported: [
      first=Hello, world!
      second=Hello, moon!
      ]
    </div>
  `)

  // Update
  rerender(<SimpleDemo greeting="Hi JUPITER!!" />)
  expect(container).toMatchInlineSnapshot(`
    <div>
      Reporting: 
      Hi JUPITER!!
      Reporting: 
      Hello, moon!
      Reported: [
      first=Hi JUPITER!!
      second=Hello, moon!
      ]
    </div>
  `)

  // Unmount
  rerender(<SimpleDemo showSecond={false} />)
  expect(container).toMatchInlineSnapshot(`
    <div>
      Reporting: 
      Hello, world!
      Reported: [
      first=Hello, world!
      ]
    </div>
  `)
})
