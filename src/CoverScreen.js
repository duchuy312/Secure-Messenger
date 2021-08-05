import React from 'react';
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  Image,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {scale} from 'react-native-size-matters';
import auth from '@react-native-firebase/auth';

const CoverScreen = () => {
  const navigation = useNavigation();
  return (
    <ImageBackground
      source={require('../assets/image/gradient_2.png')}
      style={styles.Container}>
      <StatusBar translucent backgroundColor="transparent" />
      <View style={styles.ContainerTop}>
        <Text style={styles.text}>Secure Chat</Text>
      </View>
      <View style={styles.ContainerCenter}>
        <View style={styles.logocontainer}>
          <Image
            style={styles.logo}
            source={require('../assets/image/chat.png')}
          />
        </View>
      </View>
      <View style={styles.ContainerBot}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            {
              auth().currentUser !== null
                ? navigation.navigate('MainStack')
                : navigation.navigate('LoginScreen');
            }
          }}>
          <Text style={styles.buttonText}>Next page</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};
export default CoverScreen;

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    alignItems: 'center',
  },
  ContainerTop: {
    height: '20%',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  ContainerCenter: {
    height: '60%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ContainerBot: {
    height: '20%',
    alignItems: 'center',
  },
  logocontainer: {
    height: scale(160),
    width: scale(160),
    alignItems: 'center',
    alignSelf: 'center',
  },
  logo: {
    flex: 1,
    height: '100%',
    width: '100%',
    resizeMode: 'stretch',
  },
  text: {
    fontSize: scale(80),
    color: 'white',
    fontFamily: 'kindandrich',
  },
  button: {
    backgroundColor: 'rgba(188, 45, 188, 1)',
    width: scale(200),
    height: scale(50),
    alignSelf: 'center',
    borderRadius: scale(25),
    justifyContent: 'center',
    alignItems: 'center',
    elevation: scale(10),
  },
  buttonText: {
    fontSize: scale(18),
    color: 'white',
  },
});
