import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Linking,
  Modal,
  StyleSheet,
  Alert,
} from "react-native";
import { Button } from "react-native-ui-lib";
import { globalStyles, SIZE } from "../styles/globalStyle";
import firestore from "@react-native-firebase/firestore";
import { Ionicons ,AntDesign} from "@expo/vector-icons";
import Header from "../components/Header";
import { useTheme } from "@react-navigation/native";
import { useCollectionLazy } from "../hooks/firestore";

import { CustomTextInput, InputContainer } from "../components/CustomInput";
import COLORS from "../styles/colors";

import { showToast } from "../utils/error";
import { useUserContext } from "../providers/user";
const downloadLink = ({ navigation }) => {
  const { colors } = useTheme();
  const [option, setoption] = useState(false);
  const query = firestore().collection("materials");
  const [name, setName] = useState("");
  const [link, setLink] = useState("");
  const { user } = useUserContext();

  const {
    value: downloads,
    loading,
    error,
    getMoreData,
    onRefresh,
    setValue,
  } = useCollectionLazy(query, "createdAt", "desc", 10);

  function isURL(str) {
    var res = str.match(
      /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
    );
    return res !== null;
  }
  const addMaterial = () => {
    if (!name || !link) {
      showToast("Field cannot be empty");
    } else if (!isURL(link)) {
      showToast("Not valid URL");
    } else {
      firestore()
        .collection("materials")
        .add({
          name,
          link,
          createdAt: new Date().toUTCString(),
        })
        .then((res) => {
          setValue([{ id: res.id, name, link }, ...downloads]);
          setoption(false);
          setName("");
          setLink("");
          showToast("Added Successfully !");
        })
        .catch((err) => {
          showToast("Failed to Add Materials !");
          setoption(false);
        });
    }
  };
  const deleteMaterial = async (id) => {
    try {
      firestore().collection("materials").doc(id).delete();
      showToast("Material Deleted !");
      setValue((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      console.error(err);
      showToast("Something went wrong !");
    }
  };
  return (
    <View>
      <Header title="Materials" navigation={navigation} showSidebar={false} />
      <View style={{ marginTop: 10 }}>
        {user.admin && (
          <TouchableOpacity
            style={{ ...globalStyles.btns, marginHorizontal: SIZE.width }}
            onPress={() => setoption((prev) => !prev)}
          >
            <Ionicons name="add" size={25} color="white" />
            <Text style={{ color: "#fff" }}>Add Material</Text>
          </TouchableOpacity>
        )}

        <FlatList
          data={downloads}
          refreshing={loading}
          onRefresh={onRefresh}
          onEndReached={getMoreData}
          onEndReachedThreshold={0.1}
          ListEmptyComponent={() => {
            return (
              <View style={{ alignItems: "center", marginTop: 50 }}>
                <Text style={{ color: colors.text }}>
                  No materials added yet !
                </Text>
              </View>
            );
          }}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View
              style={{
                marginHorizontal: 20,
                marginVertical: 10,
                backgroundColor: colors.card,
                borderRadius: 8,
                paddingHorizontal: SIZE.width,
                paddingVertical: SIZE.height * 0.2,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <TouchableOpacity onPress={() =>  Linking.openURL(
                 item.link.includes('https')?item.link :`https://${item.link}`
          )}
                  >
                <AntDesign name="clouddownload" size={40} color={colors.text} />
              </TouchableOpacity>
              <View
                style={{ flex: 1, marginLeft: 20, justifyContent: "center" }}
              >
                <Text
                  style={{
                    color: colors.text,
                    fontWeight: "bold",
                    fontSize: 20,
                    marginVertical: 2,
                    width: "99%",
                  }}
                >
                  {item.name}
                </Text>
              </View>
              {user.admin && (
                <TouchableOpacity
                  onPress={() => {
                    Alert.alert(
                      "Delete Material ",
                      "Are you sure you want to delete this ?",
                      [
                        {
                          text: "Cancel",
                          onPress: () => console.log("Cancelled!"),
                          style: "cancel",
                        },
                        { text: "OK", onPress: () => deleteMaterial(item.id) },
                      ],
                      { cancelable: true }
                    );
                  }}
                >
                  <Ionicons name="trash" size={30} color="#e35462" />
                </TouchableOpacity>
              )}
            </View>
          )}
        />
        <Modal
          transparent
          onRequestClose={() => setoption(false)}
          visible={option}
          animationType="fade"
        >
          <View
            style={{
              flex: 1,
              backgroundColor: "#00000067",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View style={{ ...styles.modals, backgroundColor: colors.card }}>
              <Text
                style={{
                  textAlign: "center",
                  ...globalStyles.boldText,
                  color: colors.text,
                }}
              >
                Add Materials
              </Text>
              <View style={{ marginTop: SIZE.height }}>
                <InputContainer label="Name of material">
                  <CustomTextInput
                    placeholder="name"
                    onChangeText={(txt) => {
                      setName(txt);
                    }}
                    value={name}
                  />
                </InputContainer>
              </View>
              <View style={{}}>
                <InputContainer label="Drive Link">
                  <CustomTextInput
                    placeholder="add link"
                    value={link}
                    onChangeText={(txt) => {
                      setLink(txt);
                    }}
                  />
                </InputContainer>
              </View>
              <View style={{ flexDirection: "row", justifyContent: "center" }}>
                <Button
                  label="Add Material"
                  backgroundColor="#6765c2"
                  style={{
                    marginVertical: SIZE.height * 0.45,
                    marginRight: SIZE.width * 0.5,
                  }}
                  onPress={addMaterial}
                />
                <Button
                  label="Cancel"
                  backgroundColor={COLORS.mainred}
                  style={{
                    marginVertical: SIZE.height * 0.45,
                  }}
                  onPress={() => {
                    setoption(false);
                    setName("");
                    setLink("");
                  }}
                />
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
};

export default downloadLink;
const styles = StyleSheet.create({
  modals: {
    width: SIZE.screenWidth * 0.96,
    height: SIZE.screenHeight * 0.5,
    borderRadius: SIZE.width,
    padding: SIZE.width,
  },
});
