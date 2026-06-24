import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import userService from '../../services/api';
import FollowListModal from '../../components/FollowListModal/FollowListModal';
import './Profile.css';

const getInitials = (name) => name ? name.slice(0, 2).toUpperCase() : '?';

const Profile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const myUserId = localStorage.getItem('userId');

    const [profile, setProfile]         = useState(null);
    const [posts, setPosts]             = useState([]);
    const [stats, setStats]             = useState({ posts: 0, followers: 0, following: 0 });
    const [isFollowing, setIsFollowing] = useState(false);
    const [hasRequested, setHasRequested] = useState(false);
    const [canViewPosts, setCanViewPosts] = useState(true);
    const [loading, setLoading]         = useState(true);
    const [modalType, setModalType]     = useState(null);
    const [isBlocked, setIsBlocked]     = useState(false);     // NUEVO: bloqueo en cualquier sentido
    const [blockedByMe, setBlockedByMe] = useState(false);     // NUEVO: si fui yo quien bloqueó
    const [showOptionsMenu, setShowOptionsMenu] = useState(false); // NUEVO
    const [blockingInProgress, setBlockingInProgress] = useState(false); // NUEVO

    const isMyProfile = id === myUserId;

    const loadProfile = async () => {
        try {
            const res = await userService.checkToken();
            if (res.data.message !== 'Token válido') { navigate('/'); return; }

            const profileRes = await userService.getPublicProfile(id);
            const {
                usuario,
                posts: userPosts,
                stats: userStats,
                canViewPosts: viewable,
                hasPendingRequest,
                isBlocked: blocked,
                blockedByMe: byMe,
            } = profileRes.data;

            setProfile(usuario);
            setPosts(userPosts);
            setStats(userStats);
            setIsFollowing(usuario.followers?.includes(myUserId));
            setCanViewPosts(viewable);
            setHasRequested(!!hasPendingRequest);
            setIsBlocked(!!blocked);
            setBlockedByMe(!!byMe);
        } catch (e) {
            console.error('Error cargando perfil', e);
            navigate('/posts');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProfile();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, navigate, myUserId]);

    // NUEVO: cerrar el menú de opciones al hacer click fuera
    useEffect(() => {
        if (!showOptionsMenu) return;
        const handleClickOutside = () => setShowOptionsMenu(false);
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [showOptionsMenu]);

    const handleFollow = async () => {
        try {
            const res = await userService.followUser(id);
            const action = res.data.action;

            if (action === 'follow') {
                setIsFollowing(true);
                setHasRequested(false);
                setStats(prev => ({ ...prev, followers: prev.followers + 1 }));
            } else if (action === 'unfollow') {
                setIsFollowing(false);
                setCanViewPosts(profile?.isPrivate ? false : true);
                setStats(prev => ({ ...prev, followers: prev.followers - 1 }));
            } else if (action === 'requested') {
                setHasRequested(true);
            } else if (action === 'cancelled') {
                setHasRequested(false);
            }
        } catch (e) {
            console.error('Error al seguir', e);
        }
    };

    // NUEVO: bloquear al usuario del perfil
    const handleBlock = async () => {
        if (blockingInProgress) return;
        if (!window.confirm(`¿Bloquear a ${profile.username}? Dejará de poder seguirte o ver tu perfil.`)) return;
        setShowOptionsMenu(false);
        setBlockingInProgress(true);
        try {
            await userService.blockUser(id);
            setIsBlocked(true);
            setBlockedByMe(true);
            setIsFollowing(false);
            setCanViewPosts(false);
        } catch (e) {
            console.error('Error al bloquear', e);
        } finally {
            setBlockingInProgress(false);
        }
    };

    // NUEVO: desbloquear al usuario del perfil
    const handleUnblock = async () => {
        if (blockingInProgress) return;
        setShowOptionsMenu(false);
        setBlockingInProgress(true);
        try {
            await userService.unblockUser(id);
            await loadProfile(); // recargar perfil con datos actualizados
        } catch (e) {
            console.error('Error al desbloquear', e);
        } finally {
            setBlockingInProgress(false);
        }
    };

    if (loading) return <div className="profile-loading">Cargando perfil...</div>;
    if (!profile) return null;

    const iconSrc = profile.icon && profile.icon !== 'default.png' ? profile.icon : null;

    let followLabel = 'Seguir';
    let followClass = '';
    if (isFollowing) { followLabel = 'Siguiendo'; followClass = 'following'; }
    else if (hasRequested) { followLabel = 'Solicitado'; followClass = 'requested'; }

    return (
        <div className="profile-page">

            <div className="profile-header">
                <button className="profile-back-btn" onClick={() => navigate(-1)}>← Volver</button>

                <div className="profile-info">
                    <div className="profile-avatar-ring">
                        {iconSrc
                            ? <img src={iconSrc} alt={profile.username} className="profile-avatar-img" />
                            : <div className="profile-avatar-initials">{getInitials(profile.username)}</div>
                        }
                    </div>

                    <div className="profile-meta">
                        <div className="profile-username-row">
                            <h2 className="profile-username">
                                {profile.username}
                                {profile.isPrivate && (
                                    <i className="fa-solid fa-lock profile-lock-icon" title="Cuenta privada"></i>
                                )}
                            </h2>

                            {/* NUEVO: si yo bloqueé a este usuario, solo mostramos "Desbloquear" */}
                            {!isMyProfile && blockedByMe && (
                                <button className="profile-follow-btn" onClick={handleUnblock} disabled={blockingInProgress}>
                                    Desbloquear
                                </button>
                            )}

                            {/* Si no hay bloqueo, comportamiento normal de seguir */}
                            {!isMyProfile && !isBlocked && (
                                <button
                                    className={`profile-follow-btn ${followClass}`}
                                    onClick={handleFollow}
                                >
                                    {followLabel}
                                </button>
                            )}

                            {isMyProfile && (
                                <button className="profile-edit-btn" onClick={() => navigate('/user')}>
                                    Editar perfil
                                </button>
                            )}

                            {/* NUEVO: menú de opciones (⋯) con Bloquear, solo en perfiles ajenos sin bloqueo previo por mí */}
                            {!isMyProfile && !blockedByMe && (
                                <div className="profile-options-wrapper">
                                    <button
                                        className="profile-options-btn"
                                        onClick={(e) => { e.stopPropagation(); setShowOptionsMenu(o => !o); }}
                                        aria-label="más opciones"
                                    >
                                        <i className="fa-solid fa-ellipsis"></i>
                                    </button>
                                    {showOptionsMenu && (
                                        <div className="profile-options-menu">
                                            <button onClick={handleBlock} disabled={blockingInProgress}>
                                                Bloquear a {profile.username}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="profile-stats">
                            <div className="profile-stat">
                                <span className="stat-number">{stats.posts}</span>
                                <span className="stat-label">publicaciones</span>
                            </div>
                            <div
                                className="profile-stat profile-stat-clickable"
                                onClick={() => stats.followers > 0 && setModalType('followers')}
                            >
                                <span className="stat-number">{stats.followers}</span>
                                <span className="stat-label">seguidores</span>
                            </div>
                            <div
                                className="profile-stat profile-stat-clickable"
                                onClick={() => stats.following > 0 && setModalType('following')}
                            >
                                <span className="stat-number">{stats.following}</span>
                                <span className="stat-label">siguiendo</span>
                            </div>
                        </div>

                        {profile.bio && (
                            <p className="profile-bio">{profile.bio}</p>
                        )}
                    </div>
                </div>
            </div>

            <div className="profile-divider" />

            {/* NUEVO: aviso si hay bloqueo en cualquier sentido */}
            {isBlocked ? (
                <div className="profile-private-lock">
                    <i className="fa-solid fa-ban"></i>
                    <h3>{blockedByMe ? 'Has bloqueado a este usuario' : 'No disponible'}</h3>
                    <p>
                        {blockedByMe
                            ? 'No verás sus publicaciones mientras esté bloqueado.'
                            : 'No puedes ver el contenido de este perfil.'}
                    </p>
                </div>
            ) : !canViewPosts ? (
                <div className="profile-private-lock">
                    <i className="fa-solid fa-lock"></i>
                    <h3>Esta cuenta es privada</h3>
                    <p>Sigue a {profile.username} para ver sus publicaciones.</p>
                </div>
            ) : posts.length === 0 ? (
                <div className="profile-empty">
                    <i className="fa-regular fa-image" style={{ fontSize: 48, color: '#8e8e8e' }}></i>
                    <p>Sin publicaciones aún</p>
                </div>
            ) : (
                <div className="profile-grid">
                    {posts.map(post => (
                        <div
                            key={post._id}
                            className="profile-grid-item"
                            onClick={() => navigate('/post/' + post._id)}
                        >
                            <img src={post.file} alt={post.tittle} className="profile-grid-img" />
                            <div className="profile-grid-overlay">
                                <span><i className="fa-solid fa-heart"></i> {post.likes?.length || 0}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {modalType && (
                <FollowListModal
                    userId={id}
                    type={modalType}
                    onClose={() => setModalType(null)}
                />
            )}
        </div>
    );
};

export default Profile;