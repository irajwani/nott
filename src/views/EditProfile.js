import React, { Component } from 'react'
import { Text, StyleSheet, View } from 'react-native';
import {withNavigation, StackNavigator} from 'react-navigation'; // Version can be specified in package.json
import {ButtonGroup, Button} from 'react-native-elements';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { Sae, Fumi } from 'react-native-textinput-effects';
import firebase from '../cloud/firebase.js';


class EditProfile extends Component {
  constructor(props) {
      super(props);
      this.state = {
          name: '',
          size: 1,
      }
  }

  updateFirebase(uid, data) {
    var updates = {};
    switch(data.size) {
        case 0:
            data.size = 'Small'
            break; 
        case 1:
            data.size = 'Medium'
            break;
        case 2:
            data.size = 'Large'
            break;
        case 3:
            data.size = 'Extra Large'
            break;
        default:
            data.size = 'Medium'
            console.log('no gender was specified')
    }

    updates['/Users/' + uid + '/profile/' + '/'] = data;

    return firebase.database().ref().update(updates);
  }

  createUser(uid, data) {
    console.log(uid);
  }

  render() {
    const uid = firebase.auth().currentUser.uid;
    return (
      <View>
        <Sae
            label={'FirstName LastName'}
            iconClass={FontAwesomeIcon}
            iconName={'signature'}
            iconColor={'#f95a25'}
            value={this.state.name}
            onChangeText={name => this.setState({ name })}
            autoCorrect={false}
            inputStyle={{ color: '#0a3f93' }}
        />

        <ButtonGroup
            onPress={ (index) => {this.setState({size: index})}}
            selectedIndex={this.state.size}
            buttons={ ['S', 'M', 'L', 'XL'] }
                
        />

        <Button
            large
            icon={{name: 'save', type: 'font-awesome'}}
            title='SAVE'
            onPress={() => {this.updateFirebase(uid, this.state); this.createUser(uid, this.state); } } 
        />
        
      </View>
    )
  }
}

export default withNavigation(EditProfile);

const styles = StyleSheet.create({})
