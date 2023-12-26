import { useEffect, useState } from 'react';

const useWindowDimensions = () => {
	const [width, setWidth] = useState<number>(window.innerWidth);
	const [height, setHeight] = useState<number>(window.innerHeight);
	useEffect(() => {
		const windowSize = () => {
			setWidth(window.innerWidth);
			setHeight(window.innerHeight);
		};
		window.addEventListener('resize', windowSize);
		return () => window.removeEventListener('resize', windowSize);
	}, []);

	return { width, height };
};

export default useWindowDimensions;