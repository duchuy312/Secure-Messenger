/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {scale} from 'react-native-size-matters';
import firestore from '@react-native-firebase/firestore';
import Separator from '../component/Separator';
import auth from '@react-native-firebase/auth';
import CryptoJS from 'react-native-crypto-js';

const ContactScreen = () => {
  const navigation = useNavigation();
  const [check, setCheck] = useState(false);
  const user = auth().currentUser.toJSON();
  const [threads, setThreads] = useState([]);
  const route = useRoute();
  const [UserList, setUserList] = useState([]);
  const [loading, setLoading] = useState(true);
  function createChat(friend, id, img) {
    firestore()
      .collection('MESSAGE_THREADS')
      .add({
        starter: user.displayName,
        name: friend,
        latestMessage: {
          text: CryptoJS.AES.encrypt(
            `${friend} created. Welcome!`,
            '1998',
          ).toString(),
          createdAt: new Date().getTime(),
        },
        members: [user.uid, id],
        avatar: [user.photoURL, img],
        chatImg: img,
      })
      .then((docRef) => {
        docRef.collection('MESSAGES').add({
          text: CryptoJS.AES.encrypt(
            `${friend} created. Welcome!`,
            '1998',
          ).toString(),
          createdAt: new Date().getTime(),
          system: true,
        });
        navigation.navigate('Chats', {id: user.uid});
      });
  }
  const getRoom = async () => {
    firestore()
      .collection('MESSAGE_THREADS')
      .where('members', 'array-contains', user.uid)
      .onSnapshot((querySnapshot) => {
        const threads = querySnapshot.docs.map((documentSnapshot) => {
          return {
            _id: documentSnapshot.id,
            name: '',
            latestMessage: {text: ''},
            ...documentSnapshot.data(),
          };
        });
        setThreads(threads);
        if (loading) {
          setLoading(false);
        }
      });
    firestore()
      .collection('USERS')
      .where('userid', '!=', user.uid)
      .onSnapshot((querySnapshot) => {
        const threads = querySnapshot.docs.map((documentSnapshot) => {
          return {
            owner: user.uid,
            _id: documentSnapshot.id,
            ...documentSnapshot.data(),
          };
        });
        setUserList(threads);
        if (loading) {
          setLoading(false);
        }
      });
  };
  useEffect(() => {
    getRoom();
  }, []);
  const checkRoom = (name, userid, chatImg) => {
    let count = 0;
    if (threads.length === 0) {
      createChat(name, userid, chatImg);
    } else {
      for (let i = 0; i < threads.length; i++) {
        if (
          threads[i].members.includes(userid) === true &&
          threads[i].members.includes(user.uid) === true &&
          threads[i].members.length === 2
        ) {
          count = 0;
          navigation.navigate('ChatingScreen', {thread: threads[i]});
          break;
        } else {
          count = count + 1;
        }
        console.log(count);
      }
      console.log(count);
      count !== 0 ? createChat(name, userid, chatImg) : null;
    }
  };
  if (loading) {
    return <ActivityIndicator size="large" color="#555" />;
  }
  return (
    <View style={styles.Container}>
      <FlatList
        data={UserList}
        keyExtractor={(item) => item._id}
        renderItem={({item}) => (
          <TouchableOpacity
            onPress={() => checkRoom(item.fullname, item.userid, item.userImg)}>
            <View style={styles.row}>
              <View style={styles.AvatarUserContainer}>
                <View style={styles.circle}>
                  <Image
                    style={styles.AvatarUser}
                    source={{
                      uri: item.userImg,
                    }}
                  />
                </View>
              </View>
              <View style={styles.content}>
                <View style={styles.header}>
                  <Text style={styles.nameText}>{item.fullname}</Text>
                </View>
                <Text style={styles.contentText}>{item.email}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={() => <Separator />}
      />
    </View>
  );
};
export default ContactScreen;

const styles = StyleSheet.create({
  Container: {
    flex: 1,
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
    color: 'black',
    fontFamily: 'kindandrich',
  },
  row: {
    width: '100%',
    height: scale(100),
    borderBottomWidth: scale(1 / 2),
    flexDirection: 'row',
  },
  content: {
    flexShrink: 1,
    justifyContent: 'center',
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
