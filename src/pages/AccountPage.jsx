import { useState, useEffect, useContext } from 'react';
import { Container, Typography, Grid, CircularProgress, Button, Box } from '@mui/material';
import MovieCard from '../components/MovieCard'; // Import MovieCard to display movies
import AuthContext from '../components/AuthContext';

export default function AccountPage() {
    const { accountId, sessionId } = useContext(AuthContext);
    const [favorites, setFavorites] = useState([]);
    const [watchListMovies, setWatchListMovies] = useState([]);
    const [recommendations, setRecommendations] = useState([]);

    useEffect(() => {
        if (accountId && sessionId) {
            fetchFavorites();
            fetchWatchListMovies();
        }
    }, [accountId, sessionId]);

    const fetchFavorites = async () => {
        fetch('http://localhost:5000/favorite-movies')
        .then(response => response.json())
        .then(data => {
            setFavorites(data.results || []);
        })
        .catch(error => console.error('Error fetching trending movies:', error));
    };

    const fetchWatchListMovies = async () => {
        fetch('http://localhost:5000/watchlist-movies')
        .then(response => response.json())
        .then(data => {
            setWatchListMovies(data.results || []);
        })
        .catch(error => console.error('Error fetching trending movies:', error));
    };

    const handleUpdateFavorites = () => {
        fetchFavorites();
    };

    const handleUpdateWatchlist = () => {
        fetchWatchListMovies();
    };

    const generateRecommendations = async () => {
        const fetchRatedMovies = async (page) => {
            const response = await fetch(`http://localhost:5000/rated-movies?page=${page}`);
            if (response.ok) {
                const data = await response.json();
                return data;
            } else {
                console.error('Failed to fetch rated movies');
                return null;
            }
        };
    
        let page = 1;
        let ratedMovies = [];
    
        // Automatically fetch all pages of rated movies
        while (page < 3) {
            const data = await fetchRatedMovies(page);
            if (data && data.results.length > 0) {
                ratedMovies = ratedMovies.concat(data.results);
                if (page >= data.total_pages) break;
                page += 1;
            } else {
                break;
            }
        }
    
        if (ratedMovies.length === 0) return;
    
        const movieNamesRatings = ratedMovies.map(movie => `${movie.title} (${movie.rating})`).join(', ');
    
        const response = await fetch('http://localhost:5000/chatgpt-recommendation', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ movies: movieNamesRatings })
        });
    
        if (response.ok) {
            const data = await response.json();
            setRecommendations(data);
        } else {
            console.error('Failed to fetch recommendations');
        }
    };

    return (
        <Container>
            <Typography variant="h2" component="h1" gutterBottom>
                Account Page
            </Typography>
            <Typography variant="h5" component="p" gutterBottom>
                Welcome to the account page! Here you can view your favorited movies and your watch list. As well, you can view your next movie recommendations!
            </Typography>
            <Typography variant="h6" component="h2" gutterBottom>
                Favorite Movies:
            </Typography>
            {favorites.length === 0 ? (
                <CircularProgress />
            ) : (
                <Grid container spacing={3}>
                    {favorites.map(movie => (
                        <MovieCard 
                            key={movie.id} 
                            movie={movie} 
                            context="favorites"
                            onUpdate={handleUpdateFavorites}
                        />
                    ))}
                </Grid>
            )}
            <Box />
            <Typography variant="h6" component="h2" gutterBottom>
                Want to Watch List:
            </Typography>
            {watchListMovies.length === 0 ? (
                <CircularProgress />
            ) : (
                <Grid container spacing={3}>
                    {watchListMovies.map(movie => (
                        <MovieCard 
                            key={movie.id} 
                            movie={movie}
                            context="watchlist"
                            onUpdate={handleUpdateWatchlist}
                        />
                    ))}
                </Grid>
            )}
            <Box />
            <Button 
                variant="contained" 
                color="primary" 
                onClick={generateRecommendations}
                sx={{ mb: 2 }}
            >
                Generate Recommendations
            </Button>
            {recommendations.length > 0 && (
                <Box>
                    <Typography variant="h6" component="h2" gutterBottom>
                        Recommended Movies:
                    </Typography>
                    <Typography variant="body1">
                        {recommendations.join(', ')}
                    </Typography>
                </Box>
            )}
        </Container>
    );
}