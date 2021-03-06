import React from 'react';
import PropTypes from 'prop-types';

const ProfileForm = props => (
  <div id="formcontainer">
    <form onSubmit={props.handleSubmit}>
      <div ref={this.myRef} id="textinput">
        <h3>Name</h3>
        <input
          required
          type="text"
          name="name"
          placeholder="Your Name"
          value={props.name}
          onChange={props.handleChangeText}
        />
        <h3>Description</h3>
          <textarea
            required
            id="descinput"
            type="text"
            name="description"
            placeholder="Description"
            value={props.description}
            onChange={props.handleChangeText}
          />
      </div>
      <div>
        <h3>Upload a profile picture</h3>
        <input id="imageupload" type="file" onChange={props.fileSelectedHandler} accept="image/*"/>
        <button type="button" disabled={!props.selectedFile} onClick={props.fileUploadHandler}>Upload</button>
        <h3 id="hiddentext" hidden={!props.pictureURL}>Photo is uploaded! Please upload again if you added a new file.</h3>
        <div id="picpreviewcontainer"><img id="picpreview" src={props.pictureURL} alt=""></img></div>
      <button id="submitprofile" disabled={!props.name || !props.description || !props.pictureURL} type="submit">Submit</button>
      </div>
    </form>
  </div>
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
  pictureURL: '',
};

export default ProfileForm;