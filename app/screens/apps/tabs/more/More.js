import React, { useState, useEffect } from "react";
import { View } from "react-native";
import ItemMore from "./ItemMore";
import MySeparator from "../../../../components/MySeparator";
import { apiGet } from "../../../../services/api";
import { showMessageError } from "../../../../components/MyMessage";
import { clearAll } from "../../../../services/storage";
import { CommonActions } from "@react-navigation/native";
import MyLoading from "../../../../components/MyLoading";

const More = ({navigation}) => {
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        console.log("HERUDI")
    },[]);

    const onLogout = async () => {
        try {
            setLoading(true);
            await apiGet("auth/logout");
            await clearAll();
            global.glob_access_token = null;
            setLoading(false);
            navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [
                    { name: 'Login' }
                  ],
                })
            );
        } catch (error) {
            setLoading(false);
            showMessageError("Error Logout");
        }
    }
    return (
        <View style={{flex:1, padding:10, flexDirection:"column", backgroundColor:"white"}}>
            <ItemMore
                onPress={onLogout}
                iconName="logout"
                title="Logout"
            />
            <MySeparator/>
            <MyLoading loading={loading}/>
        </View>
    )
}

export default More;