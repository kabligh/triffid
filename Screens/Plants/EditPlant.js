import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { Item, Picker, Textarea, DatePicker } from "native-base";
import FormContainer from "../../Shared/Forms/FormContainer";
import Input from "../../Shared/Forms/Input";
import GreenButton from "../../Components/GreenButton";
import SecondaryGreenButton from "../../Components/SecondaryGreenButton";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import AsyncStorage from "@react-native-community/async-storage";
import axios from "axios";
import baseURL from "../../assets/common/baseUrl";
import Toast from "react-native-toast-message";

const PlantTypes = require("../../assets/data/PlantTypes.json");

const EditPlant = (props) => {
  const plant = props.route.params;
  const [nickname, setNickname] = useState(plant.nickname);
  const [type, setType] = useState(plant.type);
  const [wateringFrequency, setWateringFrequency] = useState(
    plant.wateringFrequency
  );
  const [notes, setNotes] = useState(plant.notes);
  const [lastWatered, setLastWatered] = useState(plant.lastWatered);
  const userid = plant.userid;
  const plantid = plant.plantid;
  const [image, setImage] = useState(plant.image);

  const handleDelete = () => {
    AsyncStorage.getItem("jwt").then((res) => {
      axios
        .delete(`${baseURL}plants/${plantid}`, {
          headers: { Authorization: `Bearer ${res}` },
        })
        .then((response) => {
          Toast.show({
            topOffset: 60,
            type: "info",
            text1: `${nickname} was deleted 😭`,
          });
        })
        .then(props.navigation.navigate("Plants"))
        .catch((error) => {
          console.log(`Error message: ${error}`);
        });
    });
  };

  const handleUpdate = () => {
    const updatedPlant = {
      userid: userid,
      nickname: nickname,
      type: type,
      wateringFrequency: wateringFrequency,
      lastWatered: lastWatered,
      notes: notes,
      image: image,
    };
    AsyncStorage.getItem("jwt").then((res) => {
      axios
        .post(`${baseURL}plants/update/${plantid}`, updatedPlant, {
          headers: { Authorization: `Bearer ${res}` },
        })
        .then((response) => {
          Toast.show({
            topOffset: 60,
            type: "success",
            text1: `${nickname} was updated 🧑‍🌾`,
          });
        })
        .then(
          setTimeout(() => {
            props.navigation.navigate("Plants");
          }, 300)
        )
        .catch((error) => {
          console.log(`Error message: ${error}`);
        });
    });
  };

  return (
    <FormContainer
      title={nickname.length < 10 ? `Edit ${nickname}` : `Edit Plant`}
    >
      <Input
        placeholder={"Update Nickname"}
        name={"Nickname"}
        value={nickname}
        onChangeText={(text) => setNickname(text)}
      />
      <View style={styles.container}>
        <Item picker>
          <Picker
            mode="dropdown"
            selectedValue={type}
            placeholder="Update Type"
            onValueChange={(e) => setType(e)}
          >
            {PlantTypes.map((c) => {
              return <Picker.Item key={c.id} label={c.name} value={c.name} />;
            })}
          </Picker>
        </Item>
      </View>
      <Input
        value={wateringFrequency}
        placeholder={"Update Watering Frequency"}
        name={"wateringFrequency"}
        keyboardType={"numeric"}
        onChange={(text) => setWateringFrequency(text)}
      />
      <Textarea
        style={styles.notes}
        rowSpan={8}
        bordered
        value={notes}
        placeholder="Update Notes"
        onChangeText={(text) => setNotes(text)}
      />
      <View style={styles.buttons}>
        <GreenButton text={`Update`} onPress={() => handleUpdate()} />
        <SecondaryGreenButton text={`Delete`} onPress={() => handleDelete()} />
      </View>
    </FormContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "80%",
    height: 60,
    backgroundColor: "white",
    margin: 10,
    borderRadius: 5,
    padding: 10,
    borderWidth: 2,
    borderColor: "#84A98C",
    fontSize: 15,
    color: "#CAD2C5",
  },
  notes: {
    width: "80%",
    height: 180,
    backgroundColor: "white",
    margin: 30,
    borderRadius: 5,
    padding: 10,
    borderWidth: 4,
    borderColor: "#84A98C",
    fontSize: 17,
    color: "#CAD2C5",
  },
  buttons: {
    height: 115,
    justifyContent: "space-between",
  },
});

export default EditPlant;
