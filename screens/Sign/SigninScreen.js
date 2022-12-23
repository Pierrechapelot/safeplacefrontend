import React, { useState } from "react";
import {
  Button,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { login, setHelperSettings } from "../../reducers/users";
import { useDispatch, useSelector } from "react-redux";

import { useFonts } from "@use-expo/font";

import IP from "../../IPAdress";

export default function SigninScreen({ navigation }) {
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState(false);
  const EMAIL_REGEX =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  const handleSignin = () => {
    fetch(`http://${IP}:3000/users/signin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email, password: password }),
    })
      .then((response) => response.json())
      .then((userData) => {
        if (userData.result) {
          console.log("ok connected", userData);
          // reducer user => isconnected email et prenom
          const loginInfos = {
            email: email,
            prenom: userData.userInfos.prenom,
            avatarUri: userData.userInfos.avatarUri,
            isConnected: true,
            token: userData.userInfos.token,
          };
          console.log("loginInfos:", loginInfos);

          const helperSettings = {
            isAvailable: userData.userInfos.isAvailable,
            isReadyToAssist:
              userData.userInfos.userActions.accompagnementDistance,
            isReadyToAccomodate: userData.userInfos.userActions.hebergement,
            isReadyToLift: userData.userInfos.userActions.transport,
            isReadyToMove: userData.userInfos.userActions.aller,
            mustComeToMe: userData.userInfos.userActions.venir,
          };
          console.log("helperSettings:", helperSettings);

          // reducer user => isconnecte mail et prenom
          dispatch(login(loginInfos));
          dispatch(setHelperSettings(helperSettings));

          //  update isconnecte in database
          fetch(`http://${IP}:3000/users/isconnected`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: email, isConnected: true }),
          })
            .then((response) => response.json())
            .then((updateStatus) => {
              console.log("status isConnected à jour en bdd");
            });

          //  navigate to home
          navigation.navigate("TabNavigator", { screen: "Home" });
        } else {
          console.log("Mauvais mot de passe ou mauvaise adresse email");
        }
      });
  };

  const [isLoaded] = useFonts({
    OpenSans: require("../../assets/OpenSans/OpenSans-Regular.ttf"),
    Raleway: require("../../assets/Raleway/static/Raleway-Regular.ttf"),
  });
  if (!isLoaded) {
    return <View />;
  }
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Text style={styles.title}>Bienvenue sur</Text>
      <Text style={styles.titleBis}>SAFE PLACE</Text>
      <Text style={styles.title2}>Connecte toi !</Text>
      <View style={styles.inputGroup}>
        <Text style={styles.text}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="jane@exemple.com"
          placeholderTextColor="#C9D6DF"
          autoCapitalize="none"
          clearButtonMode="while-editing"
          keyboardType="email-address"
          onChangeText={(value) => setEmail(value)}
        />
        {emailError && <Text style={styles.error}>Invalid email address</Text>}
        <Text style={styles.text}>Mot de passe</Text>
        <TextInput
          style={styles.input}
          clearButtonMode="while-editing"
          placeholder="******"
          secureTextEntry={true}
          placeholderTextColor="#C9D6DF"
          autoCapitalize="none"
          onChangeText={(value) => setPassword(value)}
        />
      </View>
      <TouchableOpacity
        style={styles.button5}
        activeOpacity={0.9}
        onPress={() => handleSignin()}
      >
        <Text style={styles.text5}>Se connecter</Text>
      </TouchableOpacity>
      <View style={styles.blocSignup}>
        <Text style={styles.textSignup}>Pas encore de compte ?</Text>
        <TouchableOpacity
          style={styles.button6}
          activeOpacity={0.9}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={styles.text5}>S'inscrire</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    width: "80%",
    fontSize: 38,
    fontWeight: "400",
    textAlign: "center",
    color: "#33355C",
    fontFamily: 'Raleway',
  },
  titleBis: {
    width: "80%",
    fontSize: 38,
    fontWeight: "400",
    textAlign: "center",
    color: "#FFA647",
    fontFamily: 'Raleway',
  },
  title2: {
    marginTop: 20,
    width: "80%",
    fontSize: 28,
    fontWeight: "400",
    textAlign: "center",
    color: "#5CA4A9",
    fontFamily: 'Raleway',
  },
  inputGroup: {
    marginTop: 50,
    display: "flex",
    justifyContent: "space-around",
  },
  text: {
    color: "#5CA4A9",
    fontSize: 12,
    marginTop: 30,
  },
  input: {
    width: 320,
    height: 40,
    borderBottomColor: "#5CA4A9",
    borderBottomWidth: 1,
    fontSize: 18,
  },
  button5: {
    marginTop: 10,
    width: 176,
    height: 48,
    borderRadius: 10,
    backgroundColor: "#33355C",
    alignItems: "center",
    justifyContent: "center",
  },
  text5: {
    color: "#FFFFFF",
    fontFamily: "OpenSans",
    fontWeight: "bold",
    fontSize: 20,
  },
  blocSignup: {
    marginTop: 50,
    textAlign: "center",
    justifyContent: "center",
  },
  textSignup: {
    textAlign: "center",
    color: "#FFA647",
    fontStyle: "italic",
  },
  button6: {
    marginTop: 10,
    width: 176,
    height: 48,
    borderRadius: 10,
    backgroundColor: "#5CA4A9",
    alignItems: "center",
    justifyContent: "center",
  },
  error: {
    color: "#FFA647",
    fontSize: 12,
  },
});
