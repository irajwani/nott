import React, { Component } from 'react'
import { Text, StyleSheet, View, Image, ImageBackground } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome';
import AddButton from '../components/AddButton.js';
import {Button} from 'react-native-elements'
import {withNavigation, StackNavigator} from 'react-navigation'; // Version can be specified in package.json
import CreateItem from './CreateItem.js';
import firebase from '../cloud/firebase.js';
import {database} from '../cloud/database';
import {storage} from '../cloud/storage';



const resizeMode = 'center';

class ProfilePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sellItem: false,
      products: [],
    }

  }

  componentWillMount() {
    this.getProducts();
  }

  getProducts() {
    
    const keys = [];
    database.then( (d) => {
      var uids = Object.keys(d.Users);
      var keys = [];
      for(uid of uids) {
        Object.keys(d.Users[uid].products).forEach( (key) => keys.push(key));
      }
      var products = [];
      
      for(const uid of uids) {
        for(const key of keys) {
          storage.child(`${uid}/${key}`).getDownloadURL()
          .then( (uri) => {
            products.push( {uid: uid, uri: uri, text: d.Users[uid].products[key] } )
          } )
          
        }
      }

      

      this.setState({ products })
    })
    .catch( (err) => {console.log(err) })
    
  }
  
  render() {
    console.log(this.state.products);
    if(this.state.sellItem) {
      console.log(this.props.uid);
      return ( <CreateItem uid={this.props.uid} /> )
    }

    
    
    return (
      <View style={styles.container}>
      
        <ImageBackground
            style={styles.pattern}
            source={require('../images/profile_bg.jpg')}
          >
        
        
          <Image style= {styles.avatar} source={require('../images/blank.jpg')} />
          <Text> {this.props.name} </Text>
          <View style={styles.locationbar}>
            <Icon name='rocket' />
            <Text>Hails from: {this.props.location}</Text>
          </View>
        </ImageBackground> 
        
        <Button
            large
            icon={{name: 'user', type: 'font-awesome'}}
            title='EDIT PROFILE'
            onPress={() => {this.props.navigation.navigate('EditProfile')}} 

        />
        
        <Button
            large
            icon={{name: 'plus', type: 'font-awesome'}}
            title='SELL AN ITEM'
            onPress={() => this.setState({sellItem: true})} 

        />

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
                    onPress={ () => this.props.navigation.navigate('MarketPlace', this.state.products) } />  
        

      </View>
    )
  
  }
}

export default withNavigation(ProfilePage)

const styles = StyleSheet.create({
  container: {
    flex: 1,
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


