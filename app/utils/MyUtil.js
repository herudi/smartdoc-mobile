import { showMessageError } from "../components/MyMessage";
import { clearAll } from "../services/storage";
import { CommonActions } from "@react-navigation/native";
import RNFetchBlob from "rn-fetch-blob";
// import { Alert } from "react-native";

export const myError = async (error,navigation) => {
    if (error.response) {
        if (error.response.status === 422) {
            let _error = error.response.data.error;
            let strError = "";
            // eslint-disable-next-line no-unused-vars
            for(let key in _error){
                strError += key + " => "+ _error[key]+ "\n";
            }
            showMessageError(strError);
        }else if(error.response.status === 401){
            if(navigation){
                await clearAll();
                global.glob_access_token = null;
                navigation.dispatch(
                    CommonActions.reset({
                      index: 0,
                      routes: [
                        { name: 'Login' }
                      ],
                    })
                );
            }
        }else{
            let _error = error.response.data.error;
            if (typeof _error === "string") {
                showMessageError(_error || "Error Data");
            }
        }
    }else{
        showMessageError("Network Error");
    }
}

export const menuFunction = [
    
    {
        as:"R",
        name:"Read",
        authority:"authority_read"
    },
    {
        as:"C",
        name:"Create",
        authority:"authority_create"
    },
    {
        as:"U",
        name:"Update",
        authority:"authority_update"
    },
    {
        as:"D",
        name:"Delete",
        authority:"authority_delete"
    },
    {
        as:"A",
        name:"Approve",
        authority:"authority_approve"
    },
    {
        as:"S",
        name:"Disposition",
        authority:"authority_disposition"
    },
    {
        as:"E",
        name:"Export",
        authority:"authority_export"
    },
    {
        as:"I",
        name:"Import",
        authority:"authority_import"
    }    
    
];

export const listRouteNotif = ['Approval', 'Signed', 'IncomingMail', 'Disposition'];

export const getFileName = (dispo) => {
    let filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
    let matches = filenameRegex.exec(dispo);
    if (matches != null && matches[1]) { 
        let filename = matches[1].replace(/['"]/g, '');
        return filename;
    }

    return null;
}

function getExt(filepath){
    return filepath.split("?")[0].split("#")[0].split('.').pop();
}

export const getDownloadFile = async (url,setLoading) => {
    try {
        setLoading(true);
        let dirs = RNFetchBlob.fs.dirs;
        const result = await RNFetchBlob.fetch('GET', url, {
            Authorization: "Bearer " + global.glob_access_token,
        });
        let filename = "viewdoc."+getExt(getFileName(result.respInfo.headers["Content-Disposition"]));
        let contentType = result.respInfo.headers["Content-Type"];
        if (filename && contentType) {
            let fullpath = dirs.DownloadDir + '/' + filename;
            await RNFetchBlob.config({
                path: fullpath
            }).fetch('GET', url, {
                Authorization: "Bearer " + global.glob_access_token,
            });
            RNFetchBlob.android.actionViewIntent(fullpath, contentType);
        } else {
            showMessageError("Gagal lihat file")
        }
        setLoading(false);
    } catch (error) {
        console.log(error);
        setLoading(false);
        showMessageError("Gagal lihat file");
    }
}

export const statusIncommingMail = [
    {id:0,name:"DRAFT",color:"#e65100"},
    {id:1,name:"SEND",color:"#d32f2f"},
    {id:2,name:"DISPOSITION",color:"#7b1fa2"},
    {id:3,name:"FOLLOW UP",color:"#1976d2"},
    {id:4,name:"DONE",color:"#2e7d32"}
];

export const statusDisposition = [
    {id:0,name:"DRAFT",color:"#e65100",value:"0"},
    {id:1,name:"SEND",color:"#d32f2f",value:"1"},
    {id:2,name:"DISPOSITION",color:"#7b1fa2",value:"2"},
    {id:4,name:"DONE",color:"#2e7d32",value:"4"}
];

export const getColorStatusIncomingMail = (status) => {
    let data = statusIncommingMail.find(o => o.id === status.status_code);
    if (data) {
        return data.color;
    }
    return "red";
}

export const getNameStatusIncomingMail = (status) => {
    let text = status ? status.action+" "+status.employee_name : null;
    if (text) {
        return text;
    }
    return "none";
}

export const getColorStatusDispo = (status) => {
    let data = statusDisposition.find(o => o.id === status.status_code);
    if (data) {
        return data.color;
    }
    return "red";
}

export const getNameStatusDispo = (status) => {
    let text = status ? status.action : null;
    if (text) {
        return text;
    }
    return "none";
}

export function isEmptyObject(obj) {
    for(let {} in obj) { return false; }
    return true;
}