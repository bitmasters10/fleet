import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";


// Review component
const Review = ({ 
  name, 
  location, 
  date, 
  rating, 
  text, 
  source, 
  avatar 
}) => (
  <View style={styles.reviewCard}>
    <View style={styles.reviewHeader}>
      <View style={styles.reviewerInfo}>
        <Text style={styles.reviewerName}>{name}</Text>
        <Text style={styles.reviewMeta}>{date} • {location}</Text>
      </View>
      <Image 
        source={{ uri: avatar }} 
        style={styles.reviewerAvatar}
      />
    </View>
    <View style={styles.ratingContainer}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Icon 
          key={star}
          name={star <= rating ? "star" : "star-outline"}
          size={16}
          color={star <= rating ? "#FFD700" : "#C4C4C4"}
        />
      ))}
      <Text style={styles.sourceText}>{source}</Text>
    </View>
    <Text style={styles.reviewText}>{text}</Text>
    <TouchableOpacity style={styles.shareButton}>
      <Icon name="share-variant" size={20} color="#666" />
    </TouchableOpacity>
  </View>
);

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.container}>
      
        

        <View style={styles.profileSection}>
          <TouchableOpacity style={styles.actionButton}>
            <Icon name="phone" size={24} color="#4FA89B" />
            <Text style={styles.actionText}>Call</Text>
          </TouchableOpacity>

          <View style={styles.profileImageContainer}>
            <Image
              source={{ uri: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-gh9ztB8E38LQzjywwapUjdkETlUvca.png' }}
              style={styles.profileImage}
            />
          </View>

          <TouchableOpacity style={styles.actionButton}>
            <Icon name="email" size={24} color="#4FA89B" />
            <Text style={styles.actionText}>Email</Text>
          </TouchableOpacity>
        </View>
  
      <View style={styles.profileInfo}>
        <Text style={styles.driverName}>Alfonso Bator</Text>
        <Text style={styles.driverAddress}>750 Sarah Drive Sulphur, LA 70663</Text>
        
        <View style={styles.ratingContainer}>
          <Text style={styles.ratingNumber}>4.3</Text>
          {[1, 2, 3, 4, 5].map((star) => (
            <Icon 
              key={star}
              name={star <= 4 ? "star" : "star-outline"}
              size={20}
              color={star <= 4 ? "#FFD700" : "#C4C4C4"}
            />
          ))}
        </View>
      </View>

      <ScrollView style={styles.reviewsContainer}>
        <Review
          name="Devon Lane"
          location="Mesa, AZ"
          date="Aug 9, 2019"
          rating={4}
          text="If you just need a marketing check up or major surgery Dr. Mortensen is your Man. Hire him."
          source="Google"
          avatar="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-gh9ztB8E38LQzjywwapUjdkETlUvca.png"
        />
        
        <Review
          name="Brooklyn Simmons"
          location="Temecule, Democratic Republic..."
          date="Aug 9, 2019"
          rating={4}
          text="If you just need a marketing check up or major surgery Dr. Mortensen is your Man. Hire him."
          source="BBB"
          avatar="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-gh9ztB8E38LQzjywwapUjdkETlUvca.png"
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  headerGradient: {
    paddingTop: 20,
    paddingBottom: 40,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  closeButton: {
    padding: 8,
  },
  copyButton: {
    padding: 8,
  },
  profileSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 20,
  },
  actionButton: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  actionText: {
    color: '#4FA89B',
    marginTop: 4,
    fontSize: 12,
  },
  profileImageContainer: {
    width: 100,
    height: 100,
    borderRadius: 20,
    backgroundColor: '#fff',
    padding: 3,
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 17,
  },
  profileInfo: {
    alignItems: 'center',
    marginTop: -20,
    padding: 20,
  },
  driverName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  driverAddress: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  ratingNumber: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
    color: '#333',
  },
  reviewsContainer: {
    flex: 1,
    padding: 20,
  },
  reviewCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  reviewerInfo: {
    flex: 1,
  },
  reviewerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  reviewMeta: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  reviewerAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  sourceText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 8,
  },
  reviewText: {
    fontSize: 14,
    color: '#333',
    marginTop: 8,
    lineHeight: 20,
  },
  shareButton: {
    position: 'absolute',
    right: 16,
    bottom: 16,
  },
});