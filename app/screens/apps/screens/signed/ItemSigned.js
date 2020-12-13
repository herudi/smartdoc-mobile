import React from "react";
import { View, Text, StyleSheet } from "react-native";
import MyLetterIcon from "../../../../components/MyLetterIcon";
import { whiteColor, defaultRippleColor } from "../../../../services/constant";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import { TouchableNativeFeedback } from "react-native-gesture-handler";
function ItemSigned({
    onPress,
    subject_letter,
    letter_date,
    from_employee,
    type_name
}){
    return (
        <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple(defaultRippleColor,false)} onPress={onPress} style={styles.card}>
            <MyLetterIcon style={{marginRight:10}} size={55} text={subject_letter.charAt(0)}/>
            <View style={{flex:1,flexDirection:'column'}}>
                <Text numberOfLines={1} style={styles.title}>{subject_letter}</Text>
                <Text numberOfLines={1} style={styles.subtitle}>{type_name} ~ {letter_date}</Text>
                <Text numberOfLines={1} style={styles.subtitle}>Dari {from_employee}</Text>
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

export default ItemSigned;