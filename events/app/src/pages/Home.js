import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import ListElement from '../components/ListElement';

const Home = () => {
  document.title = "Events";

  const navigate = useNavigate();

  const events = [
    { eventname: "Event 1", startdate: "2025-04-20", enddate: "2025-04-27", eventId: 1 },
    { eventname: "Event 2", startdate: "2025-05-01", enddate: "2025-05-05", eventId: 2 },
    { eventname: "Event 3", startdate: "2025-06-10", enddate: "2025-06-15", eventId: 3 },
    { eventname: "Event 4", startdate: "2025-07-01", enddate: "2025-07-07", eventId: 4 },
    { eventname: "Event 5", startdate: "2025-08-05", enddate: "2025-08-12", eventId: 5 },
    { eventname: "Event 6", startdate: "2025-09-15", enddate: "2025-09-20", eventId: 6 }
  ];

  const handleClick = (eventId) => {
    navigate(`/event/${eventId}`);  // navigate to the event page
  };

  return (
    <>
      <Header
        title="Alle Events" backButton={false} addButton={true} addAction="/create"
      />
      <div className='content'>
        <div className='list'>
          {events.map((eventItem, index) => (
            <ListElement
              key={index}
              name={eventItem.eventname}
              startDate={eventItem.startdate}
              endDate={eventItem.enddate}
              onClick={() => handleClick(eventItem.eventId)}  // add click handler
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default Home;