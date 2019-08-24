import React from 'react';
import { Header, Button, Icon, Input, Label, Segment, Grid, Divider } from 'semantic-ui-react';

import WindowWrapper from './WindowWrapper';

class BaseStats extends React.Component {

  constructor(props) {

    super(props);

    ///
  }

  onApply = () => {
    
    this.props.appliedFunc();  // Passed from App.
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
            return <StatDisplay key={cell} label={cell} defaultValue={10} />
          })}
        </Grid.Column>
      );
    });
  }

  render() {

    let characterId = this.props.characterId;
    let character = this.props.character;

    return (
      <WindowWrapper
        headerIconName={characterId}
        headerTitle={
          <Header>{character['name']}</Header>
        }
        headerButtons={
          <Button icon color='blue' onClick={this.onApply}>
            <Icon name='check' />
          </Button>
        }
        body={
          <div>

            <Segment>
              <Label attached='top left' color='yellow'>Joining Information</Label>
              <Input onChange={this.setFinalLevel} fluid defaultValue={1} labelPosition='left'>
                <Label color='blue'>Level</Label>
                <input ref={this.levelInputRef} />
              </Input>
              <Divider />
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

    this.state = {
      defaultValue: this.props.defaultValue  // A change in defaultValue will override the current value.
    };
  }

  setValue = (val) => {

    this.inputRef.current.value = val;
  }

  componentDidMount() {

    this.setValue(this.props.defaultValue);
  }

  componentDidUpdate(prevProps, prevStates) {

    if (prevProps.defaultValue !== this.props.defaultValue) {
      this.setValue(this.props.defaultValue);
    }
  }

  render() {
    return (
      <Input className='stat-display' labelPosition='left' fluid>
        <Label color='blue'>{this.props.label}</Label>
        <input ref={this.inputRef} />
      </Input>
    );
  }
}

export default BaseStats;
