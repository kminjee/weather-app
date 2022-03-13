import React, { useEffect, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import { Fontisto } from "@expo/vector-icons";
import * as Location from 'expo-location';

const { width:SCREEN_WIDTH } = Dimensions.get("window");

const API_KEY = null;

const icons = {
  Clear: "day-sunny",
  Clouds: "cloudy",
  Rain: "rain",
  Atmosphere: "cloudy-gusts",
  Snow: "snow",
  Drizzle: "day-rain",
  Thunderstorm: "lightning",
}


export default function App() {

  const [city, setCity] = useState("Loading...");
  const [days, setDays] = useState([]);
  const [done, setDone] = useState(true);

  const ask = async() => {
    const { granted } = await Location.requestForegroundPermissionsAsync();
    if (!granted) {
      setDone(false);
    }
    const { coords: { latitude, longitude } } = await Location.getCurrentPositionAsync({ accuracy: 5 });
    const location = await Location.reverseGeocodeAsync({ latitude, longitude }, { useGoogleMaps: false });
    setCity(location[0].city);
    
    const response = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts&appid=${API_KEY}&units=metric`);

    const json = await response.json();
    setDays(json.daily);
  }

  useEffect(() => {
    ask();
  }, [])

  return (
    <LinearGradient style={styles.container} colors={['#0359AE', '#EBE5D9']}>
      <View style={styles.city}>
        <Text style={styles.cityName}>{city}</Text>
      </View>
      <ScrollView 
        pagingEnabled 
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        {days.length === 0 
          ? (<View style={styles.loading}><ActivityIndicator color="white" size="large" /></View>)
          : (days.map((day, idx) => 
              <View key={idx} style={styles.day}>
                <Text style={styles.temp}>{parseFloat(day.temp.day).toFixed(0)}</Text>
                <Text style={styles.desc}><Fontisto name={icons[day.weather[0].main]} size={30} color="white" /> {day.weather[0].main}</Text>
                <Text style={styles.subDesc}>{day.weather[0].description}</Text>
              </View>
            ))
        }
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  city: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  cityName: {
    fontSize: 60,
    color: '#FFF'
  },
  loading: {
    width: SCREEN_WIDTH,
    alignItems: 'center',
    marginTop: 10 
  },
  day: {
    width: SCREEN_WIDTH,
    alignItems: 'center'
  },
  temp: {
    fontSize: 170,
    fontWeight: '500',
    color: '#FFF'
  },
  desc: {
    fontSize: 40,
    color: '#FFF'
  },
  subDesc: {
    fontSize: 20,
    color: '#FFF'
  }
})