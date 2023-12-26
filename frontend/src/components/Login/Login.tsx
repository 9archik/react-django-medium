import { useContext, useEffect, useState } from 'react';
import useFetch from '../../hooks/useFetch';
import Form, { IFormElement } from '../Form/Form';
import { useNavigate } from 'react-router-dom';
import { IUserLogin, UserContext, IUserInfo } from '../../providers/UserContext';

const elements: IFormElement[] = [
	{
		name: 'login',
		placeholder: 'enter email or nickname',
		minLength: 2,
		value: '',
		errorMessage: '',
		clientErrorMessage: 'Username is not exists',
		serverError: false,
	},
	{
		name: 'password',
		placeholder: 'enter password',
		minLength: 8,
		value: '',
		errorMessage: '',
		clientErrorMessage: 'Invalid password',
		serverError: false,
	},
];

const Login = () => {
	const navigate = useNavigate();
	const [form, setForm] = useState<IFormElement[]>(elements);
	const { user, setUser } = useContext(UserContext) as IUserLogin;
	const convertToJson = () => {
		const Json: { [key: string]: string } = {};
		for (let i = 0; i < form.length; i++) {
			Json[form[i].name] = form[i].value;
		}
		return Json;
	};
	const Json: { [key: string]: string } = convertToJson();

	const { data, fetchNow, error, loading, errorCode } = useFetch<any>({
		url: 'http://9archikblog.ru/api/login/',
		enabled: false,
		options: {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(Json),
			credentials: 'include',
		},
	});

	const onSubmit = () => {
		fetchNow();
	};

	useEffect(() => {
		if (!loading && !error && data && !data?.error) {
			navigate('/');
			setUser(data);
		} else {
			const arrForm = [...form];
			for (let i = 0; i < arrForm.length; i++) {
				if (data?.error && data.error === arrForm[i].clientErrorMessage) {
					arrForm[i].serverError = true;
				} else {
					arrForm[i].serverError = false;
				}
			}
			setForm(arrForm);
		}
	}, [data]);
	return (
		<Form onSubmit={onSubmit} form={form} setForm={setForm} btnName="Login" formName="Login" />
	);
};
export default Login;
