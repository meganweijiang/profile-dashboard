import React from 'react';
import PropTypes from 'prop-types';
import Profile from './Profile';

const ProfileList = props => {
  const profileNodes = props.data.map(profile => React.createElement(Profile, { name: profile.name, pictureURL: profile.pictureURL, key: profile._id, id: profile._id, timestamp: profile.updatedAt, handleUpdateProfile: props.handleUpdateProfile, description: profile.description }));
  return React.createElement(
    'div',
    null,
    profileNodes
  );
};

ProfileList.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    id: PropTypes.string,
    description: PropTypes.string,
    pictureURL: PropTypes.string,
    updatedAt: PropTypes.string
  })),
  handleUpdateProfile: PropTypes.func.isRequired
};

ProfileList.defaultProps = {
  data: []
};

export default ProfileList;