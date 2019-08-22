
import React from 'react';
import { Card, Image, Grid } from 'semantic-ui-react';

import characters from './data/characters.json';
import classes from './data/classes.json';

class CharacterSelect extends React.Component {

  render() {

    return (
      <div>
        <Grid columns={2}>
          <Grid.Column>
            <CharacterItem name='byleth' appliedFunc={this.props.appliedFunc} />
          </Grid.Column>
          <Grid.Column>
            <CharacterItem name='hubert' appliedFunc={this.props.appliedFunc} />
          </Grid.Column>
          <Grid.Column>
            <CharacterItem name='edelgard' appliedFunc={this.props.appliedFunc} />
          </Grid.Column>
          <Grid.Column>
            <CharacterItem name='dorothea' appliedFunc={this.props.appliedFunc} />
          </Grid.Column>
        </Grid>
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
    let level = character['level'];
    let className = classes[character['class']]['name'];

    return (
      <Card onClick={this.onApply}>
        <Image src={'images/characters/' + this.props.name + '.png'} wrapped ui={false} style={{backgroundColor: '#ffffff'}} />
        <Card.Content style={{textAlign: 'center'}}>
          <Card.Header>{character['name']}</Card.Header>
          <Card.Description>Level {level} {className}</Card.Description>
        </Card.Content>
      </Card>
    );
  }
}

export default CharacterSelect;
