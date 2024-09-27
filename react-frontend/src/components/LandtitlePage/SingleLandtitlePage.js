import { Button } from "primereact/button";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import client from "../../services/restClient";
import { Tag } from 'primereact/tag';
import moment from "moment";
import { InputText } from 'primereact/inputtext';
import ProjectLayout from "../Layouts/ProjectLayout";


const SingleLandtitlePage = (props) => {
    const navigate = useNavigate();
    const urlParams = useParams();
    const [_entity, set_entity] = useState();

    const [ownerId, setOwnerId] = useState([]);

    useEffect(() => {
        //on mount
        client
            .service("landtitle")
            .get(urlParams.singleLandtitleId, { query: { $populate: [            {
                path: "createdBy",
                service: "users",
                select: ["name"],
              },{
                path: "updatedBy",
                service: "users",
                select: ["name"],
              },"ownerId"] }})
            .then((res) => {
                set_entity(res || {});
                const ownerId = Array.isArray(res.ownerId)
            ? res.ownerId.map((elem) => ({ _id: elem._id, ownerId: elem.ownerId }))
            : res.ownerId
                ? [{ _id: res.ownerId._id, ownerId: res.ownerId.ownerId }]
                : [];
        setOwnerId(ownerId);
            })
            .catch((error) => {
                console.log({ error });
                props.alert({ title: "Landtitle", type: "error", message: error.message || "Failed get landtitle" });
            });
    }, [props,urlParams.singleLandtitleId]);


    const goBack = () => {
        navigate("/landtitle");
    };

    return (
        <ProjectLayout>
        <div className="col-12 flex flex-column align-items-center">
            <div className="col-10">
                <div className="flex align-items-center justify-content-start">
                    <Button className="p-button-text" icon="pi pi-chevron-left" onClick={() => goBack()} />
                    <h3 className="m-0">Landtitle</h3>
                </div>
                <p>landtitle/{urlParams.singleLandtitleId}</p>
                {/* ~cb-project-dashboard~ */}
            </div>
            <div className="card w-full">
                <div className="grid ">

            <div className="col-12 md:col-6 lg:col-3"><label className="text-sm text-primary">title_id</label><p className="m-0 ml-3" >{Number(_entity?.titleId)}</p></div>
<div className="col-12 md:col-6 lg:col-3"><label className="text-sm text-primary">title_number</label><p className="m-0 ml-3" >{Number(_entity?.titleNumber)}</p></div>
<div className="col-12 md:col-6 lg:col-3"><label className="text-sm text-primary">registered_date</label><p className="m-0 ml-3" >{Number(_entity?.registeredDate)}</p></div>
<div className="col-12 md:col-6 lg:col-3"><label className="text-sm text-primary">expire_date</label><p className="m-0 ml-3" >{Number(_entity?.expireDate)}</p></div>
            <div className="col-12 md:col-6 lg:col-3"><label className="text-sm">owner_id</label>
                    {ownerId.map((elem) => (
                        <Link key={elem._id} to={`/titleowner/${elem._id}`}>
                            <div className="card">
                                <p className="text-xl text-primary">{elem.ownerId}</p>
                            </div>
                        </Link>
                    ))}</div>

                    <div className="col-12">&nbsp;</div>
                </div>
            </div>
        </div>
        
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

export default connect(mapState, mapDispatch)(SingleLandtitlePage);
