// STEP 15: Users context provider — fetches all users for the assignee picker
import {createContext, useCallback, useContext, useState} from "react";
import {useServices} from "./services";

const UsersContext = createContext();

const useUsers = () => useContext(UsersContext);

const UsersProvider = ({children}) => {
    const [users, setUsers] = useState([]);

    const {
        httpService,
        urlsService,
    } = useServices();

    const loadUsers = useCallback(
        async () => {
            const users = await httpService.get(urlsService.getUsersListUrl());
            setUsers(users);
        },
        [httpService, urlsService],
    );

    const value = {
        users,
        loadUsers,
    };

    return (
        <UsersContext.Provider value={value}>
            {children}
        </UsersContext.Provider>
    );
}

export default UsersProvider;

export {
    useUsers,
};
