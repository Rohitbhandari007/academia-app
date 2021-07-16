import { Ionicons, AntDesign } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import { globalStyles, SIZE } from "../styles/globalStyle";
import { useCollection } from "../hooks/firestore";
import firestore from "@react-native-firebase/firestore";
import { useUserContext } from "../providers/user";

const route = [
  {
    name: "Find lists of subjects of your course.",
    screen: "Materials",
    btnName: "Courses",
  },
  {
    name: "Find Materials for your learning",
    screen: "Downloads",
    btnName: "Materials",
  },
  {
    name: "Check the Calendar for Upcoming news",
    screen: "Calendar",
    btnName: "Calendar",
  },
  {
    name: "Learn More about Academia",
    screen: "AboutCollege",
    btnName: "About",
  },
  { name: "Customize your Settings", screen: "Settings", btnName: "Settings" },
];

const UpcomingEvent = ({ navigation }) => {
  const [routes, setRoutes] = useState(route);
  const [randomRoute, setRandomRoute] = useState("");
  const { colors } = useTheme();
  const { user } = useUserContext();

  const to = ["All", user.title];
  if (user.title == "Student") {
    to.push(...[user.faculty, `${user.faculty} ${user.semester}`]);
  }

  const [events] = useCollection(
    firestore()
      .collection("announcementTemp1")
      .where("addToCalendar", "==", true)
      .where("to", "array-contains-any", to)
      .where("startingDate", ">=", new Date())
  );

  useEffect(() => {
    setRandomRoute(routes[Math.floor(Math.random() * routes.length)]);
  }, []);

  return (
    <View>
      <View
        style={{
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
          marginTop: SIZE.width,
        }}
      >
        <InfoCard randomRoute={randomRoute} navigation={navigation} />
      </View>
      <View style={{ flexDirection: "row" }}>
        <View style={{ ...globalStyles.card, backgroundColor: colors.card }}>
          <Text style={{ color: colors.text, fontSize: 16 }}>
            Upcoming Events
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Announcements", { screen: "Announcements" });
          }}
          style={{ ...globalStyles.card, backgroundColor: colors.card }}
        >
          <Text style={{ color: colors.text, fontSize: 16 }}>Show All</Text>
        </TouchableOpacity>
      </View>
      <View style={{ width: "100%", padding: SIZE.width * 0.7 }}>
        <FlatList
          ListEmptyComponent={() => (
            <View
              style={{
                width: SIZE.screenWidth * 0.9,
                height: SIZE.height * 1.5,
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ color: colors.text, textAlign: "center" }}>
                No upcoming events
              </Text>
            </View>
          )}
          horizontal={true}
          data={events}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View
              style={{
                ...globalStyles.shadow,
                ...styles.events,
                backgroundColor: colors.upcoming,
              }}
            >
              <Ionicons name="american-football" size={34} color="white" />
              <Text
                style={{
                  ...globalStyles.txt,
                  fontSize: 20,
                  // height: SIZE.he,
                }}
              >
                {item.title}
              </Text>
              <Text
                style={{
                  ...globalStyles.txt,
                  fontSize: 17,
                  // marginTop: 5,
                  color: "lightgray",
                }}
              >
                {item.startingDate.toDate().toLocaleDateString()}
              </Text>
              <TouchableOpacity
                activeOpacity={0.5}
                style={{
                  backgroundColor: "#8d81db",
                  padding: 8,
                  marginTop: SIZE.height * 0.25,
                  width: SIZE.screenWidth * 0.2,
                  borderRadius: 5,
                }}
              >
                <Text
                  style={{ fontSize: 17, color: "white", textAlign: "center" }}
                >
                  Join
                </Text>
              </TouchableOpacity>
            </View>
          )}
        />
      </View>
    </View>
  );
};

const InfoCard = ({ randomRoute, navigation }) => {
  const { name, screen, btnName } = randomRoute;
  const { colors } = useTheme();
  return (
    <View style={{ ...styles.infocard, backgroundColor: colors.card }}>
      <View style={{ padding: SIZE.width }}>
        <Text
          style={{
            color: colors.text,
            fontSize: SIZE.width * 1.3,
            fontWeight: "bold",
          }}
        >
          Welcome to
        </Text>
        <Text style={{ color: colors.text, fontSize: SIZE.width }}>
          Academia,
        </Text>
        <Text
          style={{
            marginTop: SIZE.width * 0.3,
            color: colors.secondText,
            fontSize: SIZE.width * 0.7,
            width: "80%",
          }}
        >
          {name}
        </Text>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate(`${screen}`, {
              screen: `${screen}`,
            });
          }}
          style={{
            ...globalStyles.btns,
            justifyContent: "space-around",
            marginTop: 6,
          }}
        >
          <Text style={{ color: "#fff" }}>{btnName}</Text>
          <AntDesign name="arrowright" size={23} color="white" />
        </TouchableOpacity>
      </View>
      <Image source={require("../images/future.png")} style={styles.image} />
    </View>
  );
};

export default UpcomingEvent;
const styles = StyleSheet.create({
  events: {
    // padding: SIZE.width * 0.7,
    marginHorizontal: 6,
    height: SIZE.screenHeight * 0.23,
    width: SIZE.screenWidth * 0.4,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
  },
  infocard: {
    // marginHorizontal: 6,
    height: SIZE.screenHeight * 0.23,
    width: SIZE.screenWidth * 0.9,
    backgroundColor: "#f7f7f7",
    borderRadius: SIZE.width,
    flexDirection: "row",
    paddingHorizontal: SIZE.width * 0.8,
    justifyContent: "space-around",
  },
  image: {
    height: "100%",
    width: SIZE.screenHeight * 0.2,
    resizeMode: "cover",
    zIndex: 2,
  },
});
