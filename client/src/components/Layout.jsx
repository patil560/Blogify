import { Link, NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Layout(){
	const {user,signOut}=useAuth();
	return (<>
	<header className="topbar">
		<Link className="brand" to="/">Blogify</Link>
		<nav>
			<NavLink to="/">Home</NavLink>
			{user && <NavLink to="/create">Write</NavLink>}
			{user&&<NavLink to="/bookmarks">Bookmarks</NavLink>}
			{user&&<NavLink to="/notifications">Notifications</NavLink>}
			{user?.role==="ADMIN"&&<NavLink to="/admin">Admin</NavLink>}
		</nav>
		<div className="auth-nav">
			{
				user ? <>
				<span className="user-chip">{user.username}</span>
				<button className="button ghost" onClick={signOut}>Logout</button>
				</> : <>
				<Link className="button ghost" to="/signin">Sign in</Link>
				<Link className="button" to="/signup">Get started</Link>
				</>}
			</div>
		</header>
		<main className="container">
			<Outlet/>
		</main>
		<footer>© {new Date().getFullYear()} Blogify · Built with React, Express & MongoDB</footer>
		</>)
	}
