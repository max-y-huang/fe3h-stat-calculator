
import React from 'react';
import { Segment, Input, Dropdown, Button, Icon, Label } from 'semantic-ui-react';

import * as crypto from 'crypto';

import './css/classChangeInput.css';

import classes from './data/classes.json';

class ClassChangeInput extends React.Component {

  constructor(props) {

    super(props);

    this.state = {
      classChanges: {},
      classOptions: [],
      classChangeFieldList: []
    };
  }

  getValues = () => {

    let classChanges = this.state.classChanges;
    let ret = [];

    for (var key in classChanges) {

      if (!classChanges.hasOwnProperty(key)) {
        continue;
      }

      if (classChanges[key]['class'] === null || classChanges[key]['level'] === null) {
        continue;
      }

      ret.push(classChanges[key]);
    }

    // Sort values ascending.
    return ret.sort((a, b) => {
      return a['level'] - b['level']
    });
  }

  setClassOptions = () => {

    let tempOptions = [
      { key: 'null', value: null, text: 'No Class Change' }  // Add 'No Class Change' option at the start of the list.
    ];

    for (var key in classes) {

      if (!classes.hasOwnProperty(key)) {
        continue;
      }

      tempOptions.push({
        key: key,
        value: key,
        text: classes[key]['name']
      });
    }

    this.setState({
      classOptions: tempOptions
    });
  }

  modifyAttr = (id, attr, newVal) => {

    let tempClassChanges = this.state.classChanges;

    let defaultClass = tempClassChanges[id]['class'];
    let defaultLevel = tempClassChanges[id]['level'];

    tempClassChanges[id] = {
      level: (attr === 'level') ? newVal : defaultLevel,
      class: (attr === 'class') ? newVal : defaultClass
    }

    this.setState({
      classChanges: tempClassChanges
    });
  }

  deleteClassChangeInputField = (id) => {

    let tempClassChanges = this.state.classChanges;
    delete tempClassChanges[id];

    let tempClassChangeFieldList = this.state.classChangeFieldList.slice();
    for (let i = 0; i < tempClassChangeFieldList.length; i++) {
      if (tempClassChangeFieldList[i].id === id) {
        tempClassChangeFieldList.splice(i, 1);
        break;
      }
    }

    this.setState({
      classChanges: tempClassChanges,
      classChangeFieldList: tempClassChangeFieldList
    });
  }

  addClassChangeInputField = () => {

    let id = crypto.createHash('sha256').update('class-change-' + Date.now()).digest('hex');

    let tempClassChangeFieldList = this.state.classChangeFieldList.slice();
    tempClassChangeFieldList.push({
      id: id
    });

    let tempClassChanges = this.state.classChanges;
    tempClassChanges[id] = {
      class: null,
      level: null
    };

    this.setState({
      classChanges: tempClassChanges,
      classChangeFieldList: tempClassChangeFieldList
    });
  }

  renderClassChangeFields = () => {

    return this.state.classChangeFieldList.map((val) => {
      return (
        <ClassChangeField key={val.id} identifier={val.id}
          options={this.state.classOptions}
          modifyFunc={this.modifyAttr}
          deleteFunc={this.deleteClassChangeInputField}
        />
      )
    });
  }

  componentDidMount() {

    this.setClassOptions();
  }

  render() {

    return (
      <Segment>
        <Label attached='top left' color='yellow'>Class Changes</Label>

        {this.renderClassChangeFields()}

        <Button icon fluid color='blue' onClick={this.addClassChangeInputField}>
          <Icon name='add' />
        </Button>

      </Segment>
    );
  }
}

class ClassChangeField extends React.Component {

  constructor(props) {

    super(props);

    this.fixedWidthRef = React.createRef();

    this.state = {
      fixedRefWidth: 0
    };
  }

  changeClass = (e, { name, value }) => {

    this.props.modifyFunc(this.props.identifier, 'class', value);
  }

  changeLevel = (e, { name, value }) => {

    this.props.modifyFunc(this.props.identifier, 'level', parseInt(value));
  }

  delete = () => {

    this.props.deleteFunc(this.props.identifier);
  }

  componentDidMount() {

    this.setState({
      fixedRefWidth: this.fixedWidthRef.current.clientWidth
    });
  }

  render() {

    return (
      <div className='class-change-input-field'>
        <div>
          <Dropdown placeholder='No Class Change' search selection options={this.props.options} fluid onChange={this.changeClass} />
        </div>
        <div>
          <div ref={this.fixedWidthRef} style={{flexBasis: this.state.fixedRefWidth}}>
            <span>at lvl</span>
            <Input type='number' placeholder='lvl' style={{width: '3.5em'}} onChange={this.changeLevel} />
            <Button icon color='blue' style={{margin: 0, marginLeft: '1em'}} onClick={this.delete}>
              <Icon name='close' />
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default ClassChangeInput;
