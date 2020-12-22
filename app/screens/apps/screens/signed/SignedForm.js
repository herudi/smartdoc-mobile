import React from "react";
import { View, StyleSheet, Text } from "react-native";
import MyPanel from "../../../../components/MyPanel";
import Entypo from "react-native-vector-icons/Entypo";
import { TouchableNativeFeedback } from "react-native-gesture-handler";
import { successColor, whiteColor, primaryColor } from "../../../../services/constant";
import MySeparator from "../../../../components/MySeparator";
import MyButton from "../../../../components/MyButton";
import AntDesign from "react-native-vector-icons/AntDesign";
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

const SignedForm = ({
    itemTea,
    onDownloadAtt,
    onDownloadAttHistory,
    onDownload,
    onSigned
}) => {
    // const [itemTea, setitemTea] = useState({});
    const forwards = () => {
        if (itemTea.forwards) {
            return (
                <MyPanel title="Tembusan Surat">
                    {
                        itemTea.forwards.map((item, x) => {
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
        if (itemTea.history_approvals) {
            return (
                <MyPanelPress title="History Approval">
                    {
                        itemTea.history_approvals.map((item, x) => {
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
        if (itemTea.attachments) {
            return (
                <MyPanel title="Lampiran Surat">
                    {
                        itemTea.attachments.map((item, x) => {
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
        itemTea.is_ok ?
            <View style={{ flex: 1, backgroundColor: whiteColor }}>
                <MyPanel
                    title="Penggalan Surat"
                >
                    <InfoText
                        title="Perihal"
                        content={itemTea.subject_letter}
                    />
                    <InfoText
                        title="Tanggal Surat"
                        content={itemTea.letter_date}
                    />
                    <InfoText
                        title="Tanggal Retensi"
                        content={itemTea.retension_date}
                    />
                    <InfoText
                        title="Dari"
                        content={itemTea.from}
                    />
                    <InfoText
                        title="Kepada"
                        content={itemTea.to}
                    />
                    <InfoText
                        title="Jenis Surat"
                        content={itemTea.type_name}
                    />
                    <InfoText
                        title="Klasifikasi"
                        content={itemTea.classification_name}
                    />
                </MyPanel>
                {
                    itemTea.assigns !== null &&
                    <MyPanel title="Menugaskan Kepada">
                        <View style={{ marginBottom: 16 }}>
                            {
                                itemTea.assigns.map((item, x) => {
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
                        onPress={onDownload}
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
                <View style={{ padding: 16 }}>
                    <MyButton
                        onPress={onSigned}
                        title="Signed"
                        color={primaryColor}
                        icon={
                            <AntDesign
                                name="key"
                                size={18}
                                color="white"
                                style={{ marginRight: 10 }}
                            />
                        }
                    />
                </View>
                
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

export default SignedForm;