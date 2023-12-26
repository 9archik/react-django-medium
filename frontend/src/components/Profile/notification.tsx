import { FC } from "react";
import styles from "./style.module.scss"

interface INotification{
    active: boolean
}
const Notification: FC<INotification> = ({active = false}) => {
	return <div className={`${styles.errorNotify} ${active && styles.active}`}>Image update</div>;
};

export default Notification