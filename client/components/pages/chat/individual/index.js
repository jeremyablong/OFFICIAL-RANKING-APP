import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  TextInput,
  FlatList,
  Button,
  Dimensions,
  KeyboardAvoidingView
} from 'react-native';
import { Container, Header, Left, Body, Right, Button as NativeButton, Title, Text as NativeText } from 'native-base';
import axios from "axios";
import io from "socket.io-client";
import { connect } from "react-redux";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const { width, height } = Dimensions.get('window');

const socket = io('http://recovery-social-media.ngrok.io/', {
	transport: ['websocket']
});

class MessageIndividual extends Component {
  constructor(props) {
    super(props);
    this.state = {
      msg: '',
      messages: [],
      user: null,
      ready: false,
      align: false
    };
  }
  componentDidMount() {
  	axios.post("http://recovery-social-media.ngrok.io/get/user/by/username/filter", {
  		username: this.props.route.params.user.author
  	}).then((res) => {
  		console.log(res.data);
  		if (res.data.message === "FOUND user!") {
			this.setState({
				messages: res.data.messages,
				ready: true,
				user: res.data.user
			})
  		}
  	}).catch((err) => {
  		console.log(err);
  	});
  }

  _renderItem = ({item}) => {
    // if (item.sent === false) {
      if (item.id === this.props.route.params.user.id && item.sender === false) {
      	return (
        	<View style={styles.eachMsg}>
	          <Image source={{ uri: item.image }} style={styles.userPic} />
	          <View style={styles.msgBlock}>
	            <Text style={styles.msgTxt}>{item.message}</Text>
	          </View>
	        </View>
	      );
      } else{
    	if (item.id === this.props.route.params.user.id && item.sender === true) {
	      return (
	        <View style={styles.rightMsg} >
	          <View style={styles.rightBlock} >
	            <Text style={styles.rightTxt}>{item.message}</Text>
	          </View>
	          <Image source={{uri: item.image}} style={styles.userPic} />
	        </View>
	      );
	    }
    }
  };
  renderSockets = () => {
  	socket.on("message", (message) => {
		console.log("message :", message);
	})
  }

  render() {
  	console.log(this.state);
  	const { user } = this.state;
    return (
      <View style={{ flex: 1 }}>
        <Header>
          <Left>
            <NativeButton onPress={() => {
              this.props.navigation.navigate("chat-users");
            }} hasText transparent>
              <NativeText>Back</NativeText>
            </NativeButton>
          </Left>
          <Body>
            <Title>{user !== null ? user.username : "--"}</Title>
          </Body>
          <Right>
            <NativeButton onPress={() => {
            	console.log("clicked chat...");
            }} hasText transparent>
             	<NativeText>Report?</NativeText>
            </NativeButton>
          </Right>
          {this.renderSockets()}
        </Header>
          <View behavior="padding" style={styles.keyboard}>
            {this.state.ready === true ? <FlatList 
              style={styles.list}
              extraData={this.state}
              data={this.state.messages}
              keyExtractor = {(item) => {
                return item.id;
              }}
              renderItem={this._renderItem}/> : null}
            <View style={this.state.align ? styles.loadedInput : styles.input}>
            <KeyboardAvoidingView style={{ flex: 1 }} 
		      behavior={Platform.OS == "ios" ? "padding" : "height"} 
		    >
              <TextInput 
                style={{flex: 1 }}
                value={this.state.msg}
                placeholderTextColor = "#696969"
                onChangeText={msg => this.setState({ msg, align: true })}
                blurOnSubmit={false}
                onSubmitEditing={() => this.send()}
                placeholder="Type a message"
                returnKeyType="send"/>
              </KeyboardAvoidingView>
            </View>
          </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  keyboard: {
    flex: 1,
    justifyContent: 'center',
  },
  image: {
    width,
    height,
  },
  header: {
    height: 65,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#075e54',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  right: {
    flexDirection: 'row',
  },
  chatTitle: {
    color: '#fff',
    fontWeight: '600',
    margin: 10,
    fontSize: 15,
  },
  chatImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    margin: 5,
  },
  loadedInput: {
	flexDirection: 'row',
    alignSelf: 'flex-end',
    padding: 10,
    height: 40,
    width: width - 20,
    backgroundColor: '#fff',
    margin: 10,
    shadowColor: '#3d3d3d',
    shadowRadius: 2,
    shadowOpacity: 0.5,
    shadowOffset: {
      height: 1,
    },
    borderColor:'#696969',
    borderWidth:1,
    position: "absolute",
    right: 0
  },
  input: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
    padding: 10,
    height: 40,
    width: width - 20,
    backgroundColor: '#fff',
    margin: 10,
    shadowColor: '#3d3d3d',
    shadowRadius: 2,
    shadowOpacity: 0.5,
    shadowOffset: {
      height: 1,
    },
    borderColor:'#696969',
    borderWidth:1,
    bottom: 0,
    position: "absolute",
    right: 0
  },
  eachMsg: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    margin: 5,
  },
  rightMsg: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    margin: 5,
    alignSelf: 'flex-end',
  },
  userPic: {
    height: 40,
    width: 40,
    margin: 5,
    borderRadius: 20,
    backgroundColor: '#f8f8f8',
  },
  msgBlock: {
    width: 220,
    borderRadius: 5,
    backgroundColor: '#ffffff',
    padding: 10,
    shadowColor: '#3d3d3d',
    shadowRadius: 2,
    shadowOpacity: 0.5,
    shadowOffset: {
      height: 1,
    },
  },
  rightBlock: {
    width: 220,
    borderRadius: 5,
    backgroundColor: '#147efb',
    padding: 10,
    shadowColor: '#3d3d3d',
    shadowRadius: 2,
    shadowOpacity: 0.5,
    shadowOffset: {
      height: 1,
    },
  },
  msgTxt: {
    fontSize: 15,
    color: '#555',
    fontWeight: '600',
  },
  rightTxt: {
    fontSize: 15,
    color: 'white',
    fontWeight: '600',
  },
});  
const mapStateToProps = state => {
	return {
		id: state.auth.authenticated.id
	}
}
export default connect(mapStateToProps, {  })(MessageIndividual);