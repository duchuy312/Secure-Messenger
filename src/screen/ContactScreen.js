/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  TextInput,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {scale} from 'react-native-size-matters';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import CryptoJS from 'react-native-crypto-js';
import {SearchIcon} from '../../svg/icon';
import md5 from 'md5';
import {powerMod} from '../Crypto/PowerMod';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ContactScreen = () => {
  const navigation = useNavigation();
  const user = auth().currentUser.toJSON();
  const [threads, setThreads] = useState([]);
  const [secret, setSecret] = useState(null);
  const [UserList, setUserList] = useState([]);
  const [UserAuth, setUserAuth] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filteredDataSource, setFilteredDataSource] = useState([]);
  const searchFilterFunction = (text) => {
    // Check if searched text is not blank
    if (text) {
      // Inserted text is not blank
      // Filter the masterDataSource
      // Update FilteredDataSource
      const newData = UserList.filter(function (item) {
        const itemData = item.fullname
          ? item.fullname.toUpperCase()
          : ''.toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setFilteredDataSource(newData);
      setSearch(text);
    } else {
      // Inserted text is blank
      // Update FilteredDataSource with masterDataSource
      setFilteredDataSource(UserList);
      setSearch(text);
    }
  };
  const getSecret = async () => {
    try {
      const value = await AsyncStorage.getItem('@MySecret');
      if (value !== null) {
        setSecret(value);
      } else {
        Alert.alert('Dont have Sec');
      }
    } catch (err) {
      Alert.alert(err);
    }
  };
  function createChat(friend, id, img, pubCreate, keyCreate) {
    firestore()
      .collection('MESSAGE_THREADS')
      .add({
        starterMail: UserAuth[0].email,
        starter: UserAuth[0].fullname,
        name: friend,
        latestMessage: {
          text: `${UserAuth[0].fullname} started a chat`,
          createdAt: new Date().getTime(),
          sender: UserAuth[0].fullname,
          type: '',
        },
        members: [user.uid, id],
        avatar: {starterAva: UserAuth[0].userImg, friendAva: img},
        chatImg: img,
        type: 'individual',
        secure: false,
        key: md5(keyCreate),
        publickey: {friendKey: pubCreate, starterKey: UserAuth[0].publickey},
      })
      .then((docRef) => {
        docRef.collection('MESSAGES').add({
          text: `${UserAuth[0].fullname} started a chat`,
          createdAt: new Date().getTime(),
          system: true,
          sender: UserAuth[0].fullname,
          type: '',
        });
        navigation.navigate('Chats', {id: user.uid});
      });
  }
  const getRoom = async () => {
    firestore()
      .collection('MESSAGE_THREADS')
      .where('members', 'array-contains', user.uid)
      .onSnapshot((querySnapshot) => {
        const DataThreads = querySnapshot.docs.map((documentSnapshot) => {
          return {
            _id: documentSnapshot.id,
            name: '',
            latestMessage: {text: ''},
            ...documentSnapshot.data(),
          };
        });
        setThreads(DataThreads);
        if (loading) {
          setLoading(false);
        }
      });
    firestore()
      .collection('USERS')
      .where('userid', '!=', user.uid)
      .onSnapshot((querySnapshot) => {
        const UserThreads = querySnapshot.docs.map((documentSnapshot) => {
          return {
            owner: user.uid,
            _id: documentSnapshot.id,
            ...documentSnapshot.data(),
          };
        });
        setUserList(UserThreads);
        setFilteredDataSource(UserThreads);
        if (loading) {
          setLoading(false);
        }
      });
    firestore()
      .collection('USERS')
      .where('userid', '==', user.uid)
      .onSnapshot((querySnapshot) => {
        const UserThreads = querySnapshot.docs.map((documentSnapshot) => {
          return {
            owner: user.uid,
            _id: documentSnapshot.id,
            ...documentSnapshot.data(),
          };
        });
        setUserAuth(UserThreads);
        if (loading) {
          setLoading(false);
        }
      });
  };
  useEffect(() => {
    getRoom();
    getSecret();
  }, []);
  const checkRoom = (name, userid, chatImg, pubkey, key) => {
    let count = 0;
    if (threads.length === 0) {
      createChat(name, userid, chatImg, pubkey, key);
    } else {
      for (let i = 0; i < threads.length; i++) {
        if (
          threads[i].members.includes(userid) === true &&
          threads[i].members.includes(user.uid) === true &&
          threads[i].members.length === 2
        ) {
          count = 0;
          navigation.navigate('ChatingScreen', {
            thread: threads[i],
            idroom: threads[i]._id,
            member: threads[i].members,
            type: threads[i].type,
            key: key,
          });
          break;
        } else {
          count = count + 1;
        }
      }
      count !== 0 ? createChat(name, userid, chatImg, pubkey, key) : null;
    }
  };
  if (loading) {
    return <ActivityIndicator size="large" color="#555" />;
  }
  return (
    <View style={styles.Container}>
      <View style={styles.textInputArea}>
        <TouchableOpacity style={styles.icon}>
          <SearchIcon />
        </TouchableOpacity>
        <TextInput
          onChangeText={(text) => searchFilterFunction(text)}
          onClear={(text) => searchFilterFunction('')}
          value={search}
          style={styles.textInput}
          placeholder={'Search'}
        />
      </View>
      <FlatList
        style={{marginTop: scale(12)}}
        data={filteredDataSource}
        keyExtractor={(item) => item._id}
        renderItem={({item}) => (
          <TouchableOpacity
            style={styles.rowTouch}
            onPress={() => {
              checkRoom(
                item.fullname,
                item.userid,
                item.userImg,
                item.publickey,
                md5(powerMod(item.publickey, secret, 65537)),
              );
            }}>
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
      />
    </View>
  );
};
export default ContactScreen;

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: '#efefef',
  },
  textInputArea: {
    flexDirection: 'row',
    backgroundColor: 'white',
    width: '96%',
    height: scale(40),
    alignSelf: 'center',
    borderRadius: scale(10),
    marginTop: scale(12),
  },
  textInput: {
    width: '96%',
    height: scale(40),
    alignSelf: 'center',
    fontSize: scale(18),
  },
  icon: {
    width: scale(30),
    justifyContent: 'center',
    paddingLeft: scale(8),
  },
  rowTouch: {
    width: '96%',
    height: scale(80),
    marginHorizontal: '2%',
    borderRadius: scale(10),
    marginBottom: scale(12),
  },
  row: {
    borderRadius: scale(10),
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: scale(80),
    backgroundColor: 'white',
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
    height: scale(70),
    width: scale(70),
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
