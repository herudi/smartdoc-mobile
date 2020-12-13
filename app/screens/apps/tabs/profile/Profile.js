import React, { useEffect, useState, useRef } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { whiteColor, successColor, primaryColor } from "../../../../services/constant";
import { myError } from "../../../../utils/MyUtil";
import { getUserInfo, clearAll } from "../../../../services/storage";
import MyLetterIcon from "../../../../components/MyLetterIcon";
import MySimpleButton from "../../../../components/MySimpleButton";
import MyPanel from "../../../../components/MyPanel";
import AntDesign from "react-native-vector-icons/AntDesign";
import MySeparator from "../../../../components/MySeparator";
import { apiGet, apiPost } from "../../../../services/api";
import { CommonActions } from "@react-navigation/native";
import { showMessageError } from "../../../../components/MyMessage";
import MyLoadingCenter from "../../../../components/MyLoadingCenter";
import MyInputOutlined from "../../../../components/MyInputOutlined";
import MyButton from "../../../../components/MyButton";

function InfoText({
    title,
    iconName,
    panelStyle
}) {
    return (
        <View style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: "center",
            ...panelStyle
        }}>
            <View>
                <AntDesign name={iconName} size={22} color="gray" />
            </View>
            <View style={{ marginLeft: 10 }}>
                <Text style={styles.contentText}>{title}</Text>
            </View>
        </View>
    )
}

const Profile = ({
    navigation
}) => {
    const [itemData, setItemData] = useState({});
    const [loading, setLoading] = useState(false);

    const oldPasswordRef = useRef("");
    const newPasswordRef = useRef("");
    const newConfirmPasswordRef = useRef("");

    useEffect(() => {
        init();
    }, []);

    const init = async () => {
        try {
            const result = await getUserInfo();
            let _data = {
                departement_name: result.department ? result.department.name : "",
                employee_name: result.employee ? result.employee.name : "",
                position_name: result.potition ? result.potition.name : "",
                username: result.username ? result.username : "?"
            }
            setItemData(_data);
        } catch (error) {
            myError(error);
        }
    }

    const onLogout = async () => {
        try {
            setLoading(true);
            await apiGet("auth/logout?type=mobile");
            await clearAll();
            global.glob_access_token = null;
            setLoading(false);
            navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [
                        { name: 'Login' }
                    ],
                })
            );
        } catch (error) {
            setLoading(false);
            showMessageError("Error Logout");
        }
    }

    const onSubmit = async () => {
        if (oldPasswordRef.current.value() === "") {
            Alert.alert("Error", "Silahkan masukan password lama");
        } else if (newPasswordRef.current.value() === "") {
            Alert.alert("Error", "Silahkan masukan password baru");
        } else if (newConfirmPasswordRef.length === "") {
            Alert.alert("Error", "Silahkan masukan ulangi password baru");
        } else {
            setLoading(true);
            try {
                await apiPost('accounts', {
                    old_password: oldPasswordRef.current.value(),
                    new_password: newPasswordRef.current.value(),
                    new_confirm_password: newConfirmPasswordRef.current.value()
                });
                Alert.alert(
                    "Information",
                    "Sukses ganti password",
                    [
                        {
                            text:"Ok",
                            onPress:() => {
                                onLogout();
                            }
                        }
                    ],
                    {cancelable:false}
                );
                setLoading(false);
            } catch (error) {
                myError(error,navigation);
                setLoading(false);
            }
        }

    }
    return (
        loading ? <MyLoadingCenter /> :
            <ScrollView style={{ backgroundColor: whiteColor }}>
                <View
                    style={{
                        flexDirection: "column",
                        alignItems: "center",
                        padding: 20,
                        justifyContent: "center",
                        lineHeight: 2
                    }}
                >
                    <MyLetterIcon size={48} text={itemData.username ? itemData.username.charAt(0) : "?"} />
                    <Text style={{ marginTop: 5 }}>{itemData.username}</Text>
                </View>
                <MyPanel
                    title="Informasi"
                >
                    <InfoText
                        panelStyle={{ marginBottom: 16 }}
                        title={itemData.employee_name}
                        iconName="user"
                    />
                    <MySeparator />
                    <InfoText
                        panelStyle={{ marginBottom: 16, marginTop: 16 }}
                        title={itemData.position_name}
                        iconName="staro"
                    />
                    <MySeparator />
                    <InfoText
                        panelStyle={{ marginBottom: 16, marginTop: 16 }}
                        title={itemData.departement_name}
                        iconName="flag"
                    />
                    <MySeparator />

                </MyPanel>
                <MyPanel
                    title="Ganti Password"
                >
                    <MyInputOutlined
                        ref={oldPasswordRef}
                        placeholder="Masukan password lama"
                        label="Password Lama"
                        secureTextEntry
                    />
                    <View style={{ margin: 10 }}></View>
                    <MyInputOutlined
                        ref={newPasswordRef}
                        placeholder="Masukan password baru"
                        label="Password Baru"
                        secureTextEntry
                    />
                    <View style={{ margin: 10 }}></View>
                    <MyInputOutlined
                        ref={newConfirmPasswordRef}
                        placeholder="Masukan ulangi password baru"
                        label="Ulangi Password Baru"
                        secureTextEntry
                    />
                    <View style={{ margin: 10 }}></View>
                    <MyButton
                        onPress={onSubmit}
                        title="Submit"
                        color={primaryColor}
                    />
                </MyPanel>
                <MyPanel
                    containerStyle={{
                        marginBottom: 20
                    }}
                    title="Authentication"
                >
                    <MySimpleButton
                        onPress={onLogout}
                        title="Logout"
                        color={successColor}
                        iconName="power"
                        padding={10}
                        fontSize={16}
                    />

                </MyPanel>
            </ScrollView>
    );
}

const styles = StyleSheet.create({
    contentText: {
        color: "gray",
        fontSize: 16
    }
})

export default Profile;