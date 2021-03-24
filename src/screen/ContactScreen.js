import React from 'react';
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {scale} from 'react-native-size-matters';

const ContactScreen = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.Container}>
      <View style={styles.ContainerTop}>
        <Text style={styles.text}>ContactScreen</Text>
      </View>
      <View style={styles.ContainerCenter} />
      <View style={styles.ContainerBot}>
        <TouchableOpacity>
          <Text>Next page</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default ContactScreen;

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
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
    color: 'black',
    fontFamily: 'kindandrich',
  },
});
