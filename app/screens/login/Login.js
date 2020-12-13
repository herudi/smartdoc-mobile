import React, { useState, useContext } from "react";
import LoginForm from "./LoginForm";
import { showMessageError } from "../../components/MyMessage";
import { apiLogin, BASE_API } from "../../services/api";
import { setUserData } from "../../services/storage";
import { useNavigation, CommonActions } from "@react-navigation/native";
import Axios from "axios";
import {menuFunction} from "./../../utils/MyUtil";
import { moduleDisposition, moduleApproval, moduleSigned, moduleDispositionFollowUp, moduleIncoming } from "../../services/constant";
import AppContext from "../../../AppContext";

const Login = () => {
    const [loading,setLoading] = useState(false);
    const navigation = useNavigation();
    const {userDevice} = useContext(AppContext);

    const onSubmit = async (value) => {
        try {
            setLoading(true);
            let _value = value;
            _value.grant = "m";
            _value.device_id = null;
            if (userDevice) {
                if (userDevice.userId !== "unknown") {
                    _value.device_id = userDevice.userId;
                }
            }
            const result = await apiLogin("auth/login",_value);
            const resultPermission = await Axios({
                method:'get',
                url:BASE_API+"menus/navigation/roles",
                headers: {
                    Authorization: 'Bearer ' + result.token
                }
            });
            let permissionData = resultPermission.data.data.map(item => {
                let _func = Object.keys(item.function).map(function (key) {
                    let _key = menuFunction.find(fil => {
                        return fil.authority === key;
                    });
                    return item.function[key] ? _key ? _key.as : "false" : "false"; 
                }).filter(item2 => item2 !== "false");
                let _newObject = {
                    id:item.id,
                    module:item.modules,
                    name:item.name,
                    path:item.url,
                    function:_func
                }
                return _newObject;
            });
            let permissionDataFilter = permissionData.filter(item => {
                return item.module === moduleDisposition || 
                item.module === moduleApproval || 
                item.module === moduleSigned || 
                item.module === moduleDispositionFollowUp || 
                item.module === moduleIncoming
            })
            const user_data = {
                user_info:{
                    username:value.username,
                    isLoggedIn:true,
                    ...result.user_info
                },
                access_token:result.token,
                refresh_token:result.refresh_token,
                permission:permissionDataFilter
            }
            setUserData(user_data);
            setLoading(false);
            navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [
                    { name: 'Apps' }
                  ],
                })
            );
        } catch (error) {
            if (error.response) {
                let _error = error.response.data.error;
                let str_error = "";
                if (Array.isArray(_error)) {
                    for (let i = 0; i < _error.length; i++) {
                        str_error += _error[i]+"\n";
                    }
                }
                showMessageError(str_error, true);
            }else{
                showMessageError("Network Error");
            }
        }finally{
            setLoading(false);
        }
        
    }
    
    return (
        <LoginForm
            showPassword={true}
            onSubmit={onSubmit}
            loading={loading}
        />
    )
}

export default Login;