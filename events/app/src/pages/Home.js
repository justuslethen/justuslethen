import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import ListElement from '../components/ListElement';

const Home = () => {
  const navigate = useNavigate();

  const events = [
    { eventname: "Event 1", startdate: "2025-04-20", enddate: "2025-04-27" },
    { eventname: "Event 2", startdate: "2025-05-01", enddate: "2025-05-05" },
    { eventname: "Event 3", startdate: "2025-06-10", enddate: "2025-06-15" },
    { eventname: "Event 4", startdate: "2025-07-01", enddate: "2025-07-07" },
    { eventname: "Event 5", startdate: "2025-08-05", enddate: "2025-08-12" },
    { eventname: "Event 6", startdate: "2025-09-15", enddate: "2025-09-20" }
  ];

  const handleClick = (eventname) => {
    navigate(`/event`);  // Navigate to the event page
  };

  return (
    <>
      <Header
        title="Alle Events"
        backButton={false}
        data=""
      />
      <div className='content'>
        <div className='list'>
          {events.map((eventItem, index) => (
            <ListElement
              key={index}
              name={eventItem.eventname}
              startDate={eventItem.startdate}
              endDate={eventItem.enddate}
              onClick={() => handleClick(eventItem.eventname)}  // Add click handler
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default Home;