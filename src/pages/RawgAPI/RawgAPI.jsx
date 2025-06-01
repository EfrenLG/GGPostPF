import { useEffect, useState } from 'react';
import MenuToggle from '../../components/MenuToggle/MenuToggle';
import './RawgAPI.css';

const platformMap = {
    7: 'Nintendo Switch',
    8: 'Nintendo 3DS',
    9: 'Nintendo DS',
    13: 'Nintendo DSi',
    10: 'Wii U',
    11: 'Wii',
    105: 'Nintendo GameCube',
    24: 'Game Boy Advance',
    43: 'Game Boy Color',
    26: 'Game Boy',
    79: 'Super Nintendo Entertainment System (SNES)',
    49: 'Nintendo Entertainment System (NES)',
    83: 'Nintendo 64',
    187: 'PlayStation 5',
    18: 'PlayStation 4',
    16: 'PlayStation 3',
    15: 'PlayStation 2',
    27: 'PlayStation',
    19: 'PlayStation Vita',
    17: 'PSP',
    186: 'Xbox Series S/X',
    1: 'Xbox One',
    14: 'Xbox 360',
    80: 'Xbox',
    4: 'PC',
};

const reversePlatformMap = Object.fromEntries(
    Object.entries(platformMap).map(([id, name]) => [name, id])
);

const RawgAPI = () => {
    const [games, setGames] = useState([]);
    const [selectedPlatform, setSelectedPlatform] = useState('all');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const apiKey = '209ae7c8c9374be192ecd7bec599b2e6';

    const fetchGames = async (platformId = null) => {
        try {
            setLoading(true);
            const url = `https://api.rawg.io/api/games?key=${apiKey}&ordering=-added,-rating&page_size=12` +
                (platformId ? `&platforms=${platformId}` : '');
            const res = await fetch(url);
            if (!res.ok) throw new Error("Error en la red");
            const data = await res.json();
            setGames(data.results);
        } catch (err) {
            console.error(err);
            setError("Error al cargar los juegos. Intenta más tarde.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (selectedPlatform === 'all') {
            fetchGames();
        } else {
            fetchGames(reversePlatformMap[selectedPlatform]);
        }
    }, [selectedPlatform]);

    const handlePlatformChange = (e) => {
        setSelectedPlatform(e.target.value);
    };

    return (
        <>
            <MenuToggle />
            <div className="post-content">
                <h2 className="section-title">🎮 Mejores juegos valorados</h2>

                <div className="platform-filter" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <label htmlFor="platformSelect">Filtrar por plataforma:</label>
                    <select id="platformSelect" value={selectedPlatform} onChange={handlePlatformChange}>
                        <option value="all">Todas</option>
                        {Object.values(platformMap).map(platform => (
                            <option key={platform} value={platform}>{platform}</option>
                        ))}
                    </select>
                </div>

                {loading && <p>Cargando juegos...</p>}
                {error && <p>{error}</p>}

                <div className="games-grid">
                    {games.map(game => {
                        const platforms = game.platforms?.map(p => platformMap[p.platform.id]).filter(Boolean).join(', ') || 'Varias plataformas';
                        return (
                            <div key={game.id} className="game-card">
                                <div class="game-image-container">
                                    <img
                                        src={game.background_image || '../images/default-cover.jpg'}
                                        alt={game.name}
                                        className="game-image"
                                    />
                                </div>
                                <div className="game-details">
                                    <h3>{game.name}</h3>
                                    <p><strong>Rating:</strong> {game.rating} / 5</p>
                                    <p><strong>Plataformas:</strong> {platforms}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    );
};

export default RawgAPI;
