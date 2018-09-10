import React, { Component } from 'react'
import {  StyleSheet, ScrollView, View, TouchableHighlight } from 'react-native'
import { Container, Header, Content, Card, CardItem, Thumbnail, Text, Icon, Left, Body, Right } from 'native-base'
import {Button} from 'react-native-elements';

import {database} from '../cloud/database'
import firebase from '../cloud/firebase';

import { withNavigation } from 'react-navigation';

const noChatsText = "You have not initiated any chats. You may initiate a conversation with a seller by choosing to 'Buy' a product from the marketplace"

class Chats extends Component {

  constructor(props) {
    super(props);
    this.state = { chats: [], isGetting: true, noChats: false };
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
      if(d.Users[your_uid].chats) {
        this.setState({ chats: d.Users[your_uid].chats })
      } else {
        this.setState( {noChats: true} )
      }
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

    if(this.state.noChats) {
      return (
        <View>
          <Text>{noChatsText}</Text>
        </View>
      )
    }
    
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
              
              
              <Card>
                <CardItem bordered>
                  <Body>

                    <Text> {chat.seller} </Text>
                    
                    

                  </Body>
                  
                  
                    
                      
                  
                </CardItem>
                <CardItem footer bordered>
                    <Button
                        small
                        buttonStyle={{
                            backgroundColor: "#5db2dd",
                            width: 100,
                            height: 40,
                            borderColor: "transparent",
                            borderWidth: 0,
                            borderRadius: 5
                        }}
                        icon={{name: 'envelope', type: 'font-awesome'}}
                        title='Message'
                        onPress={() => { this.navToChat(chat.id) } } 
                        />
                  </CardItem>
              </Card>

            </View>
          )
            
          })}

      </ScrollView>
    )
  }
}

export default withNavigation(Chats)

const styles = StyleSheet.create({})


