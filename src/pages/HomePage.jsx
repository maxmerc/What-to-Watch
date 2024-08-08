import { useState, useEffect } from 'react';
import { Container, Grid, Typography, Box } from '@mui/material';
import MovieFinder from '../components/MovieFinder';
import MovieSearcher from '../components/MovieSearcher.jsx';
import MovieCard from '../components/MovieCard';

export default function HomePage() {
    const [trendMovies, setTrendMovies] = useState([]);
    const [playingMovies, setPlayingMovies] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5000/trending-movies')
            .then(response => response.json())
            .then(data => {
                setTrendMovies(data);
            })
            .catch(error => console.error('Error fetching trending movies:', error));
    }, []);

    useEffect(() => {
        fetch('http://localhost:5000/now-playing')
            .then(response => response.json())
            .then(data => {
                setPlayingMovies(data);
            })
            .catch(error => console.error('Error fetching trending movies:', error));
    }, []);

    return (
        <Container>
            <Box sx={{ textAlign: 'center', my: 4 }}>
                <Typography variant="h2" component="h1" gutterBottom>
                    What to Watch
                </Typography>
                <Typography variant="h5" component="p" gutterBottom>
                    Welcome to What to Watch! Our web app allows you to create an account, maintain a list of movies you have finished watching, and keep a want-to-watch list. Based on your preferences, we will also provide suggestions for your next movie to watch.
                    Sign in with your email and a password to get started!
                </Typography>
            </Box>

            <Typography variant="h4" component="h2" gutterBottom>
                Currently Trending Movies:
            </Typography>
            <Grid container spacing={3}>
                {trendMovies.map((movie) => (
                    <MovieCard
                        key={movie.id}
                        movie={movie}
                        context="trending"
                    />
                ))}
            </Grid>

            <Typography variant="h4" component="h2" gutterBottom>
                Now Playing:
            </Typography>
            <Grid container spacing={3}>
                {playingMovies.map((movie) => (
                    <MovieCard
                        key={movie.id}
                        movie={movie}
                        context="now-playing"
                    />
                ))}
            </Grid>
            
            <Box sx={{ my: 4 }}>
                <Typography variant="h4" component="h2" gutterBottom>
                    Find Your Next Movie by Title!
                </Typography>
                <MovieSearcher />
            </Box>

            <Box sx={{ my: 4 }}>
                <Typography variant="h4" component="h2" gutterBottom>
                    Find Your Next Movie by Filters!
                </Typography>
                <MovieFinder />
            </Box>
        </Container>
    );
}
