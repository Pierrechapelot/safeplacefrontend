import {
  Button,
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { Camera, CameraType, FlashMode } from "expo-camera";
import { useDispatch } from "react-redux";
import { addSelfie, deleteSelfie } from "../../reducers/selfie";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useIsFocused } from "@react-navigation/native";

export default function SelfieScreen({ navigation }) {
  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  const [hasPermission, setHasPermission] = useState(false);
  const [type, setType] = useState(CameraType.front);
  const [flashMode, setFlashMode] = useState(FlashMode.off);

  let cameraRef: any = useRef(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const takePicture = async () => {
    const photo = await cameraRef.takePictureAsync({ quality: 0.3 });
    dispatch(addSelfie(photo.uri));
  };

  if (!hasPermission || !isFocused) {
    return <View />;
  }
  return (
    <View
      style={styles.container}
      // behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.topContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Welcome to Safe Place</Text>
        </View>
        <Text style={styles.instructions}>
          Prends un Selfie avec la main droite levée ✋
        </Text>
        <Text style={styles.explanations}>
          Tu pourras ensuite la modifier dans ton profil utilisateur.
        </Text>
      </View>

      <Camera
        type={type}
        flashMode={flashMode}
        ref={(ref: any) => (cameraRef = ref)}
        style={styles.camera}
      >
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            onPress={() =>
              setType(
                type === CameraType.back ? CameraType.front : CameraType.back
              )
            }
            style={styles.flashButton}
          >
            <FontAwesome name="rotate-right" size={25} color="#ffffff" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>
              setFlashMode(
                flashMode === FlashMode.off ? FlashMode.torch : FlashMode.off
              )
            }
            style={styles.flashButton}
          >
            <FontAwesome
              name="flash"
              size={25}
              color={flashMode === FlashMode.off ? "#ffffff" : "#e8be4b"}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.snapContainer}>
          <TouchableOpacity onPress={() => cameraRef && takePicture()}>
            <FontAwesome name="circle-thin" size={95} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </Camera>

      <TouchableOpacity
        style={styles.button}
        activeOpacity={0.9}
        onPress={() => navigation.navigate("Account")}
      >
        <Text style={styles.textButton}>
          Naviguer vers msg confirmation compte
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  camera: {
    flex: 2,
    alignItems: 'center',
    width: '100%',
  },
  buttonsContainer: {
    flex: 0.1,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingTop: 20,
    paddingLeft: 20,
    paddingRight: 20,
  },
  flashButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    borderRadius: 50,
    marginLeft: 10,
    marginRight: 10,
  },
  snapContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    paddingBottom: 25,
  },
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    alignItems: "center",
    marginBottom: 70,
    // justifyContent: "center",
  },
  topContent: {
    flex: 1,
    marginTop: 50,
  },
  header: {
    alignItems: "center",
  },
  button: {
    alignItems: "center",
    paddingTop: 8,
    width: "80%",
    // marginTop: 30,
    backgroundColor: "blue",
    borderRadius: 10,
    // marginBottom: 80,
  },
  textButton: {
    color: "#ffffff",
    height: 30,
    fontWeight: "600",
    fontSize: 16,
  },
  title: {
    fontSize: 36,
    color: "#5CA4A9",
  },
  instructions: {
    color: "#33355C",
    fontSize: 20,
    marginTop: 30,
    marginLeft: 19,
    marginRight: 19,
  },
  explanations: {
    marginLeft: 19,
    marginRight: 19,
    marginTop: 24,
    color: "#33355C",
    fontSize: 16,
    fontStyle: "italic",
  },
});