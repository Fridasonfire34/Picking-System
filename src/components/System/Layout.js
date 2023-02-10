import React from 'react';
import { SafeAreaView, ScrollView, View, StyleSheet } from 'react-native';

const Layout = ({ children }) => {
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scroll}>
                <View>
                    {children}
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    scroll: {
        flexGrow: 1
    }
});

export default Layout;