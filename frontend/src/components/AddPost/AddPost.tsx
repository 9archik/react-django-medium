import { useEffect, useRef, useState } from 'react';
import useFetch from '../../hooks/useFetch';
import Header from '../Header/Header';
import styles from './style.module.scss';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { IPostID } from '../PostPage/PostPage';

const AddPost = () => {
	const { id } = useParams();

	const fileRef = useRef<HTMLInputElement | null>(null);

	const { fetchNow, data } = useFetch<IPostID>({
		url: `http://9archikblog.ru/api/post/${id}/`,
		enabled: false,
	});

	const navigate = useNavigate();
	const location = useLocation();

	const [image, setImage] = useState<File | null>(null);
	const [content, setContent] = useState<string>('');
	const [title, setTitle] = useState<string>('');
	const [theme, setTheme] = useState<string>('');

	const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files;
		if (file) {
			setImage(file[0]);
		}
	};

	const handleSubmit = async (event: any) => {
		event.preventDefault();

		if (image) {
			const formData = new FormData();

			formData.append('image', image);
			formData.append('title', title);
			formData.append('content', content);
			formData.append('theme', theme);

			if (location.pathname.includes('updatePost')) {
				fetch(`http://9archikblog.ru/api/post/${id}/`, {
					method: 'PUT',
					body: formData,
					credentials: 'include',
				})
					.then((res) => {
						return res.json();
					})
					.then((res) => {
						navigate('/');
					})
					.catch((err) => {
						console.error(err);
					});
			} else {
				fetch('http://9archikblog.ru/api/add_post/', {
					method: 'POST',
					body: formData,
					credentials: 'include',
				})
					.then((res) => {
						return res.json();
					})
					.then((res) => {
						navigate('/');
					})
					.catch((err) => {
						console.error(err);
					});
			}
		}
	};

	useEffect(() => {
		if (location.pathname.includes('updatePost')) {
			fetchNow();
		}
	}, []);

	useEffect(() => {
		const imageUrl = data?.image;

		if (imageUrl) {
			fetch(imageUrl)
				.then((response) => response.blob())
				.then((blob) => {
					const file = new File([blob], imageUrl, { type: blob.type });
					setImage(file);
				})
				.catch((error) => console.log(error));
		}

		setContent(data?.content ? data.content : '');
		setTitle(data?.title ? data.title : '');
		setTheme(data?.theme ? data.theme : '');
	}, [data]);

	return (
		<>
			<Header />

			<form
				onSubmit={(e) => {
					handleSubmit(e);
				}}
				className={`${styles.form} container`}>
				<h2 className={styles.header}>
					{location.pathname.includes('updatePost') ? 'Update' : 'Add'} post
				</h2>
				<label>
					<span>Title</span>
					<input
						value={title}
						onChange={(e) => {
							setTitle(e.target.value);
						}}
						required
					/>
				</label>
				<label>
					<span>Content</span>
					<textarea
						value={content}
						onChange={(e) => {
							setContent(e.target.value);
						}}
						required></textarea>
				</label>
				<label>
					<span>Image</span>
					<input
						ref={fileRef}
						onChange={(e) => {
							handleImageChange(e);
						}}
						type="file"
						required
					/>
					<button
						onClick={(e) => {
							fileRef.current?.click();
						}}
						type="button"
						className={styles.addImage}>
						Add image
					</button>
					<div className={styles.fileName}>
						<span>{image ? image.name : ''}</span>
					</div>
				</label>
				<label>
					<span>Theme</span>
					<input
						value={theme}
						onChange={(e) => {
							setTheme(e.target.value);
						}}
						required
					/>
				</label>

				<div className={styles.sendBtn}>
					<button type="submit">
						{location.pathname.includes('updatePost') ? 'Update' : 'Add'} post
					</button>
				</div>
			</form>
		</>
	);
};

export default AddPost;
