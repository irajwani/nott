import React, { Component } from 'react'
import { Text, StyleSheet, View, Image, KeyboardAvoidingView } from 'react-native'
import {withNavigation} from 'react-navigation';
import { Hoshi, Jiro } from 'react-native-textinput-effects';


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
  render() {
    const {params} = this.props.navigation.state
    const pictureuri = params.uri
    //this.setState({uri: params.uri})
    //this.setState(incrementPrice);
    //const picturebase64 = params.base64;
    //console.log(pictureuri);
    return (
      <KeyboardAvoidingView>
       <View style={{ flex: 1 }}>
            <Image
            style={{width: '100%', height: '100%', opacity: 0.7}} 
            source={ {uri: pictureuri } } />
        </View>    
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
      </KeyboardAvoidingView>
    )
  }
}

const styles = StyleSheet.create({})

export default withNavigation(CreateItem)