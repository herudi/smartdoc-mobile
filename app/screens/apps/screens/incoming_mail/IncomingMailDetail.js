import React, { useEffect, useState, useLayoutEffect } from "react";
import { View, Alert, KeyboardAvoidingView } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { apiGet, BASE_API, apiPostFormDataMobile } from "../../../../services/api";
import { myError, getDownloadFile, keyboardVerticalOffset } from "../../../../utils/MyUtil";
import MyButtonMenuRight from "../../../../components/MyButtonMenuRight";
import IncomingMailDetailForm from "./IncomingMailDetailForm";
import MyLoadingCenter from "../../../../components/MyLoadingCenter";
import MyLoading from "../../../../components/MyLoading";
import { whiteColor } from "../../../../services/constant";

const IncomingMailDetail = ({ navigation, route }) => {
    const { id,follow_up,status_message } = route.params;
    const [loading, setLoading] = useState(false);
    const [loadingInit, setLoadingInit] = useState(false);
    const [isRefresh, setIsRefresh] = useState(false);
    const [itemData, setItemData] = useState({});
    
    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <View style={{marginRight:10,flex:1,flexDirection:"row",alignItems:"center"}}>
                    <MyButtonMenuRight iconName="retweet" onPress={() => {
                        setIsRefresh(true);
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
            setLoadingInit(true);
            const _result = await apiGet("incoming-mails/" + id);
            const _data = _result.data;
            let _item = {
                ..._data,
                to_employee: _data.to_employee ? _data.to_employee.name : "",
                type_name: _data.type.name,
                structure_name: _data.structure ? _data.structure.name : "",
                classification_name: _data.classification.name,
                status_message:status_message,
                follow_up_available:follow_up ? "Tersedia" : "Tidak Ada",
            };
            setItemData(_item);
            setLoadingInit(false);
        } catch (error) {
            setLoadingInit(false);
            myError(error, navigation);
        }
    }

    const onDownloadAtt = async (_id, _name) => {
        let url = BASE_API + "incoming-mails/download/attachment/" + _id;
        getDownloadFile(url, setLoading)
    }
    const onDownload = async () => {
        let url = BASE_API + "incoming-mails/download/attachment-main/" + id;
        getDownloadFile(url, setLoading)
    }

    const onFollowUp = async (value) => {
        if (value.description === "") {
            Alert.alert("Error","Deskripsi tidak boleh kosong");
        }else{
            try {
                setLoading(true);
                const result = await apiPostFormDataMobile("incoming-mails/update/follow-up/"+id, {
                    description:value.description,
                    file:value.file
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

    return (
        loadingInit ? <MyLoadingCenter/> : 
        <KeyboardAvoidingView style={{ flex: 1, backgroundColor: whiteColor }} behavior="position" keyboardVerticalOffset={keyboardVerticalOffset}>
            <MyLoading loading={loading}/>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="always">
                <IncomingMailDetailForm
                    itemTea={itemData}
                    onDownloadAtt={onDownloadAtt}
                    onDownload={onDownload}
                    onFollowUp={onFollowUp}
                    isRefresh={isRefresh}
                    follow_up={follow_up}
                />
            </ScrollView>
        </KeyboardAvoidingView>
    )

}

export default IncomingMailDetail;