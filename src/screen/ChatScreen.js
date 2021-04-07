/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {scale} from 'react-native-size-matters';
import {GiftedChat} from 'react-native-gifted-chat';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Separator from '../component/Separator';
import CryptoJS from 'react-native-crypto-js';
const ChatScreen = () => {
  const navigation = useNavigation();
  const [roomName, setRoomName] = useState('');
  const user = auth().currentUser.toJSON();
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ChatAvatar, setChatAvatar] = useState([]);
  const [ChatName, setChatName] = useState([]);
  useEffect(() => {
    firestore()
      .collection('MESSAGE_THREADS')
      .where('members', 'array-contains', user.uid)
      .onSnapshot((querySnapshot) => {
        const datathreads = querySnapshot.docs.map((documentSnapshot) => {
          return {
            _id: documentSnapshot.id,
            name: '',
            latestMessage: {text: ''},
            ...documentSnapshot.data(),
          };
        });
        for (let i = 0; i < datathreads.length; i++) {
          datathreads[i].latestMessage.text = CryptoJS.AES.decrypt(
            datathreads[i].latestMessage.text,
            '1998',
          ).toString(CryptoJS.enc.Utf8);
        }
        setThreads(datathreads);
        if (loading) {
          setLoading(false);
        }
      });
    checkAvatar();
  }, [threads.length]);
  function checkAvatar() {
    var arr = [];
    var arr1 = [];
    for (let i = 0; i < threads.length; i++) {
      if (threads[i].avatar.length === 2) {
        for (let j = 0; j < threads[i].avatar.length; j++) {
          if (threads[i].avatar[j] !== user.photoURL) {
            arr[i] = threads[i].avatar[j];
          }
        }
      }
    }
    setChatAvatar(arr);
  }
  if (loading) {
    return <ActivityIndicator size="large" color="#555" />;
  }
  return (
    <View style={styles.Container}>
      <View style={styles.ContainerCenter}>
        <FlatList
          data={threads}
          keyExtractor={(item, index) => item._id}
          renderItem={({item, index}) => (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('ChatingScreen', {thread: item})
              }>
              <View style={styles.row}>
                <View style={styles.AvatarUserContainer}>
                  <View style={styles.circle}>
                    <Image
                      style={styles.AvatarUser}
                      source={{
                        uri: ChatAvatar[index],
                      }}
                    />
                  </View>
                </View>
                <View style={styles.content}>
                  <View style={styles.header}>
                    {item.name !== user.displayName ? (
                      <Text style={styles.nameText}>{item.name}</Text>
                    ) : (
                      <Text style={styles.nameText}>{item.starter}</Text>
                    )}
                  </View>
                  <Text style={styles.contentText}>
                    {item.latestMessage.text.slice(0, 90)}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
          ItemSeparatorComponent={() => <Separator />}
        />
      </View>
      <View style={styles.ContainerBot} />
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
  ContainerCenter: {
    width: '100%',
    height: '80%',
  },
  ContainerBot: {
    height: '20%',
    width: '100%',
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
  row: {
    paddingRight: 10,
    paddingLeft: 5,
    paddingVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: scale(100),
    borderBottomWidth: scale(1 / 2),
  },
  content: {
    flexShrink: 1,
  },
  header: {
    flexDirection: 'row',
  },
  nameText: {
    fontWeight: '600',
    fontSize: 18,
    color: '#000',
  },
  dateText: {},
  contentText: {
    color: '#949494',
    fontSize: 16,
    marginTop: 2,
  },
  AvatarUserContainer: {
    width: '30%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    height: scale(80),
    width: scale(80),
    overflow: 'hidden',
    borderRadius: scale(40),
  },
  AvatarUser: {
    flex: 1,
    height: '100%',
    width: '100%',
    alignSelf: 'center',
    resizeMode: 'stretch',
  },
});
