//Navigate to this page with the key from the product,
//and update that products details within the Users branch

import React, { Component } from 'react'
import { Platform, Text, StyleSheet, View, Image, KeyboardAvoidingView, ScrollView, Picker } from 'react-native'
import {withNavigation} from 'react-navigation';
import { Hoshi, Jiro } from 'react-native-textinput-effects';
import { TextField } from 'react-native-material-textfield';
import NumericInput from 'react-native-numeric-input'
import {Button, ButtonGroup, Divider} from 'react-native-elements';
import RNFetchBlob from 'react-native-fetch-blob';
import MultipleAddButton from '../components/MultipleAddButton';
import accounting from 'accounting'
import ProductLabel from '../components/ProductLabel.js';
import {signInContainer} from '../styles.js';
import firebase from '../cloud/firebase.js';
import Chatkit from "@pusher/chatkit";

const Blob = RNFetchBlob.polyfill.Blob;
const fs = RNFetchBlob.fs;
window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
window.Blob = Blob;

class EditItem extends Component {
  constructor(props) {
      super(props);
      this.state = {
          uri: undefined,
          price: 0,
          original_price: 0,
          condition: 'Good',
          months: 0,
          description: '',
          typing: true,
      }
  }

  formatMoney(value) {
    return accounting.formatMoney(parseFloat(value));
  }

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

updateFirebase = (data, pictureuris, mime = 'image/jpg', uid, imageName, productKey) => {
    // : if request.auth != null;

    // var postData = {
    //     name: data.name,
    //     brand: data.brand,
    //     price: data.price,
    //     original_price: data.original_price ? data.original_price : 'Seller did not list original price',
    //     type: data.type,
    //     size: data.size,
    //     description: data.description ? data.description : 'Seller did not specify a description',
    //     gender: gender,
    //     condition: data.condition,
    //     months: data.months,
    //     sold: false,
    //     likes: 0,
    //     comments: '',
    //     time: Date.now(),
        
    //   };
    
    var updates = {};
    updates['/Users/' + uid + '/products/' + productKey + '/price/'] = data.price;
    firebase.database().ref().update(updates);
    updates['/Users/' + uid + '/products/' + productKey + '/original_price/'] = data.original_price;
    firebase.database().ref().update(updates);
    

    return {database: firebase.database().ref().update(updates),
            storage: this.uploadToStore(pictureuris, uid, productKey)}

}

  uploadToStore = (pictureuris, uid, productKey) => {
      
    pictureuris.forEach( (uri, index) => {
        
        var storageUpdates = {};

        const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri
        let uploadBlob = null
        const imageRef = firebase.storage().ref().child(`Users/${uid}/${productKey}/${index}`);
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
            storageUpdates['/Users/' + uid + '/products/' + productKey + '/uris/' + index + '/'] = url;
            firebase.database().ref().update(storageUpdates);  
        })
    } )

    // for(const uri of pictureuris) {
    //     var i = 0;
    //     console.log(i);
        
    //     const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri
    //     let uploadBlob = null
    //     const imageRef = firebase.storage().ref().child(`Users/${uid}/${newPostKey}/${i}`);
    //     fs.readFile(uploadUri, 'base64')
    //     .then((data) => {
    //     return Blob.build(data, { type: `${mime};BASE64` })
    //     })
    //     .then((blob) => {
    //     console.log('got to blob')
    //     i++;
    //     uploadBlob = blob
    //     return imageRef.put(blob, { contentType: mime })
    //     })
    //     .then(() => {
    //     uploadBlob.close()
    //     return imageRef.getDownloadURL()
    //     })
    //     .then((url) => {
    //         console.log(url);
    //     })
        
        
    // }
  }

  render() {
    const uid = firebase.auth().currentUser.uid; 
    const {params} = this.props.navigation.state
    //this time around, get the picture uris directly from the previous 'MyProducts' Page,
    //feel free to submit the same uris again, or take new pictures
    const pictureuris = params ? params.pictureuris : 'nothing here'
    const productKey = params.key;
    //const picturebase64 = params ? params.base64 : 'nothing here'
    //Lenient condition, Array.isArray(pictureuris) && pictureuris.length >= 1
    var conditionMet = (this.state.name) && (this.state.months > 0) && (this.state.price > 0)
    console.log(conditionMet);
    //console.log(pictureuri);
    //this.setState({uri: params.uri})
    //this.setState(incrementPrice);
    //const picturebase64 = params.base64;
    //console.log(pictureuri);
    return (
      
    
        <ScrollView
            
             contentContainerStyle={styles.contentContainer}
        >

            <Divider style={{  backgroundColor: '#fff', height: 12 }} />
        {/* 1. Product Pictures */}
            <Text style={{textAlign: 'center'}}>Picture(s) of Product:</Text>
            <Divider style={{  backgroundColor: '#fff', height: 8 }} />

            <MultipleAddButton navToComponent = {'EditItem'} pictureuris={pictureuris}/>

            <Divider style={{  backgroundColor: '#fff', height: 12 }} />

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
            <ProductLabel color='#1271b5' title='Select a Size'/> 
            <ButtonGroup
            onPress={ (index) => {this.setState({size: index})}}
            selectedIndex={this.state.size}
            buttons={ ['XS', 'S', 'M', 'L', 'XL', 'XXL'] }
                
            />
            {/* product condition */}
            <Divider style={{  backgroundColor: '#fff', height: 12 }} />
            <ProductLabel color='#1271b5' title="Product's Condition"/> 
            <Picker selectedValue = {this.state.condition} onValueChange={ (condition) => {this.setState({condition})} } >
               <Picker.Item label = "New with tags" value = "New with tags" />
               <Picker.Item label = "New" value = "New" />
               <Picker.Item label = "Very good" value = "Very good" />
               <Picker.Item label = "Good" value = "Good" />
               <Picker.Item label = "Satisfactory" value = "Satisfactory" />
            </Picker>

            {/* product age (months) */}
            <View style = { {alignItems: 'center', flexDirection: 'column'} } >
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
                containerStyle={ {justifyContent: 'space-evenly', padding: 10,} }    
                />
             <Text> Months since you bought the product </Text>
            </View>
            <Divider style={{  backgroundColor: '#fff', height: 15 }} />
            {/* Product Description/Material */}
            <KeyboardAvoidingView behavior='padding' enabled={this.state.typing}
                 >
            <Button
                 
                title='Press if done typing in description'
                onPress = {() => {this.setState( { typing: false } )}}
                buttonStyle={{
                backgroundColor: "#3b5998",
                width: 280,
                height: 40,
                borderColor: "transparent",
                borderWidth: 0,
                borderRadius: 5
            }}
            />     
            <TextField 
                label="Brief description of product"
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
            large
            disabled = { conditionMet ? false : true}
            buttonStyle={{
                backgroundColor: "#5bea94",
                width: 280,
                height: 80,
                borderColor: "transparent",
                borderWidth: 0,
                borderRadius: 5
            }}
            icon={{name: 'cloud-upload', type: 'font-awesome'}}
            title='SUBMIT TO MARKET'
            onPress={() => { 
                this.updateFirebase(this.state, pictureuris, mime = 'image/jpg', uid , this.state.name, productKey); 
                              } } 
            />

            <Divider style={{  backgroundColor: '#fff', height: 10 }} />
            
            

         </ScrollView>
         
         
        
      
    )
  }
}

const styles = StyleSheet.create({
    contentContainer: {
        flexGrow: 1, 
        backgroundColor: '#fff',
        flexDirection: 'column',
        justifyContent: 'space-between',
          
    },
    imageadder: {
        flexDirection: 'row'
    },

    promptText: {fontSize: 12, fontStyle: 'normal', textAlign: 'center'}
})

export default withNavigation(EditItem)

