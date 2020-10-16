import * as React from 'react'
import {ScrollContainer, useOnScroll} from './ScrollContainer'

function TestParentScroll() {
  useOnScroll(() => {
    console.log('something scrolled inside my closest scroll container')
  })
  return null
}

export function ScrollExample() {
  return (
    <>
      <ScrollContainer style={{position: 'relative', height: 300, overflow: 'auto'}}>
        <div>
          <div>
            <ScrollContainer style={{position: 'relative', height: 200, overflow: 'auto', backgroundColor: 'blue'}}>
              <TestParentScroll />
              <div style={{height: 400}}></div>
              <ScrollContainer style={{position: 'relative', height: 200, overflow: 'auto'}}>

                <div style={{height: 400}}></div>
              </ScrollContainer>
            </ScrollContainer>
          </div>
          <div>
            <ScrollContainer style={{position: 'relative', height: 200, overflow: 'auto'}}>
              <div style={{height: 400}}></div>
            </ScrollContainer>
          </div>
        </div>
      </ScrollContainer>
    </>
  )
}
