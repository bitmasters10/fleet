import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, TextInput, StyleSheet } from "react-native";
import { Card, Button } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios"; // Import axios
import { useCar } from "../context/CarContext"; // Import useCar

const FeedBackScreen = () => {
  const { getVehicles, loading, error } = useCar();
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [issues, setIssues] = useState([]);
  const [notes, setNotes] = useState("");
  const [vehicles, setVehicles] = useState([]);
  const HOME = "http:// 192.168.10.122:3000"; // Replace with your backend URL
  const categories = [
    { id: "engine", name: "Engine & Performance" },
    { id: "electrical", name: "Electrical Systems" },
    { id: "brakes", name: "Brakes & Suspension" },
    { id: "body", name: "Body & Appearance" },
    { id: "tires", name: "Tires & Wheels" },
    { id: "interior", name: "Interior Issues" },
  ];

  const parts = {
    engine: ["Fuel System", "Exhaust System", "Coolant", "Engine Vibration"],
    electrical: ["Battery", "Wiring", "Lights", "Starter Motor"],
    brakes: ["Brake Pads", "Suspension", "ABS Warning Light", "Brake Noise"],
    body: ["Doors", "Windows", "Paint Scratches", "Rusting"],
    tires: ["Front Tires", "Rear Tires", "Tire Pressure", "Alignment"],
    interior: ["Seats", "Dashboard", "Air Conditioning", "Infotainment System"],
  };

  const actionLevels = ["Monitor", "Fix Required", "Immediate Fix"];

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const data = await getVehicles();
        if (Array.isArray(data)) {
          setVehicles(data); // Store fetched vehicles safely
        } else {
          console.error("Expected an array but got:", data);
          setVehicles([]); // Prevent undefined errors
        }
      } catch (err) {
        console.error("Error fetching vehicles:", err);
        setVehicles([]); // Set to empty array on error
      }
    };
    fetchVehicles();
  }, []);

  const handleSubmitFeedback = async () => {
    if (!selectedVehicle || issues.length === 0) {
      alert("Please select a vehicle and at least one issue.");
      return;
    }

    const message = `Category: ${categories.find(cat => cat.id === selectedCategory)?.name}\nIssues:\n` + 
      issues.map(issue => `${issue.part} - ${issue.actionLevel}`).join("\n");

    const rating = Math.max(...issues.map(issue => {
      if (issue.actionLevel === "Monitor") return 1;
      if (issue.actionLevel === "Fix Required") return 2;
      if (issue.actionLevel === "Immediate Fix") return 3;
    }), 1); // Default to 1 if no issues

    const payload = {
      CAR_ID: selectedVehicle.CAR_ID,
      RATING: rating,
      MESSAGE: message,
      STATUS: "Pending",
      LAST_MAINTENANCE: new Date().toISOString().split("T")[0], // Default to today
      TIME_STAMP: new Date().toISOString(),
      DESCRIPTION: notes,
    };

    try {
      const response = await axios.post(`${HOME}/car-health`, payload, {
        headers: { "Content-Type": "application/json" },
      });
      alert(response.data.message || "Feedback submitted successfully!");
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("Failed to submit feedback.");
    }
  };

  const handleAddIssue = (part, actionLevel) => {
    const existingIssue = issues.find((issue) => issue.part === part);
    if (existingIssue) {
      setIssues(
        issues.map((issue) =>
          issue.part === part ? { ...issue, actionLevel } : issue
        )
      );
    } else {
      setIssues([...issues, { part, actionLevel }]);
    }
  };

  const handleRemoveIssue = (part) => {
    setIssues(issues.filter((issue) => issue.part !== part));
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#f5f5f5", padding: 16 }}>
      {loading && <Text>Loading vehicles...</Text>}
      {error && <Text style={{ color: "red" }}>{error}</Text>}

      {!vehicles || vehicles.length === 0 ? (
        <Text>No vehicles available</Text>
      ) : (
        vehicles.map((vehicle) => (
          <TouchableOpacity
            key={vehicle.CAR_ID} // Use CAR_ID
            onPress={() => setSelectedVehicle(vehicle)}
            style={[
              styles.vehicleCard,
              selectedVehicle?.CAR_ID === vehicle.CAR_ID && styles.selectedVehicle,
            ]}
          >
            <Text style={{
              color: selectedVehicle?.CAR_ID === vehicle.CAR_ID ? "#ffffff" : "#000",
              fontWeight: "bold",
              fontSize: 16,
            }}>
              {vehicle.MODEL_NAME}
            </Text>
            <Text style={{
              color: selectedVehicle?.CAR_ID === vehicle.CAR_ID ? "#ffffff" : "#555",
            }}>
              {vehicle.number}
            </Text>
          </TouchableOpacity>
        ))
      )}

      {selectedVehicle && !selectedCategory && (
        <View style={styles.section}>
          <Text style={styles.heading}>Select a Category</Text>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              onPress={() => setSelectedCategory(category.id)}
              style={styles.categoryCard}
            >
              <Text style={styles.categoryText}>{category.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {selectedCategory && (
        <View style={styles.section}>
          <Text style={styles.heading}>Select Issues</Text>
          {parts[selectedCategory].map((part) => (
            <Card key={part} style={styles.issueCard}>
              <Text style={styles.issueText}>{part}</Text>
              <View style={styles.actionButtons}>
                {actionLevels.map((level) => (
                  <TouchableOpacity
                    key={level}
                    onPress={() => handleAddIssue(part, level)}
                    style={[
                      styles.actionButton,
                      issues.find((issue) => issue.part === part && issue.actionLevel === level) && styles.selectedActionButton,
                    ]}
                  >
                    <Text style={styles.actionButtonText}>{level}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </Card>
          ))}
        </View>
      )}

      {issues.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.heading}>Selected Issues</Text>
          {issues.map((issue) => (
            <View key={issue.part} style={styles.selectedIssue}>
              <Text style={{ fontSize: 14 }}>
                {issue.part}: {issue.actionLevel}
              </Text>
              <Ionicons name="close-circle" size={24} color="#FF0000" onPress={() => handleRemoveIssue(issue.part)} />
            </View>
          ))}
        </View>
      )}

      {issues.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.heading}>Add Notes</Text>
          <TextInput
            style={styles.notesInput}
            multiline
            placeholder="Enter any additional notes here"
            value={notes}
            onChangeText={setNotes}
          />

          <Button mode="contained" style={styles.submitButton} onPress={handleSubmitFeedback}>
            Submit Feedback
          </Button>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  section: {
    marginVertical: 16,
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  vehicleCard: {
    width: "100%",
    padding: 20,
    marginBottom: 12,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    alignItems: "center",
  },
  selectedVehicle: {
    backgroundColor: "#007AFF",
  },
  categoryCard: {
    width: "100%",
    backgroundColor: "#ffffff",
    padding: 16,
    marginBottom: 12,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    alignItems: "center",
  },
  categoryText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  issueCard: {
    padding: 16,
    marginBottom: 8,
    borderRadius: 10,
    backgroundColor: "#fff",
  },
  issueText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  actionButtons: {
    flexDirection: "row",
    marginTop: 8,
  },
  actionButton: {
    marginRight: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  monitorButton: {
    backgroundColor: "#4caf50",
  },
  fixRequiredButton: {
    backgroundColor: "#ffc107",
  },
  immediateFixButton: {
    backgroundColor: "#f44336",
  },
  selectedActionButton: {
    borderWidth: 2,
    borderColor: "#000",
  },
  actionButtonText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "bold",
  },
  selectedIssue: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 6,
  },
  notesInput: {
    height: 100,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 8,
    backgroundColor: "#ffffff",
  },
  submitButton: {
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 8,
  },
});

export default FeedBackScreen;
