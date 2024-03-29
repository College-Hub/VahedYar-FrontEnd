﻿import './weeklyView.css';

import { useEffect, useState, Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { modalActions } from "../../Store/modal-slice";
import { uiActions } from '../../Store/ui-slice';
import { timeTableActions } from '../../Store/timeTable-slice';
import { courseActions } from "../../Store/course-slice";
import { useNavigate } from "react-router-dom";
import { authActions } from '../../Store/auth-slice';

import LoadSpiner from '../Animations/loadSpiner';

import Modal from 'react-bootstrap/Modal';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { randomColor, toPersianNumber } from '../../feratures/helper/helper';

const WeeklyView = () => {
    //state
    const { content, data } = useSelector(state => state.modal);
    const { days } = useSelector(state => state.course);
    const { isloading } = useSelector(state => state.ui);
    const [showDetail, setShowDetail] = useState(null);
    const [presentations, setPresentations] = useState(null);

    //hooks
    const dispatch = useDispatch();

    //event handler 
    const closeHandler = () => {
        dispatch(modalActions.hideModal());
    };

    //event handler 
    const showPresentationDetailHanlder = (event) => {
        let id = event.target.getAttribute("id")
        let t = data.find(p => p.presentationId === id);
        setShowDetail(t);
        
    };
    const closeDetailHandler = () => {
        setShowDetail(null);
    };
    //function
    const getPresentationInfo = (id) => {
        return data.find(p => p.presentationId === id);
    };
    const renderPresentationPerTime = (dayId) => {
        let pPerday = data.filter(p => p.dayTimes[0].dayOfWeek == dayId);
        if (pPerday) {
            // index --> 0: start pos / 1: width / 2: ppresentation
            let positions = [];
            for (let presentation of pPerday) {
                let startTime = presentation.dayTimes[0].startTime + '';
                let endTime = presentation.dayTimes[0].endTime + '';
                let SH, SM, EH, EM;
                let startT = startTime.padStart(4, "0");
                let endT = endTime.padStart(4, "0");

                SH = startT[0] + startT[1];
                SM = startT[2] + startT[3];

                EH = endT[0] + endT[1];
                EM = endT[2] + endT[3];

                let SHConvert = parseInt(SH) - 6;
                let SMConvert = parseFloat(SM) / 60;
                let EHConvert = parseInt(EH) - 6;
                let EMConvert = parseFloat(EM) / 60;

                let startPos = ((SHConvert + SMConvert) * 100) / 17;
                let endPos = ((EHConvert + EMConvert) * 100) / 17;
                let W = endPos - startPos;
                let pId = presentation.presentationId;
                positions.push([startPos, W, pId]);
            }
            return (positions.map(pos =>
                <Fragment>
                <OverlayTrigger
                    key={dayId + "GF"}
                    placement="top"
                    delay={{ show: 250, hide: 400 }}
                    containerPadding={20}
                    overlay={
                        <Tooltip id="custom-tooltip">
                            {
                                <Fragment>
                                    <span dir="ltr">{toPersianNumber(getPresentationInfo(pos[2]).ConvertDayTime[0].startTime)}</span><span> تا </span><span dir="ltr">{toPersianNumber(getPresentationInfo(pos[2]).ConvertDayTime[0].endTime)}</span>
                                    <br/>
                                    <span>{getPresentationInfo(pos[2]).instructorName}</span>
                                </Fragment>
                            }
                        </Tooltip>
                    }
                >
                        <div key={dayId + 'A'} className=" timeZonRow-child" style={{ position: "absolute", right: `${pos[0]}%`, width: `${pos[1]}%`, backgroundColor: `${randomColor()}` }} id={pos[2]} onClick={showPresentationDetailHanlder} >
                        {getPresentationInfo(pos[2]).courseTitle}
                        </div>
                </OverlayTrigger>
                    
                </Fragment>
            ))
        }
    }
    const renderHouersForWeek = amount => {
        let hour = Array(amount).fill('0');
        return hour.map((h, index) => <div key={index + 'H'} className="hour-column-child" style={{ width: `${100 / amount}%` }}></div>)
    };
    const renderHourTitle = () => {
        let hoursTitle = [];
        for (let i = 1; i <= 17; i++) {
            hoursTitle.push(i + 6);
        }
        return hoursTitle.map((title, index) => <div key={index + 'H'} className="hour-column-child text-center" style={{ width: `${100 / 17}%` }} dir="ltr">{toPersianNumber(title - 1) + toPersianNumber(': 00')}</div>)
    }
    const renderDetailModal = () => {
    
    };
    return (
        <Fragment>
            {
                isloading ? <LoadSpiner /> : (
                    <Modal show={content === "WEEKVIEW"} onHide={closeHandler} size="xl" centered className={showDetail ? "focusOut" : "" }>
                        <Modal.Body className={"modal-weeklyView"}>
                            <div className="modal-weeklyView-body">
                                <div className="week m-3  d-flex " style={{ position: "relative"}}>
                                    <div className="days d-flex flex-column ">

                                        <div className="day p-3 text-center" >#
                                        </div>
                                        {
                                            days.map(day => <div key={day.id + 'HT'} className="day text-center">{day.title}</div>)
                                        }
                                    </div>
                                    <div className="d-flex hour-column">
                                        {
                                            renderHouersForWeek(17)
                                        }
                                    </div>
                                    <div className="d-flex flex-column timeZone ">
                                        <div className="timeZonRow d-flex justify-content-center p-3" style={{ position: "relative" }}>
                                        {
                                                renderHourTitle()
                                        }
                                        </div>
                                        {
                                            days.map(day =>
                                            <div key={day.id + 'AB'} className=" timeZonRow p-3" style={{ position: "relative" }}>
                                                {
                                                    renderPresentationPerTime(day.id)
                                                }
                                            </div>)
                                        }
                                    </div>
                                </div>
                            </div>
                            <div className="d-flex justify-content-end btn-Group mt-3">
                                <button className={"btn_custome btn_danger"} onClick={closeHandler}>بستن</button>
                            </div>
                        </Modal.Body>


                        {
                            showDetail && <Modal show={showDetail} onHide={closeDetailHandler} size="md" centered>
                                <Modal.Body className={"modal-PresentationDetail"}>
                                    <div className="modal-PresentationDetail-header d-flex justify-content-between">
                                        <span className=""><i className="bi bi-list"></i> جزئیات</span>
                                        
                                    </div>
                                    <div className="modal-PresentationDetail-body">
                                        <div className="modal-PresentationDetail-row row">
                                            <div className="col-5">عنوان درس :</div>
                                            <div className="col-7 text-center">{showDetail?.courseTitle}</div>
                                        </div>
                                        <div className="modal-PresentationDetail-row row">
                                            <div className="col-5">استاد :</div>
                                            <div className="col-7 text-center">{showDetail?.instructorName}</div>
                                        </div>
                                        <div className="modal-PresentationDetail-row row">
                                            <div className="col-5">روز :</div>
                                            <div className="col-7 text-center">{showDetail?.dayOfWeekToString}</div>
                                        </div>
                                        <div className="modal-PresentationDetail-row row">
                                            <div className="col-5">ساعت :</div>
                                            <div className="col-7 text-center" ><span dir="ltr">{toPersianNumber(showDetail?.ConvertDayTime[0].startTime)}</span><span> تا </span><span dir="ltr">{toPersianNumber(showDetail?.ConvertDayTime[0].endTime)}</span></div>
                                        </div>
                                        <div className="modal-PresentationDetail-row row">
                                            <div className="col-5">امتحان :</div>
                                            <div className="col-7 text-center"></div>
                                        </div>
                                        <div className="modal-PresentationDetail-row row">
                                            <div className="col-5">واحد :</div>
                                            <div className="col-7 text-center"></div>
                                        </div>
                                        <div className="modal-PresentationDetail-row row">
                                            <div className="col-5">کد درس :</div>
                                            <div className="col-7 text-center"></div>
                                        </div>
                                        <div className="modal-PresentationDetail-row row">
                                            <div className="col-5">کد ارائه :</div>
                                            <div className="col-7 text-center"></div>
                                        </div>
                                        <div className="d-flex justify-content-end btn-Group mt-3">
                                            <button className={"btn_custome btn_danger"} onClick={closeDetailHandler}>بستن</button>
                                        </div>
                                    </div>
                                </Modal.Body>
                            </Modal>
                        }
                    </Modal>)
            }
        </Fragment>
    );
};

export default WeeklyView; 