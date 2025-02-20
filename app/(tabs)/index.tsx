import React, { useState, useRef } from 'react';
import { View, StyleSheet, FlatList, Dimensions, ViewToken } from 'react-native';
import PropertyVideo from '../../components/PropertyVideo';

const { height } = Dimensions.get('window');

const SAMPLE_PROPERTIES = [
  {
    id: "1",
    title: "Luxury 4 BHK with Marina View",
    price: "3.2M AED",
    videoUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    size: "1,350 sq ft",
    location: "Dubai Marina",
    beds: 2,
    baths: 2,
    amenities: ["Infinity Pool", "State-of-the-art Gym", "Private Parking", "Beachfront Access", "24/7 Concierge", "Spacious Balcony"],
    images: [
      "https://images.unsplash.com/photo-1522444195799-478538b28823?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1MTY0Mzd8MHwxfHNlYXJjaHwxfHxEdWJhaSUyMEx1eHVyeSUyMEhvbWV8ZW58MHx8fHwxNzM5NjQ5OTk4fDA&ixlib=rb-4.0.3&q=80&w=1080",
      "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1MTY0Mzd8MHwxfHNlYXJjaHwyfHxEdWJhaSUyMEx1eHVyeSUyMEhvbWV8ZW58MHx8fHwxNzM5NjQ5OTk4fDA&ixlib=rb-4.0.3&q=80&w=1080",
      "https://images.unsplash.com/photo-1518684079-3c830dcef090?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1MTY0Mzd8MHwxfHNlYXJjaHwzfHxEdWJhaSUyMEx1eHVyeSUyMEhvbWV8ZW58MHx8fHwxNzM5NjQ5OTk4fDA&ixlib=rb-4.0.3&q=80&w=1080",
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1MTY0Mzd8MHwxfHNlYXJjaHw0fHxEdWJhaSUyMEx1eHVyeSUyMEhvbWV8ZW58MHx8fHwxNzM5NjQ5OTk4fDA&ixlib=rb-4.0.3&q=80&w=1080"
    ]
  },
  {
    id: "2",
    title: "Exclusive 3 BHK with Private Beach",
    price: "4.5M AED",
    videoUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    size: "1,950 sq ft",
    location: "Palm Jumeirah",
    beds: 3,
    baths: 4,
    amenities: ["Private Beach", "Smart Home System", "Maid's Room", "Panoramic Sea Views", "Concierge Service", "Underground Parking"],
    images: [
      "https://images.unsplash.com/photo-1532372576444-dda954194ad0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1MTY0Mzd8MHwxfHNlYXJjaHw1fHxEdWJhaSUyMEx1eHVyeSUyMEhvbWV8ZW58MHx8fHwxNzM5NjQ5OTk4fDA&ixlib=rb-4.0.3&q=80&w=1080",
      "https://images.unsplash.com/photo-1467043153537-a4fba2cd39ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1MTY0Mzd8MHwxfHNlYXJjaHw2fHxEdWJhaSUyMEx1eHVyeSUyMEhvbWV8ZW58MHx8fHwxNzM5NjQ5OTk4fDA&ixlib=rb-4.0.3&q=80&w=1080",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1MTY0Mzd8MHwxfHNlYXJjaHw3fHxEdWJhaSUyMEx1eHVyeSUyMEhvbWV8ZW58MHx8fHwxNzM5NjQ5OTk4fDA&ixlib=rb-4.0.3&q=80&w=1080",
      "https://images.unsplash.com/photo-1528702748617-c64d49f918af?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1MTY0Mzd8MHwxfHNlYXJjaHw4fHxEdWJhaSUyMEx1eHVyeSUyMEhvbWV8ZW58MHx8fHwxNzM5NjQ5OTk4fDA&ixlib=rb-4.0.3&q=80&w=1080"
    ]
  },
  {
    id: "3",
    title: "Modern Studio with Canal View",
    price: "1.5M AED",
    videoUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    size: "600 sq ft",
    location: "Business Bay",
    beds: 1,
    baths: 1,
    amenities: ["Fully Furnished", "City Skyline View", "Walking Distance to Metro", "Rooftop Pool", "24/7 Security", "Pet-Friendly Building"],
    images: [
      "https://images.unsplash.com/photo-1501127122-f385ca6ddd9d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1MTY0Mzd8MHwxfHNlYXJjaHw5fHxEdWJhaSUyMEx1eHVyeSUyMEhvbWV8ZW58MHx8fHwxNzM5NjQ5OTk4fDA&ixlib=rb-4.0.3&q=80&w=1080",
      "https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1MTY0Mzd8MHwxfHNlYXJjaHwxMHx8RHViYWklMjBMdXh1cnklMjBIb21lfGVufDB8fHx8MTczOTY0OTk5OHww&ixlib=rb-4.0.3&q=80&w=1080",
      "https://images.unsplash.com/photo-1518684079-3c830dcef090?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1MTY0Mzd8MHwxfHNlYXJjaHwxfHxEdWJhaSUyMEhpZ2glMjBSYWlzZXxlbnwwfHx8fDE3Mzk2NTAxNTJ8MA&ixlib=rb-4.0.3&q=80&w=1080",
      "https://images.unsplash.com/photo-1528702748617-c64d49f918af?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1MTY0Mzd8MHwxfHNlYXJjaHwyfHxEdWJhaSUyMEhpZ2glMjBSYWlzZXxlbnwwfHx8fDE3Mzk2NTAxNTJ8MA&ixlib=rb-4.0.3&q=80&w=1080"
    ]
  },
  {
    id: "4",
    title: "Ultra-Modern Penthouse with Burj Khalifa View",
    price: "12.5M AED",
    videoUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    size: "4,500 sq ft",
    location: "Downtown Dubai",
    beds: 4,
    baths: 6,
    amenities: ["Private Infinity Pool", "Burj Khalifa & Fountain View", "Smart Home Integration", "Private Elevator", "Sky Garden", "Home Theatre"],
    images: [
      "https://images.unsplash.com/photo-1489516408517-0c0a15662682?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1MTY0Mzd8MHwxfHNlYXJjaHwzfHxEdWJhaSUyMEhpZ2glMjBSYWlzZXxlbnwwfHx8fDE3Mzk2NTAxNTJ8MA&ixlib=rb-4.0.3&q=80&w=1080",
      "https://images.unsplash.com/photo-1523212307269-b5645414b985?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1MTY0Mzd8MHwxfHNlYXJjaHw0fHxEdWJhaSUyMEhpZ2glMjBSYWlzZXxlbnwwfHx8fDE3Mzk2NTAxNTJ8MA&ixlib=rb-4.0.3&q=80&w=1080"
    ]
  },
  {
    id: "5",
    title: "Cozy 1 BHK with Stunning Marina View",
    price: "2.2M AED",
    videoUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    size: "850 sq ft",
    location: "Jumeirah Beach Residence (JBR)",
    beds: 1,
    baths: 2,
    amenities: ["Beachfront Living", "Fully Furnished", "Walk-in Wardrobe", "Gym & Spa Access", "Underground Parking", "Restaurants & Cafes Nearby"],
    images: [
      "https://images.unsplash.com/photo-1506645728556-ac574e628eca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1MTY0Mzd8MHwxfHNlYXJjaHw1fHxEdWJhaSUyMEhpZ2glMjBSYWlzZXxlbnwwfHx8fDE3Mzk2NTAxNTJ8MA&ixlib=rb-4.0.3&q=80&w=1080",
      "https://images.unsplash.com/photo-1549944850-84e00be4203b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1MTY0Mzd8MHwxfHNlYXJjaHw2fHxEdWJhaSUyMEhpZ2glMjBSYWlzZXxlbnwwfHx8fDE3Mzk2NTAxNTJ8MA&ixlib=rb-4.0.3&q=80&w=1080",
      "https://images.unsplash.com/photo-1533395427226-788cee25cc7b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1MTY0Mzd8MHwxfHNlYXJjaHw3fHxEdWJhaSUyMEhpZ2glMjBSYWlzZXxlbnwwfHx8fDE3Mzk2NTAxNTJ8MA&ixlib=rb-4.0.3&q=80&w=1080",
      "https://images.unsplash.com/photo-1514940245129-c722210fed59?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1MTY0Mzd8MHwxfHNlYXJjaHw4fHxEdWJhaSUyMEhpZ2glMjBSYWlzZXxlbnwwfHx8fDE3Mzk2NTAxNTJ8MA&ixlib=rb-4.0.3&q=80&w=1080"
    ]
  }
];


export default function HomeScreen() {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef(null);

  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems[0] != null) {
      setActiveIndex(viewableItems[0].index ?? 0);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  
  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={SAMPLE_PROPERTIES}
        renderItem={({ item, index }) => (
          <PropertyVideo property={item} isActive={index === activeIndex} />
        )}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        vertical
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        snapToInterval={height}
        snapToAlignment="start"
        decelerationRate="fast"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
});