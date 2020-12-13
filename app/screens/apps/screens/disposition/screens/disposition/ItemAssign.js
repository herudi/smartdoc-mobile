import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Feather from "react-native-vector-icons/Feather";
import MyLetterIcon from "../../../../../../components/MyLetterIcon";
import { dangerColor, whiteColor } from "../../../../../../services/constant";

function ItemAssign({
    onDelete,
    employee_name,
    structure_name,
    class_name
}){
    return (
        <View style={styles.card}>
            <MyLetterIcon style={{marginRight:10}} size={30} text={structure_name.charAt(0)}/>
            <View style={{flex:1,flexDirection:'column'}}>
                <Text numberOfLines={1} style={styles.title}>{structure_name}</Text>
                <Text numberOfLines={1} style={styles.subtitle}>{employee_name}</Text>
                <Text numberOfLines={1} style={styles.subtitle}>{class_name}</Text>
            </View>
            <TouchableOpacity onPress={onDelete} activeOpacity={0.8}>
                <Feather size={22} color={dangerColor} name="trash-2"/>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        backgroundColor:whiteColor,
        padding:10,
        // flex:1,
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

export default ItemAssign;