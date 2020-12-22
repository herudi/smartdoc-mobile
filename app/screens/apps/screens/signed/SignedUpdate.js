import React, { useEffect, useState, useLayoutEffect, useRef } from "react";
import { View, Alert, Dimensions, KeyboardAvoidingView } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { apiGet, BASE_API, apiPut } from "../../../../services/api";
import { myError, getDownloadFile, keyboardVerticalOffset } from "../../../../utils/MyUtil";
import MyButtonMenuRight from "../../../../components/MyButtonMenuRight";
import SignedForm from "./SignedForm";
import { Overlay } from "react-native-elements";
import MyInputOutlined from "../../../../components/MyInputOutlined";
import { successColor, whiteColor } from "../../../../services/constant";
import AntDesign from "react-native-vector-icons/AntDesign";
import MyButton from "../../../../components/MyButton";
import MyLoadingCenter from "../../../../components/MyLoadingCenter";
import MyLoading from "../../../../components/MyLoading";
let fullwidth = Dimensions.get("window").width;

const SignedUpdate = ({ navigation, route }) => {
    const { id } = route.params;
    const [loading, setLoading] = useState(false);
    const [loadingInit, setLoadingInit] = useState(false);
    const [modalSigned, setModalSigned] = useState(false);
    const [signedText, setSignedText] = useState("");
    const [itemData, setItemData] = useState({});
    const refSignedText = useRef(null);
    
    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <View style={{marginRight:10,flex:1,flexDirection:"row",alignItems:"center"}}>
                    <MyButtonMenuRight iconName="retweet" onPress={() => {
                        init();
                    }}/>
                </View>
            )
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[navigation]);
    
    useEffect(() => {
        init();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    useEffect(() => {
        if (modalSigned) {
            refSignedText.current.focus();
        }
    }, [modalSigned]);

    const init = async () => {
        try {
            setLoadingInit(true);
            const _result = await apiGet("outgoing-mails-signed/" + id);
            const _data = _result.data;
            let _item = {
                ..._data,
                from: _data.from_employee.name,
                to: _data.to_employee ? _data.to_employee.name : "",
                type_name: _data.type.name,
                classification_name: _data.classification.name
            };
            _item.is_ok = true;
            setItemData(_item);
            setLoadingInit(false);
        } catch (error) {
            setLoadingInit(false);
            myError(error, navigation);
        }
    }

    const onDownloadAtt = async (_id, _name) => {
        let url = BASE_API + "outgoing-mails/download/attachment/" + _id;
        getDownloadFile(url, setLoading)
    }
    const onDownloadAttHistory = async (_id) => {
        let url = BASE_API + "outgoing-mails-approval/download/attachment-approval/" + _id;
        getDownloadFile(url, setLoading)
    }

    const onDownload = async () => {
        let url = BASE_API + "outgoing-mails-approval/download/review-outgoing-mail/" + id;
        getDownloadFile(url, setLoading)
    }

    const submitData = async () => {
        try {
            Alert.alert(
                "Confirm",
                "Yakin anda akan menandatangani surat ini ?",
                [
                    {
                        text: "Batal",
                        onPress: () => {},
                        style: "cancel"
                    },
                    {
                        text: "Ok", 
                        onPress: async () => {
                            if (itemData.signature_available) {
                                setSignedText("");
                                setModalSigned(true);
                            }else{
                                try {
                                    setLoading(true);
                                    const result = await apiPut("outgoing-mails-signed/" + id, {
                                        signature_available: itemData.signature_available
                                    });
                                    setLoading(false);
                                    Alert.alert(
                                        "Information",
                                        result.message,
                                        [
                                            {
                                                text:"Ok",
                                                onPress:() => {
                                                    navigation.goBack();
                                                }
                                            }
                                        ],
                                        {cancelable:false}
                                    );
                                } catch (error) {
                                    setLoading(false)
                                    myError(error,navigation);
                                }
                            }
                            
                        }
                    }
                ],
                { cancelable: false }
            );
            
        } catch (error) {
            console.log(error)
        }
    }

    const onSigned = () => {
        submitData();
    }

    const onSignedWithCredential = async () => {
        if (signedText !== "") {
            try {
                setLoading(true);
                const result = await apiPut("outgoing-mails-signed/" + id, {
                    signature_available: itemData.signature_available,
                    credential_key: signedText
                });
                setModalSigned(false);
                setLoading(false);
                Alert.alert(
                    "Information",
                    result.message,
                    [
                        {
                            text:"Ok",
                            onPress:() => {
                                navigation.goBack();
                            }
                        }
                    ],
                    {cancelable:false}
                );
            } catch (error) {
                setModalSigned(false);
                setLoading(false)
                myError(error,navigation);
            }
        }else{
            Alert.alert(
                "Error",
                "Kredensial tidak boleh kosong"
            );
        }
    }

    return (
        loadingInit ? <MyLoadingCenter/> : 
        <KeyboardAvoidingView style={{ flex: 1, backgroundColor: whiteColor }} behavior="position" keyboardVerticalOffset={keyboardVerticalOffset}>
            <MyLoading loading={loading}/>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="always">
                <SignedForm
                    itemTea={itemData}
                    onDownloadAtt={onDownloadAtt}
                    onSigned={onSigned}
                    onDownloadAttHistory={onDownloadAttHistory}
                    onDownload={onDownload}
                />
            </ScrollView>
           
            <Overlay isVisible={modalSigned} onBackdropPress={() => {
                setModalSigned(false)
            }}>
                <View style={{width:fullwidth - 100,padding:5, marginTop:10}}>
                    <MyInputOutlined
                        ref={refSignedText}
                        value={signedText}
                        name="signedText"
                        placeholder="Masukan kunci kredensial"
                        label="Kunci Kredensial"  
                        onChangeText={value => setSignedText(value)} 
                        onSubmitEditing={onSignedWithCredential}
                    />
                    <MyButton
                        onPress={onSignedWithCredential}
                        title="OK"
                        color={successColor}
                        icon={
                            <AntDesign 
                                name="check" 
                                size={18} 
                                color="white" 
                                style={{marginRight:5}}
                            />
                        }
                    />
                </View>
            </Overlay>
        </KeyboardAvoidingView>
    )

}

export default SignedUpdate;