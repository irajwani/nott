import React, {Component} from 'react';
import { Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'
import { withNavigation, TabNavigator, TabBarBottom } from 'react-navigation'; // Version can be specified in package.json
import ProfilePage from './ProfilePage';
import MarketPlace from './MarketPlace';
import CreateItem from './CreateItem';



const HomeScreen = TabNavigator(
            {

              Profile: { screen: ProfilePage },
              Market: {screen: MarketPlace},
              Sell: {screen: CreateItem},
              
            },
            {
              navigationOptions: ({ navigation }) => ({
                tabBarIcon: ({ focused, tintColor }) => {
                  const { routeName } = navigation.state;
                  let iconName;
                  if (routeName === 'Profile') {
                    iconName = 'user-circle';
                  } else if (routeName === 'Market') {
                    iconName = 'shopping-bag';
                  } else if (routeName === 'Sell') {
                      iconName = 'plus-circle';
                    }
          
                  // You can return any component that you like here! We usually use an
                  // icon component from react-native-vector-icons
                  return <Icon name={iconName} size={25} color={tintColor} />;
                },
              }),
              tabBarComponent: TabBarBottom,
              tabBarPosition: 'bottom',
              tabBarOptions: {
                activeTintColor: '#121fb5',
                inactiveTintColor: '#8dc999',
              },
              animationEnabled: false,
              swipeEnabled: false,
            }
          ); 
        
    
export default withNavigation(HomeScreen);