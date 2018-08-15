import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { createStackNavigator } from 'react-navigation'; // Version can be specified in package.json

import GalleryEntry from './src/views/GalleryEntry.js'
import SignIn from './src/views/SignIn.js'
import ProfilePage from './src/views/ProfilePage.js';
import MyCustomCamera from './src/components/Camera';
import AddButton from './src/components/AddButton';
import CreateItem from './src/views/CreateItem.js'
import EditProfile from './src/views/EditProfile.js';
import MarketPlace from './src/views/MarketPlace.js';


const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

type Props = {};

const RootStack = createStackNavigator({

  SignIn: SignIn,

  Gallery: GalleryEntry,

  Profile: ProfilePage,

  AddButton: AddButton,

  Camera: MyCustomCamera,

  CreateItem: CreateItem,

  MarketPlace: MarketPlace,

  EditProfile: EditProfile,


},
{
  initialRouteName: 'SignIn',
  // the shared navigationOptions, which we can always override within the component
  navigationOptions: {
    title: 'SellMyStyle',
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
