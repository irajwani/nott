import React, { Component } from 'react'
import { Text, StyleSheet, View, Platform } from 'react-native';
import {withNavigation, StackNavigator} from 'react-navigation'; // Version can be specified in package.json
import {ButtonGroup, Button} from 'react-native-elements';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import RNFetchBlob from 'react-native-fetch-blob';
import { Sae, Fumi } from 'react-native-textinput-effects';
import firebase from '../cloud/firebase.js';
import PictureAddButton from '../components/PictureAddButton.js';

const Blob = RNFetchBlob.polyfill.Blob;
const fs = RNFetchBlob.fs;
window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
window.Blob = Blob;

class EditProfile extends Component {
  constructor(props) {
      super(props);
      this.state = {
          name: '',
          email: '',
          size: 1,
          uri: undefined,
      }
  }

  updateFirebase(data, uri, mime = 'image/jpg', uid) {
    var postData = {
        name: data.name,
        email: data.email
    }
    var updates = {};
    switch(data.size) {
        case 0:
            data.size = 'Small'
            break; 
        case 1:
            data.size = 'Medium'
            break;
        case 2:
            data.size = 'Large'
            break;
        case 3:
            data.size = 'Extra Large'
            break;
        default:
            data.size = 'Medium'
            console.log('no gender was specified')
    }

    updates['/Users/' + uid + '/profile/' + '/'] = postData;

    return {database: firebase.database().ref().update(updates), 
            storage: new Promise((resolve, reject) => {
                const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri
                let uploadBlob = null
                const imageRef = firebase.storage().ref().child(`Users/${uid}/profile`);
                fs.readFile(uploadUri, 'base64')
                .then((data) => {
                return Blob.build(data, { type: `${mime};BASE64` })
                })
                .then((blob) => {
                console.log('got to blob')
                uploadBlob = blob
                return imageRef.put(blob, { contentType: mime })
                })
                .then(() => {
                uploadBlob.close()
                return imageRef.getDownloadURL()
                })
                .then((url) => {
                    console.log(url);
                    var profileupdates = {};
                    profileupdates['/Users/' + uid + '/profile/' + 'uri/'] = url ;
                    firebase.database().ref().update(profileupdates);
                    resolve(url)
                })
                .catch((error) => {
                reject(error)
                })
            })
}
  }

  createUser(uid, data) {
    console.log(uid);
  }

  render() {
    const uid = firebase.auth().currentUser.uid;
    const {params} = this.props.navigation.state
    const pictureuri = params ? params.uri : 'nothing here'
    const picturebase64 = params ? params.base64 : 'nothing here'

    return (
      <View>
        <Sae
            label={'FirstName LastName'}
            iconClass={FontAwesomeIcon}
            iconName={'users'}
            iconColor={'#f95a25'}
            value={this.state.name}
            onChangeText={name => this.setState({ name })}
            autoCorrect={false}
            inputStyle={{ color: '#0a3f93' }}
        />

        <Sae
            label={'email@somedomain.com'}
            iconClass={FontAwesomeIcon}
            iconName={'code'}
            iconColor={'#f95a25'}
            value={this.state.email}
            onChangeText={email => this.setState({ email })}
            autoCorrect={false}
            inputStyle={{ color: '#4dcc0e' }}
        />

        <PictureAddButton />

        <ButtonGroup
            onPress={ (index) => {this.setState({size: index})}}
            selectedIndex={this.state.size}
            buttons={ ['S', 'M', 'L', 'XL'] }
                
        />

        <Button
            large
            icon={{name: 'save', type: 'font-awesome'}}
            title='SAVE'
            onPress={() => {this.updateFirebase(this.state, pictureuri, mime = 'image/jpg', uid ); this.createUser(uid, this.state); } } 
        />
        
      </View>
    )
  }
}

export default withNavigation(EditProfile);

const styles = StyleSheet.create({})
