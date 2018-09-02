import React, { Component } from 'react'
import { View, Image, StyleSheet, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import {withNavigation, StackNavigator} from 'react-navigation'; // Version can be specified in package.json
import { Container, Header, Content, Card, CardItem, Thumbnail, Text, Button, Icon, Left, Body } from 'native-base';
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
  }

  componentWillMount() {
    setTimeout(() => {
      this.getProducts();
    }, 4);
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
        
                <Image source={{uri: section.uri}} style={{height: 150, width: 150}}/>
                <Text>
                  {section.text.name}
                </Text>
              

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
          {section.text.description}
        </Animatable.Text>
        
        <Button onPress={ () => {this.props.navigation.navigate('CustomChat', {key: product.key})} } transparent textStyle={{color: '#87838B'}}>
                  <Icon name="logo-github" />
                  <Text>${section.text.price}</Text>
        </Button>
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
    backgroundColor: 'rgba(255,255,255,1)',
  },
  inactive: {
    backgroundColor: 'rgba(245,252,255,1)',
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