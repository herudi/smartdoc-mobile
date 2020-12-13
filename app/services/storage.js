import { ToastAndroid } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

export const setUserData = async data => {
  try {
    let myStorage = {
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      user_info: data.user_info,
      permission: data.permission
    };
    await AsyncStorage.setItem('my_storage', JSON.stringify(myStorage));
  } catch (error) {
    ToastAndroid.show('Error Create Storage', ToastAndroid.SHORT);
  }
};

export const clearAll = async () => {
  try {
    await AsyncStorage.removeItem('my_storage');
  } catch (error) {
    ToastAndroid.show('Error Remove Storage', ToastAndroid.SHORT);
  }
};

export const getAllStorage = async () => {
  try {
    const value = await AsyncStorage.getItem('my_storage');
    if (value !== null) {
      let data = JSON.parse(value);
      return data;
    }
  } catch (error) {
    ToastAndroid.show('Error Get Storage', ToastAndroid.SHORT);
  }
  return null;
};

export const getAccessToken = async () => {
  try {
    const value = await AsyncStorage.getItem('my_storage');
    if (value !== null) {
      let data = JSON.parse(value);
      return data.access_token;
    }
  } catch (error) {
    ToastAndroid.show('Error Get Storage', ToastAndroid.SHORT);
  }
  return null;
};

export const getRefreshToken = async () => {
  try {
    const value = await AsyncStorage.getItem('my_storage');
    if (value !== null) {
      let data = JSON.parse(value);
      return data.refresh_token;
    }
  } catch (error) {
    ToastAndroid.show('Error Get Storage', ToastAndroid.SHORT);
  }
  return null;
};

export const getUserInfo = async () => {
  try {
    const value = await AsyncStorage.getItem('my_storage');
    if (value !== null) {
      let data = JSON.parse(value);
      return data.user_info;
    }
  } catch (error) {
    ToastAndroid.show('Error Get Storage', ToastAndroid.SHORT);
  }
  return null;
};

export const getPermissionUser = async () => {
  try {
    const value = await AsyncStorage.getItem('my_storage');
    if (value !== null) {
      let data = JSON.parse(value);
      return data.permission;
    }
  } catch (error) {
    ToastAndroid.show('Error Get Storage', ToastAndroid.SHORT);
  }
  return null;
};

export const isLoggedIn = async () => {
  try {
    const value = await AsyncStorage.getItem('my_storage');
    if (value !== null) {
      return true;
    }
  } catch (error) {
    ToastAndroid.show('Error Get Storage', ToastAndroid.SHORT);
  }
  return false;
};
