import React from 'react';
import {
    ScrollView,
    Text,
    StyleSheet,
    View,
    ImageBackground,
    Animated,
    useWindowDimensions,
    useAnimatedValue,
    Touchable,
    TouchableOpacity,
} from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';

const CategorySection = ({ data, handleBtnClick, setCat}) => {
    const scrollX = useAnimatedValue(0);
    const {width: windowWidth} = useWindowDimensions();
    return (
                <View>
                    <ScrollView
                        horizontal={true}
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        onScroll={
                            Animated.event([
                                {
                                    nativeEvent: {
                                        contentOffset: {
                                            x: scrollX,
                                        }
                                    }
                                }
                            ], { useNativeDriver: false })
                        }
                        scrollEventThrottle={1}
                    >
                        {data.map((item, imageIndex) => {
                            return (
                                <View
                                    style={{ width: windowWidth, height: 250 }}
                                    key={imageIndex}>
                                    <ImageBackground source={{ uri: item.strCategoryThumb }} style={styles.card}>
                                        <TouchableOpacity style={styles.textContainer} onPress={()=> {setCat(item.strCategory), handleBtnClick()}}>
                                            <Text style={styles.infoText}>
                                                {item.strCategory}
                                            </Text>
                                        </TouchableOpacity>
                                    </ImageBackground>
                                </View>
                            );
                        })}
                    </ScrollView>
                    <View style={styles.indicatorContainer}>
                        {data.map((image, imageIndex) => {
                            const width = scrollX.interpolate({
                                inputRange: [
                                    windowWidth * (imageIndex - 1),
                                    windowWidth * imageIndex,
                                    windowWidth * (imageIndex + 1),
                                ],
                                outputRange: [8, 16, 8],
                                extrapolate: 'clamp',
                            });
                            return (
                                <Animated.View
                                    key={imageIndex}
                                    style={[styles.normalDot, { width }]}
                                />
                            );
                        })}
                    </View>
                </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    scrollContainer: {
        height: 300,
        alignItems: 'center',
        justifyContent: 'center',
    },
    card: {
        flex: 1,
        marginVertical: 4,
        marginHorizontal: 16,
        borderRadius: 5,
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
    },
    textContainer: {
        backgroundColor: 'rgba(0,0,0, 0.7)',
        paddingHorizontal: 24,
        paddingVertical: 8,
        borderRadius: 5,
    },
    infoText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    normalDot: {
        height: 8,
        width: 8,
        borderRadius: 4,
        backgroundColor: 'silver',
        marginHorizontal: 4,
    },
    indicatorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default CategorySection;