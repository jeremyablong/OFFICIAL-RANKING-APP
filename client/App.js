import 'react-native-gesture-handler';
import React, { Component } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { connect } from "react-redux";
import IntroSlider from "./components/introSlider/index.js";

const Stack = createStackNavigator();

class App extends Component {
constructor(props) {
  super(props);

  this.state = {
    showRealApp: false
  };
}
  isEmpty = () => {
    for(var prop in this.props.completed) {
      if(this.props.completed.hasOwnProperty(prop)) {
        return true;
      }
    }
    console.log("Magic :", JSON.stringify(this.props.completed) === JSON.stringify({}));
    return JSON.stringify(this.props.completed) !== JSON.stringify({});
    return false;
  }
  getStartingPage = () => {
      if (!this.props.authenticated) {
        return "homepage";
      } 
      return "homepage";
  }
  render () {
    return (
      <NavigationContainer>
          <Stack.Navigator screenOptions={{
              headerShown: false
            }} initialRouteName={this.getStartingPage()}>
            <Stack.Screen name="homepage" component={IntroSlider} />
          </Stack.Navigator>
        </NavigationContainer>
    );
  }
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});
const mapStateToProps = (state) => {
  console.log(state);
  return {
    authenticated: state.auth.authenticated
  }
}

export default connect(mapStateToProps, {   })(App);
