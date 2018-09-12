import React, { Component } from 'react'
import { Dimensions, View, Image, StyleSheet, ScrollView, RefreshControl, TouchableOpacity, TouchableHighlight } from 'react-native';
import {withNavigation, StackNavigator} from 'react-navigation'; // Version can be specified in package.json
import { Container, Header, Content, Card, CardItem, Thumbnail, Text, Left, Body } from 'native-base';
import {Button} from 'react-native-elements'
import Icon from 'react-native-vector-icons/FontAwesome'
import firebase from '../cloud/firebase.js';
import {database, p} from '../cloud/database';
import {storage} from '../cloud/storage';
import * as Animatable from 'react-native-animatable';
import Collapsible from 'react-native-collapsible';
import Accordion from 'react-native-collapsible/Accordion';

import Chatkit from "@pusher/chatkit";

const CHATKIT_SECRET_KEY = "9b627f79-3aba-48df-af55-838bbb72222d:Pk9vcGeN/h9UQNGVEv609zhjyiPKtmnd0hlBW2T4Hfw="
const CHATKIT_TOKEN_PROVIDER_ENDPOINT = "https://us1.pusherplatform.io/services/chatkit_token_provider/v1/7a5d48bb-1cda-4129-88fc-a7339330f5eb/token";
const CHATKIT_INSTANCE_LOCATOR = "v1:us1:7a5d48bb-1cda-4129-88fc-a7339330f5eb";


var {height, width} = Dimensions.get('window');


class MarketPlace extends Component {
  constructor(props) {
      super(props);
      this.state = {
        refreshing: false,
        isGetting: true,
        activeSectionL: false,
        activeSectionR: false,
        collapsed: true,
      };
      //this.navToChat = this.navToChat.bind(this);
  }

  componentWillMount() {
    setTimeout(() => {
      this.getProducts();
    }, 4);
  }

  findRoom(rooms, key) {
    for(var room of rooms ) {
      
      if(room.name === key) {return room.id}
    }
  }

  navToChat(key) {
    console.log(key);
    //create separate Chats branch
    const CHATKIT_USER_NAME = firebase.auth().currentUser.uid;
    const tokenProvider = new Chatkit.TokenProvider({
      url: CHATKIT_TOKEN_PROVIDER_ENDPOINT
    });
  
    // This will instantiate a `chatManager` object. This object can be used to subscribe to any number of rooms and users and corresponding messages.
    // For the purpose of this example we will use single room-user pair.
    const chatManager = new Chatkit.ChatManager({
      instanceLocator: CHATKIT_INSTANCE_LOCATOR,
      userId: CHATKIT_USER_NAME,
      tokenProvider: tokenProvider
    });
  
    chatManager.connect().then(currentUser => {
      
      this.currentUser = currentUser;
      
      var roomExists = this.currentUser.rooms.filter(room => (room.name == key));

      console.log(roomExists.length);
      setTimeout(() => {

        if(this.currentUser.rooms.length > 0 && roomExists.length > 0 ) {
          //first check if you've already subscribed to this room
          for(var room of this.currentUser.rooms) {
           var {name} = room;
           console.log(name);
           if(name === key) { 
              console.log('navigating to room')
              
              this.props.navigation.navigate( 'CustomChat', {key: key, id: this.findRoom(this.currentUser.rooms, key)} )
                            }
    
          }
    
          //subscribe to room and navigate to it
          
        } else {
          //subscribe to at least the room for this product
          console.log('subscribe to your very first product chat room')
          this.currentUser.getJoinableRooms().then( (rooms) => {  
            
            this.currentUser.joinRoom( {
              roomId: this.findRoom(rooms, key)
            })
            setTimeout(() => {
              this.props.navigation.navigate( 'CustomChat', {key: key, id: this.findRoom(rooms, key)} )
            }, 1000);
            //this.setState({id: this.findRoom(rooms, key) });  
    
          }  )
          
          
          
    
        }
      }, 3000);
      
      //first find roomId from key
      
      

      
      
      
    });
  }


  //switch between collapsed and expanded states
  toggleExpanded = () => {
    this.setState({ collapsed: !this.state.collapsed });
  };

  setSectionL = section => {
    this.setState({ activeSectionL: section });
  };

  setSectionR = section => {
    this.setState({ activeSectionR: section });
  };

  renderHeader = (section, _, isActive) => {
    return (
      <Animatable.View
        duration={400}
        style={[styles.card, isActive ? styles.active : styles.inactive]}
        transition="backgroundColor"
      >
        
                <Image source={{uri: section.uri}} style={{height: 195, width: (width/2 - 15)}}/>

              

      </Animatable.View>
    );
  };

  renderContent = (section, _, isActive) => {
    return (
      <Animatable.View
        duration={400}
        style={[styles.card, isActive ? styles.active : styles.inactive]}
        transition="backgroundColor"
      >
          
        <Animatable.Text animation={isActive ? 'bounceIn' : undefined}>
          {section.text.name}
        </Animatable.Text>
        <Animatable.Text animation={isActive ? 'fadeInDownBig' : undefined}>
          {section.text.brand}
        </Animatable.Text>
        <Animatable.Text animation={isActive ? 'fadeInUpBig' : undefined}>
          {section.text.description}
        </Animatable.Text>
        <Animatable.Text animation={isActive ? 'slideInLeft' : undefined}>
          {section.text.gender}
        </Animatable.Text>
        <Animatable.Text animation={isActive ? 'slideInRight' : undefined}>
          {section.text.type}
        </Animatable.Text>
        <Animatable.Text animation={isActive ? 'bounceIn' : undefined}>
          {section.text.condition}
        </Animatable.Text>
        <Animatable.Text animation={isActive ? 'bounceRight' : undefined}>
          {section.text.size}
        </Animatable.Text>
        
        
        <Animatable.Text style={{fontFamily: 'verdana', fontSize: 9, fontWeight: 'bold', color: 'blue'}} animation={isActive ? 'bounceLeft' : undefined}>
          ${section.text.price}
        </Animatable.Text>

        <Button
                  
                  buttonStyle={{
                      backgroundColor: "#800000",
                      width: 100,
                      height: 40,
                      borderColor: "transparent",
                      borderWidth: 0,
                      borderRadius: 5
                  }}
                  icon={{name: 'credit-card', type: 'font-awesome'}}
                  title='BUY'
                  onPress = { () => { 
                    console.log('going to chat');
                    //subscribe to room key
                    this.navToChat(section.key);
                    } }

                  />

        
        
      </Animatable.View>
    );
  }

  

  getProducts() {
    
    const keys = [];
    database.then( (d) => {
      //get list of uids for all users
      var a = d.Products;
      var productsl = a.slice(0, (a.length % 2 == 0) ? a.length/2  : Math.floor(a.length/2) + 1 )
      var productsr = a.slice( Math.round(a.length/2) , a.length + 1);
      console.log(a, productsl, productsr);
      this.setState({ productsl, productsr });
      
      

    })
    .then( () => { this.setState( {isGetting: false} );  } )
    .catch( (err) => {console.log(err) })
    
  }

  // componentWillMount() {
  //   var products = this.getProducts();
  //   return products;
  // }
  


  render() {

    
    if(this.state.isGetting) {
      return ( 
        <View>
          <Text>Loading...</Text>
        </View>
      )
    }
    
    return (

      
      <ScrollView
             contentContainerStyle={styles.contentContainerStyle}
      >
        
        <Accordion
          activeSection={this.state.activeSectionL}
          sections={this.state.productsl}
          touchableComponent={TouchableOpacity}
          renderHeader={this.renderHeader}
          renderContent={this.renderContent}
          duration={400}
          onChange={this.setSectionL}
        />

        <Accordion
          activeSection={this.state.activeSectionR}
          sections={this.state.productsr}
          touchableComponent={TouchableOpacity}
          renderHeader={this.renderHeader}
          renderContent={this.renderContent}
          duration={400}
          onChange={this.setSectionR}
        />

      </ScrollView> 
            
    )
  
  }
}

export default withNavigation(MarketPlace);

const styles = StyleSheet.create({

  contentContainerStyle: {
    flexGrow: 4,   
    flexDirection: 'row',
    flexWrap: 'wrap'
      },
  
  mainContainer:{
    marginTop:15,
    marginLeft:20,
    marginRight:20
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#F5FCFF',
  },
  title: {
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '300',
    marginBottom: 20,
  },
  header: {
    backgroundColor: '#F5FCFF',
    padding: 10,
  },
  headerText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '500',
  },
  content: {
    padding: 20,
    backgroundColor: '#fff',
  },
  card: {
    backgroundColor: '#fff',
    width: (width / 2) - 10,
    height: 200,
    marginLeft: 2,
    marginRight: 2,
    marginTop: 2,
    padding: 5,
  } ,
  active: {
    backgroundColor: '#8cdbab',
  },
  inactive: {
    backgroundColor: '#fff',
  },
  selectors: {
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  selector: {
    backgroundColor: '#F5FCFF',
    padding: 10,
  },
  activeSelector: {
    fontWeight: 'bold',
  },
  selectTitle: {
    fontSize: 14,
    fontWeight: '500',
    padding: 10,
  },
});


{/* <Image
            
            style={{width: 150, height: 150}}
            source={ {uri: product.uri} }/> */}

            // refreshControl = {
            //   <RefreshControl 
            //     refreshing={this.state.refreshing} 
            //     onRefresh={() => {this.getProducts();}}

            //     />}
            // <Button
            
            // buttonStyle={{
            //     backgroundColor: "#000",
            //     width: 100,
            //     height: 40,
            //     borderColor: "transparent",
            //     borderWidth: 0,
            //     borderRadius: 5
            // }}
            // icon={{name: 'credit-card', type: 'font-awesome'}}
            // title='BUY'
            // onPress = { () => { navigate('CustomChat', {key: '-LLEL8jZIaK_AmjuXhUb'}) } }
            // />