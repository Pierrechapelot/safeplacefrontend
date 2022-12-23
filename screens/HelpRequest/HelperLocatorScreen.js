import { Image, 
  StyleSheet, 
  Text, 
  View, 
  KeyboardAvoidingView, 
  TouchableOpacity, 
  SafeAreaView, 
  ScrollView, 
  ActivityIndicator 
} from 'react-native';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

import { addPosition, deletePosition } from '../../reducers/geolocation';
import { addHelperInfos } from '../../reducers/selectedHelper';

import IP from "../../IPAdress";

import { useFonts } from '@use-expo/font';

//imports cards
import FontAwesome from "react-native-vector-icons/FontAwesome";
import persistStore from 'redux-persist/es/persistStore';
import data from '../../assets/data';
const PlaceholderImage = require("../../assets/Vector.png");

export default function HelperLocatorScreen({ navigation }) {

  const dispatch = useDispatch();

  //récupérer les données du store
  const user = useSelector((state) => state.user.value);
  const position = useSelector((state) => state.location.value);
  console.log('reducer user:', user, 'reducer location:', position);

  const [currentPosition, setCurrentPosition] = useState(null);
  const [dataArray, setDataArray] = useState([]);
  const [likedHelpers, setLikedHelpers] = useState([]);

  //calcul d'une distance en km
  function distance(latHelper, lonHelper, latRequest, lonRequest) {
    if ((latHelper === latRequest) && (lonHelper === lonRequest)) {
      return 0;
    }
    else {
      const radlatHelper = Math.PI * latHelper/180;
      const radlatRequest = Math.PI * latRequest/180;
      const theta = lonHelper-lonRequest;
      const radtheta = Math.PI * theta/180;
      const dist = Math.sin(radlatHelper) * Math.sin(radlatRequest) + Math.cos(radlatHelper) * Math.cos(radlatRequest) * Math.cos(radtheta);
      if (dist > 1) {
        dist = 1;
      }
      let dist1 = Math.acos(dist);
      let dist2 = dist1 * 180/Math.PI;
      let dist3 = dist2 * 60 * 1.1515;
      let dist4 = dist3 * 1.609344;
      if (dist4 < 1) {return (dist4 /= 1000).toFixed(2) + ' m'}
      return (dist4.toFixed(2) + ' km');
    }
  }

  //récupérer les données de géolocalisation
  useEffect(() => {
    (async () => {
      //demander la permission
      const { status } = await Location.requestForegroundPermissionsAsync();
      //si permission accordée
      if (status === 'granted') {
        //récupérer la localisation tous les 20m
        Location.watchPositionAsync({ distanceInterval: 20 },
          (location) => {
            //console.log('location', location)
            //transmettre les données des dernières coordonnées
            setCurrentPosition(location.coords);
            //console.log('position', position)
            const geolocInfos = {
              email: user.email,
              lastPosition: {
                latitude: (location.coords.latitude),
                longitude: (location.coords.longitude),
              }}
              console.log(geolocInfos)
            //envoyer les coordonnées à la bd
            fetch(`http://${IP}:3000/users/lastposition`, {
              method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(geolocInfos),
            })
            .then((response) => response.json())
            .then((data) => {
              if (data) {
                console.log('last position added to DB');
                dispatch(addPosition(location.coords));
              }else {console.log('error: last position not added to DB')}
            });
            return (geolocInfos);
          }
        )
      }
    })();
  }, []);

  const fetchData = () => {
    //récupération des infos des helpers autour
    fetch(`http://${IP}:3000/users`)
    .then((response) => response.json())
    .then((data) => {
      if (data) {
        console.log('data phone:',data);
        let usersGeoloc = [];
        for (let item of data) {
          //tri sur les helpers disponibles
          if ((item.isAvailable) && (item.email != user.email)) {
            //récupération des infos utiles
            const itemInfos = {
              email: item.email,
              prenom: item.prenom,
              coordonneesGPS: item.lastPosition,
              settings: item.userActions,
              connected: item.isConnected,
              uri: item.avatarUri,
              favorites: item.favouritesHelpers,
              telephone: item.telephone,
            }
            usersGeoloc.push(itemInfos);
          }
        }
        //console.log('store:', persistStore.AsyncStorage)
        console.log('users:', usersGeoloc);
        setDataArray(usersGeoloc);
      }
    })
  }
  


  // séléction du helper et envoi des données au reducer selectedHelper
  const selectHelper = (data) => {
    
   const selectedHelper = {
      email: data.email,
      prenom: data.prenom,
      avatarUri: data.uri,
      isConnected: data.connected,
      isReadyToAccomodate: data.settings.hebergement,
      isReadyToLift: data.settings.transport,
      isReadyToAssist: data.settings.accompagnementDistance,
      isReadyToMove: data.settings.aller,
      mustComeToMe: data.settings.venir,
      latitude: data.coordonneesGPS.latitude,
      longitude: data.coordonneesGPS.longitude,
      telephone: data.telephone,
    }
    console.log('select helpr func', selectedHelper);
    dispatch(addHelperInfos(selectedHelper))
    navigation.navigate('HelperConfirmRequest')
  }
 

  //Appelle fetchData toutes les 30 secondes
  useEffect(() => {
    const interval = setInterval(() => {
      fetchData();
    }, 30000);
  
    return () => clearInterval(interval);
  }, []);

  //maper sur la data du store pour afficher les helpers disponibles
  const helpers = dataArray.map((data, i) => {
    console.log('maping data:', data);

    //récupérer les Helpers favoris
    const likedHelpersFromDb = dataArray.filter((e) => e.email === user.email);
    console.log('likedHelpersFromDb:', likedHelpersFromDb);

    // Like or dislike helper
    const updateLikedHelpers = () => {
    if (likedHelpers.find(helper => helper.email === data.email)) {
      setLikedHelpers(likedHelpers.filter(helper => helper.email !== data.email));
    } else {
      setLikedHelpers([...likedHelpers, data.email]);
    }
  };

    //calculer la distance
    const eloignement = distance(data.coordonneesGPS.latitude, data.coordonneesGPS.longitude, position.latitude, position.longitude);
    console.log('distance:',eloignement, data.connected);
    return (
      <TouchableOpacity key={i} style={styles.cardContent} 
      onPress={() => selectHelper(data) }>
        <View style={styles.leftContent}>
          <Image source={{ uri: `${data.uri}` }} style={styles.profilePic}></Image>
        </View>
        <View style={styles.middleContent}>
          <Text style={styles.name}>{data.prenom}</Text>
          <View style={styles.settingsContent}>
            <FontAwesome name="circle" style={styles.circles} color={data.settings.hebergement? '#5CA4A9': "#E4513D"} />
            <Text style={styles.description}>Accueillir</Text>
          </View>
          <View style={styles.settingsContent}>
            <FontAwesome name="circle" style={styles.circles} color={data.settings.transport? '#5CA4A9': "#E4513D"} />
            <Text style={styles.description}>Transporter</Text>
          </View>
          <View style={styles.settingsContent}>
            <FontAwesome name="circle" style={styles.circles} color={data.settings.accompagnementDistance? '#5CA4A9': "#E4513D"} />
            <Text style={styles.description}>Accompagner</Text>
          </View>
        </View>
        <View style={styles.rightContent}>
          <View style={styles.iconsContent}>
            <FontAwesome name="circle" size={20} color={data.connected? '#5CA4A9': "#E4513D"} />
          </View>
          <Text style={styles.distance}>{eloignement}</Text>
        </View>
      </TouchableOpacity>
    );
  });

  

  //maper sur la data pour afficher les helpers disponibles sur la carte avec un marker
  const markers = dataArray.map((data, i) => {

    //affichage du marker sur la carte
    return <Marker key={i} coordinate={{ latitude: data.coordonneesGPS.latitude, longitude: data.coordonneesGPS.longitude }} title={data.prenom} pinColor="#E4513D"/>;
  });

  const [isLoaded] = useFonts({
    'OpenSans': require("../../assets/OpenSans/OpenSans-Regular.ttf"),
    'Raleway': require('../../assets/Raleway/static/Raleway-Regular.ttf')
    });
  if(!isLoaded) {
    return <View />
  }
  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <TouchableOpacity style={styles.header} onPress={() => navigation.navigate('TabNavigator', { screen: 'Profil' })}>
        <Text style={styles.nameText}>{user.prenom}</Text>
        <Image source={{ uri: `${user.avatarUri}` }} style={styles.profilePic}></Image>
      </TouchableOpacity>
      <Text style={styles.helpersText}>Helpers proches de toi</Text>
      <SafeAreaView style={styles.mapContainer}>
      {currentPosition && <MapView mapType="standard" 
      showsUserLocation={true} 
      followsUserLocation={true} 
      initialRegion={{
        latitude: currentPosition.latitude,
        longitude: currentPosition.longitude,
        latitudeDelta: 0.06,
        longitudeDelta: 0.06,
      }} 
      style={styles.map}>
        {markers}
      </MapView>}
      </SafeAreaView>
      <ScrollView style={styles.helpersContainer} alignItems={'center'}>
      {helpers}
      <ActivityIndicator size="large" color="#5CA4A9" />
      </ScrollView>
    </KeyboardAvoidingView>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 2,
      backgroundColor: '#ffffff',
      alignItems: 'center',
      justifyContent: 'flex-start',
      paddingTop: 35,
  },
  header: {
    flexDirection: 'row',
    width: '100%',
    alignItems: "center",
    justifyContent: 'space-between',
    paddingLeft: 15,
    paddingRight: 15,
  },
  nameText: {
    width: '80%',
    fontSize: 24,
    color: "#33355C",
    fontWeight: '400',
    fontFamily: 'Raleway',
  },
    helpersText: {
      width: '80%',
      fontSize: 24,
      fontWeight: '600',
      paddingBottom: 10,
      color: "#33355C",
      textAlign: 'center',
      fontFamily: 'Raleway',
    },
    button: {
      display: 'flex',
      alignItems: 'center',
      paddingTop: 8,
      width: '80%',
      backgroundColor: 'blue',
      borderRadius: 10,
      marginBottom: 10,
    },
    textButton: {
      color: '#ffffff',
      height: 30,
      fontWeight: '600',
      fontSize: 16,
    },
    mapContainer: {
      flex: 1,
      width: '100%',
      minHeight: 300,
      alignItems: 'center',
      justifyContent: 'center',
    },
    map: {
      flex: 1,
      width: "92%",
    },
    helpersContainer: {
      flex: 1,
      width: '100%',
      minHeight: 120,
    },
    cardContent: {
      width: "96%",
      height: 110,
      marginTop: 5,
      marginBottom: 3,
      backgroundColor: "white",
      flexDirection: "row",
      alignItems: 'center',
      justifyContent: 'space-around',
      borderStyle: 'solid',
      borderTopWidth: 0.5,
      borderLeftWidth: 0.5,
      borderRightWidth: 1.5,
      borderBottomWidth: 1.5,
      borderColor: '#E6EBE0',
      borderRadius: 5,
      paddingBottom: 10,
      paddingTop: 10,
      paddingRight: 20,
    },
    leftContent: {
      flexDirection: "row",
      alignItems: "center",
      paddingLeft: 25,
    },
    profilePic: {
      width: 40,
      height: 40,
      borderRadius: 50,
    },
    middleContent: {
      marginLeft: 50,
      color: '#33355C'
    },
    name: {
      fontSize: 20,
      color: "#5CA4A9",
      fontFamily: 'Raleway',
    },
    circles: {
      fontSize: 20,
      paddingTop: 4,
    },
    description: {
      fontSize: 16,
      color: "#33355C",
      fontFamily: 'Raleway',
      paddingLeft: 10,
    },
    settingsContent: {
      flexDirection: 'row',
    },
    rightContent: {
      marginLeft: 80,
      marginRight: 20,
      alignItems: 'center',
      justifyContent: 'space-around',
    },
    iconsContent: {
      flexDirection: 'row',
    },
    isFavorite: {
      marginRight: 20,
    },
    distance: {
      fontSize: 16,
      color: "#33355C",
      fontFamily: 'Raleway',
      paddingTop: 35,
    },
});