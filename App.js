import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

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

  useEffect(() => {
    (async () => {
      console.log(secrets.username);
      await client.connect();
      setIsClientReady(true);
    })();
  }, []);

  return (
    <View style={styles.container}>
      {isClientReady ? <Text>Ready</Text> : <Text>Not ready</Text>}

      <Text>Open up App.js to start working on your app!</Text>
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
