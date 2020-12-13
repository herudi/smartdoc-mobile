import React from "react";
import { View } from "react-native";
import { warningColor, defaultRippleColor } from "../services/constant";
import { TouchableNativeFeedback } from "react-native-gesture-handler";
import AntDesign from "react-native-vector-icons/AntDesign";
const size = 56;
const MyFloatButton = ({
    onPress,
    iconName
}) => {
    return (
        <View style={{
            position:"absolute",
            bottom:16,
            right:16,
            zIndex:999
        }}>
            <TouchableNativeFeedback style={{
                alignItems:"center",
                justifyContent:"center",
                backgroundColor:warningColor,
                width:size,
                height:size,
                elevation:4,
                borderRadius:100,
            }} background={TouchableNativeFeedback.Ripple(defaultRippleColor,true)} onPress={onPress}>
                <AntDesign name={iconName} size={22} color="white"/>
            </TouchableNativeFeedback>
        </View>
    );
};

MyFloatButton.defaultProps = {
    iconName:"plus",
}

export default MyFloatButton;