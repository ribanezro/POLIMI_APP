import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet, Alert, Image, Platform } from 'react-native';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import Constants from 'expo-constants';

WebBrowser.maybeCompleteAuthSession();

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Log current platform
  console.log('Current Platform:', Platform.OS);

  const isExpoGo = Constants.executionEnvironment === 'storeClient'; // 'storeClient' indicates Expo Go

  console.log('Running in Expo Go:', isExpoGo);

  // Dynamic client ID configuration
  const clientId = isExpoGo
    ? '119778560119-vdasr532tr43s0uoggbtqbo8a8gg6svg.apps.googleusercontent.com' // Web Client ID
    : Platform.select({
        ios: '119778560119-iso4ufo35fp3cippa9p7s9ab45vu7lbv.apps.googleusercontent.com', // iOS Client ID
        android: 'YOUR_ANDROID_CLIENT_ID.apps.googleusercontent.com', // Android Client ID
        default: '119778560119-vdasr532tr43s0uoggbtqbo8a8gg6svg.apps.googleusercontent.com',
      });

  // Redirect URI configuration
  const redirectUri = isExpoGo
    ? `https://auth.expo.io/@rafiki6334/monumentapp` // Replace with your Expo username and slug
    : AuthSession.makeRedirectUri({
        native: Platform.select({
          ios: 'your.bundle.identifier:/oauthredirect',
          android: 'com.yourcompany.yourapp:/oauthredirect',
        }),
      });

  console.log('Redirect URI:', redirectUri);
  console.log('Client ID being used:', clientId);

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId,
    redirectUri,
    scopes: ['profile', 'email'],
  });

  useEffect(() => {
    if (response) {
      console.log('Google Auth Response:', JSON.stringify(response, null, 2));
  
      if (response.type === 'success') {
        console.log('Google Sign-In Successful:', response);
        const { authentication } = response;
        if (authentication) {
          console.log('Access Token Received:', authentication.accessToken);
          handleGoogleSignIn(authentication.accessToken);
        } else {
          console.error('Authentication object missing:', response);
        }
      } else if (response.type === 'error') {
        console.error('Google Sign-In Error:', response.error);
      }
    }
  }, [response]);

  const handleGoogleSignIn = async (token) => {
    console.log('Sending Token to Backend:', token);

    try {
      const apiResponse = await fetch(
        'https://monumentapp-73e8e79b6ee2.herokuapp.com/users/google-login/',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        }
      );
      const result = await apiResponse.json();
      console.log('Backend Response:', JSON.stringify(result, null, 2));

      if (result.error) {
        console.error('Backend Error:', result.error);
        Alert.alert('Error', 'Error during Google Sign-In');
      } else {
        console.log('User Info:', result);
        if (!result.user_type) {
          console.log('New User: Navigating to Profile Completion Screen');
          navigation.navigate('EscollirUsuari');
        } else {
          console.log('Existing User: Navigating to Main App Screen');
          navigation.navigate('Footer');
        }
      }
    } catch (error) {
      console.error('Error Communicating with Backend:', error);
      Alert.alert('Error', 'Something went wrong during Google Sign-In');
    }
  };

  const handleLogin = () => {
    if (email === 'usuario@ejemplo.com' && password === '123456') {
      Alert.alert('Éxito', '¡Inicio de sesión correcto!');
    } else {
      Alert.alert('Error', 'Usuario o contraseña incorrectos');
    }
  };

  const handleRegister = () => {
    Alert.alert('Registro', 'Navegando a la página de registro...');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar Sesión</Text>

      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.googleButton}
        onPress={() => {
          console.log('Prompting Google Sign-In...');
          promptAsync();
        }}
        disabled={!request}
      >
        <Image
          source={require('./assets/images/google.png')}
          style={styles.googleIcon}
        />
        <Text style={styles.googleButtonText}>Iniciar sesión con Google</Text>
      </TouchableOpacity>

      <Text style={styles.footerText}>
        ¿No tienes cuenta?{' '}
        <Text style={styles.registerText} onPress={handleRegister}>
          Regístrate
        </Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    paddingVertical: 10,
  },
  googleIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  googleButtonText: {
    fontSize: 16,
    color: '#555',
    fontWeight: 'bold',
  },
  footerText: {
    marginTop: 20,
    textAlign: 'center',
    color: '#555',
    fontSize: 16,
  },
  registerText: {
    color: '#2196F3',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;