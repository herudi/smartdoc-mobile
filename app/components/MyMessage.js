import { showMessage } from "react-native-flash-message";
import { Alert } from "react-native";

export const showMessageError = (message, isAutoHide = false) => {
    showMessage({
        message: "Error",
        description: message,
        type: "danger",
        autoHide:true,
        duration: isAutoHide ? 3000 : 7000,
        icon:"danger"
    });
}

export const showMessageSuccess = (message, isAutoHide = false) => {
    showMessage({
        message: "Success",
        description: message,
        type: "success",
        autoHide:true,
        duration:isAutoHide ? 3000 : 7000,
        icon:"success"
    });
}

export const showAlert = (message) => {
    Alert.alert(
        "Information",
        message
      );
}