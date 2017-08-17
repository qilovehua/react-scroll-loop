import React, {PropTypes, Component} from 'react';
import Swipe from './swipe';

import './style.css';

class ScrollLoop extends Component {

  componentDidMount() {
    const {speed, minSpeed = 10, auto = 1, transitionEnd} = this.props;
    var swipeOptions = {speed, minSpeed, transitionEnd, auto};

    this.swipe = Swipe(this.refs.container, swipeOptions);
  }

  componentWillUnmount() {
    this.swipe.kill();
    this.swipe = void 0;
  }

  render() {
    const {height = 200, id, className, children} = this.props;
    var style = {height: height + 'px'};

    return (
        <div ref="container" id={id} className={`react-swipe-container ${className}`} style={style}>
            <div className="swipe-wrap">
                {React.Children.map(children, (child) => {
                  if (!child) {
                    return null;
                  }

                  const childStyle = child.props.style ? child.props.style : {};

                  return React.cloneElement(child, {style: childStyle});
                })}
            </div>
        </div>
    );
  }
}

if (process.env.NODE_ENV !== 'production') {
  ScrollLoop.PropTypes = {
    speed: PropTypes.number,
    auto: PropTypes.number,
    height: PropTypes.number.isRequired,
    transitionEnd: PropTypes.func,
    id: PropTypes.string,
    className: PropTypes.string
  }
}

export default ScrollLoop;
