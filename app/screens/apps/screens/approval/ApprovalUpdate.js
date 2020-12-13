import React, { useEffect, useState, useLayoutEffect } from "react";
import { View, Alert } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { apiGet, BASE_API, apiPostFormDataMobile } from "../../../../services/api";
import { myError, getDownloadFile } from "../../../../utils/MyUtil";
import ApprovalForm from "./ApprovalForm";
import MyButtonMenuRight from "../../../../components/MyButtonMenuRight";
import MyLoadingCenter from "../../../../components/MyLoadingCenter";
import MyLoading from "../../../../components/MyLoading";

const ApprovalUpdate = ({ navigation, route }) => {
    const { id } = route.params;
    const [loading, setLoading] = useState(false);
    const [loadingInit, setLoadingInit] = useState(false);
    const [itemData, setItemData] = useState({});
    const [isRefresh, setIsRefresh] = useState(false);
    
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
            // const token = await getAccessToken();
            // console.log(token);
            const _result = await apiGet("outgoing-mails-approval/" + id);
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
            setIsRefresh(false);
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

    const onDownload = () => {
        let url = BASE_API + "outgoing-mails-approval/download/review-outgoing-mail/" + id;
        getDownloadFile(url, setLoading);
    }

    const submitData = async (value,status_approval) => {
        try {
            
            let textConfirm = status_approval === 0 ? "membatalkan" : "menyetujui";
            Alert.alert(
                "Confirm",
                "Yakin anda akan "+textConfirm+" surat ini ?",
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
                                const result = await apiPostFormDataMobile("outgoing-mails-approval/"+id, {
                                    ...value,
                                    status_approval
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
                ],
                { cancelable: false }
            );
            
        } catch (error) {
            console.log(error)
        }
    }

    const onApprove = (value) => {
        submitData(value,1);
    }

    const onReject = (value) => {
        submitData(value,0);
    }

    return (
        loadingInit ? <MyLoadingCenter/> : 
        <View style={{ flex: 1 }}>
            <MyLoading loading={loading}/>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="always">
                <ApprovalForm
                    isRefresh={isRefresh}
                    itemApproval={itemData}
                    onDownloadAtt={onDownloadAtt}
                    onApprove={onApprove}
                    onReject={onReject}
                    onDownload={onDownload}
                    onDownloadAttHistory={onDownloadAttHistory}
                />
            </ScrollView>
        </View>
    )

}



export default ApprovalUpdate;