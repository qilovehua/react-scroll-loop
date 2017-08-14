import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import querystring from 'querystring';
import ReactSwipe from '../src/reactSwipe';

import './index.css';

const query = querystring.parse(window.location.search.slice(1));

// generate slide panes
const numberOfSlides = parseInt(query.slidesNum, 10) || 5;
const paneNodes = Array.apply(null, Array(numberOfSlides)).map((_, i) => {
  return (
    <div className="itemWrap" key={i} onClick={()=>{console.log('hahahahha', i);}}>
      <div className="item">{i}</div>
    </div>
  );
});

// change Swipe.js options by query params
const startSlide = parseInt(query.startSlide, 10) || 0;
const swipeOptions = {
  auto: parseInt(query.auto, 10) || 0,
  speed: parseInt(query.speed, 10) || 2000,
  minSpeed: parseInt(query.minSpeed, 10) || 20,
  height: parseInt(query.height, 10) || 200,
  transitionEnd() {
    console.log('ended transition');
  }
};

class Page extends Component {
  updateSpeed(sec) {
    if (this.refs.reactSwipe && this.refs.reactSwipe.swipe) {
      this.refs.reactSwipe.swipe.updateSpeed(sec);
    }
  }

  render() {
    return (
      <div className="center">
        <h1>ReactSwipe.js</h1>
        <h2>Open this page from a mobile device (real or emulated).</h2>
        <h2>You can pass <a href="https://github.com/voronianski/swipe-js-iso#config-options">Swipe.js options</a> as query params.</h2>

        <ReactSwipe ref="reactSwipe" className="mySwipe" {...swipeOptions}>
            {paneNodes}
        </ReactSwipe>

        <div>
          <button type="button" onClick={()=>{this.updateSpeed(200)}}>speed+0.2s</button>
          <button type="button" onClick={()=>{this.updateSpeed(-200)}}>speed-0.2s</button>
        </div>
      </div>
    );
  }
}

ReactDOM.render(
  <Page />,
  document.getElementById('app')
);
