import { FC, ReactNode, useEffect } from 'react';
import styles from './style.module.scss';
interface IBurger {
	active: boolean;
	children: ReactNode;
}
const Burger: FC<IBurger> = ({ active, children }) => {
	return <div className={`${styles.container} ${active && styles.active}`}>{children}</div>;
};

export default Burger;
