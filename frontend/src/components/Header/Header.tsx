import { Link, NavLink } from 'react-router-dom';
import styles from './style.module.scss';
import { useContext, useEffect, useState } from 'react';
import { IUserLogin, UserContext } from '../../providers/UserContext';
import useFetch from '../../hooks/useFetch';
import { useCookies } from 'react-cookie';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import Burger from '../Burger/Burger';
import Profile from '../Profile/index';
const Header = () => {
	const { user, setUser } = useContext(UserContext) as IUserLogin;
	const [cookie, setCookie, removeCookie] = useCookies();
	const { width } = useWindowDimensions();
	const [burger, setBurger] = useState<boolean>(false);
	const { data, fetchNow, error, loading, errorCode } = useFetch({
		url: 'http://9archikblog.ru/api/logout/',
		enabled: false,
		options: {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			credentials: 'include',
		},
	});

	useEffect(() => {
		if (width > 767) {
			document.body.style.background = 'black';
			document.body.style.overflow = 'auto';
		}
	}, [width]);

	return (
		<header className={`${burger && styles.burgerActive}`}>
			<div className={`${styles.container} container`}>
				<div className={styles.logo}>Blog</div>

				{width > 767 ? (
					<>
						{' '}
						<nav className={styles.menu}>
							<NavLink to="/">Posts</NavLink>
							{!user ? (
								<>
									<NavLink to="register">Register</NavLink>
									<NavLink to="login">Login</NavLink>
								</>
							) : (
								<>
									<NavLink to="/profile">Profile</NavLink>
									<NavLink to="/myPosts">My posts</NavLink>
									<button
										onClick={() => {
											fetchNow();
											removeCookie('refresh_token', { path: '/' });
											removeCookie('access_token', { path: '/' });
											setUser(null);
										}}>
										Logout
									</button>
								</>
							)}
						</nav>
					</>
				) : (
					<button
						onClick={() => setBurger(!burger)}
						className={`${styles.burgerBtn} ${burger && styles.active}`}></button>
				)}
			</div>

			{width <= 768 && (
				<Burger active={burger}>
					{' '}
					<nav className={styles.burgerMenu}>
						<Link onClick={() => setBurger(false)} className={styles.burgerAct} to="/">
							Posts
						</Link>
						{!user ? (
							<>
								<NavLink
									onClick={() => setBurger(false)}
									className={styles.burgerAct}
									to="register">
									Register
								</NavLink>
								<NavLink onClick={() => setBurger(false)} className={styles.burgerAct} to="login">
									Login
								</NavLink>
							</>
						) : (
							<>
								<Link onClick={() => setBurger(false)} className={styles.burgerAct} to="/myPosts">
									My posts
								</Link>
								<Link onClick={() => setBurger(false)} className={styles.burgerAct} to="/profile">
									Profile
								</Link>
								<button
									className={styles.burgerAct}
									onClick={() => {
										fetchNow();
										removeCookie('refresh_token', { path: '/' });
										removeCookie('access_token', { path: '/' });
										setUser(null);
										setBurger(false);
									}}>
									Logout
								</button>
							</>
						)}
					</nav>
				</Burger>
			)}
		</header>
	);
};

export default Header;
