import { FC, ReactNode, useEffect } from 'react';
import styles from './style.module.scss';
interface IBurger {
	active: boolean;
	children: ReactNode;
}
const Burger: FC<IBurger> = ({ active, children }) => {
	useEffect(() => {
		if (active) {
			document.body.style.background = 'rgba(0, 0, 0, 0.85)';
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.background = 'black';
			document.body.style.overflow = 'auto';
		}
	}, [active]);
	return <div className={`${styles.container} ${active && styles.active}`}>{children}</div>;
};

export default Burger;
