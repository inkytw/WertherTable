import React, { useEffect, useState } from 'react';
import { Modal, Table, Row, Col } from 'antd';
import styled from 'styled-components';
import airFlow from '../assets/images/icon_wind.svg';
import rain from '../assets/images/icon_rain.svg';
import { WeatherImage } from '../component';
import { weatherForecast } from '../api/weatherAPI';

const ModalStyle = styled(Modal)`
    border-radius: 16px;
    background: #FFFFFF 0% 0% no-repeat padding-box;
    .ant-modal-content {
        border-radius: 16px 16px 0 0;
        box-shadow: none;
    }
`;

const TableStyle = styled(Table)`
    margin-top: 32px;
    .ant-table-wrapper {
        background-color: white;
    }

    /* table style*/
    thead tr th {
        font-weight: bold;
        color: #0079AF;
        background-color: #DCF2F8;

    }

    .ant-table th.ant-table-selection-column{
        width: 80px;
    }

    .ant-table-pagination {
        justify-content: center;
    }
`;

const TemperatureValue = styled.div`
    font-size: 112px;
    line-height: 1;
    position: relative;`
;

const TemperatureValueUnit = styled.span`
    font-size: 48px;
    position: absolute;
    top: 5px;
`;

const InfoValue = styled.div`
    padding: 15px 0;
`;

const InfoValueItem = styled.div`
    padding: 5px;
    font-size: 24px;
`;

const InfoValueItemSpan = styled.span`
    padding: 5px;
    padding-left: 31px;
`;

const WeatherModal = (props) => {

    const [tableList, setTebleList] = useState();
    const [weatherStatus, setWeatherStatus] = useState();
    const columns = [
        {
            title: '時段',
            dataIndex: 'period',
            key: 'period'
        },
        {
            title: '天氣狀況',
            dataIndex: 'wxName',
            key: 'wxName'
        },
        {
            title: '降雨機率',
            dataIndex: 'poP',
            key: 'poP',
            render: text => {
                return text + '%';
            }
        },
        {
            title: '最低溫',
            dataIndex: 'minT',
            key: 'minT'
        },
        {
            title: '最高溫',
            dataIndex: 'maxT',
            key: 'maxT'
        },
        {
            title: '天氣描述',
            dataIndex: 'ci',
            key: 'ci'
        }
    ];

    const getForeCast = async () => {
        try {
            const response = await weatherForecast(props.data?.city);
            if (response.status === 200) {
                let periodData = [];
                const location = response.data.records.location[0];

                if (location.weatherElement.length) {
                    const firstElement = location.weatherElement[0];

                    periodData.push({
                        startTime: firstElement.time[0].startTime,
                        endTime: firstElement.time[0].endTime
                    });
                    periodData.push({
                        startTime: firstElement.time[1].startTime,
                        endTime: firstElement.time[1].endTime
                    });
                    periodData.push({
                        startTime: firstElement.time[2].startTime,
                        endTime: firstElement.time[2].endTime
                    });
                }

                const wx = location.weatherElement.find(data => data.elementName === 'Wx');
                const poP = location.weatherElement.find(data => data.elementName === 'PoP');
                const minT = location.weatherElement.find(data => data.elementName === 'MinT');
                const maxT = location.weatherElement.find(data => data.elementName === 'MaxT');
                const ci = location.weatherElement.find(data => data.elementName === 'CI');


                periodData.forEach((item, index) => {
                    item.period = getPeriod(item.startTime);
                    item.wxName = wx.time[index].parameter.parameterName;
                    item.wxValue = wx.time[index].parameter.parameterValue;
                    item.poP = poP.time[index].parameter.parameterName;
                    item.minT = minT.time[index].parameter.parameterName;
                    item.maxT = maxT.time[index].parameter.parameterName;
                    item.ci = ci.time[index].parameter.parameterName;
                });

                setTebleList(periodData);
                setWeatherStatus(periodData[0]?.wxValue);

            }
        } catch (error) {
            console.log(error);
        }
    };

    // Waitting for modify, should have efficient sulotion
    const getPeriod = (_startTime) => {

        const startTime = new Date(_startTime);

        const year = new Date().getFullYear();
        const month = new Date().getMonth();
        const date = new Date().getDate();

        const todayDayStartTime = new Date(year, month, date, 6);
        const todayNightStartTime = new Date(year, month, date, 18);
        const tomorrowDayStartTime = new Date(year, month, date + 1, 6);
        const tomorrowNightStartTime = new Date(year, month, date + 1, 18);

        if (startTime.toString() === todayDayStartTime.toString()) {
            return '今天白天';
        } else if (startTime.toString() === todayNightStartTime.toString()) {
            return '今天晚上';
        } else if (startTime.toString() === tomorrowDayStartTime.toString()) {
            return '明天白天';
        } else if (startTime.toString() === tomorrowNightStartTime.toString()) {
            return '明天晚上';
        } else {
            if (startTime < todayDayStartTime) {
                return '今天深夜';
            } else if (todayDayStartTime <= startTime && startTime <= todayNightStartTime) {
                return '今天白天';
            } else if (todayNightStartTime <= startTime && startTime <= tomorrowDayStartTime) {
                return '今天晚上';
            } else if (tomorrowDayStartTime <= startTime && startTime <= tomorrowNightStartTime) {
                return '明天白天';
            } else if (tomorrowNightStartTime <= startTime) {
                return '明天晚上';
            }
        }
    };

    useEffect(() => {
        getForeCast();
    }, [props.data.area]);

    return (
        <ModalStyle
            visible={props.visible}
            onCancel={props.onCancel}
            footer={null}
            width={660}
        >
            <Row>
                <Col span={14}>
                    <h1>{`${props.data?.city} ${props.data?.area}`}</h1>
                    <h3>{props.data?.weather}</h3>
                    {/* === '無資料' ? wxName : record.Weather} */}
                    <Row>
                        <Col span={12}>
                            {props.data?.temperature === '無資料' ?
                                '無溫度資料' :
                                (
                                    <TemperatureValue>
                                        {props.data?.temperature}
                                        <TemperatureValueUnit>&deg;C</TemperatureValueUnit>
                                    </TemperatureValue>
                                )
                            }
                        </Col>
                        <Col span={12}>
                            <InfoValue>
                                <InfoValueItem className='modal-info-item'>
                                    <img alt='' src={airFlow} />
                                    <InfoValueItemSpan>{props.data?.windspeed === '無資料' ? '無資料' : (props.data?.windspeed + ' m/h')}</InfoValueItemSpan>
                                </InfoValueItem>
                                <InfoValueItem>
                                    <img  alt='' src={rain} />
                                    <InfoValueItemSpan>{tableList ? tableList[0]?.poP + '%' : '無資料'}</InfoValueItemSpan>
                                </InfoValueItem>
                            </InfoValue>
                        </Col>
                    </Row>
                </Col>
                <Col span={10}>
                    <WeatherImage
                        wxValue = {weatherStatus}
                    />
                </Col>
            </Row>
            <TableStyle
                rowKey={record => record.startTime}
                columns={columns}
                pagination={false}
                dataSource={tableList}
            />
        </ModalStyle>
    );
};

export default WeatherModal;