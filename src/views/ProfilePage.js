import React, { Component } from 'react'
import { Text, StyleSheet, View, Image, ImageBackground } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome';
import {Button} from 'react-native-elements'
import {withNavigation, StackNavigator} from 'react-navigation'; // Version can be specified in package.json
import firebase from '../cloud/firebase.js';
import {database} from '../cloud/database';
import {storage} from '../cloud/storage';
import MarketPlace from './MarketPlace.js';

const resizeMode = 'center';

class ProfilePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: 'khjkbkvjv',
      email: '',
      uri: '',
      sellItem: false,
      products: [],
      showMarket: false,
    }

  }

  componentWillMount() {
    this.getProducts();
  }

  getProducts() {
    var your_uid = firebase.auth().currentUser.uid;
    const keys = [];
    database.then( (d) => {
      //get list of uids for all users
      var uids = Object.keys(d.Users);
      console.log(uids)
      var keys = [];
      //get all keys for each product iteratively across each user
      for(uid of uids) {
        if(Object.keys(d.Users[uid]).includes('products') ) {
          Object.keys(d.Users[uid].products).forEach( (key) => keys.push(key));
        }
      }
      console.log(keys);
      var products = [];
      
      for(const uid of uids) {
        for(const key of keys) {

          if(Object.keys(d.Users[uid]).includes('products') ) {

            if( Object.keys(d.Users[uid].products).includes(key)  ) {

              storage.child(`${uid}/${key}`).getDownloadURL()
              .then( (uri) => {
                products.push( {key: key, uid: uid, uri: uri, text: d.Users[uid].products[key] } )
              } )


            }
          
          }

          
          
        }
      }

      var {uri} = d.Users[your_uid].profile
      var name = d.Users[your_uid].profile.name;
      var email = d.Users[your_uid].profile.email;
      console.log(name);
      this.setState({ name, email, uri, products })
    })
    .catch( (err) => {console.log(err) })
    
  }

  render() {

    if(this.state.showMarket) {
      return ( <MarketPlace products = {this.state.products} />)
    }

    return (

      <View style={styles.container}>

        <ImageBackground style={styles.headerBackground} source={require('../images/profile_bg.jpg')}>
        <View style={styles.header}>
          <View style={styles.profilepicWrap}>
          {this.state.uri ? <Image style= {styles.profilepic} source={ {uri: this.state.uri} }/>
        : <Image style= {styles.profilepic} source={require('../images/blank.jpg')}/>} 
          </View>

          <Text style={styles.name}>{this.state.name}</Text>
          <Text style={styles.pos}>{this.state.email} </Text>
          <Icon.Button name="edit" backgroundColor="#3b5998" onPress={() => {this.props.navigation.navigate('EditProfile')}}>
            <Text style={{fontFamily: 'Arial', fontSize: 15}}>Edit Profile</Text>
          </Icon.Button>
        </View>
      </ImageBackground>
        

      </View>


    )


  }

}

export default withNavigation(ProfilePage)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',

  },

  headerBackground: {
    flex: 1,
    width: null,
    alignSelf: 'stretch'
  },
  header: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'rgba(0,0,0, 0.5)',
  },
  profilepicWrap: {
    width: 180,
    height: 180,
    borderRadius: 100,
    borderColor: 'rgba(0,0,0,0.4)',
    borderWidth: 16,
  },
  profilepic: {
    flex: 1,
    width: null,
    alignSelf: 'stretch',
    borderRadius: 100,
    borderColor: '#fff',
    borderWidth: 4
  },
  name: {
    marginTop: 20,
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold'
  },
  pos: {
    fontSize: 16,
    color: '#0394c0',
    fontWeight: '600',
    fontStyle: 'italic'
  }

});


