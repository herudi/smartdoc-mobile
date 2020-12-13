import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { whiteColor } from "../services/constant";
import MyLetterIcon from "./MyLetterIcon";
function ItemAssignOutgoing({
    employee_name,
    structure_name
}){
    return (
        <View style={styles.card}>
            <MyLetterIcon style={{marginRight:10}} size={30} text={structure_name.charAt(0)}/>
            <View style={{flex:1,flexDirection:'column'}}>
                <Text numberOfLines={1} style={styles.title}>{structure_name}</Text>
                <Text numberOfLines={1} style={styles.subtitle}>{employee_name}</Text>
            </View>
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

export default ItemAssignOutgoing;