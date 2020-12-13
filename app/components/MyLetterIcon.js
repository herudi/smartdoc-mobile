import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native"

export const SimpleLetterIcon = ({
    size,
    text,
    background,
    style
}) => {
    return (
        <View style={[styles.container_simple,{width:size,height:size,backgroundColor:background},style]}>
            <Text style={{fontSize:(size/1.5), color:"white"}}>{text.toUpperCase()}</Text>
        </View>
    )
};

const backgroundByAbjads = [
    {text:"a",background:"#00bfa5"},
    {text:"b",background:"#6200ea"},
    {text:"c",background:"#ffd600"},
    {text:"d",background:"#64dd17"},
    {text:"e",background:"#aa00ff"},
    {text:"f",background:"#c51162"},
    {text:"g",background:"#2962ff"},
    {text:"h",background:"#00c853"},
    {text:"i",background:"#ffab00"},
    {text:"j",background:"#0091ea"},
    {text:"k",background:"#3e2723"},
    {text:"l",background:"#304ffe"},
    {text:"m",background:"#d50000"},
    {text:"n",background:"#aeea00"},
    {text:"o",background:"#263238"},
    {text:"p",background:"#dd2c00"},
    {text:"q",background:"#212121"},
    {text:"r",background:"#ff6d00"},
    {text:"s",background:"#00b8d4"},
    {text:"t",background:"#00bfa5"},
    {text:"u",background:"#6200ea"},
    {text:"v",background:"#ffd600"},
    {text:"w",background:"#64dd17"},
    {text:"x",background:"#aa00ff"},
    {text:"y",background:"#c51162"},
    {text:"z",background:"#2962ff"},
    {text:"?",background:"#2962ff"},
]

const MyLetterIcon = ({
    size,
    text,
    style
}) => {
    const [background, setBackground] = useState("#2962ff");

    useEffect(() => {
        const model = text ? backgroundByAbjads.find(item => item.text === text.toLowerCase()) : {};
        if (model) {
            setBackground(model.background);
        }else{
            setBackground("#2962ff")
        }
    }, [text]);
    return (
        <SimpleLetterIcon 
            style={style}
            size={size}
            text={text ? text : "?"}
            background={background}
        />
    )
}

const styles = StyleSheet.create({
    container_simple: {
        borderRadius:7,
        alignItems:"center",
        justifyContent:"center"
    }
})

export default MyLetterIcon;