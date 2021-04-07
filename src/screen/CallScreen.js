import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  FlatList,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {scale} from 'react-native-size-matters';
import {connect} from 'react-redux';
import {addTodo, deleteTodo} from '../../redux/actions';

const CallScreen = ({todo_list, addTodo, deleteTodo}) => {
  const navigation = useNavigation();
  const route = useRoute();
  const handleAddTodo = () => {
    addTodo(task);
    setTask('');
  };

  const handleDeleteTodo = (id) => {
    deleteTodo(id);
  };
  const [task, setTask] = useState('');
  return (
    <View style={styles.Container}>
      <View style={styles.ContainerTop}>
        <View style={styles.InputArea}>
          <TextInput
            value={task}
            placeholder="Enter something"
            onChangeText={(input) => setTask(input)}
            style={styles.textinput}
          />
        </View>
      </View>
      <View style={styles.ContainerCenter}>
        <FlatList
          data={todo_list}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({item, index}) => (
            <TouchableOpacity
              onPress={() => {
                handleDeleteTodo(item.id);
              }}
              style={styles.ContainerList}>
              <Text>{item.task}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
      <View style={styles.ContainerBot}>
        <TouchableOpacity
          onPress={() => {
            handleAddTodo();
          }}
          style={styles.button}>
          <Text>Add</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

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
  ContainerList: {
    marginBottom: scale(5),
    backgroundColor: 'gray',
    height: scale(40),
    width: scale(300),
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
  textinput: {
    fontSize: scale(30),
    color: 'black',
    fontFamily: 'kindandrich',
    height: scale(50),
    width: scale(230),
  },
  InputArea: {
    backgroundColor: '#f0f0f0',
    height: scale(50),
    width: scale(250),
    borderRadius: scale(20),
    padding: scale(10),
    justifyContent: 'center',
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
});
const mapStateToProps = (state, ownProps) => {
  return {
    todo_list: state.todos.todo_list,
  };
};

const mapDispatchToProps = {addTodo, deleteTodo};

export default connect(mapStateToProps, mapDispatchToProps)(CallScreen);
