import { Link } from "react-router-dom";

export default function BlogCard({blog}){
	return 
	<article className="card blog-card">
		<img src={blog.coverImageUrl} alt=""/>
		<div className="card-body">
			<div className="meta">
				<span>{blog.category}</span>
				<span>{new Date(blog.createdAt).toLocaleDateString()}</span>
			</div>
			<h2>{blog.title}</h2>
			<p>{blog.body.slice(0,150)}{blog.body.length>150?"…":""}</p>
			<div className="card-footer">
				<span>By {blog.createdBy?.username || "Author"}</span>
				<span>♥ {blog.likeCount||0}</span>
			</div>
			<Link className="button small" to={`/blogs/${blog._id}`}>Read article</Link>
		</div>
	</article>
}
