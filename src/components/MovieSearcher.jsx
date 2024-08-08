import { useState, useEffect } from 'react';
import { TextField, Checkbox, FormControlLabel, FormControl, MenuItem, Select, InputLabel, Button, Grid, Box, Container } from '@mui/material';
import MovieCard from './MovieCard'; 

const MovieSearcher = () => {
    const [filters, setFilters] = useState({
        query: '',
        includeAdult: false,
        language: 'en-US',
        year: '',
    });
    const [movies, setMovies] = useState([]);
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);
    
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
        setIsButtonDisabled(filters.query.trim() === '');
    }, [filters.query]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFilters({
            ...filters,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const fetchMovies = () => {
        const query = new URLSearchParams(filters).toString();
        fetch(`http://localhost:5000/search-movies?${query}`)
            .then(response => response.json())
            .then(data => setMovies(data.results || []))
            .catch(error => console.error('Error fetching movies:', error));
    };

    return (
        <Container>
            <Box sx={{ mb: 4 }}>
                <TextField
                    label="Query"
                    variant="outlined"
                    name="query"
                    value={filters.query}
                    onChange={handleChange}
                    style={{ marginRight: '10px' }}
                />
                <TextField
                    label="Year"
                    type="number"
                    variant="outlined"
                    name="year"
                    value={filters.year}
                    onChange={handleChange}
                    style={{ marginRight: '10px' }}
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            name="includeAdult"
                            checked={filters.includeAdult}
                            onChange={handleChange}
                        />
                    }
                    label="Include Adult"
                />
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
                <Button
                    variant="contained"
                    color="primary"
                    onClick={fetchMovies}
                    style={{ marginLeft: '20px' }}
                    disabled={isButtonDisabled}
                >
                    Search
                </Button>
            </Box>
            <Grid container spacing={3}>
                {movies.map((movie) => (
                    <MovieCard 
                        key={movie.id} 
                        movie={movie} 
                        context="searcher"
                    />
                ))}
            </Grid>
        </Container>
    );
};

export default MovieSearcher;