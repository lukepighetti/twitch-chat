import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View, FlatList, SafeAreaView } from "react-native";

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
  const [channel, setChannel] = useState(defaultChannel);
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
    if (isClientReady) {
      /// join channel here when `channel` changes

      client.on("message", (channel, tags, message, self) => {
        if (self) return;
        setChatMessages((prev) => [...prev, { channel, tags, message }]);
      });

      console.log("AAAAAAA");
      /// TODO: clean up subscription here
    }
  }, [isClientReady]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ padding: 10 }}>
        {isClientReady ? (
          <Text style={{ fontSize: 18, fontWeight: "500" }}>#{channel}</Text>
        ) : (
          <Text>Connecting...</Text>
        )}
      </View>
      <FlatList
        data={chatMessages}
        renderItem={({ item }) => {
          return (
            <Text style={{ marginVertical: 2 }}>
              <Text style={{ color: "blue", fontWeight: "700" }}>
                {item.tags["display-name"] ?? item.tags.username}:{" "}
              </Text>
              <Text>{item.message.trim()}</Text>
            </Text>
          );
        }}
        keyExtractor={(item) => item.tags.id}
      />
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
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
