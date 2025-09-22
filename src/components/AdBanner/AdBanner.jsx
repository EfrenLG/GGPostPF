import { useEffect } from 'react';

const AdBanner = ({ adClient, adSlot, style }) => {
    useEffect(() => {
        const ins = document.querySelector(`ins[data-ad-slot="${adSlot}"]`);

        if (ins && !ins.dataset.adsLoaded) {
            try {
                (window.adsbygoogle = window.adsbygoogle || []).push({});
                ins.dataset.adsLoaded = "true"; // marcar como cargado
            } catch (e) {
                console.warn("adsbygoogle push failed:", e);
            }
        }
    }, [adSlot]);

    return (
        <ins
            className="adsbygoogle"
            style={style || { display: "block" }}
            data-ad-client={adClient}
            data-ad-slot={adSlot}
            data-ad-format="auto"
            data-full-width-responsive="true"
        ></ins>
    );
};

export default AdBanner;
