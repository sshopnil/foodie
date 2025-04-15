import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  Dimensions,
  SectionList,
  ActivityIndicator,
  Image,
  TouchableOpacity,
} from 'react-native';
import SearchInput from './src/components/searchInput';
import { useEffect, useState } from 'react';
import axios from 'axios';


const { width, height } = Dimensions.get('window');
const ITEMS_PER_LOAD = 5;

const App = () => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [originalData, setOriginalData] = useState([]);
  const [sectionData, setSectionData] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchVisibleCount, setSearchVisibleCount] = useState(ITEMS_PER_LOAD);
  const [visibleCounts, setVisibleCounts] = useState({});

  const handleBtnClick = () => {
    if (!input || input.trim() === '') return;

    setIsLoading(true);
    axios
      .get(`https://www.themealdb.com/api/json/v1/1/search.php?s=${input}`)
      .then((response) => {
        const results = response.data.meals || [];
        setSearchResults(results);
        setSearchVisibleCount(ITEMS_PER_LOAD);
        setVisibleCounts({});
        updateSearchSection(results, ITEMS_PER_LOAD);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('API Error:', error);
        setIsLoading(false);
      });
  };

  const updateSearchSection = (results, count) => {
    const visibleItems = results.slice(0, count);
    const section = {
      title: `Search results for "${input}"`,
      data: visibleItems.length > 0 ? visibleItems : [{ strMeal: 'No results found.', isPlaceholder: true }],
    };
    setSectionData([section]);
  };

  const updateCategorySections = (data, counts) => {
    const updatedSections = data.map((section) => {
      const count = counts[section.title] || ITEMS_PER_LOAD;
      return {
        title: section.title,
        data: section.data.slice(0, count),
        fullData: section.data, // for checking if more items exist
      };
    });
    setSectionData(updatedSections);
  };

  const handleLoadMore = (sectionTitle) => {
    if (sectionTitle.startsWith('Search results')) {
      const newCount = searchVisibleCount + ITEMS_PER_LOAD;
      setSearchVisibleCount(newCount);
      updateSearchSection(searchResults, newCount);
    } else {
      const newCounts = {
        ...visibleCounts,
        [sectionTitle]: (visibleCounts[sectionTitle] || ITEMS_PER_LOAD) + ITEMS_PER_LOAD,
      };
      setVisibleCounts(newCounts);
      updateCategorySections(originalData, newCounts);
    }
  };

  useEffect(() => {
    const categories = ['Beef', 'Chicken', 'Dessert'];

    const fetchData = async () => {
      try {
        const results = await Promise.all(
          categories.map((cat) =>
            axios.get(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${cat}`)
          )
        );

        const formattedData = results.map((res, idx) => ({
          title: categories[idx],
          data: res.data.meals,
        }));

        const initialCounts = {};
        categories.forEach((cat) => (initialCounts[cat] = ITEMS_PER_LOAD));

        setOriginalData(formattedData);
        setVisibleCounts(initialCounts);
        updateCategorySections(formattedData, initialCounts);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <View style={[styles.container, { flexDirection: 'column' }]}>
      <ImageBackground
        style={styles.headerBG}
        source={{ uri: 'https://tinyurl.com/4srt76z9' }}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          <Text style={styles.title}>Welcome to FoodVista!</Text>
          <Text style={styles.subtitle}>Enjoy Premium Foods</Text>
          <SearchInput input={input} setInput={setInput} handleBtnClick={handleBtnClick} />
        </View>
      </ImageBackground>

      {isLoading ? (
        <ActivityIndicator size="large" color="#FF5722" style={{ marginTop: 20 }} />
      ) : (
        <SectionList
          style={{ flex: 2 }}
          sections={sectionData}
          keyExtractor={(item, index) => item?.strMeal + index}
          renderItem={({ item }) =>
            item.isPlaceholder ? (
              <Text style={styles.placeholder}>{item.strMeal}</Text>
            ) : (
              <View style={styles.item}>
                <Image source={{ uri: item?.strMealThumb }} style={styles.image} />
                <Text style={styles.itemText}>{item?.strMeal}</Text>
              </View>
            )
          }
          renderSectionHeader={({ section: { title } }) => (
            <Text style={styles.sectionHeader}>{title}</Text>
          )}
          renderSectionFooter={({ section }) => {
            const isSearch = section.title.startsWith('Search results');
            const totalCount = isSearch
              ? searchResults.length
              : originalData.find((cat) => cat.title === section.title)?.data.length || 0;
            const visibleCount = isSearch
              ? searchVisibleCount
              : visibleCounts[section.title] || ITEMS_PER_LOAD;

            if (visibleCount < totalCount) {
              return (
                <TouchableOpacity
                  onPress={() => handleLoadMore(section.title)}
                  style={styles.loadMoreBtn}
                >
                  <Text style={styles.loadMoreText}>Load More</Text>
                </TouchableOpacity>
              );
            }
            return null;
          }}
        />
      )}
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
  },
  headerBG: {
    width: width,
    height: height * 0.3,
    justifyContent: 'center',
  },
  title: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    color: '#e3e3e3',
    fontSize: 18,
    textAlign: 'center',
    paddingBottom: 50,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignContent: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: 20,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  item: {
    flex: 1,
    padding: 15,
    marginVertical: 5,
    marginHorizontal: 60,
    borderRadius: 8,
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 15,
  },
  itemText: {
    fontSize: 20,
    color: '#333',
    fontWeight: 'bold',
  },
  placeholder: {
    textAlign: 'center',
    padding: 20,
    fontStyle: 'italic',
    fontSize: 16,
    color: '#666',
  },
  loadMoreBtn: {
    margin: 20,
    padding: 12,
    backgroundColor: '#FF5722',
    borderRadius: 10,
    alignSelf: 'center',
  },
  loadMoreText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});