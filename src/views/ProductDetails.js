import React, { Component } from 'react'
import { Text, View } from 'react-native'
import { withNavigation } from 'react-navigation';
import Carousel from 'react-native-snap-carousel';

class ProductDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {};

  }

  _renderItem( {item, index} ) {
    

  }

  render() {


    return (
      
      <Carousel
        ref={(c) => { this._carousel = c; }}
        data={this.state.entries}
        renderItem={this._renderItem}
        sliderWidth={sliderWidth}
        itemWidth={itemWidth}
      />
      
    )
  }
}

export default withNavigation(ProductDetails);