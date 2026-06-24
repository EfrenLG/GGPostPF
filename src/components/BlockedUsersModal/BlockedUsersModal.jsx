import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import userService from '../../services/api';
import './BlockedUsersModal.css';

const getInitials = (name) => name ? name.slice(0, 2).toUpperCase() : '?';

const BlockedUsersModal = ({ onClose }) => {
    const navigate = useNavigate();
    const [list, setList]       = useState([]);
    const [loading, setLoading] = useState(true);
    const [unblockingId, setUnblockingId] = useState(null);

    useEffect(() => {
        userService.getBlockedUsers()
            .then(res => setList(res.data))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    const handleUnblock = async (targetId) => {
        if (unblockingId) return;
        setUnblockingId(targetId);
        try {
            await userService.unblockUser(targetId);
            setList(prev => prev.filter(u => String(u.id) !== String(targetId)));
        } catch (e) {
            console.error('Error al desbloquear', e);
        } finally {
            setUnblockingId(null);
        }
    };

    const goToProfile = (u) => {
        onClose();
        navigate(`/perfil/${u.id}`);
    };

    return (
        <div className="blocked-modal-overlay" onClick={onClose}>
            <div className="blocked-modal" onClick={e => e.stopPropagation()}>
                <div className="blocked-modal-header">
                    <span>Cuentas bloqueadas</span>
                    <button className="blocked-modal-close" onClick={onClose}>✕</button>
                </div>

                <div className="blocked-modal-body">
                    {loading ? (
                        <div className="blocked-modal-loading">Cargando...</div>
                    ) : list.length === 0 ? (
                        <div className="blocked-modal-empty">No has bloqueado a nadie</div>
                    ) : (
                        list.map(u => (
                            <div key={u.id} className="blocked-modal-item">
                                <div className="blocked-modal-user" onClick={() => goToProfile(u)}>
                                    <div className="blocked-modal-avatar">
                                        {u.icon && u.icon !== 'default.png'
                                            ? <img src={u.icon} alt={u.username} />
                                            : getInitials(u.username)}
                                    </div>
                                    <span className="blocked-modal-username">{u.username}</span>
                                </div>
                                <button
                                    className="blocked-modal-unblock-btn"
                                    onClick={() => handleUnblock(String(u.id))}
                                    disabled={unblockingId === String(u.id)}
                                >
                                    Desbloquear
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default BlockedUsersModal;