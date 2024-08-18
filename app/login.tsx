import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import axios from "axios";
import * as Crypto from "expo-crypto";
import CryptoES from "crypto-es";
import { encryptSymmetricKey } from "@/utils/crypto/encryte";
import { router } from "expo-router";

const LoginScreen: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleLogin = async () => {
    if (username === "" || password === "") {
      Alert.alert("Error", "Please enter both username and password");
      return;
    }

    const publicRes = await axios.get(
      "http://192.168.1.2:3000/auth/public-key"
    );

    const publicKey = publicRes.data.data.publicKey;

    // Generate 32 random bytes (256 bits)
    const randomBytes = await Crypto.getRandomValues(new Uint8Array(32));

    // Convert the random bytes to a hexadecimal string
    const symmetricKey = Array.from(randomBytes)
      .map((byte) => (byte as number).toString(16).padStart(2, "0"))
      .join("");

    // 对密码进行哈希
    const hashedPassword = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      password
    );

    // 使用对称密钥加密哈希后的密码
    const encryptedPassword = CryptoES.AES.encrypt(
      hashedPassword,
      symmetricKey
    ).toString();

    // 使用公钥加密对称密钥
    const encryptedSymmetricKey = await encryptSymmetricKey(
      publicKey,
      symmetricKey
    );

    const response = await axios.post("http://192.168.1.2:3000/auth/login", {
      username,
      password: encryptedPassword,
      key: encryptedSymmetricKey,
    });

    if (response.status === 200) {
      const { access_token } = response.data.data;
      await SecureStore.setItemAsync("token", access_token);
      router.replace("/home");
      Alert.alert("Success", `Welcome, ${username}!`);
    } else {
      Alert.alert("Error", "Invalid credentials");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  button: {
    height: 50,
    backgroundColor: "#007BFF",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default LoginScreen;
