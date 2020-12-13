import React from "react";
import {
    OutlinedTextField,
  } from 'react-native-material-textfield';
import { primaryColor } from "../services/constant";

const MyInputOutlined = React.forwardRef((props,ref) => (
    <OutlinedTextField
        ref={ref}
        {...props}
        tintColor={primaryColor}
    />
));
export default MyInputOutlined;