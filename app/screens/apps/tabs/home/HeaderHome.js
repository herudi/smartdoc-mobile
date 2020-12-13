import React from "react";
import { View, Text, Image } from "react-native";
import { primaryColor, whiteColor } from "../../../../services/constant";
import MyLetterIcon from "../../../../components/MyLetterIcon";
import Swiper from 'react-native-swiper';

const dummySlide = [
    {
        id: 1,
        name: 'Slide 1',
        bg: '#9DD6EB'
    },
    {
        id: 2,
        name: 'Slide 2',
        bg: '#9DD6EB'
    },
    {
        id: 3,
        name: 'Slide 3',
        bg: '#9DD6EB'
    },
]

const HomeHeader = ({
    name,
    position
}) => {
    return (
        <>
            <Swiper style={{height: 200}} showsButtons={true}>
                {
                    dummySlide.map((o) => {
                        return (
                            <View style={{
                                flex: 1,
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: o.bg
                            }}>
                                <Text style={{
                                    color: '#fff',
                                    fontSize: 30,
                                    fontWeight: 'bold'
                                }}>{o.name}</Text>
                            </View>
                        )
                    })
                }
            </Swiper>
            <View style={{
                marginTop: 15,
                marginLeft: 15,
                marginRight: 15,
                padding: 10,
                backgroundColor: whiteColor,
                elevation: 4,
                borderRadius: 10,
                justifyContent: "center"
            }}>
                <View style={{
                    flexDirection: "row"
                }}>
                    <MyLetterIcon size={48} text={name ? name.substring(0,1) : 'A'} />
                    <View style={{
                        flex: 1,
                        flexDirection: "column",
                        marginLeft: 20
                    }}>
                        <Text style={{
                            color: primaryColor,
                            fontSize: 20
                        }}>Welcome,</Text>
                        <Text style={{
                            color: "#616161",
                            fontSize: 14
                        }}>{name} </Text>
                        <Text style={{
                            color: "#616161",
                            fontSize: 14
                        }}>{position}</Text>
                    </View>
                </View>
            </View>
        </>
    )
}

export default HomeHeader;