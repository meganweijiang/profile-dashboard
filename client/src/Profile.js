import React from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';
import moment from 'moment';

const Profile = props => (
  <div className="singleProfile">
    <img alt="user_image" className="userImage" src={`https://picsum.photos/70?random=${props.id}`} />
    <div className="textContent">
      <div className="singleProfileContent">
        <h3>{props.name}</h3>
        <ReactMarkdown source={props.children} />
      </div>
      <div className="singleProfileButtons">
        <span className="time">{moment(props.timestamp).fromNow()}</span>
        <a onClick={() => { props.handleUpdateProfile(props.id); }}>update</a>
      </div>
    </div>
  </div>
);

Profile.propTypes = {
  name: PropTypes.string.isRequired,
  children: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  handleUpdateProfile: PropTypes.func.isRequired,
  timestamp: PropTypes.string.isRequired,
};

export default Profile;