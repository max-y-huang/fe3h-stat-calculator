
import React from 'react';
import { Sidebar } from 'semantic-ui-react';

import StatsWrapper from './StatsWrapper';
import ClassChangeWrapper from './ClassChangeWrapper';

import './css/app.css';

import characters from './data/characters.json';

class App extends React.Component {

  constructor(props) {
    
    super(props);
    
    this.state = {
      sidebarOpen: false,
      characterId: 'byleth',
      classChanges: []
    };
  }

  // Passed to StatsWrapper for 'Edit Class Changes' button.
  openSidebar = () => {

    this.setState({
      sidebarOpen: true
    });
  }

  // Passed to ClassChangeWrapper for the 'Apply' button.
  applyClassChanges = (newClassChanges) => {

    this.setState({
      classChanges: newClassChanges,
      sidebarOpen: false
    });
  }

  render() {

    let character = characters[this.state.characterId];

    return (
      <div>
        <Sidebar className='side-bar' animation='overlay' visible={this.state.sidebarOpen}>
          <ClassChangeWrapper character={character} appliedFunc={this.applyClassChanges} />
        </Sidebar>

        <StatsWrapper character={character} classChanges={this.state.classChanges} openSidebarFunc={this.openSidebar} />
      </div>
    );
  }
}

export default App;
