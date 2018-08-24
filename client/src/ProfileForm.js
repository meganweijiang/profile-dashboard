import React from 'react';
import PropTypes from 'prop-types';

const ProfileForm = props => (
  <form onSubmit={props.handleSubmit}>
    <input
      type="text"
      name="name"
      placeholder="Your Name"
      value={props.name}
      onChange={props.handleChangeText}
    />
    <input
      type="text"
      name="description"
      placeholder="Description"
      value={props.description}
      onChange={props.handleChangeText}
    />
    <input id="imageupload" type="file" onChange={props.fileSelectedHandler} accept="image/*"/>
    <button id="submitprofile" type="button" disabled={!props.selectedFile} onClick={props.fileUploadHandler}>Upload</button>
    <button type="submit">Submit</button>
  </form>
);

ProfileForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  handleChangeText: PropTypes.func.isRequired,
  fileSelectedHandler: PropTypes.func.isRequired,
  fileUploadHandler: PropTypes.func.isRequired,
  description: PropTypes.string,
  name: PropTypes.string,
  pictureURL: PropTypes.string,
  selectedFile: PropTypes.object
};

ProfileForm.defaultProps = {
  description: '',
  name: '',
  pictureURL: ''
};

export default ProfileForm;