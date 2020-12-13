import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, Modal } from "react-native";
import MyPanel from "../../../../components/MyPanel";
import { WebView } from 'react-native-webview';
import DocumentPicker from 'react-native-document-picker';
import Entypo from "react-native-vector-icons/Entypo";
import { TouchableNativeFeedback } from "react-native-gesture-handler";
import { successColor, dangerColor, whiteColor, primaryColor } from "../../../../services/constant";
import MySeparator from "../../../../components/MySeparator";
import MyInputOutlined from "../../../../components/MyInputOutlined";
import MyButton from "../../../../components/MyButton";
import AntDesign from "react-native-vector-icons/AntDesign";
import RNFetchBlob from "rn-fetch-blob";
import { Col, Grid } from "react-native-easy-grid";
import MySimpleButton from "../../../../components/MySimpleButton";
import MyPanelPress from "../../../../components/MyPanelPress";
import ItemAssignOutgoing from "../../../../components/ItemAssignOutgoing";

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

function InfoTextBlcokquote({
    title,
    content
}) {
    return (
        <View style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between'
        }}>
            <View style={{ width: "25%" }}>
                <Text style={styles.contentTextQuote}>{title}</Text>
            </View>
            <View style={{ width: "5%" }}>
                <Text style={styles.contentTextQuote}>: </Text>
            </View>
            <View style={{ width: "70%" }}>
                <Text style={styles.contentTextQuote}>{content ? content : ""}</Text>
            </View>
        </View>
    )
}

function DownloadHistory({
    onPress,
    status
}) {
    return (
        <View style={{
            position: "absolute",
            right: 0,
            top: 0
        }}>
            {
                status ? <TouchableNativeFeedback style={{ padding: 10, borderRadius: 100, backgroundColor: "#e2e1e1" }} background={TouchableNativeFeedback.Ripple(successColor, true)} onPress={onPress}>
                    <Entypo name="download" size={14} color={successColor} />
                </TouchableNativeFeedback> :
                    <View style={{ padding: 10, borderRadius: 100, backgroundColor: "#f9f9f9" }}>
                        <Entypo name="download" size={14} color="#d0cdcd" />
                    </View>
            }

        </View>
    )
}

const ApprovalForm = ({
    itemApproval,
    onDownloadAtt,
    onDownload,
    onDownloadAttHistory,
    onApprove,
    onReject,
    isRefresh
}) => {
    const [file, setFile] = useState(null);
    const [description, setDescription] = useState("");
    const [modalContent, setModalContent] = useState(false);

    useEffect(() => {
        if (isRefresh) {
            setFile(null);
            setDescription("");
        }
    }, [isRefresh]);

    const onUpload = async () => {
        const res = await DocumentPicker.pick({
            type: [DocumentPicker.types.pdf]
        });
        let fetchStat = await RNFetchBlob.fs.stat(res.uri);
        let _file = { uri: "file://" + fetchStat.path, type: res.type, name: res.name };
        setFile(_file);
    }

    const forwards = () => {
        if (itemApproval.forwards) {
            return (
                <MyPanel title="Tembusan Surat">
                    {
                        itemApproval.forwards.map((item, x) => {
                            return (
                                <Text style={styles.contentText} key={x}>
                                    {(x + 1)}. {item.employee_name}
                                </Text>
                            )
                        })
                    }
                </MyPanel>
            )
        } else {
            return null;
        }
    }
    const historyApproval = () => {
        if (itemApproval.history_approvals) {
            return (
                <MyPanelPress title="History Approval">
                    {
                        itemApproval.history_approvals.map((item, x) => {
                            return (
                                <View key={x} style={{ flexDirection: "column" }}>
                                    <InfoTextBlcokquote
                                        title="Tanggal"
                                        content={item.create_at}
                                    />
                                    <InfoTextBlcokquote
                                        title="Pegawai"
                                        content={item.employee ? item.employee.name : ""}
                                    />
                                    <InfoTextBlcokquote
                                        title="Divisi"
                                        content={item.structure_name}
                                    />
                                    <InfoTextBlcokquote
                                        title="Deskripsi"
                                        content={item.notes}
                                    />
                                    <InfoTextBlcokquote
                                        title="Status"
                                        content={item.status.status_name}
                                    />
                                    <DownloadHistory status={item.attachment} onPress={() => onDownloadAttHistory(item.id)} />
                                    <View style={{ paddingTop: 10, paddingBottom: 10 }}>
                                        <MySeparator />
                                    </View>
                                </View>
                            )
                        })
                    }
                </MyPanelPress>
            )
        } else {
            return null;
        }
    }
    const attachments = () => {
        if (itemApproval.attachments) {
            return (
                <MyPanel title="Lampiran Surat">
                    {
                        itemApproval.attachments.map((item, x) => {
                            return (
                                <View style={{ flexDirection: "row", alignItems: "center" }} key={x}>
                                    <Text style={styles.contentText} >
                                        {(x + 1)}. {item.attachment_name}
                                    </Text>
                                    <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple(successColor, true)} style={{ padding: 5 }} onPress={() => onDownloadAtt(item.id_attachment, item.attachment_name)}>
                                        <Entypo name="download" size={18} color={successColor} />
                                    </TouchableNativeFeedback>
                                </View>
                            )
                        })
                    }
                </MyPanel>
            )
        } else {
            return null;
        }
    }
    return (
        itemApproval.is_ok ?
            <View style={{ flex: 1, backgroundColor: whiteColor }}>
                <MyPanel
                    title="Penggalan Surat"
                >
                    <InfoText
                        title="Perihal"
                        content={itemApproval.subject_letter}
                    />
                    <InfoText
                        title="Tanggal Surat"
                        content={itemApproval.letter_date}
                    />
                    <InfoText
                        title="Tanggal Retensi"
                        content={itemApproval.retension_date}
                    />
                    <InfoText
                        title="Dari"
                        content={itemApproval.from}
                    />
                    <InfoText
                        title="Kepada"
                        content={itemApproval.to}
                    />
                    <InfoText
                        title="Jenis Surat"
                        content={itemApproval.type_name}
                    />
                    <InfoText
                        title="Klasifikasi"
                        content={itemApproval.classification_name}
                    />
                    <MySimpleButton
                        btnStyle={{ marginTop: 20 }}
                        onPress={onDownload}
                        title="View Dokumen"
                        color={successColor}
                        iconName="eye"
                        padding={10}
                        fontSize={16}
                    />
                </MyPanel>
                {
                    itemApproval.assigns !== null && 
                    <MyPanel title="Menugaskan Kepada">
                        <View style={{ marginBottom: 16 }}>
                            {
                                itemApproval.assigns.map((item, x) => {
                                    return (
                                        <ItemAssignOutgoing
                                            key={x}
                                            employee_name={item.employee.name}
                                            structure_name={item.structure.name}
                                        />
                                    )
                                })
                            }
                        </View>
                    </MyPanel>
                }
                <MyPanel title="Isi Surat">
                    <MySimpleButton
                        onPress={() => {
                            setModalContent(true)
                        }}
                        title="Lihat isi surat"
                        color={successColor}
                        iconName="eye"
                        padding={10}
                        fontSize={16}
                    />
                </MyPanel>
                {forwards()}
                {attachments()}
                {historyApproval()}
                <MyPanel title="Tindak Lanjut Approval">
                    <View>
                        <MySimpleButton
                            onPress={onUpload}
                            title="Upload File (Optional)"
                            color={successColor}
                            iconName="cloud-upload"
                            padding={10}
                            fontSize={16}
                        />
                        {
                            file ? <Text style={{ marginTop: 10 }}>Filename : {file.name}</Text> : null
                        }
                    </View>
                    <View style={{ marginBottom: 20 }}></View>
                    <MyInputOutlined
                        multiline={true}
                        value={description}
                        name="description"
                        placeholder="Silahkan isi deskripsi approval"
                        label="Deskripsi"
                        onChangeText={value => setDescription(value)}
                    />
                </MyPanel>
                <View style={{ flexDirection: "row", justifyContent: "center", padding: 16 }}>
                    <Grid>
                        <Col size={48}>
                            <MyButton
                                onPress={() => onReject({ file, description })}
                                title="Reject"
                                color={dangerColor}
                                icon={
                                    <AntDesign
                                        name="closecircleo"
                                        size={18}
                                        color="white"
                                        style={{ marginRight: 10 }}
                                    />
                                }
                            />
                        </Col>
                        <Col size={4}>

                        </Col>
                        <Col size={48}>
                            <MyButton
                                onPress={() => onApprove({ file, description })}
                                title="Approve"
                                color={primaryColor}
                                icon={
                                    <AntDesign
                                        name="checkcircleo"
                                        size={18}
                                        color="white"
                                        style={{ marginRight: 10 }}
                                    />
                                }
                            />
                        </Col>
                    </Grid>
                </View>
                <Modal
                    animationType="slide"
                    visible={modalContent}
                    onRequestClose={() => {
                        setModalContent(false)
                    }}
                >
                    <WebView
                        javaScriptEnabled={true}
                        domStorageEnabled={true}
                        startInLoadingState={true}
                        source={{
                            html: `
                    <!DOCTYPE html>
                    <html>
                    <head>
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    </head>
                    <body style="word-wrap: break-word;">
                        ${itemApproval.body}
                    </body>
                    </html>
                    ` }}
                    />
                </Modal>
            </View> : null
    )
}

const styles = StyleSheet.create({
    contentText: {
        color: '#444444',
    },
    contentTextQuote: {
        color: '#444444',
        fontStyle: "italic"
    },
})

export default ApprovalForm;