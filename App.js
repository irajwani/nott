import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { createStackNavigator } from 'react-navigation'; // Version can be specified in package.json

var firebase = require("firebase");

import InputPage from './src/views/InputPage.js'
import Registration from './src/views/Registration.js'
import ProfilePage from './src/views/ProfilePage.js';
import MyCustomCamera from './src/components/Camera';
import AddButton from './src/components/AddButton';
import CreateItem from './src/views/CreateItem.js'

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

type Props = {};

const RootStack = createStackNavigator({

  login: Registration,

  inputs: InputPage,

  profile: ProfilePage,

  AddButton: AddButton,

  camera: MyCustomCamera,

  CreateItem: CreateItem,

},
{
  initialRouteName: 'profile',
  // the shared navigationOptions, which we can always override within the component
  navigationOptions: {
    title: 'NottMyStyle',
    headerStyle: {
      backgroundColor: '#800000',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
      fontFamily: 'American Typewriter'
    },
  },
}


)

export default class App extends Component<Props> {


  componentWillMount() {
    const config = {
      apiKey: "AIzaSyBUkOB1x1F-bsZcGDnxXQI76JbU-4n8vqI",
      authDomain: "nottmystyle-447aa.firebaseapp.com",
      databaseURL: "https://nottmystyle-447aa.firebaseio.com",
      projectId: "nottmystyle-447aa",
      storageBucket: "",
      messagingSenderId: "791527199565"
    };
    firebase.initializeApp(config);
  }

  

  

  render() {
    console.disableYellowBox = true;
    console.log('Initializing Application')
    return (
      
        <RootStack />
      
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
