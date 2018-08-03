import React, { Component } from 'react'
import { Text, StyleSheet, View, Image, ImageBackground } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome';
import AddButton from '../components/AddButton.js';
import {Button} from 'react-native-elements'
import {withNavigation, StackNavigator} from 'react-navigation'; // Version can be specified in package.json



const resizeMode = 'center';

class ProfilePage extends Component {
  constructor(props) {
    super(props);

  }
  
  render() {
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

        {/* <View >
          <AddButton />
        </View> */}

        
        <Button
            large
            icon={{name: 'plus', type: 'font-awesome'}}
            title='SELL AN ITEM'
            onPress={() => this.props.navigation.navigate('CreateItem')} 

        />
        

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


