import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from './types';
import * as FileSystem from 'expo-file-system';
import Papa from 'papaparse';

type Props = StackScreenProps<RootStackParamList, 'Login'>;

const LoginScreen = ({ navigation }: Props) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [userData, setUserData] = useState<{ username: string; password: string }[]>([]);

  const csvFilePath = `${FileSystem.documentDirectory}user+pass/user_credentials.csv`;

  useEffect(() => {
    const loadCSV = async () => {
      try {
        const fileInfo = await FileSystem.getInfoAsync(csvFilePath);
        if (fileInfo.exists) {
          const fileContent = await FileSystem.readAsStringAsync(csvFilePath);
          console.log(`CSV File Content: ${fileContent}`);
          Papa.parse(fileContent, {
            header: true,
            skipEmptyLines: true,
            complete: (results: Papa.ParseResult<{ username: string; password: string }>) => {
              console.log(`Parsed Data: ${JSON.stringify(results.data)}`);
              setUserData(results.data);
            },
            error: (error) => {
              Alert.alert('Error', `Failed to parse CSV file: ${error.message}`);
            },
          });
        } else {
          Alert.alert('Error', 'CSV file not found. Please sign up first.');
        }
      } catch (error) {
        Alert.alert('Error', `Failed to load CSV file: ${error.message}`);
      }
    };

    loadCSV();
  }, []);

  const isButtonDisabled = username === '' || password === '';

  const handleLogin = () => {
    const user = userData.find((user) => user.username === username && user.password === password);
    if (user) {
      navigation.navigate('Home');
    } else {
      Alert.alert('Login Failed', 'Invalid username or password');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Login Screen</Text>
      
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
        style={[styles.button, isButtonDisabled && styles.buttonDisabled]}
        onPress={handleLogin}
        disabled={isButtonDisabled}
      >
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      
      <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
        <Text style={styles.signUpText}>Don't have an account? Sign Up</Text>
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
    position: 'absolute',
    bottom: 280,
    backgroundColor: '#7a4bf6',
    paddingVertical: 10,
    paddingHorizontal: 150,
    borderRadius: 5,
    alignSelf: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#555', // Disabled button color
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  signUpText: {
    color: '#7a4bf6',
    bottom: 10,
    fontSize: 16,
  },
});

export default LoginScreen;
