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
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {scale} from 'react-native-size-matters';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import CryptoJS from 'react-native-crypto-js';
import {SearchIcon, GroupIcon} from '../../svg/icon';
import moment from 'moment';
// ...the rest of your code

const ChatScreen = () => {
  // const [initializing, setInitializing] = useState(true);
  // const [user, setUser] = useState();
  // function onAuthStateChanged(user) {
  //   setUser(user);
  //   if (initializing) setInitializing(false);
  // }

  const navigation = useNavigation();
  const user = auth().currentUser.toJSON();
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ChatAvatar, setChatAvatar] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredDataSource, setFilteredDataSource] = useState([]);
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
        setFilteredDataSource(datathreads);
        setThreads(datathreads);
        if (loading) {
          setLoading(false);
        }
      });
    checkAvatar();
  }, [threads.length]);
  function checkAvatar() {
    var arr = [];
    var arr1 = threads.sort(
      (a, b) => b.latestMessage.createdAt - a.latestMessage.createdAt,
    );
    for (let i = 0; i < arr1.length; i++) {
      if (arr1[i].avatar.length === 2) {
        for (let j = 0; j < arr1[i].avatar.length; j++) {
          if (arr1[i].avatar[j] !== user.photoURL) {
            arr[i] = arr1[i].avatar[j];
          }
        }
      } else if (arr1[i].avatar.length === 1) {
        arr[i] = arr1[i].avatar[0];
      }
    }
    setChatAvatar(arr);
  }
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
            onPress={() =>
              navigation.navigate('ChatingScreen', {
                thread: item,
                idroom: item._id,
                member: item.members,
                type: item.type,
              })
            }>
            <View style={styles.row}>
              <View style={styles.AvatarUserContainer}>
                <View style={styles.circle}>
                  <ImageBackground
                    style={styles.AvatarUser}
                    source={{
                      uri: ChatAvatar[index],
                    }}>
                    {item.type === 'group' ? (
                      <View style={styles.GroupIconPlace}>
                        <GroupIcon />
                      </View>
                    ) : null}
                  </ImageBackground>
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
                {item.type === 'individual' ? (
                  item.latestMessage.sender === user.displayName ? (
                    <Text numberOfLines={1} style={styles.contentText}>
                      {'You: ' + item.latestMessage.text.slice(0, 90)}
                    </Text>
                  ) : (
                    <Text numberOfLines={1} style={styles.contentText}>
                      {item.latestMessage.text.slice(0, 90)}
                    </Text>
                  )
                ) : item.latestMessage.type !== '' ? (
                  item.latestMessage.sender === user.displayName ? (
                    <Text numberOfLines={1} style={styles.contentText}>
                      {'You: ' + item.latestMessage.text.slice(0, 90)}
                    </Text>
                  ) : (
                    <Text numberOfLines={1} style={styles.contentText}>
                      {item.latestMessage.sender +
                        ': ' +
                        item.latestMessage.text.slice(0, 90)}
                    </Text>
                  )
                ) : (
                  <Text numberOfLines={1} style={styles.contentText}>
                    {item.latestMessage.text.slice(0, 90)}
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
});
