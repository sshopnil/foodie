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


import SearchInput from '../components/searchInput';
import CategorySection from './sections/CategorySection';
import { useEffect, useState } from 'react';
// import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');
const ITEMS_PER_LOAD = 5;



const HomePage = ({ refreshKey }) => {
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [originalData, setOriginalData] = useState([]);
    const [sectionData, setSectionData] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [searchVisibleCount, setSearchVisibleCount] = useState(ITEMS_PER_LOAD);
    const [visibleCounts, setVisibleCounts] = useState({});
    const [categoryData, setCategoryData] = useState([]);
    const [isSearchClick, setIsSearchClick] = useState(false);
    const [cat, setCat] = useState('');
    const navigation = useNavigation();

    const handleBtnClick = () => {
        const query = input && cat === "" ? input : cat;
        if (!query || query.trim() === '') return;

        setIsLoading(true);
        axios
            .get(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`)
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
            })
            .finally(()=>{setIsSearchClick(true); setInput(''); setCat('');});
    };

    const updateSearchSection = (results, count) => {
        const visibleItems = results.slice(0, count);
        const str = input && cat === "" ? input : cat;
        const section = {
            title: `Search results for "${str}"`,
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
    }, [refreshKey]);

    useEffect(() => {
        setIsSearchClick(false);
        axios
            .get("https://www.themealdb.com/api/json/v1/1/categories.php")
            .then((response) => {
                const results = response.data.categories || [];
                setCategoryData(results);
            })
            .catch((error) => {
                console.error('API Error:', error);
            });
    }, [refreshKey])
    return (
        <SectionList
        style={styles.container}
        sections={sectionData}
        keyExtractor={(item, index) => item?.strMeal + index}
        ListHeaderComponent={
            
            <>
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
                {!isSearchClick && <View style={styles.catSection}>
                    <Text style={styles.categoryText}>Our Items</Text>
                    <CategorySection data={categoryData} handleBtnClick={handleBtnClick} setCat={setCat}/>
                </View>}
                {isLoading && (
                    <ActivityIndicator size="large" color="#FF5722" style={{ marginTop: 20 }} />
                )}
            </>
        }
        renderItem={({ item }) =>
            item.isPlaceholder ? (
                <Text style={styles.placeholder}>{item.strMeal}</Text>
            ) : (
                <TouchableOpacity
                    style={styles.item}
                    onPress={() => navigation.navigate('ProductDetails', { item })}
                >
                    <Image source={{ uri: item?.strMealThumb }} style={styles.image} />
                    <Text style={styles.itemText}>{item?.strMeal}</Text>
                </TouchableOpacity>
            )
        }
        renderSectionHeader={({ section: { title } }) => (
            <Text style={styles.sectionHeader}>{title} Items</Text>
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
        contentContainerStyle={{ paddingBottom: 40 }}
        stickySectionHeadersEnabled={false}
    />
    );
};

export default HomePage;

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
    categoryText: {
        fontSize: 20,
        color: '#fff',
        fontWeight: 'bold',
        padding: 10,
        textAlign: 'center'
    },
    catSection:{
        backgroundColor: '#6d6761',
        paddingVertical: 50
    }
});