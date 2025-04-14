import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import ListElement from '../components/ListElement';

const Home = () => {
  const navigate = useNavigate();
  const domain = "http://127.0.0.1:4000";

  const [events, setEvents] = React.useState([]);

  document.title = "Events";

  useEffect(() => {
    // fetch event list from api
    fetch(`${domain}/data/get/event-list`)
      .then(res => res.json())
      .then(setEvents) // set events to fetched data
      .catch(console.error);
  }, []);

  const handleClick = (eventId) => {
    navigate(`/event/${eventId}`);  // navigate to the event page
  };

  return (
    <>
      <Header
        title="Alle Events" editButton={false} backButton={false} addButton={true} addAction="/create"
      />
      <div className='content'>
        <div className='list'>
          {events.map((eventItem, index) => (
            <ListElement
              key={index}
              name={eventItem.name}
              startDate={eventItem.startdate}
              endDate={eventItem.enddate}
              onClick={() => handleClick(eventItem.eventid)}  // add click handler
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default Home;