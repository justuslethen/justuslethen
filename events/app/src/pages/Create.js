import Header from '../components/Header';
import SubeventCreate from '../components/SubeventCreate';
import Button from '../components/Button';
import React from 'react';

const Create = () => {
    const [eventData, setEventData] = React.useState({
        eventname: "",
        subevents: []
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

    const handleColumnChange = (subeventIndex, columnIndex, field, value) => {
        // create copy of subevents
        const updatedSubevents = [...eventData.subevents];

        // set the new value
        updatedSubevents[subeventIndex].columns[columnIndex][field] = value;

        // update the data to the new value
        setEventData(prev => ({ ...prev, subevents: updatedSubevents }));
    };

    const handleDeleteColumn = (subeventIndex, columnIndex) => {
         // create copy of subevents
        const updatedSubevents = [...eventData.subevents];

        // remove the column
        updatedSubevents[subeventIndex].columns.splice(columnIndex, 1);

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
        const newSubevent = {
            subeventname: "",
            startdate: "",
            enddate: "",
            columns: [
                { columnname: "", columncontext: "" },
            ],
        };
        setEventData(prev => ({ ...prev, subevents: [...prev.subevents, newSubevent] }));
    };

    const handleAddColumn = (subeventIndex) => {
        // create copy of subevents
        const updatedSubevents = [...eventData.subevents];

        // add the JSON pattern for a new column
        const newColumn = { columnname: "", columncontext: "" };
        updatedSubevents[subeventIndex].columns.push(newColumn); // add a new column
        setEventData(prev => ({ ...prev, subevents: updatedSubevents })); // save
    };

    return (
        <>
            <Header title="Neues Event erstellen" backButton={true} addButton={false} />

            <div className='content'>
                <h3>Event</h3>
                <input
                    value={eventData.eventname}
                    onChange={(e) => handleChange("eventname", e.target.value)}
                    placeholder="Name des Events"
                />


                <div className='subevent-box'>
                    <div className='side-line'></div>
                    <div className='subevents'>
                        {eventData.subevents.map((subevent, index) => (
                            <SubeventCreate
                                subevent={subevent}
                                index={index}
                                focus={true}
                                handleChange={handleChange}
                                handleSubeventChange={handleSubeventChange}
                                handleColumnChange={handleColumnChange}
                                handleDeleteColumn={handleDeleteColumn}
                                handleDeleteSubevent={handleDeleteSubevent}
                                handleAddColumn={handleAddColumn}
                                handleAddSubevent={handleAddSubevent}
                            />
                        ))}
                        <Button type='secondary' text='+ Event' onclick={() => { handleAddSubevent() }} />
                    </div>
                </div>

                <Button type='primary' text='Veranstaltung speichern' onclick={() => { console.log("hehe") }} />
            </div>
        </>
    );
};

export default Create;