import React from 'react';
import styled from 'styled-components';
import dayClear from '../assets/images/day-clear.svg';
import dayCloudy from '../assets/images/day-cloudy.svg';
import dayCloudyFog from '../assets/images/day-cloudy-fog.svg';
import dayFog from '../assets/images/day-fog.svg';
import dayPartiallyClearWithRain from '../assets/images/day-partially-clear-with-rain.svg';
import daySnowing from '../assets/images/day-snowing.svg';
import dayThunderstorm from '../assets/images/day-thunderstorm.svg';

// import nightClear from '../assets/images/night-clear.svg';
// import nightCloudy from '../assets/images/night-cloudy.svg';
// import nightCloudyFog from '../assets/images/night-cloudy-fog.svg';
// import nightFog from '../assets/images/night-fog.svg';
// import nightPartiallyClearWithRain from '../assets/images/night-partially-clear-with-rain.svg';
// import nightSnowing from '../assets/images/night-snowing.svg';
// import nightThunderstorm from '../assets/images/night-thunderstorm.svg';

import {
    CLEAR_CODES,
    CLOUDY_CODES,
    CLOUDY_FOG_CODES,
    FOG_CODES,
    PARTIALLY_CLEAR_WITH_RAIN_CODES,
    SNOWING_CODES,
    THUNDERSTORM_CODES
} from '../enum/weatherCodes';

const ImageBlock = styled.div`
    padding-top: 20px;
    padding-left: 30px;
`;

const Img = styled.img`
    height: 220px;
    width: 200px;
`;

export const WeatherImage = (props) => {
    const wxCode = Number(props.wxValue);

    // if (isDay) {
    // *** PUT here ***
    // }
    // else {
    //     if (CLEAR_CODES.includes(wxCode))
    //         imgSrc = nightClear;
    //     else if (CLOUDY_CODES.includes(wxCode))
    //         imgSrc = nightCloudy;
    //     else if (CLOUDY_FOG_CODES.includes(wxCode))
    //         imgSrc = nightCloudyFog;
    //     else if (FOG_CODES.includes(wxCode))
    //         imgSrc = nightFog;
    //     else if (PARTIALLY_CLEAR_WITH_RAIN_CODES.includes(wxCode))
    //         imgSrc = nightPartiallyClearWithRain;
    //     else if (SNOWING_CODES.includes(wxCode))
    //         imgSrc = nightSnowing;
    //     else if (THUNDERSTORM_CODES.includes(wxCode))
    //         imgSrc = nightThunderstorm;
    // }

    const getWeatherStatus = () => {

        if (CLEAR_CODES.includes(wxCode)) { return dayClear; }
        if (CLOUDY_CODES.includes(wxCode)) { return dayCloudy; }
        if (CLOUDY_FOG_CODES.includes(wxCode)) { return dayCloudyFog; }
        if (FOG_CODES.includes(wxCode)) { return dayFog; }
        if (PARTIALLY_CLEAR_WITH_RAIN_CODES.includes(wxCode)) { return dayPartiallyClearWithRain; }
        if (SNOWING_CODES.includes(wxCode)) { return daySnowing;}
        if (THUNDERSTORM_CODES.includes(wxCode)) { return dayThunderstorm; }

        return dayClear;
    };

    let imgSrc = getWeatherStatus();

    return (
        <ImageBlock>
            <Img alt='' src={imgSrc} />
        </ImageBlock>
    );
};


export default WeatherImage;
