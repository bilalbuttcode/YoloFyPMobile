import React, { useEffect, useState } from 'react';
import {
  View, StyleSheet, Button, Image, Dimensions, ActivityIndicator, Alert, Platform, PermissionsAndroid, Text
} from 'react-native';
import { launchImageLibrary, launchCamera, Asset } from 'react-native-image-picker';
import Svg, { Rect } from 'react-native-svg';
import { readFile } from 'react-native-fs'; // Install via `npm i react-native-fs`
import * as mime from 'react-native-mime-types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../components/types/types'
import { BASE_URL } from '../config';
import { useNavigation } from '@react-navigation/native';
type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Detect'>;


type Detection = {
  bbox: [number, number, number, number];
  confidence: number;
  label: string;
};

const { width: W, height: H } = Dimensions.get('window');

const DetectScreen: React.FC = () => {
  const [data, setData] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [detections, setDetections] = useState<Detection[]>([]);
  const [serverImageUrl, setServerImageUrl] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const navigation = useNavigation<NavigationProp>();
  const logout = async () => {
    await AsyncStorage.removeItem('username');
    await AsyncStorage.removeItem('password');
    navigation.replace('Login');
  };
  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      try {
        const cameraGranted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
        );
        const storageGranted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        );
        return cameraGranted === PermissionsAndroid.RESULTS.GRANTED &&
          storageGranted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true; // iOS auto-handles this via Info.plist
  };


  // useEffect(() => {
  //   console.log("Fetching from API...");
  //   fetch(`${BASE_URL}/api/hello`)
  //     .then(res => {
  //       if (!res.ok) {
  //         throw new Error(`HTTP error! status: ${res.status}`);
  //       }
  //       return res.json();
  //     })
  //     .then(data => {
  //       console.log(data);
  //       setData(JSON.stringify(data));
  //       Alert.alert(JSON.stringify(data));
  //     })
  //     .catch(err => {
  //       console.error('Fetch Error:', err);
  //       setError(err.message);
  //     });
  // }, []);



  const handleImage = async (asset: Asset) => {
    console.log('working');
    const uri = asset.uri!;
    const type = mime.lookup(uri) || 'image/jpeg';
    const name = asset.fileName || 'image.jpg';

    setPhotoUri(uri);
    setBusy(true);


    try {
      // Read image file as base64
      const base64Image = await readFile(uri, 'base64');

      const payload = {
        image: `data:${type};base64,${base64Image}`,
      };
      console.log(payload, 'pay');


      const res = await fetch(`${BASE_URL}/mobiledetection`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      setDetections(json.detections);
      const updatedUrl = json.image_url.replace('http://localhost:5000', `${BASE_URL}`);

      // setServerImageUrl(updatedUrl);
      // console.log(json);
      if (updatedUrl &&json.detections ) {
         navigation.navigate('ShowImage', {
        imageUrl: updatedUrl,
        detections: json.detections
      });
        
      }
     

      if (json.detections.length > 0) {
        const summary = json.detections
          .map((d: any, i: number) => `${i + 1}. ${d.label} (${(d.confidence * 100).toFixed(1)}%)`)
          .join('\n');
        Alert.alert('Detections Found', summary);
      } else {
        Alert.alert('No Objects Detected', 'Try with another image.');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to detect objects.');
    } finally {
      setBusy(false);
    }
  };
  const pickImage = async () => {
    // const permission = await requestPermissions();
    // if (!permission) return Alert.alert('Permission Denied');

    launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (response.didCancel || !response.assets || !response.assets[0]) return;
      handleImage(response.assets[0]);
      // testPost();
    });
  };

  const takePhoto = async () => {
    const permission = await requestPermissions();
    // if (!permission) return Alert.alert('Permission Denied', 'Camera permission is required GO On App setting to turn on location');

    console.log('TAKE');

    launchCamera({ mediaType: 'photo' }, (response) => {
      if (response.didCancel || !response.assets || !response.assets[0]) return;
      handleImage(response.assets[0]);
    });
  };

  const reset = () => {
    setPhotoUri(null);
    setDetections([]);
  };



  return (
    <View style={styles.container}>
       <View style={styles.header}>
        <Text style={styles.title}>Track Scenes</Text>
        <Button title="Logout" onPress={logout} />
      </View>
      <View style={styles.root}>
        {!photoUri ? (
          <View style={styles.buttonGroup}>
            <Button title="Pick from Gallery" onPress={pickImage} />
            <View style={{ height: 10 }} />
            <Button title="Take Photo" onPress={takePhoto} />
          </View>
        ) : (
          <>
            {serverImageUrl && (
              <Image source={{ uri: serverImageUrl }} style={styles.preview} resizeMode="contain" />
            )}
            <Svg style={StyleSheet.absoluteFill}>
              {detections.map((d, i) => {
                const [x1, y1, x2, y2] = d.bbox;
                return (
                  <Rect
                    key={i}
                    x={x1}
                    y={y1}
                    width={x2 - x1}
                    height={y2 - y1}
                    stroke="lime"
                    strokeWidth={2}
                    fill="transparent"
                  />
                );
              })}
            </Svg>
            <Button title="Pick Another" onPress={reset} />
          </>
        )}
        {busy && <ActivityIndicator style={styles.spinner} size="large" />}
      </View>
    </View>
  );
};

export default DetectScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // padding: 16,
    justifyContent: 'center',
  },
  // title: {
  //   fontSize: 20,
  //   marginBottom: 10,
  // },
  result: {
    fontSize: 16,
    color: 'black',
  },
  root: { flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' },
  preview: { width: W, height: H },
  buttonGroup: { alignItems: 'center' },
  spinner: { position: 'absolute', top: H / 2 - 20, left: W / 2 - 20 },
    header: {
    paddingHorizontal: 16,
    // paddingBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#3ABEF9',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
});
