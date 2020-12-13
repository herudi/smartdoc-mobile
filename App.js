import React, { useEffect, useState } from 'react';
import {StatusBar, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import FlashMessage from 'react-native-flash-message';
import { primaryDarkColor, primaryColor } from './app/services/constant';
import Before from './app/screens/before/Before';
import Login from './app/screens/login/Login';
import AppsStackTab from './app/screens/apps/AppsStackTab';
import Approval from './app/screens/apps/screens/approval/Approval';
import ApprovalUpdate from './app/screens/apps/screens/approval/ApprovalUpdate';
import Signed from './app/screens/apps/screens/signed/Signed';
import SignedUpdate from './app/screens/apps/screens/signed/SignedUpdate';
import IncomingMail from './app/screens/apps/screens/incoming_mail/IncomingMail';
import IncomingMailDetail from './app/screens/apps/screens/incoming_mail/IncomingMailDetail';
import DispositionStackTab from './app/screens/apps/screens/disposition/DispositionStackTab';
import DispositionCreate from './app/screens/apps/screens/disposition/screens/disposition/create/DispositionCreate';
import DispositionUpdate from './app/screens/apps/screens/disposition/screens/disposition/update/DispositionUpdate';
import FollowUpDisposition from './app/screens/apps/screens/disposition/screens/followup_disposition/FollowUpDisposition';
import FollowUpDispositionUpdate from './app/screens/apps/screens/disposition/screens/followup_disposition/FollowUpDispositionUpdate';
import OneSignal from 'react-native-onesignal';
import { AppProvider } from './AppContext';
import TrackingRedisposition from './app/screens/apps/screens/disposition/screens/tracking_redisposition/TrackingRedisposition';
const getHeaderBar = (title) => {
    return {
        title: title,
        headerStyle: {
          elevation:4,
          backgroundColor: primaryColor,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: '100'
        }
    }
}

const Stack = createStackNavigator();
function App() {
  const [userDevice, setUserDevice] = useState(null);
  const [openNotif, setOpenNotif] = useState(null);
  const [receivedNotif, setReceivedNotif] = useState(null);

  useEffect(() => {
    OneSignal.setLogLevel(6, 0);
    // OneSignal.init("2a4960d9-3c88-40ae-b161-ae4326d0c8d6", {
    //   kOSSettingsKeyAutoPrompt : false, 
    //   kOSSettingsKeyInAppLaunchURL: false, 
    //   kOSSettingsKeyInFocusDisplayOption:2
    // });

    OneSignal.init("470be6e3-a82d-453f-833d-edab473e9431", {
      kOSSettingsKeyAutoPrompt : false, 
      kOSSettingsKeyInAppLaunchURL: false, 
      kOSSettingsKeyInFocusDisplayOption:2
    });
    OneSignal.inFocusDisplaying(2);
    OneSignal.addEventListener('received', onReceivedNotif);
    OneSignal.addEventListener('opened', onOpenedNotif);
    OneSignal.addEventListener('ids', onIdsNotif);
    return () => {
      OneSignal.removeEventListener('received', onReceivedNotif);
      OneSignal.removeEventListener('opened', onOpenedNotif);
      OneSignal.removeEventListener('ids', onIdsNotif);
    }
  }, []);

  const onReceivedNotif = (notification) => {
    console.log("Notification received: ", notification);
    setReceivedNotif(notification);
  }
  const onOpenedNotif = (openResult) => {
    // console.log('Message: ', openResult.notification.payload.body);
    // console.log('Data: ', openResult.notification.payload.additionalData);
    // console.log('isActive: ', openResult.notification.isAppInFocus);
    // console.log('openResult: ', openResult);
    setOpenNotif(openResult);
  }

  const onIdsNotif = (device) => {
    // console.log('Device info: ', device);
    setUserDevice(device);
  }
  return (
    <AppProvider value={{
      userDevice:userDevice,
      fromOpenNotif:openNotif,
      setFromOpenNotif:setOpenNotif,
      fromReceivedNotif:receivedNotif
      }}>
      <View style={{flex: 1}}>
        <StatusBar backgroundColor={primaryDarkColor} />
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Before">
            <Stack.Screen name="Before" component={Before} options={{headerShown: false}}/>
            <Stack.Screen name="Login" component={Login} options={{headerShown: false}}/>
            <Stack.Screen 
              name="Approval" 
              component={Approval} 
              options={({ navigation, route }) => (getHeaderBar("List Persetujuan"))}
            />
            <Stack.Screen 
              name="ApprovalUpdate" 
              component={ApprovalUpdate} 
              options={({ navigation, route }) => (getHeaderBar("Persetujuan"))}
            />
            <Stack.Screen 
              name="Signed" 
              component={Signed} 
              options={({ navigation, route }) => (getHeaderBar("List Tanda Tangan"))}
            />
            <Stack.Screen 
              name="SignedUpdate" 
              component={SignedUpdate} 
              options={({ navigation, route }) => (getHeaderBar("Tanda Tangan"))}
            />
            <Stack.Screen 
              name="IncomingMail" 
              component={IncomingMail} 
              options={({ navigation, route }) => (getHeaderBar("Surat Masuk"))}
            />
            <Stack.Screen 
              name="IncomingMailDetail" 
              component={IncomingMailDetail} 
              options={({ navigation, route }) => (getHeaderBar("Detail Surat Masuk"))}
            />
            <Stack.Screen 
              name="Disposition" 
              component={DispositionStackTab} 
              options={{headerShown:false}}
            />
            <Stack.Screen 
              name="TrackingRedisposition" 
              component={TrackingRedisposition} 
              options={({ navigation, route }) => (getHeaderBar("Tracking Redisposisi"))}
            />
            <Stack.Screen 
              name="DispositionCreate" 
              component={DispositionCreate} 
              options={({ navigation, route }) => (getHeaderBar("Buat Baru Disposisi"))}
            />
            <Stack.Screen 
              name="DispositionUpdate" 
              component={DispositionUpdate} 
              options={({ navigation, route }) => (getHeaderBar("Perbarui Disposisi"))}
            />
            <Stack.Screen 
              name="DispositionFollowUp" 
              component={FollowUpDisposition} 
              options={({ navigation, route }) => (getHeaderBar("Tindak Lanjut Disposisi"))}
            />
            <Stack.Screen 
              name="DispositionFollowUpUpdate" 
              component={FollowUpDispositionUpdate} 
              options={({ navigation, route }) => (getHeaderBar("Perbarui Tindak Lanjut Disposisi"))}
            />
            <Stack.Screen
              name="Apps"
              component={AppsStackTab}
              options={{headerShown:false}}
            />
          </Stack.Navigator>
        </NavigationContainer>
        <FlashMessage position="top" animated />
      </View>
    </AppProvider>
    
  );
}

export default App;
