import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import ProfileBox from './ProfileBox';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(React.createElement(ProfileBox, null), document.getElementById('root'));
registerServiceWorker();