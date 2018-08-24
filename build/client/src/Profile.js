import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

const Profile = props => React.createElement(
  'div',
  { className: 'singleProfile' },
  React.createElement(
    'div',
    { className: 'textContent' },
    React.createElement(
      'div',
      { className: 'singleProfileContent' },
      React.createElement('img', { id: 'profilepic', src: props.pictureURL, alt: 'Profile Picture' }),
      React.createElement(
        'h3',
        null,
        props.name
      ),
      React.createElement(
        'p',
        { id: 'desc' },
        props.description
      )
    ),
    React.createElement(
      'div',
      { className: 'singleProfileButtons' },
      React.createElement(
        'span',
        { className: 'time' },
        'updated ',
        moment(props.timestamp).fromNow()
      ),
      React.createElement(
        'a',
        { onClick: () => {
            props.handleUpdateProfile(props.id);
          } },
        'update'
      )
    )
  )
);

Profile.propTypes = {
  name: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  pictureURL: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  handleUpdateProfile: PropTypes.func.isRequired,
  timestamp: PropTypes.string.isRequired
};

export default Profile;