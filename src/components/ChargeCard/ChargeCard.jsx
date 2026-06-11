// React
import React, { useEffect, useState } from 'react';

// Estilos
import './ChargeCard.css';

const ChargeCard = ({ text }) => {

    const [loading, setLoading] = useState(true); // FIX: typo "loanding" → "loading"

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="card-overlay">
            <div className='card'>
                {loading ? (           // FIX: typo corregido aquí también
                    <p>...Cargando</p>
                ) : (
                    <p className='success'>{text}</p>   // FIX: typo "succes" → "success"
                )}
            </div>
        </div>
    );
};

export default ChargeCard;
