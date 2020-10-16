import React from 'react'
import ReactDOM from 'react-dom'
import {SimpleExample} from './SimpleExample'
import {AdvancedExample} from './AdvancedExample'
import {Example1 as OverlayExample1} from './overlay/Example1'
import {Example2 as OverlayExample2} from './overlay/Example2'
import {ElementReporterExample} from './ElementReporterExample'
import {ScrollExample} from './ScrollExample'

ReactDOM.render(
  <>
    <h2>Simple</h2>
    <SimpleExample />

    <h2>Advanced</h2>
    <AdvancedExample />

    <h2>Element reporter</h2>
    <ElementReporterExample />

    <h2>Scroll example</h2>
    <ScrollExample />

    <h2>OverlayExample1</h2>
    <OverlayExample1 />

    <h2>OverlayExample2</h2>
    <OverlayExample2 />
  </>,
  document.getElementById('main'),
)
