import React, { Component } from 'react'
import { View, Image, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import {withNavigation, StackNavigator} from 'react-navigation'; // Version can be specified in package.json
import firebase from '../cloud/firebase.js';
import {database} from '../cloud/database';
import {storage} from '../cloud/storage';
import { Container, Header, Content, Card, CardItem, Thumbnail, Text, Button, Icon, Left, Body } from 'native-base';

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

  componentWillMount() {
    this.getProducts();
  }

  // componentDidMount() {
  //   this.timerID = setInterval(
	// 		() => this.getProducts(),
	// 		10000
  //     ); 

  // }

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
            products.push( {uri: uri, text: d.Users[uid].products[key] } )
          } )
          
        }
      }

      this.setState({ products })
    })
    .catch( (err) => {console.log(err) })

    
    // .then((products) => {
    //   this.setState({ products }) 
    // });
    
    

    
    
    
  }

  render() {
    console.log(this.state.products);
    return (
      <ScrollView
             contentContainerStyle={{
                    flexGrow: 1,
                    justifyContent: 'space-between'
                }}
              
      >

      {this.state.products.map( (product) => 
        ( 
          <Card style={{flex: 0}}>
            <CardItem>
              <Left>
                
                <Body>
                  <Text>NativeBase</Text>
                  <Text note>April 15, 2016</Text>
                </Body>
              </Left>
            </CardItem>
            <CardItem>
              <Body>
                <Image source={{uri: product.uri}} style={{height: 150, width: 150}}/>
                <Text>
                  //Your text here
                </Text>
              </Body>
            </CardItem>
            <CardItem>
              <Left>
                <Button transparent textStyle={{color: '#87838B'}}>
                  <Icon name="logo-github" />
                  <Text>1,926 stars</Text>
                </Button>
              </Left>
            </CardItem>
          </Card>
            
            
          
          
        )
       )}
        

      </ScrollView>          
    )
  }
}

export default withNavigation(MarketPlace);

const styles = StyleSheet.create({})


{/* <Image
            
            style={{width: 150, height: 150}}
            source={ {uri: product.uri} }/> */}

            // refreshControl = {
            //   <RefreshControl 
            //     refreshing={this.state.refreshing} 
            //     onRefresh={() => {this.getProducts();}}

            //     />}