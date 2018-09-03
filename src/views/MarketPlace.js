import React, { Component } from 'react'
import { View, Image, StyleSheet, ScrollView, RefreshControl, TouchableOpacity, TouchableHighlight } from 'react-native';
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



class MarketPlace extends Component {
  constructor(props) {
      super(props);
      this.state = {
        refreshing: false,
        isGetting: true,
        activeSection: false,
        collapsed: true,
      };
      this.navToChat = this.navToChat.bind(this);
  }

  componentWillMount() {
    setTimeout(() => {
      this.getProducts();
    }, 4);
  }

  navToChat() {
    console.log('pressed')
    //this.props.navigation.navigate('CustomChat', {key: key})
    this.props.navigation.navigate('CustomChat')
  }

  //switch between collapsed and expanded states
  toggleExpanded = () => {
    this.setState({ collapsed: !this.state.collapsed });
  };

  setSection = section => {
    this.setState({ activeSection: section });
  };

  renderHeader = (section, _, isActive) => {
    return (
      <Animatable.View
        duration={400}
        style={[styles.header, isActive ? styles.active : styles.inactive]}
        transition="backgroundColor"
      >
        
                <Image source={{uri: section.uri}} style={{height: 180, width: 280}}/>
                
              

      </Animatable.View>
    );
  };

  renderContent(section, _, isActive) {
    return (
      <Animatable.View
        duration={400}
        style={[styles.content, isActive ? styles.active : styles.inactive]}
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
        
        
        <Animatable.Text animation={isActive ? 'bounceLeft' : undefined}>
          ${section.text.price}
        </Animatable.Text>

        <Button
            
            buttonStyle={{
                backgroundColor: "#000",
                width: 100,
                height: 40,
                borderColor: "transparent",
                borderWidth: 0,
                borderRadius: 5
            }}
            icon={{name: 'credit-card', type: 'font-awesome'}}
            title='BUY'
            onPress = { () => { console.log('going to chat') } }
            />
        
      </Animatable.View>
    );
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

    const {navigate} = this.props.navigation
    console.log(navigate);
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
                    justifyContent: 'space-between',
                    
                }}
              
      >
        

        

        <Collapsible collapsed={this.state.collapsed} align="center">
          <View style={styles.content}>
            <Text>
              Bacon ipsum dolor amet chuck turducken landjaeger tongue spare
              ribs
            </Text>
          </View>
        </Collapsible>
        <Accordion
          activeSection={this.state.activeSection}
          sections={this.state.p}
          touchableComponent={TouchableOpacity}
          renderHeader={this.renderHeader}
          renderContent={this.renderContent}
          duration={400}
          onChange={this.setSection}
        />

      </ScrollView> 
            
    )
  
  }
}

export default withNavigation(MarketPlace);

const styles = StyleSheet.create({
  
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