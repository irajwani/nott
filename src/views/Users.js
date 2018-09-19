import React, { Component } from 'react'
import { Text, ScrollView, View, Image, StyleSheet, TouchableHighlight } from 'react-native'
import { withNavigation } from 'react-navigation';
import { database } from '../cloud/database';
import firebase from '../cloud/firebase';

class Users extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isGetting: true,
        };
    }

    componentWillMount() {
        setTimeout(() => {
            this.getUsers();
        }, 4);
    }

    getUsers() {
        database.then( (d) => {
            this.setState( {users: d.Users} )
            console.log(this.state.users);
        })
        .then( () => { this.setState({isGetting: false})})
        .catch( (err) => console.log(err))
    }

    navToReview(name, uri, users) {
        //var uid = Object.keys(users)[0];
        var uids = Object.keys(users)
        var uid = Object.keys(users).forEach( (user) => {
            if(users[user].profile.uri == uri) {
                console.log(user)
                return user
            }
        });
            
        
        this.props.navigation.navigate('UserComments', {name: name, uri: uri, uid: uid});
    }

    render() {
        const {users} = this.state
        if(this.state.isGetting) {
            return (
                <View>
                    <Text>Loading...</Text>
                </View>
            )
        }

        return (
            <ScrollView
                contentContainerStyle={styles.contentContainer}>

                {Object.keys(users).map( (key) => 
                    <View style={styles.rowContainer}>
                        <TouchableHighlight style={styles.profilepicWrap} onPress={() => {this.navToReview(users[key].profile.name, users[key].profile.uri, users )} } >
                            <Image source={ {uri: users[key].profile.uri }} style={styles.profilepic} />
                        </TouchableHighlight>
                        <Text style={styles.name}>{users[key].profile.name}</Text>
                        <Text style={styles.pos}>{users[key].profile.email} </Text>
                        <Text style={styles.insta}>@{users[key].profile.insta} </Text>
                        <View style={styles.separator}/>
                    </View>
                )}

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

    separator: {
        height: 1,
        backgroundColor: 'black'
      },

    promptText: {fontSize: 12, fontStyle: 'normal', textAlign: 'center'},

    rowContainer: {
        flexDirection: 'column',
        padding: 2
      },

    profilepicWrap: {
        width: 150,
        height: 150,
        borderRadius: 100,
        borderColor: 'blue',
        borderWidth: 5,
        
    },

    profilepic: {
        flex: 1,
        width: null,
        alignSelf: 'stretch',
        borderRadius: 65,
        borderColor: '#fff',
        
    },  
    
    time: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#32cd32'
      },
    
    textContainer: {
        flex: 1
      },
    
    name: {
        marginTop: 20,
        fontSize: 22,
        color: '#fff',
        fontWeight: 'bold'
      },

    pos: {
        fontSize: 16,
        color: '#0394c0',
        fontWeight: '600',
        fontStyle: 'italic'
      },  

    insta: {
        fontSize: 16,
        color: '#13a34c',
        fontWeight: '600',
        fontStyle: 'normal'
      },  

    separator: {
        height: 1,
        backgroundColor: 'black'
      },

})
export default withNavigation(Users);