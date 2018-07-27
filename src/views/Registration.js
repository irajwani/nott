import React, { Component } from 'react';
import { View, Text, Image, TouchableHighlight, ActivityIndicator, KeyboardAvoidingView } from 'react-native';
import { Hoshi, Jiro } from 'react-native-textinput-effects';
import {withNavigation, StackNavigator} from 'react-navigation'; // Version can be specified in package.json
import { PulseIndicator } from 'react-native-indicators';
import {Button} from 'react-native-elements'
//import AwesomeButtonRick from 'react-native-really-awesome-button/src/themes/rick'
import styles from '../styles.js';
import InputPage from './InputPage.js'
//import GeoAttendance from './geoattendance.js';
import ProfilePage from './ProfilePage';
var firebase = require("firebase");

//var database = firebase.database();


//currently no barrier to logging in and signing up
class Registration extends Component {

    constructor(props) {
      super(props);
      this.state = { data: { imad: {age: 22, height: 510}, k: {age: 22, height: 510}}, test: 3, email: '', uid: '', pass: '', error: '', loading: false, loggedIn: false, isGetting: true};
      }

    componentDidMount() {
        navigator.geolocation.getCurrentPosition(
			position => {
			  var JSONData = JSON.stringify(position);
			  var ParsedData = JSON.parse(JSONData);
              console.log(ParsedData);
              //const initialPosition = ParsedData.coords.latitude;
			  
			  //this.setState({ initialPosition });
			},
			error => console.log(error.message),
			{
			  enableHighAccuracy: true,
			  timeout: 5000,
			  distanceFilter: 2,
			}
          );
        this.watchID = navigator.geolocation.watchPosition(position => {
			const JSONData = JSON.stringify(position);
			var ParsedData = JSON.parse(JSONData);
			console.log(ParsedData);
		  });  
    }
    
    componentWillUnmount() {
        navigator.geolocation.clearWatch(this.watchID);
    }
    /////////
    ///////// Hello world for Login/Signup Email Authentication
    onSignInPress() {
        this.setState({ error: '', loading: true });
        const { email, pass } = this.state; //now that person has input text, their email and password are here
        firebase.auth().signInWithEmailAndPassword(email, pass)
            .then(() => { this.setState({ error: '', loading: false });
                          this.authChangeListener();
                          //cant do these things:
                          //firebase.database().ref('Users/7j2AnQgioWTXP7vhiJzjwXPOdLC3/').set({name: 'Imad Rajwani', attended: 1});
                          }).catch(() => {
                firebase.auth().createUserWithEmailAndPassword(email, pass)
                    .then(() => { this.setState({ error: '', loading: false });
                                  this.authChangeListener();  }
                                      )
                    .catch(() => {
                      // console.log( 'registration error', error )
                      // if (error.code === 'auth/email-already-in-use') {
                      //       var credential = firebase.auth.EmailAuthProvider.credential(email, password);
                      //
                      //
                      // }

                      this.setState({ error: 'Authentication failed, booo hooo.', loading: false });
                    });
            });

    }

    getData(snapshot) {
        details = {
            name: 'the many faced God',
            shirt: 'never'
        };
        
        details.name = snapshot.val().name
        details.shirt = snapshot.val().shirt
        //console.log(details);
        this.setState({details, isGetting: false});
    }

    getDB(snapshot) {
        this.setState({data: snapshot.val()});
        console.log(this.state.data);
    }


    authChangeListener() {

        firebase.auth().onAuthStateChanged( (user) => {
            if (user) {
                var name = 'nothing here';
                firebase.database().ref('Users/').once('value', this.getDB.bind(this), function (errorObject) {
                    console.log("The read failed: " + errorObject.code);
                  });

                firebase.database().ref('Users/' + user.uid + '/').once('value', this.getData.bind(this), function (errorObject) {
                    console.log("The read failed: " + errorObject.code);
                  });
                this.setState({uid: user.uid, loggedIn: true});
                //console.log(this.state.name);
                //alert(this.state.uid);
                //return this.props.navigation.navigate('ga', {userid: this.state.uid});
                //if (this.state.isGetting == false) {return this.props.navigation.navigate('ga', {data: this.state.data, attended: this.state.details.attended, name: this.state.details.name, userid: this.state.uid}); //abandon forced navigation. conditional render
            
                
            } else {
              alert('no user found');
            }


        } )


                  }


      



    renderButtonOrLoading() {
        if (this.state.loading) {
            return <View style={{flex: 1}}>
                        <ActivityIndicator size='large' color="#0000ff"/>
                   </View>
        }
        return <Button
                    title='Sign In' 
                    titleStyle={{ fontWeight: "700" }}
                    buttonStyle={{
                    backgroundColor: "#800000",
                    width: 300,
                    height: 45,
                    borderColor: "transparent",
                    borderWidth: 0,
                    borderRadius: 5
                    }}
                    containerStyle={{ marginTop: 20, marginBottom: 20 }} onPress={this.onSignInPress.bind(this)} />;
    }

    ///////////////////
    //////////////////

    render() 
     {    
    //     var promise = new Promise(function(resolve, reject) {
    //     var snapshot;
    //     snapshot = firebase.database().ref('Users/' + this.state.userid + '/').once('value')

    //     if (snapshot) {
    //       resolve("Stuff worked!");
    //     }
    //     else {
    //       reject(Error("It broke"));
    //     }
    //   });
    //   var snapshot;
    //   snapshot = firebase.database().ref('Users/' + this.state.userid + '/').once('value')
    //   //snapshot.then( result => return console.log(result.val().name) );
    //   console.log(snapshot);
    
    if(this.state.isGetting == false) 
         {
          console.log(this.state.data); 
          return (<ProfilePage name={this.state.details.name}/>) 
         }
    else {return (
            
          <KeyboardAvoidingView behavior='padding'
          style={styles.signInContainer}>
                  
                <Hoshi
                    label={'NMS Email Address'}
                    value={this.state.email}
                    onChangeText={email => this.setState({ email })}
                    autoCorrect={false}
                    // this is used as active border color
                    borderColor={'#800000'}
                    // this is used to set backgroundColor of label mask.
                    // please pass the backgroundColor of your TextInput container.
                    backgroundColor={'#F9F7F6'}
                    inputStyle={{ color: '#800000' }}
                />
                <Hoshi
                    label={'Password'}
                    value={this.state.pass}
                    onChangeText={pass => this.setState({ pass })}
                    autoCorrect={false}
                    secureTextEntry
                    // this is used as active border color
                    borderColor={'#000099'}
                    // this is used to set backgroundColor of label mask.
                    // please pass the backgroundColor of your TextInput container.
                    inputStyle={{ color: '#800000' }}
                />
                  {this.renderButtonOrLoading()}
                 
                
          
          </KeyboardAvoidingView>
                  )


                }

        
    }



    ////////////////////////
    ////////////////////////

    // render() 
    //  {    
    // //     var promise = new Promise(function(resolve, reject) {
    // //     var snapshot;
    // //     snapshot = firebase.database().ref('Users/' + this.state.userid + '/').once('value')

    // //     if (snapshot) {
    // //       resolve("Stuff worked!");
    // //     }
    // //     else {
    // //       reject(Error("It broke"));
    // //     }
    // //   });
    // //   var snapshot;
    // //   snapshot = firebase.database().ref('Users/' + this.state.userid + '/').once('value')
    // //   //snapshot.then( result => return console.log(result.val().name) );
    // //   console.log(snapshot);
    //   if (this.state.loggedIn) {
    //     //console.log(this.state.uid);
    //     if (this.state.isGetting) {

    //       return (

    //       <View style={[styles.horizontal, styles.aicontainer]}>
    //                     <ActivityIndicator size="large" color="#0000ff"/>
    //                </View>

    //     );  } else { return ( <View><Text>What up</Text></View> ) }

    //      } else {
    //       return (
    //       <View>
    //               <TextInputField
    //                   label='Email Address'
    //                   placeholder='youremailaddress@bates.edu'
    //                   value={this.state.email}
    //                   onChangeText={email => this.setState({ email })}
    //                   autoCorrect={false}
    //               />
    //               <TextInputField
    //                   label='Password'
    //                   autoCorrect={false}
    //                   placeholder='Your Password'
    //                   secureTextEntry
    //                   value={this.state.pass}
    //                   onChangeText={pass => this.setState({ pass })}
    //               />
    //               <Text>{this.state.error}</Text>
    //               {this.renderButtonOrLoading()}
    //       </View>
    //               )




    //     }
    // }
}
export default withNavigation(Registration);
