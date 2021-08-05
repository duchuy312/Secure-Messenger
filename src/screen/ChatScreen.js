/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  FlatList,
  ImageBackground,
  Modal,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {scale} from 'react-native-size-matters';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import CryptoJS from 'react-native-crypto-js';
import {SearchIcon, GroupIcon, WarnIcon} from '../../svg/icon';
import moment from 'moment';
import {powerMod, toNumber} from '../Crypto/PowerMod';
import md5 from 'md5';
// ...the rest of your code

import AsyncStorage from '@react-native-async-storage/async-storage';

const ChatScreen = () => {
  const navigation = useNavigation();
  const user = auth().currentUser.toJSON();
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [secret, setSecret] = useState(null);
  const [search, setSearch] = useState('');
  const [userData, setUserData] = useState([]);
  const [modalVisible1, setModalVisible1] = useState(false);
  const [filteredDataSource, setFilteredDataSource] = useState([]);
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
  const getUser = async () => {
    getSecret();
    firestore()
      .collection('USERS')
      .where('userid', '==', user.uid)
      .onSnapshot((querySnapshot) => {
        const threads = querySnapshot.docs.map((documentSnapshot) => {
          return {
            _id: documentSnapshot.id,
            ...documentSnapshot.data(),
          };
        });
        setUserData(threads[0]);
        if (loading) {
          setLoading(false);
        }
      });
  };
  const handleUpdate = async (
    id,
    name,
    item,
    membes,
    type,
    secure,
    compareKey,
  ) => {
    if (secure === false) {
      if (userData.fullname !== name) {
        await firestore()
          .collection('MESSAGE_THREADS')
          .doc(id)
          .update({
            secure: true,
          })
          .then(() => {
            navigation.navigate('ChatingScreen', {
              thread: item,
              idroom: id,
              member: membes,
              type: type,
              key: compareKey,
            });
          });
      } else {
        setModalVisible1(true);
      }
    } else {
      navigation.navigate('ChatingScreen', {
        thread: item,
        idroom: id,
        member: membes,
        type: type,
        key: compareKey,
      });
    }
  };
  const handleNavi = async (id, name, item, membes, type) => {
    navigation.navigate('ChatingScreen', {
      thread: item,
      idroom: id,
      member: membes,
      type: type,
    });
  };
  const searchFilterFunction = (text) => {
    // Check if searched text is not blank
    if (text) {
      // Inserted text is not blank
      // Filter the masterDataSource
      // Update FilteredDataSource
      const newData = threads.filter(function (item) {
        const itemData = item.name ? item.name.toUpperCase() : ''.toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setFilteredDataSource(newData);
      setSearch(text);
    } else {
      // Inserted text is blank
      // Update FilteredDataSource with masterDataSource
      setFilteredDataSource(threads);
      setSearch(text);
    }
  };
  const Check = async (
    key,
    compareKey,
    id,
    starter,
    item,
    mem,
    type,
    secure,
  ) => {
    if (key === md5(compareKey)) {
      handleUpdate(id, starter, item, mem, type, secure, compareKey);
    } else {
      Alert.alert('false');
    }
  };
  useEffect(() => {
    getUser();
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
        setFilteredDataSource(datathreads);
        setThreads(datathreads);
        if (loading) {
          setLoading(false);
        }
      });
  }, [threads.length]);
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
          value={search}
          onChangeText={(text) => searchFilterFunction(text)}
          onClear={(text) => searchFilterFunction('')}
          style={styles.textInput}
          placeholder={'Search'}
        />
      </View>
      <FlatList
        style={{marginTop: scale(12)}}
        data={filteredDataSource.sort(
          (a, b) => b.latestMessage.createdAt - a.latestMessage.createdAt,
        )}
        keyExtractor={(item, index) => item._id}
        renderItem={({item, index}) => (
          <TouchableOpacity
            style={styles.rowTouch}
            onPress={() => {
              item.type === 'group'
                ? handleNavi(
                    item._id,
                    item.starter,
                    item,
                    item.members,
                    item.type,
                    item.secure,
                  )
                : userData.email === item.starterMail
                ? Check(
                    item.key,
                    md5(powerMod(item.publickey.friendKey, secret, 65537)),
                    item._id,
                    item.starter,
                    item,
                    item.members,
                    item.type,
                    item.secure,
                  )
                : Check(
                    item.key,
                    md5(powerMod(item.publickey.starterKey, secret, 65537)),
                    item._id,
                    item.starter,
                    item,
                    item.members,
                    item.type,
                    item.secure,
                  );
            }}>
            <View style={styles.row}>
              <View style={styles.AvatarUserContainer}>
                <View style={styles.circle}>
                  {item.type === 'group' ? (
                    <ImageBackground
                      style={styles.AvatarUser}
                      source={{
                        uri: item.avatar[0],
                      }}>
                      <View style={styles.GroupIconPlace}>
                        <GroupIcon />
                      </View>
                    </ImageBackground>
                  ) : (
                    <ImageBackground
                      style={styles.AvatarUser}
                      source={{
                        uri:
                          userData.email === item.starterMail
                            ? item.avatar.friendAva
                            : item.avatar.starterAva,
                      }}
                    />
                  )}
                </View>
              </View>
              <View style={styles.content}>
                <View style={styles.header}>
                  {item.name !== userData.fullname ? (
                    <Text style={styles.nameText}>{item.name}</Text>
                  ) : (
                    <Text style={styles.nameText}>{item.starter}</Text>
                  )}
                </View>
                {item.type === 'individual' ? (
                  item.latestMessage.sender === userData.fullname ? (
                    <Text numberOfLines={1} style={styles.contentText}>
                      {item.secure
                        ? 'You: You have sent a message'
                        : 'You started a chat'}
                    </Text>
                  ) : (
                    <Text numberOfLines={1} style={styles.contentText}>
                      {item.latestMessage.sender + ' have sent a message'}
                    </Text>
                  )
                ) : item.latestMessage.type !== '' ? (
                  item.latestMessage.sender === userData.fullname ? (
                    <Text numberOfLines={1} style={styles.contentText}>
                      {'You: You have sent a message'}
                    </Text>
                  ) : (
                    <Text numberOfLines={1} style={styles.contentText}>
                      {item.latestMessage.sender + ': ' + 'send a messenges'}
                    </Text>
                  )
                ) : (
                  <Text numberOfLines={1} style={styles.contentText}>
                    {'Chat Room'}
                  </Text>
                )}
              </View>
              <View style={styles.timeContainer}>
                <Text style={styles.timeText}>
                  {new Date(item.latestMessage.createdAt)
                    .toLocaleTimeString('en-GB')
                    .substring(0, 5)}
                </Text>
                <Text style={styles.timeText}>
                  {moment(item.latestMessage.createdAt).format('l')}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
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
              <WarnIcon />
              <Text style={styles.smallModalText}>
                Bạn đã bắt đầu cuộc trò chuyện. Xin vui lòng đợi bạn bè xác nhận
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};
export default ChatScreen;

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    alignItems: 'center',
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
    width: '46%',
    height: '100%',
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
  },
  nameText: {
    fontWeight: '600',
    fontSize: scale(15),
    color: '#000',
  },
  contentText: {
    color: '#949494',
    fontSize: scale(14),
    marginTop: scale(2),
  },
  timeText: {
    color: '#949494',
    fontSize: scale(12),
    marginTop: scale(2),
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
    justifyContent: 'flex-end',
  },
  timeContainer: {
    width: '24%',
    height: '100%',
    paddingTop: scale(5),
    paddingLeft: scale(22),
  },
  GroupIconPlace: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: scale(8),
    paddingRight: scale(2),
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
    marginTop: scale(10),
  },
  modalCenter: {
    justifyContent: 'space-between',
    height: scale(200),
    alignItems: 'center',
  },
});
