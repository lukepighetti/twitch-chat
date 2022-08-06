import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View, FlatList } from "react-native";

import tmi from "tmi.js";
import secrets from "./secrets.json";

const client = new tmi.Client({
  options: {
    debug: true,
    clientId: secrets.clientId,
  },
  identity: {
    username: secrets.username,
    password: secrets.password,
  },
  channels: ["lukepighetti"],
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
    if (isClientReady) {
      client.on("message", (channel, tags, message, self) => {
        if (self) return;
        setChatMessages((prev) => [...prev, { channel, tags, message }]);
      });
    }
  }, [isClientReady]);

  return (
    <View style={styles.container}>
      {isClientReady ? <Text>Ready</Text> : <Text>Not ready</Text>}

      <Text>Open up App.js to start working on your app!</Text>

      <View style={{ height: 100 }} />
      <FlatList
        data={chatMessages}
        renderItem={({ item }) => {
          return <Text>{item.message}</Text>;
        }}
        keyExtractor={(item) => item.tags.id}
      />
      <StatusBar style="auto" />
    </View>
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
