import React, { Component } from 'react'
import { View, Image, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import {withNavigation, StackNavigator} from 'react-navigation'; // Version can be specified in package.json
import { Container, Header, Content, Card, CardItem, Thumbnail, Text, Button, Icon, Left, Body } from 'native-base';
import firebase from '../cloud/firebase.js';
import {database, p} from '../cloud/database';
import {storage} from '../cloud/storage';


class MarketPlace extends Component {
  constructor(props) {
      super(props);
      this.state = {
        refreshing: false,
        isGetting: true,
      };
  }

  componentWillMount() {
    setTimeout(() => {
      this.getProducts();
    }, 10000);
  }


  
  getProducts() {
    
    const keys = [];
    database.then( (d) => {
      //get list of uids for all users
      var p = d.Products;
      console.log(p);
      this.setState({ p });
      
      

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
             contentContainerStyle={{
                    flexGrow: 1,
                    justifyContent: 'space-between'
                }}
              
      >

      {this.state.p.map( (product) => 
        ( 
          <Card style={{flex: 4}}>
            <CardItem>
              <Left>
                
                <Body>
                  <Text>{product.text.name}</Text>
                  <Text note>{product.text.gender}</Text>
                </Body>
              </Left>
            </CardItem>
            <CardItem>
              <Body>
                <Image source={{uri: product.uri}} style={{height: 150, width: 150}}/>
                <Text>
                  {product.text.description}
                </Text>
              </Body>
            </CardItem>
            <CardItem>
              <Left>
                <Button onPress={ () => {this.props.navigation.navigate('CustomChat', {key: product.key})} } transparent textStyle={{color: '#87838B'}}>
                  <Icon name="logo-github" />
                  <Text>${product.text.price}</Text>
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

export default MarketPlace;

const styles = StyleSheet.create({})


{/* <Image
            
            style={{width: 150, height: 150}}
            source={ {uri: product.uri} }/> */}

            // refreshControl = {
            //   <RefreshControl 
            //     refreshing={this.state.refreshing} 
            //     onRefresh={() => {this.getProducts();}}

            //     />}