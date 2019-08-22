
import React from 'react';
import { Card, Image, Grid } from 'semantic-ui-react';

import './css/characterSelect.css';

import characters from './data/characters.json';
import classes from './data/classes.json';

class CharacterSelect extends React.Component {

  renderCharacterItems = () => {

    let cols = [ [], [] ];

    let indexCounter = 0;

    for (var key in characters) {

      if (!characters.hasOwnProperty(key)) {
        continue;
      }

      cols[indexCounter % 2].push(
        <CharacterItem key={key} name={key} appliedFunc={this.props.appliedFunc} />
      );

      indexCounter++;
    }

    return cols.map((val, i) => {
      return (
        <Grid.Column key={i}>{val}</Grid.Column>
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

    this.props.appliedFunc(this.props.name);
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
