import React, {Component} from 'react';
import { Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'
import { withNavigation, TabNavigator, TabBarBottom } from 'react-navigation'; // Version can be specified in package.json
import ProfilePage from './ProfilePage';
import EditProfile from './EditProfile';
import MarketPlace from './MarketPlace';



const HomeScreen = TabNavigator(
            {
              ProfilePage: { screen: ProfilePage },
              EditProfile: { screen: EditProfile },
              MarketPlace: {screen: MarketPlace},
            },
            {
              navigationOptions: ({ navigation }) => ({
                tabBarIcon: ({ focused, tintColor }) => {
                  const { routeName } = navigation.state;
                  let iconName;
                  if (routeName === 'ProfilePage') {
                    iconName = 'plus';
                  } else if (routeName === 'EditProfile') {
                    iconName = 'plus';
                  } else if (routeName === 'MarketPlace') {
                      iconName = 'plus';
                    }
          
                  // You can return any component that you like here! We usually use an
                  // icon component from react-native-vector-icons
                  return <Icon name={iconName} size={25} color={tintColor} />;
                },
              }),
              tabBarComponent: TabBarBottom,
              tabBarPosition: 'bottom',
              tabBarOptions: {
                activeTintColor: 'tomato',
                inactiveTintColor: 'gray',
              },
              animationEnabled: false,
              swipeEnabled: false,
            }
          ); 
        
    
export default withNavigation(HomeScreen);