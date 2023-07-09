import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  Button,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Clipboard,
  ToastAndroid,
} from "react-native";
import axios from "axios";

const RandomUserComponent = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchRandomUser();
  }, []);

  const fetchRandomUser = async () => {
    setLoading(true);
    try {
      const response = await axios.get("https://randomuser.me/api/");
      const data = response.data.results[0];
      setUser(data);
    } catch (error) {
      console.log("Error:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleReload = () => {
    fetchRandomUser();
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchRandomUser();
  };
  const handleCopyData = () => {
    if (user) {
      const dataToCopy = JSON.stringify(user);
      Clipboard.setString(dataToCopy);
      console.log("Data copied to clipboard.");
      ToastAndroid.show("Data copied to clipboard", ToastAndroid.SHORT);
    }
  };
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const name = `${user.name.first} ${user.name.last}`;
  const email = user.email;
  const address = `${user.location.street.number} ${user.location.street.name}`;
  const city = user.location.city;
  const state = user.location.state;
  const country = user.location.country;
  const profilePicture = user.picture.large;
  const age = user.dob.age;
  const gender = user.gender;

  return (
    <ScrollView
      contentContainerStyle={styles.scrollViewContent}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      <View style={styles.container}>
        <Text style={styles.title}>Random User</Text>
        <Text style={styles.text}>Name: {name}</Text>
        <Text style={styles.text}>Email: {email}</Text>
        <Text style={styles.text}>Age: {age}</Text>
        <Text style={styles.text}>Gender: {gender}</Text>
        <Text style={styles.text}>Address: {address}</Text>
        <Text style={styles.text}>City: {city}</Text>
        <Text style={styles.text}>State: {state}</Text>
        <Text style={styles.text}>Country: {country}</Text>
        <Image source={{ uri: profilePicture }} style={styles.image} />

        <TouchableOpacity onPress={handleReload} style={styles.button}>
          <Text style={styles.buttonText}>Reload Data </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleCopyData}>
          <Text style={styles.buttonText}>Copy Data</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  text: {
    fontSize: 15,
    marginBottom: 10,
    textAlign: "center",
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 10,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  button: {
    marginTop: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#007AFF",
    borderRadius: 5,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default RandomUserComponent;
