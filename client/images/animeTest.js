import React, { useEffect } from "react";
import anime from "animejs";

function AnimationComponent() {
  useEffect(() => {
    anime({
      targets: ".animeElement",
      translateX: 250,
    });
  }, []);

  return <div className="animeElement">Hello Anime.js</div>;
}

export default AnimationComponent;
