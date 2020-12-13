import React from "react";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import { Text, View, TouchableOpacity} from "react-native";
import { whiteColor } from "../services/constant";

export const MySimpleButtonView =  ({
    color,
    iconName,
    title,
    marginIcon,
    fontSize,
    padding,
    btnStyle
}) => {
    return (
        <View 
            style={{
                ...btnStyle,
                padding:padding,
                backgroundColor:whiteColor,
                flexDirection:"row",
                alignItems:"center",
                justifyContent:"center",
                borderRadius:10,
                borderWidth:1,
                borderColor:color
            }}
        >
            <SimpleLineIcons name={iconName} size={fontSize} color={color}/>
            <Text style={{color:color,fontSize:fontSize,marginLeft:marginIcon}}>{title}</Text>
        </View>
    )
}

MySimpleButtonView.defaultProps = {
    marginIcon:5,
    fontSize:14,
    padding:5
}

const MySimpleButton = ({
    onPress,
    color,
    iconName,
    title,
    marginIcon,
    fontSize,
    padding,
    btnStyle
}) => {
    return (
        <TouchableOpacity 
            activeOpacity={0.5}
            onPress={onPress} 
            style={{
                ...btnStyle,
                padding:padding,
                backgroundColor:whiteColor,
                flexDirection:"row",
                alignItems:"center",
                justifyContent:"center",
                borderRadius:10,
                borderWidth:1,
                borderColor:color
            }}
        >
            <SimpleLineIcons name={iconName} size={fontSize} color={color}/>
            <Text style={{color:color,fontSize:fontSize,marginLeft:marginIcon}}>{title}</Text>
        </TouchableOpacity>
    )
}

MySimpleButton.defaultProps = {
    marginIcon:5,
    fontSize:14,
    padding:5
}

export default MySimpleButton;