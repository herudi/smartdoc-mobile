import React from "react";
import { TouchableOpacity } from "react-native";
import AntDesign from 'react-native-vector-icons/AntDesign';

function MyButtonMenuRight({
    onPress,
    iconName
}) {
    return (
        <TouchableOpacity onPress={onPress} style={{padding:5}}>
          <AntDesign name={iconName} size={22} color="white" />
        </TouchableOpacity>
    )
}

export default MyButtonMenuRight;