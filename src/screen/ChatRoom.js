/* eslint-disable react-hooks/exhaustive-deps */
// @refresh state
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

const ChatRoom = () => {
  const [messages, setMessages] = useState([]);
  const route = useRoute();
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = auth().currentUser.toJSON();
  console.log(user);
  const navigation = useNavigation();
  useEffect(() => {
    const unsubscribe = firestore()
      .collection('MESSAGE_THREADS')
      .where('members', 'array-contains', user.uid)
      .onSnapshot((querySnapshot) => {
        console.log(querySnapshot);
        const threads = querySnapshot.docs.map((documentSnapshot) => {
          return {
            _id: documentSnapshot.id,
            name: '',
            latestMessage: {text: ''},
            ...documentSnapshot.data(),
          };
        });
        setThreads(threads);
        console.log(threads);
        if (loading) {
          setLoading(false);
        }
      });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#555" />;
  }

  return (
    <View style={styles.Container}>
      <FlatList
        data={threads}
        keyExtractor={(item) => item._id}
        renderItem={({item}) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('ChatingScreen', {thread: item})
            }>
            <View style={styles.row}>
              <View style={styles.content}>
                <View style={styles.header}>
                  <Text style={styles.nameText}>{item.name}</Text>
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
  );
};
export default ChatRoom;

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: '#dfdfdf',
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
  title: {
    marginTop: 20,
    marginBottom: 30,
    fontSize: 28,
    fontWeight: '500',
  },
  row: {
    paddingRight: 10,
    paddingLeft: 5,
    paddingVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
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
});
