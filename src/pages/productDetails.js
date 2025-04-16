import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';

const ProductDetails = ({ route }) => {
  const { item } = route.params;

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: item.strMealThumb }} style={styles.image} />
      <Text style={styles.title}>{item.strMeal}</Text>
      <Text style={styles.category}>Category: {item.strCategory || 'N/A'}</Text>
      <Text style={styles.area}>Area: {item.strArea || 'N/A'}</Text>
      <Text style={styles.instructionsTitle}>Instructions:</Text>
      <Text style={styles.instructions}>{item.strInstructions || 'Instructions not available.'}</Text>
    </ScrollView>
  );
};

export default ProductDetails;

const styles = StyleSheet.create({
  container: {
    padding: 30,
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: 250,
    borderRadius: 12,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  category: {
    fontSize: 18,
    color: '#555',
    marginBottom: 5,
  },
  area: {
    fontSize: 18,
    color: '#555',
    marginBottom: 15,
  },
  instructionsTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  instructions: {
    fontSize: 16,
    lineHeight: 22,
    color: '#444',
    paddingBottom: 40
  },
});