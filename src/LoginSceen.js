import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Modal,
  Alert,
  KeyboardAvoidingView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {scale} from 'react-native-size-matters';
import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import {XIcon, CheckIcon, GoogleIcon, FacebookIcon} from '../svg/icon';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {LoginManager, AccessToken} from 'react-native-fbsdk';
import AsyncStorage from '@react-native-async-storage/async-storage';
import md5 from 'md5';
import {powerMod, toNumber} from './Crypto/PowerMod';
const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const navigation = useNavigation();
  const [user, setUser] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible1, setModalVisible1] = useState(false);
  const SignIn = async (emailuser, password) => {
    if (emailuser !== '' && password !== '') {
      try {
        await firebase.auth().signInWithEmailAndPassword(emailuser, password);
        firebase.auth().onAuthStateChanged((userfb) => {
          setUser(userfb);
          setModalVisible1(true);
          ClearInput();
          storeSecret(password);
        });
      } catch (error) {
        setModalVisible(true);
      }
    } else {
      setModalVisible(true);
    }
  };
  const ClearInput = () => {
    setEmail('');
    setPass('');
  };
  async function onGoogleButtonPress() {
    // Get the users ID token
    GoogleSignin.configure({
      webClientId:
        '891707416808-t0cms7pchs880n8ugf7h2pjjlmh7u6kf.apps.googleusercontent.com',
    });
    const {idToken} = await GoogleSignin.signIn();
    // Create a Google credential with the token
    firebase.auth().onAuthStateChanged((userfb) => {
      setUser(userfb);
      setModalVisible1(true);
    });
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);
    // Sign-in the user with the credential
    await auth().signInWithCredential(googleCredential);
  }
  const storeSecret = async (value) => {
    try {
      await AsyncStorage.setItem('@MySecret', toNumber(md5(value)));
    } catch (err) {
      alert('Saving error');
    }
  };
  return (
    <ImageBackground
      source={require('../assets/image/gradient_2.png')}
      style={styles.Container}>
      <StatusBar translucent backgroundColor="transparent" />
      <View style={styles.ContainerTop}>
        <Text style={styles.text}>Secure Chat</Text>
      </View>
      <KeyboardAvoidingView style={styles.ContainerCenter}>
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
        <TouchableOpacity
          onPress={() => onGoogleButtonPress()}
          style={styles.GoogleButton}>
          <View style={styles.GoogleIcon}>
            <GoogleIcon />
          </View>
          <View style={styles.GoogleButtonRight}>
            <Text style={styles.GoogleButtonText}>
              Login with Google Account
            </Text>
          </View>
        </TouchableOpacity>
      </KeyboardAvoidingView>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
        }}>
        <TouchableOpacity
          style={styles.smallCenteredView}
          onPress={() => {
            setModalVisible(false);
          }}>
          <View style={styles.smallModalView}>
            <View style={styles.modalCenter}>
              <View style={styles.circleX}>
                <XIcon />
              </View>
              <Text style={styles.smallModalText}>
                Đăng nhập không thành công, vui lòng kiểm tra tên đăng nhập hoặc
                mật khẩu
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible1}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
        }}>
        <TouchableOpacity
          style={styles.smallCenteredView}
          onPress={() => {
            navigation.navigate('MainStack');
            setModalVisible1(false);
          }}>
          <View style={styles.smallModalView}>
            <View style={styles.modalCenter}>
              <CheckIcon />
              <Text style={styles.smallModalText}>Đăng nhập thành công</Text>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
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
    paddingTop: scale(80),
    height: '75%',
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
    height: scale(140),
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
  smallCenteredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(100,100,100, 0.9)',
  },
  smallModalView: {
    height: scale(300),
    width: scale(300),
    backgroundColor: 'white',
    borderRadius: scale(5),
    alignItems: 'center',
    shadowColor: '#000',
    elevation: scale(5),
    justifyContent: 'center',
    padding: scale(8),
  },
  smallModalText: {
    color: 'black',
    fontSize: scale(15),
    textAlign: 'center',
  },
  modalCenter: {
    justifyContent: 'space-between',
    height: scale(150),
    alignItems: 'center',
  },
  circleX: {
    height: scale(140),
    width: scale(140),
    borderRadius: scale(70),
    backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
  },
  GoogleButton: {
    marginTop: scale(20),
    flexDirection: 'row',
    width: scale(220),
    height: scale(40),
    backgroundColor: '#0079ff',
    borderRadius: scale(5),
    borderWidth: scale(1 / 2),
    borderColor: '#518ef8',
    elevation: scale(1),
  },
  GoogleIcon: {
    borderTopLeftRadius: scale(5),
    borderBottomLeftRadius: scale(5),
    height: scale(40),
    backgroundColor: 'white',
    width: scale(40),
    justifyContent: 'center',
    alignItems: 'center',
  },
  GoogleButtonRight: {
    justifyContent: 'center',
    alignItems: 'center',
    width: scale(175),
  },
  GoogleButtonText: {
    color: 'white',
    fontSize: scale(14),
  },
  FacebookIcon: {
    borderTopLeftRadius: scale(5),
    borderBottomLeftRadius: scale(5),
    height: scale(40),
    backgroundColor: '#1976d2',
    width: scale(40),
    justifyContent: 'center',
    alignItems: 'center',
  },
  FacebookButton: {
    marginTop: scale(20),
    flexDirection: 'row',
    width: scale(220),
    height: scale(40),
    backgroundColor: '#2149a4',
    borderRadius: scale(5),
    elevation: scale(1),
    alignItems: 'center',
  },
});
