import React, {Component} from 'react'
import {Dimensions, Keyboard, Text, TextInput, TouchableHighlight, View, ScrollView, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {withNavigation} from 'react-navigation';
import {database} from '../cloud/database';
import firebase from '../cloud/firebase';
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

class UserComments extends Component {

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
        const {params} = this.props.navigation.state;
        Keyboard.addListener('keyboardWillShow', this.keyboardWillShow.bind(this))
        Keyboard.addListener('keyboardWillHide', this.keyboardWillHide.bind(this))
        setTimeout(() => {
            this.getComments(params.uid);
          }, 4);
    }

    getComments(uid) {
        console.log(uid);
        const keys = [];
        database.then( (d) => {
          //get list of comments for specific product
          //var comments = d.Users[uid]
          //var comments = d.Users[uid].products[productKey].comments ? d.Users[uid].products[productKey].comments : {a: {text: 'No Reviews have been left for this product. Be the first to review this good', name: 'NottMyStyle Team', time: Date.now() } };
          var comments = d.Users[uid].comments ? d.Users[uid].comments : {a: {text: 'No Reviews have been left for this seller. Be the first to review this individual', name: 'NottMyStyle Team', time: Date.now() } };
          this.setState({ comments });
          console.log(comments);
    
        })
        .then( () => { console.log('here');this.setState( {isGetting: false} );  } )
        .catch( (err) => {console.log(err) })
        
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
               <View style={styles.textContainer}>
                 
                 <Text style={styles.title}>
                   {params.name}
                 </Text>
               </View>
               
             </View>
             <View style={styles.separator}/>

             {Object.keys(comments).map(
                 (comment) => (
                 <View key={comment} style={styles.rowContainer}>
                    <View style={styles.textContainer}>
                        <Text style={ styles.name }> {comments[comment].name} </Text>
                        <Text style={styles.title}> {comments[comment].text}  </Text>
                        <Text style={ styles.commentTime }> {timeSince(comments[comment].time)} ago </Text>
                    </View>
                    <View style={styles.separator}/>
                 </View>
            )
                     
             )}
             </ScrollView>
            <View style={{flexDirection : 'row', bottom : this.height - this.state.visibleHeight}} >
                <TextInput 
                value={this.state.commentString}
                placeholder="Comment"
                style={styles.searchInput}
                onChange={this.onCommentTextChanged.bind(this)}/>
                <TouchableHighlight 
                    style={styles.button}
                    underlayColor='green' 
                    onPress={ () => {this.uploadComment(params.name , this.state.commentString, params.uid);
                                     this.setState({commentString: ''}); 
                                     }} >
                <Text style={styles.buttonText}>Reply</Text>
                </TouchableHighlight>
            </View>
           </View>
        )
    }
}

export default withNavigation(UserComments)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 5,
        marginBottom: 5,
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
    },
    wrapper: {
        flex: 1
      },
    scrollcontainer: {
        padding: 15,
    },
    searchInput: {
        height: 36,
        padding: 4,
        marginRight: 5,
        flex: 1,
        fontSize: 18,
        borderWidth: 1,
        borderColor: '#32cd32',
        borderRadius: 8,
        color: '#32cd32'
    },

    flowRight: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'stretch'
      },
    buttonText: {
        fontSize: 18,
        color: 'white',
        alignSelf: 'center'
    },
    button: {
        backgroundColor: "#800000",
        width: 100,
        height: 45,
        borderColor: "transparent",
        borderWidth: 0,
        borderRadius: 5
    },

    name: {
        fontSize: 12,
        color: '#239ed3',
    },

    title: {
        fontSize: 20,
        color: '#656565'
      },

    commentTime: {
        fontSize: 10,
        color: '#1f6010'
    },

    rowContainer: {
        flexDirection: 'row',
        padding: 10
      },
    
    time: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#32cd32'
      },
    
    textContainer: {
        flex: 1
      },

    separator: {
        height: 1,
        backgroundColor: 'black'
      },

    likes: {color: '#32cd32'}, dislikes: {color: '#800000'}  

  });