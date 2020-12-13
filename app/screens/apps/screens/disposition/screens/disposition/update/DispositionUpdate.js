import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import { View, Alert, Dimensions } from "react-native";
import MyLoading from "../../../../../../../components/MyLoading";
import { ScrollView } from "react-native-gesture-handler";
import { apiGet, BASE_API, apiPut } from "../../../../../../../services/api";
import { Overlay } from "react-native-elements";
import MyInputOutlined from "../../../../../../../components/MyInputOutlined";
import MyButton from "../../../../../../../components/MyButton";
import { successColor } from "../../../../../../../services/constant";
import AntDesign from "react-native-vector-icons/AntDesign";
import { myError, getDownloadFile } from "../../../../../../../utils/MyUtil";
import DispositionUpdateForm from "./DispositionUpdateForm";
import MyButtonMenuRight from "../../../../../../../components/MyButtonMenuRight";
let fullwidth = Dimensions.get("window").width;

const DispositionUpdate = ({ navigation, route }) => {
    const [loading, setLoading] = useState(false);
    const [modalCredential,setModalCredential] = useState(false);
    const [valueData,setValueData] = useState({});
    const [itemData,setItemData] = useState({});
    const { id } = route.params;

    const credentialRef = useRef("");

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

    const init = async () => {
        try {
            setLoading(true);
            const result = await apiGet("dispositions/"+id);
            let _data = result.data;
            let _assigns = [];
            _data.assigns = _data.assigns ? _data.assigns : [];
            for (let i = 0; i < _data.assigns.length; i++) {
                let obj = _data.assigns[i];
                _assigns.push({
                    id:obj.id.toString(),
                    structure_id:obj.structure.id,
                    structure_name:obj.structure.name,
                    employee_id:obj.employee.id,
                    employee_name:obj.employee.name,
                    classification_disposition_id:obj.class_disposition.id,
                    class_name:obj.class_disposition.name
                })
            }
            _data.assigns = _assigns;
            const _resultIncomingInfo = await apiGet("incoming-mails/"+_data.incoming_mail.id);
            let _dataIncoming = _resultIncomingInfo.data;
            _dataIncoming.type_name = _dataIncoming.type ? _dataIncoming.type.name : "";
            _dataIncoming.classification_name = _dataIncoming.classification ? _dataIncoming.classification.name : "";
            _dataIncoming.structure_name = _dataIncoming.structure ? _dataIncoming.structure.name : "";
            _dataIncoming.employee_name = _dataIncoming.to_employee ? _dataIncoming.to_employee.name : "";
            _dataIncoming.attachments = _dataIncoming.attachments ? _dataIncoming.attachments : [];
            _data.item_incoming = _dataIncoming;
            setItemData(_data);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            myError(error,navigation);
        }
    }
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
                                _value.is_redisposition = itemData.is_redisposition === 1 ? true : false;
                                setValueData(_value);
                                if (statusButton === 1) {
                                    const checkSignature = await apiGet("digital-signatures/check/available-signature");
                                    if (checkSignature.status) {
                                        setModalCredential(true);
                                        setLoading(false);
                                        credentialRef.current.focus();
                                    }else{
                                        const result = await apiPut("dispositions/"+id,_value);
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
                                    const result = await apiPut("dispositions/"+id,_value);
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
            const result = await apiPut("dispositions/"+id,_value);
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
        <View style={{ flex: 1 }}>
            <MyLoading loading={loading}/>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
                <DispositionUpdateForm
                    onDraft={value => onSubmit(0, value)}
                    onSave={value => onSubmit(1, value)}
                    onDownloadIncoming={onDownloadIncoming}
                    itemData={itemData}
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
        </View>
    )
}


export default DispositionUpdate;