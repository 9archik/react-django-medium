import styles from './style.module.scss';
import icon from '../../assets/images/avatar.jpg';
import { useContext, useEffect, useRef, useState } from 'react';
import useFetch from '../../hooks/useFetch';
import Notification from './notification';
import { IUserLogin, UserContext } from '../../providers/UserContext';
import { useNavigate } from 'react-router-dom';
interface IData {
	email: string;
	username: string;
	avatar: null | string;
}
const Profile = () => {
	const [image, setImage] = useState<any>(null);
	const [previewImage, setPreviewImage] = useState<any>(null);
	const [statusUpdate, setStatusUpdate] = useState<boolean>(false);
	const { user, setUser } = useContext(UserContext) as IUserLogin;
	const timer = useRef<NodeJS.Timeout | null>(null);
	const navigate = useNavigate();

	const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files;
		if (file) {
			setImage(file[0]);
		}
	};

	const { data, error, fetchNow, loading, errorCode } = useFetch<IData>({
		url: 'http://9archikblog.ru/api/user_info/',
		enabled: false,
		options: {
			headers: {
				'Content-Type': 'application/json',
			},
			credentials: 'include',
		},
	});

	useEffect(() => {
		fetchNow();
	}, []);

	useEffect(() => {
		const imageUrl = `http://9archikblog.ru${data?.avatar}`;

		fetch(imageUrl)
			.then((response) => response.blob())
			.then((blob) => {
				const file = new File([blob], 'imageUrl', { type: blob.type });
				setImage(file);
			})
			.catch((error) => console.log(error));
	}, [data]);

	const handleSubmit = async (event: any) => {
		event.preventDefault();

		const formData = new FormData();
		formData.append('avatar', image);

		fetch('http://9archikblog.ru/api/user_info/', {
			method: 'POST',
			body: formData,
			credentials: 'include',
		})
			.then((res) => {
				return res.json();
			})
			.then((res) => {
				setStatusUpdate(true);
				timer.current = setTimeout(() => {
					setStatusUpdate(false);
				}, 5000);
			});
	};

	useEffect(() => {
		if (image) {
			setPreviewImage(URL.createObjectURL(image));
		} else {
			if (data && !loading && data?.avatar) {
				setPreviewImage(`http://9archikblog.ru${data.avatar}`);
			} else {
				setPreviewImage(icon);
			}
		}

		return () => {
			if (timer.current) clearTimeout(timer.current);
		};
	}, [data, image]);

	if (!user) {
		navigate('/login');
	}

	if (loading) {
		return <></>;
	}

	return (
		<>
			<div className={`container ${styles.container}`}>
				<h2>Your profile</h2>
				<img src={previewImage} width={250} height={250} />
				<label className={styles.labelFile}>
					<span>Download image</span>
					<input
						onChange={(event) => {
							handleImageChange(event);
						}}
						type="file"
						accept=".png, .svg, .jpg, .jpeg"
						multiple={false}
					/>
				</label>

				<div className={styles.infoItem}>email: {data && data.email}</div>

				<div className={styles.infoItem}>username: {data && data.username}</div>

				<button
					onClick={(event) => {
						handleSubmit(event);
					}}>
					Send
				</button>
			</div>

			<Notification active={statusUpdate} />
		</>
	);
};

export default Profile;
