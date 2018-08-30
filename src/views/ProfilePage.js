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

      <View style={ {flexDirection: 'column', justifyContent: 'center'} }>

        {this.state.uri ? <Image style= {styles.avatar} source={ {uri: this.state.uri} }/>
        : <Image style= {styles.avatar} source={require('../images/blank.jpg')}/>} 
        <Text>{this.state.name}</Text>
        <Text>{this.state.email}</Text>
        

        <Button
                    title='SellMyStyle Market' 
                    titleStyle={{ fontWeight: "700" }}
                    buttonStyle={{
                    backgroundColor: "#0a3f93",
                    width: 300,
                    height: 45,
                    borderColor: "transparent",
                    borderWidth: 0,
                    borderRadius: 5
                    }}
                    containerStyle={{ marginTop: 20, marginBottom: 20 }} 
                    onPress={ () => {this.setState( {showMarket: true} )} } />  
      </View>


    )


  }

}

export default withNavigation(ProfilePage)

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column'
  },

  avatar: {
    height: 30,
    width: 30
  },

  locationbar: {
    flexDirection: 'row'
  },

  pattern: {
    backgroundColor: '#ccc',
    flex: 1,
    position: 'absolute',
    width: '100%',
    height: '30%',
    justifyContent: 'center',
  },

  

})


