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
import firestore from '@react-native-firebase/firestore';

const RegisterScreen = () => {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [passReEnter, setPassReEnter] = useState('');
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();
  const navigation = useNavigation();
  function createUser(id) {
    if (id.length > 0) {
      // create new thread using firebase & firestore
      firestore()
        .collection('USERS')
        .add({
          email: email,
          userid: id,
          fullname: '',
          gender: 3,
          phone: '',
          birthday: 0,
          city: '',
          userImg: '',
        })
        .then((response) => {
          console.log(response);
        });
    }
  }
  const SignUp = async (emailuser, password) => {
    await firebase
      .auth()
      .createUserWithEmailAndPassword(emailuser, password)
      .then((response) => {
        createUser(response.user._user.uid);
      })
      .catch((error) => {
        if (error.code === 'auth/email-already-in-use') {
          console.log('That email address is already in use!');
        }

        if (error.code === 'auth/invalid-email') {
          console.log('That email address is invalid!');
        }
        console.error(error);
      });
  };
  const clearInput = () => {
    setEmail('');
    setPass('');
    setPassReEnter('');
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
          <View style={styles.textInputArea}>
            <TextInput
              value={passReEnter}
              onChangeText={(passinput) => setPassReEnter(passinput)}
              style={styles.textInput}
              secureTextEntry={true}
              placeholder={'Nhập lại mật khẩu'}
            />
          </View>
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            SignUp(email, pass);
            clearInput();
          }}>
          <Text style={styles.ButtonText}>Đăng Ký</Text>
        </TouchableOpacity>
        <View style={styles.centerText}>
          <Text>Đã có tài khoản ? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
            <Text style={styles.linktext}>Đăng Nhập</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.ContainerBot} />
    </ImageBackground>
  );
};
export default RegisterScreen;

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
    height: scale(210),
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
    width: scale(250),
    height: scale(50),
    alignSelf: 'center',
    fontSize: scale(18),
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
