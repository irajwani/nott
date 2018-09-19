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
import AddButton from './src/components/AddButton';
import CreateItem from './src/views/CreateItem.js'
import EditProfile from './src/views/EditProfile.js';
import MarketPlace from './src/views/MarketPlace.js';
import CustomChat from './src/views/CustomChat.js';
import PictureCamera from './src/components/PictureCamera.js';
import Comments from './src/views/Comments.js';
import UserComments from './src/views/UserComments.js';
import Users from './src/views/Users.js';


type Props = {};

const RootStack = createStackNavigator({

  SignIn: SignIn,

  HomeScreen: HomeScreen,

  Gallery: GalleryEntry,

  Profile: ProfilePage,

  AddButton: AddButton,

  PictureCamera: PictureCamera,

  CreateItem: CreateItem,

  MarketPlace: MarketPlace,

  Comments: Comments,

  UserComments: UserComments,

  CustomChat: CustomChat,

  EditProfile: EditProfile,

  Users: Users,


},
{
  initialRouteName: 'SignIn',
  // the shared navigationOptions, which we can always override within the component
  navigationOptions: {
    title: 'NottMyStyle',
    headerStyle: {
      backgroundColor: '#37a1e8',
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
