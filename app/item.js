/** @jsx hJSX */

import {h, hJSX} from '@cycle/dom';

function view(props) {
  return props.map(x => {
    const style = {
      width: '100px',
      // top: String(position.y+'px'),
      // left: String(position.x+'px'),
      // position: 'absolute'
    };
    const source = './assets/image.gif'
    return <img src={source} style={style}/>
  });
}

function item(props) {
  return {
    DOM: view(props)
  };
}

export default item;


