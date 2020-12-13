import { Header } from "react-native-elements"
import React from "react";
import { primaryColor } from "../services/constant";

const MyHeader = ({
    backgroundColor = primaryColor,
    leftComponent,
    title,
    placement = "left"
}) => {
    return (
        <Header
            containerStyle={{
                backgroundColor: backgroundColor,
                justifyContent: 'space-around',
                height:58,
                alignItems:"center",
                paddingTop:0,
                paddingBottom:0,
                elevation:4
            }}
            placement={placement}
            leftComponent={leftComponent}
            centerComponent={{ text: title, style: { color: '#fff',fontSize:20,fontWeight:"600" } }}
        />
    )
}

export default MyHeader;