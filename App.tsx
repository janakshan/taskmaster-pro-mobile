import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as ReduxProvider } from 'react-redux';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { StatusBar } from 'react-native';
import { store } from './src/store';
import AppNavigator from './src/navigation/AppNavigator';

const lightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#3498db',
    background: '#f5f5f5',
    surface: '#ffffff',
    text: '#000000',
  },
};

const App = () => {
  return (
    <ReduxProvider store={store}>
      <PaperProvider theme={lightTheme}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor="#fff"
          translucent={false}
        />
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </PaperProvider>
    </ReduxProvider>
  );
};

export default App;