import React from "react";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import { createStackNavigator } from "@react-navigation/stack";
import Disposition from "./screens/disposition/Disposition";
import { primaryColor } from "../../../../services/constant";
import FollowUpDisposition from "./screens/followup_disposition/FollowUpDisposition";

const AppsTab = createBottomTabNavigator();
const DispositionStack = createStackNavigator();
const DispositionFollowUpStack = createStackNavigator();

const getHeaderStyle = (title) => {
    return {
        title: title,
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

function DispositionStackScreen() {
    return (
        <DispositionStack.Navigator>
            <DispositionStack.Screen
                name="DispositionChildTab"
                component={Disposition}
                options={getHeaderStyle("Disposisi")}
            />
        </DispositionStack.Navigator>
    );
}

function DispositionFollowUpStackScreen() {
    return (
        <DispositionFollowUpStack.Navigator>
            <DispositionFollowUpStack.Screen
                name="DispositionFollowUpChildTab"
                component={FollowUpDisposition}
                options={getHeaderStyle("Tindak Lanjut Disposisi")}
            />
        </DispositionFollowUpStack.Navigator>
    );
}

function DispositionStackTab({ navigation, route }) {

    return (
        <AppsTab.Navigator
            backBehavior="none"
            screenOptions={(screen) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    if (screen.route.name === 'DispositionTab') {
                        iconName = "cursor";
                    } else if (screen.route.name === 'FollowUpDispositionTab') {
                        iconName = "graph";
                    }
                    return <SimpleLineIcons name={iconName} size={size} color={color} />;
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
            <AppsTab.Screen name="DispositionTab" component={DispositionStackScreen} options={{ title: "Disposisi" }} />
            <AppsTab.Screen name="FollowUpDispositionTab" component={DispositionFollowUpStackScreen} options={{ title: "Tindak Lanjut" }} />
        </AppsTab.Navigator>
    )
}

export default DispositionStackTab;