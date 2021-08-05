/* eslint-disable no-alert */
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
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {scale} from 'react-native-size-matters';
import firebase from '@react-native-firebase/app';
import {XIcon, CheckIcon} from '../svg/icon';
import firestore from '@react-native-firebase/firestore';
import AvatarDefault from '../assets/image';
import md5 from 'md5';
import {powerMod, toNumber} from './Crypto/PowerMod';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RegisterScreen = () => {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [passReEnter, setPassReEnter] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible1, setModalVisible1] = useState(false);
  const navigation = useNavigation();
  const [randomName, setRandomName] = useState('');
  function getRandomName() {
    setRandomName(Math.floor(100000 + Math.random() * 900000));
  }
  function validate(emailCheck, passwordCheck, pass1) {
    const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    const regpass = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (emailCheck === '' || passwordCheck === '' || pass1 === '') {
      alert('Vui lòng nhập đủ thông tin');
    } else if (reg.test(emailCheck) === false) {
      alert('Sai Gmail');
    } else if (regpass.test(passwordCheck) === false) {
      alert(
        'Mật khẩu phải chứa ít nhất 8 kí tự, ít nhất một chữ cái, một chữ số',
      );
    } else {
      SignUp(emailCheck, passwordCheck);
    }
  }
  const storeSecret = async (value) => {
    try {
      await AsyncStorage.setItem('@MySecret', toNumber(md5(value)));
    } catch (err) {
      Alert.alert('Saving error');
    }
  };
  useEffect(() => {
    getRandomName();
  }, []);
  function createUser(id, Secret) {
    // create new thread using firebase & firestore
    firestore()
      .collection('USERS')
      .add({
        email: email,
        userid: id,
        fullname: 'user' + randomName,
        gender: 3,
        phone: '',
        birthday: 0,
        city: '',
        userImg: AvatarDefault.image,
        publickey: powerMod(59998, Secret, 252730693437797308063910423110179591439),
      })
      .then((response) => {
        Alert.alert('created');
      });
  }
  const SignUp = async (emailuser, password) => {
    if (email !== '' && pass !== '' && passReEnter !== '') {
      await firebase
        .auth()
        .createUserWithEmailAndPassword(emailuser, password)
        .then((response) => {
          createUser(response.user._user.uid, toNumber(md5(password)));
          storeSecret(password);
          setModalVisible(true);
        })
        .catch((error) => {
          if (error.code === 'auth/email-already-in-use') {
            alert('That email address is already in use!');
          }

          if (error.code === 'auth/invalid-email') {
            alert('That email address is invalid!');
          }
          console.error(error);
        });
    } else {
      setModalVisible1(true);
    }
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
            validate(email, pass, passReEnter);
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
            navigation.navigate('MainStack');
            setModalVisible(false);
          }}>
          <View style={styles.smallModalView}>
            <View style={styles.modalCenter}>
              <CheckIcon />
              <Text style={styles.smallModalText}>Đăng ký thành công</Text>
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
            setModalVisible1(false);
          }}>
          <View style={styles.smallModalView}>
            <View style={styles.modalCenter}>
              <View style={styles.circleX}>
                <XIcon />
              </View>
              <Text style={styles.smallModalText}>
                Đăng ký không thành công, vui lòng kiểm tra tên đăng nhập hoặc
                mật khẩu
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
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
});
