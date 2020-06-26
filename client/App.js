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
import LandingPage from "./components/pages/landing/index.js";
import SignupPage from "./components/pages/signup/signup.js";
import LoginPage from "./components/pages/login/index.js";
import DashboardAfterAuth from "./components/pages/dashboard/index.js";
import ListOfMessages from "./components/pages/chat/list/listOfMessages.js";
import MessageIndividual from "./components/pages/chat/individual/index.js";
import ProfileIndividual from "./components/pages/profile/individual.js";
import PublicWall from "./components/pages/wall/public/publicWall.js";
import ProfilePicView from "./components/pages/wall/public/profilePicView.js";

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
      if (this.props.intro !== true) {
        return "intro";
      } else if (this.props.authenticated) {
        return "dashboard";
      }
      return "homepage";
  }

  render () {
    return (
      <NavigationContainer>
          <Stack.Navigator screenOptions={{
              headerShown: false
            }} initialRouteName={this.getStartingPage()}>
            <Stack.Screen name="intro" component={IntroSlider} />
            <Stack.Screen name="homepage" component={LandingPage} />
            <Stack.Screen name="sign-up" component={SignupPage} />
            <Stack.Screen name="login" component={LoginPage} />
            <Stack.Screen name="dashboard" component={DashboardAfterAuth} />
            <Stack.Screen name="chat-users" component={ListOfMessages} />
            <Stack.Screen name="message-individual" component={MessageIndividual} />
            <Stack.Screen name="profile-individual" component={ProfileIndividual} />
            <Stack.Screen name="public-wall" component={PublicWall} />
            <Stack.Screen name="profile-pic-view" component={ProfilePicView} />
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
    intro: state.intro.intro,
    authenticated: state.auth.authenticated.fullName
  }
}

export default connect(mapStateToProps, {   })(App);
