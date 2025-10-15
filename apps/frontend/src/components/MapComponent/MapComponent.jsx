import "./MapComponent.css";
import { useLocation } from "react-router-dom";

export default function MapComponent() {
  const location = useLocation();
  const path = location.pathname;
  return (
    <div className={`${path === "/map" ? "map" : "map-component"}`}>
      {path === "/map" ? (
        <iframe
          src="https://www.google.com/maps/d/embed?mid=1CQa6O7yCsjB6X-ro6woJ3CsPLLJ_b6Q&ehbc=2E312F"
          style={{ width: "100%", height: "100%", border: "none" }}
          allowFullScreen
          aria-hidden="false"
          tabIndex="0"
        />
      ) : (
        <iframe
          src="https://www.google.com/maps/d/embed?mid=1CQa6O7yCsjB6X-ro6woJ3CsPLLJ_b6Q&ehbc=2E312F"
          width="600"
          height="450"
          frameborder="0"
          style={{ border: 0 }}
          allowfullscreen=""
          aria-hidden="false"
          tabindex="0"
        ></iframe>
      )}
    </div>
  );
}
