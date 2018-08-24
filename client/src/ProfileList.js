import React from 'react';
import PropTypes from 'prop-types';
import Profile from './Profile';

const ProfileList = (props) => {
  const profileNodes = props.data.map(profile => (
    <Profile name={ profile.name } key={ profile._id } id={ profile._id } timestamp={profile.updatedAt} handleUpdateProfile={props.handleUpdateProfile} >
      { profile.description }
    </Profile>
  ));
  return (
    <div>
      { profileNodes }
    </div>
  );
};

ProfileList.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    id: PropTypes.string,
    description: PropTypes.string,
    updatedAt: PropTypes.string,
  })),
  handleUpdateProfile: PropTypes.func.isRequired,
};

ProfileList.defaultProps = {
  data: [],
};

export default ProfileList;