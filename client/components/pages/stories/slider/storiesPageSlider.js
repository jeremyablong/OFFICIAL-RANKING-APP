import React, { Fragment, Component } from 'react';
import Carousel from 'react-native-snap-carousel';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  TouchableHighlight, 
  TouchableOpacity, 
  Image,
  Alert, 
  ImageBackground, 
  Dimensions, 
  ScrollView, 
  FlatList, 
  Keyboard, 
  Animated
} from 'react-native';
import { Container, Header, Thumbnail, Left, Body, Right, Button as NativeButton, Title, Text as NativeText, ListItem, List, Footer, FooterTab, Badge } from 'native-base';
import ProgressiveImage from "../../../image/image.js";

const { width, height } = Dimensions.get("window");
 



export class StoriesPageSlider extends Component {
constructor(props) {
  super(props);

  this.state = {
  	isOpen: false,
  	stories: [
        {
            name: 'pinkSwear372@sjs',
            image: require('../../../../assets/images/abstract.jpg')
        },
        {
            name: 'shadman@_96',
            image: require('../../../../assets/images/back-massage.jpg')
        },
        {
            name: 'Shaanay_45@',
            image: require('../../../../assets/images/beach.jpg')
        },
        {
            name: 'Dating@_23',
            image: require('../../../../assets/images/bloom.jpg')
        },
        {
            name: 'ALka_laka21',
            image: require('../../../../assets/images/blur.jpg')
        },
        {
            name: 'store.Enappd_2019',
            image: require('../../../../assets/images/classic.jpg')
        },
        {
            name: 'Akas_Motwami@2',
            image: require('../../../../assets/images/group-one.jpg')
        },
        {
            name: 'md_sadman96',
            image: require('../../../../assets/images/group-three.jpg')
        },
        {
            name: 'Anjeline_Shroff89',
            image: require('../../../../assets/images/man-med.jpg')
        },
        {
            name: 'Jessica_Alba25',
            image: require('../../../../assets/images/modern.jpg')
        }
    ],
  };
}
    _renderItem ({item, index}) {
    	console.log("ITEM :", item);
        return (
            <View style={styles.slide}>
                <ProgressiveImage source={item.image} style={{ width: width, height: height }} />
            </View>
        );
    }

	render() {
		return (
			<Fragment>
					{/*<Header>
					  <Left>
					    <NativeButton onPress={() => {
					      console.log("clicked.");
					      this.props.navigation.navigate("dashboard");
					    }} hasText transparent>
					      <Image style={{ width: 45, height: 45, marginBottom: 10 }} source={require("../../../../assets/icons/construction.png")}/>
					    </NativeButton>
					  </Left>
					  <Body>
					    <Title>Stories</Title>
					  </Body>
					  <Right>
					    <NativeButton onPress={() => {
					    	console.log("clicked user interface...");
					    	this.setState({
					    		isOpen: true
					    	})
					    }} hasText transparent>
					      <Image style={{ width: 45, height: 45, marginBottom: 10 }} source={require("../../../../assets/icons/user-interface.png")}/>
					    </NativeButton>
					  </Right>
					</Header>*/}
					<ScrollView style={{ height, width, backgroundColor: "white" }}>
						<Carousel  
						  autoplay={true}
						  autoplayInterval={4500}
 						  vertical={true}
			              ref={(c) => { this._carousel = c; }}
			              data={this.state.stories}
			              renderItem={this._renderItem} 
			              sliderHeight={height} 
			              itemHeight={height}
			              sliderWidth={width}
			              itemWidth={width}
			            />
					</ScrollView>
			</Fragment>
		)
	}
}
const styles = StyleSheet.create({

})
export default StoriesPageSlider;