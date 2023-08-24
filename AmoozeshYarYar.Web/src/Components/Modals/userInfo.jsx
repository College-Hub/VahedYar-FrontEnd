﻿import './userInfo.css';
import { Fragment, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { modalActions } from "../../Store/modal-slice";
import { courseActions } from "../../Store/course-slice";
import { useNavigate } from "react-router-dom";
import { authActions } from '../../Store/auth-slice';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import LoadSpiner from '../Animations/loadSpiner';
import NoResponse from '../Errors/Requests/noResponse';
import { useState } from 'react';
import { BsBuildings, BsBook, BsInfoCircle } from "react-icons/bs";

const UserInfo = () => {

    // route
    const navigate = useNavigate();

    // state
    const { isloading , NoResponseFromServer } = useSelector(state => state.ui);
    const { content } = useSelector(state => state.modal);
    const { startUpData } = useSelector(state => state.course);
    const [uni, setUni] = useState(undefined);
    const [group, setGroup] = useState(undefined);
    const [view, setView ] = useState();

    const dispatch = useDispatch();

    // event handler 
    const uniBulrHandler = (event) => {
        setUni(startUpData?.find(uni => uni.universityId === event.target.value));
        setGroup(undefined)
    };
    const groupBulrHandler = (event) => {
        setGroup(startUpData?.find(item => item.universityId === uni.universityId).groups.find(gp => gp.groupId === event.target.value));
    };
    const closeHandler = () => {
        dispatch(modalActions.hideModal());
    };
    const submitHandler = async () => {
        if (uni && group) {
            dispatch(courseActions.clearCourses());
            dispatch(courseActions.StartUpHandler());
            dispatch(authActions.userInfoKeeper({ uni, group }));
            navigate("/selectCourses");
            dispatch(modalActions.hideModal());
        }
        
    };

    useEffect(() => {
        if (NoResponseFromServer) 
            setView(<NoResponse />);
        else if (isloading) 
            setView(<LoadSpiner />);
        else
            setView(null);
    }, [isloading, NoResponseFromServer]);

    // content handler
 

    return (
        <Fragment>
            
                
            {
                view ? view : (
                    <Modal show={content === "USERINFO"} onHide={closeHandler} size="lg" centered>
                    <Modal.Body className={"modal-userInfo"}>
                        <div className="row">
                            <div className="col-12 col-lg-6">
                                <div className="col-12 mt-3">
                                        <label htmlFor="exampleInputUni" className="form-label"><BsBuildings /> دانشگاه :</label>
                                    <select className="form-select custome-modal-input" aria-label="Default select example" onChange={uniBulrHandler} id="exampleInputUni" aria-describedby="uniHelp">
                                        <option value={undefined}>انتخاب</option>
                                        {
                                            startUpData?.map(item => <option key={item.universityId} value={item.universityId}>{item.title}</option>)
                                        }
                                    </select>
                                </div>
                                <div className="col-12 mt-3">
                                        <label htmlFor="exampleInputgroup" className="form-label"><BsBook /> رشته تحصیلی :</label>
                                    <select className="form-select custome-modal-input" aria-label="Default select example" onChange={groupBulrHandler} id="exampleInputgroup" aria-describedby="groupHelp" disabled={!uni}>
                                        <option value={undefined}>انتخاب</option>
                                        {
                                            uni?.groups?.map(group => <option key={group.groupId} value={group.groupId}>{group.title}</option>)
                                        }
                                    </select>
                                </div>
                            </div>
                                <div className="col-12 col-md-6 pt-5">
                                    <p className="hit-message"> <BsInfoCircle /> برای شروع، دانشگاه و رشته تحصیلی خودت رو انتخاب کن.</p>
                            </div>
                        </div>
                            <div className="d-flex justify-content-end btn-Group mt-3">
                                <button className={"custome-btn-danger"} onClick={closeHandler}>برگشت</button>
                                <button className={"custome-btn-primary"} onClick={submitHandler}>ادامه</button>
                        </div>
                    </Modal.Body>
                </Modal>)
            }

        </Fragment>
    );
};

export default UserInfo; 