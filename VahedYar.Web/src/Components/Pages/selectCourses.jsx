﻿import './selectCourses.css';
import SelectCourseModal from '../Modals/selectCourseModal';
import DayTable from '../UI/Tables/dayTable';
import CourseTable from '../UI/Tables/courseTable';
import UserInfo from "../Modals/userInfo";

import { useNavigate } from "react-router-dom";
import { useSubmitUserInfoMutation, useSubmitFitersMutation } from "../../feratures/api/apiSlice";
import { courseActions } from "../../Store/course-slice";
import { modalActions } from "../../Store/modal-slice";
import { useSelector, useDispatch } from 'react-redux';
import { Fragment } from 'react';
import { useEffect, useState } from 'react';
import { uiActions } from '../../Store/ui-slice';
import { timeTableActions } from '../../Store/timeTable-slice';
import { BsBuildings, BsBook, BsInfoCircle, BsPersonLinesFill, BsCalendar2Check, BsGear, BsCheck2Square, BsWrench } from "react-icons/bs";
import { toPersianNumber } from '../../feratures/helper/helper';



const SelectCourses = () => {
    // state
    const { selectedcourses, daySelectTable, courses, days, TimeTableFilter, error } = useSelector(state => state.course);
    const { group, uni } = useSelector(state => state.auth.User);
    const { content } = useSelector(state => state.modal);
    const [submitUserInfo, { isLoading, isEroor }] = useSubmitUserInfoMutation();
    const [filter, setFilter] = useState();

    // hooks
    const dispatch = useDispatch();
    const navigate = useNavigate();


    // onload 
    useEffect(() => {
        if (!courses?.length) {
            handleRequest();
        }
        dispatch(courseActions.resetDays());
    }, [group]);

    useEffect(() => {
        dispatch(courseActions.createFilterForTimeTable());
    }, [selectedcourses, days]);

    useEffect(() => {
        dispatch(uiActions.setLoader(isLoading));
        dispatch(timeTableActions.clearTimeTablse());
        if (courses?.length) {
            dispatch(courseActions.clearError({ type: "No-COURSE" }));
        }
    }, []);

    useEffect(() => {
            dispatch(uiActions.setLoader(isLoading));
    }, [isLoading]);

    useEffect(() => {
        if (courses?.length) {
            dispatch(courseActions.clearError({ type: "No-COURSE" }));
        }
        else dispatch(courseActions.setError({ type: "No-COURSE" }));
    }, [courses]);

    // event handler
    const dayTableHandler = event => {
        dispatch(courseActions.daySeletViewChange());
    };
    const selectCourseModalHandler = () => {
        if (courses?.length) {
            dispatch(courseActions.clearError({ type: "No-COURSE"}));
            dispatch(modalActions.setModalData({ content: "COURSE" }));
        }
        else dispatch(courseActions.setError({ type: "No-COURSE" }));
    };
    const startHandler = () => {
        dispatch(modalActions.setModalData({ content: "USERINFO", }));
    };
    const setScatterationHandler = (event) => {
        let value = event.target.value;
        dispatch(courseActions.setScatteration({ value }));
    };
    const submithandler = () => {
        if (TimeTableFilter.Courses?.length) {
            navigate("/timetable");
        };
    };
    // Request handler
    const handleRequest = async () => {
        try {
            const { data: response } = await submitUserInfo(group.groupId);
            dispatch(uiActions.setLoader(isLoading));
            if (!isEroor && !isLoading) {
                dispatch(courseActions.initiateCourse({ course: response.data }));
            }
        } catch (e) {
            console.log(e)
        }
    }

    //functions
    // Select Course - function to handle loader and error for Course request 
    const SelectCourseViewHandler = () => {
        if (!isLoading && error.noCourseModel) {
            return (
                <div className="No-Course-error mb-3">
                    <p className="hit-message"><BsInfoCircle /> هیچ درسی برای این گروه در دیتابیس وجود ندارد</p>
                </div>
            )
        }
        else if (isLoading) {
            return (
            <div className="text-start ">
               <button className={"btn_custome btn_info"}><span className="spinner-border spinner-border-sm" aria-hidden="true"></span> در حال بارگذاری</button>
            </div>)
        }

        else {
            return (
            <div className="text-start ">
                 <button className={error.noCourseModel ? "custome-disabled" : "btn_custome btn_info"} onClick={selectCourseModalHandler} disabled={error.noCourseModel}>انتخاب درس</button>
            </div> )
        }       
        
    };

    return (
        <Fragment>
            <section id="info" className="row custome-contaner-section">
                <div className="col-12 custome-contaner-section-header">
                    <span><BsPersonLinesFill />اطلاعات</span>
                </div>
                <div className="col-12 col-md-7 mb-3"><BsBuildings /> دانشگاه : <span className="userInfo">{group?.universityTitle}</span></div>
                <div className="col-12 col-md-5 mb-3"><BsBook /> رشته تحصیلی : <span className="userInfo">{group?.title}</span></div>
                <div className="col-12"></div>
                <div className="col-12 text-start ">
                    <button className="btn_custome btn_info" onClick={startHandler} >تغییر اطلاعات</button>
                </div>
            </section>
            {
                daySelectTable ? (<DayTable />) : (
                    <div id="selectDay" className="row custome-contaner-section">
                        <div className="col-12 ">
                            <div className="custome-contaner-section-header">
                                <span><BsCalendar2Check />روز</span>
                            </div>
                            <p className="hit-message"><BsInfoCircle /> اول روز هایی از هفته که دانشگاه میایی رو باید انتخاب کنی.</p>
                            <p className="hit-message"><BsInfoCircle /> بعدش باید ساعت ورود و خروج خودت به دانشگاه رو انتخاب کنی.</p>
                            <p className="hit-message"><BsInfoCircle /> در صورتی که ساعت ورود یا خروج خودت رو انتخاب نکرده باشی ساعت پیشفرض ورود {toPersianNumber("7:00")} و ساعت خروج {toPersianNumber("21:00")} برات ثبت میشه.</p>
                        </div >
                        <div className="col-12 text-start">
                            <button className="btn_custome btn_info" onClick={dayTableHandler}>انتخاب روز</button>
                        </div>
                    </div >
                )
            }
            {
                selectedcourses?.length ? (<CourseTable />) : (
                    <div id="selectCourse" className="row custome-contaner-section">
                        <div className="col-12 mb-3">
                            <div className="custome-contaner-section-header">
                                <span><BsBook />درس</span>
                            </div>
                            <p className="hit-message"><BsInfoCircle /> اول درس هایی که این ترم میخوای برداری رو باید انتخاب کنی.</p>
                            <p className="hit-message"><BsInfoCircle /> در صورتی که استاد موردنظرت برای درسی که انتخاب کردی رو انتخاب نکرده باشی تمام استاد ها برای اون درس در نتیجه نهایی برات لحاظ میشن. </p>
                            <p className="hit-message"><BsInfoCircle /> یادت باشه روز و ساعت هایی که میخوای دانشگاه باشی رو هم انتخاب کرده باشی.</p>
                        </div >
                        <div className="d-flex justify-content-end flex-wrap">
                            {
                                SelectCourseViewHandler()

                            }
                            
                            
                        </div>
                        

                    </div >
                )
            }
            <section id="moreSettings" className="custome-contaner-section row">
                <div className="col-12 custome-contaner-section-header">
                    <span ><BsGear />تنظیمات بیشتر</span>
                </div>
                <div className="col-12 pe-1 pe-md-5 setting ">
                    <div>
                        <span className="pe-3"><BsWrench /> میزان فشردگی برنامه : </span>
                    </div>
                    <div className="me-4 pt-1">
                        <div className="form-check form-check-inline">
                            <label className="form-check-label" htmlFor="inlineRadio1">مهم نیست</label>
                            <input className="form-check-input" type="radio" onClick={setScatterationHandler} name="inlineRadioOptions" id="inlineRadio1" value="0" />
                        </div>
                        <div className="form-check form-check-inline">
                            <label className="form-check-label" htmlFor="inlineRadio2">پراکنده</label>
                            <input className="form-check-input" type="radio" onClick={setScatterationHandler} name="inlineRadioOptions" id="inlineRadio2" value="2" />
                        </div>
                        <div className="form-check form-check-inline">
                            <label className="form-check-label" htmlFor="inlineRadio3">فشرده</label>
                            <input className="form-check-input" type="radio" onClick={setScatterationHandler} name="inlineRadioOptions" id="inlineRadio3" value="1" />
                        </div>
                    </div>
                </div>

            </section>

            <section id="submit" className="row custome-contaner-section">
                <div className="col-10  custome-contaner-section-header">
                    <span><BsCheck2Square />تایید فرم </span>
                </div>
                <div className="col-2 text-start">
                    <button className={!TimeTableFilter.Courses?.length ? "custome-disabled" : "btn_custome btn_success"} onClick={submithandler}>ثبت</button>
                </div>
                {
                    days.find(day => day.isSelected) && (
                        <div className="col-12">
                            <p className="hit-message"><i className="bi bi-exclamation-circle"></i> روز های زیر رو برای رفتن به داشنگاه انتخاب کردی.</p>
                            <div className="pe-4">
                                {
                                    days.map(day => day.isSelected ? <span key={day.id} className="daysInfo"> / {day.title} </span> : null)
                                }
                            </div>
                        </div>
                    )
                }
                {
                    selectedcourses?.length ? (
                        <div className="col-12">
                            <p className="hit-message"><i className="bi bi-exclamation-circle"></i> درس های زیر رو هم انتخاب کردی.</p>
                            <div className="pe-4">
                                {
                                    selectedcourses.map(course => <span key={course.courseId} className="daysInfo"> / {course.title}</span>)
                                }
                            </div>
                        </div>
                    ) : null
                }

            </section>
            {
                content === "COURSE" && <SelectCourseModal />
            }
            {
                content === "USERINFO" && <UserInfo />
            }
        </Fragment>
    );
};

export default SelectCourses; 