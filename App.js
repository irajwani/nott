import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { createStackNavigator } from 'react-navigation'; // Version can be specified in package.json

import GalleryEntry from './src/views/GalleryEntry.js';
import SignIn from './src/views/SignIn.js';
import HomeScreen from './src/views/HomeScreen.js';
import ProfilePage from './src/views/ProfilePage.js';
import MyCustomCamera from './src/components/Camera';
import AddButton from './src/components/AddButton';
import CreateItem from './src/views/CreateItem.js'
import EditProfile from './src/views/EditProfile.js';
import MarketPlace from './src/views/MarketPlace.js';
import CustomChat from './src/views/CustomChat.js';
import PictureAddButton from './src/components/PictureAddButton.js';
import PictureCamera from './src/components/PictureCamera.js';
import Demo from './src/views/Demo.js';
import Demotwo from './src/views/Demotwo.js';


type Props = {};

const RootStack = createStackNavigator({

  SignIn: SignIn,

  HomeScreen: HomeScreen,

  Gallery: GalleryEntry,

  Profile: ProfilePage,

  AddButton: AddButton,

  Camera: MyCustomCamera,

  PictureAddButton: PictureAddButton,

  PictureCamera: PictureCamera,

  CreateItem: CreateItem,

  MarketPlace: MarketPlace,

  CustomChat: CustomChat,

  EditProfile: EditProfile,


},
{
  initialRouteName: 'SignIn',
  // the shared navigationOptions, which we can always override within the component
  navigationOptions: {
    title: 'SellMyStyle',
    headerStyle: {
      backgroundColor: '#121fb5',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
      fontFamily: 'Verdana'
    },
  },
}


)

export default class App extends Component<Props> {

  render() {
    console.disableYellowBox = true;
    console.log('Initializing Application')
    return (
      
        <Demotwo />
      
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
