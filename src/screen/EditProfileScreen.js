import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  ScrollView,
  Platform,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import {scale} from 'react-native-size-matters';
import {useNavigation, useRoute} from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Picker} from '@react-native-picker/picker';
import {CameraIcon, CheckIcon} from '../../svg/icon';
import * as ImagePicker from 'react-native-image-picker';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const EditProfileScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [date, setDate] = useState(new Date(route.params.birthday));
  const [birthday, setBirthday] = useState(route.params.birthday);
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [gender, setGender] = useState(route.params.gender);
  const [phone, setPhone] = useState(route.params.phone);
  const [name, setName] = useState(route.params.fullname);
  const [avatar, setAvatar] = useState('');
  const [place, setPlace] = useState(route.params.city);
  const [imageSource, setImageSource] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const user = auth().currentUser.toJSON();
  console.log(user);
  const [UrlAvatar, setUrlAvatar] = useState(route.params.userImg);
  const update = {
    displayName: name,
    photoURL: UrlAvatar,
  };
  const handleUpdate = async () => {
    await auth().currentUser.updateProfile(update);
    await firestore()
      .collection('USERS')
      .doc(route.params.profileid)
      .update({
        fullname: name,
        gender: gender,
        phone: phone,
        birthday: birthday,
        city: place,
        userImg: UrlAvatar,
      })
      .then(() => {
        console.log('User Updated!');
        setModalVisible(true);
      });
  };
  useEffect(() => {
    setBirthday(date.getTime());
  }, [date]);
  const onChange = async (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
  };
  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };
  const showDatepicker = () => {
    showMode('date');
  };
  function selectImage() {
    let options = {
      title: 'You can choose one image',
      maxWidth: 256,
      maxHeight: 256,
      noData: true,
      mediaType: 'photo',
      storageOptions: {
        skipBackup: true,
      },
      includeBase64: true,
    };

    ImagePicker.launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled photo picker');
        Alert.alert('You did not select any image');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        let source = {uri: response.uri};
        // ADD THIS
        setUrlAvatar(source.uri);
      }
    });
  }
  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.Avatar}>
          {UrlAvatar === '' ? (
            <ImageBackground
              blurRadius={2}
              style={styles.bigAvatar}
              source={require('../../assets/image/gradient_2.png')}>
              <View style={styles.avatarContainer}>
                <View style={styles.circle}>
                  <ImageBackground
                    style={styles.logo}
                    source={require('../../assets/image/gradient_2.png')}>
                    <TouchableOpacity
                      style={styles.changeAvatarBut}
                      onPress={() => {
                        selectImage();
                      }}>
                      <CameraIcon />
                    </TouchableOpacity>
                  </ImageBackground>
                </View>
              </View>
              <View style={styles.nameInput}>
                <Text style={styles.inputText}>{route.params.email}</Text>
              </View>
            </ImageBackground>
          ) : (
            <ImageBackground
              blurRadius={2}
              style={styles.bigAvatar}
              source={{
                uri: UrlAvatar,
              }}>
              <View style={styles.avatarContainer}>
                <View style={styles.circle}>
                  <ImageBackground
                    style={styles.logo}
                    source={{
                      uri: UrlAvatar,
                    }}>
                    <TouchableOpacity
                      style={styles.changeAvatarBut}
                      onPress={() => {
                        selectImage();
                      }}>
                      <CameraIcon />
                    </TouchableOpacity>
                  </ImageBackground>
                </View>
              </View>
              <View style={styles.nameInput}>
                <Text style={styles.inputText}>{route.params.email}</Text>
              </View>
            </ImageBackground>
          )}
        </View>
        <View style={styles.InforContainer}>
          <View style={styles.EmailInput}>
            <Text style={styles.title}>Name</Text>
            <View style={styles.emailBox}>
              <TextInput
                value={name}
                onChangeText={(nameinput) => setName(nameinput)}
                placeholder={name}
                style={styles.textInput}
              />
            </View>
          </View>
          <View style={styles.EmailInput}>
            <Text style={styles.title}>Phone</Text>
            <View style={styles.emailBox}>
              <TextInput
                value={phone}
                onChangeText={(phoneinput) => setPhone(phoneinput)}
                placeholder={phone}
                style={styles.textInput}
              />
            </View>
          </View>
          <View style={styles.EmailInput}>
            <Text style={styles.title}>City</Text>
            <View style={styles.emailBox}>
              <TextInput
                value={place}
                onChangeText={(placeinput) => setPlace(placeinput)}
                placeholder={place}
                style={styles.textInput}
              />
            </View>
          </View>
          <View style={styles.TwoInforContainer}>
            <View style={styles.DateInput}>
              <Text style={styles.title}>BirthDay</Text>
              <TouchableOpacity
                style={styles.DateBox}
                onPress={() => showDatepicker()}>
                <Text style={styles.textInput}>
                  {new Date(birthday).toDateString('en-GB')}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.GenderInput}>
              <Text style={styles.title}>Gender</Text>
              <View style={styles.GenderBox}>
                <Picker
                  itemStyle={styles.textInput}
                  selectedValue={gender}
                  onValueChange={(itemValue) => setGender(itemValue)}
                  style={styles.GenderChoice}>
                  <Picker.Item label="-" value={3} />
                  <Picker.Item label="Nam" value={1} />
                  <Picker.Item label="Nữ" value={0} />
                </Picker>
              </View>
            </View>
          </View>
        </View>
        {show && (
          <DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode={mode}
            is24Hour={true}
            display="default"
            onChange={onChange}
          />
        )}
        <TouchableOpacity
          style={styles.button1}
          onPress={() => {
            handleUpdate();
          }}>
          <Text style={styles.Button1Text}>Cập nhật thông tin</Text>
        </TouchableOpacity>
      </View>
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
            navigation.goBack();
          }}>
          <View style={styles.smallModalView}>
            <View style={styles.modalCenter}>
              <CheckIcon />
              <Text style={styles.smallModalText}>
                Cập nhật thông tin thành công
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </ScrollView>
  );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
  Scroll: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  Avatar: {
    height: scale(220),
    width: '150%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bigAvatar: {
    height: scale(220),
    width: '100%',
    resizeMode: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarContainer: {
    height: scale(120),
    width: scale(120),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    alignSelf: 'center',
    borderWidth: scale(1),
    elevation: scale(5),
    borderRadius: scale(60),
    overflow: 'hidden',
    borderColor: 'white',
  },
  circle: {
    height: scale(120),
    width: scale(120),
  },
  logo: {
    flex: 1,
    height: '100%',
    width: '100%',
    alignSelf: 'center',
    resizeMode: 'stretch',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  button1: {
    marginTop: scale(20),
    width: scale(290),
    height: scale(45),
    alignSelf: 'center',
    borderRadius: scale(25),
    marginBottom: scale(20),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#933c94',
    elevation: scale(1),
  },
  Button1Text: {
    fontSize: scale(18),
    color: 'white',
  },
  nameInput: {
    marginTop: scale(10),
    justifyContent: 'flex-end',
    width: '50%',
    height: scale(40),
    alignItems: 'center',
    borderBottomWidth: scale(1 / 2),
    borderColor: 'white',
  },
  inputText: {
    fontSize: scale(50),
    color: 'black',
    fontFamily: 'kindandrich',
  },
  InforContainer: {
    width: '90%',
    height: scale(300),
    marginTop: scale(20),
  },
  title: {
    color: '#cecece',
    fontSize: scale(18),
    fontWeight: 'bold',
  },
  EmailInput: {
    height: scale(70),
    justifyContent: 'space-between',
  },
  emailBox: {
    height: scale(40),
    borderWidth: scale(1 / 2),
    borderRadius: scale(5),
  },
  textInput: {
    fontSize: scale(16),
  },
  DateInput: {
    height: scale(70),
    justifyContent: 'space-between',
    width: '50%',
  },
  GenderInput: {
    height: scale(70),
    marginLeft: scale(30),
    width: '50%',
    justifyContent: 'space-between',
  },
  DateBox: {
    height: scale(40),
    width: '100%',
    borderWidth: scale(1 / 2),
    borderRadius: scale(5),
    justifyContent: 'center',
    alignItems: 'center',
  },
  GenderBox: {
    height: scale(40),
    width: '80%',
    borderWidth: scale(1 / 2),
    borderRadius: scale(5),
    justifyContent: 'center',
    alignItems: 'center',
  },
  GenderChoice: {
    height: scale(50),
    width: scale(120),
    fontSize: scale(100),
  },
  TwoInforContainer: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
  },
  changeAvatarBut: {
    height: '20%',
    width: '100%',
    alignItems: 'center',
    backgroundColor: 'rgba(100, 54, 54, 0.3)',
    justifyContent: 'center',
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
  },
  modalCenter: {
    justifyContent: 'space-between',
    height: scale(150),
    alignItems: 'center',
  },
});
