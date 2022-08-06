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
  Image,
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
      // console.log({ channel, tags, message });
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
          const emotes = item.tags.emotes;
          // emote-key: Array [replace "startIndex-endIndex"],

          //       "425618": Array [
          //         "48-50",
          //         "52-54",
          //         "56-58",
          //         "60-62",
          //       ],

          //PogChamp =>> 42069
          // |

          // "Hey guys PogChamp whats up"
          // [<Text>Hey guys </Text><Image emoteId={42069/><Text> whats up</Text>}]

          // const elements = []; /// JSX elements, <Text> or <Image> based on splitMapJoin

          var s = item.message;

          for (const [emoteKey, replaceRanges] of Object.entries(
            emotes ?? {}
          )) {
            for (const range of replaceRanges) {
              const [startIndex, endIndex] = range.split("-");
              s =
                s.substring(0, startIndex) +
                `|${emoteKey}|` +
                s.substring(endIndex + 1);
            }
          }

          console.log(s);

          const emoteUrl = (emoteKey) =>
            `https://static-cdn.jtvnw.net/emoticons/v1/${emoteKey}/1.0`;

          return (
            <Text
              style={{
                marginVertical: 4,
                marginHorizontal: 20,
                lineHeight: 24,
              }}
            >
              <Text
                style={{ color: item.tags.color ?? "blue", fontWeight: "700" }}
              >
                {item.tags["display-name"] ?? item.tags.username}:{" "}
              </Text>
              <Image
                style={{ width: 24, height: 24 }}
                source={{
                  uri: emoteUrl(425618),
                }}
              />
              <Text>{s.trim()}</Text>
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

// Object {
//   "channel": "#lukepighetti",
//   "message": "HeyGuys HeyGuys HeyGuys HeyGuys HeyGuys HeyGuys LUL LUL LUL LUL",
//   "tags": Object {
//     "badge-info": null,
//     "badge-info-raw": null,
//     "badges": null,
//     "badges-raw": null,
//     "client-nonce": "7255d9f108b523a8387c0b2ded2e1775",
//     "color": null,
//     "display-name": "playyboiizzy",
//     "emote-only": true,
//     "emotes": Object {
//       "30259": Array [
//         "0-6",
//         "8-14",
//         "16-22",
//         "24-30",
//         "32-38",
//         "40-46",
//       ],
//       "425618": Array [
//         "48-50",
//         "52-54",
//         "56-58",
//         "60-62",
//       ],
//     },
//     "emotes-raw": "30259:0-6,8-14,16-22,24-30,32-38,40-46/425618:48-50,52-54,56-58,60-62",
//     "first-msg": false,
//     "flags": null,
//     "id": "29753d29-cead-4545-8cce-8981bacc8254",
//     "message-type": "chat",
//     "mod": false,
//     "returning-chatter": false,
//     "room-id": "463970907",
//     "subscriber": false,
//     "tmi-sent-ts": "1659826717418",
//     "turbo": false,
//     "user-id": "675719401",
//     "user-type": null,
//     "username": "playyboiizzy",
//   },
// }
