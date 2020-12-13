import React from "react";
import { Modal, View, ActivityIndicator, Text } from "react-native";
import { primaryColor } from "../services/constant";
const MyLoading = ({
    loading
}) => {
    return (
        <Modal
            transparent={true}
            visible={loading}
            onRequestClose={() => console.log('not close')}
        >
        <View style={{backgroundColor:'rgba(255, 255, 255, 0.70)',flex:1,alignItems:'center',justifyContent:'center'}}>
            <ActivityIndicator size={50} color={primaryColor}/>
            <Text style={{color:primaryColor,fontWeight:'bold'}}>Please wait...</Text>
        </View>
        </Modal>
    )
}

export default MyLoading;