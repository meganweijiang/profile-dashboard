import React, { Component } from 'react';
import FacebookLogin from 'react-facebook-login';
import PropTypes from 'prop-types';

const Facebook = props => (
	<div>
		<FacebookLogin
	    appId="2160983967308548"
	    autoLoad={true}
	    fields="name,email,picture"
	    textButton="Get name and picture from Facebook"
	    callback={props.handleFacebookLogin} />
    </div>
);

Facebook.propTypes = {
  name: PropTypes.string.isRequired,
  pictureURL: PropTypes.string.isRequired,
  loggedIn: PropTypes.string.isRequired,
  handleFacebookLogin: PropTypes.func.isRequired
};

Facebook.defaultProps = {
  name: '',
  pictureURL: '',
  loggedIn: false
};

export default Facebook;