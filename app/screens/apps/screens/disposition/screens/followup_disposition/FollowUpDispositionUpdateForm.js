import React, { useState, useRef, useEffect } from "react";
import { View, Text, Alert } from "react-native";
import MySeparator from "../../../../../../components/MySeparator";
import { whiteColor, successColor, primaryColor } from "../../../../../../services/constant";
import MyPanelPress from "../../../../../../components/MyPanelPress";
import MySimpleButton from "../../../../../../components/MySimpleButton";
import AntDesign from "react-native-vector-icons/AntDesign";
import ItemAssignFollowUp from "./ItemAssignFollowUp";
import MyPanel from "../../../../../../components/MyPanel";
import MyInputOutlined from "../../../../../../components/MyInputOutlined";
import DocumentPicker from "react-native-document-picker";
import RNFetchBlob from "rn-fetch-blob";
import MyButton from "../../../../../../components/MyButton";
import { Picker } from "@react-native-community/picker";

const statusData = [
    {
        id: 1,
        name: 'Dalam Proses'
    },
    {
        id: 2,
        name: 'Selesai'
    }
];

function InfoText({
    title,
    content
}) {
    return (
        content ?
            <View style={{
                flexDirection: 'column'
            }}>
                <View>
                    <Text style={{ fontSize: 14 }}>{title}</Text>
                </View>
                <View >
                    <Text style={{ color: "gray" }}>{content}</Text>
                </View>
                <View style={{ marginBottom: 10, marginTop: 10 }}>
                    <MySeparator />
                </View>
            </View> : null
    )
}
const FollowUpDispositionUpdateForm = ({
    itemData,
    onDownloadIncoming,
    onDownloadFollowUp,
    onFollowUp,
    onDownloadDisposition
}) => {
    const [file, setFile] = useState(false);
    const [progress, setProgress] = useState("");
    const descRef = useRef("");

    useEffect(() => {
        if (itemData) {
            const item_follow = itemData.item_follow;
            if (item_follow) {
                descRef.current.setValue(item_follow.description);
                setProgress(item_follow.progress.progress_code);
            }

        }
    }, [itemData]);

    const onUpload = async () => {
        const res = await DocumentPicker.pick({
            type: [DocumentPicker.types.pdf]
        });
        let fetchStat = await RNFetchBlob.fs.stat(res.uri);
        let _file = { uri: "file://" + fetchStat.path, type: res.type, name: res.name };
        setFile(_file);
    }

    return (
        <View style={{ flex: 1, backgroundColor: whiteColor }}>
            {
                itemData && (
                    <>
                        <MyPanelPress
                            title="Detail Surat Masuk"
                        >
                            <InfoText
                                title="Perihal"
                                content={itemData.incoming_mail.subject_letter}
                            />
                            <InfoText
                                title="Nomor"
                                content={itemData.incoming_mail.number_letter}
                            />
                            <InfoText
                                title="Tanggal Surat"
                                content={itemData.incoming_mail.letter_date}
                            />
                            <InfoText
                                title="Tanggal Retensi"
                                content={itemData.incoming_mail.retension_date}
                            />
                            <InfoText
                                title="Tanggal Diterima"
                                content={itemData.incoming_mail.recieved_date}
                            />
                            <InfoText
                                title="Pengirim"
                                content={itemData.incoming_mail.sender_name}
                            />
                            <InfoText
                                title="Penerima"
                                content={itemData.incoming_mail.receiver_name}
                            />
                            <InfoText
                                title="Kepada Pegawai"
                                content={itemData.incoming_mail.to_employee.name}
                            />
                            <InfoText
                                title="Divisi"
                                content={itemData.incoming_mail.structure.name}
                            />
                            <InfoText
                                title="Jenis Surat"
                                content={itemData.incoming_mail.type.name}
                            />
                            <InfoText
                                title="Klasifikasi"
                                content={itemData.incoming_mail.classification.name}
                            />
                            <MySimpleButton
                                onPress={() => onDownloadIncoming(itemData.incoming_mail.id)}
                                title="Download Surat Masuk"
                                color={successColor}
                                iconName="cloud-download"
                                padding={10}
                                fontSize={16}
                            />
                        </MyPanelPress>
                        <MyPanelPress
                            title="Detail Disposisi"
                        >
                            <InfoText
                                title="Perihal Disposisi"
                                content={itemData.subject_disposition}
                            />
                            <InfoText
                                title="Nomor Disposisi"
                                content={itemData.number_disposition}
                            />
                            <InfoText
                                title="Tanggal Disposisi"
                                content={itemData.disposition_date}
                            />
                            <InfoText
                                title="Dari Pegawai"
                                content={itemData.employee.name}
                            />
                            <InfoText
                                title="Deskripsi"
                                content={itemData.description}
                            />
                            <MySimpleButton
                                onPress={() => onDownloadDisposition(itemData.id)}
                                title="Download Disposisi"
                                color={successColor}
                                iconName="cloud-download"
                                padding={10}
                                fontSize={16}
                            />
                        </MyPanelPress>
                        <MyPanelPress
                            title="Menugaskan Kepada"
                        >
                            <View>
                                {
                                    itemData.assigns.map((item, x) => {
                                        return (
                                            <ItemAssignFollowUp
                                                key={x}
                                                employee_name={item.employee_name}
                                                structure_name={item.structure_name}
                                                class_name={item.class_name}
                                            />
                                        )
                                    })
                                }
                            </View>
                        </MyPanelPress>
                        <MyPanel title="File Tindak Lanjut">
                            <MySimpleButton
                                onPress={() => onDownloadFollowUp(itemData.incoming_mail.id)}
                                title="Download Tindak Lanjut"
                                color={successColor}
                                iconName="cloud-download"
                                padding={10}
                                fontSize={16}
                            />
                        </MyPanel>
                        {
                            itemData.item_follow && (
                                <>
                                    <MyPanel title="Form Tindak Lanjut">
                                        <View style={{ marginBottom: 20 }}>
                                            <MySimpleButton
                                                title="Upload File (Optional)"
                                                color={successColor}
                                                iconName="cloud-upload"
                                                padding={10}
                                                fontSize={16}
                                                onPress={onUpload}
                                            />
                                            {
                                                file ? <Text style={{ marginTop: 10 }}>Filename : {file.name}</Text> : null
                                            }
                                        </View>
                                        <MyInputOutlined
                                            multiline={true}
                                            ref={descRef}
                                            name="description"
                                            placeholder="Silahkan isi deskripsi"
                                            label="Deskripsi"
                                        />
                                        <Picker
                                            style={{
                                                borderColor: 'gray'
                                            }}
                                            mode="dropdown"
                                            selectedValue={progress}
                                            onValueChange={(itemValue, itemIndex) => {
                                                setProgress(itemValue);
                                            }}>
                                            <Picker.Item label="Progress Tindak Lanjut" value={0} />
                                            {
                                                statusData.map((item, x) => {
                                                    return (
                                                        <Picker.Item key={x} label={item.name} value={item.id} />
                                                    )
                                                })
                                            }
                                        </Picker>
                                    </MyPanel>
                                    <View style={{ padding: 16 }}>
                                        <MyButton
                                            onPress={() => {
                                                if (descRef.current.value() === "") {
                                                    Alert.alert("Error", "Deskripsi tidak boleh kosong")
                                                }else if (progress === 0){
                                                    Alert.alert("Error", "Progress tidak boleh kosong")
                                                } else {
                                                    onFollowUp({
                                                        file,
                                                        description: descRef.current.value(),
                                                        progress: progress
                                                    })
                                                }
                                            }}
                                            title="Simpan"
                                            color={primaryColor}
                                            icon={
                                                <AntDesign
                                                    name="check"
                                                    size={18}
                                                    color="white"
                                                    style={{ marginRight: 10 }}
                                                />
                                            }
                                        />
                                    </View>
                                </>
                            )
                        }

                    </>
                )
            }
        </View>
    )
}

export default FollowUpDispositionUpdateForm;