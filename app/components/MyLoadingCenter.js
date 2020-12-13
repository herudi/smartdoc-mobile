import React from "react";
import { View, ActivityIndicator } from "react-native";
import { primaryColor } from "../services/constant";
const MyLoadingCenter = ({
    size = "large",
    align = "center",
    just = "center"
}) => {
    return (
        <View style={{flex:1,alignItems:align,justifyContent:just}}>
            <ActivityIndicator size={size} color={primaryColor}/>
        </View>
    )
}


export default MyLoadingCenter;