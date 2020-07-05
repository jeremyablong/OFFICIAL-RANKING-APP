import React, { Component, Fragment } from 'react';
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
  Keyboard
} from 'react-native';
import { Container, Header, Thumbnail, Left, Body, Right, Button as NativeButton, Title, Text as NativeText, ListItem, List, Footer, FooterTab, Badge } from 'native-base';
import { connect } from "react-redux";
import axios from "axios";
import SideMenu from 'react-native-side-menu';
import NavigationDrawer from "../../navigation/drawer.js";
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart
} from "react-native-chart-kit";
import RBSheet from "react-native-raw-bottom-sheet";
const { width, height } = Dimensions.get("window");
import { authenticated } from "../../../actions/auth/auth.js";

class SocialRankingStatsPage extends Component {
constructor(props) {
  super(props);

  this.state = {
  	data: []
  };
}
	render() {
		// each value represents a goal ring in Progress chart
	const data = {
	  labels: ["1 Stars", "2 Stars", "3 Stars", "4 Stars", "5 Stars"], // optional
	  data: [0.4, 0.6, 0.1, 0.7, 0.9]
	};
	const chartConfig = {
	  backgroundGradientFrom: "#1E2923",
	  backgroundGradientFromOpacity: 0,
	  backgroundGradientTo: "black",
	  backgroundGradientToOpacity: 0.5,
	  color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
	  strokeWidth: 2, // optional, default 3
	  barPercentage: 0.5,
	  useShadowColorFromDataset: false // optional
	};
	const dataTwo = {
	  labels: ["January", "February", "March", "April", "May"],
	  datasets: [
	    {
	      data: [20, 45, 28, 80, 99, 43]
	    }
	  ]
	};
	const pieChartData = [
	  {
	    name: "- 1 Star",
	    timesRated: 9,
	    color: "#0f7337",
	    legendFontColor: "#7F7F7F",
	    legendFontSize: 15
	  },
	  {
	    name: "- 2 Star",
	    timesRated: 11,
	    color: "black",
	    legendFontColor: "#7F7F7F",
	    legendFontSize: 15
	  },
	  {
	    name: "- 3 Star",
	    timesRated: 56,
	    color: "lightgreen",
	    legendFontColor: "#7F7F7F",
	    legendFontSize: 15
	  },
	  {
	    name: "- 4 Star",
	    timesRated: 33,
	    color: "#8cc2a1",
	    legendFontColor: "#7F7F7F",
	    legendFontSize: 15
	  },
	  {
	    name: "- 5 Star",
	    timesRated: 43,
	    color: "#d9ce0b",
	    legendFontColor: "#7F7F7F",
	    legendFontSize: 15
	  }
	];
	const menu = <NavigationDrawer navigation={this.props.navigation}/>;
		return (
			<Fragment>
			<SideMenu isOpen={this.state.isOpen} menu={menu}>
				<Header>
		          <Left>
			      <NativeButton onPress={() => {
		              this.RBSheet.open();
		            }} hasText transparent>
						<Image style={{ width: 45, height: 45, marginBottom: 10 }} source={require("../../../assets/icons/logout.png")}/>
		            </NativeButton>
		          </Left>
		          <Body>
		            <Title>Dashboard</Title>
		          </Body>
		          <Right>
		            <NativeButton onPress={() => {
		            	console.log("clicked user interface...");
		                 {/*this.props.navigation.navigate("chat-users");*/}
					    this.setState({
					    	isOpen: true
					    })
		            }} hasText transparent>
		              <Image style={{ width: 45, height: 45, marginBottom: 10 }} source={require("../../../assets/icons/user-interface.png")}/>
		            </NativeButton>
		          </Right>
		        </Header>
		        <ScrollView style={styles.mainContent}>
					<LineChart
					    data={{
					      labels: ["January", "February", "March", "April", "May", "June"],
					      datasets: [
					        {
					          data: [
					            Math.random() * 100,
					            Math.random() * 100,
					            Math.random() * 100,
					            Math.random() * 100,
					            Math.random() * 100,
					            Math.random() * 100
					          ]
					        }
					      ]
					    }}
					    width={Dimensions.get("window").width}
					    height={260}
					    yAxisLabel="$"
					    yAxisSuffix="k"
					    yAxisInterval={1}
					    chartConfig={{
					      backgroundColor: "#e26a00",
					      backgroundGradientFrom: "#21db6b",
					      backgroundGradientTo: "#08130D",
					      decimalPlaces: 2, // optional, defaults to 2dp
					      color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
					      labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
					      style: {
					        borderRadius: 16
					      },
					      propsForDots: {
					        r: "6",
					        strokeWidth: "2",
					        stroke: "#ffa726"
					      }
					    }}
					    bezier
					    style={{
					      marginVertical: 8,
					      borderRadius: 16
					    }}
					  />
					  <ProgressChart
						  data={data}
						  width={width}
						  height={220}
						  strokeWidth={16}
						  radius={32}
						  chartConfig={{
						      backgroundColor: "#e26a00",
						      backgroundGradientFrom: "#21db6b",
						      backgroundGradientTo: "#08130D",
						      decimalPlaces: 2, // optional, defaults to 2dp
						      color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
						      labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
						      style: {
						        borderRadius: 16
						      },
						      propsForDots: {
						        r: "6",
						        strokeWidth: "2",
						        stroke: "#ffa726"
						      }
						    }}
						  hideLegend={false}
						/>
						<BarChart
						  style={styles.graphStyle}
						  data={dataTwo}
						  width={width}
						  height={350}
						  yAxisLabel="$"
						  chartConfig={{
						      backgroundColor: "#e26a00",
						      backgroundGradientFrom: "#21db6b",
						      backgroundGradientTo: "#08130D",
						      decimalPlaces: 2, // optional, defaults to 2dp
						      color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
						      labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
						      style: {
						        borderRadius: 16
						      },
						    }}
						  verticalLabelRotation={30}
						/>
						<View style={{ paddingLeft: 10 }}>
						<PieChart 
						  data={pieChartData}
						  width={width}
						  height={300}
						  chartConfig={{
						      backgroundColor: "#e26a00",
						      backgroundGradientFrom: "#21db6b",
						      backgroundGradientTo: "#08130D",
						      decimalPlaces: 2, // optional, defaults to 2dp
						      color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
						      labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
						      style: {
						        borderRadius: 16
						      },
						    }}
						  accessor="timesRated"
						  backgroundColor="transparent"
						  paddingLeft="15"
						  absolute
						/>
						</View>
		        </ScrollView>
		        <RBSheet
		          ref={ref => {
		            this.RBSheet = ref;
		          }}
		          height={300}
		          openDuration={250}
		          customStyles={{
		            container: {
		              justifyContent: "center",
		              alignItems: "center"
		            }
		          }}
		        >
		          <View>
					<TouchableOpacity style={styles.card} onPress={() => {
						this.props.authenticated({});
						this.RBSheet.close();
						this.props.navigation.navigate("homepage");	
					}}>
		              <View style={styles.cardContent}>
		                <TouchableOpacity style={styles.followButtonRed} onPress={() => {
							this.props.authenticated({});
							this.RBSheet.close();
							this.props.navigation.navigate("homepage");
		                }}>
		                  <Text style={{ fontSize: 15, color: "white" }}>Sign-out</Text>  
		                </TouchableOpacity>
		              </View>
		            </TouchableOpacity>
		            <TouchableOpacity style={styles.card} onPress={() => {

		            }}>

		              <View style={styles.cardContent}> 
		                <TouchableOpacity style={styles.followButton} onPress={() => {
							this.RBSheet.close();
		                }}>
		                  <Text style={styles.followButtonText}>Cancel</Text>  
		                </TouchableOpacity>
		              </View>
		            </TouchableOpacity>
		          </View>
		        </RBSheet>
		    </SideMenu>
			</Fragment>
		)
	}
}
const styles = StyleSheet.create({
	mainContent: {
		height: height,
		width: width,
		backgroundColor: "white"
	},
	graphStyle: {
		marginTop: 10, 
		marginBottom: 10
	},
  contentList:{
    flex:1,
  },
  cardContent: {
    marginLeft:20,
    marginTop:10,
   	justifyContent: 'center',
    alignItems: 'center',
    alignContent: "center",
    width: width * 0.80
  },

  card:{
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
    elevation: 12,

    marginLeft: 20,
    marginRight: 20,
    marginTop:20,
    backgroundColor:"white",
    padding: 10,
    flexDirection:'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: "center",
    borderRadius:30,
  },
  followButton: {
    height:45,
    width:100,
    padding:10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius:30,
    backgroundColor: "white",
    borderWidth:3,
    borderColor:"black",
    width: width * 0.60
  },
   followButtonRed: {
    height:45,
    width:100,
    padding:10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius:30,
    backgroundColor: "darkred",
    borderWidth:3,
    borderColor:"orange",
    width: width * 0.60
  },
  followButtonText:{
    color: "darkred",
    fontSize:15,
  },
})

export default connect(null, { authenticated })(SocialRankingStatsPage);