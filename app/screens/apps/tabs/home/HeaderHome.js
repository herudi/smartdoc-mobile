import React from "react";
import { View, Text, Image, StyleSheet, Dimensions } from "react-native";
import { primaryColor, whiteColor } from "../../../../services/constant";
import MyLetterIcon from "../../../../components/MyLetterIcon";
import Swiper from 'react-native-swiper';
const { width } = Dimensions.get('window');

const dummySlide = [
    {
        id: 1,
        image: require('./../../../../../assets/rsm1.png')
    },
    {
        id: 2,
        image: require('./../../../../../assets/rsm2.png')
    },
    {
        id: 3,
        image: require('./../../../../../assets/rsm3.png')
    },
    {
        id: 4,
        image: require('./../../../../../assets/rsm4.png')
    }
]

const HomeHeader = ({
    name,
    position
}) => {
    return (
        <>
            <View style={{elevation: 4, margin: 14, borderRadius: 10, height: 200 }}>
                <Swiper showsButtons={true}>
                    {
                        dummySlide.map((o, x) => {
                            return (
                                <Image
                                    key={x}
                                    style={styles.stretch}
                                    source={o.image}
                                />
                            )
                        })
                    }
                </Swiper>
            </View>
            <View style={{
                marginTop: 10,
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
                    <MyLetterIcon size={48} text={name ? name.substring(0, 1) : 'A'} />
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
const styles = StyleSheet.create({
    stretch: {
        width: width - 24,
        height: 200,
        borderRadius: 10,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center'
    },
});


export default HomeHeader;