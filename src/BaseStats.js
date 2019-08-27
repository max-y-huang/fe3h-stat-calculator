import React from 'react';
import { Button, Icon, Input, Label, Segment, Grid, Divider, Checkbox } from 'semantic-ui-react';

import WindowWrapper from './WindowWrapper';

import './css/statGrid.css';

import classes from './data/classes.json';

class BaseStats extends React.Component {

  constructor(props) {

    super(props);

    this.levelInputRef = React.createRef();

    this.state = {
      baseLevel: 1,
      baseStats: { 'hp': 0, 'str': 0, 'mag': 0, 'dex': 0, 'spd': 0, 'lck': 0, 'def': 0, 'res': 0, 'cha': 0 },
      includeStatBoosts: false
    };
  }

  onReset = () => {

    // Reset joining level.
    this.levelInputRef.current.value = 1;
    this.setState({
      baseLevel: 1
    });

    this.setStatsToAverage();
  }

  onApply = (close=true) => {

    let baseClass = classes[this.props.character['class']];
    let baseStats = this.state.baseStats;
    let modifiedBaseStats = {};

    for (var stat in baseStats) {

      if (!baseStats.hasOwnProperty(stat)) {
        continue;
      }

      modifiedBaseStats[stat] = baseStats[stat];
      // Remove class bonuses from base stats (if applicable).
      if (this.state.includeStatBoosts) {
        modifiedBaseStats[stat] -= baseClass['boosts'][stat];
      }
    }
    
    this.props.appliedFunc(this.state.baseLevel, modifiedBaseStats, close);  // Passed from App.
  }

  setStatsToAverage = () => {
    
    let statList = [ 'hp', 'str', 'mag', 'dex', 'spd', 'lck', 'def', 'res', 'cha' ];
    let tempBaseStats = {};

    statList.forEach((stat) => {
      tempBaseStats[stat] = this.getAverageBaseStat(stat);
    });

    this.setState({
      baseStats: tempBaseStats
    });
  }

  getAverageBaseStat(stat) {

    let character = this.props.character;
    let baseClass = classes[character['class']];

    let growthModifier = 0.01 * (character['growths'][stat] + baseClass['growths'][stat]);

    let val = character['bases'][stat] + growthModifier * (this.state.baseLevel - 1);
    val = Math.max(val, baseClass['bases'][stat]);
    if (this.state.includeStatBoosts) {
      val += baseClass['boosts'][stat];
    }

    return Math.round(val);
  }

  setBaseLevel = (e, { name, value }) => {

    this.setState({
      baseLevel: value
    });
  }

  setIncludeStatBoosts = (e, { checked }) => {

    this.setState({
      includeStatBoosts: checked
    });
  }

  setBaseStatValue = (stat, val) => {

    let tempBaseStats = this.state.baseStats;

    tempBaseStats[stat] = val;

    this.setState({
      baseStats: tempBaseStats
    });
  }

  renderStatDisplays = () => {
    
    // Outer array = columns, inner arrays = rows.
    let grid = [
      [ 'hp', 'str', 'mag', 'dex', 'spd' ],
      [ 'lck', 'def', 'res', 'cha' ]
    ];

    // Render StatDisplay objects enclosed by Grid.Column objects.
    return grid.map((col, i) => {
      return (
        <Grid.Column key={i}>
          {col.map((cell) => {
            return <StatDisplay key={cell} label={cell} defaultValue={this.state.baseStats[cell]}
              setBaseStatValueFunc={this.setBaseStatValue}
            />
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

    if (prevStates.baseLevel !== this.state.baseLevel) {
      this.setStatsToAverage();
    }

    if (prevStates.baseStats !== this.state.baseStats) {
      this.onApply(false);
    }
  }

  render() {

    let characterId = this.props.characterId;
    let characterName = this.props.character['name'];

    let includeStatBoostsLabel = [
      [<div key='title'>{'Include class boosts in base stats'}</div>],
      [<div key='subtitle' style={{color: 'rgba(0, 0, 0, 0.68)'}}>{'Assumes unit\'s default class'}</div>]  // Same colour as card description.
    ];

    return (
      <WindowWrapper
        characterId={characterId}
        characterName={characterName}
        headerButtons={
          <Button icon color='blue' onClick={this.onApply}>
            <Icon name='check' />
          </Button>
        }
        body={
          <div>

            <Segment>
              <Label attached='top left' color='yellow'>Joining Information</Label>
              <Input type='number' onChange={this.setBaseLevel} fluid defaultValue={1} labelPosition='left'>
                <Label color='blue'>Level</Label>
                <input ref={this.levelInputRef} />
              </Input>
              <Divider />
              <div className='stat-grid-wrapper'>
                <Grid columns={2}>{this.renderStatDisplays()}</Grid>
              </div>
              <Divider />
              <Checkbox toggle label={includeStatBoostsLabel} onChange={this.setIncludeStatBoosts} />
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

    this.state = {
      defaultValue: this.props.defaultValue  // A change in defaultValue will override the current value.
    };
  }

  setValue = (e, { name, value }) => {

    this.inputRef.current.value = value;
    this.props.setBaseStatValueFunc(this.props.label, value);
  }

  resetValue = () => {

    this.inputRef.current.value = this.props.defaultValue;
  }

  componentDidMount() {

    this.resetValue();
  }

  componentDidUpdate(prevProps, prevStates) {

    if (prevProps.defaultValue !== this.props.defaultValue) {
      this.resetValue();
    }
  }

  render() {
    return (
      <Input type='number' className='stat-display' onChange={this.setValue} labelPosition='left' fluid>
        <Label color='blue'>{this.props.label}</Label>
        <input ref={this.inputRef} />
      </Input>
    );
  }
}

export default BaseStats;
