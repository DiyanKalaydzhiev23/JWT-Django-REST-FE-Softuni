import {useCallback, useEffect, useState} from "react";
import {Box, Button, Chip, FormControl, Grid, InputLabel, MenuItem, Modal, OutlinedInput, Select, Stack, Switch} from "@mui/material";
import {useTodos} from "../hooks/todos";
import {useCategories} from "../hooks/categories";
// STEP 19: Import useUsers to display and edit assignees in the detail modal
import {useUsers} from "../hooks/users";
import TodoItem from "./TodoItem";

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};


const TodosList = () => {
    const [filter, setFilter] = useState({});

    const [open, setOpen] = useState(false);
    const {
        todos,
        loadTodos,
        todoDetails,
        applyFilter,
        changeTodoState,
        updateTodoAssignees,
        loadTodoDetails,
    } = useTodos();

    const {
        categories,
        loadCategories,
    } = useCategories();

    // STEP 19: Get users list for displaying/editing assignees in the detail modal
    const {
        users,
        loadUsers,
    } = useUsers();

    const handleChangeCategory = useCallback((id) => {
        setFilter({
            ...filter, category: id,
        });
    }, [filter],)

    const handleShowTodoDetails = useCallback(
        async (id) => {
            setOpen(true);
            await loadTodoDetails(id);
        },
        [loadTodoDetails],
    );

    const handleStateChange = useCallback(
        async () => {
            await changeTodoState();
        },
        [changeTodoState],
    );

    // STEP 19: Handler for updating assignees from the detail modal
    const handleAssigneesChange = useCallback(
        async (newAssigneeIds) => {
            await updateTodoAssignees(todoDetails.id, newAssigneeIds);
        },
        [updateTodoAssignees, todoDetails],
    );

    const renderModalContent = useCallback(() => {
            const {
                title,
                description,
                state: isDone,
                assignees: detailAssignees,
            } = todoDetails;

            // STEP 22: Resolve assignee IDs by cross-referencing usernames with the users list,
            //          since the detail endpoint returns user objects without an id field
            const assigneeIds = (detailAssignees || []).map(a => {
                if (typeof a === 'object') {
                    const user = users.find(u => u.username === a.username);
                    return user ? user.id : null;
                }
                return a;
            }).filter(id => id != null);

            return (
                <Box>
                    <h3>
                        {title}
                    </h3>
                    <p>
                        {description}
                    </p>
                    <Switch
                        checked={isDone} onChange={() => handleStateChange()}/>

                    {/* STEP 19: Display current assignees as chips */}
                    {detailAssignees && detailAssignees.length > 0 && (
                        <Box sx={{ mt: 2 }}>
                            <strong>Assignees:</strong>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
                                {detailAssignees.map((a) => {
                                    const label = typeof a === 'object' ? a.username : a;
                                    const key = typeof a === 'object' ? a.id : a;
                                    return <Chip key={key} label={label} />;
                                })}
                            </Box>
                        </Box>
                    )}

                    {/* STEP 20: Edit assignees via multi-select in the detail modal */}
                    <FormControl fullWidth sx={{ mt: 2 }}>
                        <InputLabel id="detail-assignees-label">Edit Assignees</InputLabel>
                        <Select
                            labelId="detail-assignees-label"
                            multiple
                            value={assigneeIds}
                            onChange={(ev) => handleAssigneesChange(ev.target.value)}
                            input={<OutlinedInput label="Edit Assignees" />}
                            renderValue={(selected) => (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                    {selected.map((userId) => {
                                        const user = users.find(u => u.id === userId);
                                        return <Chip key={userId} label={user ? user.username : userId} />;
                                    })}
                                </Box>
                            )}
                        >
                            {users.map(({id, username}) => (
                                <MenuItem key={id} value={id}>{username}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
            )
        },
        [handleStateChange, handleAssigneesChange, todoDetails, users],
    );

    useEffect(() => {
        (async () => {
            await loadTodos();
        })();
    }, [loadTodos]);

    useEffect(() => {
        (async () => {
            await loadCategories();
        })();
    }, [loadCategories],);

    // STEP 19: Load users for assignee display and editing
    useEffect(() => {
        (async () => {
            await loadUsers();
        })();
    }, [loadUsers],);

    useEffect(() => {
        (() => {
            applyFilter(filter);
        })();
    }, [applyFilter, filter],);

    return (<div>
        <Stack direction='row'>
            <Button onClick={() => handleChangeCategory('')}>All</Button>
            {categories.map(({name, id}) => (
                <Button key={id} onClick={() => handleChangeCategory(id)}>{name}</Button>))}
        </Stack>
        <Grid container>
            {todos.map(todo => (<Grid item key={todo.id} xs={4}>
                <TodoItem
                    todo={todo}
                    onShowDetails={(id) => handleShowTodoDetails(id)}
                />
            </Grid>))}
        </Grid>

        <Modal open={open} onClose={() => setOpen(false)}>
            <Box sx={modalStyle}>
                {renderModalContent()}
            </Box>
        </Modal>
    </div>)
};

export default TodosList;