import './PostsCard.css';

const adClient = import.meta.env.VITE_ADCLIENT; // FIX: variables de entorno corregidas
const adSlot = import.meta.env.VITE_ADSLOT;     // FIX: variables de entorno corregidas


const PostsCard = ({ posts, usuarios }) => {

    const userId = localStorage.getItem('userId');
    const [usuariosD, setUsuariosD] = useState([]);
    const [seeker, setSeeker] = useState('');
    const [postsState, setPostsState] = useState([]); // FIX: estado propio para no mutar props

    const resultURL = url();
    const navigate = useNavigate();

    // FIX: useEffect con sintaxis correcta (coma estaba fuera)
    useEffect(() => {
        if (Array.isArray(usuarios)) {
            setUsuariosD(usuarios);
        }
    }, [usuarios]);

    // FIX: sincronizar postsState cuando lleguen los posts
    useEffect(() => {
        if (Array.isArray(posts)) {
            setPostsState(posts.map(p => ({ ...p })));
        }
    }, [posts]);

    const handlePostClick = (post) => {
        navigate('/post/' + post._id);
    };

    // FIX: handleFollow definida (antes no existía y daba error en runtime)
    const handleFollow = async (targetUserId) => {
        try {
            await userService.followUser(targetUserId);
        } catch (error) {
            if (error.response?.data?.error === 'Acceso no autorizado') {
                navigate('/');
            }
            console.log('Error al seguir al usuario', error);
        }
    };

    const sendView = async (idPost) => {
        const dataPost = { 'idPost': idPost };
        try {
            await userService.viewPost(dataPost);
        } catch (error) {
            if (error.response?.data?.error === 'Acceso no autorizado') {
                navigate('/');
            }
            console.log('Error cargando los post', error);
        }
    };

    const sendLike = async (idPost, idUser) => {
        const postData = { 'idPost': idPost, 'userId': idUser };
        try {
            await userService.likePost(postData);
        } catch (error) {
            if (error.response?.data?.error === 'Acceso no autorizado') {
                navigate('/');
            }
            console.log('Error cargando los post', error);
        }
    };

    // FIX: toggle de like sin mutar el objeto original
    const toggleLike = (postId) => {
        setPostsState(prev => prev.map(p => {
            if (p._id !== postId) return p;
            const alreadyLiked = p.likes?.includes(userId);
            return {
                ...p,
                likes: alreadyLiked
                    ? p.likes.filter(id => id !== userId)
                    : [...(p.likes || []), userId]
            };
        }));
        sendLike(postId, userId);
    };

    const filterPosts = postsState.filter(post => {
        if (!seeker) return true;
        if (!post.categories || typeof post.categories !== 'string') return false;
        const categorias = post.categories.split(',');
        return categorias.some(cat => cat.toLowerCase().includes(seeker.toLowerCase()));
    });

    return (<>

        <div className='seeker'>
            <input
                type="text"
                id="buscador"
                placeholder='Introduzca un #...'
                value={seeker}
                onChange={(e) => setSeeker(e.target.value)}
            />
        </div>

        <div className="post-wrapper">
            <div id="userPosts" className="posts-container">
                {filterPosts.map((post, index) => (
                    <React.Fragment key={post._id}>

                        <div className="post-card"
                            onClick={(e) => {
                                const isFollowButton = e.target.closest('.follow-button');
                                if (!isFollowButton) {
                                    handlePostClick(post);
                                    post.idUser !== userId && sendView(post._id);
                                }
                            }}
                        >
                            {resultURL !== 'user' && (
                                <div className="post-header">
                                    <img
                                        src={usuariosD.find(u => u.id === post.idUser)?.icon}
                                        alt='icon'
                                        className='icon'
                                        id={post.idUser}
                                    />
                                    <span className="author-name">{post.username}</span>
                                    {post.idUser !== userId && (
                                        <button
                                            id={post.idUser}
                                            className="follow-button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleFollow(post.idUser); // FIX: función ahora definida
                                            }}
                                        >
                                            Seguir
                                        </button>
                                    )}
                                </div>
                            )}

                            <img src={post.file} alt={post.tittle} className="post-image-card" />

                            <div className="post-title">{post.tittle}</div>
                            <div className="post-description-container">
                                <div className="post-description">
                                    {post.description.length > 100
                                        ? post.description.slice(0, 100) + "..."
                                        : post.description}
                                </div>
                                {post.description.length > 100 && (
                                    <span
                                        className="ver-mas"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handlePostClick(post);
                                            post.idUser !== userId && sendView(post._id);
                                        }}
                                    >
                                        Ver más
                                    </span>
                                )}
                            </div>

                            <div className="post-footer">
                                <span className="views-count">{post.views} vistas</span>
                                <span className="likes-count">
                                    {post.likes?.includes(userId) ? (
                                        <i
                                            className="fa fa-heart"
                                            style={{ color: '#ff0000' }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleLike(post._id); // FIX: sin mutar props
                                            }}
                                        />
                                    ) : (
                                        <i
                                            className="fa-regular fa-heart"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleLike(post._id); // FIX: sin mutar props
                                            }}
                                        />
                                    )}
                                    <span className="like-number">{post.likes?.length || 0}</span>
                                </span>
                            </div>
                        </div>

                        {(index + 1) % 5 === 0 && (
                            <AdBanner adClient={adClient} adSlot={adSlot} style={{ margin: '20px 0' }} />
                        )}
                    </React.Fragment>
                ))}
            </div>
        </div>
    </>);
};

export default PostsCard;