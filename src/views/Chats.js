import React, { Component } from 'react'
import { Text, StyleSheet, ScrollView, View, TouchableHighlight } from 'react-native'

import {database} from '../cloud/database'
import firebase from '../cloud/firebase';

import { withNavigation } from 'react-navigation';


class Chats extends Component {

  constructor(props) {
    super(props);
    this.state = { chats: [], isGetting: true };
  }

  componentWillMount() {
    setTimeout(() => {
      this.getChats();
    }, 5000);
  }

  getChats() {
    var your_uid = firebase.auth().currentUser.uid;
    const keys = [];
    database.then( (d) => {
      console.log(d.Users[your_uid].chats)
      this.setState({ chats: d.Users[your_uid].chats })

    })
    .then( () => { this.setState( {isGetting: false} );  } )
    .catch( (err) => {console.log(err) })
    
  }

  navToChat(id) {
    this.props.navigation.navigate('CustomChat', {id: id})
  }

  
  render() {
    const {chats} = this.state
    if(this.state.isGetting) {
      return ( 
        <View>
          <Text>Loading...</Text>
        </View>
      )
    }
    console.log(typeof chats[0])
    chats.map( (chat) => {
      console.log(chat.id);
    })
    return (
      <ScrollView 
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'space-between',
        }}
      >
             
            
        
      
        {chats.map( (chat) => {
          return(
            <View key={chat.name}>
              <Text>{chat.id}</Text>
            </View>
          )
            
          })}

      </ScrollView>
    )
  }
}

export default withNavigation(Chats)

const styles = StyleSheet.create({})


