import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  SafeAreaView,
  TextInput,
  Button,
  KeyboardAvoidingView,
} from "react-native";

import tmi from "tmi.js";
import secrets from "./secrets.json";

const defaultChannel = "lukepighetti";

const client = new tmi.Client({
  options: {
    debug: true,
    clientId: secrets.clientId,
  },
  identity: {
    username: secrets.username,
    password: secrets.password,
  },
  channels: [defaultChannel],
});

export default function App() {
  const [isClientReady, setIsClientReady] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);

  useEffect(() => {
    (async () => {
      console.log(secrets.username);
      await client.connect();
      setIsClientReady(true);
    })();
  }, []);

  useEffect(() => {
    const messageHandler = (channel, tags, message, self) => {
      setChatMessages((prev) => [{ channel, tags, message }, ...prev]);
    };

    if (isClientReady) {
      /// TODO: join channel here when `channel` changes
      client.on("message", messageHandler);
    }

    return () => client.off("message", messageHandler);
  }, [isClientReady]);

  const [composedMessage, setComposedMessage] = useState("");

  const submitMessage = () => {
    client.say(defaultChannel, composedMessage);
    setComposedMessage("");
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#fff",
      }}
    >
      <View
        style={{ padding: 10, flexDirection: "row", justifyContent: "center" }}
      >
        {isClientReady ? (
          <Text style={{ fontSize: 18, fontWeight: "500" }}>
            #{defaultChannel}
          </Text>
        ) : (
          <Text>Connecting...</Text>
        )}
      </View>
      <FlatList
        inverted
        data={chatMessages}
        renderItem={({ item }) => {
          return (
            <Text style={{ marginVertical: 2, marginHorizontal: 20 }}>
              <Text
                style={{ color: item.tags.color ?? "blue", fontWeight: "700" }}
              >
                {item.tags["display-name"] ?? item.tags.username}:{" "}
              </Text>
              <Text>{item.message.trim()}</Text>
            </Text>
          );
        }}
        // TODO: keyExtractor -> find a unique key for each message
        // maybe timestamp + userid?
      />
      <KeyboardAvoidingView behavior="padding">
        <View
          style={{
            flexDirection: "row",
            borderTopWidth: 1,
            borderTopColor: "grey",
            alignItems: "center",
            backgroundColor: "white",
          }}
        >
          <TextInput
            style={{ padding: 20, flex: 1 }}
            onChangeText={setComposedMessage}
            onSubmitEditing={submitMessage}
            value={composedMessage}
            placeholder="Send a message"
            autoCorrect={false}
          />
          <View style={{ marginHorizontal: 10 }}>
            <Button onPress={submitMessage} title={"Send"}></Button>
          </View>
        </View>
      </KeyboardAvoidingView>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}
