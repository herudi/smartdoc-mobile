import React, { useState, useRef, useLayoutEffect } from "react";
import { View, Alert, Dimensions, KeyboardAvoidingView } from "react-native";
import MyLoading from "../../../../../../../components/MyLoading";
import DispositionCreateForm from "./DispositionCreateForm";
import { ScrollView } from "react-native-gesture-handler";
import { apiGet, apiPost, BASE_API } from "../../../../../../../services/api";
import { Overlay } from "react-native-elements";
import MyInputOutlined from "../../../../../../../components/MyInputOutlined";
import MyButton from "../../../../../../../components/MyButton";
import { successColor, whiteColor } from "../../../../../../../services/constant";
import AntDesign from "react-native-vector-icons/AntDesign";
import { myError, getDownloadFile, keyboardVerticalOffset } from "../../../../../../../utils/MyUtil";
import MyButtonMenuRight from "../../../../../../../components/MyButtonMenuRight";
let fullwidth = Dimensions.get("window").width;

const DispositionCreate = ({ navigation, route }) => {
    const [loading, setLoading] = useState(false);
    const [modalCredential,setModalCredential] = useState(false);
    const [valueData,setValueData] = useState({});
    const [isRefresh,setIsRefresh] = useState(false);
    const { incoming_mail_id, type, parent_disposition_id } = route.params;

    const credentialRef = useRef("");

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <View style={{marginRight:10,flex:1,flexDirection:"row",alignItems:"center"}}>
                    <MyButtonMenuRight iconName="retweet" onPress={() => {
                        setIsRefresh(true);
                        
                    }}/>
                </View>
            )
        });
    },[navigation]);
    const onSubmit = async (statusButton,value) => {
        try {
            let myMessage = "";
            switch(statusButton){
                case 0:myMessage = "Yakin anda akan draft disposisi ?"; break;
                default:myMessage = "Yakin anda akan mengirim disposisi ?";
            }
            const _value = value;
            Alert.alert(
                "Confirm",
                myMessage,
                [
                    {
                        text: "Batal",
                        onPress: () => {},
                        style: "cancel"
                    },
                    {
                        text: "Ok", 
                        onPress: async () => {
                            try {
                                setLoading(true);    
                                _value.button_action = statusButton;
                                _value.is_redisposition = type === 'redisposition' ? 1 : 0;
                                _value.parent_disposition_id = parent_disposition_id;
                                setValueData(_value);
                                if (statusButton === 1) {
                                    const checkSignature = await apiGet("digital-signatures/check/available-signature");
                                    if (checkSignature.status) {
                                        setModalCredential(true);
                                        setLoading(false);
                                        credentialRef.current.focus();
                                    }else{
                                        const result = await apiPost("dispositions",_value);
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
                                    }
                                } else{
                                    const result = await apiPost("dispositions",_value);
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
                                }             
                            } catch (error) {
                                setLoading(false)
                                myError(error,navigation);
                            }
                                         
                        }
                    }
                ],
                { cancelable: false }
            );
        } catch (error) {
            console.log(error);
        }
    }

    const onSubmitWithCredential = async () => {
        try {
            setLoading(true);  
            let _value = valueData;  
            _value.button_action = 1;
            _value.credential_key = credentialRef.current.value();
            const result = await apiPost("dispositions",_value);
            setLoading(false);
            setModalCredential(false);
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
            setModalCredential(false);
            setLoading(false)
            myError(error,navigation);
        }
    }

    const onDownloadIncoming = async (_id) => {
        let url = BASE_API + "incoming-mails/download/attachment-main/" + _id;
        getDownloadFile(url, setLoading)
    }

    return (
        <KeyboardAvoidingView style={{ flex: 1, backgroundColor: whiteColor }} behavior="position" keyboardVerticalOffset={keyboardVerticalOffset}>
            <MyLoading loading={loading}/>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
                <DispositionCreateForm
                    onDraft={value => onSubmit(0, value)}
                    onSave={value => onSubmit(1, value)}
                    onDownloadIncoming={onDownloadIncoming}
                    isRefresh={isRefresh}
                    setIsRefresh={setIsRefresh}
                    incomingMailId={incoming_mail_id}
                    dispoType={type}
                />
            </ScrollView>
            <Overlay isVisible={modalCredential} onBackdropPress={() => {
                setModalCredential(false)
            }}>
                <View style={{width:fullwidth - 100,padding:5, marginTop:10}}>
                    <MyInputOutlined
                        ref={credentialRef}
                        placeholder="Masukan kunci kredensial"
                        label="Kunci Kredensial"  
                        onSubmitEditing={onSubmitWithCredential}
                    />
                    <MyButton
                        onPress={onSubmitWithCredential}
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


export default DispositionCreate;