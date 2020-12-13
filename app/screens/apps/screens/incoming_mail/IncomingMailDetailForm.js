import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text } from "react-native";
import MyPanel from "../../../../components/MyPanel";
import Entypo from "react-native-vector-icons/Entypo";
import { TouchableNativeFeedback } from "react-native-gesture-handler";
import { successColor, whiteColor, primaryColor } from "../../../../services/constant";
import MyButton from "../../../../components/MyButton";
import Feather from "react-native-vector-icons/Feather";
import MySimpleButton from "../../../../components/MySimpleButton";
import MyInputOutlined from "../../../../components/MyInputOutlined";
import DocumentPicker from "react-native-document-picker";
import RNFetchBlob from "rn-fetch-blob";
import MySeparator from "../../../../components/MySeparator";
import MyPanelPress from "../../../../components/MyPanelPress";
function InfoText({
    title,
    content
}) {
    return (
        content ? 
        <View style={{
            flex: 1,
            flexDirection: 'column'
        }}>
            <View>
                <Text style={{fontSize:14}}>{title}</Text>
            </View>
            <View >
                <Text style={{color:"gray"}}>{content}</Text>
            </View>
            <View style={{marginBottom:10,marginTop:10}}>
                <MySeparator/>
            </View>
        </View> : null
    )
}

const IncomingMailDetailForm = ({
    onDownload,
    onDownloadAtt,
    itemTea,
    onFollowUp,
    follow_up,
    isRefresh
}) => {
    const [itemData, setItemData] = useState({});
    const [file, setFile] = useState(null);
    const [description, setDescription] = useState("");
    useEffect(() => {
        setItemData(itemTea)
        console.log(itemTea)
    },[itemTea]);
    useEffect(() => {
        if (isRefresh) {
            setFile(null);
            setDescription("")
        }
    },[isRefresh]);

    const onUpload = async () => {
        const res = await DocumentPicker.pick({
            type: [DocumentPicker.types.pdf]
        });
        let fetchStat = await RNFetchBlob.fs.stat(res.uri);
        let _file = { uri:"file://"+fetchStat.path, type: res.type, name: res.name};
        setFile(_file);
    }

    const attachments = () => {
        if (itemData.attachments) {
            return (
                <MyPanelPress title="Lampiran Surat">
                    {
                        itemData.attachments.map((item,x) => {
                            return(
                                <View style={{flexDirection:"row",alignItems:"center"}} key={x}>
                                    <Text style={styles.contentText} >
                                        {(x+1)}. {item.attachment_name} 
                                    </Text>
                                    <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple(successColor, true)} style={{padding:5}} onPress={() => onDownloadAtt(item.id_attachment,item.attachment_name)}>
                                        <Entypo name="download" size={18} color={successColor}/>
                                    </TouchableNativeFeedback>
                                </View>
                            )
                        })
                    }
                </MyPanelPress>
            )
        }else{
            return null;
        }
    }
    return (
        <View style={{flex:1,backgroundColor:whiteColor}}>
            <MyPanelPress 
                title="Detail Surat"
            >
                <InfoText
                    title="Perihal"
                    content={itemData.subject_letter}
                />
                <InfoText
                    title="Nomor Surat"
                    content={itemData.number_letter}
                />
                <InfoText
                    title="Tanggal Surat"
                    content={itemData.letter_date}
                />
                <InfoText
                    title="Tanggal Retensi"
                    content={itemData.retension_date}
                />
                <InfoText
                    title="Tanggal Diterima"
                    content={itemData.recieved_date}
                />
                <InfoText
                    title="Pengirim"
                    content={itemData.sender_name}
                />
                <InfoText
                    title="Penerima"
                    content={itemData.receiver_name}
                />
                <InfoText
                    title="Kepada Pegawai"
                    content={itemData.to_employee}
                />
                <InfoText
                    title="Divisi"
                    content={itemData.structure_name}
                />
                <InfoText
                    title="Jenis Surat"
                    content={itemData.type_name}
                />
                <InfoText
                    title="Klasifikasi"
                    content={itemData.classification_name}
                />
                <InfoText
                    title="Status"
                    content={itemData.status_message}
                />
                <InfoText
                    title="Tindak Lanjut"
                    content={itemData.follow_up_available}
                />
                <InfoText
                    title="Dilihat"
                    content={itemData.is_read ? 'Sudah' : 'Belum'}
                />
                <MySimpleButton
                    btnStyle={{marginTop:20}}
                    onPress={onDownload}
                    title="View Dokumen"
                    color={successColor}
                    iconName="eye"
                    padding={10}
                    fontSize={16}
                />
            </MyPanelPress>
            {attachments()}
            {
                follow_up ? 
                <>
                    <MyPanel title="Form Tindak Lanjut">
                        <View style={{marginBottom:20}}>
                            <MySimpleButton
                                title="Upload File (Optional)"
                                color={successColor}
                                iconName="cloud-upload"
                                padding={10}
                                fontSize={16}
                                onPress={onUpload}
                            />
                            {
                                file ? <Text style={{marginTop:10}}>Filename : {file.name}</Text> : null
                            }
                        </View>
                        <MyInputOutlined
                            multiline={true}
                            value={description}
                            name="description"
                            placeholder="Silahkan isi deskripsi"
                            label="Deskripsi"  
                            onChangeText={value => setDescription(value)} 
                        />
                    </MyPanel>
                    <View style={{padding:16}}>
                        <MyButton
                            onPress={() => onFollowUp({file,description})}
                            title="Kirim"
                            color={primaryColor}
                            icon={
                                <Feather 
                                    name="send" 
                                    size={18} 
                                    color="white" 
                                    style={{marginRight:10}}
                                />
                            }
                        />
                    </View>
                </> : null
            }
            
        </View>
    )
}

const styles = StyleSheet.create({
    contentText: {
        color: '#444444',
    },
    contentTextQuote: {
        color: '#444444',
        fontStyle:"italic"
    },
})

export default IncomingMailDetailForm;