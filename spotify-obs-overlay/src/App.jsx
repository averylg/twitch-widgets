

import { useState, useEffect, useRef } from "react"
import axios from "axios"
import "./index.css"
import MarqueeText from "./components/MarqueeText"

const wrapper = {
  position: "fixed",
  padding: "0.5rem 9rem 0rem 0.875rem",
  bottom: "0px",
  right: "0px",
  fontFamily: "Oxanium",
  color: "white",
  backgroundColor: "#3ca6e8",
  margin: 0,
  clipPath: "polygon(25% 0%, 100% 0%, 100% 100%, 0% 100%)",
  width: "25%",
  minWidth: "25%",
  maxWidth: "25%",
}

const inner = {
  textAlign: "right",
  clipPath: "polygon(23.9375% 0%, 100% 0%, 100% 100%, 0% 100%)",
  backgroundColor: "#3d3d3d",
  padding: "1rem 1rem 1rem 8rem",
  bottom: "0px",
  right: "0px",
  width: "100%",
  overflow: "hidden",
  whiteSpace: "nowrap",
  display: "flex",
  flexDirection: "column"
}


function App() {

  const [data, setData] = useState({
    title: "",
    artists: ""
  })

  const [animationDuration, setAnimationDuration] = useState(10);

  const scrollRefTitle = useRef(null);
  const scrollRefArtists = useRef(null);

  useEffect(() => {
    // https://rapidapi.com/guides/api-requests-intervals
    let interval = setInterval(async () => {
      try {
        const response = await axios.get("http://localhost:443/currently-playing");
        setData(response.data)
      } catch (error) {
        console.error("UHHHHHH...", error)
      }
      console.log(data)
    }, 5000);

    return () => {
      clearInterval(interval)
    }

  }, [])

  useEffect(() => {
    if (scrollRefTitle.current) {
      const textWidth = scrollRefTitle.current.offsetWidth;
      const containerWidth = scrollRefTitle.current.parentElement.offsetWidth;
      const newDuration = Math.max(10, (textWidth / containerWidth) * 5);
      console.log("TITLE DURATION:", newDuration);
      setAnimationDuration(newDuration);
    }
  }, [data.title]);

  useEffect(() => {
    if (scrollRefArtists.current) {
      const textWidth = scrollRefArtists.current.offsetWidth;
      const containerWidth = scrollRefArtists.current.parentElement.offsetWidth;
      const newDuration = Math.max(10, (textWidth / containerWidth) * 5);
      setAnimationDuration(newDuration);
    }
  }, [data.artists]);


  return (
    <div style={wrapper}>
      <div style={inner}>
        <MarqueeText speed={150}>
        <span style={{ display: 'inline-block', paddingRight: "13rem" }}>
          <h1 style={{ paddingLeft: "3rem"}}>Song Title: {data.name}</h1>
          </span>
        </MarqueeText>
        <MarqueeText speed={150}>
        <span style={{ display: 'inline-block', paddingRight: "13rem" }}>
          <h1 style={{ paddingLeft: "3rem"}}>Artists: {data.artists}</h1>
        </span>
        </MarqueeText>
      </div>
    </div>
  )
}

export default App
