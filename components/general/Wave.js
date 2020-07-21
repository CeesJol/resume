import React from "react"

const Wave = ({ reversed = false }) => (
  <svg viewBox="0 0 500 100" preserveAspectRatio="none">
    <path d=
			{reversed ? (
				"M0,70 C150,10 350,100 500,50 L500,0 L0,0 Z"
			) : (
				"M0,30 C150,90 350,0 500,50 L500,100 L0,100 Z"
			)}
      
      style={{ stroke: "none", fill: "white" }}
    ></path>
  </svg>
)

export default Wave
