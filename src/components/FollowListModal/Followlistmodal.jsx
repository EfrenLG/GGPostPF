import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import userService from '../../services/api';
import './FollowListModal.css';

const getInitials = (name) => name ? name.slice(0, 2).toUpperCase() : '?';

// type: 'followers' | 'following'
const FollowListModal = ({ userId, type, onClose }) => {
    const navigate = useNavigate();
    const myUserId = localStorage.getItem('userId');

    const [list, setList]       = useState([]);
    const [loading, setLoading] = useState(true);
    const [followingIds, setFollowingIds] = useState([]);

    const title = type === 'followers' ? 'Seguidores' : 'Siguiendo';

    useEffect(() => {
        const load = async () => {
            try {
                const res = await userService.getFollowList(userId, type);
                setList(res.data);

                // Cargar mi propia lista de following para saber qué botones mostrar como "Siguiendo"
                const myProfile = await userService.getPublicProfile(myUserId);
                setFollowingIds((myProfile.data.usuario.following || []).map(String));
            } catch (e) {
                console.error('Error cargando lista', e);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [userId, type, myUserId]);

    const handleFollow = async (targetId) => {
        try {
            const res = await userService.followUser(targetId);
            const action = res.data.action;
            setFollowingIds(prev =>
                action === 'follow'
                    ? [...prev, targetId]
                    : prev.filter(id => id !== targetId)
            );
        } catch {}
    };

    const goToProfile = (u) => {
        onClose();
        if (String(u.id) === String(myUserId)) {
            navigate('/user');
        } else {
            navigate(`/perfil/${u.id}`);
        }
    };

    return (
        <div className="follow-modal-overlay" onClick={onClose}>
            <div className="follow-modal" onClick={e => e.stopPropagation()}>
                <div className="follow-modal-header">
                    <span>{title}</span>
                    <button className="follow-modal-close" onClick={onClose}>✕</button>
                </div>

                <div className="follow-modal-body">
                    {loading ? (
                        <div className="follow-modal-loading">Cargando...</div>
                    ) : list.length === 0 ? (
                        <div className="follow-modal-empty">
                            {type === 'followers' ? 'Sin seguidores aún' : 'No sigue a nadie todavía'}
                        </div>
                    ) : (
                        list.map(u => {
                            const isMe = String(u.id) === String(myUserId);
                            const isF  = followingIds.includes(String(u.id));
                            return (
                                <div key={u.id} className="follow-modal-item">
                                    <div className="follow-modal-user" onClick={() => goToProfile(u)}>
                                        <div className="follow-modal-avatar">
                                            {u.icon && u.icon !== 'default.png'
                                                ? <img src={u.icon} alt={u.username} />
                                                : getInitials(u.username)}
                                        </div>
                                        <span className="follow-modal-username">{u.username}</span>
                                    </div>
                                    {!isMe && (
                                        <button
                                            className={`follow-modal-btn ${isF ? 'following' : ''}`}
                                            onClick={() => handleFollow(String(u.id))}
                                        >
                                            {isF ? 'Siguiendo' : 'Seguir'}
                                        </button>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
};

export default FollowListModal;