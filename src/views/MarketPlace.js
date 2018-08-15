import React, { Component } from 'react'
import { View, Text, Image, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import {withNavigation, StackNavigator} from 'react-navigation'; // Version can be specified in package.json
import firebase from '../cloud/firebase.js';
import {database} from '../cloud/database';
import {storage} from '../cloud/storage';


class MarketPlace extends Component {
  constructor(props) {
      super(props);
      this.state = {
        products: [],
        refreshing: false,
      };
  }

  // generateProducts(data, uids, keys) {
    
  //   return products;
  // }


  getProducts() {
    this.setState({ refreshing: true });
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
          storage.child(`${uid}/${key}`).getDownloadURL().then( (uri) => {
            products.push( {uri: uri, text: d.Users[uid].products[key] } )
          } )
          
        }
      }

      return products;
    })

    
    .then((products) => {
      this.setState({ products, refreshing: false }) 
    });
    
    

    
    
    
  }

  render() {
    console.log(this.state.products);
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

      {this.state.products.map( (product, index) => 
        ( 
          <Image
          key = {index} 
          style={{width: 66, height: 58}}
          source={ {uri: product.uri} }/>
          
        )
       )}
        {/* <Text>YO YO</Text>
        <Image 
          style={{width: 66, height: 58}}
          source={ {uri: 'https://firebasestorage.googleapis.com/v0/b/nottmystyle-447aa.appspot.com/o/Users%2FmrBrWPt5Dvh3JID4nX55Ngmtlrw2%2F-LJUF-khoXAe7UTfBJVE?alt=media&token=607071b0-955e-4a40-97e7-c6855eee0ca9'} }/>
        <Text>sflffkff ksff </Text> */}

      </ScrollView>          
    )
  }
}

export default withNavigation(MarketPlace);

const styles = StyleSheet.create({})
