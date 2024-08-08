from flask import Flask, request, redirect, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from werkzeug.security import check_password_hash, generate_password_hash
from dotenv import load_dotenv
import openai
import os
import requests

load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db'
db = SQLAlchemy(app)

TMDB_API_KEY = os.getenv('TMDB_API_KEY')
TMDB_READ_ACCESS_TOKEN = os.getenv('TMDB_READ_ACCESS_TOKEN')
openai.api_key = os.getenv("OPENAI_API_KEY")

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(20), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(60), nullable=False)

    def __repr__(self):
        return f"User('{self.username}', '{self.email}')"

with app.app_context():
    db.create_all()

@app.route("/sign-in", methods=['POST'])
def sign_in():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    user = User.query.filter_by(email=email).first()
    if user:
        if user and check_password_hash(user.password, password):
            return jsonify({'message': 'Sign-in successful'}), 200
        else:
            return jsonify({'message': 'Invalid email or password'}), 401
    else:
        hashed_password = generate_password_hash(password, method='pbkdf2:sha256')
        new_user = User(username=email.split('@')[0], email=email, password=hashed_password)
        db.session.add(new_user)
        db.session.commit()
        return jsonify({'message': 'Sign-up successful'}), 201

@app.route("/trending-movies", methods=['GET'])
def get_trending_movies():
    url = "https://api.themoviedb.org/3/trending/movie/day?language=en-US"
    headers = {
        "accept": "application/json",
        "Authorization": f"Bearer {TMDB_READ_ACCESS_TOKEN}"
    }
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        data = response.json()
        return jsonify(data['results'][:9]), 200
    else:
        return jsonify({'message': 'Failed to fetch data from TMDB'}), response.status_code
    
@app.route("/now-playing", methods=['GET'])
def get_playing_movies():
    url = "https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1"
    headers = {
        "accept": "application/json",
        "Authorization": f"Bearer {TMDB_READ_ACCESS_TOKEN}"
    }
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        data = response.json()
        return jsonify(data['results'][:9]), 200
    else:
        return jsonify({'message': 'Failed to fetch data from TMDB'}), response.status_code
    
@app.route("/movie-genres", methods=['GET'])
def get_movie_genres():
    url = "https://api.themoviedb.org/3/genre/movie/list"
    headers = {
        "accept": "application/json",
        "Authorization": f"Bearer {TMDB_READ_ACCESS_TOKEN}"
    }
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        return jsonify(response.json()), 200
    else:
        return jsonify({'message': 'Failed to fetch genres from TMDB'}), response.status_code
    
@app.route("/discover-movies", methods=['GET'])
def discover_movies():
    params = {
        'language': request.args.get('language', 'en-US'),
        'sort_by': request.args.get('sort_by', 'popularity.desc'),
        'include_adult': request.args.get('include_adult', 'false'),
        'include_video': request.args.get('include_video', 'false'),
        'with_genres': request.args.get('with_genres'),
        'with_keywords': request.args.get('with_keywords'),
        'with_cast': request.args.get('with_cast'),
        'primary_release_year': request.args.get('primary_release_year'),
        'release_date.gte': request.args.get('release_date.gte'),
        'release_date.lte': request.args.get('release_date.lte'),
        'vote_average.gte': request.args.get('vote_average.gte'),
        'vote_average.lte': request.args.get('vote_average.lte'),
        'year': request.args.get('year'),
        'with_origin_country': request.args.get('with_origin_country'),
        'with_release_type': request.args.get('with_release_type')
    }
    
    url = "https://api.themoviedb.org/3/discover/movie"
    headers = {
        "accept": "application/json",
        "Authorization": f"Bearer {TMDB_READ_ACCESS_TOKEN}"
    }
    response = requests.get(url, params=params, headers=headers)
    if response.status_code == 200:
        return jsonify(response.json()), 200
    else:
        return jsonify({'message': 'Failed to fetch data from TMDB'}), response.status_code
    
@app.route("/search-movies", methods=['GET'])
def search_movies():
    query = request.args.get('query')
    include_adult = request.args.get('include_adult', 'false')
    language = request.args.get('language', 'en-US')
    year = request.args.get('year')
    
    params = {
        'query': query,
        'include_adult': include_adult,
        'language': language,
        'year': year,
    }

    url = "https://api.themoviedb.org/3/search/movie"

    headers = {
        "accept": "application/json",
        "Authorization": f"Bearer {TMDB_READ_ACCESS_TOKEN}"
    }
    response = requests.get(url, params=params, headers=headers)
    
    if response.status_code == 200:
        return jsonify(response.json()), 200
    else:
        return jsonify({'message': 'Failed to fetch data from TMDB'}), response.status_code

    
@app.route("/request-token", methods=['GET'])
def get_request_token():
    url = "https://api.themoviedb.org/3/authentication/token/new"
    params = {
        "api_key": TMDB_API_KEY
    }
    response = requests.get(url, params=params)
    if response.status_code == 200:
        data = response.json()
        return jsonify(data), 200
    else:
        return jsonify({'message': 'Failed to generate request token'}), response.status_code

@app.route("/authenticate/<request_token>", methods=['GET'])
def authenticate_user(request_token):
    url = f"https://www.themoviedb.org/authenticate/{request_token}?redirect_to=http://localhost:5173/authenticate/{request_token}"
    return redirect(url)

@app.route("/create-session", methods=['POST'])
def create_session():
    data = request.json
    request_token = data.get('request_token')
    url = "https://api.themoviedb.org/3/authentication/session/new"
    params = {
        "api_key": TMDB_API_KEY
    }
    response = requests.post(url, params=params, json={"request_token": request_token})
    if response.status_code == 200:
        data = response.json()
        return jsonify(data), 200
    else:
        return jsonify({'message': 'Failed to create session'}), response.status_code
    
@app.route("/account-id", methods=['GET'])
def get_account_id():
    session_id = request.args.get('session_id')
    url = "https://api.themoviedb.org/3/account"
    params = {
        "api_key": TMDB_API_KEY,
        "session_id": session_id
    }
    response = requests.get(url, params=params)
    if response.status_code == 200:
        data = response.json()
        return jsonify(data), 200
    else:
        return jsonify({'message': 'Failed to fetch account details'}), response.status_code


@app.route("/delete-session", methods=['DELETE'])
def delete_session():
    data = request.json
    session_id = data.get('session_id')
    url = "https://api.themoviedb.org/3/authentication/session"
    params = {
        "api_key": TMDB_API_KEY
    }
    response = requests.delete(url, params=params, json={"session_id": session_id})
    if response.status_code == 200:
        return jsonify({'message': 'Session deleted successfully'}), 200
    else:
        return jsonify({'message': 'Failed to delete session'}), response.status_code
    
@app.route("/add-to-watchlist", methods=['POST'])
def add_to_watchlist():
    data = request.json
    movie_id = data.get('movieId')
    account_id = data.get('accountId')
    session_id = data.get('sessionId')
    add = data.get('add')
    
    url = f"https://api.themoviedb.org/3/account/{account_id}/watchlist"
    headers = {
        "accept": "application/json",
        "Authorization": f"Bearer {TMDB_READ_ACCESS_TOKEN}",
        "Content-Type": "application/json;charset=utf-8"
    }
    body = {
        "media_type": "movie",
        "media_id": movie_id,
        "watchlist": add
    }
    response = requests.post(url, params={"session_id": session_id}, json=body, headers=headers)
    if response.status_code == 200:
        return jsonify({'message': 'Added to watchlist'}), 200
    else:
        return jsonify({'message': 'Failed to add to watchlist'}), response.status_code

@app.route("/add-to-favorites", methods=['POST'])
def add_to_favorites():
    data = request.json
    movie_id = data.get('movieId')
    account_id = data.get('accountId')
    session_id = data.get('sessionId')
    add = data.get('add')
    
    url = f"https://api.themoviedb.org/3/account/{account_id}/favorite"
    headers = {
        "accept": "application/json",
        "Authorization": f"Bearer {TMDB_READ_ACCESS_TOKEN}",
        "Content-Type": "application/json;charset=utf-8"
    }
    body = {
        "media_type": "movie",
        "media_id": movie_id,
        "favorite": add
    }
    response = requests.post(url, params={"session_id": session_id}, json=body, headers=headers)
    if response.status_code == 200:
        return jsonify({'message': 'Added to favorites'}), 200
    else:
        return jsonify({'message': 'Failed to add to favorites'}), response.status_code

@app.route("/rate", methods=['POST'])
def rate_movie():
    data = request.json
    movie_id = data.get('movieId')
    rating = data.get('rating')
    session_id = data.get('sessionId')
    
    url = f"https://api.themoviedb.org/3/movie/{movie_id}/rating"
    headers = {
        "accept": "application/json",
        "Authorization": f"Bearer {TMDB_READ_ACCESS_TOKEN}",
        "Content-Type": "application/json;charset=utf-8"
    }
    body = {
        "value": rating
    }
    response = requests.post(url, params={"session_id": session_id}, json=body, headers=headers)
    if response.status_code == 200:
        return jsonify({'message': 'Rating added'}), 200
    else:
        return jsonify({'message': 'Failed to add rating'}), response.status_code

@app.route("/delete-rating", methods=['DELETE'])
def delete_rating():
    data = request.json
    movie_id = data.get('movieId')
    session_id = data.get('sessionId')
    
    url = f"https://api.themoviedb.org/3/movie/{movie_id}/rating"
    headers = {
        "accept": "application/json",
        "Authorization": f"Bearer {TMDB_READ_ACCESS_TOKEN}",
        "Content-Type": "application/json;charset=utf-8"
    }
    response = requests.delete(url, params={"session_id": session_id}, headers=headers)
    if response.status_code == 200:
        return jsonify({'message': 'Rating deleted'}), 200
    else:
        return jsonify({'message': 'Failed to delete rating'}), response.status_code
    
@app.route("/favorite-movies", methods=['GET'])
def get_favorite_movies():
    account_id = request.args.get('account_id')
    session_id = request.args.get('session_id')
    language = request.args.get('language', 'en-US')
    page = request.args.get('page', 1)
    sort_by = request.args.get('sort_by', 'created_at.asc')
    
    url = f"https://api.themoviedb.org/3/account/{account_id}/favorite/movies"
    params = {
        "api_key": TMDB_API_KEY,
        "session_id": session_id,
        "language": language,
        "page": page,
        "sort_by": sort_by
    }
    headers = {
        "accept": "application/json",
        "Authorization": f"Bearer {TMDB_READ_ACCESS_TOKEN}"
    }
    response = requests.get(url, params=params, headers=headers)
    if response.status_code == 200:
        return jsonify(response.json()), 200
    else:
        return jsonify({'message': 'Failed to fetch favorite movies'}), response.status_code
    
@app.route("/watchlist-movies", methods=['GET'])
def get_watchlist_movies():
    account_id = request.args.get('account_id')
    session_id = request.args.get('session_id')
    language = request.args.get('language', 'en-US')
    page = request.args.get('page', 1)
    sort_by = request.args.get('sort_by', 'created_at.asc')
    
    url = f"https://api.themoviedb.org/3/account/{account_id}/watchlist/movies"
    params = {
        "api_key": TMDB_API_KEY,
        "session_id": session_id,
        "language": language,
        "page": page,
        "sort_by": sort_by
    }
    headers = {
        "accept": "application/json",
        "Authorization": f"Bearer {TMDB_READ_ACCESS_TOKEN}"
    }
    response = requests.get(url, params=params, headers=headers)
    if response.status_code == 200:
        return jsonify(response.json()), 200
    else:
        return jsonify({'message': 'Failed to fetch watchlist movies'}), response.status_code


@app.route("/rated-movies", methods=['GET'])
def get_rated_movies():
    account_id = request.args.get('account_id')
    session_id = request.args.get('session_id')
    language = request.args.get('language', 'en-US')
    page = request.args.get('page', 1)
    sort_by = request.args.get('sort_by', 'created_at.asc')
    
    url = f"https://api.themoviedb.org/3/account/{account_id}/rated/movies"
    params = {
        "api_key": TMDB_API_KEY,
        "session_id": session_id,
        "language": language,
        "page": page,
        "sort_by": sort_by
    }
    headers = {
        "accept": "application/json",
        "Authorization": f"Bearer {TMDB_READ_ACCESS_TOKEN}"
    }
    response = requests.get(url, params=params, headers=headers)
    if response.status_code == 200:
        return jsonify(response.json()), 200
    else:
        return jsonify({'message': 'Failed to fetch rated movies'}), response.status_code

@app.route('/chatgpt-recommendation', methods=['POST'])
def get_movie_recommendations():
    data = request.json
    movie_names_ratings = data.get('movies')

    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful assistant that recommends movie."},
                {"role": "user", "content": f"Based on the following movies and their ratings: {movie_names_ratings}, recommend 5 movies and explain why they are similar. Only list the movie titles."}
            ],
            max_tokens=150
        )
        
        recommendations = response['choices'][0]['message']['content'].strip().split('\n')
        recommendations = [movie.split('. ')[-1] for movie in recommendations if movie]
        
        return jsonify(recommendations)
    
    except Exception as e:
        print(f"An error occurred: {e}")
        return jsonify([]), 500

if __name__ == '__main__':
    app.run(debug=True)
