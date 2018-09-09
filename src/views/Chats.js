import React, { Component } from 'react'
import { Text, StyleSheet, View } from 'react-native'
import {database} from '../cloud/database'
import firebase from '../cloud/firebase';

export default class Chats extends Component {
  render() {
    return (
      <View>
        <Text> textInComponent </Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({})
