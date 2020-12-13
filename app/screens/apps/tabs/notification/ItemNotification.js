import React from "react";
import { View, Text, StyleSheet } from "react-native";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import { TouchableNativeFeedback } from "react-native-gesture-handler";
import { defaultRippleColor, whiteColor, primaryColor } from "../../../../services/constant";
export const iconNotif = (code) =>{
    switch(code){
        case "[SURAT MASUK]":{
            return "envelope";
        }
        case "[SURAT KELUAR]":{
            return "envelope-open";
        }
        case "[DISPOSISI]":{
            return "cursor";
        }
        default:{
            return "bell";
        }
    }
}
function ItemNotification({
    onPress,
    heading,
    title,
    content
}){
    return (
        <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple(defaultRippleColor,false)} onPress={onPress} style={styles.card}>
            <SimpleLineIcons style={{marginRight:10}} size={40} color={primaryColor} name={iconNotif(heading)}/>
            <View style={{flex:1,flexDirection:'column'}}>
                <Text numberOfLines={1} style={styles.title}>{heading}</Text>
                <Text numberOfLines={1} style={styles.subtitle}>{title}</Text>
                <Text numberOfLines={1} style={styles.subtitle}>{content}</Text>
            </View>
            <SimpleLineIcons size={18} color="gray" name="arrow-right"/>
        </TouchableNativeFeedback>
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
    },
    subtitle: {
        color: 'gray',
    }
  });

export default ItemNotification;