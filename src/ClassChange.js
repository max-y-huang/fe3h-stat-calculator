import React from 'react';
import { Header, Button, Icon } from 'semantic-ui-react';

import WindowWrapper from './WindowWrapper';
import ClassChangeInput from './ClassChangeInput';

class ClassChange extends React.Component {

  constructor(props) {

    super(props);
    
    this.classChangeRef = React.createRef();
  }

  onApply = () => {
    
    let values = this.classChangeRef.current.getValues();
    this.props.appliedFunc(values);  // Passed from App.
  }

  render() {

    let character = this.props.character;

    return (
      <WindowWrapper
        headerTitle={
          <Header>{character['name']}</Header>
        }
        headerButtons={
          <Button icon color='blue' onClick={this.onApply}>
            <Icon name='check' />
          </Button>
        }
        body={
          <ClassChangeInput ref={this.classChangeRef} character={character} resetFlag={this.props.resetFlag} />
        }
      />
    );
  }
}

export default ClassChange;
