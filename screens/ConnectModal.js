import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import COLORS from "../styles/colors";
import { SIZE } from "../styles/globalStyle";
import { Feather } from "@expo/vector-icons";

function ConnectModal({ navigation, setShowDialog }) {
  return (
    <>
      <View style={styles.modal}>
        <TouchableOpacity style={styles.cancel} onPress={()=> {
          setShowDialog(false)
        }}>
          <Feather name="x-circle" size={SIZE.height/1.5} color={COLORS.white}/>
        </TouchableOpacity>

        <View>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => {
              setShowDialog(false);
              navigation.navigate("Teacher");
            }}
          >
            <View style={styles.btntext}>
              <Text style={styles.text}>Connect with Teachers</Text>
              <AntDesign name="right" size={24} color="black" />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => {
              setShowDialog(false);
              navigation.navigate("Student");
            }}
          >
            <View style={styles.btntext}>
              <Text style={styles.text}>Connect with Student</Text>
              <AntDesign name="right" size={24} color="black" />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}

export default ConnectModal;

const styles = StyleSheet.create({
  modal: {
    backgroundColor: COLORS.darkblue,
    borderRadius: 100,
  },
  text: {
    color: COLORS.darkblue,
    fontSize: 18,
  },
  btntext: {
    marginVertical: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "white",
    padding: SIZE.height / 3.5,
    borderRadius: 8,
  },
  cancel: {
    marginVertical: SIZE.height * 0.05,
    marginRight: 5,
    alignSelf: "flex-end",
  },
});