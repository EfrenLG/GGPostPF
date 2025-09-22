import { useEffect } from 'react';

const AdBanner = ({ adClient, adSlot }) => {
    useEffect(() => {
        try {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (e) {
            // Ignorar: se lanza si el script aún no se ha cargado por completo
            console.warn("adsbygoogle push failed:", e);
        }
    }, []);

    return (
        <ins className="adsbygoogle"
            style={style || { display: "block" }}
            data-ad-client={adClient}
            data-ad-slot={adSlot}
            data-ad-format="auto"
            data-full-width-responsive="true">

        </ins>
    );
};

export default AdBanner;
