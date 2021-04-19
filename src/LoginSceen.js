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
import auth from '@react-native-firebase/auth';
import {XIcon, CheckIcon} from '../svg/icon';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible1, setModalVisible1] = useState(false);
  const SignIn = async (emailuser, password) => {
    if (emailuser !== '' && password !== '') {
      try {
        await firebase.auth().signInWithEmailAndPassword(emailuser, password);
        firebase.auth().onAuthStateChanged((user) => {
          console.log(user);
        });
        setModalVisible1(true);
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
