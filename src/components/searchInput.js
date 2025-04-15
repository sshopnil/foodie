import { useState } from 'react';
import { TextInput, TouchableOpacity } from 'react-native';
import { View, Text } from 'react-native'
import React from 'react'
import { StyleSheet } from 'react-native';


const SearchInput = ({input, setInput, handleBtnClick}) => {
    

    return (
        <View style={styles.searchGroup}>
            <TextInput
                value={input}
                style={styles.input}
                placeholder='search here..'
                onChangeText={setInput}
            />
            <TouchableOpacity style={styles.searchBtn} onPress={handleBtnClick}>
                <Text style={styles.searchText}>Search</Text>
            </TouchableOpacity>
        </View>
    )
}

export default SearchInput;


const styles = StyleSheet.create({
    searchGroup: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-around',
    },
    input: {
      alignSelf:'center',
      flex: 1,
      backgroundColor: 'white',
      paddingHorizontal: 10,
      height: 40,
      borderRadius: 5,
      marginRight: 10,
    },
    searchBtn: {
      backgroundColor: 'black',
      paddingVertical: 10,
      paddingHorizontal: 15,
      borderRadius: 5,
      alignSelf: 'center'
    },
    searchText: {
      color: 'white',
      fontWeight: 'bold',
    },
  })