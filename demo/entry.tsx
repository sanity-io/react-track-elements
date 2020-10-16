import React from 'react'
import ReactDOM from 'react-dom'
import {SimpleExample} from './SimpleExample'
import {AdvancedExample} from './AdvancedExample'
import {Example1 as OverlayExample1} from './overlay/Example1'
import {Example2 as OverlayExample2} from './overlay/Example2'
import {ElementReporterExample} from './ElementReporterExample'
import {ScrollExample} from './ScrollExample'

type Example = {
  title: string
  description?: string
  component: React.ComponentType<any>
}

const EXAMPLES: {[name: string]: Example} = {
  simple: {title: 'Simple', component: SimpleExample},
  advanced: {title: 'Advanced', component: AdvancedExample},
  element: {title: 'Element', component: ElementReporterExample},
  scroll: {title: 'Scroll', component: ScrollExample},
  'overlay-example1': {title: 'OverlayExample1', component: OverlayExample1},
  'overlay-example2': {title: 'OverlayExample2', component: OverlayExample2},
}

function render() {
  const exampleName = document.location.hash.substring(1)
  const example = EXAMPLES[exampleName || 'simple']
  ReactDOM.render(
    <>
      <nav>
        <ul style={{padding: 0, margin: 0, listStyleType: 'none'}}>
          {Object.keys(EXAMPLES).map((exampleName) => (
            <li style={{display: 'inline', margin: 6}}>
              <a href={`#${exampleName}`}>{EXAMPLES[exampleName].title}</a>
            </li>
          ))}
        </ul>
      </nav>
      <h2>{example.title}</h2>
      <example.component />
    </>,
    document.getElementById('main'),
  )
}
render()
window.addEventListener('hashchange', render)
