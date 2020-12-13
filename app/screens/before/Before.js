import React, { useEffect } from "react";
import { getAccessToken } from "../../services/storage";
import { View, Image, Text, StyleSheet, ActivityIndicator, PermissionsAndroid } from "react-native";
import { primaryColor } from "../../services/constant";
import { CommonActions } from "@react-navigation/native";
import { showMessageError } from "../../components/MyMessage";
import { apiGet } from "../../services/api";
import { myError } from "../../utils/MyUtil";
global.glob_access_token = null;
const Before = ({ navigation }) => {

    useEffect(() => {
        coreInit();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const coreInit = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                init();
            } else {
                showMessageError("Not Permited");
            }
        } catch (error) {
            showMessageError("Not Permited");
        }
    }

    const init = async () => {
        try {
            const access_token = await getAccessToken();
            if (access_token) {
                await apiGet("menus/navigation/roles");
                // console.log(result.data);
                global.glob_access_token = access_token;
                setTimeout(() => {
                    navigation.dispatch(
                        CommonActions.reset({
                            index: 0,
                            routes: [
                                { name: 'Apps' }
                            ],
                        })
                    );
                }, 1000);
            } else {
                setTimeout(() => {
                    navigation.dispatch(
                        CommonActions.reset({
                            index: 0,
                            routes: [
                                { name: 'Login' }
                            ],
                        })
                    );
                }, 1000);
            }
        } catch (error) {
            myError(error, navigation);
        }

    }
    return (
        <View style={{ flex: 1,backgroundColor:"white", alignItems: "center", justifyContent: "center" }}>
            <Image
                style={styles.stretch}
                source={require('./../../../assets/logo2.png')}
            />
            <View style={{ margin: 10 }}></View>
            <Text
                style={{
                    color: primaryColor,
                    fontSize: 14,
                    textAlign: "center",
                }}
            >RSM E-LETTER</Text>
            <View style={{ margin: 10 }}></View>
            <ActivityIndicator size="large" color={primaryColor} />
        </View>
    )
};
const styles = StyleSheet.create({
    stretch: {
        width: 160,
        height: 50,
        resizeMode: 'stretch',
    },
});

export default Before;