# react-track-elements

> Keep track of values provided by child elements deeply nested in a React component tree.

## What?

This is a utility library for reactively keeping track of values provided by elements at arbitrary nesting levels in a React component tree.

## Why?

This is useful for situations where you want to send data only available in child components up to a common ancestor. The primary use case is rendering an overlay based on properties of rendered DOM nodes.

## How?

`react-track-elements` provides a `useReporter` hook that's used by components to provide a value to keep track of along with a unique identifier for each component. When the component mounts, the value gets reported up to a common parent (`Tracker`) element that keeps this value alongside the `id`. Whenever the value changes, the updated value gets reported again, and finally when the reporting component unmounts, the value along with the component identifier will be removed. The list of tracked values, identifier pairs can be accessed using the `useReportedValues()` hook.

## Usage

```jsx
import {Tracker, useReporter, useReportedValues} from 'react-track-elements'

// this component will report it's message to the Tracker
function MyReporterComponent(props) {
  useReporter(props.id, props.message)
  return <div>I'm reporting {props.message}</div>
}

// This component consumes all reported values through the `useReportedValues()` hook
function ListReportedValues() {
  const reportedValues = useReportedValues()
  return (
    <div>
      {reportedValues.map(({id, value}) => (
        <div key={id}>
          Reported value #{id}: {value}
        </div>
      ))}
    </div>
  )
}

function App() {
  return (
    <Tracker>
      <SomeComponentWithReporters />
      <ListReportedValues />
    </Tracker>
  )
}
```

### Reporting DOM elements

Sometimes it can useful to keep track of actual DOM elements in a component tree. In order to report these, an initializer function that returns the value to be reported can be provided to `useReporter()` instead of an actual value. This initializer will be run after the component has been mounted, so you can safely access the element from there.

```jsx
// this component will report it's element
function ElementReporter(props) {
  useReporter(props.id, () => ref.current)
  return <div ref={ref}>I'm reporting this element</div>
}

function ListReportedValues() {
  const reportedElements = useReportedValues()
  return (
    <div>
      {reportedElements.map(({id, element}) => (
        <div>Width: {element.offsetWidth}</div>
      ))}
    </div>
  )
}

function App() {
  return (
    <Tracker>
      <div>
        <ElementReporter />
        <div>
          <ElementReporter />
        </div>
      </div>
      <ListReportedValues />
    </Tracker>
  )
}
```

## Gotcha: Render cascading and infinite render loops

Since the `useReportedValues()`-hook triggers a re-render whenever it receives an updated value from a reporter this can easily lead to infinite render loops.In development, you will see React warn about this with a message saying something like _Error: Maximum update depth exceeded_

There's a couple of ways to prevent this from happening:

1. Provide am equality function to `useReporter()`
2. Don't use the `useReporter()` hook in a subtree of a component that is using the `useReportedValues()` hook.

### 1. Provide an equality function to `useReporter()`

By providing an equality function to `useReporter()` you can prevent identical values from being reported and causing a re-renders.
If you don't provide an equality function, `useReporter()` will default to referential equality using [Object.is](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is).

Keep in mind that every time a new unique value gets reported, a re-render is triggered in every component using the `useReportedValues()` hook, so it's always a good thing to provide an equality function.

```jsx
function MyReporterComponent(props) {
  // Since useReporter will be called with a different object every time,
  // we provide a custom equality check to avoid unneccessary renders in
  // the component(s) that consumes the reported values
  useReporter(props.id, {message: props.message}, (a, b) => a.message === b.message)
  return <div>I'm reporting {props.message}</div>
}
```

### 2. Don't consume reported values in a component with children using the `useReportedValues()` hook.

The reported values can only be accessed within a child component of the `<Tracker>`.

```jsx
// This component consumes all reported values through the `useReportedValues()` hook
function ListReportedValues() {
  useReporter(props.id, 'foobar') // <- Avoid doing this!

  const reportedValues = useReportedValues()
  return (
    <div>
      {reportedValues.map(({id, value}) => (
        <div key={id}>
          Reported value #{id}: {value}
        </div>
      ))}
    </div>
  )
}

function App() {
  return (
    <Tracker>
      {/* All the reporting components are rendered in here */}
      <SomeComponentWithReporters />

      {/* This is where we read the reported values */}
      <ListReportedValues />
    </Tracker>
  )
}
```

## API

- `Tracker` - A wrapper component for a subtree which values can be reported in.
- `useReporter(id: string, value: T | (()=> T)): void` - A React hook for reporting values from a component.
- `useReportedValues(): T` - A React hook for consuming all the reported values from the tracker.

- `function createScope<T>()` This creates a new isolated Tracker scope with a `Tracker` component, a `useReporter()`- hook and a `useReportedValues()`-hook with the API defined above.

### Tracker scope

In order to separate concerns its possible to have several scoped trackers reporting values in isolation.
To create an isolated scope, the `createScope` function can be used:

```jsx
import {createScope} from 'react-track-elements'

const {Tracker, useReporter, useReportedValues} = createScope()
//…
```

## License

MIT
