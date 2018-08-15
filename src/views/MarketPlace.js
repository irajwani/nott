import React, { Component } from 'react'
import { Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import {withNavigation, StackNavigator} from 'react-navigation'; // Version can be specified in package.json
import firebase from '../cloud/firebase.js';


class MarketPlace extends Component {
  constructor(props) {
      super(props);
      this.state = {
        refreshing: false,
      };
  }

  generateProducts(uids, keys) {
    const products = [];
    for(uid of uids) {
      for(key of keys) {
        
        
        firebase.database().ref('Users/' + uid  + '/products/' + key + '/').once('value')
        .then( (snapshot) => {products.push(snapshot.val());} )

      }
    }
    return products;
  }


  getProducts() {
    this.setState({ refreshing: true });
    const uids = [];
    const keys = [];
    

    firebase.database().ref('Users/').once('value')
    .then(
      function(snapshot) {
        uids.push(Object.keys(snapshot.val()));
        return uids
      }
    )
    .then( 
      (uids) => {
        for(uid of uids) {
          //get all the keys
          firebase.database().ref('Users/' + uid + '/' + 'products/').once('value')
          .then(
            function(snapshot) {
              keys.push(Object.keys(snapshot.val()))
            }
          )

      };
    }
      
    )
    .then( () => {
      
      


    } )
    .then(() => {
      this.setState({ refreshing: false })
      
      
      
    });
    
    

    
    
    
  }

  render() {
    
    return (
      <ScrollView
             contentContainerStyle={{
                    flexGrow: 1,
                    justifyContent: 'space-between'
                }}
              refreshControl = {
                <RefreshControl 
                  refreshing={this.state.refreshing} 
                  onRefresh={() => {this.getProducts();}}

                  />}
      >
        <Text>YO YO</Text>
        <Text>sflffkff ksff </Text>

      </ScrollView>          
    )
  }
}

export default withNavigation(MarketPlace);

const styles = StyleSheet.create({})
