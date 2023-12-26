import { FC, useContext, useEffect, useState } from 'react';
import styles from './style.module.scss';
import { IUserLogin, UserContext } from '../../providers/UserContext';
interface IComment {
	avatar: string | null;
	username: string;
	date: string;
	user_id: string;
	id: number;
	content: string;
	clickDelete: (id: number) => void;
	clickUpdate: (id: number, content: string, func: () => void) => void;
	admin: boolean;
}
const CommentItem: FC<IComment> = ({
	avatar,
	username,
	date,
	user_id,
	id,
	content,
	clickDelete,
	clickUpdate,
	admin,
}) => {
	const { user } = useContext(UserContext) as IUserLogin;
	const [modal, setModal] = useState(false);
	const [update, setUpdate] = useState(false);
	const [contentText, setContentText] = useState(content);

	useEffect(() => {
		const clickWindow = () => {
			setUpdate(false);
			setModal(false);
		};

		window.addEventListener('click', clickWindow);

		return () => window.removeEventListener('click', clickWindow);
	}, []);

	return (
		<li>
			<div className={styles.info}>
				<img
					src={avatar ? `http://9archikblog.ru${avatar}` : ''}
					className={styles.avatar}
					width="44"
					height={44}
				/>
				<div className={styles.infoText}>
					<span className={styles.nickname}>{username}</span>
					<span className={styles.date}>{date}</span>
				</div>

				{(user_id === user?.id || admin) && (
					<div className={styles.commentBtn}>
						<button
							onClick={(e) => {
								e.stopPropagation();
								setModal(!modal);
							}}
							className={styles.dotBtn}>
							<div></div>
						</button>

						{modal && (
							<div className={styles.btnsHidden}>
								{user_id === user?.id && (
									<button
										onClick={(e) => {
											e.stopPropagation();
											setUpdate(true);
											setModal(false);
										}}>
										Update
									</button>
								)}

								<button
									onClick={() => {
										clickDelete(id);
									}}>
									Delete
								</button>
							</div>
						)}
					</div>
				)}
			</div>
			{update ? (
				<label className={styles.inputText}>
					<input
						onClick={(e) => {
							e.stopPropagation();
						}}
						value={contentText}
						onChange={(e) => {
							setContentText(e.target.value);
						}}
					/>
					<button
						onClick={(e) => {
							e.stopPropagation();
							const changeUpdate = () => {
								setUpdate(false);
							};
							clickUpdate(id, contentText, changeUpdate);
						}}>
						Send
					</button>
				</label>
			) : (
				<div className={styles.text}>{content}</div>
			)}
		</li>
	);
};

export default CommentItem;
