const PostsCard = (posts) => {

    return (
        <div className="userPosts">
            {posts.map(() => {
                <div className="post-card">
                    <img
                        src={`https://ggpostb.onrender.com/post/${posts.file}`}
                        alt={posts.file}
                        className="post-image">
                    </img>

                    <div className="post-details">
                        <h3>{posts.tittle}</h3>
                        <p>{posts.description}</p>
                    </div>
                </div>
            })}
        </div>
    );
};

export default PostsCard;