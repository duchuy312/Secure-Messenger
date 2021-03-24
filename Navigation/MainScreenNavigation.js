import React, {useState} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';
import {scale} from 'react-native-size-matters';
import TopScreen from './ScreenNavigation';
import {MoreIcon, SearchIcon, BackIcon, CancelIcon} from '../svg/icon';
import ChatingScreen from '../src/screen/ChatingScreen';
import {useRoute, useNavigation} from '@react-navigation/native';
import ChatRoom from '../src/screen/ChatRoom';
import ProfileScreen from '../src/screen/ProfileScreen';
import EditProfileScreen from '../src/screen/EditProfileScreen';
import LoginScreen from '../src/LoginSceen';
const Stack = createStackNavigator();

function MainStack() {
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();
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
            <View style={styles.modalIcon}>
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
            </View>
          </View>
        </TouchableOpacity>
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
              <TouchableOpacity>
                <SearchIcon />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(true);
                }}>
                <MoreIcon />
                <ModalView />
              </TouchableOpacity>
            </View>
          ),
        }}
      />
      <Stack.Screen
        name="ChatingScreen"
        component={ChatingScreen}
        options={{
          headerTitle: (props) => {},
          headerBackImage: (props) => <LogoTitleBack text="Back" {...props} />,
          headerRight: () => (
            <View style={styles.topRight}>
              <TouchableOpacity>
                <SearchIcon />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(true);
                }}>
                <MoreIcon />
              </TouchableOpacity>
              <ModalView />
            </View>
          ),
        }}
      />
      <Stack.Screen
        name="ChatRoom"
        component={ChatRoom}
        options={{
          headerTitle: (props) => {},
          headerBackImage: (props) => <LogoTitleBack text="Room" {...props} />,
          headerRight: () => (
            <View style={styles.topRight}>
              <TouchableOpacity>
                <SearchIcon />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(true);
                }}>
                <MoreIcon />
              </TouchableOpacity>
              <ModalView />
            </View>
          ),
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
    justifyContent: 'space-between',
    marginRight: scale(10),
  },
  topLeft: {
    flexDirection: 'row',
    alignItems: 'center',
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
    height: scale(50),
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
  modalIcon: {
    height: scale(50),
    justifyContent: 'space-around',
  },
  modalItem: {
    backgroundColor: '#f0f0f0',
  },
});
