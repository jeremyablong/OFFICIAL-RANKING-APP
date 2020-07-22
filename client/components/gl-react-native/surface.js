import React from "react";
import { Dimensions } from "react-native";
import { Shaders, Node, GLSL } from "gl-react";
import { Surface, GL } from "gl-react-native";
import timeLoop from "../animations/timeLoop.js";


const { width, height } = Dimensions.get("window");

const shaders = Shaders.create({
  gradients: { frag: GLSL`
precision highp float;
varying vec2 uv;
uniform vec4 colors[3];
uniform vec2 particles[3];
void main () {
  vec4 sum = vec4(0.0);
  for (int i=0; i<3; i++) {
    vec4 c = colors[i];
    vec2 p = particles[i];
    float d = c.a * smoothstep(0.6, 0.2, distance(p, uv));
    sum += d * vec4(c.a * c.rgb, c.a);
  }
  if (sum.a > 1.0) {
    sum.rgb /= sum.a;
    sum.a = 1.0;
  }
  gl_FragColor = vec4(sum.a * sum.rgb, 1.0);
}
`}
});

const Gradients = ({ time }) =>
  <Node
    shader={shaders.gradients}
    uniforms={{
      colors: [
        [ Math.cos(0.002*time), Math.sin(0.002*time), 0.2, 1 ],
        [ Math.sin(0.002*time), -Math.cos(0.002*time), 0.1, 1 ],
        [ 0.3, Math.sin(3+0.002*time), Math.cos(1+0.003*time), 1 ]
      ],
      particles: [
        [ 0.3, 0.3 ],
        [ 0.7, 0.5 ],
        [ 0.4, 0.9 ]
      ]
    }}
  />;

const GradientsLoop = timeLoop(Gradients);

const SurfaceDisplay = (props) => {
  return (
    <Surface style={{ width: width, height: props.height }}>

      <GradientsLoop />
      
    </Surface>
  );
}
export default SurfaceDisplay;

// import React, { Component, Fragment } from "react";
// import {  
//   AppRegistry, 
//   PanResponder, 
//   Dimensions, 
//   StyleSheet,
//   Text,
//   View,
//   TextInput,
//   Button,
//   TouchableHighlight,
//   Image,
//   Alert, 
//   ImageBackground, 
//   Dimensions, 
//   TouchableOpacity } from "react-native";
// import { Surface, resolveAssetSource } from "gl-react-native";
// import GL, { Shaders, Node, GLSL } from "gl-react";
// import BallBody from './ballBody.js';
// import Wall from './wall.js';
// import Ball from './ball.js';
// import Box2D from 'box2dweb';
// import { Container, Header, Left, Body, Right, Button as NativeButton, Title, Text as NativeText } from 'native-base';

// const b2World = Box2D.Dynamics.b2World;
// const b2Vec2 = Box2D.Common.Math.b2Vec2;
// const window = Dimensions.get('window');
// const ratio = window.width / window.height;
// const step = 0.00005;
// const radius = 0.15;
// const someInitialPosition = [0.5, 1.5];
// const image = require('../../assets/icons/volleyball.png');

// let world;
// let ball;
// let lastRendered = 0;



// class SurfaceDisplay extends Component {
// constructor(props) {
//   super(props);

//   this.state = {

//   };
// }
//   handleTouch = (event) => {
//     let touchX = event.nativeEvent.locationX / window.width;
//     let touchY = 1.0 - event.nativeEvent.locationY / window.height;

//     if (this.distance(touchX, touchY / ratio, ball.position()[0], ball.position()[1]) < radius) {
//       this.kickBall(touchX > ball.position()[0] ? -50.0 : 50.0, 500.0);
//     }
//   }

//   kickBall = (x, y) => {
//      ball.applyImpulse(new b2Vec2(x, y));
//   }

//   distance = (x1, y1, x2, y2) => {
//     return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
//   }

//   componentWillMount() {
//     this._panResponder = PanResponder.create({
//       onStartShouldSetPanResponder: (evt, gestureState) => true,
//       onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
//       onMoveShouldSetPanResponder: (evt, gestureState) => true,
//       onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
//       onPanResponderGrant: (evt, gestureState) => {
//         this.handleTouch(evt);
//       }
//     });
//     start();
//   }

//   componentDidUpdate() {
//     move();
//     let now = Date.now();
//     let diff = now - lastRendered;
//     lastRendered = now;
//     let timeout = diff >= 16 ? 0 : 16 - diff;
//     setTimeout(() => {
//       this.forceUpdate();
//     }, timeout);
//   }

//   componentDidMount() {
//     this.componentDidUpdate()
//   }
//   render () {
//     let location = ball.position();
//     let angle = ball.angle();
//     return (
//       <View {...this._panResponder.panHandlers}>
//           <Surface style={{ width: window.width, height: window.height }}>
//             <Node
//               uniforms={{ ratio, radius, location, angle, image }}
//               shader={{ frag: Ball }}
//             />
//           </Surface>
//           <View style={{ justifyContent: "center", alignItems: "center", alignContent: "center", backgroundColor: "black", height: 250 }}>
//             <View ref={ref => this.viewReference = ref} style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)', padding: 10, marginBottom: 30 }}>
//               <Text style={{ marginBottom: 14, fontWeight: "bold", fontSize: 24, color: "white", textAlign: "center" }}>What would you like to do?</Text>
//               <TouchableOpacity onPress={() => {
//                 this.props.navigation.navigate("login");
//               }}><Text style={{ color: "white", textAlign: "center" }}>Already have an account?</Text></TouchableOpacity>
//             </View>
//             <View style={styles.inputContainerCustom}>

//                 <TouchableHighlight style={[styles.buttonContainerTwo, styles.loginButtonTwo]} onPress={() => {
//                   this.setState({
//                     route: "login"
//                   }, () => {
//                     this.handleSubmission(this.state.route);
//                   })
//                 }}>
//                   <Text style={styles.loginText}>SIGN-IN</Text>
//                 </TouchableHighlight>
//                    <TouchableHighlight style={[styles.buttonContainerTwo, styles.loginButtonTwo]} onPress={() => {
//                     this.setState({
//                       route: "sign-up"
//                     }, () => {
//                       this.handleSubmission(this.state.route);
//                     })
//                    }}>
//                   <Text style={styles.loginText}>SIGN-UP</Text>
//                 </TouchableHighlight>
//             </View>
//           </View>
//       </View>
//     );
//   }
// }
// function move() {
//   world.Step(step, 1, 1);
// }

// function start() {
//   world = new b2World(new b2Vec2(0.0, -2000000.0), true);
//   ball = new BallBody(someInitialPosition, radius, world);

//   // vertical walls
//   new Wall(new b2Vec2(0, 0), new b2Vec2(0, 2.0), world);
//   new Wall(new b2Vec2(0.5, 0), new b2Vec2(0.5, 2.0), world);

//   // horizontal walls
//   new Wall(new b2Vec2(0, 0.03), new b2Vec2(1, 0.03), world);
//   new Wall(new b2Vec2(0, 0.5 / ratio), new b2Vec2(1, 0.5 / ratio), world);
// }
// export default SurfaceDisplay;