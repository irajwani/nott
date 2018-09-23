import React, { Component } from 'react';
import {ScrollView, View, Text, Image, StyleSheet} from 'react-native';
import { withNavigation } from 'react-navigation';
import CustomCarousel from '../components/CustomCarousel';
// import styles from '../styles.js'
import { database } from '../cloud/database';


class ProductDetails extends Component {

  constructor(props){
    super(props);
    this.state = {
      isGetting: true,
      profile: {
        name: '',
        email: '',
      }
    }
  }

  componentWillMount() {
    const {params} = this.props.navigation.state;

    setTimeout(() => {
      this.getProfile(params.data);
    }, 4);
  }

  getProfile(data) {
    database.then( (d) => {
      const profile = d.Users[data.uid].profile;

      this.setState( {profile} )
    })
    .then( () => {
      this.setState({isGetting: false})
    })
  }

  render() {
    const { params } = this.props.navigation.state;
    const { comments } = params;
    const {profile} = this.state;
    const text = params.data.text;

    console.log("videos: updating")

    if (this.state.isGetting) {
      return (
        <View>
          <Text> Loading... </Text>
        </View>
      )
    }

    return (

      <ScrollView contentContainerStyle={styles.contentContainer}>

        {/* image carousel */}

        <CustomCarousel data={params.data.uris} />

        {/* product details */}
        <Text style={styles.brandText}> {text.brand.toUpperCase()} </Text>
        <Text style={styles.nameText}> {text.name.toUpperCase() } </Text>
        {/* row showing user details */}
        <View style={profileRowStyles.separator}/>
        <View style={profileRowStyles.rowContainer}>
          {/* row containing profile picture, and user details */}
          <Image source={ {uri: profile.uri }} style={profileRowStyles.profilepic} />
          <View style={profileRowStyles.textContainer}>
            
            <Text style={profileRowStyles.name}>
              {profile.name}
            </Text>
            <Text style={profileRowStyles.email}>
              {params.email}
            </Text>
          </View>
          
        </View>
        
        <View style={profileRowStyles.separator}/>

        {/* more details */}

        {/* buy button */}

        {/* comments */}

        {/* <CustomComments comments={comments} /> */}

      </ScrollView> 
    );
  }
}

export default withNavigation(ProductDetails);

const styles = StyleSheet.create( {
  contentContainer: {
    flexGrow: 1, 
    backgroundColor: '#fff',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    padding: 5,
    marginTop: 5,
    marginBottom: 5
  },

  brandText: {
    fontFamily: 'Courier-Bold',
    fontSize: 30,
    fontWeight: '400'
  },

  nameText: {
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: 20,
  },
} )

const profileRowStyles = StyleSheet.create( {
  rowContainer: {
    flexDirection: 'row',
    padding: 20
  },


  profilepic: {
    borderWidth:1,
    borderColor:'#207011',
    alignItems:'center',
    justifyContent:'center',
    width:70,
    height:70,
    backgroundColor:'#fff',
    borderRadius:50,
    borderWidth: 2

},

textContainer: {
  flex: 1,
  flexDirection: 'column',
  alignContent: 'center',
  padding: 5,
},

name: {
  fontSize: 18,
  color: '#207011',
},

email: {
    fontSize: 18,
    color: '#0394c0',
    fontStyle: 'italic'
  },  

separator: {
  height: 1,
  backgroundColor: 'black'
},
} )