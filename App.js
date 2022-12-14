import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

// Import des composants de navigation 
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Import des Screens
import CarrouselScreen from './screens/Sign/CarrouselScreen';
import SigninScreen from './screens/Sign/SigninScreen';
import LoginScreen from './screens/Sign/LoginScreen';
import CguScreen from './screens/Sign/CguScreen';
import SignupScreen from './screens/Sign/SignupScreen';
import UploadScreen from './screens/Sign/CNIPictures/UploadScreen';
import CNIRecto from './screens/Sign/CNIPictures/CNIRecto';
import CNIVerso from './screens/Sign/CNIPictures/CNIVerso';
import SelfieScreen from './screens/Sign/SelfieScreen';
import AccountConfirmScreen from './screens/Sign/AccountConfirmScreen';
import HomeScreen from './screens/TabNavigator/HomeScreen';
import RessourcesScreen from './screens/TabNavigator/RessourcesScreen';
import PoliceScreen from './screens/TabNavigator/PoliceScreen';
import ProfilScreen from './screens/TabNavigator/ProfilScreen';
import SettingsScreen from './screens/TabNavigator/SettingsScreen';
import HelperLocatorScreen from './screens/HelpRequest/HelperLocatorScreen';
import HelperConfirmRequestScreen from './screens/HelpRequest/HelperConfirmRequestScreen';
import ContactHelperScreen from './screens/HelpRequest/ContactHelperScreen';
import HelperNotificationScreen from './screens/Helper/HelperNotificationScreen';
import HelperMoreInfoScreen from './screens/Helper/HelperMoreInfoScreen';
import HelperConfirmationScreen from './screens/Helper/HelperConfirmationScreen';
import HelperDeclineScreen from './screens/Helper/HelperDeclineScreen';
import HelperAcceptScreen from './screens/Helper/HelperAcceptScreen';
import HelperContactScreen from './screens/Helper/HelperContactScreen';

// redux imports
import { Provider } from 'react-redux';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import user from './reducers/users';
import signup from './reducers/signup';

// redux-persist imports
import { persistStore, persistReducer } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const reducers = combineReducers({ user, signup });
const persistConfig = {
  key: 'safeplacecapsule',
  storage: AsyncStorage,
};

const store = configureStore({
  reducer: persistReducer(persistConfig, reducers),
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
});

const persistor = persistStore(store);

export default function App() {

  const Stack = createNativeStackNavigator();
  const Tab = createBottomTabNavigator();


  const TabNavigator = () => {
    return (
      <Tab.Navigator screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName = '';
  
          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Ressources') {
            iconName = 'book';
          } else if (route.name === 'Police') {
            iconName = 'shield';
            color='red';
          } 
          else if (route.name === 'Profil') {
            iconName = 'user';
          } else if (route.name === 'Settings') {
            iconName = 'gear';
          } 
  
          return <FontAwesome name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#e8be4b',
        tabBarInactiveTintColor: '#b2b2b2',
        headerShown: false,
      })}>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Ressources" component={RessourcesScreen} />
        <Tab.Screen name="Police" component={PoliceScreen} />
        <Tab.Screen name="Profil" component={ProfilScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />

  
      </Tab.Navigator>
    );
  };
  






  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Carrousel" component={CarrouselScreen} />
            <Stack.Screen name="SigninScreen" component={SigninScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Cgu" component={CguScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
            <Stack.Screen name="HomeScreen" component={HomeScreen} />
            <Stack.Screen name="Upload" component={UploadScreen} />
            <Stack.Screen name="CNIRecto" component={CNIRecto} />
            <Stack.Screen name="CNIVerso" component={CNIVerso} />
            <Stack.Screen name="Selfie" component={SelfieScreen} options={{ title: '' }}/>
            <Stack.Screen name="Account" component={AccountConfirmScreen} options={{ title: 'Bienvenue sur SAFE PLACE' }}/>
            <Stack.Screen name="HelperLocation" component={HelperLocatorScreen} />
            <Stack.Screen name="HelperConfirmRequest" component={HelperConfirmRequestScreen} />
            <Stack.Screen name="ContactHelper" component={ContactHelperScreen} />
            <Stack.Screen name="HelperNotification" component={HelperNotificationScreen} />
            <Stack.Screen name="HelpermoreInfo" component={HelperMoreInfoScreen} />
            <Stack.Screen name="HelperConfirmation" component={HelperConfirmationScreen} />
            <Stack.Screen name="HelperDecline" component={HelperDeclineScreen} />
            <Stack.Screen name="HelperAccept" component={HelperAcceptScreen}  />
            <Stack.Screen name="HelperContact" component={HelperContactScreen}  />
            <Stack.Screen name="TabNavigator" component={TabNavigator} />
          </Stack.Navigator>
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
