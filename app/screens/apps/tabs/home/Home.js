import React, { useEffect, useState, useContext, useCallback } from "react";
import { View, Image, Text } from "react-native";
import ItemMenuButton from "./ItemMenuButton";
import HomeHeader from "./HeaderHome";
import { getAllStorage } from "../../../../services/storage";
import { showMessageError, showAlert } from "../../../../components/MyMessage";
import { moduleApproval, moduleDisposition, moduleSigned, whiteColor, moduleIncoming, primaryColor, moduleDispositionFollowUp } from "../../../../services/constant";
import AppContext from "../../../../../AppContext";
import { useFocusEffect } from "@react-navigation/native";
import { ScrollView } from "react-native-gesture-handler";


const Home = ({ navigation }) => {
    const [userInfo, setUserInfo] = useState({});
    const [userPermission, setUserPermission] = useState([]);
    const { fromOpenNotif, setFromOpenNotif } = useContext(AppContext);
    useEffect(() => {
        init();
    }, []);

    const openScreenNotif = useCallback(() => {
        if (fromOpenNotif) {
            let screen = fromOpenNotif.notification.payload.additionalData.route_name;
            setFromOpenNotif(null);
            navigation.navigate(screen);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fromOpenNotif, navigation]);

    useFocusEffect(openScreenNotif);

    const init = async () => {
        try {
            const storage = await getAllStorage();
            let userData = storage.user_info;
            let _data = userData ? {
                position: userData.potition.name,
                username: userData.username
            } : {};
            setUserPermission(storage.permission);
            setUserInfo(_data);
        } catch (error) {
            showMessageError("Error Parsing Storage")
        }
    }

    const onPressApproval = async () => {
        let isAvailable = userPermission.find(item => item.module === moduleApproval);
        if (isAvailable) {
            navigation.navigate("Approval")
        } else {
            showAlert("Maaf, anda tidak punya hak akses approval.")
        }

    }
    const onPressSigned = async () => {
        let isAvailable = userPermission.find(item => item.module === moduleSigned);
        if (isAvailable) {
            navigation.navigate("Signed")
        } else {
            showAlert("Maaf, anda tidak punya hak akses tanda tangan.")
        }

    }
    const onPressDosposition = async () => {
        let isAvailable = userPermission.find(item => item.module === moduleDisposition || item.module === moduleDispositionFollowUp);
        if (isAvailable) {
            navigation.navigate("Disposition")
        } else {
            showAlert("Maaf, anda tidak punya hak akses disposisi.")
        }
    }

    const onPressIncoming = async () => {
        let isAvailable = userPermission.find(item => item.module === moduleIncoming);
        if (isAvailable) {
            navigation.navigate("IncomingMail")
        } else {
            showAlert("Maaf, anda tidak punya hak akses surat masuk.")
        }
    }

    return (
        <>
            <View style={{
                padding: 15,
                backgroundColor: whiteColor
            }}>
                <View style={{
                    flexDirection: "row"
                }}>
                    <Image
                        style={{
                            width: 30,
                            height: 25,
                            resizeMode: 'stretch'
                        }}
                        source={require('./../../../../../assets/logo.png')}
                    />
                    <View style={{
                        flexDirection: "column",
                        marginLeft: 10
                    }}>
                        <Text style={{
                            color: primaryColor,
                            fontSize: 20
                        }}>RSM E-LETTER</Text>
                    </View>
                </View>

            </View>
            <ScrollView style={{ flex: 1, backgroundColor: whiteColor }}>
                <View style={{
                    flex: 1
                }}>
                    <HomeHeader
                        name={userInfo.username}
                        position={userInfo.position}
                    />
                    <View style={{
                        marginTop: 20,
                        margin:15
                    }}>
                        <Text style={{
                            fontSize: 20,
                        }}>Menu</Text>
                        <Text style={{
                            fontSize: 14,
                            color:"#616161"
                        }}>List menu e-letter</Text>
                        
                    </View>
                    <View style={{
                        margin: 15,
                        flex: 1,
                        justifyContent: 'space-between'
                    }}>
                        <View style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center"
                        }}>
                            <ItemMenuButton
                                borderColor="#a5d6a7"
                                color="#28a745"
                                title="Persetujuan"
                                iconName="check"
                                onPress={onPressApproval}
                            />
                            <ItemMenuButton
                                borderColor="#ffab91"
                                color="#e64a19"
                                title="Tanda Tangan"
                                iconName="key"
                                onPress={onPressSigned}
                            />
                            <ItemMenuButton
                                borderColor="#80cbc4"
                                color="#17a2b8"
                                title="Surat Masuk"
                                iconName="envelope"
                                onPress={onPressIncoming}
                            />
                            <ItemMenuButton
                                borderColor="#65a5d2"
                                color={primaryColor}
                                title="Disposisi"
                                iconName="cursor"
                                onPress={onPressDosposition}
                            />
                        </View>
                    </View>
                </View>
            </ScrollView>
        </>
    )
}

export default Home;