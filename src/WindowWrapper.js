import React from 'react';
import { Segment } from 'semantic-ui-react';

import './css/windowWrapper.css';

class WindowWrapper extends React.Component {

  constructor(props) {

    super(props);

    this.headerRef = React.createRef();
    this.headerButtonsRef = React.createRef();

    this.state = {
      headerHeight: 0,
      headerButtonsWidth: 0
    };
  }

  componentDidMount() {

    this.setState({
      headerHeight: this.headerRef.current.clientHeight
    });
  }

  render() {
    
    return (
      <div className='window-wrapper'>
        <div ref={this.headerRef}>

          <Segment className='header-segment'>
            <div>
              <img src={'images/characters/' + this.props.headerIconName + '.png'} alt='' />
              <div>{this.props.headerTitle}</div>
            </div>

            <div>{this.props.headerButtons}</div>
          </Segment>
          
        </div>
        <div className='body-segment' style={{top: 'calc(' + this.state.headerHeight + 'px + 1em)'}}>
          {this.props.body}
        </div>
      </div>
    );
  }
}

export default WindowWrapper;
