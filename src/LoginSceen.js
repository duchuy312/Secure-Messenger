import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {scale} from 'react-native-size-matters';
import firebaseSDK from '../config/firebaseSDK';
import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const navigation = useNavigation();
  const storeUser = async (EmailStore, PassStore) => {
    try {
      await AsyncStorage.setItem('@Email', EmailStore);
      await AsyncStorage.setItem('@Pass', PassStore);
    } catch (err) {
      console.log('Saving error');
    }
  };
  const SignIn = async (emailuser, password) => {
    try {
      await storeUser(emailuser, password);
      await firebase.auth().signInWithEmailAndPassword(emailuser, password);
      firebase.auth().onAuthStateChanged((user) => {
        console.log(user);
      });
      navigation.navigate('MainStack');
    } catch (error) {
      console.log(error.toString(error));
    }
  };
  const ClearInput = () => {
    setEmail('');
    setPass('');
  };
  return (
    <ImageBackground
      source={require('../assets/image/gradient_2.png')}
      style={styles.Container}>
      <StatusBar translucent backgroundColor="transparent" />
      <View style={styles.ContainerTop}>
        <Text style={styles.text}>Secure Chat</Text>
      </View>
      <View style={styles.ContainerCenter}>
        <View style={styles.textInputContainer}>
          <View style={styles.textInputArea}>
            <TextInput
              value={email}
              onChangeText={(emailinput) => setEmail(emailinput)}
              style={styles.textInput}
              placeholder={'Email'}
            />
          </View>
          <View style={styles.textInputArea}>
            <TextInput
              value={pass}
              onChangeText={(passinput) => setPass(passinput)}
              style={styles.textInput}
              secureTextEntry={true}
              placeholder={'Mật khẩu'}
            />
          </View>
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            SignIn(email, pass);
            ClearInput();
          }}>
          <Text style={styles.ButtonText}>Đăng Nhập</Text>
        </TouchableOpacity>
        <View style={styles.centerText}>
          <Text>Chưa Có Tài Khoản ? </Text>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('RegisterScreen');
            }}>
            <Text style={styles.linktext}>Đăng Ký</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.ContainerBot} />
    </ImageBackground>
  );
};
export default LoginScreen;

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    alignItems: 'center',
  },
  ContainerTop: {
    height: '25%',
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: '100%',
  },
  ContainerCenter: {
    height: '60%',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  ContainerBot: {
    height: '15%',
    alignItems: 'center',
    width: '100%',
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
  textInputContainer: {
    height: scale(150),
    width: '100%',
  },
  textInputArea: {
    backgroundColor: '#F6F4F5',
    width: scale(290),
    height: scale(50),
    alignSelf: 'center',
    borderRadius: scale(25),
    marginBottom: scale(20),
  },
  textInput: {
    width: scale(290),
    height: scale(50),
    alignSelf: 'center',
    fontSize: scale(18),
    marginLeft: scale(30),
  },
  button: {
    backgroundColor: 'rgba(188, 45, 188, 1)',
    width: scale(290),
    height: scale(50),
    alignSelf: 'center',
    borderRadius: scale(25),
    justifyContent: 'center',
    alignItems: 'center',
    elevation: scale(10),
  },
  ButtonText: {
    fontSize: scale(20),
    color: 'white',
  },
  centerText: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: scale(10),
  },
  linktext: {
    fontSize: scale(12),
    color: '#2787CD',
    textDecorationLine: 'underline',
    alignSelf: 'center',
  },
});
