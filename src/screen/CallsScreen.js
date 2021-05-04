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
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {scale} from 'react-native-size-matters';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import CryptoJS from 'react-native-crypto-js';
import {PhoneIcon, SearchIcon} from '../../svg/icon';

const CallsScreen = () => {
  const navigation = useNavigation();
  const user = auth().currentUser.toJSON();
  const [userCheckList, setUserCheckList] = useState([]);
  const [UserList, setUserList] = useState([]);
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
  const getRoom = () => {
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
  };
  useEffect(() => {
    getRoom();
  }, []);
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
          <View style={styles.rowTouch}>
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
                  <Text numberOfLines={1} style={styles.nameText}>
                    {item.fullname}
                  </Text>
                </View>
                <Text numberOfLines={1} style={styles.contentText}>
                  {item.email}
                </Text>
              </View>
              <TouchableOpacity style={styles.CallIcon}>
                <PhoneIcon />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
};
export default CallsScreen;

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
    height: scale(70),
    marginHorizontal: '2%',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: scale(70),
    backgroundColor: 'white',
    borderBottomWidth: scale(1 / 5),
  },
  content: {
    width: '50%',
    flexShrink: 1,
    justifyContent: 'center',
  },
  CallIcon: {
    width: '20%',
    alignItems: 'center',
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
    height: scale(60),
    width: scale(60),
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
