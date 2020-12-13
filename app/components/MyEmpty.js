import React from "react";
import { View, Text } from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";

const MyEmpty = () => {
    return (
        <View style={{flexDirection:"column",alignItems:"center"}}>
            <AntDesign size={42} color="gray" name="hdd"/>
            <Text style={{color:"gray",fontWeight:"bold"}}>No Data</Text>
        </View>
    )
}

export default MyEmpty;