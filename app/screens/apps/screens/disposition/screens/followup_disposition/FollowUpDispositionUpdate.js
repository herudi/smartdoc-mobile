import React, { useState, useEffect } from "react";
import { View, ScrollView, Alert } from "react-native";
import MyLoading from "../../../../../../components/MyLoading";
import { myError, getDownloadFile } from "../../../../../../utils/MyUtil";
import { apiGet, BASE_API, apiPostFormDataMobile } from "../../../../../../services/api";
import FollowUpDispositionUpdateForm from "./FollowUpDispositionUpdateForm";

const FollowUpDispositionUpdate = ({ navigation, route }) => {
    const [loading, setLoading] = useState(false);
    const [itemData, setItemData] = useState(null);
    const { id } = route.params;

    useEffect(() => {
        init();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const init = async () => {
        try {
            setLoading(true);
            const resultFollow = await apiGet("dispositions-follow/" + id);
            const result = await apiGet("dispositions-follow/detail/" + id);
            let _data = result.data;
            let _assigns = [];
            _data.assigns = _data.assigns ? _data.assigns : [];
            for (let i = 0; i < _data.assigns.length; i++) {
                let obj = _data.assigns[i];
                _assigns.push({
                    id: obj.id.toString(),
                    structure_id: obj.structure.id,
                    structure_name: obj.structure.name,
                    employee_id: obj.employee.id,
                    employee_name: obj.employee.name,
                    classification_disposition_id: obj.class_disposition.id,
                    class_name: obj.class_disposition.name
                })
            }
            _data.assigns = _assigns;
            _data.item_follow = resultFollow.data;
            const _resultIncomingInfo = await apiGet("incoming-mails/" + _data.incoming_mail.id);
            let _dataIncoming = _resultIncomingInfo.data;
            _dataIncoming.type_name = _dataIncoming.type ? _dataIncoming.type.name : "";
            _dataIncoming.classification_name = _dataIncoming.classification ? _dataIncoming.classification.name : "";
            _dataIncoming.structure_name = _dataIncoming.structure ? _dataIncoming.structure.name : "";
            _dataIncoming.employee_name = _dataIncoming.to_employee ? _dataIncoming.to_employee.name : "";
            _dataIncoming.attachments = _dataIncoming.attachments ? _dataIncoming.attachments : [];
            _data.incoming_mail = _dataIncoming;
            setItemData(_data);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            myError(error, navigation);
        }
    }

    const onDownloadIncoming = async (_id) => {
        let url = BASE_API + "incoming-mails/download/attachment-main/" + _id;
        getDownloadFile(url, setLoading);
    }
    const onDownloadDisposition = async (_id) => {
        let url = BASE_API + "dispositions/download/attachment-main/" + _id;
        getDownloadFile(url, setLoading);
    }
    const onDownloadFollowUp = async (_id) => {
        let url = BASE_API + "dispositions/download/attachment-incoming/" + _id;
        getDownloadFile(url, setLoading);
    }

    const onFollowUp = async value => {
        try {
            setLoading(true);
            const result = await apiPostFormDataMobile("dispositions-follow/update/follow-up/"+id, {
                description:value.description,
                file:value.file,
                progress: value.progress
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
    return (
        <View style={{ flex: 1 }}>
            <MyLoading loading={loading} />
            <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="always">
                <FollowUpDispositionUpdateForm
                    onDownloadFollowUp={onDownloadFollowUp}
                    onDownloadIncoming={onDownloadIncoming}
                    onDownloadDisposition={onDownloadDisposition}
                    itemData={itemData}
                    onFollowUp={onFollowUp}
                />
            </ScrollView>
        </View>
    )
}

export default FollowUpDispositionUpdate;