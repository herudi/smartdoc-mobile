import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import MyLetterIcon from "../../../../../../components/MyLetterIcon";
import { successColor, whiteColor, dangerColor, primaryColor, defaultGrayColor } from "../../../../../../services/constant";
import MySimpleButton, { MySimpleButtonView } from "../../../../../../components/MySimpleButton";
import { Col, Grid } from "react-native-easy-grid";
import { getColorStatusDispo, getNameStatusDispo, myError, getDownloadFile } from "../../../../../../utils/MyUtil";
import MyLoadingCenter from "../../../../../../components/MyLoadingCenter";
import { apiGet, BASE_API } from "../../../../../../services/api";
import Collapsible from "react-native-collapsible";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import { TouchableOpacity } from "react-native-gesture-handler";

function ItemDispositionExpandFirst({
    item
}) {
    const [loadingDownload, setLoadingDownload] = useState(false);

    const onDownloadFileFollowUp = (_id) => {
        let url = BASE_API + "dispositions/download/attachment-follow/" + _id;
        getDownloadFile(url, setLoadingDownload);
    }
    return (
        <View style={{ flexDirection: "column" }}>
            <View activeOpacity={0.5} style={styles.cardChild}>
                <View style={{ flex: 1, flexDirection: 'column' }}>
                    <Text numberOfLines={2} style={styles.title}>{item.structure_name}</Text>
                    <Text numberOfLines={2} style={styles.subtitle}>{item.employee_name} ~ {item.class_disposition_name}</Text>
                    <View style={{ flexDirection: "row" }}>
                        <Text numberOfLines={1} style={styles.subtitle}>Tindak Lanjut : </Text>
                        {
                            item.follow_up !== null ?
                                <Text numberOfLines={1} style={[styles.subtitle, { color: successColor }]}>Selesai</Text> :
                                <Text numberOfLines={1} style={[styles.subtitle, { color: dangerColor }]}>Belum Selesai</Text>
                        }
                    </View>
                    <View style={{ flexDirection: "row" }}>
                        <Text numberOfLines={1} style={styles.subtitle}>Dilihat : </Text>
                        <Text numberOfLines={1} style={[styles.subtitle, { color: item.is_read ? successColor : dangerColor }]}>{item.is_read ? 'Sudah' : 'Belum'}</Text>
                    </View>
                </View>
                {
                    item.follow_up !== null ?
                        <SimpleLineIcons size={18} color={successColor} name="user-following" /> :
                        <SimpleLineIcons size={18} color={dangerColor} name="user-unfollow" />
                }

            </View>
            {
                item.follow_up !== null ?
                    <View style={{ flexDirection: "column", padding: 7, marginLeft: 9 }}>
                        <View style={{ marginBottom: 7 }}>
                            <Text>Keterangan</Text>
                            <Text style={{ color: "gray" }}>{item.follow_up.description}</Text>
                        </View>
                        {
                            item.follow_up.path_to_file !== null ?
                                <TouchableOpacity onPress={() => onDownloadFileFollowUp(item.follow_up.id)} style={{ marginBottom: 7 }}>
                                    <Text>Dokumen</Text>
                                    <View style={{ flexDirection: "row" }}>
                                        {
                                            loadingDownload ? <MyLoadingCenter align="flex-start" just="flex-start" size="small" /> :
                                                <SimpleLineIcons size={18} color="gray" name="cloud-download" />
                                        }
                                        <Text style={{ color: "gray", marginLeft: 7 }}>Download</Text>
                                    </View>
                                </TouchableOpacity>
                                : null
                        }

                    </View> : null
            }
            <View style={{ marginBottom: 10 }}>

            </View>
        </View>

    )
}


function ItemDisposition({
    onDelete,
    itemData,
    onEdit,
    onTrackingRedispo
}) {
    const [assigns, setAssigns] = useState([]);
    const [showButtonTracking, setShowButtonTracking] = useState(false);
    const [collapsed, setCollapsed] = useState(true);
    const [loading, setLoading] = useState(false);

    const onCollapsed = async (progress) => {
        if (collapsed) {
            try {
                setLoading(true);
                const result = await apiGet("dispositions/" + itemData.id);
                let _data = result.data;
                let _assigns = _data.assigns ? _data.assigns : [];
                let _dataAssigns = _assigns.map(item => ({
                    id: item.id,
                    is_read: item.is_read === 1 ? true : false,
                    follow_up: item.follow_up,
                    structure_name: item.structure ? item.structure.name : "",
                    employee_name: item.employee ? item.employee.name : "",
                    class_disposition_name: item.class_disposition ? item.class_disposition.name : "",
                }));
                setAssigns(_dataAssigns);
                setCollapsed(!collapsed);
                if (_data.available_redisposition) {
                    setShowButtonTracking(true);
                }
                setLoading(false);
            } catch (error) {
                setLoading(false);
                myError(error);
            }
        } else {
            setCollapsed(!collapsed);
        }
    }

    const getFunction = (param) => {
        if (itemData.permission) {
            if (itemData.permission.includes(param)) {
                return true;
            }
        }
        return false;
    }

    return (
        <View style={styles.card}>
            <MyLetterIcon style={{ marginRight: 10 }} size={24} text={itemData.subject_disposition.charAt(0)} />
            <View style={{ flex: 1, flexDirection: 'column' }}>
                <Text numberOfLines={1} style={styles.title}>{itemData.subject_disposition}</Text>
                <Text numberOfLines={1} style={styles.subtitle}>No. {itemData.number_disposition}</Text>
                <Text numberOfLines={1} style={styles.subtitle}>Dari {itemData.from_employee} ~ {itemData.disposition_date}</Text>
                <View style={{ flexDirection: "row" }}>
                    <Text numberOfLines={1} style={styles.subtitle}>Status : </Text>
                    <Text numberOfLines={1} style={{ color: getColorStatusDispo(itemData.status) }}>{itemData.is_redisposition ? "Re - Disposisi" : getNameStatusDispo(itemData.status)}</Text>
                </View>
                <Grid style={{ marginTop: 10 }}>
                    <Col size={16}>
                        {
                            loading ? <MyLoadingCenter size="small" /> :
                                <MySimpleButton
                                    title=""
                                    marginIcon={0}
                                    color={primaryColor}
                                    iconName={collapsed ? "arrow-down" : "arrow-up"}
                                    onPress={() => onCollapsed(itemData.progress)}
                                />
                        }

                    </Col>
                    <Col size={3}></Col>
                    {
                        !(getFunction("U") && itemData.status_code === 0) ?
                            <Col size={39}>
                                <MySimpleButtonView
                                    title="Edit"
                                    color={defaultGrayColor}
                                    iconName="note"
                                />
                            </Col> : <Col size={39}>
                                <MySimpleButton
                                    title="Edit"
                                    color={successColor}
                                    iconName="note"
                                    onPress={onEdit}
                                />
                            </Col>
                    }
                    <Col size={3}></Col>
                    {
                        !(getFunction("D") && itemData.status_code === 0) ?
                            <Col size={39}>
                                <MySimpleButtonView
                                    title="Hapus"
                                    color={defaultGrayColor}
                                    iconName="close"
                                />
                            </Col> : <Col size={39}>
                                <MySimpleButton
                                    title="Hapus"
                                    color={dangerColor}
                                    iconName="close"
                                    onPress={onDelete}
                                />
                            </Col>
                    }

                </Grid>
                <Collapsible style={{ marginTop: 7 }} collapsed={collapsed}>
                    {showButtonTracking && (
                        <View style={{ marginTop: 5, marginBottom: 5 }}>
                            <MySimpleButton
                                title="Tracking Re - Disposisi"
                                color={successColor}
                                iconName="compass"
                                onPress={() => onTrackingRedispo(itemData.id)}
                            />
                        </View>
                    )}
                    {
                        assigns.map((item, x) => {
                            return (
                                <ItemDispositionExpandFirst
                                    key={x}
                                    item={item}
                                />
                            )
                        })
                    }
                </Collapsible>
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: whiteColor,
        margin: 7,
        borderRadius: 10,
        padding: 10,
        flex: 1,
        flexDirection: 'row',
        elevation: 2,
        alignItems: 'flex-start'
    },
    cardChild: {
        paddingTop: 3,
        // flex:1,
        backgroundColor: whiteColor,
        flexDirection: 'row',
        alignItems: 'center'
    },
    title: {
        // fontWeight:"bold",
        // color: '#616161',
    },
    subtitle: {
        color: 'gray',
    }
});

export default ItemDisposition;