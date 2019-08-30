
import React from 'react';
import { Segment, Label, Form, Grid, Dropdown } from 'semantic-ui-react';
import { Range } from 'react-range';

import './css/classChangeInput.css';

import classes from './data/classes.json';

class ClassChangeInput extends React.Component {

  constructor(props) {

    super(props);
    
    this.sliderRef = React.createRef();
    this.state = {
      classOptions: [],  // set in componentDidMount()
      classChanges: {
        '0': { 'level': 1, 'class': null },
        '1': { 'level': 1, 'class': null },
        '2': { 'level': 1, 'class': null },
        '3': { 'level': 1, 'class': null },
        '4': { 'level': 1, 'class': null }
      }
    }
  }

  getValues = () => {

    let classChanges = this.state.classChanges;
    let ret = [];

    for (var key in classChanges) {

      if (!classChanges.hasOwnProperty(key)) {
        continue;
      }

      if (!this.getActive(key) || classChanges[key]['class'] === null) {
        continue;
      }

      ret.push(classChanges[key]);
    }

    // Sort values ascending.
    return ret.sort((a, b) => {
      return a['level'] - b['level']
    });
  }

  // Passed to ClassChangeSelect as 'active' prop. Also used in getValues().
  getActive = (index) => {

    let level = this.state.classChanges[index]['level'];

    // Inactive if not first index with value.
    // Check all indices before index for inactivity.
    for (let i = 0; i < index; i++) {
      if (this.state.classChanges[i]['level'] === level) {
        return false;
      }
    }

    return true;
  }

  // Passed to ClassChangeSelect as 'level' prop.
  getLevel = (index) => {

    let classChanges = this.state.classChanges[index];

    if (!classChanges) {
      return '-';
    }

    return !classChanges['level'] ? '-' : classChanges['level'];
  }

  // Passed to ClassChangeSelect and ClassChangeSlider as an on modify callback.
  // 'attr' can have a value of 'level' or 'class'.
  modifyAttr = (index, attr, newVal) => {

    let tempClassChanges = this.state.classChanges;

    let defaultClass = tempClassChanges[index + '']['class'];
    let defaultLevel = tempClassChanges[index + '']['level'];

    tempClassChanges[index + ''] = {
      level: (attr === 'level') ? newVal : defaultLevel,
      class: (attr === 'class') ? newVal : defaultClass
    }

    this.setState({
      classChanges: tempClassChanges
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

  renderClassChangeSelect = () => {

    return [...Array(5).keys()].map((i) => {  // Loop through numeric indices as a map() function
      return (
        <ClassChangeSelect
          key={i} index={i} options={this.state.classOptions} resetFlag={this.props.resetFlag} modifyFunc={this.modifyAttr}
          active={this.getActive(i)}
          level={this.getLevel(i)}
        />
      )
    });
  }

  componentDidMount() {
    
    this.setClassOptions();
  }

  render() {

    return(
      <Grid className='class-change-grid'>

        <Grid.Column>
          <Segment>
            <ClassChangeSlider ref={this.sliderRef} min={1} max={50} resetFlag={this.props.resetFlag} modifyFunc={this.modifyAttr} />
          </Segment>
        </Grid.Column>
        
        <Grid.Column>
          <Segment>
            <Form>{this.renderClassChangeSelect()}</Form>
          </Segment>
        </Grid.Column>

      </Grid>
    );
  }

}

class ClassChangeSlider extends React.Component {

  constructor(props) {

    super(props);

    this.state = {
      values: [ 1, 1, 1, 1, 1 ]
    };
  }

  onReset = () => {

    this.setState({
      values: [ 1, 1, 1, 1, 1 ]
    }, () => {

      this.onModify();
    });
  }

  onModify = () => {

    for (let i = 0; i < this.state.values.length; i++) {
      this.props.modifyFunc(i, 'level', this.state.values[i]);  // Passed from ClassChangeInput.
    }
  }

  componentDidMount = () => {

    this.onReset();
  }

  componentDidUpdate(prevProps, prevStates) {

    if (prevProps.resetFlag !== this.props.resetFlag) {
      this.onReset();
      this.onModify();
    }

    else if (prevStates.values !== this.state.values) {
      this.onModify();
    }
  }
  
  render() {
    
    return (
      <div className='range-container'>
        <Range direction='to bottom' allowOverlap step={1} min={this.props.min} max={this.props.max} values={this.state.values}
          onChange={
            values => this.setState({ values })
          }
          renderTrack={({ props, children }) => (
            <div className='range' style={{...props.style}}>
              <div className='track' ref={props.ref}>{children}</div>
            </div>
          )}
          renderThumb={({ props, index }) => (
            <div className='thumb' {...props} style={{...props.style}}>
              <Label pointing='left' color='pink'>
                {this.state.values[index]}
              </Label>
            </div>
          )}
        />
      </div>
    );
  }
}

class ClassChangeSelect extends React.Component {

  constructor(props) {

    super(props);

    this.dropdownRef = React.createRef();
  }

  onReset = () => {

    if (!this.dropdownRef.current) {
      return;
    }

    this.dropdownRef.current.setState({
      value: null  // Changing this value modifies the dropdown value.
    }, () => {

      this.props.modifyFunc(this.props.index, 'class', null);  // Passed from ClassChangeInput.
    });
  }

  onModify = (e, { value }) => {

    this.props.modifyFunc(this.props.index, 'class', value);  // Passed from ClassChangeInput.
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

    if (!this.props.active) {
      return null;
    }

    return (
      <Form.Field>
        <Label color='pink'>Level {this.props.level}</Label>
        <Dropdown ref={this.dropdownRef} placeholder='No Class Change' fluid search selection options={this.props.options} onChange={this.onModify}/>
      </Form.Field>
    )
  }
}

export default ClassChangeInput;
