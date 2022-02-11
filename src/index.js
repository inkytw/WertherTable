import React from 'react';
import ReactDOM from 'react-dom';
// import './reset.css';
import './index.css';
import 'antd/dist/antd.css';
import { WeatherTable } from './pages';

ReactDOM.render(
    <React.StrictMode>
        <WeatherTable />
    </React.StrictMode>,
    document.getElementById('root')
);