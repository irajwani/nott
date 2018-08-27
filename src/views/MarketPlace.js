import React, { Component } from 'react'
import { View, Image, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import {withNavigation, StackNavigator} from 'react-navigation'; // Version can be specified in package.json
import { Container, Header, Content, Card, CardItem, Thumbnail, Text, Button, Icon, Left, Body } from 'native-base';
import firebase from '../cloud/firebase';

class MarketPlace extends Component {
  constructor(props) {
      super(props);
      this.state = {
        products: [],
        refreshing: false,
      };
  }

  componentDidMount() {
    var updates = {};
    var {params} = this.props.navigation.state;
    updates['/Products/'] = params;
    firebase.database().ref().update(updates);
  }

  buyProduct() {
    this.props.navigation.navigate('BuyProduct')
  }


  render() {
    var {params} = this.props.navigation.state;
    
    return (
      <ScrollView
             contentContainerStyle={{
                    flexGrow: 1,
                    justifyContent: 'space-between'
                }}
              
      >

      {params.map( (product) => 
        ( 
          <Card style={{flex: 0}}>
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