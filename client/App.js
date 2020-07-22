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
import axios from "axios";
import RNLocation from 'react-native-location';
import BackgroundGeolocation from "react-native-background-geolocation";
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
import ImageGalleryWall from "./components/pages/gallery/imageGalleryWall.js";
import UploadProfilePicPage from "./components/pages/profile/uploadProfilePicPage.js";
import InstagramFeedPage from "./components/pages/instagram-feed/imageFeed.js";
import NotificationsPage from "./components/pages/notifications/notificationsPage.js";
import FriendListMain from "./components/pages/friends/friendList.js";
import DisplayNearbyUsers from "./components/pages/ranking/nearbyUsers/displayNearbyUsers.js";
import SocialRankingStatsPage from "./components/pages/socialRankingStats/stats.js";
import IndividualStory from "./components/pages/stories/individualStory.js";
import PostToWallPage from "./components/pages/wall/post/postToWall.js";
import ConfirmFriendPage from "./components/pages/friends/confirmFriendPage.js";
import LiveStreamPageDisplay from "./components/pages/live_stream/display/index.js";
import ProfileSettingsPage from "./components/pages/profile_settings/index.js";
import EditProfileHomepage from "./components/pages/profile/edit/editProfileHomepage.js";
import NewsHomepage from "./components/pages/news/newsHomepage.js";
import MarketplaceHomepage from "./components/pages/marketplace/marketplaceHomepage.js";
import IndividualWallPosting from "./components/pages/wall/individual/index.js";
import ProfileMenuListDisplay from "./components/pages/profile/profile_menu_list/list.js";
import MusicPlayerPage from "./components/pages/music/musicPlayerPage.js";
import StoriesPageSlider from "./components/pages/stories/slider/storiesPageSlider.js";
import CreateStoryFeedPage from "./components/pages/stories/create.js";

import { locationBackground, latLngLocation } from "./actions/location/getLocation.js";

const Stack = createStackNavigator();

// COLOR SCHEME
// baby blue - #97DFFC
// cornflower blue - #858AE3
// ocean blue - #613DC1
// blue violet color wheel - #4E148C
// russian violet - #2C0735
// #5eb8db

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
  componentDidMount() {
    ////
    // 1.  Wire up event-listeners
    //
    console.log("this.props.username", this.props.username);

    // This handler fires whenever bgGeo receives a location update.
    BackgroundGeolocation.onLocation(this.onLocation, this.onError);
 
    // This handler fires when movement states changes (stationary->moving; moving->stationary)
    BackgroundGeolocation.onMotionChange(this.onMotionChange);
 
    // This event fires when a change in motion activity is detected
    BackgroundGeolocation.onActivityChange(this.onActivityChange);
 
    // This event fires when the user toggles location-services authorization
    BackgroundGeolocation.onProviderChange(this.onProviderChange);
 
    ////
    // 2.  Execute #ready method (required)
    //
    BackgroundGeolocation.ready({
      // Geolocation Config
      desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
      distanceFilter: 10,
      // Activity Recognition
      stopTimeout: 1,
      // Application config
      debug: true, // <-- enable this hear sounds for background-geolocation life-cycle.
      logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,
      stopOnTerminate: false,   // <-- Allow the background-service to continue tracking when user closes the app.
      startOnBoot: true,        // <-- Auto start tracking when device is powered-up.
      // HTTP / SQLite config
      url: 'http://recovery-social-media.ngrok.io',
      batchSync: false,       // <-- [Default: false] Set true to sync locations to server in a single HTTP request.
      autoSync: true         // <-- [Default: true] Set true to sync each location to server as it arrives.
      // headers: {              // <-- Optional HTTP headers
      //   "X-FOO": "bar"
      // },
      // params: {               // <-- Optional HTTP params
      //   "auth_token": "maybe_your_server_authenticates_via_token_YES?"
      // }
    }, (state) => {
      console.log("- BackgroundGeolocation is configured and ready: ", state);
      // should be (!state.enabled)
      if (state.enabled) {
        ////
        // 3. Start tracking!
        //
        BackgroundGeolocation.start(() => {
          console.log("- Start success");
        });
      }
    });
  }
  onLocation = (location) => {
    console.log('[location] -', location);
      if (this.props.username) {
        axios.post("http://recovery-social-media.ngrok.io/post/location/moving/geolocation", {
          username: this.props.username,
          location
        }).then((res) => {
          console.log("Resolution data : ", res.data);
        }).catch((err) => {
          console.log(err);
        })
        this.props.locationBackground(location);
      }
  }
  onError = (error) => {
    console.warn('[location] ERROR -', error);
  }
  onActivityChange = (event) => {
    console.log('[activitychange] -', event);  // eg: 'on_foot', 'still', 'in_vehicle'
    
    if (event.activity === "on_foot" && event.confidence >= 50) {
      console.log("We are moving!");
    } else if (event.activity === "in_vehicle" && event.confidence >= 50) {
      console.log("we are in a vehicle moving...");
    } else if (event.activity === "still" && event.confidence >= 50) {
      console.log("No movement detected.")
    }
  }
  onProviderChange = (provider) => {
    console.log('[providerchange] -', provider.enabled, provider.status);
  }
  onMotionChange = (event) => {
    console.log('[motionchange] -', event.isMoving, event.location);
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
            <Stack.Screen name="image-gallery" component={ImageGalleryWall} />
            <Stack.Screen name="upload-profile-picture" component={UploadProfilePicPage} />
            <Stack.Screen name="view-instagram-style-images" component={InstagramFeedPage} />
            <Stack.Screen name="notifications" component={NotificationsPage} />
            <Stack.Screen name="friends-list" component={FriendListMain} />
            <Stack.Screen name="rank-nearby-users" component={DisplayNearbyUsers} />
            <Stack.Screen name="social-ranking-stats" component={SocialRankingStatsPage} />
            <Stack.Screen name="story-individual" component={IndividualStory} />
            <Stack.Screen name="post-to-wall-page" component={PostToWallPage} />
            <Stack.Screen name="handle-request" component={ConfirmFriendPage} /> 
            <Stack.Screen name="live-stream-start" component={LiveStreamPageDisplay} />
            <Stack.Screen name="profile-settings" component={ProfileSettingsPage} />
            <Stack.Screen name="edit-profile" component={EditProfileHomepage} />
            <Stack.Screen name="news-homepage" component={NewsHomepage} />
            <Stack.Screen name="marketplace-homepage" component={MarketplaceHomepage} />
            <Stack.Screen name="wall-individual" component={IndividualWallPosting} /> 
            <Stack.Screen name="profile-settings-list" component={ProfileMenuListDisplay} />
            <Stack.Screen name="profile-music-playlist" component={MusicPlayerPage} />
            <Stack.Screen name="stories-review-show" component={StoriesPageSlider} />
            <Stack.Screen name="create-story-feed" component={CreateStoryFeedPage} />
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
    authenticated: state.auth.authenticated ? state.auth.authenticated.fullName : "--",
    username: state.auth.authenticated.username
  }
}

export default connect(mapStateToProps, { locationBackground, latLngLocation })(App);
