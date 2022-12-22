import { Image, StyleSheet, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useFonts } from '@use-expo/font';
import { useSelector } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HelperConfirmationScreen({ navigation }) {
  const PlaceholderImage = require("../../assets/Vector.png");

  //récupérer les données du store
  const user = useSelector((state) => state.user.value);

  const [isLoaded] = useFonts({
    'OpenSans': require("../../assets/OpenSans/OpenSans-Regular.ttf"),
    'Raleway': require('../../assets/Raleway/static/Raleway-Regular.ttf')
  });
  if (!isLoaded) {
    return <View />
  }
  return (

    <SafeAreaView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>

      <View style={styles.topContainer}>
        <View>
          <Text style={styles.profilName}>Bonjour {user.prenom}</Text>
        </View>

        <View>
          <TouchableOpacity activeOpacity={0.9} onPress={() =>  navigation.navigate('TabNavigator', { screen: 'Profil' })}>
            <Image source={{ uri: `${user.avatarUri}` }} style={styles.profilePic} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.textNotification}>
        <Text style={styles.title}>Votre proposition d'aide a été envoyé à Jane, Merci</Text>
        <ActivityIndicator size="large" color="#black" />
      </View>

      <View style={styles.waitContainer}>
        <Text style={styles.title}>Veuillez rester connecté SVP</Text>

        <Image source={require('../../assets/carou1.png')}></Image>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("HelperAccept")}>
          <Text style={styles.textButton}>Next step</Text>
        </TouchableOpacity>
      </View>

    </SafeAreaView>


  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  topContainer: {
    flex: 1,
    alignItems: 'center',
    marginTop: 10,
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  profilePic: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },

  profilName: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'left',
    fontFamily: 'Raleway',

  },

  textNotification: {
    // flex: 3,
    // backgroundColor: 'brown',
    width: '90%',
    alignItems: 'center',
  },

  title: {
    width: '80%',
    fontSize: 24,
    color: "#33355C",
    fontWeight: '900',
    textAlign: 'center',
    margin: 5,
    fontFamily: 'Raleway',
  },

  waitContainer: {
    // flex: 4,
      //  backgroundColor: 'yellow',
    width: '90%',
    alignItems: 'center',

  },

  button: {
    minWidth: '45%',
    marginBottom: 20,
    height: 48,
    borderRadius: 10,
    backgroundColor: "#5CA4A9",
    alignItems: "center",
    justifyContent: "center",
  },

  textButton: {
    color: "#FFFFFF",
    fontFamily: 'OpenSans',
    fontWeight: "bold",
    fontSize: 20,

  },

});
