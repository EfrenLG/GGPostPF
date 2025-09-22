// ejemplo con react-router
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function AdRefreshOnRouteChange() {
  const location = useLocation();

  useEffect(() => {
    if (window.adsbygoogle && window.adsbygoogle.loaded) {
      try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch(e) {}
    } else {
      // intenta igualmente (no rompe si no está listo)
      try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch(e) {}
    }
  }, [location.pathname]);

  return null;
}

export default AdRefreshOnRouteChange;
