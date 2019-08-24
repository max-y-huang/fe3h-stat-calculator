import React from 'react';
import { Button, Icon, Grid, Input, Label, Header, Segment } from 'semantic-ui-react';

import WindowWrapper from './WindowWrapper';

import './css/statsWrapper.css';

import classes from './data/classes.json';

class StatsWrapper extends React.Component {

  constructor(props) {

    super(props);

    this.startingLevelRef = React.createRef();
    this.finalLevelRef = React.createRef();

    this.state = {
      finalLevel: 1
    }
  }

  onReset = () => {

    // Reset starting level.
    this.props.setStartingLevelFunc(1);
    this.startingLevelRef.current.value = 1;

    // Reset final level.
    this.finalLevelRef.current.value = 1;
    this.setState({
      finalLevel: 1
    });
  }

  formatClassChanges = () => {

    let classChanges = this.props.classChanges.slice();
    let character = this.props.character;
    let finalLevel = this.state.finalLevel;
    
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
      level: this.props.startingLevel,
      class: character['class']
    });

    return classChanges;
  }

  getAverageBaseStat = (stat) => {

    let classChanges = this.formatClassChanges();
    let character = this.props.character;
    let startingClass = classes[classChanges[0]['class']];

    let growthModifier = 0.01 * (character['growths'][stat] + startingClass['growths'][stat]);

    let val = character['bases'][stat] + growthModifier * (this.props.startingLevel - 1);

    return val;
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
    let val = this.getAverageBaseStat(stat);

    // Loop through all class intervals. The last index is a final level placeholder.
    for (let i = 0; i < classChanges.length - 1; i++) {

      // Increase val to class base stat (if applicable).
      let classBase = classes[classChanges[i]['class']]['bases'][stat];
      if (val < classBase) {
        val = classBase;
      }

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

  setStartingLevel = (e, { name, value }) => {

    this.props.setStartingLevelFunc(value);
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
            return <StatDisplay key={cell} label={cell} defaultValue={this.getAverageStat(cell)} />
          })}
        </Grid.Column>
      );
    });
  }

  componentDidUpdate(prevProps, prevStates) {

    if (prevProps.resetFlag !== this.props.resetFlag) {
      this.onReset();
    }
  }

  render() {

    let character = this.props.character;

    return (
      <WindowWrapper
        headerTitle={
          <Header>{character['name']}</Header>
        }
        headerButtons={
          <Button color='blue' icon onClick={this.props.openCharacterSelectFunc}>
            <Icon name='edit' />
          </Button>
        }
        body={

          <div>

            <Segment>
              <Label attached='top left' color='yellow'>Input</Label>
              <Input onChange={this.setStartingLevel} fluid defaultValue={1} labelPosition='left' style={{marginBottom: '1em'}}> {/* TODO: Remove inline style */}
                <Label color='blue'>Join Level</Label>
                <input ref={this.startingLevelRef} />
              </Input>
              <Input onChange={this.setFinalLevel} fluid defaultValue={1} labelPosition='left' style={{marginBottom: '1em'}}> {/* TODO: Remove inline style */}
                <Label color='blue'>Current Level</Label>
                <input ref={this.finalLevelRef} />
              </Input>
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

  constructor(props) {

    super(props);

    this.inputRef = React.createRef();
  }

  componentDidMount() {

    this.inputRef.current.value = this.props.defaultValue;
  }

  componentDidUpdate(prevProps, prevStates) {

    if (prevProps.defaultValue !== this.props.defaultValue) {
      this.inputRef.current.value = this.props.defaultValue;
    }
  }

  render() {

    return (
      <Input className='stat-display' labelPosition='left' fluid>
        <Label color='pink'>{this.props.label}</Label>
        <input ref={this.inputRef} readOnly={this.props.isReadOnly} />
      </Input>
    );
  }
}

export default StatsWrapper;
