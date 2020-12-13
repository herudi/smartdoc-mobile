import React from "react";
import { StyleSheet, TouchableOpacity, Text } from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";

function ItemMore({
    onPress,
    title,
    iconName
}){
    return (
        <TouchableOpacity style={styles.group_view} onPress={onPress}>
            <AntDesign style={{marginRight:15}} name={iconName} size={24} color="#616161" /> 
            <Text style={styles.title}>{title}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    group_view: {
        flexDirection:'row',
        padding:10
    },
    title: {
        fontSize:16,
        color: '#616161',
    }
  });

export default ItemMore;