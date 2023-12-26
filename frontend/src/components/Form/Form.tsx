import { FC, useCallback, useEffect, useLayoutEffect, useState } from 'react';
import styles from './style.module.scss';
import useFetch from '../../hooks/useFetch';

export interface IFormElement {
	name: string;
	minLength?: number;
	maxLength?: number;
	pattern?: RegExp;
	placeholder?: string;
	defaultErrorMessage?: string;
	errorMessage?: string | null;
	value: string;
	clientErrorMessage?: string | null;
	active?: boolean;
	serverError: boolean;
}

export interface IFormProp {
	formName: string;
	form: IFormElement[];
	setForm: React.Dispatch<React.SetStateAction<IFormElement[]>>;
	btnName: string;
	onSubmit: () => void;
}

const Form: FC<IFormProp> = ({ formName, onSubmit, form, setForm, btnName }) => {
	const [isDisabled, setIsDisabled] = useState<boolean>(true);
	const [submited, setSubmited] = useState<boolean>(false);

	const validateFields = (value: string, index: number) => {
		const arr = [...form];
		const el = { ...form[index], active: true };

		if (el.minLength && value.length < el.minLength) {
			el.errorMessage = `Min length ${el.minLength} symbols`;
			el.value = value;
			arr[index] = el;
			setForm(arr);
			return;
		}

		if (el.maxLength && value.length > el.maxLength) {
			el.errorMessage = `Max length ${el.maxLength} symbols`;
			el.value = value;
			arr[index] = el;
			setForm(arr);
			return;
		}

		if (el.pattern && !el.pattern.test(value)) {
			el.errorMessage = el.defaultErrorMessage;
			el.value = value;
			arr[index] = el;
			setForm(arr);
			return;
		}
		el.errorMessage = null;
		arr[index] = el;
		el.value = value;
		setForm(arr);
	};

	useEffect(() => {
		const isDisabled = () => {
			const obj: { [key: string]: string } = {};
			for (let i = 0; i < form.length; i++) {
				obj[form[i].name] = form[i].value;
				if (typeof form[i].errorMessage === 'string') {
					setIsDisabled(true);
					return;
				}
			}
			setIsDisabled(false);
		};
		isDisabled();
	}, [form]);

	return (
		<div className={`container ${styles.container}`}>
			<h2>{formName}</h2>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					setSubmited(true);
					onSubmit();
				}}>
				{form.map((el, index) => {
					return (
						<div className={styles.field}>
							<div className={styles.name}>
								<span>{el.name}</span>
								{el.serverError && submited && (
									<span className={styles.error}>{el.clientErrorMessage}</span>
								)}
							</div>

							<input
								onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
									validateFields(event.target.value, index);
								}}
								placeholder={el.placeholder}
								value={el.value}
							/>
							{typeof el.errorMessage === 'string' && el?.active ? (
								<span className={styles.error}>{el.errorMessage}</span>
							) : (
								<></>
							)}
						</div>
					);
				})}

				<button
					disabled={isDisabled}
					type="submit"
					className={`${styles.submit} ${isDisabled && styles.disabled}`}>
					{btnName}
				</button>
			</form>
		</div>
	);
};
export default Form;
