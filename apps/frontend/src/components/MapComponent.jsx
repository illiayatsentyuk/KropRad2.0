import { useLocation } from "react-router-dom";

export default function MapComponent() {
  const location = useLocation();
  const path = location.pathname;
  return (
    <div className={`${path === "/map" ? "w-full h-full flex-1 relative" : "flex items-center justify-center w-full"}`}>
      {path === "/map" ? (
        <iframe
          src="https://www.google.com/maps/d/embed?mid=1CQa6O7yCsjB6X-ro6woJ3CsPLLJ_b6Q&ehbc=2E312F"
          className="w-full h-full border-0"
          allowFullScreen
          aria-hidden="false"
          tabIndex={0}
        />
      ) : (
        <iframe
          src="https://www.google.com/maps/d/embed?mid=1CQa6O7yCsjB6X-ro6woJ3CsPLLJ_b6Q&ehbc=2E312F"
          className="w-full max-w-[680px] h-[300px] sm:h-[380px] md:h-[420px] lg:h-[450px] border-0"
          frameBorder="0"
          allowFullScreen
          aria-hidden="false"
          tabIndex={0}
        ></iframe>
      )}
    </div>
  );
}
