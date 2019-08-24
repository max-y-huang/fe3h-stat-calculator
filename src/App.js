
import React from 'react';
import { Sidebar } from 'semantic-ui-react';

import Main from './Main';
import ClassChange from './ClassChange';
import BaseStats from './BaseStats';
import CharacterSelect from './CharacterSelect';

import './css/app.css';

import characters from './data/characters.json';

class App extends React.Component {

  constructor(props) {
    
    super(props);
    
    this.state = {
      resetFlag: 0,  // Passed to children as props. Signals a reset.
      classChangeOpen: false,
      baseStatsOpen: false,
      characterSelectOpen: false,

      characterId: 'byleth',
      characterBaseLevel: 1,
      characterBaseStats: { 'hp': 0, 'str': 0, 'mag': 0, 'dex': 0, 'spd': 0, 'lck': 0, 'def': 0, 'res': 0, 'cha': 0 },
      classChanges: []
    };
  }

  reset = () => {

    this.setState((state) => ({
      resetFlag: state.resetFlag + 1
    }));
  }

  // Passed to Main for 'Edit Class Changes' button.
  openClassChange = () => {

    this.setState({
      classChangeOpen: true
    });
  }

  // Passed to Main for 'Edit Joining Stats' button.
  openBaseStats = () => {

    this.setState({
      baseStatsOpen: true
    });
  }

  // Passed to CharacterSelect for 'Select Character' button.
  openCharacterSelect = () => {

    this.setState({
      characterSelectOpen: true
    });
  }

  // Passed to ClassChange for the 'Apply' button.
  applyClassChanges = (newClassChanges) => {

    this.setState({
      classChanges: newClassChanges,
      classChangeOpen: false
    });
  }

  // Passed to BaseStats for the 'Apply' button.
  applyBaseStats = (newBaseLevel, newBaseStats) => {

    this.setState({
      characterBaseLevel: newBaseLevel,
      characterBaseStats: newBaseStats,
      baseStatsOpen: false
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

  render() {
    
    let characterId = this.state.characterId;
    let character = characters[characterId];

    return (
      <div>
        <Sidebar className='side-bar' animation='overlay' visible={this.state.classChangeOpen} style={{backgroundColor: '#f5f5f5'}}>
          <ClassChange
            characterId={characterId}
            character={character}
            resetFlag={this.state.resetFlag}
            appliedFunc={this.applyClassChanges}
          />
        </Sidebar>

        <Sidebar className='side-bar' animation='overlay' visible={this.state.baseStatsOpen} style={{backgroundColor: '#f5f5f5'}}>
          <BaseStats
            characterId={characterId}
            character={character}
            resetFlag={this.state.resetFlag}
            appliedFunc={this.applyBaseStats}
          />
        </Sidebar>

        <Sidebar className='side-bar' animation='overlay' visible={this.state.characterSelectOpen} style={{backgroundColor: '#ffffff'}}>
          <CharacterSelect
            appliedFunc={this.applyCharacterSelect}
          />
        </Sidebar>

        <Main
          characterId={characterId}
          character={character}
          characterBaseLevel={this.state.characterBaseLevel}
          characterBaseStats={this.state.characterBaseStats}
          classChanges={this.state.classChanges}
          resetFlag={this.state.resetFlag}
          openCharacterSelectFunc={this.openCharacterSelect}
          openClassChangeFunc={this.openClassChange}
          openBaseStatsFunc={this.openBaseStats}
        />
      </div>
    );
  }
}

export default App;
