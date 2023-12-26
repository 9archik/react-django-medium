import React, {
	createContext,
	useState,
	useContext,
	FC,
	PropsWithChildren,
	useEffect,
} from 'react';

export interface IUserInfo{
	id: string;
	username: string
}

export interface IUserLogin {
	user: IUserInfo | null;
	setUser: React.Dispatch<React.SetStateAction<IUserInfo | null>>;
}

export const UserContext = createContext<IUserLogin | null>(null);

export const UserProvider: FC<PropsWithChildren> = ({ children }) => {
	const [user, setUser] = useState<IUserInfo | null>(null);

	return <UserContext.Provider value={{user, setUser}}>{children}</UserContext.Provider>;
};
