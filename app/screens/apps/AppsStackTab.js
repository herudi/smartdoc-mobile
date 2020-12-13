import React, { useState, useEffect } from "react";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { primaryColor } from "../../services/constant";
import Home from "./tabs/home/Home";
import IconWithBadge from "../../components/IconWithBadge";
import Profile from "./tabs/profile/Profile";
import { createStackNavigator } from "@react-navigation/stack";
import Notification from "./tabs/notification/Notification";
// import AppContext from "../../../AppContext";
import { apiGet } from "../../services/api";
import { myError } from "../../utils/MyUtil";
import { AppTabProvider } from "./AppTabContext";


const AppsTab = createBottomTabNavigator();
const ProfileStack = createStackNavigator();
const NotifStack = createStackNavigator();

const getHeaderStyle = () => {
  return {
    headerStyle: {
      elevation: 4,
      backgroundColor: primaryColor,
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: '100'
    }
  }
}

function ProfileStackScreen() {
  return (
    <ProfileStack.Navigator>
      <ProfileStack.Screen
        name="Profile"
        component={Profile}
        options={{
          ...getHeaderStyle(),
          headerLeft: () => (
            <AntDesign style={{ marginLeft: 16 }} size={22} color="white" name="user" />
          )
        }}
      />
    </ProfileStack.Navigator>
  );
}
function NotifStackScreen() {
  return (
    <NotifStack.Navigator>
      <NotifStack.Screen
        name="Notifikasi"
        component={Notification}
        options={{
          ...getHeaderStyle(),
          headerLeft: () => (
            <AntDesign style={{ marginLeft: 16 }} size={22} color="white" name="bells" />
          )
        }}
      />
    </NotifStack.Navigator>
  );
}
function AppsStackTab({ navigation, route }) {
  // const { fromOpenNotif, fromReceivedNotif } = useContext(AppContext);
  const [countBadge, setCountBadge] = useState(0);

  useEffect(() => {
    getBadgeNotif();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getBadgeNotif = async () => {
    try {
      const result = await apiGet("notifications?page=1&per_page=10");
      if (result.meta) {
        setCountBadge(result.meta.pagination.total);
      }
    } catch (error) {
      myError(error, navigation)
    }
  }

  return (
    <AppTabProvider value={{
      setCountBadge:setCountBadge,
      countBadge:countBadge
    }}>
      <AppsTab.Navigator
        screenOptions={(screen) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (screen.route.name === 'HomeTab') {
              iconName = "home";
            } else if (screen.route.name === 'NotifTab') {
              return <IconWithBadge countBadge={countBadge} name="message1" size={size} color={color} />
            } else if (screen.route.name === 'ProfileTab') {
              iconName = "user";
            }
            return <AntDesign name={iconName} size={size} color={color} />;
          },
        })}
        tabBarOptions={{
          activeTintColor: primaryColor,
          style: {
            height: 56,
            paddingBottom: 5,
            paddingTop: 7,
            alignItems: "center",
            justifyContent: "center"
          }
        }}
      >
        <AppsTab.Screen name="HomeTab" component={Home} options={{ title: "Home" }} />
        <AppsTab.Screen name="NotifTab" component={NotifStackScreen} options={{ title: "Notifikasi" }} />
        <AppsTab.Screen name="ProfileTab" component={ProfileStackScreen} options={{ title: "Profile" }} />
      </AppsTab.Navigator>
    </AppTabProvider>
    
  )
}

export default AppsStackTab;