/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
// @refresh state
import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  Image,
  FlatList,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {scale} from 'react-native-size-matters';
import {
  SendIcon,
  MoreIcon,
  BackIcon,
  AddUserIcon,
  CancelIcon,
  AddIcon,
  ToBottomIcon,
  SearchIcon,
} from '../../svg/icon';
import {
  GiftedChat,
  Bubble,
  Send,
  SystemMessage,
  InputToolbar,
  Composer,
  Actions,
  MessageImage,
} from 'react-native-gifted-chat';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import AvatarDefault from '../../assets/image/default-ava.png';
import CryptoJS from 'react-native-crypto-js';
import Separator from '../component/Separator';
import * as ImagePicker from 'react-native-image-picker';
const ChatingScreen = () => {
  const route = useRoute();
  const [messages, setMessages] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [checked, setChecked] = useState([]);
  const [Member, setMember] = useState(route.params.member);
  const navigation = useNavigation();
  const [thread] = useState(route.params.thread);
  const user = auth().currentUser.toJSON();
  const [UrlAvatar, setUrlAvatar] = useState('');
  const [UserList, setUserList] = useState([]);
  const [search, setSearch] = useState('');
  const [change, setChange] = useState(true);
  const [filteredDataSource, setFilteredDataSource] = useState([]);
  const [userData, setUserData] = useState([]);
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
  function selectImage() {
    let options = {
      title: 'You can choose one image',
      maxWidth: scale(256),
      maxHeight: scale(256),
      noData: true,
      mediaType: 'photo',
      storageOptions: {
        skipBackup: true,
      },
      includeBase64: true,
    };
    ImagePicker.launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        Alert.alert('You did not select any image');
      } else if (response.error) {
        Alert.alert('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        Alert.alert('User tapped custom button: ', response.customButton);
      } else {
        let source = {uri: response.uri};
        // ADD THIS
        handleSend(
          [
            {
              createdAt: new Date().getTime(),
              text: '',
              user: {_id: user.uid},
              _id: '',
            },
          ],
          `data:image/png;base64,${response.base64}`,
          'image',
        );
      }
    });
  }

  const handleUpdate = async (uid) => {
    await firestore()
      .collection('MESSAGE_THREADS')
      .doc(route.params.idroom)
      .set(
        {
          members: uid,
        },
        {merge: true},
      )
      .then(() => {
        Alert.alert('User Updated!');
        setModalVisible(false);
      });
  };
  async function handleSend(messagessend, image, typeMess) {
    const text =
      route.params.type === 'group'
        ? CryptoJS.AES.encrypt(
            messagessend[0].text,
            '67b586709137805a5510ff19b9a1a5ac',
          ).toString()
        : CryptoJS.AES.encrypt(
            messagessend[0].text,
            route.params.key,
          ).toString();
    await firestore()
      .collection('MESSAGE_THREADS')
      .doc(thread._id)
      .collection('MESSAGES')
      .add({
        type: typeMess,
        sender: userData.fullname,
        text,
        createdAt: new Date().getTime(),
        user: {
          _id: user.uid,
          email: user.email,
          avatar: userData.userImg,
        },
        image: image,
      });
    await firestore()
      .collection('MESSAGE_THREADS')
      .doc(thread._id)
      .set(
        {
          latestMessage: {
            type: typeMess,
            sender: userData.fullname,
            text,
            createdAt: new Date().getTime(),
          },
        },
        {merge: true},
      );
  }
  const getUserAuth = async () => {
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
      });
  };
  const getUser = async () => {
    var arr = [];
    var arr1 = Member;
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
        for (let i = 0; i < UserThreads.length; i++) {
          if (route.params.type === 'group') {
            Member[i] !== undefined
              ? (arr[i] = Member.includes(UserThreads[i].userid))
              : (arr[i] = false);
            arr1[i + 1] = '';
          }
        }
        setMember(arr1);
        setChecked(arr);
        setFilteredDataSource(UserThreads);
        setUserList(UserThreads);
      });
  };
  async function CheckAddUser(stt, userid) {
    var arr = checked;
    var arr1 = Member;
    arr[stt] = !checked[stt];
    arr1[stt + 1] !== '' ? (arr1[stt + 1] = '') : (arr1[stt + 1] = userid);
    setMember(arr1);
    setChecked(arr);
  }
  useEffect(() => {
    getUserAuth();
    const messagesListener = firestore()
      .collection('MESSAGE_THREADS')
      .doc(thread._id)
      .collection('MESSAGES')
      .orderBy('createdAt', 'desc')
      .onSnapshot((querySnapshot) => {
        const datamessages = querySnapshot.docs.map((doc) => {
          const firebaseData = doc.data();
          const data = {
            _id: doc.id,
            text: '',
            createdAt: new Date().getTime(),
            ...firebaseData,
          };
          if (!firebaseData.system) {
            data.user = {
              ...firebaseData.user,
              name: firebaseData.user.email,
            };
          }

          return data;
        });
        for (let i = 0; i < datamessages.length; i++) {
          if (route.params.type === 'group') {
            datamessages[i].text = CryptoJS.AES.decrypt(
              datamessages[i].text,
              '67b586709137805a5510ff19b9a1a5ac',
            ).toString(CryptoJS.enc.Utf8);
          } else {
            datamessages[i].text = CryptoJS.AES.decrypt(
              datamessages[i].text,
              route.params.key,
            ).toString(CryptoJS.enc.Utf8);
          }
        }
        setMessages(datamessages);
      });
    // Stop listening for updates whenever the component unmounts
    return () => messagesListener();
  }, []);
  const customtInputToolbar = (props) => {
    return (
      <InputToolbar
        {...props}
        containerStyle={{
          justifyContent: 'center',
          paddingRight: scale(5),
          paddingVertical: 5,
        }}
      />
    );
  };
  function renderComposer(props) {
    return <Composer {...props} textInputStyle={styles.systemMessageText} />;
  }
  function renderBubble(props) {
    let username = props.currentMessage.user.name;
    let color = getColor(username);
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            paddingTop: scale(5),
            borderRadius: scale(12),
            backgroundColor: '#6646ee',
          },
          left: {
            paddingTop: scale(5),
            borderRadius: scale(12),
            backgroundColor: '#efefef',
          },
        }}
        textStyle={{
          right: {
            color: '#fff',
            fontSize: scale(15),
          },
          left: {
            color: '#000',
            fontSize: scale(15),
          },
        }}
      />
    );
  }
  const getColor = (username) => {
    let sumChars = 0;
    for (let i = 0; i < username.length; i++) {
      sumChars += username.charCodeAt(i);
    }
    const colors = [
      '#e67e22', // carrot
      '#2ecc71', // emerald
      '#3498db', // peter river
      '#8e44ad', // wisteria
      '#e74c3c', // alizarin
      '#1abc9c', // turquoise
      '#2c3e50', // midnight blue
    ];
    return colors[sumChars % colors.length];
  };
  function renderLoading() {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6646ee" />
      </View>
    );
  }
  function renderSend(props) {
    return (
      <Send containerStyle={styles.containerStyle} {...props}>
        <View style={styles.sendingContainer}>
          <SendIcon />
        </View>
      </Send>
    );
  }
  function renderActions(props) {
    return (
      <View style={styles.rightButtonConatainer}>
        <TouchableOpacity onPress={() => selectImage()}>
          <AddIcon />
        </TouchableOpacity>
      </View>
    );
  }
  function scrollToBottomComponent() {
    return (
      <View style={styles.bottomComponentContainer}>
        <ToBottomIcon />
      </View>
    );
  }
  function renderSystemMessage(props) {
    return (
      <SystemMessage {...props} wrapperStyle={styles.systemMessageWrapper} />
    );
  }
  return (
    <View style={styles.Container}>
      <View style={styles.ContainerTop}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.topLeft}>
          <BackIcon color="white" />
          <Text style={styles.topTittleBack}>Back</Text>
        </TouchableOpacity>
        <View style={styles.topRight}>
          {thread.type === 'group' ? (
            thread.roomof === user.uid ? (
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(true);
                  getUser();
                }}>
                <AddUserIcon />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.moreButton}>
                <MoreIcon />
              </TouchableOpacity>
            )
          ) : (
            <TouchableOpacity style={styles.moreButton}>
              <MoreIcon />
            </TouchableOpacity>
          )}
        </View>
      </View>
      <GiftedChat
        messages={messages}
        onSend={(mess) => handleSend(mess, UrlAvatar, 'text')}
        user={{_id: user.uid}}
        placeholder="Type your message here..."
        alwaysShowSend
        scrollToBottom
        isTyping={true}
        isAnimated
        renderFooter={Separator}
        renderActions={renderActions}
        renderComposer={renderComposer}
        renderBubble={renderBubble}
        renderLoading={renderLoading}
        renderSend={renderSend}
        scrollToBottomComponent={scrollToBottomComponent}
        renderSystemMessage={renderSystemMessage}
        renderInputToolbar={(props) => customtInputToolbar(props)}
      />
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
        }}>
        <View style={styles.CenteredView}>
          <View style={styles.ContainerBot}>
            <View style={styles.modalIcon}>
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(false);
                }}>
                <CancelIcon />
              </TouchableOpacity>
            </View>
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
              data={filteredDataSource}
              keyExtractor={(item, index) => item._id}
              renderItem={({item, index}) => (
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
                        <Text style={styles.nameText}>{item.fullname}</Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.CheckBoxContainer}>
                    <TouchableOpacity
                      style={styles.CheckBoxArea}
                      onPress={() => {
                        CheckAddUser(index, item.userid);
                        setChange(!change);
                      }}>
                      {checked[index] ? <View style={styles.CheckBox} /> : null}
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            />
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                handleUpdate(Member);
                setModalVisible(false);
              }}>
              <Text style={styles.ButtonText}>Update members</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};
export default ChatingScreen;

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  ContainerTop: {
    alignItems: 'center',
    flexDirection: 'row',
    width: '100%',
    backgroundColor: '#933c94',
    height: scale(80),
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
  systemMessageText: {
    fontSize: scale(15),
    backgroundColor: '#efefef',
    borderRadius: scale(20),
    justifyContent: 'center',
    alignSelf: 'center',
    paddingHorizontal: scale(10),
  },
  sendingContainer: {
    height: '100%',
    width: 40,
    alignItems: 'flex-end',
  },
  containerStyle: {
    backgroundColor: 'red',
    height: '100%',
  },
  bottomComponentContainer: {},
  containerActionsStyle: {
    height: scale(30),
    width: scale(30),
    marginBottom: scale(10),
  },
  wrapperActionsStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: scale(20),
  },
  containerBubbleStyle: {
    height: scale(50),
    backgroundColor: 'red',
    marginBottom: scale(50),
  },
  topLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: scale(5),
    height: scale(80),
    paddingTop: scale(40),
    width: '20%',
  },
  topRight: {
    width: '80%',
    flexDirection: 'row-reverse',
    height: scale(80),
    paddingTop: scale(46),
    paddingLeft: scale(12),
  },
  topTittleBack: {
    fontSize: scale(20),
    color: 'white',
    marginLeft: scale(10),
  },
  ContainerBot: {
    height: scale(450),
    width: scale(300),
    alignItems: 'center',
    backgroundColor: '#efefef',
    borderRadius: scale(10),
    elevation: scale(2),
  },
  CenteredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(100,100,100, 0.5)',
  },
  textInputArea: {
    flexDirection: 'row',
    backgroundColor: 'white',
    width: scale(260),
    height: scale(40),
    alignSelf: 'center',
    borderRadius: scale(10),
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
  button: {
    backgroundColor: 'rgba(188, 45, 188, 1)',
    width: scale(200),
    height: scale(50),
    borderRadius: scale(25),
    justifyContent: 'center',
    alignItems: 'center',
    elevation: scale(10),
    marginBottom: scale(15),
  },
  modalIcon: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    height: scale(40),
    width: '95%',
    alignItems: 'center',
  },
  moreButton: {
    marginTop: scale(6),
  },
  rightButtonConatainer: {
    height: '100%',
    justifyContent: 'center',
    marginLeft: scale(8),
  },
  rowTouch: {
    flexDirection: 'row',
    width: scale(260),
    height: scale(60),
    marginHorizontal: '2%',
    borderRadius: scale(10),
    marginBottom: scale(12),
  },
  row: {
    borderTopLeftRadius: scale(10),
    borderBottomLeftRadius: scale(10),
    flexDirection: 'row',
    alignItems: 'center',
    width: '80%',
    height: scale(60),
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
    height: scale(50),
    width: scale(50),
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
  CheckBoxContainer: {
    width: '20%',
    height: '100%',
    backgroundColor: 'white',
    borderTopRightRadius: scale(10),
    borderBottomRightRadius: scale(10),
    justifyContent: 'center',
    alignItems: 'center',
  },
  CheckBoxArea: {
    width: scale(20),
    height: scale(20),
    borderWidth: scale(2),
    borderRadius: scale(1),
    borderColor: '#bfbfbf',
    justifyContent: 'center',
    alignItems: 'center',
  },
  CheckBox: {
    width: scale(15),
    height: scale(15),
    backgroundColor: 'rgba(188, 45, 188, 1)',
  },
  ButtonText: {
    fontSize: scale(16),
    color: 'white',
  },
});
