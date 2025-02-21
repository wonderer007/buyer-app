import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Image, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as VideoThumbnails from 'expo-video-thumbnails';

const { width } = Dimensions.get('window');

export default function NewAdScreen() {
  const [videoUri, setVideoUri] = useState<string | null>(null);
  const [videoThumbnail, setVideoThumbnail] = useState<string | null>(null);
  const [photos, setPhotos] = useState<string[]>([]);

  const requestPermissions = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
        return false;
      }
    }
    return true;
  };

  const pickVideo = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['videos'],
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        setVideoUri(result.assets[0].uri);
        try {
          const { uri } = await VideoThumbnails.getThumbnailAsync(result.assets[0].uri, {
            time: 0,
          });
          setVideoThumbnail(uri);
        } catch (e) {
          console.warn('Error generating thumbnail:', e);
        }
      }
    } catch (error) {
      console.error('Error picking video:', error);
      alert('Error picking video. Please try again.');
    }
  };

  const pickPhoto = async (index: number) => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        const newPhotoUri = result.assets[0].uri;
        setPhotos(current => {
          const updated = [...current];
          updated[index] = newPhotoUri;
          return updated;
        });
      }
    } catch (error) {
      console.error('Error picking photo:', error);
      alert('Error picking photo. Please try again.');
    }
  };

  const handleInfoPress = () => {
    // For now, just show an alert
    alert('Information form coming soon!');
  };

  const handleMapPress = () => {
    // For now, just show an alert
    alert('Map picker coming soon!');
  };

  return (
    <View style={styles.container}>
      {/* First Row - H1 and H2 */}
      <View style={styles.row}>
        {/* H1 Section - Video Picker */}
        <View style={styles.h1Container}>
          <TouchableOpacity 
            style={styles.videoSection} 
            onPress={pickVideo}
            activeOpacity={0.7}
          >
            {videoThumbnail ? (
              <Image source={{ uri: videoThumbnail }} style={styles.thumbnail} />
            ) : (
              <View style={styles.iconContainer}>
                <Ionicons name="videocam" size={40} color="#fff" />
                <Text style={styles.iconText}>Add Video</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* H2 Section - Photos Picker */}
        <View style={styles.h2Container}>
          <View style={styles.photoGrid}>
            {[...Array(4)].map((_, index) => (
              <TouchableOpacity
                key={`photo-${index}`}
                style={[
                  styles.photoCell,
                  index >= 2 ? styles.photoCellBottom : null
                ]}
                onPress={() => pickPhoto(index)}
                activeOpacity={0.7}
              >
                {photos[index] ? (
                  <Image source={{ uri: photos[index] }} style={styles.photoThumbnail} />
                ) : (
                  <View style={styles.emptyPhotoCell}>
                    <Ionicons name="add" size={24} color="#fff" />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      {/* Second Row - H3 and H4 */}
      <View style={styles.row}>
        {/* H3 Section - Information */}
        <TouchableOpacity 
          style={styles.h3Container}
          onPress={handleInfoPress}
          activeOpacity={0.7}
        >
          <View style={styles.iconContainer}>
            <Ionicons name="information-circle" size={40} color="#fff" />
            <Text style={styles.iconText}>Add Information</Text>
          </View>
        </TouchableOpacity>

        {/* H4 Section - Map Picker */}
        <TouchableOpacity 
          style={styles.h4Container}
          onPress={handleMapPress}
          activeOpacity={0.7}
        >
          <View style={styles.iconContainer}>
            <Ionicons name="map" size={40} color="#fff" />
            <Text style={styles.iconText}>Add Location</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  h1Container: {
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: '#333',
  },
  h2Container: {
    flex: 1,
  },
  h3Container: {
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  h4Container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    color: '#fff',
    marginTop: 8,
    fontSize: 16,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  photoGrid: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 8,
  },
  photoCell: {
    width: '48%',
    height: '48%',
    backgroundColor: '#333',
    borderRadius: 8,
    overflow: 'hidden',
    margin: '1%',
  },
  photoCellBottom: {
    marginTop: '1%',
  },
  photoThumbnail: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  emptyPhotoCell: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#333',
  },
});
