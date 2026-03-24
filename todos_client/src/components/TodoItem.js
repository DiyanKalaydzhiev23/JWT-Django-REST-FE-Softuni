import {Box, Button, Chip} from "@mui/material";
import styles from "./TodoItem.module.scss";

const TodoItem = ({todo, onShowDetails}) => {
    const {
        id, title, assignees,
    } = todo;

    // STEP 21: The list endpoint returns assignees as an array of user IDs — show the count
    const assigneeCount = assignees ? assignees.length : 0;

    return (<>
        <Box sx={{
            marginTop: 5, width: 150, textAlign: 'center',
        }}>
            <div className={styles.box}>
                <h3>{title}</h3>
                {/* STEP 21: Display assignee count as a chip beneath the title */}
                {assigneeCount > 0 && (
                    <Chip
                        label={`${assigneeCount} assignee${assigneeCount !== 1 ? 's' : ''}`}
                        size="small"
                        sx={{ mb: 1 }}
                    />
                )}
                <Button
                    variant='text'
                    onClick={() => onShowDetails(id)}
                >Details</Button>
            </div>
        </Box>
    </>);
}

export default TodoItem;