import { useState, useEffect } from 'react';
import { Container, Grid, Typography, TextField, Button, Box, MenuItem, Select, InputLabel, FormControl, Checkbox, FormControlLabel } from '@mui/material';
import MovieCard from './MovieCard';

export default function MovieFinder() {
    const [movies, setMovies] = useState([]);
    const [genres, setGenres] = useState([]);
    const [filters, setFilters] = useState({
        language: 'en-US',
        sort_by: 'popularity.desc',
        include_adult: false,
        include_video: false,
        with_genres: [],
        with_keywords: '',
        with_cast: '',
        primary_release_year: '',
        release_date_gte: '',
        release_date_lte: '',
        vote_average_gte: '',
        vote_average_lte: '',
        year: '',
        with_origin_country: '',
        with_release_type: ''
    });

    const languages = [
        { code: 'af', name: 'Afrikaans' },
        { code: 'sq', name: 'Albanian' },
        { code: 'ar-BH', name: 'Arabic (Bahrain)' },
        { code: 'ar-EG', name: 'Arabic (Egypt)' },
        { code: 'ar-IQ', name: 'Arabic (Iraq)' },
        { code: 'ar-JO', name: 'Arabic (Jordan)' },
        { code: 'ar-KW', name: 'Arabic (Kuwait)' },
        { code: 'ar-LB', name: 'Arabic (Lebanon)' },
        { code: 'ar-LY', name: 'Arabic (Libya)' },
        { code: 'ar-MA', name: 'Arabic (Morocco)' },
        { code: 'ar-OM', name: 'Arabic (Oman)' },
        { code: 'ar-QA', name: 'Arabic (Qatar)' },
        { code: 'ar-SA', name: 'Arabic (Saudi Arabia)' },
        { code: 'ar-SY', name: 'Arabic (Syria)' },
        { code: 'ar-TN', name: 'Arabic (Tunisia)' },
        { code: 'ar-AE', name: 'Arabic (U.A.E.)' },
        { code: 'ar-YE', name: 'Arabic (Yemen)' },
        { code: 'eu', name: 'Basque' },
        { code: 'be', name: 'Belarusian' },
        { code: 'bg', name: 'Bulgarian' },
        { code: 'ca', name: 'Catalan' },
        { code: 'zh-HK', name: 'Chinese (Hong Kong)' },
        { code: 'zh-CN', name: 'Chinese (PRC)' },
        { code: 'zh-SG', name: 'Chinese (Singapore)' },
        { code: 'zh-TW', name: 'Chinese (Taiwan)' },
        { code: 'hr', name: 'Croatian' },
        { code: 'cs', name: 'Czech' },
        { code: 'da', name: 'Danish' },
        { code: 'nl-BE', name: 'Dutch (Belgium)' },
        { code: 'nl', name: 'Dutch (Standard)' },
        { code: 'en', name: 'English' },
        { code: 'en-AU', name: 'English (Australia)' },
        { code: 'en-BZ', name: 'English (Belize)' },
        { code: 'en-CA', name: 'English (Canada)' },
        { code: 'en-IE', name: 'English (Ireland)' },
        { code: 'en-JM', name: 'English (Jamaica)' },
        { code: 'en-NZ', name: 'English (New Zealand)' },
        { code: 'en-ZA', name: 'English (South Africa)' },
        { code: 'en-TT', name: 'English (Trinidad)' },
        { code: 'en-GB', name: 'English (United Kingdom)' },
        { code: 'en-US', name: 'English (United States)' },
        { code: 'et', name: 'Estonian' },
        { code: 'fo', name: 'Faeroese' },
        { code: 'fa', name: 'Farsi' },
        { code: 'fi', name: 'Finnish' },
        { code: 'fr-BE', name: 'French (Belgium)' },
        { code: 'fr-CA', name: 'French (Canada)' },
        { code: 'fr-LU', name: 'French (Luxembourg)' },
        { code: 'fr', name: 'French (Standard)' },
        { code: 'fr-CH', name: 'French (Switzerland)' },
        { code: 'gd', name: 'Gaelic (Scotland)' },
        { code: 'de-AT', name: 'German (Austria)' },
        { code: 'de-LI', name: 'German (Liechtenstein)' },
        { code: 'de-LU', name: 'German (Luxembourg)' },
        { code: 'de', name: 'German (Standard)' },
        { code: 'de-CH', name: 'German (Switzerland)' },
        { code: 'el', name: 'Greek' },
        { code: 'he', name: 'Hebrew' },
        { code: 'hi', name: 'Hindi' },
        { code: 'hu', name: 'Hungarian' },
        { code: 'is', name: 'Icelandic' },
        { code: 'id', name: 'Indonesian' },
        { code: 'ga', name: 'Irish' },
        { code: 'it', name: 'Italian (Standard)' },
        { code: 'it-CH', name: 'Italian (Switzerland)' },
        { code: 'ja', name: 'Japanese' },
        { code: 'ko', name: 'Korean' },
        { code: 'ku', name: 'Kurdish' },
        { code: 'lv', name: 'Latvian' },
        { code: 'lt', name: 'Lithuanian' },
        { code: 'mk', name: 'Macedonian (FYROM)' },
        { code: 'ml', name: 'Malayalam' },
        { code: 'ms', name: 'Malaysian' },
        { code: 'mt', name: 'Maltese' },
        { code: 'no', name: 'Norwegian' },
        { code: 'nb', name: 'Norwegian (Bokmål)' },
        { code: 'nn', name: 'Norwegian (Nynorsk)' },
        { code: 'pl', name: 'Polish' },
        { code: 'pt-BR', name: 'Portuguese (Brazil)' },
        { code: 'pt', name: 'Portuguese (Portugal)' },
        { code: 'pa', name: 'Punjabi' },
        { code: 'rm', name: 'Rhaeto-Romanic' },
        { code: 'ro', name: 'Romanian' },
        { code: 'ro-MD', name: 'Romanian (Republic of Moldova)' },
        { code: 'ru', name: 'Russian' },
        { code: 'ru-MD', name: 'Russian (Republic of Moldova)' },
        { code: 'sr', name: 'Serbian' },
        { code: 'sk', name: 'Slovak' },
        { code: 'sl', name: 'Slovenian' },
        { code: 'sb', name: 'Sorbian' },
        { code: 'es-AR', name: 'Spanish (Argentina)' },
        { code: 'es-BO', name: 'Spanish (Bolivia)' },
        { code: 'es-CL', name: 'Spanish (Chile)' },
        { code: 'es-CO', name: 'Spanish (Colombia)' },
        { code: 'es-CR', name: 'Spanish (Costa Rica)' },
        { code: 'es-DO', name: 'Spanish (Dominican Republic)' },
        { code: 'es-EC', name: 'Spanish (Ecuador)' },
        { code: 'es-SV', name: 'Spanish (El Salvador)' },
        { code: 'es-GT', name: 'Spanish (Guatemala)' },
        { code: 'es-HN', name: 'Spanish (Honduras)' },
        { code: 'es-MX', name: 'Spanish (Mexico)' },
        { code: 'es-NI', name: 'Spanish (Nicaragua)' },
        { code: 'es-PA', name: 'Spanish (Panama)' },
        { code: 'es-PY', name: 'Spanish (Paraguay)' },
        { code: 'es-PE', name: 'Spanish (Peru)' },
        { code: 'es-PR', name: 'Spanish (Puerto Rico)' },
        { code: 'es', name: 'Spanish (Spain)' },
        { code: 'es-UY', name: 'Spanish (Uruguay)' },
        { code: 'es-VE', name: 'Spanish (Venezuela)' },
        { code: 'sv', name: 'Swedish' },
        { code: 'sv-FI', name: 'Swedish (Finland)' },
        { code: 'th', name: 'Thai' },
        { code: 'ts', name: 'Tsonga' },
        { code: 'tn', name: 'Tswana' },
        { code: 'tr', name: 'Turkish' },
        { code: 'uk', name: 'Ukrainian' },
        { code: 'ur', name: 'Urdu' },
        { code: 've', name: 'Venda' },
        { code: 'vi', name: 'Vietnamese' },
        { code: 'cy', name: 'Welsh' },
        { code: 'xh', name: 'Xhosa' },
        { code: 'ji', name: 'Yiddish' },
        { code: 'zu', name: 'Zulu' }
    ];

    useEffect(() => {
        fetch(`http://localhost:5000/movie-genres`)
            .then(response => response.json())
            .then(data => setGenres(data.genres))
            .catch(error => console.error('Error fetching genres:', error));
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFilters({
            ...filters,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const fetchMovies = () => {
        const query = new URLSearchParams(filters).toString();
        fetch(`http://localhost:5000/discover-movies?${query}`)
            .then(response => response.json())
            .then(data => setMovies(data.results || []))
            .catch(error => console.error('Error fetching movies:', error));
    };

    return (
        <Container>
            <Box sx={{ mb: 4 }}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Language</InputLabel>
                    <Select
                        name="language"
                        value={filters.language}
                        onChange={handleChange}
                    >
                        {languages.map((lang) => (
                            <MenuItem key={lang.code} value={lang.code}>
                                {lang.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Sort By</InputLabel>
                    <Select
                        name="sort_by"
                        value={filters.sort_by}
                        onChange={handleChange}
                    >
                        <MenuItem value="popularity.desc">Popularity (Desc)</MenuItem>
                        <MenuItem value="popularity.asc">Popularity (Asc)</MenuItem>
                        <MenuItem value="revenue.desc">Title (Desc)</MenuItem>
                        <MenuItem value="revenue.asc">Title (Asc)</MenuItem>
                        <MenuItem value="primary_release_date.desc">Release Date (Desc)</MenuItem>
                        <MenuItem value="primary_release_date.asc">Release Date (Asc)</MenuItem>
                        <MenuItem value="title.desc">Title (Desc)</MenuItem>
                        <MenuItem value="title.asc">Title (Asc)</MenuItem>
                        <MenuItem value="vote_average.desc">Vote Average (Desc)</MenuItem>
                        <MenuItem value="vote_average.asc">Vote Average (Asc)</MenuItem>
                        <MenuItem value="vote_count.desc">Vote Count (Desc)</MenuItem>
                        <MenuItem value="vote_count.asc">Vote Count (Asc)</MenuItem>
                    </Select>
                </FormControl>
                <FormControlLabel
                    control={<Checkbox name="include_adult" checked={filters.include_adult} onChange={handleChange} />}
                    label="Include Adult"
                />
                <FormControlLabel
                    control={<Checkbox name="include_video" checked={filters.include_video} onChange={handleChange} />}
                    label="Include Video"
                />
                <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Genres</InputLabel>
                    <Select
                        name="with_genres"
                        multiple
                        value={filters.with_genres}
                        onChange={handleChange}
                        renderValue={(selected) => (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                {selected.map((value) => (
                                    <Typography key={value}>{genres.find(genre => genre.id === value)?.name}</Typography>
                                ))}
                            </Box>
                        )}
                        label="Genres"
                    >
                        {genres.map((genre) => (
                            <MenuItem key={genre.id} value={genre.id}>
                                {genre.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <TextField
                    label="Keywords"
                    name="with_keywords"
                    value={filters.with_keywords}
                    onChange={handleChange}
                    fullWidth
                    sx={{ mb: 2 }}
                />
                <TextField
                    label="Cast"
                    name="with_cast"
                    value={filters.with_cast}
                    onChange={handleChange}
                    fullWidth
                    sx={{ mb: 2 }}
                />
                <TextField
                    label="Max Release Date"
                    name="release_date_gte"
                    type="date"
                    value={filters.release_date_gte}
                    onChange={handleChange}
                    fullWidth
                    sx={{ mb: 2 }}
                    InputLabelProps={{ shrink: true }}
                />
                <TextField
                    label="Min Release Date"
                    name="release_date_lte"
                    type="date"
                    value={filters.release_date_lte}
                    onChange={handleChange}
                    fullWidth
                    sx={{ mb: 2 }}
                    InputLabelProps={{ shrink: true }}
                />
                <TextField
                    label="Min Vote Average"
                    name="vote_average_gte"
                    type="number"
                    value={filters.vote_average_gte}
                    onChange={handleChange}
                    fullWidth
                    sx={{ mb: 2 }}
                />
                <TextField
                    label="Max Vote Average"
                    name="vote_average_lte"
                    type="number"
                    value={filters.vote_average_lte}
                    onChange={handleChange}
                    fullWidth
                    sx={{ mb: 2 }}
                />
                <TextField
                    label="Year"
                    name="year"
                    type="number"
                    value={filters.year}
                    onChange={handleChange}
                    fullWidth
                    sx={{ mb: 2 }}
                />
                <TextField
                    label="Origin Country"
                    name="with_origin_country"
                    value={filters.with_origin_country}
                    onChange={handleChange}
                    fullWidth
                    sx={{ mb: 2 }}
                />
                <TextField
                    label="Release Type"
                    name="with_release_type"
                    type="number"
                    value={filters.with_release_type}
                    onChange={handleChange}
                    fullWidth
                    sx={{ mb: 2 }}
                />
                <Button variant="contained" onClick={fetchMovies}>Search</Button>
            </Box>
            <Grid container spacing={3}>
                {movies.map((movie) => (
                    <MovieCard
                        key={movie.id}
                        movie={movie}
                        context="finder"
                    />
                ))}
            </Grid>
        </Container>
    );
}