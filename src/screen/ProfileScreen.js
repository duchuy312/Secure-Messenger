import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {scale} from 'react-native-size-matters';
import {EditProfileIcon, SettingIcon, LogoutIcon} from '../../svg/icon';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const ProfileScreen = () => {
  const user = auth().currentUser.toJSON();
  const navigation = useNavigation();
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);
  console.log(userData);
  const getUser = async () => {
    await firestore()
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
  useEffect(() => {
    getUser();
  }, []);
  if (loading) {
    return <ActivityIndicator size="large" color="#555" />;
  }
  return (
    <ScrollView style={styles.Container}>
      {userData.userImg === '' ? (
        <ImageBackground
          blurRadius={2}
          style={styles.bigAvatar}
          source={require('../../assets/image/gradient_2.png')}>
          <View style={styles.avatarContainer}>
            <View style={styles.circle}>
              <ImageBackground
                style={styles.logo}
                source={require('../../assets/image/gradient_2.png')}
              />
            </View>
          </View>
        </ImageBackground>
      ) : (
        <ImageBackground
          blurRadius={2}
          style={styles.bigAvatar}
          source={{uri: userData.userImg}}>
          <View style={styles.avatarContainer}>
            <View style={styles.circle}>
              <ImageBackground
                style={styles.logo}
                source={{uri: userData.userImg}}
              />
            </View>
          </View>
        </ImageBackground>
      )}
      <View style={styles.ContainerCenter}>
        <Text style={styles.text}>{userData.email}</Text>
        <View style={styles.InfoContainer}>
          <View style={styles.InfoArea}>
            <Text style={styles.TitleText}>Name</Text>
            <Text style={styles.infoText}>{userData.fullname}</Text>
            <View style={styles.line} />
          </View>
          <View style={styles.InfoArea}>
            <Text style={styles.TitleText}>Email</Text>
            <Text style={styles.infoText}>{userData.email}</Text>
            <View style={styles.line} />
          </View>
          <View style={styles.InfoArea}>
            <Text style={styles.TitleText}>Phone</Text>
            <Text style={styles.infoText}>{userData.phone}</Text>
            <View style={styles.line} />
          </View>
          <View style={styles.InfoArea}>
            <Text style={styles.TitleText}>BirthDay</Text>
            <Text style={styles.infoText}>
              {new Date(userData.birthday).toLocaleDateString('en-GB')}
            </Text>
            <View style={styles.line} />
          </View>
          <View style={styles.InfoArea}>
            <Text style={styles.TitleText}>Gender</Text>
            <Text style={styles.infoText}>
              {userData.gender === 1 ? 'Nam' : 'Nữ'}
            </Text>
            <View style={styles.line} />
          </View>
          <View style={styles.InfoArea}>
            <Text style={styles.TitleText}>Place</Text>
            <Text style={styles.infoText}>{userData.city}</Text>
            <View style={styles.line} />
          </View>
          <TouchableOpacity
            style={styles.button1}
            onPress={() => {
              navigation.navigate('EditProfileScreen', {
                profileid: userData._id,
                userid: userData.userid,
                birthday: userData.birthday,
                city: userData.city,
                fullname: userData.fullname,
                gender: userData.gender,
                phone: userData.phone,
                userImg: userData.userImg,
                email: userData.email,
              });
            }}>
            <View style={styles.IconAndText}>
              <EditProfileIcon color="black" />
              <Text style={styles.Button1Text}>Edit Profile</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button1}>
            <View style={styles.IconAndText}>
              <SettingIcon color="black" />
              <Text style={styles.Button1Text}>Setting</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button1}
            onPress={() => {
              navigation.navigate('LoginScreen');
            }}>
            <View style={styles.IconAndText}>
              <LogoutIcon color="black" />
              <Text style={styles.Button1Text}>Log Out</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};
export default ProfileScreen;

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: 'white',
    width: '100%',
  },
  ContainerCenter: {
    marginTop: scale(60),
    alignItems: 'center',
  },
  logocontainer: {
    height: scale(160),
    width: scale(160),
    alignItems: 'center',
    alignSelf: 'center',
  },
  text: {
    fontSize: scale(60),
    color: 'black',
    fontFamily: 'kindandrich',
  },
  bigAvatar: {
    height: scale(180),
    width: '100%',
    resizeMode: 'stretch',
    alignItems: 'center',
  },
  avatarContainer: {
    marginTop: scale(120),
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
  line: {
    backgroundColor: 'black',
    height: scale(1 / 4),
    width: '100%',
  },
  InfoArea: {
    marginTop: scale(15),
    height: scale(50),
    width: '90%',
    justifyContent: 'space-around',
  },
  InfoContainer: {
    marginTop: scale(5),
    width: '100%',
    alignItems: 'center',
  },
  TitleText: {
    fontSize: scale(18),
    fontWeight: 'bold',
    color: '#933c94',
  },
  infoText: {
    fontSize: scale(18),
    fontWeight: '600',
    color: '#333333',
  },
  button1: {
    marginTop: scale(10),
    width: scale(290),
    height: scale(45),
    alignSelf: 'center',
    borderRadius: scale(20),
    marginBottom: scale(20),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: scale(1),
    borderColor: '#933c94',
  },
  Button1Text: {
    fontSize: scale(18),
    color: 'black',
    marginLeft: scale(10),
  },
  IconAndText: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
