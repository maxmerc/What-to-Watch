import { useState, useContext } from 'react';
import { Card, CardContent, CardMedia, Typography, Grid, IconButton, TextField, Box, Button, Tooltip } from '@mui/material';
import { Favorite, FavoriteBorder, PlaylistAdd, Delete, PlaylistRemove } from '@mui/icons-material';
import PropTypes from 'prop-types';
import AuthContext from './AuthContext';

const MovieCard = ({ movie, context, onUpdate }) => {
    const { sessionId, accountId } = useContext(AuthContext);
    const [rating, setRating] = useState('');

    const handleRatingChange = (e) => {
        const value = e.target.value;
        if (value === '' || (Number(value) >= 1 && Number(value) <= 10)) {
            setRating(value);
        }
    };

    const handleRateMovie = async () => {
        if (rating) {
            await rateMovie(movie.id, parseInt(rating), sessionId);
        }
    };

    const handleWatchlistToggle = async () => {
        if (context === "watchlist") {
            await addToWatchlist(movie.id, accountId, sessionId, false);
        } else {
            await addToWatchlist(movie.id, accountId, sessionId, true);
        }
        onUpdate && onUpdate();
    };

    const handleFavoritesToggle = async () => {
        if (context === "favorites") {
            await addToFavorites(movie.id, accountId, sessionId, false);
        } else {
            await addToFavorites(movie.id, accountId, sessionId, true);
        }
        onUpdate && onUpdate();
    };

    const API_BASE_URL = 'http://localhost:5000';

    const addToWatchlist = async (movieId, accountId, sessionId, add) => {
    try {
        const response = await fetch(`${API_BASE_URL}/add-to-watchlist`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ movieId, accountId, sessionId, add }),
        });
        return response.json();
    } catch (error) {
        console.error('Error adding to watchlist:', error);
    }
};

    const addToFavorites = async (movieId, accountId, sessionId, add) => {
    try {
        const response = await fetch(`${API_BASE_URL}/add-to-favorites`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ movieId, accountId, sessionId, add }),
        });
        return response.json();
    } catch (error) {
        console.error('Error adding to favorites:', error);
    }
};

    const rateMovie = async (movieId, rating, sessionId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/rate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ movieId, rating, sessionId }),
        });
        return response.json();
    } catch (error) {
        console.error('Error rating movie:', error);
    }
};

const deleteRating = async (movieId, sessionId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/delete-`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ movieId, sessionId }),
        });
        return response.json();
    } catch (error) {
        console.error('Error deleting rating:', error);
    }
};

    return (
        <Grid item xs={12} sm={6} md={4}>
            <Card>
                <CardMedia
                    component="img"
                    height="140"
                    image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        {movie.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {movie.overview}
                    </Typography>
                    {sessionId && accountId && (
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Tooltip title={context === "watchlist" ? "Remove from Watch List" : "Add to Watch List"}>
                                    <IconButton onClick={handleWatchlistToggle}>
                                        {context === "watchlist" ? <PlaylistRemove /> : <PlaylistAdd />}
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title={context === "favorites" ? "Remove from Favorites" : "Add to Favorites"}>
                                    <IconButton onClick={handleFavoritesToggle}>
                                        {context === "favorites" ? <Favorite /> : <FavoriteBorder />}
                                    </IconButton>
                                </Tooltip>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
                                <TextField
                                    label="Rate"
                                    type="number"
                                    value={rating}
                                    onChange={handleRatingChange}
                                    inputProps={{ min: 1, max: 10 }}
                                    size="small"
                                    sx={{ mr: 1 }}
                                />
                                <Button 
                                    variant="contained" 
                                    color="primary" 
                                    onClick={handleRateMovie}
                                    sx={{ fontSize: '0.75rem', padding: '4px 8px' }}
                                >
                                    Submit Rating
                                </Button>
                            </Box>
                            <Tooltip title="Delete Rating">
                                <IconButton onClick={() => deleteRating(movie.id, sessionId)}>
                                    <Delete />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    )}
                </CardContent>
            </Card>
        </Grid>
    );
};

MovieCard.propTypes = {
    movie: PropTypes.object.isRequired,
    context: PropTypes.string.isRequired,
    onUpdate: PropTypes.func,
};

export default MovieCard;