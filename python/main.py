from fastapi import FastAPI, BackgroundTasks
from fastapi.responses import RedirectResponse, HTMLResponse
from fastapi.middleware.cors import CORSMiddleware
import requests
from dotenv import load_dotenv
import uvicorn
import os
from pprint import pprint
import random
import string

load_dotenv("./.env")

# General logic inspo: https://github.com/rogojagad/twitter-spotify-bot/tree/master

client_id = os.environ.get("SPOTIFY_CLIENT_ID")
client_secret = os.environ.get("SPOTIFY_CLIENT_SECRET")
auth_url = os.environ.get("SPOTIFY_AUTH_URL")
api_url = os.environ.get("SPOTIFY_API_URL")


redirect_uri = "http://localhost:8888/callback" # e.g. http://localhost:8000/callback/ --> you will have to whitelist this url in the spotify developer dashboard 

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # You can specify a list of allowed origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allows all headers
)


@app.get("/")
async def auth():
    print("Visited callback:", os.environ.get("VISITED_CALLBACK"))
    scope = ["user-read-currently-playing"]
    url = f"{auth_url}?response_type=code&client_id={client_id}&redirect_uri={redirect_uri}&scope={' '.join(scope)}&state={''.join(random.choices(string.ascii_uppercase + string.ascii_lowercase + string.digits, k=16))}"
    # return HTMLResponse(content=f'<a href="{auth_url}">Authorize</a>')
    return RedirectResponse(url=url)


@app.get("/callback")
async def callback(code):

    response = requests.post(
        "https://accounts.spotify.com/api/token",
        data={
            "grant_type": "authorization_code",
            "code": code,
            "redirect_uri": redirect_uri,
            "client_id": client_id,
            "client_secret": client_secret
        },
        # auth=(client_id, client_secret),
        headers={
            "Content-Type": "application/x-www-form-urlencoded"
        }
    )
    access_token = response.json()["access_token"]
    refresh_token = response.json()["refresh_token"]
    os.environ.setdefault("SPOTIFY_ACCESS_TOKEN", access_token)
    os.environ.setdefault("SPOTIFY_REFRESH_TOKEN", refresh_token)

    with open("./refresh.txt", "w") as refresh:
        refresh.write(refresh_token)

    return RedirectResponse(url=f"/currently-playing")


@app.get("/currently-playing")
async def currently_playing():
    # print("Visited Callback:", os.environ.get("VISITED_CALLBACK"))
    if "SPOTIFY_REFRESH_TOKEN" in os.environ:
        response = requests.post(
            "https://accounts.spotify.com/api/token",
            data={
                "grant_type": "refresh_token",
                'refresh_token': os.environ.get("SPOTIFY_REFRESH_TOKEN"),
                'client_id': client_id,
                'client_secret': client_secret
            }
        )
        access_token = response.json()["access_token"]

        os.environ.setdefault("SPOTIFY_ACCESS_TOKEN", access_token)

    if "SPOTIFY_ACCESS_TOKEN" not in os.environ:
        return RedirectResponse(url=f"/")
    
    token = os.environ.get("SPOTIFY_ACCESS_TOKEN")
    headers = {"Authorization": "Bearer " + token}
    url = "https://api.spotify.com/v1/me/player/currently-playing"
    response = requests.get(url=url, headers=headers, params={ "market": "ES" })
    return {
        "name": response.json()["item"]["name"],
        "artists": ", ".join([artist["name"] for artist in response.json()["item"]["artists"]])
    }



if __name__ == "__main__":
    uvicorn.run(app, host="localhost", port=443)