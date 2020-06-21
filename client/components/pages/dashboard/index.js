import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  TouchableHighlight,
  Image,
  Alert, 
  ImageBackground, 
  Dimensions
} from 'react-native';
import { Container, Header, Left, Body, Right, Button as NativeButton, Title, Text as NativeText } from 'native-base';
import { connect } from "react-redux";
import { authenticated } from "../../../actions/auth/auth.js";
import Carousel from 'react-native-snap-carousel';

const { width, height } = Dimensions.get("window");

class DashboardAfterAuth extends React.Component {
constructor(props) {
  super(props);

  this.state = {};
}
    _renderItem = ({item, index}) => {
        return (
            <View style={styles.slide}>
                <Text style={styles.title}>{ item.title }</Text>
            </View>
        );
    }

	render() {
		return (
		<React.Fragment>
		<Header>
          <Left>
            <NativeButton onPress={() => {
              this.props.authenticated({});
              this.props.navigation.navigate("login");
            }} hasText transparent>
              <NativeText>Sign-Out</NativeText>
            </NativeButton>
          </Left>
          <Body>
            <Title>Dashboard</Title>
          </Body>
          <Right>
            <NativeButton hasText transparent>
              <NativeText>help?</NativeText>
            </NativeButton>
          </Right>
        </Header>
			<View>
				<Carousel
	              ref={(c) => { this._carousel = c; }}
	              data={this.state.entries}
	              renderItem={this._renderItem}
	              sliderWidth={width * 0.90}
	              itemWidth={width}
	            />
			</View>
		</React.Fragment>
		)
	}
}

export default connect(null, { authenticated })(DashboardAfterAuth);