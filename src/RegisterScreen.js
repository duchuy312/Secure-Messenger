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
  useEffect(() => {
    getRandomName();
  }, []);
  function createUser() {
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
        userImg:
          'data:image/png;base64,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',
      })
      .then((response) => {
        console.log(response);
      });
  }
  const SignUp = async (emailuser, password) => {
    if (email !== '' && pass !== '' && passReEnter !== '') {
      await firebase
        .auth()
        .createUserWithEmailAndPassword(emailuser, password)
        .then((response) => {
          createUser(response.user._user.uid);
          setModalVisible(true);
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
              placeholder={'M???t kh???u'}
            />
          </View>
          <View style={styles.textInputArea}>
            <TextInput
              value={passReEnter}
              onChangeText={(passinput) => setPassReEnter(passinput)}
              style={styles.textInput}
              secureTextEntry={true}
              placeholder={'Nh???p l???i m???t kh???u'}
            />
          </View>
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            SignUp(email, pass);
            clearInput();
          }}>
          <Text style={styles.ButtonText}>????ng K??</Text>
        </TouchableOpacity>
        <View style={styles.centerText}>
          <Text>???? c?? t??i kho???n ? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
            <Text style={styles.linktext}>????ng Nh???p</Text>
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
            navigation.goBack();
            setModalVisible(false);
          }}>
          <View style={styles.smallModalView}>
            <View style={styles.modalCenter}>
              <CheckIcon />
              <Text style={styles.smallModalText}>????ng k?? th??nh c??ng</Text>
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
                ????ng k?? kh??ng th??nh c??ng, vui l??ng ki???m tra t??n ????ng nh???p ho???c
                m???t kh???u
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
