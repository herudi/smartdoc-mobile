import React, { useRef } from "react";
import {
    StyleSheet,
    ScrollView,
    View,
    Keyboard,
    Image,
    Text
} from 'react-native';
import MyButton from "../../components/MyButton";
import AntDesign from 'react-native-vector-icons/AntDesign'; 
import MyInputOutlined from "../../components/MyInputOutlined";
import { primaryColor, whiteColor } from "../../services/constant";
import { showMessageError } from "../../components/MyMessage";


function LoginForm({
    onSubmit,
    showPassword,
    loading
}) {
    const usernameRef = useRef("");
    const passwordRef = useRef("");

    const _onSubmit = () => {
        if (usernameRef.current.value() === "") {
            showMessageError("Username tidak boleh kosong",true)
        }else if (passwordRef.current.value() === "") {
            showMessageError("Password tidak boleh kosong",true)
        }else{
            onSubmit({
                username:usernameRef.current.value(),
                password:passwordRef.current.value(),
            })
        }
    }
    return (
        <ScrollView contentContainerStyle={{flexGrow: 1}} keyboardShouldPersistTaps="always">
            <View style={styles.container}>
                <View style={{flex:1,paddingTop:40,paddingBottom:40}}>
                    <Image
                        style={styles.stretch}
                        source={require('./../../../assets/logo.png')}
                    />
                    <Text
                        style={{
                            color:primaryColor,
                            fontSize:20,
                            textAlign:"center",
                            fontWeight:"bold"
                        }}
                    >RSM E-LETTER</Text>
                </View>
                <View style={{flex:2,width:"100%"}}>
                    <MyInputOutlined
                        ref={usernameRef}
                        placeholder="Masukan email"
                        label="Email"
                        returnKeyType={"next"}
                        onSubmitEditing={e => { 
                            passwordRef.current.focus();
                        }}
                    />
                    <View style={{marginBottom:20}}></View>
                    <MyInputOutlined
                        ref={passwordRef}
                        placeholder="Masukan password"
                        label="Password"
                        secureTextEntry={true}
                        onSubmitEditing={_onSubmit}
                    />
                    <View style={{width:"100%",marginTop:20,alignSelf: 'center'}}>
                        <MyButton
                            onPress={() => {
                                Keyboard.dismiss();
                                _onSubmit();
                            }}
                            title="LOGIN"
                            icon={
                                <AntDesign 
                                    name="login" 
                                    size={18} 
                                    color="white" 
                                    style={{marginRight:10}}
                                />
                            }
                            loading={loading}
                        />
                    </View>
                </View>                
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor:whiteColor,
        padding:20
    },
    stretch: {
        width: 130,
        height: 120,
        resizeMode: 'stretch',
    },
});

export default LoginForm;