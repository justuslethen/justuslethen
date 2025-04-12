import React from 'react';
import SubeventColumnCreate from './SubeventColumnCreate';

const SubeventCreate = (props) => {
  console.log("subevent", props.subevent);

  return (
    <div key={props.index} className='subevent-box'>
      <div className='side-line'></div>
      <div className='subevent-inputs'>
        <div className='subevent-header'>
          <h3>Event {props.index + 1}</h3>
          <button className='icon-button-red'>
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="14" viewBox="0 0 12 14" fill="none">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M3.05688 3.25003L3.69713 12L8.80287 12L9.44312 3.25003L3.05688 3.25003ZM2.77025 13.4642C2.84266 13.4875 2.91987 13.5 3.00001 13.5H3.00632L9.49368 13.5C9.69717 13.5019 9.88464 13.4216 10.022 13.2885C10.0938 13.219 10.152 13.135 10.1916 13.0408C10.2234 12.9652 10.2432 12.8832 10.2485 12.7974L10.9471 3.25003H11.25C11.6642 3.25003 12 2.91424 12 2.50003C12 2.08581 11.6642 1.75003 11.25 1.75003H10.2563H10.2421H7.95732C7.98496 1.67183 8 1.58769 8 1.50003C8 1.08581 7.66421 0.750028 7.25 0.750028H5.25C4.83579 0.750028 4.5 1.08581 4.5 1.50003C4.5 1.58769 4.51504 1.67183 4.54268 1.75003H2.25788C2.25316 1.74998 2.24843 1.74998 2.24369 1.75003H1.25C0.835787 1.75003 0.5 2.08581 0.5 2.50003C0.5 2.91424 0.835787 3.25003 1.25 3.25003H1.55287L2.25163 12.7996C2.25642 12.8731 2.2718 12.9437 2.29624 13.0099C2.37618 13.2267 2.55264 13.3941 2.77025 13.4642Z" fill="#FF3737" />
            </svg>
          </button>
          <button className='icon-button-secondary'>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-chevron-right" style={{ transform: 'rotate(90deg)' }}>
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>
        <div className='subevent-body'>
          <input
            value={props.subevent.subeventname}
            onChange={(e) => props.handleSubeventChange(props.index, "subeventname", e.target.value)}
            placeholder="Subeventname"
          />

          <input
            type="datetime-local"
            value={props.subevent.startdate}
            onChange={(e) => props.handleSubeventChange(props.index, "startdate", e.target.value)}
          />

          <input
            type="datetime-local"
            value={props.subevent.enddate}
            onChange={(e) => props.handleSubeventChange(props.index, "enddate", e.target.value)}
          />

          <div className='columns-box'>
            <div className='side-line'></div>
            <div className='columns'>
              {props.subevent.columns.map((column, colIndex) => (
                <SubeventColumnCreate
                  column={column} colIndex={colIndex} index={props.index} focus={true} action={props.handleColumnChange}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
};

export default SubeventCreate;