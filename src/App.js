
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
      resetFlag: 0,  // Passed to children as props. Signals a reset.
      classChangeOpen: false,
      characterSelectOpen: false,
      characterId: 'byleth',
      characterStartingLevel: 1,
      classChanges: []
    };
  }

  reset = () => {

    this.setState((state) => ({
      resetFlag: state.resetFlag + 1
    }));
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
    }, () => {

      this.reset();
    });
  }

  setStartingLevel = (newLevel) => {

    this.setState({
      characterStartingLevel: newLevel
    });
  }

  render() {

    let character = characters[this.state.characterId];

    return (
      <div>
        <Sidebar className='side-bar' animation='overlay' visible={this.state.classChangeOpen} style={{backgroundColor: '#f5f5f5'}}>
          <ClassChangeWrapper
            character={character}
            resetFlag={this.state.resetFlag}
            appliedFunc={this.applyClassChanges}
          />
        </Sidebar>

        <Sidebar className='side-bar' animation='overlay' visible={this.state.characterSelectOpen} style={{backgroundColor: '#ffffff'}}>
          <CharacterSelect
            appliedFunc={this.applyCharacterSelect}
          />
        </Sidebar>

        <StatsWrapper
          character={character}
          startingLevel={this.state.characterStartingLevel}
          classChanges={this.state.classChanges}
          resetFlag={this.state.resetFlag}
          openCharacterSelectFunc={this.openCharacterSelect}
          openClassChangeFunc={this.openClassChange}
          setStartingLevelFunc={this.setStartingLevel}
        />
      </div>
    );
  }
}

export default App;
