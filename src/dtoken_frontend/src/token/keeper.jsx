import React, {useState} from 'react';
import '../../assets/Keeper.css';
import Counter from "../util/counter";
import Zoom from '@mui/material/Zoom';
import Fab from '@mui/material/Fab';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import AddIcon from '@mui/icons-material/Add';

let counter = new Counter();
let defaultNote = {
    id: 0,
    title: "",
    content: ""
};

/**
 * @param {object} props
 * @return {JSX.Element}
 * @constructor
 */
export default function KeeperNote(props) {
    /**
     * @param {object} event
     */
    function deleteNote(event) {
        event.preventDefault();
        props.onDelete(props.id);
    }

    return (
        <div className="note">
            <h1>{props.title}</h1>
            <p>{props.content}</p>
            <button onClick={deleteNote}>
                <Zoom in={true}>
                    <DeleteForeverIcon />
                </Zoom>
            </button>
        </div>
    );
}

/**
 * @param {object} props
 * @return {JSX.Element}
 * @constructor
 */
export function CreateNote(props) {
    const [isExpanded, setExpanded] = useState(false);
    const [note, setNote] = useState(defaultNote);

    /**
     * @param {object} event
     */
    function expandInput(event) {
        setExpanded(true);
    }

    /**
     * @param {object} event
     */
    function handleChange(event) {
        const {name: fieldName, value: changedVal} = event.target;

        setNote(prevState => {
            return {
                ...prevState,
                [fieldName]: changedVal
            }
        });
    }

    /**
     * @param {object} event
     */
    function addNote(event) {
        event.preventDefault();

        if (note.title.length <= 0) {
            return;
        }

        if (note.content.length <= 0) {
            return;
        }

        let nextID = counter.increment().count;
        // console.log("NextID: %d", nextID);
        setNote((prevState) => ({...prevState, id: nextID}));
        props.onAdd(note, nextID, () => {
            clearNote();
        });
    }

    function clearNote() {
        // Why "id" value gets reset if we reset note below.
        // @see: https://beta.reactjs.org/apis/react/useState#ive-updated-the-state-but-logging-gives-me-the-old-value
        // Basically, the state only changes on the next render. The current event handler retains the current state.
        // console.log("Clearing note");
        setNote(defaultNote);
    }

    return (
        <div className="create-note">
            <form>
                { isExpanded && <input onChange={handleChange} name="title" placeholder="Title" value={note.title} /> }

                <textarea onClick={expandInput} onChange={handleChange} name="content" placeholder="Take a note..." value={note.content} rows={isExpanded ? 3 : 1} />
                {/*<button onClick={addNote}><AddIcon /></button>*/}
                <Zoom in={isExpanded}>
                    <Fab onClick={addNote} color="primary" aria-label="add">
                        <AddIcon />
                    </Fab>
                </Zoom>
            </form>
        </div>
    );
}
