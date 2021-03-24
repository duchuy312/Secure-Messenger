import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {scale} from 'react-native-size-matters';
import {GiftedChat} from 'react-native-gifted-chat';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const ChatScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState();
  const [pass, setPass] = useState();
  const [roomName, setRoomName] = useState('');
  const user = auth().currentUser.toJSON();
  function createChatRoom() {
    if (roomName.length > 0) {
      // create new thread using firebase & firestore
      firestore()
        .collection('MESSAGE_THREADS')
        .add({
          roomof: user.uid,
          name: roomName,
          latestMessage: {
            text: `${roomName} created. Welcome!`,
            createdAt: new Date().getTime(),
          },
        })
        .then((docRef) => {
          docRef.collection('MESSAGES').add({
            text: `${roomName} created. Welcome!`,
            createdAt: new Date().getTime(),
            system: true,
          });
          navigation.navigate('ChatRoom', {id: user.uid});
        });
    }
  }
  const getUser = async () => {
    try {
      const UserMail = await AsyncStorage.getItem('@Email');
      const UserPass = await AsyncStorage.getItem('@Pass');
      if (UserMail !== null) {
        console.log('We have Token');
        setEmail(UserMail);
        setPass(UserPass);
      } else {
        console.log('Dont have Token');
      }
    } catch (err) {
      console.log('Read data error');
    }
  };
  useEffect(() => {
    getUser();
  }, []);
  return (
    <View style={styles.Container}>
      <View style={styles.ContainerTop}>
        <Text style={styles.text}>ChatScreen</Text>
      </View>
      <View style={styles.ContainerCenter}>
        <View style={styles.textInputArea}>
          <TextInput
            value={roomName}
            onChangeText={(input) => setRoomName(input)}
            style={styles.textInput}
            placeholder={'Nhập tên phòng'}
          />
        </View>
      </View>
      <View style={styles.ContainerBot}>
        <TouchableOpacity
          onPress={() => {
            createChatRoom();
          }}>
          <Text>Create Chat Room</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('ChatRoom', {id: user.uid});
          }}>
          <Text>Chat Room</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default ChatScreen;

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
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
});
