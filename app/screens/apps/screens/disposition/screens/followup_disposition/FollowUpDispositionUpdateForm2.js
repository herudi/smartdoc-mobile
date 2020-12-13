import React, { useState, useRef, useEffect } from "react";
import { View, Text, Alert } from "react-native";
import { whiteColor, successColor, primaryColor } from "../../../../../../services/constant";
import MySimpleButton from "../../../../../../components/MySimpleButton";
import AntDesign from "react-native-vector-icons/AntDesign";
import MyPanel from "../../../../../../components/MyPanel";
import MyInputOutlined from "../../../../../../components/MyInputOutlined";
import DocumentPicker from "react-native-document-picker";
import RNFetchBlob from "rn-fetch-blob";
import MyButton from "../../../../../../components/MyButton";
import { Picker } from "@react-native-community/picker";

const statusData =[
    {
        id: 1,
        name: 'Dalam Proses'
    },
    {
        id: 2,
        name: 'Selesai'
    }
]
const FollowUpDispositionUpdateForm2 = ({
    onFollowUp,
    itemData
}) => {
    const [file, setFile] = useState(false);
    const [progress, setProgress] = useState("");
    const descRef = useRef("");

    const onUpload = async () => {
        const res = await DocumentPicker.pick({
            type: [DocumentPicker.types.pdf]
        });
        let fetchStat = await RNFetchBlob.fs.stat(res.uri);
        let _file = { uri: "file://" + fetchStat.path, type: res.type, name: res.name };
        setFile(_file);
    }

    useEffect(() => {
        if (itemData) {
            descRef.current.setValue(itemData.description);
        }
    }, [itemData]);

    return (
        <View style={{ flex: 1, backgroundColor: whiteColor }}>
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
                    <Picker.Item label="Progress Tindak Lanjut" value="" />
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
        </View>
    )
}

export default FollowUpDispositionUpdateForm2;