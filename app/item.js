import {h} from '@cycle/dom';

function view(props) {
  return props.map(x => {
    const style = {
      border: '1px solid #000',
      background: 'none repeat scroll 0% 0% red',
      width: '170px',
      height: '70px',
      display: 'block',
      padding: '20px',
      margin: '10px 0px'
    };
    return h('div.item', {style});
  });
}

function item(props) {
  return {
    DOM: view(props)
  };
}

export default item;
