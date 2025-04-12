import Header from '../components/Header';
import SubeventCreate from '../components/SubeventCreate';
import Button from '../components/Button';
import React from 'react';

const Create = () => {
    const [eventData, setEventData] = React.useState({
        eventname: "",
        subevents: []
    });
    const [focusedIndex, setFocuedIndex] = React.useState({
        subeventIndex: 0,
        rowIndex: 0,
    });

    document.title = "Events - Neues Event erstellen";

    const handleChange = (field, value) => {
        setEventData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubeventChange = (index, field, value) => {
        // create copy of subevents
        const updatedSubevents = [...eventData.subevents];

        // set the new value
        updatedSubevents[index][field] = value;

        // update the data to the new value
        setEventData(prev => ({ ...prev, subevents: updatedSubevents }));
    };

    const handleRowChange = (subeventIndex, rowIndex, field, value) => {
        // create copy of subevents
        const updatedSubevents = [...eventData.subevents];

        // set the new value
        updatedSubevents[subeventIndex].rows[rowIndex][field] = value;

        // update the data to the new value
        setEventData(prev => ({ ...prev, subevents: updatedSubevents }));
    };

    const handleDeleteRow = (subeventIndex, rowIndex) => {
        // create copy of subevents
        const updatedSubevents = [...eventData.subevents];

        // remove the row
        updatedSubevents[subeventIndex].rows.splice(rowIndex, 1);

        // set new data
        setEventData(prev => ({ ...prev, subevents: updatedSubevents }));
    };

    const handleDeleteSubevent = (index) => {
        // create copy of subevents
        const updatedSubevents = [...eventData.subevents];

        // remove the subevent
        updatedSubevents.splice(index, 1);

        // set new data
        setEventData(prev => ({ ...prev, subevents: updatedSubevents }));
    };

    const handleAddSubevent = () => {
        // JSON patern for a subevent
        const newSubevent = createSubeventJSONPattern();
        setEventData(prev => ({ ...prev, subevents: [...prev.subevents, newSubevent] }));
        setFocusedSubevent(eventData.subevents.length);
    };

    const createSubeventJSONPattern = () => {
        // create a JSON pattern and fill it with last used values

        const lastSubevent = eventData.subevents[eventData.subevents.length - 1] || {}; // last subevent in the list
        return {
            subeventname: "Neuer Programmpunkt",
            startdate: lastSubevent.enddate || "",
            enddate: lastSubevent.enddate || "",
            rows: [
                createRowJSONPattern(0)
            ],
        };
    }

    const createRowJSONPattern = (rowIndex) => {
        // create a JSON pattern and fill it with last used values

        // get the last subevent
        const lastRowName = getLastRowName(rowIndex);

        return { rowname: lastRowName || "", rowcontext: "" }
    }

    const getLastRowName = (rowIndex) => {
        // set the index to the last index to loop from the back
        let index = eventData.subevents.length - 1 || 0;
        let lastRowName = "";

        while (index >= 0) {
            const subEvent = eventData.subevents[index];
            if (subEvent && subEvent.rows.length > rowIndex) {
                if (subEvent.rows[rowIndex].rowname !== "") {
                    lastRowName = subEvent.rows[rowIndex].rowname || "";
                    break;
                }
            }
            index--;
        }

        return lastRowName;
    }

    const handleAddRow = (subeventIndex) => {
        // create copy of subevents
        const updatedSubevents = [...eventData.subevents];

        // get index of current row
        const index = eventData.subevents[subeventIndex].rows.length;

        // add the JSON pattern for a new row
        const newrow = createRowJSONPattern(index);
        updatedSubevents[subeventIndex].rows.push(newrow); // add a new row
        setEventData(prev => ({ ...prev, subevents: updatedSubevents })); // save

        setFocusedRow(eventData.subevents[focusedIndex.subeventIndex].rows.length - 1);
    };

    const setFocusedRow = (index) => {
        setFocuedIndex(prev => ({ ...prev, rowIndex: index }));
    };

    const setFocusedSubevent = (index) => {
        setFocuedIndex(prev => ({ ...prev, subeventIndex: index }));
    };

    return (
        <>
            <Header title="Neues Event erstellen" backButton={true} addButton={false} />

            <div className='content'>
                <h3>Veranstaltung</h3>
                <input
                    value={eventData.eventname}
                    onChange={(e) => handleChange("eventname", e.target.value)}
                    placeholder="Name der Veranstaltung"
                />


                <div className='subevent-box'>
                    <div className='side-line'></div>
                    <div className='subevents'>
                        {eventData.subevents.map((subevent, index) => (
                            <SubeventCreate
                                subevent={subevent}
                                index={index}
                                focus={index == focusedIndex.subeventIndex}
                                handleChange={handleChange}
                                handleSubeventChange={handleSubeventChange}
                                handleRowChange={handleRowChange}
                                handleDeleteRow={handleDeleteRow}
                                handleDeleteSubevent={handleDeleteSubevent}
                                handleAddRow={handleAddRow}
                                handleAddSubevent={handleAddSubevent}
                                setFocusedSubevent={setFocusedSubevent}
                                setFocusedRow={setFocusedRow}
                                focusedRowIndex={focusedIndex.rowIndex}
                            />
                        ))}
                        <Button type='secondary' text='+ Programmpunkt' onclick={() => { handleAddSubevent() }} />
                    </div>
                </div>

                <Button type='primary' text='Veranstaltung speichern' onclick={() => { console.log("hehe") }} />
            </div>
        </>
    );
};

export default Create;