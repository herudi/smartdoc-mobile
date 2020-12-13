import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import MyLetterIcon from "../../../../../../components/MyLetterIcon";
import { whiteColor } from "../../../../../../services/constant";

function ItemIncomingMailDisposition({
    onPress,
    subject_letter,
    number_letter
}){
    return (
        <TouchableOpacity activeOpacity={0.8} onPress={onPress} style={styles.card}>
            <MyLetterIcon style={{marginRight:10}} size={38} text={subject_letter.charAt(0)}/>
            <View style={{flex:1,flexDirection:'column'}}>
                <Text numberOfLines={1} style={styles.title}>{subject_letter}</Text>
                <Text numberOfLines={1} style={styles.subtitle}>No. {number_letter}</Text>
            </View>
            <SimpleLineIcons size={18} color="gray" name="arrow-right"/>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    card: {
        backgroundColor:whiteColor,
        padding:10,
        flex:1,
        flexDirection:'row',
        alignItems: 'center'
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
        fontSize:12
    }
  });

export default ItemIncomingMailDisposition;