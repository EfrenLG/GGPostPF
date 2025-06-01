const PostsCard = ({ posts }) => {

    return (
        <div className="userPosts">
            {posts.map((post) => (
                <div className="post-card" key={post._id}>
                    <img
                        src={`https://ggpostb.onrender.com/post/${post.file}`}
                        alt={post.file}
                        className="post-image"
                    />
                    <div className="post-details">
                        <h3>{post.tittle}</h3>
                        <p>{post.description}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default PostsCard;