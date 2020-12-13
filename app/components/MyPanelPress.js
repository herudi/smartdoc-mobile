import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { primaryColor, whiteColor, defaultRippleColor } from "../services/constant";
import { TouchableNativeFeedback } from "react-native-gesture-handler";
import Collapsible from "react-native-collapsible";
import AntDesign from "react-native-vector-icons/AntDesign";

const MyPanelPress = ({
    title,
    children,
    containerStyle,
    collapsed
}) => {
    const [collapsedContent, setCollapsedContent] = useState(true);
    useEffect(() => {
        setCollapsedContent(collapsed);
    }, [collapsed]);

    const iconName = collapsedContent ? "pluscircleo" : "minuscircleo";
    return (
        <View style={[styles.card,containerStyle]} >
            <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple(defaultRippleColor,false)} style={styles.header} onPress={() => {
                setCollapsedContent(!collapsedContent);
            }}>
                <AntDesign style={{marginRight:10}} name={iconName} size={22} color={primaryColor} />
                <Text style={styles.header_text}>{title ? title.toUpperCase() : ""}</Text>
            </TouchableNativeFeedback>
            <View style={styles.body}>
                <Collapsible collapsed={collapsedContent}>
                    <View style={{padding:16}}>
                        {children}
                    </View>
                </Collapsible>
            </View>
        </View>
    )
}

MyPanelPress.defaultProps = {
    collapsed:true
}

const styles = StyleSheet.create({
    card:{
        // flex:1,
        flexDirection:"column",
        backgroundColor:whiteColor
    },
    header:{
        padding:16,
        backgroundColor:"#f3f3f3",
        flexDirection:"row",
        alignItems:"center"
    },
    body:{
        flex:1,
    },
    header_text:{
        color:primaryColor,
        fontSize:14,
        fontWeight:"bold"
    }
})

export default MyPanelPress;