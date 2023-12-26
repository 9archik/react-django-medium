import { useContext, useEffect, useState } from 'react';
import useFetch from '../../hooks/useFetch';
import Form, { IFormElement } from '../Form/Form';
import { useNavigate } from 'react-router-dom';
import { IUserLogin, UserContext, IUserInfo } from '../../providers/UserContext';

const elements: IFormElement[] = [
	{
		name: 'email',
		placeholder: 'enter email',
		pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
		value: '',
		maxLength: 128,
		errorMessage: '',
		defaultErrorMessage: 'Enter a valid email',
		clientErrorMessage: 'Email already exists',
		serverError: false,
	},

	{
		name: 'username',
		placeholder: 'enter username',
		minLength: 2,
		maxLength: 16,
		value: '',
		errorMessage: '',
		clientErrorMessage: 'Username already exists',
		serverError: false,
	},
	{
		name: 'password',
		placeholder: 'enter password',
		minLength: 8,
		value: '',
		errorMessage: '',
		serverError: false,
	},
];

const Register = () => {
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
		url: 'http://9archikblog.ru/api/register/',
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
		<Form
			form={form}
			setForm={setForm}
			onSubmit={onSubmit}
			btnName="Register"
			formName="Register"
		/>
	);
};
export default Register;
