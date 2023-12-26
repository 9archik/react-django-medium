import { useState, useEffect } from 'react';

export interface IUseFetchProps {
	url: string;
	options?: RequestInit;
	enabled?: boolean;
	refetchTime?: number;
}

interface MyObject {
	[key: string]: any;
}

const useFetch = <data = unknown, error extends Error = Error>({
	url = '',
	options = undefined,
	enabled = true,
	refetchTime,
}: IUseFetchProps) => {
	const [status, setStatus] = useState<{
		data: data | null;
		error: boolean | null;
		loading: boolean;
		errorCode: null | number;
	}>({
		loading: true,
		data: null,
		error: null,
		errorCode: null,
	});

	async function fetchNow(data: MyObject | undefined = undefined) {
		setStatus({ ...status, loading: true });
		let valueData:any = ''

		if (data && options) {
			const formData = new FormData();
			for (let key in data) {
				if (data.hasOwnProperty(key)) {
					var value = data[key];
					
					formData.append(key, value);
				}
			}
			options.body = formData;
		}
		const res = await fetch(url, options)
			.then((res: Response) => {
				if (res.ok) {
					return res.json();
				}
				return Promise.reject(res);
			})
			.then((data: data) => {
				setStatus({ ...status, loading: false, data: data, error: false });
				return data;
			})
			.catch((error: Response) => {
				setStatus({ ...status, loading: false, error: true, errorCode: error.status });
			});
		
		
       

		return res
	}

	useEffect(() => {
		if (url && enabled && !refetchTime) {
			fetchNow();
		} else if (url && refetchTime) {
			fetchNow();
			let timer = setInterval(() => {
				fetchNow();
			}, refetchTime);

			return () => clearInterval(timer);
		}
	}, []);

	return { ...status, fetchNow };
};

export default useFetch;
