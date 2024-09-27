import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import client from "../../services/restClient";
import _ from "lodash";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Tag } from 'primereact/tag';
import moment from "moment";
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';

const getSchemaValidationErrorsStrings = (errorObj) => {
    let errMsg = {};
    for (const key in errorObj.errors) {
        if (Object.hasOwnProperty.call(errorObj.errors, key)) {
            const element = errorObj.errors[key];
            if (element?.message) {
                errMsg.push(element.message);
            }
        }
    }
    return errMsg.length ? errMsg : errorObj.message ? errorObj.message : null;
};

const LandtitleCreateDialogComponent = (props) => {
    const [_entity, set_entity] = useState({});
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const urlParams = useParams();
    const [ownerId, setOwnerId] = useState([])

    useEffect(() => {
        set_entity(props.entity);
    }, [props.entity, props.show]);

     useEffect(() => {
                    //on mount titleowner
                    client
                        .service("titleowner")
                        .find({ query: { $limit: 10000, $sort: { createdAt: -1 }, _id : urlParams.singleTitleownerId } })
                        .then((res) => {
                            setOwnerId(res.data.map((e) => { return { name: e['ownerId'], value: e._id }}));
                        })
                        .catch((error) => {
                            console.log({ error });
                            props.alert({ title: "Titleowner", type: "error", message: error.message || "Failed get titleowner" });
                        });
                }, []);

    const onSave = async () => {
        let _data = {
            titleId: _entity?.titleId,
titleNumber: _entity?.titleNumber,
ownerId: _entity?.ownerId?._id,
registeredDate: _entity?.registeredDate,
expireDate: _entity?.expireDate,
        };

        setLoading(true);
        try {
            
        await client.service("landtitle").patch(_entity._id, _data);
        const eagerResult = await client
            .service("landtitle")
            .find({ query: { $limit: 10000 ,  _id :  { $in :[_entity._id]}, $populate : [
                {
                    path : "ownerId",
                    service : "titleowner",
                    select:["ownerId"]}
            ] }});
        props.onHide();
        props.alert({ type: "success", title: "Edit info", message: "Info landtitle updated successfully" });
        props.onEditResult(eagerResult.data[0]);
        } catch (error) {
            console.log("error", error);
            setError(getSchemaValidationErrorsStrings(error) || "Failed to update info");
            props.alert({ type: "error", title: "Edit info", message: "Failed to update info" });
        }
        setLoading(false);
    };

    const renderFooter = () => (
        <div className="flex justify-content-end">
            <Button label="save" className="p-button-text no-focus-effect" onClick={onSave} loading={loading} />
            <Button label="close" className="p-button-text no-focus-effect p-button-secondary" onClick={props.onHide} />
        </div>
    );

    const setValByKey = (key, val) => {
        let new_entity = { ..._entity, [key]: val };
        set_entity(new_entity);
        setError({});
    };

    const ownerIdOptions = ownerId.map((elem) => ({ name: elem.name, value: elem.value }));

    return (
        <Dialog header="Edit Landtitle" visible={props.show} closable={false} onHide={props.onHide} modal style={{ width: "40vw" }} className="min-w-max" footer={renderFooter()} resizable={false}>
            <div className="grid p-fluid overflow-y-auto"
            style={{ maxWidth: "55vw" }} role="landtitle-edit-dialog-component">
                <div className="col-12 md:col-6 field mt-5">
        <span className="align-items-center">
            <label htmlFor="titleId">title_id:</label>
            <InputNumber id="titleId" className="w-full mb-3 p-inputtext-sm" value={_entity?.titleId} onChange={(e) => setValByKey("titleId", e.value)}  />
        </span>
        </div>
<div className="col-12 md:col-6 field mt-5">
        <span className="align-items-center">
            <label htmlFor="titleNumber">title_number:</label>
            <InputNumber id="titleNumber" className="w-full mb-3 p-inputtext-sm" value={_entity?.titleNumber} onChange={(e) => setValByKey("titleNumber", e.value)}  />
        </span>
        </div>
<div className="col-12 md:col-6 field mt-5">
        <span className="align-items-center">
            <label htmlFor="ownerId">owner_id:</label>
            <Dropdown id="ownerId" value={_entity?.ownerId?._id} optionLabel="name" optionValue="value" options={ownerIdOptions} onChange={(e) => setValByKey("ownerId", {_id : e.value})}  />
        </span>
        </div>
<div className="col-12 md:col-6 field mt-5">
        <span className="align-items-center">
            <label htmlFor="registeredDate">registered_date:</label>
            <InputNumber id="registeredDate" className="w-full mb-3 p-inputtext-sm" value={_entity?.registeredDate} onChange={(e) => setValByKey("registeredDate", e.value)}  />
        </span>
        </div>
<div className="col-12 md:col-6 field mt-5">
        <span className="align-items-center">
            <label htmlFor="expireDate">expire_date:</label>
            <InputNumber id="expireDate" className="w-full mb-3 p-inputtext-sm" value={_entity?.expireDate} onChange={(e) => setValByKey("expireDate", e.value)}  />
        </span>
        </div>
                <div className="col-12">&nbsp;</div>
                <div className="col-12 md:col-6 field mt-5"><p className="m-0"><Tag value="created At:"></Tag>{" " + moment(_entity?.createdAt).fromNow()}</p></div>
                <div className="col-12 md:col-6 field mt-5"><p className="m-0"><Tag value="created By:"></Tag>{" " +_entity?.createdBy?.name}</p></div>
                <div className="col-12 md:col-6 field mt-5"><p className="m-0"><Tag value="last Updated At:"></Tag>{" " + moment(_entity?.updatedAt).fromNow()}</p></div>
                <div className="col-12 md:col-6 field mt-5"><p className="m-0"><Tag value="last Updated By:"></Tag>{" " +_entity?.updatedBy?.name}</p></div>
                <small className="p-error">
                {Array.isArray(Object.keys(error))
                ? Object.keys(error).map((e, i) => (
                    <p className="m-0" key={i}>
                        {e}: {error[e]}
                    </p>
                    ))
                : error}
            </small>
            </div>
        </Dialog>
    );
};

const mapState = (state) => {
    const { user } = state.auth;
    return { user };
};
const mapDispatch = (dispatch) => ({
    alert: (data) => dispatch.toast.alert(data),
});

export default connect(mapState, mapDispatch)(LandtitleCreateDialogComponent);
