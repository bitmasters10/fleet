import React, { useContext, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { AuthContext } from "../context/AuthContext";
import { useNavigation } from "@react-navigation/native";
const HOME="http://172.20.10.2:3000"
const home = HOME;


const ProfileScreen = () => {
  const { user, logout } = useContext(AuthContext);
  const navigation = useNavigation();
  const HOME="http://192.168.1.243:3000"
   const home = HOME;


  // State to control visibility of images
  const [showAadhar, setShowAadhar] = useState(false);
  const [showPan, setShowPan] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigation.navigate("Login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.profileSection}>
          <Image
            source={{
              uri: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-Sff3YZXkjD9kgp0i3sA4MQzPoP3MY1.png",
            }}
            style={styles.profileImage}
          />
          <Text style={styles.profileName}>{user?.NAME}</Text>
          <Text style={styles.profileHandle}>@{user?.NAME.toLowerCase()}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Driver Information</Text>
          <Text style={styles.documentItem}>Driver ID: {user?.DRIVER_ID}</Text>
          <Text style={styles.documentItem}>Email: {user?.EMAIL_ID}</Text>
          <Text style={styles.documentItem}>
            License No: {user?.LICENSE_NO}
          </Text>
          <Text style={styles.documentItem}>Gender: {user?.GENDER}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Identity Documents</Text>

          {/* Aadhaar Card Section */}
          <View style={styles.documentCard}>
            <Icon name="card-account-details" size={24} color="#4FA89B" />
            <View style={styles.documentInfo}>
              <Text style={styles.documentTitle}>Aadhar Card</Text>
              <Text style={styles.documentNumber}>XXXX-XXXX-1234</Text>
            </View>
            <TouchableOpacity
              style={styles.viewButton}
              onPress={() => setShowAadhar(!showAadhar)}
            >
              <Text style={styles.viewButtonText}>
                {showAadhar ? "Hide" : "View"}
              </Text>
            </TouchableOpacity>
          </View>

          {showAadhar && (
            <Image
              source={{
                uri: `${home}/admin/img/driver-view/${user?.DRIVER_ID}/adharcard`,
              }}
              style={styles.documentImage}
            />
          )}

          {/* PAN Card Section */}
          <View style={styles.documentCard}>
            <Icon name="card-text" size={24} color="#4FA89B" />
            <View style={styles.documentInfo}>
              <Text style={styles.documentTitle}>PAN Card</Text>
              <Text style={styles.documentNumber}>ABCDE1234F</Text>
            </View>
            <TouchableOpacity
              style={styles.viewButton}
              onPress={() => setShowPan(!showPan)}
            >
              <Text style={styles.viewButtonText}>
                {showPan ? "Hide" : "View"}
              </Text>
            </TouchableOpacity>
          </View>

          {showPan && (
            <Image
              source={{
                uri: `${home}/admin/img/driver-view/${user?.DRIVER_ID}/pancard`,
              }}
              style={styles.documentImage}
            />
          )}
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    marginTop: -20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: "#fff",
  },
  profileSection: {
    alignItems: "center",
    paddingVertical: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "#fff",
  },
  profileName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginTop: 12,
  },
  profileHandle: {
    fontSize: 16,
    color: "#666",
    marginTop: 4,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 16,
  },
  documentItem: {
    fontSize: 16,
    color: "#333",
    marginBottom: 8,
  },
  documentCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    marginBottom: 12,
  },
  documentInfo: {
    flex: 1,
    marginLeft: 12,
  },
  documentTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  documentNumber: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  viewButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#4FA89B",
    borderRadius: 8,
  },
  viewButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
  documentImage: {
    width: "100%",
    height: 200,
    resizeMode: "contain",
    marginTop: 10,
    borderRadius: 8,
  },
  logoutButton: {
    backgroundColor: "red",
    borderRadius: 25,
    padding: 15,
    margin: 24,
    alignItems: "center",
  },
  logoutButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
});

export default ProfileScreen;
