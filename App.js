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
    <SafeAreaView style={styles.container}>
      <View style={{ padding: 10 }}>
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
            alignItems: "center",
            backgroundColor: "white",
          }}
        >
          <TextInput
            style={{ padding: 20, flex: 1 }}
            onChangeText={setComposedMessage}
            onSubmitEditing={submitMessage}
            value={composedMessage}
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

// flexDirection: column* | row
// MainAxisAlignment -> justifyContent:
//      flex-start* | flex-end | center | space-between | space-around | space-evenly
// CrossAxisAlignment -> alignItems:
//      stretch* | flex-start | flex-end | center | baseline
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    // justifyContent: "flex-start",
    // alignItems: "stretch",
  },
});

// const tmi = require('tmi.js');
// const client = new tmi.Client({
// 	options: { debug: true },
// 	identity: {
// 		username: 'bot_name',
// 		password: 'oauth:my_bot_token'
// 	},
// 	channels: [ 'my_channel' ]
// });
// client.connect().catch(console.error);
// client.on('message', (channel, tags, message, self) => {
// 	if(self) return;
// 	if(message.toLowerCase() === '!hello') {
// 		client.say(channel, `@${tags.username}, heya!`);
// 	}
// });

//  {
//   "channel": "#lukepighetti",
//   "message": "tst",
//   "tags": Object {
//     "badge-info": null,
//     "badge-info-raw": null,
//     "badges": null,
//     "badges-raw": null,
//     "client-nonce": "ef793fc96db76a008747e53034b978bc",
//     "color": "#1E90FF",
//     "display-name": "Mahamdi_Amine",
//     "emotes": null,
//     "emotes-raw": null,
//     "first-msg": true,
//     "flags": null,
//     "id": "25aa602c-1f88-4bcd-877a-bb609d569b65",
//     "message-type": "chat",
//     "mod": false,
//     "returning-chatter": false,
//     "room-id": "463970907",
//     "subscriber": false,
//     "tmi-sent-ts": "1659821151955",
//     "turbo": false,
//     "user-id": "190872391",
//     "user-type": null,
//     "username": "mahamdi_amine",
//   },
// }
