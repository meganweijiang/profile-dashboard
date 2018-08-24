var _this = this;

import React from 'react';
import PropTypes from 'prop-types';

const ProfileForm = props => React.createElement(
  'form',
  { onSubmit: props.handleSubmit },
  React.createElement(
    'div',
    { ref: _this.myRef, id: 'textinput' },
    React.createElement(
      'h3',
      null,
      'Name'
    ),
    React.createElement('input', {
      required: true,
      type: 'text',
      name: 'name',
      placeholder: 'Your Name',
      value: props.name,
      onChange: props.handleChangeText
    }),
    React.createElement(
      'h3',
      null,
      'Description'
    ),
    React.createElement('input', {
      required: true,
      id: 'descinput',
      type: 'text',
      name: 'description',
      placeholder: 'Description',
      value: props.description,
      onChange: props.handleChangeText
    })
  ),
  React.createElement(
    'div',
    null,
    React.createElement(
      'h3',
      null,
      'Upload a profile picture'
    ),
    React.createElement('input', { required: true, id: 'imageupload', type: 'file', onChange: props.fileSelectedHandler, accept: 'image/*' }),
    React.createElement(
      'button',
      { type: 'button', disabled: !props.selectedFile, onClick: props.fileUploadHandler },
      'Upload'
    ),
    React.createElement(
      'h3',
      { id: 'hiddentext', hidden: props.pictureURL },
      'You must upload a photo to submit.'
    ),
    React.createElement(
      'h3',
      { id: 'hiddentext', hidden: !props.pictureURL },
      'Photo is uploaded! Please upload again if you added a new file.'
    ),
    React.createElement(
      'button',
      { id: 'submitprofile', type: 'submit' },
      'Submit'
    )
  )
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