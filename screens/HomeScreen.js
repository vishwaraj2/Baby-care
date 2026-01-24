import React from 'react';
import { View, Button } from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center' }}>
      <Button title="Camera" onPress={() => navigation.navigate('Camera')} />
      <Button title="Notifications" onPress={() => navigation.navigate('Notifications')} />
      <Button title="AI Assistant" onPress={() => navigation.navigate('AI Assistant')} />
    </View>
  );
}