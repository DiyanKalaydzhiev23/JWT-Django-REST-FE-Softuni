import {createContext, useCallback, useContext, useEffect, useState} from "react";
import {useServices} from "./services";

const TodosContext = createContext();

const useTodos = () => useContext(TodosContext);

const TodosProvider = ({children}) => {
    const [todos, setTodos] = useState([]);
    const [todoDetails, setTodoDetails] = useState({
        title: '',
        description: '',
        state: false,
    });
    const [query, setQuery] = useState({});
    const {
        httpService,
        urlsService,
    } = useServices();

    const loadTodos = useCallback(async () => {
        const newTodos = await httpService.get(urlsService.getTodosListUrl(), query);
        setTodos(newTodos);
    }, [httpService, query, urlsService]);

    const loadTodoDetails = useCallback(
        async (id) => {
            const newTodo = await httpService.get(urlsService.getTodoDetailsUrl(id));
            setTodoDetails(newTodo);
        },
        [httpService, urlsService],
    );

    const changeTodoState = useCallback(
        async () => {
            const {id, state} = todoDetails;
            const payload = {
                ...todoDetails,
                state: !state,
            };
            await httpService.put(urlsService.getTodoUpdateUrl(id), payload);
            await loadTodoDetails(id);
        },
        [httpService, loadTodoDetails, todoDetails, urlsService],
    );

    const createTodo = useCallback(
        async (todo) => {
            await httpService.post(urlsService.getTodoCreateUrl(), todo);
            await loadTodos();
        },
        [httpService, loadTodos, urlsService],
    );

    // STEP 17: Update the assignees of a todo via PATCH and reload both detail and list
    const updateTodoAssignees = useCallback(
        async (id, assignees) => {
            await httpService.patch(urlsService.getTodoUpdateUrl(id), { assignees });
            // STEP 23: Reload both the detail (for the modal) and the list (for the assignee count in TodoItem)
            await loadTodoDetails(id);
            await loadTodos();
        },
        [httpService, loadTodoDetails, loadTodos, urlsService],
    );

    const applyFilter = useCallback(
        ({state, category}) => {
            setQuery({state, category});
        },
        [],
    );

    useEffect(
        () => {
            (async () => {
                await loadTodos();
            })();
        },
        [loadTodos],
    )

    const value = {
        todoDetails,
        todos,
        loadTodos,
        loadTodoDetails,
        changeTodoState,
        createTodo,
        updateTodoAssignees,
        applyFilter,
    };

    return <TodosContext.Provider value={value}>
        {children}
    </TodosContext.Provider>
}

export {
    useTodos,
}

export default TodosProvider;