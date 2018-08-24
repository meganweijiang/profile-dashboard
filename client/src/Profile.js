import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

const Profile = props => (
  <div className="singleProfile">
    <div className="textContent">
      <div className="singleProfileContent">
        <img id="profilepic" src={props.pictureURL} alt="Profile Picture"></img>
        <h3>{props.name}</h3>
        <p id="desc">{props.description}</p>
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
  description: PropTypes.string.isRequired,
  pictureURL: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  handleUpdateProfile: PropTypes.func.isRequired,
  timestamp: PropTypes.string.isRequired,
};

export default Profile;