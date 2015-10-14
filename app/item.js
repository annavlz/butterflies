/** @jsx hJSX */
import {hJSX} from '@cycle/dom'
import combineLatestObj from 'rx-combine-latest-obj'

function model(props) {
  const posX$ = props.x$
  const posY$ = props.y$
  return combineLatestObj({posX$, posY$})
}

function view(state$) {
  return state$.map(item => {
    const style = {
      width: '50px',
      top: `${item.posY}px`,
      left: `${item.posX}px`,
      position: 'absolute'
    };
    const source = './assets/image.gif'
    return <img src={source} style={style}/>
  });
}

function item(sources) {
  return { DOM: view(model(sources.props)) }
}

export default item


