import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Button, ScrollView, ActivityIndicator } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanning, setScanning] = useState(false);
  const [barcode, setBarcode] = useState(null);
  const [ingredients, setIngredients] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!permission) {
    return (
      <View style={styles.center}>
        <Text>Checking camera permission…</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text style={{ marginBottom: 10 }}>
          Camera access is required to scan barcodes
        </Text>
        <Button title="Grant permission" onPress={requestPermission} />
      </View>
    );
  }

  async function onBarcodeScanned({ data }) {
    setScanning(false);
    setBarcode(data);
    setIngredients(null);
    setError(null);
    await fetchIngredients(data);
  }

  async function fetchIngredients(code) {
    try {
      setLoading(true);

      let res = await fetch(
        `https://world.openbeautyfacts.org/api/v0/product/${code}.json`
      );
      let json = await res.json();

      if (json.status === 1 && json.product?.ingredients_text) {
        setIngredients(json.product.ingredients_text);
        return;
      }

      res = await fetch(
        `https://world.openfoodfacts.org/api/v0/product/${code}.json`
      );
      json = await res.json();

      if (json.status === 1 && json.product?.ingredients_text) {
        setIngredients(json.product.ingredients_text);
        return;
      }

      setError('No ingredient data found for this barcode.');
    } catch (e) {
      setError('Failed to fetch product data.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <StatusBar style="auto" />

      <Text style={styles.title}>Ingredient Scanner</Text>

      {!scanning && (
        <Button title="Scan barcode" onPress={() => setScanning(true)} />
      )}

      {scanning && (
        <CameraView
          style={styles.camera}
          barcodeScannerSettings={{
            barcodeTypes: ['ean13', 'ean8', 'upc_a', 'upc_e'],
          }}
          onBarcodeScanned={scanning ? onBarcodeScanned : undefined}
        />
      )}

      {loading && <ActivityIndicator size="large" style={{ marginTop: 20 }} />}

      {barcode && (
        <Text style={styles.label}>Barcode: {barcode}</Text>
      )}

      {ingredients && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Ingredients</Text>
          <Text>{ingredients}</Text>
        </View>
      )}

      {error && (
        <Text style={styles.error}>{error}</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    width: '100%',
    height: 300,
    marginTop: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 20,
  },
  label: {
    marginTop: 15,
    fontWeight: '500',
  },
  card: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
  },
  cardTitle: {
    fontWeight: '600',
    marginBottom: 8,
  },
  error: {
    marginTop: 20,
    color: 'red',
    textAlign: 'center',
  },
});