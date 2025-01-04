import * as AuthSession from 'expo-auth-session';

const GOOGLE_CLIENT_ID = '949810558146-dksgrj473r0dsfuo42rjdf0ismqk2lk2.apps.googleusercontent.com'; // Replace with your actual client ID
const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';

export const googleSignIn = async () => {
  try {
    const redirectUri = AuthSession.makeRedirectUri({ useProxy: true });

    const authUrl = `${GOOGLE_AUTH_URL}?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${redirectUri}&response_type=token&scope=profile email`;

    const result = await AuthSession.startAsync({ authUrl });

    if (result.type === 'success' && result.params.access_token) {
      return result.params.access_token;
    } else {
      throw new Error('Google Sign-In was cancelled or failed.');
    }
  } catch (error) {
    throw new Error(`Error during Google Sign-In: ${error.message}`);
  }
};