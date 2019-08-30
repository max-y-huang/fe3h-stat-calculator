import React from 'react';
import { Button, Icon, Grid, Input, Label, Segment, Divider } from 'semantic-ui-react';

import WindowWrapper from './WindowWrapper';

import './css/main.css';
import './css/statGrid.css';

import classes from './data/classes.json';

class Main extends React.Component {

  constructor(props) {

    super(props);

    this.levelInputRef = React.createRef();

    this.state = {
      finalLevel: 1
    }
  }

  onReset = () => {

    // Reset final level.
    this.levelInputRef.current.value = 1;
    this.setState({
      finalLevel: 1
    });
  }

  formatClassChanges = () => {

    let classChanges = this.props.classChanges.slice();
    let character = this.props.character;
    let baseLevel = this.props.characterBaseLevel;
    let finalLevel = this.state.finalLevel;

    // Remove class changes before base level.
    let spliceLength = classChanges.length;
    for (let i = 0; i < classChanges.length; i++) {
      if (classChanges[i]['level'] >= baseLevel) {
        spliceLength = i;
        break;
      }
    }
    classChanges.splice(0, spliceLength);
    
    // Remove class changes after final level.
    for (let i = 0; i < classChanges.length; i++) {
      if (classChanges[i]['level'] > finalLevel) {
        classChanges.splice(i);
        break;
      }
    }

    // A placeholder class change is added for the final level. It is for coding simplicity, and it gets skipped in calculations.
    classChanges.push({
      level: finalLevel,
      class: null
    });

    // Add class change for initial class.
    classChanges.splice(0, 0, {
      level: baseLevel,
      class: character['class']
    });

    return classChanges;
  }

  // Passed to StatDisplay as 'value' prop
  getAverageStat = (stat) => {

    let character = this.props.character;
    let classChanges = this.formatClassChanges();

    // Unlike other stats, movement is fixed
    if (stat === 'mv') {
      return classes[classChanges[classChanges.length - 2]['class']]['bases']['mv'];
    }
    
    // Start with the character base stat
    let val = this.props.characterBaseStats[stat];

    // Loop through all class intervals. The last index is a final level placeholder.
    for (let i = 0; i < classChanges.length - 1; i++) {

      // Increase val to class base stat (if applicable).
      val = Math.max(val, classes[classChanges[i]['class']]['bases'][stat]);

      // Get growth modifier from character and class growth rate.
      let characterGrowth = character['growths'][stat];
      let classGrowth = classes[classChanges[i]['class']]['growths'][stat];
      let growthModifier = 0.01 * (characterGrowth + classGrowth);

      // Get level difference.
      let levelA = classChanges[i]['level'];
      let levelB = classChanges[i + 1]['level'];
      let levelDifference = levelB - levelA; 
      
      // Add average stat growth over class interval.
      val += growthModifier * levelDifference;
    }

    // Add class bonuses.
    val += classes[classChanges[classChanges.length - 2]['class']]['boosts'][stat];

    // Round to two decimals.
    return Math.round(val * 100) / 100;
  }

  setFinalLevel = (e, { name, value }) => {

    this.setState({
      finalLevel: value
    });
  }

  renderStatDisplays = () => {
    
    // Outer array = columns, inner arrays = rows.
    let grid = [
      [ 'hp', 'str', 'mag', 'dex', 'spd' ],
      [ 'mv', 'lck', 'def', 'res', 'cha' ]
    ];

    // Render StatDisplay objects enclosed by Grid.Column objects.
    return grid.map((col, i) => {
      return (
        <Grid.Column key={i}>
          {col.map((cell) => {
            return <StatDisplay key={cell} label={cell} value={this.getAverageStat(cell)} />
          })}
        </Grid.Column>
      );
    });
  }

  componentDidMount() {

    this.onReset();
  }

  componentDidUpdate(prevProps, prevStates) {

    if (prevProps.resetFlag !== this.props.resetFlag) {
      this.onReset();
    }
  }

  render() {

    let characterId = this.props.characterId;
    let characterName = this.props.character['name'];

    return (
      <WindowWrapper
        characterId={characterId}
        characterName={characterName}
        headerButtons={
          <Button color='blue' icon onClick={this.props.openCharacterSelectFunc}>
            <Icon name='exchange' />
          </Button>
        }
        body={

          <div>

            <Button onClick={() => {
              alert(JSON.stringify(this.formatClassChanges()));
            }}>Changes</Button>

            <Segment>
              <Label attached='top left' color='yellow'>Information</Label>
              <Input type='number' onChange={this.setFinalLevel} fluid defaultValue={1} labelPosition='left'>
                <Label color='blue'>Level</Label>
                <input ref={this.levelInputRef} />
              </Input>
              <Divider />
              <Button icon labelPosition='left' color='blue' fluid onClick={this.props.openBaseStatsFunc} style={{marginBottom: '1em'}}> {/* Passed from App */}
                <Icon name='edit' />
                Joining Information
              </Button>
              <Button icon labelPosition='left' color='blue' fluid onClick={this.props.openClassChangeFunc}> {/* Passed from App */}
                <Icon name='edit' />
                Class Changes
              </Button>
            </Segment>

            <Segment>
              <Label attached='top left' color='yellow'>Average Stats</Label>
              <div className='stat-grid-wrapper'>
                <Grid columns={2}>{this.renderStatDisplays()}</Grid>
              </div>
            </Segment>

          </div>
        }
      />
    );
  }
}

class StatDisplay extends React.Component {

  render() {
    return (
      <Input className='stat-display' labelPosition='left' fluid>
        <Label color='pink'>{this.props.label}</Label>
        <input value={this.props.value} className='no-select' readOnly />
      </Input>
    );
  }
}

export default Main;
