import React, { useEffect, useState } from 'react';

const ChargeCard = ({ text }) => {

    const [loanding, setLoanding] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {

            setLoanding(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);


    return (
        <div className='card'>
            {loanding ? (
                <p>...Cargando</p>
            ) : (
                <p className='succes'>✅ {text}</p>
            )}
        </div>
    );
};

export default ChargeCard;