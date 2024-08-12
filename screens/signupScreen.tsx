import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from './types';
import * as FileSystem from 'expo-file-system';

type Props = StackScreenProps<RootStackParamList, 'SignUp'>;

const SignUpScreen = ({ navigation }: Props) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [csvFileUri, setCsvFileUri] = useState<string | null>(null);

  const csvDirectory = `${FileSystem.documentDirectory}user+pass/`;
  const csvFilePath = `${csvDirectory}user_credentials.csv`;

  useEffect(() => {
    const checkAndCreateCSV = async () => {
      try {
        const dirInfo = await FileSystem.getInfoAsync(csvDirectory);
        if (!dirInfo.exists) {
          console.log(`Directory does not exist, creating: ${csvDirectory}`);
          await FileSystem.makeDirectoryAsync(csvDirectory, { intermediates: true });
        }

        const fileInfo = await FileSystem.getInfoAsync(csvFilePath);
        if (!fileInfo.exists) {
          console.log(`File does not exist, creating: ${csvFilePath}`);
          await FileSystem.writeAsStringAsync(csvFilePath, 'username,password\n');
        }

        setCsvFileUri(csvFilePath);
        console.log(`CSV file is ready at: ${csvFilePath}`);
      } catch (error) {
        console.error('Failed to ensure CSV file:', error);
        Alert.alert('Error', `Failed to ensure CSV file: ${error.message}`);
      }
    };

    checkAndCreateCSV();
  }, []);

  const handleSignUp = async () => {
    if (username === '' || password === '') {
      Alert.alert('Error', 'Please enter both username and password');
      return;
    }

    if (!csvFileUri) {
      Alert.alert('Error', 'CSV file is not ready');
      return;
    }

    const csvLine = `${username},${password}\n`;

    try {
      console.log(`Reading from ${csvFileUri}`);
      const fileContent = await FileSystem.readAsStringAsync(csvFileUri);
      const updatedContent = fileContent + csvLine;
      console.log(`Updated file content: ${updatedContent}`);
      console.log(`Writing to ${csvFileUri}`);
      await FileSystem.writeAsStringAsync(csvFileUri, updatedContent);
      Alert.alert('Sign Up Successful', 'Your information has been saved');
      navigation.navigate('Login');
    } catch (error) {
      console.error('Failed to save user data:', error);
      Alert.alert('Error', `Failed to save user data: ${error.message}`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Sign Up Screen</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor="#888"
        value={username}
        onChangeText={setUsername}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#888"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      
      <TouchableOpacity
        style={styles.button}
        onPress={handleSignUp}
      >
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#120f2a',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  input: {
    width: '80%',
    height: 50,
    backgroundColor: '#1f1b45',
    borderRadius: 5,
    paddingHorizontal: 10,
    color: '#fff',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#7a4bf6',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default SignUpScreen;
