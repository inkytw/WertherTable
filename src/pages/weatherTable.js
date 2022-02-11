/* eslint-disable array-callback-return */
import React, { useState, useEffect } from 'react';
import { Button, Table, Tooltip } from 'antd';
import { ExportOutlined, ReloadOutlined, ProfileTwoTone } from '@ant-design/icons';
import { weatherNow } from '../api/weatherAPI';
import { CSVLink } from 'react-csv';
import { WeatherModal } from '.';

import styled from 'styled-components';

const Container = styled.div`
	background-color: #E1F2F8;
	width: 100%;
	height: 100vh;
	display: flex;
	justify-content: center;
	align-items: center;
`;

const TableContainer = styled.div`
	background-color: #FFFFFF;
	width: 66%;
	height: 95vh;
	border-radius: 16px;
`;

const Header = styled.div`
	width: 100%;
	height: 10vh;
	margin-top: 10px;
	display: inline-flex;
	justify-content: space-between;
	align-items: center;
`;

const Title = styled.p`
	text-align: left;
	font: 32px Helvetica Neue;
	letter-spacing: 0px;
	color: #0079AF;
	opacity: 1;	
	padding-left: 40px;
    margin: 0;
    /* font-weight: bold; */
`;

const ButtonGroup = styled.div`
	width: 300px;
	display: inline-flex;
	padding-right: 32px ;
`;

const TableStyle = styled(Table)`
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

const WeatherTable = () => {

    const [weatherNowData, setWertherNowData] = useState();
    const [csvList, setCsvList] = useState([]);   // 下載csv的內容
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [dataToModal, setDataToModal] = useState();

    const rowSelection = {
        type: 'checkbox',
        onChange: (_, selectedRows) => {
            if (selectedRows) {
                setCsvList(selectedRows);
            } else {
                setCsvList(JSON.parse(JSON.stringify(weatherNowData)));
            }
        }
        // renderCell: (checked, record, index, originNode) => {
        //     return (
        //         <Tooltip title='輸出該筆資料至 csv'>
        //             {originNode}
        //         </Tooltip>
        //     );
        // }
    };

    const getWertherNow = async() => {
        try {
            const response = await weatherNow();
            let dataToSetWeather = [];
            if (response.status === 200) {
                response.data.records.location.map(report => {
                    dataToSetWeather.push({
                        key: report.stationId,
                        city: report.parameter?.find(id => id.parameterName === 'CITY')?.parameterValue,
                        area: report.parameter?.find(id => id.parameterName === 'TOWN')?.parameterValue,
                        time: report.time.obsTime,
                        weather: infoValueParser(report.weatherElement?.find(id => id.elementName === 'Weather')?.elementValue),
                        temperature: tempValueParser(report.weatherElement?.find(id => id.elementName === 'TEMP')?.elementValue),
                        windspeed: infoValueParser(report.weatherElement?.find(id => id.elementName === 'WDSD')?.elementValue)
                    });
                });
                setWertherNowData(dataToSetWeather);
                setCsvList(dataToSetWeather);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const infoValueParser = (value) => {
        return value === '-99' ? '無資料' : value;
    };

    const tempValueParser = (value) => {
        return value === '-99' ? '無資料' : Math.round(value);
    };

    const openModal = (record) => {
        setIsModalVisible(true);
        setDataToModal(record);
    };

    const closeModal = () => {
        setIsModalVisible(false);
    };

    const columns = [
        {
            width: '1%'
        },
        {
            title: '縣市',
            dataIndex: 'city',
            key: 'city',
            filters: [...new Set(weatherNowData?.map((i) => i.city))].map((i) => ({ text: i, value: i })),
            onFilter: (value, record) => record.city === value
        },
        {
            title: '地區',
            dataIndex: 'area',
            key: 'area'
        },
        {
            title: '觀測時間',
            dataIndex: 'time',
            key: 'time',
            sorter: (a, b) => a.time - b.time,  //時間排序
            sortDirections: ['ascend', 'descend']
        },
        {
            title: '天氣',
            dataIndex: 'weather',
            key: 'weather'
        },
        {
            title: '溫度',
            dataIndex: 'temperature',
            key: 'temperature',
            sorter: (recordA, recordB) => {
                const tempA = recordA.temperature === '無資料' ? -1 : recordA.temperature;
                const tempB = recordB.temperature === '無資料' ? -1 : recordB.temperature;
                return tempA - tempB;
            }
        },
        {
            title: '風速',
            dataIndex: 'windspeed',
            key: 'windspeed',
            render: (text, _) => text === '無資料' ? '無資料' : (text + 'm/h')
        },
        {
            render: (_, record) => {
                return (
                    <Tooltip title='更多資訊'>
                        <Button type='text'
                            // loading={gettingModalData}
                            icon={<ProfileTwoTone />}
                            onClick={() => openModal(record)}
                        >
                        </Button>
                    </Tooltip>
                );
            }
        }
    ];

    useEffect(() => {
        getWertherNow();
    }, []);

    return (
        <Container>
            <TableContainer>
                <Header>
                    <Title>即時天氣</Title>
                    <ButtonGroup>
                        <CSVLink
                            data={csvList}
                            filename={'my-weather-reports.csv'}
                            target="_blank">
                            <Button type='primary' shape='round' icon={<ExportOutlined />} size={'large'} style={{background: '#67C6F0', border: 'none', marginRight: '20px'}}>  Export</Button>
                        </CSVLink>
                        <Button
                            type='primary'
                            shape='round'
                            icon={<ReloadOutlined />}
                            size={'large'}
                            onClick={() => {
                                getWertherNow();
                            }}
                            style={{background: '#67C6F0', border: 'none'}}
                        >  Refresh</Button>
                    </ButtonGroup>
                </Header>
                <TableStyle
                    rowSelection={rowSelection}
                    columns={columns}
                    dataSource={weatherNowData}
                    rowKey='key'
                />
            </TableContainer>
            {/* <Modal
                visible={isModalVisible}
                onCancel={closeModal}
            /> */}
            {dataToModal &&
            <WeatherModal
                visible={isModalVisible}
                onCancel={closeModal}
                data={dataToModal}
            />}
        </Container>
    );
};

export default WeatherTable;
