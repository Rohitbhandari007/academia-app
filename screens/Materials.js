import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import React, { useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ExpandableSection } from "react-native-ui-lib";
import Header from "../components/Header";
import { faculties } from "../components/SubjectList";
import { globalStyles, SIZE } from "../styles/globalStyle";

export default function Materials({ navigation }) {
  const [myIndex, setMyIndex] = useState(null);
  const { colors } = useTheme();

  return (
    <View style={{ flex: 1 }}>
      <Header title="Our Courses" navigation={navigation} showSidebar={false} />
      <View style={{ flex: 1 }}>
        <View>
          <FlatList
            data={faculties}
            keyExtractor={(item) => item.id.toString()}
            showVerticalScrollIndicator={false}
            renderItem={({ item, index }) => (
              <View
                key={item.id}
                style={{
                  // borderWidth: 1,
                  borderColor: colors.border,
                  borderRadius: 6,
                  borderBottomWidth: 1,
                  // marginVertical: 5,
                }}
              >
                <FacultyExpanded
                  data={item}
                  navigation={navigation}
                ></FacultyExpanded>
              </View>
            )}
          />
        </View>
      </View>
    </View>
  );
}

const FacultyExpanded = ({ data, navigation }) => {
  const [expanded, setExpanded] = useState(false);
  const { colors } = useTheme();
  const FacultyHeader = () => {
    return (
      <View
        style={{
          paddingHorizontal: SIZE.width,
          paddingVertical: SIZE.height / 2,
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <View style={{ width: "90%" }}>
          <Text
            style={{ color: colors.text, fontSize: 20, fontWeight: "bold" }}
          >
            {data.short}
          </Text>
          <Text style={{ ...globalStyles.midText, color: colors.text }}>
            {data.full}
          </Text>
        </View>
        {expanded ? (
          <Ionicons name="chevron-up-outline" size={32} color={colors.text} />
        ) : (
          <Ionicons name="chevron-down-outline" size={32} color={colors.text} />
        )}
      </View>
    );
  };

  const Year = ({ year, yearItem }) => {
    const { colors } = useTheme();
    return (
      <TouchableOpacity
        style={{
          borderWidth: 1,
          borderRadius: 5,
          width: SIZE.width * 3.7,
          height: SIZE.width * 3.7,
          justifyContent: "center",
          alignItems: "center",
          borderWidth: 1,
          borderColor: colors.border,
        }}
        onPress={() =>
          navigation.navigate("Subjects", {
            screen: "Subjects",
            params: { sub: yearItem, short: data.short },
          })
        }
      >
        <Text style={{ fontWeight: "bold", color: colors.text }}>{year}</Text>
        <Text style={{ color: colors.text }}>Year</Text>
      </TouchableOpacity>
    );
  };

  return (
    <ExpandableSection
      top={false}
      sectionHeader={FacultyHeader()}
      onPress={() => setExpanded((prev) => !prev)}
      expanded={expanded}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          paddingHorizontal: SIZE.width,
          paddingBottom: SIZE.height / 2,
        }}
      >
        <Year year="1st" yearItem={data.year.firstYear} />
        <Year year="2nd" yearItem={data.year.secondYear} />

        {data.year.thirdYear && data.year.fourthYear && (
          <>
            <Year year="3rd" yearItem={data.year.thirdYear} />
            <Year year="4th" yearItem={data.year.fourthYear} />
          </>
        )}
      </View>
    </ExpandableSection>
  );
};

const styles = StyleSheet.create({
  Materialsbtn: {
    marginTop: SIZE.height * 0.6,
    paddingHorizontal: SIZE.width,
    paddingVertical: SIZE.width / 2,
    borderWidth: 1,
    borderRadius: SIZE.width * 0.6,
    flexDirection: "row",
    // justifyContent: "space-around",
    alignItems: "center",
  },
  MaterialsbtnText: {
    flex: 1,
    paddingHorizontal: SIZE.width,
  },
});
