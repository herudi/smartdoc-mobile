import React from "react";
import { View, Text, StyleSheet } from "react-native";
import MyLetterIcon from "../../../../../../components/MyLetterIcon";
import { whiteColor } from "../../../../../../services/constant";

function ItemAssignFollowUp({
    onDelete,
    employee_name,
    structure_name,
    class_name
}){
    return (
        <View style={styles.card}>
            <MyLetterIcon style={{marginRight:10}} size={50} text={structure_name.charAt(0)}/>
            <View style={{flex:1,flexDirection:'column'}}>
                <Text numberOfLines={1} style={styles.title}>{structure_name}</Text>
                <Text numberOfLines={1} style={styles.subtitle}>{employee_name}</Text>
                <Text numberOfLines={1} style={styles.subtitle}>{class_name}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        backgroundColor:whiteColor,
        // padding:10,
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

export default ItemAssignFollowUp;