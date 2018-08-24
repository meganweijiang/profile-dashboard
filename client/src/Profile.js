import React from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';
import moment from 'moment';

const Profile = props => (
  <div className="singleProfile">
    <div className="textContent">
      <div className="singleProfileContent">
        <img src={props.pictureURL} alt="Profile Picture"></img>
        <h3>{props.name}</h3>
        <ReactMarkdown source={props.children} />
      </div>
      <div className="singleProfileButtons">
        <span className="time">updated {moment(props.timestamp).fromNow()}</span>
        <a onClick={() => { props.handleUpdateProfile(props.id); }}>update</a>
      </div>
    </div>
  </div>
);

Profile.propTypes = {
  name: PropTypes.string.isRequired,
  children: PropTypes.string.isRequired,
  pictureURL: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  handleUpdateProfile: PropTypes.func.isRequired,
  timestamp: PropTypes.string.isRequired,
};

export default Profile;