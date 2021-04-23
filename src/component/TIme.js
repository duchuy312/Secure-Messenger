import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {scale} from 'react-native-size-matters';

export default function Time(props) {
  const {text} = props;
  return (
    <View style={styles.container}>
      <Text style={styles.Text}>{text}</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  continue: {
    backgroundColor: 'red',
  },
});
