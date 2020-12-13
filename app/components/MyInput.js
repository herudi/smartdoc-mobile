import React from "react";
import { Input } from "react-native-elements";
import { primaryColor } from "../services/constant";

const MyInput = React.forwardRef((props,ref) => (
    <Input
        ref={ref}
        {...props}
        labelStyle={{
            color:primaryColor,
            fontSize:14,
            fontWeight: 'normal'
        }}
        inputStyle={{
            fontSize:16
        }}
    />
));
export default MyInput;