import React from 'react';
import { View, StyleSheet, Image, Animated } from 'react-native';

class ProgressiveImage extends React.Component {
constructor(props) {
  super(props);

	this.thumbnailAnimated = new Animated.Value(0);

  this.imageAnimated = new Animated.Value(0);
}
  handleThumbnailLoad = () => {
    Animated.timing(this.thumbnailAnimated, {
      toValue: 1,
    }).start();
  }
  onImageLoad = () => {
    Animated.timing(this.imageAnimated, {
      toValue: 1,
    }).start();
  }
  render() {
  	const {
      thumbnailSource,
      source,
      style,
      ...props
    } = this.props; 

    return (
		<View style={styles.container}>
        	<Animated.Image
	          {...props}
	          source={thumbnailSource}
	          style={[style, { opacity: this.thumbnailAnimated }]} 
	          onLoad={this.handleThumbnailLoad} 
	          blurRadius={2}
	        />
	        <Animated.Image
	          {...props}
	          source={source}
	          style={[styles.imageOverlay, { opacity: this.imageAnimated }, style]}
	          onLoad={this.onImageLoad}
	        />
        </View>
    );
  }
}
const styles = StyleSheet.create({
  imageOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
  },
  container: {
    backgroundColor: '#e3e8e5',
  },
});

export default ProgressiveImage;