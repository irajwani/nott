import React, { Component } from 'react'
import { Platform, Text, Button, StyleSheet, View, Image, KeyboardAvoidingView, ScrollView, Picker } from 'react-native'
import {withNavigation} from 'react-navigation';
import { Hoshi, Jiro } from 'react-native-textinput-effects';
import { TextField } from 'react-native-material-textfield';
import NumericInput from 'react-native-numeric-input'
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
          brand: '',
          price: 0,
          original_price: 0,
          size: 2,
          type: 'Trousers',
          gender: 2,
          condition: 'Slightly Used',
          months: 0,
          insta: '',
          description: '',
          typing: true,
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

showPicker(gender) {
    if (gender == 0) {
        return ( 
            <Picker selectedValue = {this.state.type} onValueChange={ (type) => {this.setState({type})} } >
               <Picker.Item label = "Formal Shirts" value = "Formal Shirts" />
               <Picker.Item label = "Casual Shirts" value = "Casual Shirts" />
               <Picker.Item label = "Jackets" value = "Jackets" />
               <Picker.Item label = "Suits" value = "Suits" />
               <Picker.Item label = "Trousers" value = "Trousers" />
               <Picker.Item label = "Jeans" value = "Jeans" />
               <Picker.Item label = "Shoes" value = "Shoes" />
            </Picker>
        )
    }

    else if (gender == 1) {
        return (
            <Picker selectedValue = {this.state.type} onValueChange={ (type) => {this.setState({type})} } >
               <Picker.Item label = "Watches" value = "Watches" />
               <Picker.Item label = "Bracelets" value = "Bracelets" />
               <Picker.Item label = "Jewellery" value = "Jewellery" />
               <Picker.Item label = "Sunglasses" value = "Sunglasses" />
               <Picker.Item label = "Handbags" value = "Handbags" />
            </Picker>
        )
    }

    else if (gender == 2) {
        return (
            <Picker selectedValue = {this.state.type} onValueChange={ (type) => {this.setState({type})} } >
               <Picker.Item label = "Tops" value = "Tops" />
               <Picker.Item label = "Skirts" value = "Skirts" />
               <Picker.Item label = "Dresses" value = "Dresses" />
               <Picker.Item label = "Jeans" value = "Jeans" />
               <Picker.Item label = "Jackets" value = "Jackets" />
               <Picker.Item label = "Coats" value = "Coats" />
               <Picker.Item label = "Trousers" value = "Trousers" />
            </Picker>
        )
    } 
}

updateFirebase = (data, uri, mime = 'image/jpg', uid, imageName) => {
    // : if request.auth != null;
    var gender;
    switch(data.gender) {
        case 0:
            gender = 'Men'
            break; 
        case 1:
            gender = 'Accessories'
            break;
        case 2:
            gender = 'Women'
            break;
        default:
            gender = 'Men'
            console.log('no gender was specified')
    }

    switch(data.size) {
        case 0:
            data.size = 'Extra Small'
            break; 
        case 1:
            data.size = 'Small'
            break;
        case 2:
            data.size = 'Medium'
            break;
        case 3:
            data.size = 'Large'
            break;
        case 4:
            data.size = 'Extra Large'
            break;
        case 5:
            data.size = 'Extra Extra Large'
            break;
        default:
            data.size = 'Medium'
            console.log('no gender was specified')
    }

    var postData = {
        name: data.name,
        brand: data.brand,
        price: data.price,
        original_price: data.original_price ? data.original_price : 'Seller did not list original price',
        type: data.type,
        size: data.size,
        description: data.description ? data.description : 'Seller did not specify a description',
        gender: gender,
        condition: data.condition,
        months: data.months,
        sold: false,
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
    var conditionMet = (this.state.name) && (this.state.months > 0) && (this.state.price > 0)
    console.log(conditionMet);
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

        {/* 1. Product Pictures */}
            <AddButton navToComponent = {'CreateItem'} />


        {/* 0. Gender */}
            <ButtonGroup
                onPress={ (index) => {this.setState({gender: index})}}
                selectedIndex={this.state.gender}
                buttons={ ['Men', 'Accessories', 'Women'] }
                
            />
            {/* Type of clothing */}
        {this.showPicker(this.state.gender)}
        
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

            <Jiro
                    label={'Product Brand'}
                    value={this.state.brand}
                    onChangeText={brand => this.setState({ brand })}
                    autoCorrect={false}
                    // this is used as active border color
                    borderColor={'#800000'}
                    // this is used to set backgroundColor of label mask.
                    // please pass the backgroundColor of your TextInput container.
                    backgroundColor={'#F9F7F6'}
                    inputStyle={{ color: '#800000' }}
            />
            <Text>{this.state.brand}</Text>

        {/* 3. Product Price */}

            <Jiro
                    label={'Selling Price'}
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
            {/* Original Price */}
            <Jiro
                    label={'Original Price'}
                    value={this.state.original_price}
                    onChangeText={original_price => this.setState({ original_price })}
                    autoCorrect={false}
                    // this is used as active border color
                    borderColor={'#800000'}
                    // this is used to set backgroundColor of label mask.
                    // please pass the backgroundColor of your TextInput container.
                    backgroundColor={'#F9F7F6'}
                    inputStyle={{ color: '#800000' }}
            />
            <Text>{this.formatMoney(this.state.original_price)}</Text>

            {/* Size */}
            <Text style = { styles.promptText }> Select a Size </Text>
            <ButtonGroup
            onPress={ (index) => {this.setState({size: index})}}
            selectedIndex={this.state.size}
            buttons={ ['XS', 'S', 'M', 'L', 'XL', 'XXL'] }
                
            />
            {/* product condition */}
            <Text style={styles.promptText}>Product's condition</Text>
            <Picker selectedValue = {this.state.condition} onValueChange={ (condition) => {this.setState({condition})} } >
               <Picker.Item label = "Brand New" value = "Brand New" />
               <Picker.Item label = "Slightly Used" value = "Slightly Used" />
               <Picker.Item label = "Worn Out" value = "Worn Out" />
            </Picker>

            {/* product age (months) */}

             <NumericInput 
                value={this.state.months} 
                onChange={months => this.setState({months})} 
                type='plus-minus'
                initValue={0}
                minValue={0}
                maxValue={200}
                totalWidth={240} 
                totalHeight={50} 
                iconSize={25}
                valueType='real'
                rounded 
                textColor='#B0228C' 
                iconStyle={{ color: 'white' }} 
                upDownButtonsBackgroundColor='#E56B70'
                rightButtonBackgroundColor='#EA3788' 
                leftButtonBackgroundColor='#E56B70'
                containerStyle={ {justifyContent: 'space-evenly'} }    
                />

            {/* Product Description/Material */}
            <KeyboardAvoidingView behavior='padding' enabled={this.state.typing}
                 >
            <Button 
                title='Press if done typing'
                onPress = {() => {this.setState( { typing: false } )}}
            />     
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
                disabled={ conditionMet ? false : true}
            />

         </ScrollView>
         
         
        
      
    )
  }
}

const styles = StyleSheet.create({
    imageadder: {
        flexDirection: 'row'
    },

    promptText: {fontSize: 12, fontStyle: 'normal', textAlign: 'center'}
})

export default withNavigation(CreateItem)

