import React from "react";
import { Button } from "react-native-elements";
import { primaryColor } from "../services/constant";

const MyButton = (props) => {
    return (
        <Button 
            buttonStyle={[{backgroundColor:props.color,borderRadius:10,...props.btnStyle}]}
            {...props}
        />
    )
};

MyButton.defaultProps  = {
    color:primaryColor
}

export default MyButton;