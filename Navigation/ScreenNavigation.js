import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {scale} from 'react-native-size-matters';
import {useRoute} from '@react-navigation/native';
import CallScreen from '../src/screen/CallScreen';
import CallsScreen from '../src/screen/CallsScreen';
import ChatScreen from '../src/screen/ChatScreen';
import ContactScreen from '../src/screen/ContactScreen';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {CallIcon, ChatIcon, ContactIcon} from '../svg/icon';

const Tab = createMaterialTopTabNavigator();
function TopScreen() {
  function LogoTitle(props) {
    const {name, icon, textcolor} = props;
    return (
      <View style={styles.top}>
        <Text
          style={{
            fontSize: scale(16),
            color: textcolor,
            marginRight: scale(10),
          }}>
          {name}
        </Text>
        {icon}
      </View>
    );
  }
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarLabel: ({focused}) => {
          let iconName;
          if (route.name === 'Calls') {
            iconName = focused ? (
              <LogoTitle
                textcolor="white"
                name="Calls"
                icon={<CallIcon color="white" />}
              />
            ) : (
              <LogoTitle
                textcolor="#9D9D9D"
                name="Calls"
                icon={<CallIcon color="#9D9D9D" />}
              />
            );
          } else if (route.name === 'Chats') {
            iconName = focused ? (
              <LogoTitle
                textcolor="white"
                name="Chats"
                icon={<ChatIcon color="white" />}
              />
            ) : (
              <LogoTitle
                textcolor="#9D9D9D"
                name="Chats"
                icon={<ChatIcon color="#9D9D9D" />}
              />
            );
          } else if (route.name === 'Contact') {
            iconName = focused ? (
              <LogoTitle
                textcolor="white"
                name="Contact"
                icon={<ContactIcon color="white" />}
              />
            ) : (
              <LogoTitle
                textcolor="#9D9D9D"
                name="Contact"
                icon={<ContactIcon color="#9D9D9D" />}
              />
            );
          }
          return <View>{iconName}</View>;
        },
        // tabBarVisible: false,
      })}
      tabBarOptions={{
        labelStyle: {fontSize: scale(12)},
        style: {
          height: scale(40),
          backgroundColor: '#933c94',
          justifyContent: 'center',
        },
      }}>
      <Tab.Screen name="Chats" component={ChatScreen} />
      <Tab.Screen name="Contact" component={ContactScreen} />
      <Tab.Screen name="Calls" component={CallsScreen} />
    </Tab.Navigator>
  );
}

export default TopScreen;
const styles = StyleSheet.create({
  topTittle: {
    fontSize: scale(16),
    color: 'white',
    marginRight: scale(10),
  },
  top: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
});
