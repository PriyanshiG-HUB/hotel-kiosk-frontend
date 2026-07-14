import { Platform } from "react-native";

const Shadows = {
  card: Platform.select({
    ios:{
      shadowColor:"#000",
      shadowOffset:{
        width:0,
        height:4
      },
      shadowOpacity:0.1,
      shadowRadius:8
    },

    android:{
      elevation:4
    }
  })
}

export default Shadows;