import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
  Image,
  TouchableOpacity,
} from 'react-native';
import { Video } from 'expo-av';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import PagerView from 'react-native-pager-view';
import { usePathname } from 'expo-router';

const { width, height } = Dimensions.get('window');

interface PropertyDetails {
  id: string;
  title: string;
  price: string;
  videoUrl: string;
  size: string;
  location: string;
  beds: number;
  baths: number;
  amenities: string[];
  images?: string[];
}

interface PropertyVideoProps {
  property: PropertyDetails;
  isActive: boolean;
}

export default function PropertyVideo({ property, isActive }: PropertyVideoProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [showPlayIcon, setShowPlayIcon] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [showInfo, setShowInfo] = useState(false);
  const pathname = usePathname();

  const propertyImages = property.images;

  useEffect(() => {
    // Pause video when not on the home tab
    if (pathname !== '/') {
      setIsPlaying(false);
    } else {
      setIsPlaying(isActive && currentPage === 0 && !showInfo);
    }
  }, [isActive, currentPage, showInfo, pathname]);

  const handleVideoPress = () => {
    if (currentPage === 0 && isActive) {
      setIsPlaying(!isPlaying);
      setShowPlayIcon(true);
      setTimeout(() => setShowPlayIcon(false), 1000);
    }
  };

  const toggleInfo = () => {
    setShowInfo(!showInfo);
    if (currentPage === 0) {
      setIsPlaying(false);
    }
  };

  const renderVideoPage = () => (
    <TouchableWithoutFeedback onPress={handleVideoPress}>
      <View style={styles.videoContainer}>
        <Video
          source={{ uri: property.videoUrl }}
          style={styles.video}
          resizeMode="cover"
          shouldPlay={isActive && isPlaying && currentPage === 0}
          isLooping
          isMuted={false}
        />
        {showPlayIcon && currentPage === 0 && (
          <View style={styles.playIconContainer}>
            <Ionicons
              name={isPlaying ? "pause" : "play"}
              size={50}
              color="white"
              style={styles.playIcon}
            />
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );

  const renderLocationPage = () => (
    <BlurView intensity={100} style={styles.pageContainer}>
      <View style={styles.locationPageContainer}>
        <Ionicons name="location" size={40} color="#fff" style={styles.locationIcon} />
        <Text style={styles.locationTitle}>Location</Text>
        <Text style={styles.locationText}>{property.location}</Text>
        <View style={styles.mapPlaceholder}>
          <Ionicons name="map" size={100} color="#fff" style={{ opacity: 0.5 }} />
          <Text style={styles.mapText}>Map View</Text>
        </View>
      </View>
    </BlurView>
  );

  const renderPhotoPage = (imageUrl: string, index: number) => (
    <View key={`photo-${index}`} style={styles.photoContainer}>
      <Image source={{ uri: imageUrl }} style={styles.fullScreenImage} />
    </View>
  );

  return (
    <View style={styles.container}>
      <PagerView
        style={styles.container}
        initialPage={0}
        onPageSelected={(e) => {
          setCurrentPage(e.nativeEvent.position);
          if (showInfo) {
            setShowInfo(false);
          }
        }}
      >
        {renderVideoPage()}
        {renderLocationPage()}
        {propertyImages.map((imageUrl, index) => renderPhotoPage(imageUrl, index))}
      </PagerView>

      {showInfo && (
        <BlurView intensity={50} tint="dark" style={styles.infoOverlay}>
          <View style={styles.infoContent}>
            <TouchableOpacity 
              style={styles.closeButton} 
              onPress={() => setShowInfo(false)}
            >
              <Ionicons name="close" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.infoTitle}>Property Details</Text>
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Ionicons name="bed-outline" size={24} color="#fff" />
                <Text style={styles.infoText}>{property.beds} Beds</Text>
              </View>
              <View style={styles.infoItem}>
                <Ionicons name="water-outline" size={24} color="#fff" />
                <Text style={styles.infoText}>{property.baths} Baths</Text>
              </View>
              <View style={styles.infoItem}>
                <Ionicons name="resize-outline" size={24} color="#fff" />
                <Text style={styles.infoText}>{property.size}</Text>
              </View>
            </View>
            <Text style={styles.amenitiesTitle}>Amenities</Text>
            <View style={styles.amenitiesList}>
              {property.amenities.map((amenity, index) => (
                <View key={`amenity-${index}`} style={styles.amenityItem}>
                  <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
                  <Text style={styles.amenityText}>{amenity}</Text>
                </View>
              ))}
            </View>
          </View>
        </BlurView>
      )}

      <View style={styles.contentContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{property.title}</Text>
          <View style={styles.priceContainer}>
            <Text style={styles.price}>{property.price}</Text>
            <TouchableWithoutFeedback onPress={toggleInfo}>
              <View style={styles.seeMoreButton}>
                <Text style={styles.seeMoreText}>See More</Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>
      </View>

      <View style={styles.paginationContainer}>
        <View style={styles.paginationDots}>
          {[0, 1, ...Array(propertyImages.length).keys()].map((_, index) => (
            <View
              key={`dot-${index}`}
              style={[
                styles.paginationDot,
                currentPage === index && styles.paginationDotActive,
              ]}
            />
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width,
    height,
  },
  videoContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  pageContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
  },
  playIconContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  playIcon: {
    opacity: 0.9,
  },
  contentContainer: {
    position: 'absolute',
    bottom: 80,
    left: 0,
    right: 0,
    padding: 20,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  price: {
    color: '#fff',
    fontSize: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
    marginRight: 8,
  },
  seeMoreButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  seeMoreText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  locationPageContainer: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
  },
  locationIcon: {
    marginBottom: 20,
  },
  locationTitle: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  locationText: {
    color: '#fff',
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 40,
  },
  mapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
  },
  mapText: {
    color: '#fff',
    marginTop: 10,
    opacity: 0.5,
  },
  photoContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  fullScreenImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  paginationContainer: {
    position: 'absolute',
    bottom: 80,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  paginationDots: {
    flexDirection: 'row',
    gap: 8,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  paginationDotActive: {
    backgroundColor: '#fff',
    width: 24,
  },
  infoOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  infoContent: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 1,
    padding: 8,
  },
  infoTitle: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  infoItem: {
    alignItems: 'center',
  },
  infoText: {
    color: '#fff',
    marginTop: 8,
    fontSize: 16,
  },
  amenitiesTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  amenitiesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  amenityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 8,
    borderRadius: 8,
    gap: 4,
  },
  amenityText: {
    color: '#fff',
    fontSize: 14,
  },
});