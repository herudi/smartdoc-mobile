import React from "react";
import { View, Text } from "react-native";
import IconBadge from 'react-native-icon-badge';
import AntDesign from 'react-native-vector-icons/AntDesign'; 

const IconWithBadge = ({
    countBadge,
    size,
    color,
    name
}) => {
    return (
        <View style={{flexDirection: 'row',alignItems: 'center',justifyContent: 'center',}}>
            <IconBadge
                MainElement={
                    <AntDesign name={name} size={size} color={color} />
                }
                BadgeElement={
                    <Text style={{color:'#FFFFFF', fontSize:10}}>{countBadge > 100 ? "99++" : countBadge}</Text>
                }
                IconBadgeStyle={{
                    position:"absolute",
                    top:-7,
                    right:-7,
                    width:20,
                    height:20,
                    backgroundColor: 'red'
                }}
                Hidden={countBadge === "0" || countBadge === 0}
            />
        </View>
    )
}

export default IconWithBadge;