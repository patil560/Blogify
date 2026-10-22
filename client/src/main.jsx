import React from "react";
import ReactDOM from "react-dom/client";
import {BrowserRouter,Routes,Route} from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import {AuthProvider,useAuth} from "./context/AuthContext";
import Home from "./pages/Home";
import {SignIn,SignUp} from "./pages/Auth";
import BlogDetails from "./pages/BlogDetails";
import CreateBlog from "./pages/CreateBlog";
import Bookmarks from "./pages/Bookmarks";
import Notifications from "./pages/Notifications";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import "./styles/global.css";

function AdminRoute(){
	const {user,loading}=useAuth();
	if(loading)return <div className="state">Loading…</div>;
	if(!user)return <NotFound/>;return user.role==="ADMIN"?<Admin/>:<NotFound/>
}

ReactDOM.createRoot(document.getElementById("root"))
.render(
	<React.StrictMode>
		<BrowserRouter>
			<AuthProvider>
				<Routes>
					<Route element={<Layout/>}>
						<Route index element={<Home/>}/>
						<Route path="signin" element={<SignIn/>}/>
						<Route path="signup" element={<SignUp/>}/>
						<Route path="blogs/:id" element={<BlogDetails/>}/>
						<Route element={<ProtectedRoute/>}>
							<Route path="create" element={<CreateBlog/>}/>
							<Route path="edit/:id" element={<CreateBlog/>}/>
							<Route path="bookmarks" element={<Bookmarks/>}/>
							<Route path="notifications" element={<Notifications/>}/>
							<Route path="admin" element={<AdminRoute/>}/>
						</Route>
						<Route path="*" element={<NotFound/>}/>
					</Route>
				</Routes>
			</AuthProvider>
		</BrowserRouter>
	</React.StrictMode>);
