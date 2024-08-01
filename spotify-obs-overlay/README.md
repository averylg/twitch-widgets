# Twitch Overlay Frontend

Technologies used: Vite, React, CSS, JavaScript, Axios for API calls to backend.

To use this overlay:

1. Make sure to have the Python backend running first
2. Run `pnpm i` to install the dependencies necessary
3. Run `pnpm run dev` in this directory to start the app
4. Open OBS and make sure you've created a scene
5. Under Sources, add a new Browser Source
6. For the URL, type `http://localhost:5173/`, remove the default CSS in the box below, and click OK