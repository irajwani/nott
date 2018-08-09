import React, { Component } from 'react'
import { Platform, Text, Button, StyleSheet, View, Image, KeyboardAvoidingView, ScrollView, Picker } from 'react-native'
import {withNavigation} from 'react-navigation';
import { Hoshi, Jiro } from 'react-native-textinput-effects';
import { TextField } from 'react-native-material-textfield';
import {ButtonGroup} from 'react-native-elements';
import RNFetchBlob from 'react-native-fetch-blob';
import AddButton from '../components/AddButton';
import accounting from 'accounting'
import {signInContainer} from '../styles.js';
import firebase from '../cloud/firebase.js';

const Blob = RNFetchBlob.polyfill.Blob;
const fs = RNFetchBlob.fs;
window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
window.Blob = Blob;

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
          type: 'shirt',
          gender: 2,
          description: ''
      }
  }

  formatMoney(value) {
    return accounting.formatMoney(parseFloat(value));
  }

//   updateFirebaseStorage = (uri, mime = 'application/octet-stream', uid, name) => {
//     return (dispatch) => {
//         return new Promise((resolve, reject) => {
//             console.log('entered promise')
//             const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
//             const sessionId = new Date().getTime();
//             let uploadBlob = null;
//             const imageRef = firebase.storage().ref(`${uid}`).child(name);

//             fs.readFile(uploadUri, 'base64')
//             .then( (data) => {
//                 return Blob.build(data, {type: `${mime};BASE64`})
//             })
//             .then( (blob) => {
//                 uploadBlob = blob;
//                 return imageRef.put(blob, {contentType: mime })
//             })
//             .then( () => {
//                 uploadBlob.close();
//                 return imageRef.getDownloadURL();
//             })
//             .then( (url) => {resolve(url); console.log('done');} )
//             .catch( (err) => {reject(err); })
//         }
//     )
//     }
//   }

// updateFirebaseStorage(uri, mime = 'application/octet-stream', uid, name) {
    
        
//             console.log(uid + uri);
//             const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
//             //const uploadUri = uri;
//             const sessionId = new Date().getTime();
//             let uploadBlob = null;
//             const imageRef = firebase.storage().ref(`Users/${uid}`).child(name);

//             fs.readFile(uploadUri, 'base64')
//             .then( (data) => {
//                 console.log('got to data');
//                 return Blob.build(data, {type: `${mime};BASE64`})
//             })
//             .then( (blob) => {
//                 console.log('got to blob');
//                 uploadBlob = blob;
//                 return imageRef.put(blob, {contentType: mime })
//             })
//             .then( () => {
//                 uploadBlob.close();
//                 return imageRef.getDownloadURL();
//             })
            
        
    
//    }

updateFirebase = (data, uri, mime = 'image/jpg', uid, imageName) => {
    // : if request.auth != null;
    var gender;
    switch(data.gender) {
        case 0:
            gender = 'Men'
            break; 
        case 1:
            gender = 'Unisex'
            break;
        case 2:
            gender = 'Women'
            break;
        default:
            gender = 'Men'
            console.log('no gender was specified')
    }
    var postData = {
        name: data.name,
        price: data.price,
        type: data.type,
        description: data.description,
        gender: gender,
      };
  
    var newPostKey = firebase.database().ref().child(`Users/${uid}/products`).push().key;
    
    var updates = {};
    updates['/Users/' + uid + '/products/' + newPostKey + '/'] = postData;

    return {database: firebase.database().ref().update(updates), 
            storage: new Promise((resolve, reject) => {
                const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri
                let uploadBlob = null
                const imageRef = firebase.storage().ref().child(`Users/${uid}/${newPostKey}`);
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
                resolve(url)
                })
                .catch((error) => {
                reject(error)
                })
            })
  }

}


  render() {
    const uid = firebase.auth().currentUser.uid; 
    const {params} = this.props.navigation.state
    const pictureuri = params ? params.uri : 'nothing here'
    const picturebase64 = params ? params.base64 : 'nothing here'
    //console.log(pictureuri);
    //this.setState({uri: params.uri})
    //this.setState(incrementPrice);
    //const picturebase64 = params.base64;
    //console.log(pictureuri);
    return (
      
    
        <ScrollView
             contentContainerStyle={{
                    flexGrow: 1,
                    justifyContent: 'space-between'
                }}
        >
        {/* 0. Gender */}
            <ButtonGroup
                onPress={ (index) => {this.setState({gender: index})}}
                selectedIndex={this.state.gender}
                buttons={ ['Men', 'Unisex', 'Women'] }
                
            />

        <Picker selectedValue = {this.state.type} onValueChange={ (type) => {this.setState({type})} } >
               <Picker.Item label = "Torso" value = "shirt" />
               <Picker.Item label = "Legs" value = "pants" />
               <Picker.Item label = "Feet" value = "shoes" />
            </Picker>    
        {/* 1. Product Pictures */}
            <AddButton/>
            {/* <Image
            style={{width: '25%', height: '25%', opacity: 1.0}} 
            source={ {uri: pictureuri} } />
            <Image
            style={{width: '25%', height: '25%', opacity: 0.7}} 
            source={ require('../images/blank.jpg') } /> */}
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
            <KeyboardAvoidingView behavior='padding'
                style={signInContainer} >
            <TextField 
                label="Description (Describe the condition/attributes of the product)"
                value={this.state.description}
                onChangeText = { (desc)=>{this.setState({description: desc})}}
                multiline = {true}
                characterRestriction = {180}
                textColor={'rgb(15, 63, 140)'}
                tintColor={'rgb(15, 63, 140)'}
                baseColor={'rgb(59, 169, 186)'}
            />
            
            </KeyboardAvoidingView>
            
            <Button 
                title='CONFIRM PRODUCT DETAILS' 
                onPress={ () => {
                    this.updateFirebase(this.state, pictureuri, mime = 'image/jpg', uid , this.state.name);
                }}
            />

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

