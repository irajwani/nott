import React, {Component} from 'react'
import {Dimensions, Keyboard, Text, TextInput, TouchableHighlight, Image, View, ScrollView, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Kohana } from 'react-native-textinput-effects'
import {withNavigation} from 'react-navigation';
import {database} from '../cloud/database';
import firebase from '../cloud/firebase';
import { material, systemWeights, human, iOSUIKit } from 'react-native-typography'
//for each comment, use their time of post as the key
function timeSince(date) {

    var seconds = Math.floor((new Date() - date) / 1000);

    var interval = Math.floor(seconds / 31536000);

    if (interval > 1) {
        return interval + " years";
    }
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
        return interval + " months";
    }
    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
        return interval + " days";
    }
    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
        return interval + " hours";
    }
    interval = Math.floor(seconds / 60);
    if (interval > 1) {
        return interval + " minutes";
    }
    return seconds == 0 ? "Just now" : Math.floor(seconds) + " seconds";
    
}

class CustomComments extends Component {

    constructor(props) {
        super(props);
        this.state = {
          comments: {},
          commentString: '',
          visibleHeight: Dimensions.get('window').height,
          isGetting: true,
        }
        this.height = this.state.visibleHeight
        
        
    }

    componentWillMount () {
        
        Keyboard.addListener('keyboardWillShow', this.keyboardWillShow.bind(this))
        Keyboard.addListener('keyboardWillHide', this.keyboardWillHide.bind(this))
        
    }

    keyboardWillShow (e) {
        let newSize = Dimensions.get('window').height - e.endCoordinates.height
        this.setState({visibleHeight: newSize})
      }

    keyboardWillHide (e) {
       this.setState({visibleHeight: Dimensions.get('window').height})
    }

    onCommentTextChanged(event) {
        this.setState({ commentString: event.nativeEvent.text });
    }

    uploadComment(name, comment, uid ) {
        var timeCommented = Date.now();
        var updates = {}
        var postData = {text: comment, name: name, time: timeCommented }
        this.state.comments[timeCommented] = postData;
        this.setState({ comments : this.state.comments });
        updates['/Users/' + uid + '/comments/' + timeCommented + '/'] = postData
        //firebase.database().ref('Posts').set({posts: this.state.posts})
        firebase.database().ref().update(updates)
    }
    
    render() {

        const {params} = this.props.navigation.state;
        const {comments} = this.state;

        if(this.state.isGetting) {
            return ( 
              <View>
                <Text>Loading...</Text>
              </View>
            )
        }

        return (
            <View style={styles.wrapper} >
            <ScrollView contentContainerStyle={styles.wrapper}>
            <View style={styles.rowContainer}>
                {/* row containing profile picture, and user details */}
               <Image source={ {uri: params.uri }} style={styles.profilepic} />
               <View style={styles.textContainer}>
                 
                 <Text style={styles.name}>
                   {params.name}
                 </Text>
                 <Text style={styles.email}>
                   {params.email}
                 </Text>
               </View>
               
             </View>
             <View style={styles.separator}/>

             {Object.keys(comments).map(
                 (comment) => (
                 <View key={comment} style={styles.rowContainer}>
                    <View style={styles.textContainer}>
                        <Text style={ styles.naam }> {comments[comment].name} </Text>
                        <Text style={styles.comment}> {comments[comment].text}  </Text>
                        <Text style={ styles.commentTime }> {timeSince(comments[comment].time)} ago </Text>
                    </View>
                    <View style={styles.separator}/>
                 </View>
            )
                     
             )}
             </ScrollView>
            <View style={{flexDirection : 'row', bottom : this.height - this.state.visibleHeight}} >
                <Kohana
                    style={{ backgroundColor: '#f9f5ed' }}
                    label={'Comment'}
                    value={this.state.commentString}
                    onChange={this.onCommentTextChanged.bind(this)}
                    iconClass={Icon}
                    iconName={'comment-multiple'}
                    iconColor={'#f4d29a'}
                    labelStyle={{ color: '#91627b' }}
                    inputStyle={{ color: '#91627b' }}
                    useNativeDriver
                />
                <Icon name="send" 
                        size={50} 
                        color={'#37a1e8'}
                        onPress={ () => {this.uploadComment(this.state.name , this.state.commentString, params.uid);
                                     this.setState({commentString: ''}); 
                                     }}
                />
                
            </View>
           </View>
        )
    }
}
