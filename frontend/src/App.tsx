import React, { useContext, useRef } from 'react';
import logo from './logo.svg';
import './App.scss';
import Header from './components/Header/Header';
import { Route, Routes } from 'react-router-dom';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import Posts from './components/Posts/Posts';
import PostPage from './components/PostPage/PostPage';
import { IUserInfo, IUserLogin, UserContext, UserProvider } from './providers/UserContext';
import useFetch from './hooks/useFetch';
import { useEffect, useState } from 'react';
import NotFound from './components/NotFound/NotFound';
import Profile from './components/Profile';
import AddPost from './components/AddPost/AddPost';
import MyPosts from './components/MyPosts/MyPosts';

function App() {
	const firstRender = useRef<boolean>(false);
	const [checkAccount, setCheckAccount] = useState<boolean>(false);
	const { user, setUser } = useContext(UserContext) as IUserLogin;
	const { data, fetchNow, error, loading, errorCode } = useFetch<IUserInfo>({
		url: 'http://9archikblog.ru/api/token/refresh/',
		enabled: true,
		options: {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			credentials: 'include',
		},
		refetchTime: 1000 * 4 * 60,
	});

	useEffect(() => {
		if (firstRender?.current && error !== null) {
			if (error && data) {
				setUser(null);
			} else if (data) setUser(data);
			setCheckAccount(true);
		}
		firstRender.current = true;
	}, [data, error, loading, errorCode]);
	return (
		<>
			{checkAccount ? (
				<>
					<Header />
					<main>
						<Routes>
							<Route path="/" element={<Posts />} />
							<Route path="/myPosts" element={<MyPosts />} />
							<Route path="/login" element={<Login />} />
							<Route path="/register" element={<Register />} />
							<Route path="/post/:id" element={<PostPage />} />
							<Route path="*" element={<NotFound />} />
							<Route path="/profile" element={<Profile />} />
							<Route path="/addPost" element={<AddPost />} />
							<Route path="/updatePost/:id" element={<AddPost />} />
						</Routes>
					</main>
				</>
			) : (
				<></>
			)}
		</>
	);
}

export default App;
