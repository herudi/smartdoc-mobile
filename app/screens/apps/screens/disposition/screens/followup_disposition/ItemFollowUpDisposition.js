import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { whiteColor, successColor, defaultGrayColor, infoColor } from "../../../../../../services/constant";
import MyLetterIcon from "../../../../../../components/MyLetterIcon";
import { Grid, Col } from "react-native-easy-grid";
import MySimpleButton, { MySimpleButtonView } from "../../../../../../components/MySimpleButton";

function ItemFollowUpDisposition({
    onPress,
    onDispo,
    data
}) {
    return (
        data ?
            // <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple(defaultRippleColor,false)} onPress={onPress} style={styles.card}>
            <View style={styles.card}>
                <MyLetterIcon style={{ marginRight: 10 }} size={55} text={data.subject_disposition.charAt(0)} />
                <View style={{ flex: 1, flexDirection: 'column' }}>
                    <Text numberOfLines={1} style={styles.title}>{data.subject_disposition}</Text>
                    <Text numberOfLines={1} style={styles.subtitle}>No. {data.number_disposition}</Text>
                    <Text numberOfLines={1} style={styles.subtitle}>Dari {data.from_employee_name} ~ {data.disposition_date}</Text>
                    <Grid style={{ marginTop: 10 }}>
                        {
                            data.finish_follow ?
                                <Col size={40}>
                                    <MySimpleButtonView
                                        title="Tindak Lanjut"
                                        color={defaultGrayColor}
                                        iconName="note"
                                    />
                                </Col> : <Col size={40}>
                                    <MySimpleButton
                                        title="Tindak Lanjut"
                                        color={successColor}
                                        iconName="note"
                                        onPress={() => onPress(data.id, data.finish_follow)}
                                    />
                                </Col>
                        }
                        <Col size={5}></Col>
                        {
                            !(data.open_redispo) ?
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
                                        onPress={() => onDispo(data.incoming_mail.id, data.id)}
                                    />
                                </Col>
                        }
                    </Grid>
                </View>
                {/* <SimpleLineIcons size={18} color={data.finish_follow ? 'green' : 'red'} name="arrow-right"/> */}
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
    title: {
        // fontWeight:"bold",
        // color: '#616161',
    },
    subtitle: {
        color: 'gray',
    },
    small_subtitle: {
        color: 'gray',
        fontSize: 12
    }
});

export default ItemFollowUpDisposition;