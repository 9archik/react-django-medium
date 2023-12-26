import { useParams } from 'react-router-dom';
import useFetch from '../../hooks/useFetch';
import { IPostCommentID } from './PostPage';
import { FC, useContext, useEffect, useRef, useState } from 'react';
import styles from './style.module.scss';
import { IUserLogin, UserContext } from '../../providers/UserContext';
import avatar from '../../assets/images/avatar.jpg';
import CommentItem from './CommentItem';

interface IComment {
	admin: boolean;
}

const Months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const Comments: FC<IComment> = ({ admin }) => {
	const { id } = useParams();
	const [comment, setComment] = useState<string>('');
	const [errorLogin, setErrorLogin] = useState<boolean>(false);
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const firstRender = useRef<boolean>(false);
	const { user } = useContext(UserContext) as IUserLogin;

	const [commentList, setCommentList] = useState<IPostCommentID[]>([]);

	const {
		data: commentsData,
		loading: commentLoading,
		error: commentError,
		fetchNow: fetchComments,
	} = useFetch<IPostCommentID[]>({
		url: `http://9archikblog.ru/api/comments/${id}/`,
		enabled: false,
	});

	const { data, fetchNow } = useFetch({
		url: `http://9archikblog.ru/api/comments/${id}/`,
		enabled: false,
		options: {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ content: comment }),
			credentials: 'include',
		},
	});

	useEffect(() => {
		if (firstRender.current && user) {
			setErrorLogin(false);
		}
	}, [user]);

	useEffect(() => {
		fetchComments();
	}, [data]);

	useEffect(() => {
		if (commentsData) setCommentList(commentsData);
	}, [commentsData]);

	const clickDelete = (commentId: number) => {
		fetch(`http://9archikblog.ru/api/updatecomment/${commentId}/`, {
			method: 'DELETE',
			credentials: 'include',
		})
			.then((res) => res.json())
			.then((res: IPostCommentID[]) => {
				setCommentList(res);
			})
			.catch((err) => console.error(err));
	};

	const clickUpdate = (commentId: number, content: string, func: () => void) => {
		const formData = new FormData();
		formData.append('content', content);
		fetch(`http://9archikblog.ru/api/updatecomment/${commentId}/`, {
			method: 'PUT',
			credentials: 'include',
			body: formData,
		})
			.then((res) => res.json())
			.then((res: IPostCommentID[]) => {
				setCommentList(res);
				func();
			})
			.catch((err) => {
				console.error(err);
				func();
			});
	};

	const convertToDate = (str: string) => {
		const date = new Date(str);
		return `${date.getDate()} ${Months[date.getMonth()]} ${date.getFullYear()}`;
	};

	console.log('data', commentList)
	return (
		<>
			<div className={styles.comments}>
				<div className={styles.header}>
					<h5>Comments</h5>
					{errorLogin && <span className={styles.error}>Log in account for comment</span>}
				</div>

				<div className={styles.inputWrapper}>
					<textarea
						ref={textareaRef}
						value={comment}
						onChange={(e) => {
							setComment(e.target.value);
						}}
						className={styles.textField}
						placeholder="Write comment"
					/>
				</div>
				<div className={styles.buttonContainer}>
					<button
						onClick={() => {
							if (
								user &&
								textareaRef?.current?.value?.length &&
								textareaRef?.current?.value?.length > 0
							) {
								fetchNow();
								setComment('');
							} else {
								if (!user) {
									setErrorLogin(true);
								}
							}
						}}>
						Publish
					</button>
				</div>
				<ul>
					{commentList?.map((el) => {
						return (
							<CommentItem
								clickDelete={clickDelete}
								key={el.id}
								avatar={el.avatar}
								content={el.content}
								username={el.username}
								user_id={el.user_id}
								id={el.id}
								date={convertToDate(el.date)}
								admin={admin}
								clickUpdate={clickUpdate}
							/>
						);
					})}
				</ul>
			</div>
		</>
	);
};

export default Comments;
