import { Link } from 'react-router-dom';
import useFetch from '../../hooks/useFetch';
import styles from './style.module.scss';
import { useContext, useEffect, useState } from 'react';
import { IUserLogin, UserContext } from '../../providers/UserContext';
import { useNavigate } from 'react-router-dom';

interface IMyPost {
	title: string;
	id: number;
}
const MyPosts = () => {
	const navigate = useNavigate()
	const { user, setUser } = useContext(UserContext) as IUserLogin;
	const { loading, fetchNow, error, errorCode } = useFetch<IMyPost[]>({
		url: 'http://9archikblog.ru/api/user_posts/',
		options: {
			credentials: 'include',
		},
	});

	const [posts, setPosts] = useState<IMyPost[]>([]);

	useEffect(() => {
		fetchNow().then((res) => {
			if (Array.isArray(res)) {
				setPosts(res);
			}
		});
	}, []);

	const deletePost = (id: number) => {
		fetch(`http://9archikblog.ru/api/post/${id}/`, {
			method: 'DELETE',

			credentials: 'include',
		})
			.then((res) => {
				if (res.ok) return res.json();
				else throw new Error();
			})
			.then((res: IMyPost[]) => {
				setPosts(res);
			})
			.catch((err) => {
				console.error(err);
			});
	};

	if (!user) {
		navigate('/login');
	}

	return (
		<ul className={`${styles.postList} container`}>
			{posts &&
				posts.map((el) => {
					return (
						<li>
							<span onClick={() => {
								navigate(`/post/${el.id}`)
							}}>{el.title}</span>
							<div className={styles.btns}>
								<Link to={`/updatePost/${el.id}`} className={styles.updateBtn}>
									Update
								</Link>
								<button
									onClick={() => {
										deletePost(el.id);
									}}
									className={styles.deleteBtn}>
									Delete
								</button>
							</div>
						</li>
					);
				})}
		</ul>
	);
};

export default MyPosts;
