import {
  Button,

  ScrollView,
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getRestSignupFields } from "../../reducers/signup";
import { login } from "../../reducers/users";
import DateField from "react-native-datefield";
import * as SMS from "expo-sms";

import { useFonts } from "@use-expo/font";

import IP from "../../IPAdress";

export default function SignupScreen({ navigation }) {
  const dispatch = useDispatch();

  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [naissance, setNaissance] = useState("12-12-2022");
  const [telephone, setTelephone] = useState("");
  const [numeroRue, setNumeroRue] = useState("");
  const [rue, setRue] = useState("");
  const [codePostal, setCodePostal] = useState(0);
  const [ville, setVille] = useState('');
  const [isAvailable, setIsAvailable] = useState(false);
  const [verificationToken, setVerificationToken] = useState(null);

  //console.log(telephone, verificationToken, isAvailable);

  const email = useSelector((state) => state.signup.value.email)
  const password = useSelector((state) => state.signup.value.password)

  //envoi du sms de vérification

  /*useEffect(() => {
    async function checkAvailability() {
      const isSmsAvailable = await SMS.isAvailableAsync();
      setIsAvailable(isSmsAvailable);
    }
    checkAvailability();
  }, []);

  const generateRandomNumber = () => {
    return Math.floor(1000 + Math.random() * 9000);
  }
 
  const smsChecking = async () => {
    const {result} = await SMS.sendSMSAsync (
      [`${telephone}`],
      `Your verification code is: ${verificationToken}`
    );
    }*/

  const handleSubmit = () => {
    const userInfos = {
      email: email,
      password: password,
      prenom: prenom,
      isConnected: true,
      nom: nom,
      naissance: naissance,
      telephone: telephone,
      numeroRue: numeroRue,
      rue: rue,
      codePostal: codePostal,
      ville: ville,
    };

    console.log("Full user infos:", userInfos);
    fetch(`http://${IP}:3000/users/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userInfos),
    })
      .then((response) => response.json())
      .then((user) => {
        if (user.result) {
          console.log("okposted");
          dispatch(getRestSignupFields(userInfos));
          dispatch(login(userInfos));
          //appel fonction sms verif
          //setVerificationToken(generateRandomNumber());
          //smsChecking(),
          navigation.navigate('Upload')
        }else{
          console.log('email already exist')
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
        <Text style={styles.title}>Crée un compte</Text>
        <Text style={styles.title2}>SAFE PLACE</Text>
        <ScrollView>
          <View style={styles.inputGroup}>
            <Text style={styles.text}>Prénom</Text>
            <TextInput
              style={styles.input}
              placeholder="Jane"
              placeholderTextColor="#C9D6DF"
              onChangeText={(value) => setPrenom(value)}
            />
            <Text style={styles.text}>Nom</Text>
            <TextInput
              style={styles.input}
              placeholder="Martin"
              placeholderTextColor="#C9D6DF"
              onChangeText={(value) => setNom(value)}
            />
            <Text style={styles.text}>Date de naissance</Text>
            <DateField
              labelDate="DD"
              labelMonth="MM"
              labelYear="YYYY"
              onSubmit={(value) => setNaissance(value)}
            />

            <Text style={styles.text}>Téléphone</Text>
            <TextInput
              style={styles.input}
              placeholder=""
              placeholderTextColor="#C9D6DF"
              onChangeText={(value) => setTelephone(value)}
            />
            <Text style={styles.text}>adresse n°</Text>
            <TextInput
              style={styles.input}
              placeholder=""
              placeholderTextColor="#C9D6DF"
              onChangeText={(value) => setNumeroRue(value)}
            />

            <Text style={styles.text}>Rue</Text>
            <TextInput
              style={styles.input}
              placeholder="Rue"
              placeholderTextColor="#C9D6DF"
              onChangeText={(value) => setRue(value)}
            />

            <Text style={styles.text}>Code postal</Text>
            <TextInput
              style={styles.input}
              placeholder="69001"
              placeholderTextColor="#C9D6DF"
              onChangeText={(value) => setCodePostal(value)}
            />

            <Text style={styles.text}>Ville</Text>
            <TextInput
              style={styles.input}
              placeholder="Ville"
              placeholderTextColor="#C9D6DF"
              onChangeText={(value) => setVille(value)}
            />

            <TouchableOpacity
              style={styles.button5}
              activeOpacity={0.9}
              onPress={() => handleSubmit()}
            >
              <Text style={styles.text5}>S'inscrire</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  // safeView: {
  //   marginTop: 30,
  // },
  datePickerStyle: {
    width: 230,
  },
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 50,
    fontFamily: 'OpenSans'
  },
  image: {
    width: "100%",
    height: "50%",
  },
  title: {
    width: "80%",
    fontSize: 30,
    fontWeight: "400",
    textAlign: "center",
    color: "#33355C",
    fontFamily: 'Raleway',
  },
  title2: {
    width: "80%",
    fontSize: 30,
    fontWeight: "400",
    textAlign: "center",
    color: "#FFA647",
    fontFamily: 'Raleway',
  },
  inputGroup: {
    marginTop: 20,
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
    marginTop: 30,
    marginBottom: 30,
    width: 176,
    height: 48,
    borderRadius: 10,
    backgroundColor: "#33355C",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  text5: {
    color: "#FFFFFF",
    fontFamily: "OpenSans",
    fontWeight: "bold",
    fontSize: 20,
  },
  button: {
    display: "flex",
    alignItems: "center",
    paddingTop: 8,
    width: "80%",
    marginTop: 30,
    backgroundColor: "blue",
    borderRadius: 10,
    marginBottom: 80,
  },
  textButton: {
    color: "#ffffff",
    height: 30,
    fontWeight: "600",
    fontSize: 16,
  },
});
