import { NativeStackScreenProps } from '@react-navigation/native-stack'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components/native'
import Swiper from 'react-native-web-swiper'
import {
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  useColorScheme,
  Appearance,
} from 'react-native'
import { makeImgPath } from '../utils'
import { BlurView } from 'expo-blur'
import { YELLOW_COLOR } from '../colors'

const API_KEY = 'eb5535f8d8e2639d00ed95f8b22c5b29'
const Container = styled.ScrollView`
  flex: 1;
`

const View = styled.View`
  flex: 1;
`
const Loader = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`
const BgImg = styled.Image``
const Poster = styled.Image`
  width: 100px;
  height: 160px;
  border-radius: 5px;
`
const Wrapper = styled.View`
  flex-direction: row;
  height: 100%;
  width: 90%;
  margin: 0 auto;
  justify-content: space-around;
  align-items: center;
`
const Column = styled.View`
  width: 60%;
`
const Title = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: white;
  margin-left: 15px;
`
const Overview = styled.Text`
  margin-top: 10px;
  color: ${(props) =>
    props.isDark ? 'rgba(255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8'};
`

const Votes = styled(Overview)`
  font-size: 12px;
`
const { height: SCREEN_HEIGHT } = Dimensions.get('window')

const Movies: React.FC<NativeStackScreenProps<any, 'Movies'>> = () => {
  const isDark = useColorScheme() === 'dark'
  const [loading, setLoading] = useState(true)
  const [nowPlaying, setNowPlaying] = useState([])
  const getNowPlaying = async () => {
    const { results } = await (
      await fetch(
        `https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}&language=en-US&page=1&region=KR`,
      )
    ).json()
    setNowPlaying(results)
    setLoading(false)
  }
  useEffect(() => {
    getNowPlaying()
  }, [])
  return loading ? (
    <Loader>
      <ActivityIndicator size="large" />
    </Loader>
  ) : (
    <Container>
      <Swiper
        loop
        timeout={3.5}
        controlsEnabled={false}
        containerStyle={{ width: '100%', height: SCREEN_HEIGHT / 4 }}
      >
        {nowPlaying.map((movie) => (
          <View key={movie.id}>
            <BgImg
              style={StyleSheet.absoluteFill}
              source={{ uri: makeImgPath(movie.backdrop_path) }}
            />
            <BlurView
              tint={isDark ? 'dark' : 'light'}
              intensity={80}
              style={StyleSheet.absoluteFill}
            >
              <Wrapper>
                <Poster source={{ uri: makeImgPath(movie.poster_path) }} />
                <Column>
                  <Title>{movie.original_title}</Title>
                  <Overview>{movie.overview.slice(0, 80)}...</Overview>
                  <Votes>{movie.vote_average}</Votes>
                </Column>
              </Wrapper>
            </BlurView>
          </View>
        ))}
      </Swiper>
    </Container>
  )
}
export default Movies
