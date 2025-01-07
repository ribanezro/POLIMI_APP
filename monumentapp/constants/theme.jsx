import { Dimensions } from "react-native";

const {height, width} = Dimensions.get("window");

export const URL= "13.37.224.132";

const COLORS = {
    primary: "#ffffff", //Color pastel de fondo -- Cornsilk
    secondary: "#a1dae8", //Color verde oscuro tematico -- Cal Poly Pomona Green 
    tertiary: "#133b62", //Marron anaranjado -- Tiger's Eye


    highlighter: "#90ee90",
    gold: '#FFC107',


    white: "#ffffff",
    black: "#000000",
    red:  "#FF0000",

    light_green: "#6d9461",
  
    error: "#ff0000", 
  
    sombra: "#efe28f",

};

const SIZES = {
    // base size
    base: 8,

    // font sizes
    xxxsmall: 8,
    xxsmall: 10,
    xsmall: 12,
    small: 14,
    medium: 16,
    large: 18,
    xlarge: 20,
    xxlarge: 22,
    xxxlarge: 24,

    // app dimensions
    width,
    height
};


export {COLORS, SIZES};