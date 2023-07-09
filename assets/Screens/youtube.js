import React, { useState } from "react";
import {
  View,
  TextInput,
  Button,
  Text,
  Image,
  TouchableOpacity,
  ToastAndroid,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import axios from "axios";
import * as Clipboard from "expo-clipboard";
import { AntDesign } from "@expo/vector-icons";

const API_KEY = "AIzaSyBvBoFlJUQgH_eip7L5Y8fc5PloSBeV2VI";

const YouTube = () => {
  const [channelName, setChannelName] = useState("");
  const [channelData, setChannelData] = useState(null);
  const [loading, setLoading] = useState(false);

  const getChannelData = async () => {
    setLoading(true);
    

    try {
      const response = await axios.get(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${channelName}&type=channel&key=${API_KEY}`
      );

      const channel = response.data.items[0];
      if (channel) {
        const channelId = channel.id.channelId;
        const channelTitle = channel.snippet.title;
        const channelImageUrl = channel.snippet.thumbnails.default.url;
        const channelUrl = `https://www.youtube.com/channel/${channelId}`;

        const channelDataResponse = await axios.get(
          `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${channelId}&key=${API_KEY}`
        );

        const channelStatistics = channelDataResponse.data.items[0].statistics;
        const subscribers = channelStatistics.subscriberCount;
        const views = channelStatistics.viewCount;
        const totalVideos = channelStatistics.videoCount;
        const channelDescription = channel.snippet.description;

        const data = {
          channelTitle,
          channelImageUrl,
          subscribers,
          views,
          totalVideos,
          channelDescription,
          channelUrl,

        };
        setLoading(false);
        setChannelData(data);
      } else {
        setChannelData(null);
        ToastAndroid.show("Channel not found.", ToastAndroid.SHORT);
      }
    } catch (error) {
      console.error(error);
      setChannelData(null);
      ToastAndroid.show(
        "An error occurred. Please try again later.",
        ToastAndroid.SHORT
      );
    }
  };

  const copyToClipboard = () => {
    if (channelData) {
      const data = `Channel Name: ${channelData.channelTitle}\nSubscribers: ${channelData.subscribers}\nTotal Views: ${channelData.views}\nTotal Videos: ${channelData.totalVideos}\nDescription: ${channelData.channelDescription}\nURL: ${channelData.channelUrl}`;
      Clipboard.setString(data);
      ToastAndroid.show(
        "Data has been copied to the clipboard.",
        ToastAndroid.SHORT
      );
    }
  };

  return (
    <ScrollView style={styles.ScrollView}>

    <View style={styles.container}>
      <AntDesign name="youtube" size={55} color="red" />

      <Text style={styles.heading}>YouTube Channel Data</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter Channel Name"
        value={channelName}
        onChangeText={(text) => setChannelName(text)}
      />

      <Button title="Get Data" onPress={getChannelData} style={styles.get} />
      {loading && (
        <ActivityIndicator
          style={{ marginTop: 20 }}
          size="large"
          color="blue"
        />
      )}
      {channelData && (
        <View style={styles.resultContainer}>
          <Image
            style={styles.channelImage}
            source={{ uri: channelData.channelImageUrl }}
          />
          <Text style={styles.resultText}>
            Channel Name: {"\n"}
            <Text style={styles.resultText1}>{channelData.channelTitle}</Text>
          </Text>
          <Text style={styles.resultText}>
            Subscribers:{"\n"}{" "}
            <Text style={styles.resultText1}>{channelData.subscribers}</Text>
          </Text>
          <Text style={styles.resultText}>
            Total Views: {"\n"}
            <Text style={styles.resultText1}>{channelData.views}</Text>
          </Text>
          <Text style={styles.resultText}>
            Total Videos:{"\n"}{" "}
            <Text style={styles.resultText1}>{channelData.totalVideos}</Text>
          </Text>

          <Text style={styles.resultText}>
          URL: {"\n"}
            <Text style={styles.resultText1}>
            {channelData.channelUrl}
            </Text>
          </Text>

          <Text style={styles.resultText}>
            Description: {"\n"}
            <Text style={styles.resultText1}>
              {channelData.channelDescription}
            </Text>
          </Text>

          <TouchableOpacity style={styles.copyButton} onPress={copyToClipboard}>
            <Text style={styles.copyButtonText}>Copy</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
    </ScrollView>

  );
};

const styles = {
  ScrollView:{
    top:40,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
   
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  input: {
    width: "100%",
    height: 44,
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 16,
  },

  resultContainer: {
    marginTop: 16,
    alignItems: "center",
  },
  channelImage: {
    width: 120,
    height: 120,
    marginBottom: 16,
    borderRadius:90,
  },
  resultText: {
    fontSize: 16,
    marginBottom: 8,
    borderColor: "black",
    fontWeight: "bold",
    textAlign:'center',
  },
  resultText1: {
    color: "#AC001F",
  },

  copyButton: {
    backgroundColor: "#FF0000",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  copyButtonText: {
    color: "white",
    fontSize: 15,
    fontWeight: "bold",
  },
};

export default YouTube;
