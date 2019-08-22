
import React from 'react';
import { Card, Image, Grid } from 'semantic-ui-react';

import './css/characterSelect.css';

import characters from './data/characters.json';
import classes from './data/classes.json';

class CharacterSelect extends React.Component {

  renderCharacterItems = () => {

    let grid = [ [], [] ]; // Outer array = columns, inner arrays = rows.

    let indexCounter = 0;  // Counts index when looping through characters

    for (var name in characters) {

      if (!characters.hasOwnProperty(name)) {
        continue;
      }

      // Cycle through rows to display left to right then up to down.
      grid[indexCounter % 2].push(
        <CharacterItem key={name} name={name} appliedFunc={this.props.appliedFunc} />
      );

      indexCounter++;
    }

    // Render CharacterItem objects enclosed by Grid.Column objects.
    // Grid.Row is not used because all CharacterItem objects have the same height, thus eliminating the use of vertical alignment.
    return grid.map((col, i) => {
      return (
        <Grid.Column key={i}>{col}</Grid.Column>
      )
    });
  }

  render() {

    return (
      <div className='character-select-grid-wrapper'>
        <Grid columns={2}>{this.renderCharacterItems()}</Grid>
      </div>
    );
  }
}

class CharacterItem extends React.Component {

  onApply = () => {

    this.props.appliedFunc(this.props.name);  // Passed from App.
  }

  render() {

    let character = characters[this.props.name];
    let className = classes[character['class']]['name'];

    return (
      <Card className='character-item' onClick={this.onApply}>
        <Image src={'images/characters/' + this.props.name + '.png'} wrapped ui={false} />
        <Card.Content>
          <Card.Header>{character['name']}</Card.Header>
          <Card.Description>{className}</Card.Description>
        </Card.Content>
      </Card>
    );
  }
}

export default CharacterSelect;
