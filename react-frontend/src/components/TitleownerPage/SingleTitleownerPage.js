import { Button } from "primereact/button";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import client from "../../services/restClient";
import { Tag } from 'primereact/tag';
import moment from "moment";
import { InputText } from 'primereact/inputtext';
import ProjectLayout from "../Layouts/ProjectLayout";
import LandtitlePage from "../LandtitlePage/LandtitlePage";


const SingleTitleownerPage = (props) => {
    const navigate = useNavigate();
    const urlParams = useParams();
    const [_entity, set_entity] = useState();

    

    useEffect(() => {
        //on mount
        client
            .service("titleowner")
            .get(urlParams.singleTitleownerId, { query: { $populate: [            {
                path: "createdBy",
                service: "users",
                select: ["name"],
              },{
                path: "updatedBy",
                service: "users",
                select: ["name"],
              },] }})
            .then((res) => {
                set_entity(res || {});
                
            })
            .catch((error) => {
                console.log({ error });
                props.alert({ title: "Titleowner", type: "error", message: error.message || "Failed get titleowner" });
            });
    }, [props,urlParams.singleTitleownerId]);


    const goBack = () => {
        navigate("/titleowner");
    };

    return (
        <ProjectLayout>
        <div className="col-12 flex flex-column align-items-center">
            <div className="col-10">
                <div className="flex align-items-center justify-content-start">
                    <Button className="p-button-text" icon="pi pi-chevron-left" onClick={() => goBack()} />
                    <h3 className="m-0">Titleowner</h3>
                </div>
                <p>titleowner/{urlParams.singleTitleownerId}</p>
                {/* ~cb-project-dashboard~ */}
            </div>
            <div className="card w-full">
                <div className="grid ">

            <div className="col-12 md:col-6 lg:col-3"><label className="text-sm text-primary">owner_id</label><p className="m-0 ml-3" >{Number(_entity?.ownerId)}</p></div>
<div className="col-12 md:col-6 lg:col-3"><label className="text-sm text-primary">name</label><p className="m-0 ml-3" >{_entity?.name}</p></div>
<div className="col-12 md:col-6 lg:col-3"><label className="text-sm text-primary">address</label><p className="m-0 ml-3" >{_entity?.address}</p></div>
<div className="col-12 md:col-6 lg:col-3"><label className="text-sm text-primary">contact_number</label><p className="m-0 ml-3" >{Number(_entity?.contactNumber)}</p></div>
            

                    <div className="col-12">&nbsp;</div>
                </div>
            </div>
        </div>
        <LandtitlePage/>
        </ProjectLayout>
    );
};

const mapState = (state) => {
    const { user, isLoggedIn } = state.auth;
    return { user, isLoggedIn };
};

const mapDispatch = (dispatch) => ({
    alert: (data) => dispatch.toast.alert(data),
});

export default connect(mapState, mapDispatch)(SingleTitleownerPage);
