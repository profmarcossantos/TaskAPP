//desabilitar especifico warning
import {YellowBox} from 'react-native';
YellowBox.ignoreWarnings(['Setting a timer for a long period of time']);
//YellowBox.ignoreWarnings(['source.uri should not be an empty string']);

import { createStackNavigator, createAppContainer } from "react-navigation";
import Login from './src/pages/Login'
import Menu from './src/pages/Menu'
const AppNavigator = createStackNavigator(
  {
    Login: Login,
    Menu: Menu
  },
  {
    initialRouteName: "Login",
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: '#003399',
      },
      headerTitleStyle: {
        fontWeight: 'bold',
        textAlign: "center",
        flex: 1
      },
    },
  }
);
export default createAppContainer(AppNavigator);