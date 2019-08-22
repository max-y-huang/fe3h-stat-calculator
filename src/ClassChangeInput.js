
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
      values: {
        '0': { 'level': 0, 'class': null },
        '1': { 'level': 0, 'class': null },
        '2': { 'level': 0, 'class': null },
        '3': { 'level': 0, 'class': null },
        '4': { 'level': 0, 'class': null }
      }
    }
  }

  getValues = () => {

    let values = this.state.values;
    let ret = [];

    for (var key in values) {

      if (!values.hasOwnProperty(key)) {
        continue;
      }

      if (!this.getActive(key) || values[key]['class'] === null) {
        continue;
      }

      ret.push(values[key]);
    }

    // Sort values ascending.
    return ret.sort((a, b) => {
      return a['level'] > b['level']
    });
  }

  // Passed to ClassChangeSelect as 'active' prop. Also used in getValues().
  getActive = (index) => {

    let level = this.state.values[index]['level'];

    // Inactive if not first index with value.
    // Check all indices before index for inactivity.
    for (let i = 0; i < index; i++) {
      if (this.state.values[i]['level'] === level) {
        return false;
      }
    }

    return true;
  }

  // Passed to ClassChangeSelect as 'level' prop.
  getLevel = (index) => {

    let value = this.state.values[index];

    if (!value) {
      return '-';
    }

    return !value['level'] ? '-' : value['level'];
  }

  // Passed to ClassChangeSelect and ClassChangeSlider as an on modify callback.
  // 'attr' can have a value of 'level' or 'class'.
  modifyAttr = (index, attr, newVal) => {

    let tempValues = this.state.values;

    let defaultClass = tempValues[index + '']['class'];
    let defaultLevel = tempValues[index + '']['level'];

    tempValues[index + ''] = {
      level: (attr === 'level') ? newVal : defaultLevel,
      class: (attr === 'class') ? newVal : defaultClass
    }

    this.setState({
      values: tempValues
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

  componentDidMount() {

    this.setClassOptions();
  }

  renderClassChangeSelect = () => {

    return [...Array(5).keys()].map((i) => {  // Loop through numeric indices as a map() function
      return (
        <ClassChangeSelect
          key={i} index={i} options={this.state.classOptions} modifyFunc={this.modifyAttr}
          active={this.getActive(i)}
          level={this.getLevel(i)}
        />
      )
    });
  }

  render() {

    return(
      <Grid className='class-change-grid'>

        <Grid.Column>
          <Segment>
            {/* Let the minimum level be the unit's base level. */}
            <ClassChangeSlider ref={this.sliderRef} min={this.props.character['level']} max={50} modifyFunc={this.modifyAttr} />
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

    let min = this.props.min;
    this.state = {
      values: [
        min, min, min, min, min  // Start with all sliders at the minimum value.
      ]
    }
  }

  onModify = () => {

    for (let i = 0; i < this.state.values.length; i++) {
      this.props.modifyFunc(i, 'level', this.state.values[i]);  // Passed from ClassChangeInput.
    }
  }

  componentDidMount = () => {

    this.onModify();  // Level values (in parent) are initially set at 0. Set them to the starting level upon mount.
  }

  componentDidUpdate(prevProps, prevStates) {

    if (prevStates.values !== this.state.values) {
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

  onModify = (e, { value }) => {

    this.props.modifyFunc(this.props.index, 'class', value);  // Passed from ClassChangeInput.
  }

  render() {

    if (!this.props.active) {
      return null;
    }

    return (
      <Form.Field>
        <Label color='pink'>Level {this.props.level}</Label>
        <Dropdown placeholder='No Class Change' fluid search selection options={this.props.options} onChange={this.onModify}/>
      </Form.Field>
    )
  }
}

export default ClassChangeInput;