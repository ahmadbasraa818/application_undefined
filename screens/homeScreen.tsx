import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  PanResponder,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from './types';  

type Props = StackScreenProps<RootStackParamList, 'Home'>;

const MainPage = ({ navigation }: Props) => {
  const [titleVisible, setTitleVisible] = useState(true);
  const scrollOffsetY = useRef(0);
  const scrollRef = useRef<ScrollView>(null);

  const handleScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    scrollOffsetY.current = offsetY;
  };

  const handleScrollEndDrag = () => {
    if (scrollOffsetY.current < -100) {
      setTitleVisible(false);
    } else {
      setTitleVisible(true);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.scrollContainer}
        onScroll={handleScroll}
        onScrollEndDrag={handleScrollEndDrag}
        scrollEventThrottle={16}
      >
        {titleVisible && (
          <View style={styles.headerContainer}>
            <Text style={styles.title}>Welcome to the Home Screen</Text>
          </View>
        )}
        <Text style={styles.infoText}>
          Scroll down to hide the title, scroll up to show the title.
        </Text>
        <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.buttonText}>Go Back to Login Screen</Text>
      </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 40,
    backgroundColor: '#120f2a',
  },
  headerContainer: {
    backgroundColor: '#7a4bf6',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    paddingVertical: 10,
    paddingRight: 15,
    paddingLeft: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  scrollContainer: {
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  button: {
    top: 700,
    position: 'absolute',
    backgroundColor: '#7a4bf6',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignSelf: 'center',
  },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
  infoText: {
    marginTop: 70,
    paddingVertical: 20,
    fontSize: 20,
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
  },
});

export default MainPage;
