import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import userService from '../../services/api';
import './FollowRequestsModal.css';

const getInitials = (name) => name ? name.slice(0, 2).toUpperCase() : '?';

const FollowRequestsModal = ({ onClose, onCountChange }) => {
    const navigate = useNavigate();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading]   = useState(true);
    const [processingId, setProcessingId] = useState(null);

    useEffect(() => {
        const load = async () => {
            try {
                const res = await userService.getFollowRequests();
                setRequests(res.data);
            } catch (e) {
                console.error('Error cargando solicitudes', e);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const handleAccept = async (requesterId) => {
        setProcessingId(requesterId);
        try {
            await userService.acceptFollowRequest(requesterId);
            setRequests(prev => {
                const updated = prev.filter(r => String(r.id) !== String(requesterId));
                onCountChange?.(updated.length);
                return updated;
            });
        } catch (e) {
            console.error('Error al aceptar solicitud', e);
        } finally {
            setProcessingId(null);
        }
    };

    const handleReject = async (requesterId) => {
        setProcessingId(requesterId);
        try {
            await userService.rejectFollowRequest(requesterId);
            setRequests(prev => {
                const updated = prev.filter(r => String(r.id) !== String(requesterId));
                onCountChange?.(updated.length);
                return updated;
            });
        } catch (e) {
            console.error('Error al rechazar solicitud', e);
        } finally {
            setProcessingId(null);
        }
    };

    const goToProfile = (u) => {
        onClose();
        navigate(`/perfil/${u.id}`);
    };

    return (
        <div className="requests-modal-overlay" onClick={onClose}>
            <div className="requests-modal" onClick={e => e.stopPropagation()}>
                <div className="requests-modal-header">
                    <span>Solicitudes de seguimiento</span>
                    <button className="requests-modal-close" onClick={onClose}>✕</button>
                </div>

                <div className="requests-modal-body">
                    {loading ? (
                        <div className="requests-modal-loading">Cargando...</div>
                    ) : requests.length === 0 ? (
                        <div className="requests-modal-empty">
                            <i className="fa-regular fa-bell" style={{ fontSize: 32, marginBottom: 10, display: 'block' }}></i>
                            No tienes solicitudes pendientes
                        </div>
                    ) : (
                        requests.map(u => (
                            <div key={u.id} className="requests-modal-item">
                                <div className="requests-modal-user" onClick={() => goToProfile(u)}>
                                    <div className="requests-modal-avatar">
                                        {u.icon && u.icon !== 'default.png'
                                            ? <img src={u.icon} alt={u.username} />
                                            : getInitials(u.username)}
                                    </div>
                                    <span className="requests-modal-username">{u.username}</span>
                                </div>
                                <div className="requests-modal-actions">
                                    <button
                                        className="req-btn req-accept"
                                        disabled={processingId === u.id}
                                        onClick={() => handleAccept(u.id)}
                                    >
                                        Aceptar
                                    </button>
                                    <button
                                        className="req-btn req-reject"
                                        disabled={processingId === u.id}
                                        onClick={() => handleReject(u.id)}
                                    >
                                        Rechazar
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default FollowRequestsModal;