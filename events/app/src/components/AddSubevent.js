import React from 'react';
import SubeventRowCreate from './SubeventRowCreate';
import IconButton from './IconButton';
import Button from './Button';

const AddSubevent = (props) => {
    const [subEventData, setSubEventData] = React.useState({
        subeventname: '',
        startdate: '',
        enddate: '',
        rows: []
    });
    const [focusedIndex, setFocusedIndex] = React.useState({
        rowIndex: -1,
    });
    const domain = "http://127.0.0.1:4000";

    const handleSubeventChange = (field, value) => {
        setSubEventData(prev => ({ ...prev, [field]: value }));
    };

    const handleRowChange = (rowIndex, field, value) => {
        // get changes in "value" and store them at the given place "field", "rowIndex"
        const updatedRows = [...subEventData.rows];
        updatedRows[rowIndex][field] = value;
        setSubEventData(prev => ({ ...prev, rows: updatedRows }));
    };

    const handleAddRow = () => {
        // add the patern for a new, empty row to the subevent
        setSubEventData(prev => ({
            ...prev, rows: [...prev.rows, {
                rowname: '',
                rowcontext: ''
            }]
        }));
    };

    const handleDeleteRow = (rowIndex) => {
        // create a copy of the rows
        const updatedRows = [...subEventData.rows];

        // remove the specific row
        updatedRows.splice(rowIndex, 1);

        // update the state
        setSubEventData(prev => ({ ...prev, rows: updatedRows }));
    };

    const setFocusedRow = (index) => {
        // when focused row is clicked hide it
        if (index == focusedIndex.rowIndex) {
            index = -1; // unfocus all
        }
        setFocusedIndex(prev => ({ ...prev, rowIndex: index }));
    };

    const addSubevent = () => {
        // fetch the API
        fetch(`${domain}/data/create/sub-event/${props.eventid}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', },
            body: JSON.stringify(subEventData),
        })
            .then((response) => response.json())
            .then((data) => {
                // returns the new id at data.eventid
                // open the created event
                console.log(data);

                // returns a string in error if user has no access
                if (!data.error) {
                    // do the refresh function if everithing went well
                    // function like getDataFromAPI
                    props.refresh();
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    return (
        <div className='subevent-inputs'>

            {/* header */}
            <div className='subevent-header'>
                <h3>Programmpunkt hinzufügen</h3>
            </div>

            <div className='subevent-body'>
                <input
                    value={subEventData.subeventname}
                    onChange={(e) => handleSubeventChange("subeventname", e.target.value)}
                    placeholder="subeventname"
                />

                <h4>Startzeit</h4>
                <input
                    type="datetime-local"
                    value={subEventData.startdate}
                    onChange={(e) => handleSubeventChange("startdate", e.target.value)}
                />

                <h4>Endzeit</h4>
                <input
                    type="datetime-local"
                    value={subEventData.enddate}
                    onChange={(e) => handleSubeventChange("enddate", e.target.value)}
                />

                <div className='rows-box'>
                    <div className='side-line'></div>
                    <div className='rows'>
                        {subEventData.rows.map((row, rowIndex) => (
                            <SubeventRowCreate
                                row={row}
                                rowindex={rowIndex}
                                action={handleRowChange}
                                focus={focusedIndex.rowIndex == rowIndex}
                                handleDeleterow={() => handleDeleteRow(rowIndex)}
                                setFocusedRow={setFocusedRow}
                            />
                        ))}
                        <Button type='secondary' text='+ Reihe' onclick={handleAddRow} />
                    </div>
                </div>
                <Button type='primary' text='Hinzufügen' onclick={addSubevent} />
            </div>
        </div>
    )
};

export default AddSubevent;