import React from "react";
import { Text } from "react-native";
import { primaryColor, whiteColor } from "../../../../services/constant";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import { TouchableNativeFeedback } from "react-native-gesture-handler";

const ItemMenuButton = ({
    onPress,
    iconName,
    title,
    subtitle,
    color,
    borderColor
}) => {
    return(
        <TouchableNativeFeedback 
            onPress={onPress} 
            background={TouchableNativeFeedback.Ripple(borderColor,true)}
            style={{
                backgroundColor:whiteColor,
                borderRadius:10,
                flexDirection:"column",
                alignItems:"center",
                borderColor:whiteColor
            }}
        >
            <SimpleLineIcons name={iconName} size={22} color={color} />
            <Text style={{
                marginTop:10,
                fontSize:14,
                textAlign:"center",
                color:"#616161"
            }}>{title}</Text>
            <Text style={{
                fontSize:14,
                textAlign:"center",
                color:"#616161"
            }}>{subtitle}</Text>
        </TouchableNativeFeedback>
    )
}

ItemMenuButton.defaultProps = {
    color:primaryColor,
    borderColor:primaryColor
}

export default ItemMenuButton;