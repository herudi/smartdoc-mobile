import React, { useState } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { successColor, dangerColor, whiteColor } from "../../../../../../services/constant";
import { getDownloadFile } from "../../../../../../utils/MyUtil";
import MyLoadingCenter from "../../../../../../components/MyLoadingCenter";
import { BASE_API } from "../../../../../../services/api";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import { TouchableOpacity } from "react-native-gesture-handler";

const fullWidth = Dimensions.get('window').width - 80;

function ItemAssignTracking({
    item
}) {
    const [loadingDownload, setLoadingDownload] = useState(false);

    const onDownloadFileFollowUp = (_id) => {
        let url = BASE_API + "dispositions/download/attachment-follow/" + _id;
        getDownloadFile(url, setLoadingDownload);
    }
    return (
        <View style={{ flexDirection: "column", padding: 10, backgroundColor: whiteColor, marginTop: 5 }}>
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

            </View>
            <Text style={{color: whiteColor, width:fullWidth }}></Text>
            {
                item.follow_up !== null ?
                    <View style={{ flexDirection: "column"}}>
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
                                        <Text style={{ color: "gray"}}>Download</Text>
                                    </View>
                                </TouchableOpacity>
                                : null
                        }

                    </View> : null
            }
        </View>

    )
}

const styles = StyleSheet.create({
    card: {
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

export default ItemAssignTracking;