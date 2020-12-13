import React from "react";
import { View, Text, StyleSheet } from "react-native";
import MyLetterIcon from "../../../../components/MyLetterIcon";
import { whiteColor, successColor, dangerColor, infoColor, defaultGrayColor } from "../../../../services/constant";
import { getColorStatusIncomingMail, getNameStatusIncomingMail } from "../../../../utils/MyUtil";
import { Grid, Col } from "react-native-easy-grid";
import MySimpleButton, { MySimpleButtonView } from "../../../../components/MySimpleButton";

function ItemIncomingMail({
    onPress,
    onDispo,
    data
}) {
    const getFunction = (param) => {
        if (data.permission) {
            if (data.permission.includes(param)) {
                return true;
            }
        }
        return false;
    }

    const buttonDispositionActive = () => {
        if (data.bod_level && data.disposition) {
            return true;
        }
        if (data.status_code === 4 && data.disposition && getFunction("S")) {
            return true;
        }
        return false;
    }
    return (
        data ? <View style={styles.card}>
            <MyLetterIcon style={{ marginRight: 10 }} size={55} text={data.subject_letter.charAt(0)} />
            <View style={{ flex: 1, flexDirection: 'column' }}>
                <Text numberOfLines={1} style={{ fontWeight: data.is_read ? '500' : 'bold', fontSize: 16 }}>{data.subject_letter}</Text>
                <Text numberOfLines={1} style={[styles.subtitle, { fontWeight: data.is_read ? '500' : 'bold' }]}>{data.type_name} Dari {data.sender_name}</Text>
                <View style={{ flexDirection: "row" }}>
                    <Text numberOfLines={1} style={styles.small_subtitle}>Tindak Lanjut : </Text>
                    {
                        data.follow_up ?
                            <Text numberOfLines={1} style={[styles.small_subtitle, { color: successColor }]}>Tersedia</Text> :
                            <Text numberOfLines={1} style={[styles.small_subtitle, { color: dangerColor }]}>Tidak Ada</Text>
                    }

                </View>
                <Text numberOfLines={1} style={[styles.small_subtitle, { color: getColorStatusIncomingMail(data.status) }]}>{getNameStatusIncomingMail(data.status)}</Text>
                <Grid style={{ marginTop: 10 }}>
                    <Col size={40}>
                        <MySimpleButton
                            title="More Detail"
                            color={successColor}
                            iconName="note"
                            onPress={onPress}
                        />
                    </Col>
                    <Col size={5}></Col>
                    {
                    !buttonDispositionActive() ?
                        <Col size={40}>
                            <MySimpleButtonView
                                title="Disposisi"
                                color={defaultGrayColor}
                                iconName="cursor"
                            />
                        </Col> : <Col size={40}>
                            <MySimpleButton
                                title="Disposisi"
                                color={infoColor}
                                iconName="cursor"
                                onPress={() => onDispo(data.id)}
                            />
                        </Col>
                    }
                </Grid>
            </View>
        </View> : null
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
    subtitle: {
        color: 'gray',
    },
    small_subtitle: {
        color: 'gray',
        fontSize: 12
    }
});

export default ItemIncomingMail;