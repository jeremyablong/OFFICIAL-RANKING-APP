import React from 'react';
import { View, Text, StyleSheet, ImageBackground, Dimensions } from "react-native";
import AppIntroSlider from 'react-native-app-intro-slider';
import { registerIntroSeen } from "../../actions/intro/index.js";
import { connect } from "react-redux";
// import { authenticated } from "../../actions/auth/auth.js";

const slides = [
  {
    key: 1,
    title: 'Title 1',
    text: 'Description.\n Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Et malesuada fames ac turpis. Ac feugiat sed lectus vestibulum mattis. Id leo in vitae turpis massa sed elementum. Urna condimentum mattis \n\n pellentesque id nibh tortor id aliquet lectus. Pellentesque sit amet porttitor eget dolor morbi non arcu. Risus at ultrices mi tempus imperdiet nulla. Volutpat blandit aliquam etiam erat velit scelerisque in dictum non. ',
    image: require('../../assets/images/group-one.jpg'),
    backgroundColor: '#59b2ab',
  },
  {
    key: 2,
    title: 'Title 2',
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. \n\n Et malesuada fames ac turpis. Ac feugiat sed lectus vestibulum mattis. Id leo in vitae turpis massa sed elementum. \n\n Urna condimentum mattis pellentesque id nibh tortor id aliquet lectus. Pellentesque sit amet porttitor eget dolor morbi non arcu. Risus at ultrices mi tempus imperdiet nulla. Volutpat blandit aliquam etiam erat velit scelerisque in dictum non. ',
    image: require('../../assets/images/group-two.jpg'),
    backgroundColor: '#febe29',
  },
  {
    key: 3,
    title: 'Title 3',
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Et malesuada fames ac turpis. Ac feugiat sed lectus vestibulum mattis. Id leo in vitae turpis massa sed elementum. Urna condimentum mattis pellentesque id nibh tortor id aliquet lectus. Pellentesque sit amet porttitor \n\n eget dolor morbi non arcu. Risus at ultrices mi tempus imperdiet nulla. Volutpat blandit aliquam etiam erat velit scelerisque in dictum non. ',
    image: require('../../assets/images/group-three.jpg'),
    backgroundColor: '#22bcb5',
  }
];

const { width, height } = Dimensions.get("window");

class IntroSlider extends React.Component {
constructor(props) {
  super(props);

  this.state = {};
}
    _renderItem = ({ item }) => {
    	console.log(item);
	    return (
	    <ImageBackground style={styles.background} source={item.image}>
	      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.3)' }}>
	        <Text style={styles.title}>{item.title}</Text>
	        
	        <Text style={styles.desc}>{item.text}</Text>
	      </View>
	    </ImageBackground>
	    );
    }
    _onDone = () => {
	    // User finished the introduction. Show real app through
	    // navigation or simply by controlling state
	    this.setState({ showRealApp: true });
	    this.props.registerIntroSeen(true);
      // this.props.authenticated({});
    }
	render() {
		return (
			<>
				<AppIntroSlider renderItem={this._renderItem} data={slides} onDone={this._onDone}/>
			</>
		)
	}
}
const styles = StyleSheet.create({
    slide: {
    
    },
    title: {
	    color: "white",
	    fontSize: 40,
	    textAlign: "center",
	    marginTop: -100,
	    fontWeight: "bold"
    },
    subtitle: {
	    color: "white",
	    padding: 20,
	    fontSize: 20
    },
    image: {
	    height: height,
	    width: width
    },
    desc: {
	    color: "white",
	    fontSize: 20,
	    padding: 20,
   		textAlign: "center"
    },
	background: {
		width: width,
		height: height
	}
})

export default connect(null, { registerIntroSeen })(IntroSlider);