import { NativeStackScreenProps } from '@react-navigation/native-stack'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components/native'
import Swiper from 'react-native-swiper'
import { ActivityIndicator, Dimensions, ScrollView } from 'react-native'
import Slide from '../components/Slide'
import Poster from '../components/Poster'

const API_KEY = 'eb5535f8d8e2639d00ed95f8b22c5b29'
const Container = styled.ScrollView`
  flex: 1;
`
const Loader = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`
const ListTitle = styled.Text`
  color: white;
  font-size: 16px;
  font-weight: 600;
  margin-left: 30px;
  margin-top: 20px;
`
const TrendingScroll = styled.ScrollView`
  margin-top: 20px;
`

const Movie = styled.View`
  margin-right: 20px;
  align-items: center;
`

const Title = styled.Text`
  color: white;
  font-weight: 600;
  margin-top: 7px;
  margin-bottom: 5px;
`
const Votes = styled.Text`
  font-size: 10px;
  color: white;
`
const ListContainer = styled.View`
  margin-bottom: 40px;
`

const HMovie = styled.View`
  padding: 0px 30px;
  flex-direction: row;
  margin-bottom: 30px;
`

const HColumn = styled.View`
  margin-left: 15px;
  width: 80%;
`

const OverView = styled.Text`
  color: white;
  opacity: 0.5;
  width: 80%;
`

const Release = styled.Text`
  color: white;
  font-size: 12px;
  margin-top: 10px;
`
// Extends your Style
const CommingSoonTitle = styled(ListTitle)`
  margin-bottom: 30px;
`

const { height: SCREEN_HEIGHT } = Dimensions.get('window')
const Movies: React.FC<NativeStackScreenProps<any, 'Movies'>> = () => {
  const [loading, setLoading] = useState(true)
  const [nowPlaying, setNowPlaying] = useState([])
  const [upcoming, setUpcoming] = useState([])
  const [trending, setTrending] = useState([])
  const getTrending = async () => {
    const { results } = await (
      await fetch(
        `https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}`,
      )
    ).json()
    setTrending(results)
  }
  const getUpcoming = async () => {
    const { results } = await (
      await fetch(
        `https://api.themoviedb.org/3/movie/upcoming?api_key=${API_KEY}&language=en-US&page=1`,
      )
    ).json()
    setUpcoming(results)
  }
  const getNowPlaying = async () => {
    const { results } = await (
      await fetch(
        `https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}&language=en-US&page=1&region=KR`,
      )
    ).json()
    setNowPlaying(results)
  }
  const getData = async () => {
    await Promise.all([getTrending(), getUpcoming(), getNowPlaying()])
    setLoading(false)
  }
  useEffect(() => {
    getData()
  }, [])
  return loading ? (
    <Loader>
      <ActivityIndicator size="large" />
    </Loader>
  ) : (
    <Container>
      <Swiper
        horizontal
        loop
        autoplay
        autoplayTimeout={3.5}
        showsButtons={false}
        showsPagination={false}
        containerStyle={{ width: '100%', height: SCREEN_HEIGHT / 4 }}
      >
        {nowPlaying.map((movie) => (
          <Slide
            key={movie.id}
            backdropPath={movie.backdrop_path}
            posterPath={movie.poster_path}
            originalTitle={movie.original_title}
            voteAverage={movie.vote_average}
            overview={movie.overview}
          />
        ))}
      </Swiper>
      <ListContainer>
        <ListTitle>Trending Movies</ListTitle>
        <TrendingScroll
          contentContainerStyle={{ paddingLeft: 60 }}
          horizontal
          showsHorizontalScrollIndicator
        >
          {trending.map((movie) => (
            <Movie key={movie.id}>
              <Poster path={movie.poster_path} />
              <Title>
                {movie.original_title.slice(0, 13)}
                {movie.original_title.length > 13 ? '...' : null}
              </Title>
              <Votes>
                {movie.vote_average > 0
                  ? `?????? ${movie.vote_average}/10`
                  : `Coming soon`}
              </Votes>
            </Movie>
          ))}
        </TrendingScroll>
      </ListContainer>
      <CommingSoonTitle>Comming soon</CommingSoonTitle>
      {upcoming.map((movie) => (
        <HMovie key={movie.id}>
          <Poster path={movie.poster_path} />
          <HColumn>
            <Title>
              {movie.original_title.slice(0, 13)}
              {movie.original_title.length > 13 ? '...' : null}
            </Title>
            <OverView>
              {movie.overview !== '' && movie.overview.length > 80
                ? `${movie.overview.slice(0, 80)}...`
                : movie.overview}
            </OverView>
            <Release>
              {new Date(movie.release_date).toLocaleDateString('ko', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </Release>
          </HColumn>
        </HMovie>
      ))}
    </Container>
  )
}
export default Movies
