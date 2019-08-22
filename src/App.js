
import React from 'react';
import { Sidebar } from 'semantic-ui-react';

import StatsWrapper from './StatsWrapper';
import ClassChangeWrapper from './ClassChangeWrapper';
import CharacterSelect from './CharacterSelect';

import './css/app.css';

import characters from './data/characters.json';

class App extends React.Component {

  constructor(props) {
    
    super(props);
    
    this.state = {
      classChangeOpen: false,
      characterSelectOpen: false,
      characterId: 'byleth',
      classChanges: []
    };
  }

  // Passed to StatsWrapper for 'Edit Class Changes' button.
  openClassChange = () => {

    this.setState({
      classChangeOpen: true
    });
  }

  // Passed to CharacterSelect for 'Select Character' button.
  openCharacterSelect = () => {

    this.setState({
      characterSelectOpen: true
    });
  }

  // Passed to ClassChangeWrapper for the 'Apply' button.
  applyClassChanges = (newClassChanges) => {

    this.setState({
      classChanges: newClassChanges,
      classChangeOpen: false
    });
  }

  // Passed to CharacterSelect as an on modify callback.
  applyCharacterSelect = (newCharacterId) => {

    this.setState({
      characterId: newCharacterId,
      characterSelectOpen: false
    });
  }

  render() {

    let character = characters[this.state.characterId];

    return (
      <div>
        <Sidebar className='side-bar' animation='overlay' visible={this.state.classChangeOpen}>
          <ClassChangeWrapper character={character} appliedFunc={this.applyClassChanges} />
        </Sidebar>

        <Sidebar className='side-bar' animation='overlay' visible={this.state.characterSelectOpen}>
          <CharacterSelect appliedFunc={this.applyCharacterSelect} />
        </Sidebar>

        <StatsWrapper character={character} classChanges={this.state.classChanges} openCharacterSelectFunc={this.openCharacterSelect} openClassChangeFunc={this.openClassChange} />
      </div>
    );
  }
}

export default App;
