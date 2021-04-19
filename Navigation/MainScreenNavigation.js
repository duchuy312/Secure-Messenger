import React, {useState} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Alert,
  TextInput,
} from 'react-native';
import {scale} from 'react-native-size-matters';
import TopScreen from './ScreenNavigation';
import {MoreIcon, BackIcon, CancelIcon, AddUserIcon} from '../svg/icon';
import ChatingScreen from '../src/screen/ChatingScreen';
import {useRoute, useNavigation} from '@react-navigation/native';
import ChatRoom from '../src/screen/ChatRoom';
import ProfileScreen from '../src/screen/ProfileScreen';
import EditProfileScreen from '../src/screen/EditProfileScreen';
import LoginScreen from '../src/LoginSceen';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import CryptoJS from 'react-native-crypto-js';

const Stack = createStackNavigator();

function MainStack() {
  const route = useRoute();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible1, setModalVisible1] = useState(false);
  const navigation = useNavigation();
  const user = auth().currentUser.toJSON();
  function createChatRoom(input) {
    if (input.length > 0) {
      // create new thread using firebase & firestore
      firestore()
        .collection('MESSAGE_THREADS')
        .add({
          roomof: user.uid,
          name: input,
          latestMessage: {
            text: CryptoJS.AES.encrypt(
              `Group ${input} created. Welcome!`,
              '1998',
            ).toString(),
            createdAt: new Date().getTime(),
            sender: '',
            type: '',
          },
          members: [user.uid],
          avatar: [user.photoURL],
          chatImg: '',
          type: 'group',
        })
        .then((docRef) => {
          docRef.collection('MESSAGES').add({
            text: CryptoJS.AES.encrypt(
              `Group ${input} created. Welcome!`,
              '1998',
            ).toString(),
            createdAt: new Date().getTime(),
            sender: '',
            system: true,
            type: '',
          });
          console.log('Room create');
        });
    }
  }
  function LogoTitle() {
    return (
      <View style={styles.topLeft}>
        <Text style={styles.topTittle}>Secure Chat</Text>
      </View>
    );
  }
  function ProfileTitle(props) {
    const {text} = props;
    return (
      <View style={styles.topCenter}>
        <Text style={styles.topTittle}>{text}</Text>
      </View>
    );
  }
  function LogoTitleBack(props) {
    const {text} = props;
    return (
      <View style={styles.topLeft}>
        <BackIcon color="white" />
        <Text style={styles.topTittleBack}>{text}</Text>
      </View>
    );
  }
  function ModalView() {
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
        }}>
        <TouchableOpacity
          style={styles.smallCenteredView}
          onPress={() => {
            setModalVisible(false);
          }}>
          <View style={styles.smallModalView}>
            <View style={styles.modalOption}>
              <TouchableOpacity
                style={styles.modalItem}
                onPress={() => {
                  navigation.navigate('ProfileScreen');
                  setModalVisible(false);
                }}>
                <Text>Profile</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalItem}
                onPress={() => {
                  setModalVisible(false);
                }}>
                <Text>Setting</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalItem}
                onPress={() => {
                  setModalVisible1(true);
                  setModalVisible(false);
                }}>
                <Text>Create Chat Room</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    );
  }
  function ModalCreateRoom() {
    const [roomName, setRoomName] = useState('');
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible1}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
        }}>
        <View style={styles.CenteredView}>
          <View style={styles.ContainerBot}>
            <View style={styles.modalIcon}>
              <TouchableOpacity
                onPress={() => {
                  setRoomName('');
                  setModalVisible1(false);
                }}>
                <CancelIcon />
              </TouchableOpacity>
            </View>
            <View style={styles.TextInputCenter}>
              <View style={styles.textInputArea}>
                <TextInput
                  value={roomName}
                  onPressOut={console.log()}
                  onChangeText={(input) => setRoomName(input)}
                  style={styles.textInput}
                  placeholder={'Nhập tên phòng'}
                />
              </View>
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  createChatRoom(roomName);
                  setModalVisible1(false);
                }}>
                <Text>Create Chat Room</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  }
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#933c94',
          height: scale(80),
          shadowOpacity: 0,
          elevation: 0,
        },
        headerTintColor: 'white',
      }}>
      <Stack.Screen
        name="TopScreen"
        component={TopScreen}
        options={{
          headerTitle: (props) => {},
          headerBackImage: (props) => <LogoTitle {...props} />,
          headerRight: () => (
            <View style={styles.topRight}>
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(true);
                }}>
                <MoreIcon />
                <ModalView />
                <ModalCreateRoom />
              </TouchableOpacity>
            </View>
          ),
        }}
      />
      <Stack.Screen
        name="ChatingScreen"
        component={ChatingScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="EditProfileScreen"
        component={EditProfileScreen}
        options={{
          headerTitle: (props) => (
            <ProfileTitle text="EditProfile" {...props} />
          ),
          headerBackImage: (props) => <BackIcon color="white" />,
        }}
      />
      <Stack.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{
          headerTitle: (props) => <ProfileTitle text="Profile" {...props} />,
          headerBackImage: (props) => <BackIcon color="white" />,
        }}
      />
      <Stack.Screen
        name="LoginSceeen"
        component={LoginScreen}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}

export default MainStack;
const styles = StyleSheet.create({
  topTittle: {
    fontSize: scale(20),
    color: 'white',
  },
  topRight: {
    flexDirection: 'row',
    width: scale(50),
    justifyContent: 'flex-end',
    marginRight: scale(12),
  },
  topLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: scale(5),
  },
  topCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: scale(40),
  },
  topTittleBack: {
    fontSize: scale(20),
    color: 'white',
    marginLeft: scale(10),
  },
  smallCenteredView: {
    flex: 1,
    flexDirection: 'row-reverse',
  },
  smallModalView: {
    height: scale(70),
    width: scale(150),
    backgroundColor: 'white',
    borderRadius: scale(5),
    shadowColor: '#000',
    elevation: scale(5),
    justifyContent: 'space-around',
    padding: scale(8),
    marginTop: scale(10),
    marginRight: scale(30),
  },
  smallModalText: {
    color: 'black',
    fontSize: scale(15),
  },
  modalOption: {
    height: scale(70),
    justifyContent: 'space-around',
  },
  modalItem: {
    backgroundColor: '#f0f0f0',
  },
  ContainerBot: {
    height: scale(300),
    width: scale(300),
    alignItems: 'center',
    backgroundColor: 'white',
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
    backgroundColor: '#F6F4F5',
    width: scale(290),
    height: scale(50),
    alignSelf: 'center',
    borderRadius: scale(25),
    marginBottom: scale(20),
  },
  TextInputCenter: {
    marginTop: scale(60),
  },
  textInput: {
    width: scale(290),
    height: scale(50),
    alignSelf: 'center',
    fontSize: scale(18),
    marginLeft: scale(30),
  },
  button: {
    backgroundColor: 'rgba(188, 45, 188, 1)',
    width: scale(200),
    height: scale(50),
    alignSelf: 'center',
    borderRadius: scale(25),
    justifyContent: 'center',
    alignItems: 'center',
    elevation: scale(10),
  },
  modalIcon: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    height: scale(40),
    width: '95%',
    alignItems: 'center',
  },
});
