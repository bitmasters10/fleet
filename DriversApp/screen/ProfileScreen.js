import React, { useContext } from "react";
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

const ProfileScreen = () => {
  const { user, logout } = useContext(AuthContext);
  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      await logout();
      navigation.navigate("Login");
      
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const renderMenuItem = (icon, title) => (
    <TouchableOpacity style={styles.menuItem}>
      <View style={styles.menuLeft}>
        <Icon name={icon} size={24} color="#4FA89B" />
        <Text style={styles.menuText}>{title}</Text>
      </View>
      <Icon name="chevron-right" size={24} color="#666" />
    </TouchableOpacity>
  );

  const renderDocumentItem = (title, value) => (
    <View style={styles.documentItem}>
      <Text style={styles.documentLabel}>{title}</Text>
      <Text style={styles.documentValue}>{value}</Text>
    </View>
  );

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
          <View style={styles.documentCard}>
            <Icon name="card-account-details" size={24} color="#4FA89B" />
            <View style={styles.documentInfo}>
              <Text style={styles.documentTitle}>Aadhar Card</Text>
              <Text style={styles.documentNumber}>XXXX-XXXX-1234</Text>
            </View>
            <TouchableOpacity style={styles.viewButton}>
              <Text style={styles.viewButtonText}>View</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.documentCard}>
            <Icon name="card-text" size={24} color="#4FA89B" />
            <View style={styles.documentInfo}>
              <Text style={styles.documentTitle}>PAN Card</Text>
              <Text style={styles.documentNumber}>ABCDE1234F</Text>
            </View>
            <TouchableOpacity style={styles.viewButton}>
              <Text style={styles.viewButtonText}>View</Text>
            </TouchableOpacity>
          </View>
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
    backgroundColor: "#4FA89B",
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
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
  documentLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  documentValue: {
    fontSize: 16,
    color: "#333",
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
  menuSection: {
    padding: 20,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    marginBottom: 12,
  },
  menuLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuText: {
    fontSize: 16,
    color: "#333",
    marginLeft: 12,
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
    backgroundColor: "#fff",
  },
  navItem: {
    alignItems: "center",
  },
  navText: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  activeNavText: {
    color: "#4FA89B",
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
