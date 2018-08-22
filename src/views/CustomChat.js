import React, {Component} from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import {withNavigation} from 'react-navigation';
import firebase from '../cloud/firebase';

class CustomChat extends Component {
  state = {
    messages: [],
  }

  componentWillMount() {
    const {params} = this.props.navigation.state
    const his_uid = params.uid
    
    this.setState({
      messages: [
        {
          _id: 1,
          text: "Hi, If you would like to purchase this product, let me know what place works for you and we'll arrange a meetup",
          createdAt: new Date(),
          user: {
            _id: 1,
            name: 'React Native',
            avatar: 'https://placeimg.com/140/140/any',
          },
        },
      ],
    })
  }

  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }))
  }

  render() {
    const your_uid = firebase.auth().currentUser.uid;
    console.log(this.state.messages);
    
    return (

      <GiftedChat
        messages={this.state.messages}
        onSend={messages => this.onSend(messages)}
        
          
        
      />
    )
  }
}

export default withNavigation(CustomChat);