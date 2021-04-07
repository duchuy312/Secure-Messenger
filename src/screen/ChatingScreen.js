/* eslint-disable react-hooks/exhaustive-deps */
// @refresh state
import React, {useState, useCallback, useEffect} from 'react';
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {scale} from 'react-native-size-matters';
import {SendIcon, MoreIcon} from '../../svg/icon';
import {
  GiftedChat,
  Bubble,
  Send,
  SystemMessage,
  InputToolbar,
} from 'react-native-gifted-chat';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import AvatarDefault from '../../assets/image/default-ava.png';
import CryptoJS from 'react-native-crypto-js';

const ChatingScreen = () => {
  const [messages, setMessages] = useState([]);
  const route = useRoute();
  const [thread, setThread] = useState(route.params.thread);
  const user = auth().currentUser.toJSON();
  async function handleSend(messages) {
    const text = CryptoJS.AES.encrypt(messages[0].text, '1998').toString();
    firestore()
      .collection('MESSAGE_THREADS')
      .doc(thread._id)
      .collection('MESSAGES')
      .add({
        text,
        createdAt: new Date().getTime(),
        user: {
          _id: user.uid,
          email: user.email,
          avatar:
            user.photoURL === null
              ? 'https://placeimg.com/480/480/people'
              : user.photoURL,
        },
      });
    await firestore()
      .collection('MESSAGE_THREADS')
      .doc(thread._id)
      .set(
        {
          latestMessage: {
            text,
            createdAt: new Date().getTime(),
          },
        },
        {merge: true},
      );
  }
  const navigation = useNavigation();
  useEffect(() => {
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
          datamessages[i].text = CryptoJS.AES.decrypt(
            datamessages[i].text,
            '1998',
          ).toString(CryptoJS.enc.Utf8);
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
          backgroundColor: 'white',
          borderRadius: scale(20),
          justifyContent: 'center',
          paddingRight: scale(5),
          marginBottom: scale(3),
        }}
      />
    );
  };
  function renderBubble(props) {
    let username = props.currentMessage.user.name;
    let color = getColor(username);
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#6646ee',
          },
          left: {
            backgroundColor: color,
          },
        }}
        textStyle={{
          right: {
            color: '#fff',
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
      <Send {...props}>
        <View style={styles.sendingContainer}>
          <SendIcon />
        </View>
      </Send>
    );
  }

  function scrollToBottomComponent() {
    return (
      <View style={styles.bottomComponentContainer}>
        <MoreIcon />
      </View>
    );
  }

  function renderSystemMessage(props) {
    return (
      <SystemMessage
        {...props}
        wrapperStyle={styles.systemMessageWrapper}
        textStyle={styles.systemMessageText}
      />
    );
  }

  return (
    <GiftedChat
      messages={messages}
      onSend={handleSend}
      user={{_id: user.uid}}
      placeholder="Type your message here..."
      alwaysShowSend
      showUserAvatar
      scrollToBottom
      renderBubble={renderBubble}
      renderLoading={renderLoading}
      renderSend={renderSend}
      scrollToBottomComponent={scrollToBottomComponent}
      renderSystemMessage={renderSystemMessage}
      renderInputToolbar={(props) => customtInputToolbar(props)}
    />
  );
};
export default ChatingScreen;

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
});
