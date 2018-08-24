import React, { Component } from 'react';
import FacebookLogin from 'react-facebook-login';

export default class Facebook extends Component {
	state = {
		isLoggedIn: false,
		name: '',
		picture: ''
	}

	responseFacebook = response => {
		this.setState({
			isLoggedIn: true,
			name: response.name,
			picture: response.picture.data.url
		});
	}

	componentClicked = () => console.log("clicked");

	render() {
		let fbContent;

		if (this.state.isLoggedIn) {
			fbContent = null;
		}
		else {
			fbContent = (<FacebookLogin
		    appId="2160983967308548"
		    autoLoad={true}
		    fields="name,email,picture"
		    onClick={this.componentClicked}
		    callback={this.responseFacebook} />);
		}

		return (
			<div>
				{ fbContent }
			</div>
		)
	}

}