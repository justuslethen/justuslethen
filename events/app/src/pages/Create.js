import Header from '../components/Header';
import SubeventCreate from '../components/SubeventCreate';
import React from 'react';

const Create = () => {
    const [eventData, setEventData] = React.useState({
        eventname: "",
        subevents: [
            {
                subeventname: "",
                startdate: "",
                enddate: "",
                columns: [
                    { columnname: "", columncontext: "" },
                ]
            },
        ]
    });

    document.title = "Events - Neues Event erstellen";

    const handleChange = (field, value) => {
        setEventData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubeventChange = (index, field, value) => {
        const updatedSubevents = [...eventData.subevents];
        updatedSubevents[index][field] = value;
        setEventData(prev => ({ ...prev, subevents: updatedSubevents }));
    };

    const handleColumnChange = (subeventIndex, columnIndex, field, value) => {
        const updatedSubevents = [...eventData.subevents];
        updatedSubevents[subeventIndex].columns[columnIndex][field] = value;
        setEventData(prev => ({ ...prev, subevents: updatedSubevents }));
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

                {eventData.subevents.map((subevent, index) => (
                    <SubeventCreate 
                    subevent={subevent}
                    index={index}
                    focus={true}
                    handleChange={handleChange}
                    handleSubeventChange={handleSubeventChange}
                    handleColumnChange={handleColumnChange}
                    />
                ))}
            </div>
        </>
    );
};

export default Create;