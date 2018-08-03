import React, { Component } from 'react'
import { Text, StyleSheet, View, Image, KeyboardAvoidingView, ScrollView } from 'react-native'
import {withNavigation} from 'react-navigation';
import { Hoshi, Jiro } from 'react-native-textinput-effects';
import AddButton from '../components/AddButton';
import accounting from 'accounting'


function incrementPrice(previousState, currentProps) {
    return { uri: previousState.price + 1 } 
}

class CreateItem extends Component {
  constructor(props) {
      super(props);
      this.state = {
          uri: undefined,
          name: '',
          price: 0,
      }
  }

  formatMoney(value) {
    return accounting.formatMoney(parseFloat(value) / 100);
  }

  render() {
     
    const {params} = this.props.navigation.state
    const pictureuri = params ? params.uri : 'nothing here'
    //console.log(pictureuri);
    //this.setState({uri: params.uri})
    //this.setState(incrementPrice);
    //const picturebase64 = params.base64;
    //console.log(pictureuri);
    return (
      
       
        <ScrollView>
        {/* 1. Product Pictures */}
            <AddButton/>
            <Image
            style={{width: '25%', height: '25%', opacity: 0.7}} 
            source={ {uri: pictureuri} } />
            <Image
            style={{width: '25%', height: '25%', opacity: 0.7}} 
            source={ require('../images/blank.jpg') } />
        {/* 2. Product Name */}
            <Jiro
                    label={'Product Name'}
                    value={this.state.name}
                    onChangeText={name => this.setState({ name })}
                    autoCorrect={false}
                    // this is used as active border color
                    borderColor={'#800000'}
                    // this is used to set backgroundColor of label mask.
                    // please pass the backgroundColor of your TextInput container.
                    backgroundColor={'#F9F7F6'}
                    inputStyle={{ color: '#800000' }}
            />
            <Text>{this.state.name}</Text>
        {/* 3. Product Price */}

            <Jiro
                    label={'Product Price'}
                    value={this.state.price}
                    onChangeText={price => this.setState({ price })}
                    autoCorrect={false}
                    // this is used as active border color
                    borderColor={'#800000'}
                    // this is used to set backgroundColor of label mask.
                    // please pass the backgroundColor of your TextInput container.
                    backgroundColor={'#F9F7F6'}
                    inputStyle={{ color: '#800000' }}
            />
            <Text>{this.formatMoney(this.state.price)}</Text>

         </ScrollView>
        
        
      
    )
  }
}

const styles = StyleSheet.create({
    imageadder: {
        flexDirection: 'row'
    }
})

export default withNavigation(CreateItem)

