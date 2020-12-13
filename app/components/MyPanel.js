import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { primaryColor, whiteColor } from "../services/constant";

const MyPanel = ({
    title,
    children,
    containerStyle
}) => {
    return (
        <View style={[styles.card,containerStyle]}>
            <View style={styles.header}>
                <Text style={styles.header_text}>{title ? title.toUpperCase() : ""}</Text>
            </View>
            <View style={styles.body}>
                {children}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    card:{
        flexDirection:"column",
        backgroundColor:whiteColor,
        // borderRadius:10,
        // elevation:2
    },
    header:{
        padding:16,
        backgroundColor:"#f3f3f3"
    },
    body:{
        flex:1,
        padding:16
    },
    header_text:{
        color:primaryColor,
        fontSize:14,
        fontWeight:"bold"
    }
})

export default MyPanel;