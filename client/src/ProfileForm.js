import React from 'react';
import PropTypes from 'prop-types';

const ProfileForm = props => (
  <form onSubmit={props.submitProfile}>
    <input
      type="text"
      name="name"
      placeholder="Your name…"
      value={props.name}
      onChange={props.handleChangeText}
    />
    <input
      type="text"
      name="description"
      placeholder="Say something..."
      value={props.description}
      onChange={props.handleChangeText}
    />
    <button type="submit">Submit</button>
  </form>
);

ProfileForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  handleChangeText: PropTypes.func.isRequired,
  description: PropTypes.string,
  name: PropTypes.string,
};

ProfileForm.defaultProps = {
  description: '',
  name: '',
};

export default ProfileForm;