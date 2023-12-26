import { Link, useNavigate } from 'react-router-dom';
import useFetch from '../../hooks/useFetch';
import styles from './style.module.scss';
import Loading from '../Loading/Loading';
import { useContext } from 'react';
import { IUserLogin, UserContext } from '../../providers/UserContext';

export interface IPost {
	image: string | null;
	theme: string;
	title: string;
	id: number;
}

interface IPostList {
	posts: IPost[];
}

const Posts = () => {
	const { data, loading, error, errorCode } = useFetch<IPostList>({
		url: 'http://9archikblog.ru/api/posts/',
	});

	const { user, setUser } = useContext(UserContext) as IUserLogin;

	const navigate = useNavigate();

	if (loading) {
		return <Loading />;
	}
	return (
		<div className={`${styles.container} container`}>
			<h2>Posts</h2>

			{user && (
				<div className={styles.addPost}>
					<Link to="/addPost">Add post</Link>
				</div>
			)}

			<ul>
				{data &&
					data.posts.map((el) => {
						return (
							<li onClick={() => navigate(`post/${el.id}`)}>
								<img src={el.image ? el.image : undefined} alt="post image" />
								<h3>{el.theme}</h3>
								<h4 className={styles.text}>{el.title}</h4>
							</li>
						);
					})}
			</ul>
		</div>
	);
};

export default Posts;
