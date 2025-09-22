import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function AdRefreshOnRouteChange() {
  const location = useLocation();

  useEffect(() => {
    const insElements = document.querySelectorAll("ins.adsbygoogle");
    insElements.forEach((el) => {
      if (!el.dataset.adsLoaded) {
        try {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          el.dataset.adsLoaded = "true";
        } catch (e) {}
      }
    });
  }, [location.pathname]);

  return null;
}

export default AdRefreshOnRouteChange;
