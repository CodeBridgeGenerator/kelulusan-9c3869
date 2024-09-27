import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import client from "../../services/restClient";
import _ from "lodash";
import initilization from "../../utils/init";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';

const getSchemaValidationErrorsStrings = (errorObj) => {
    let errMsg = {};
    for (const key in errorObj.errors) {
      if (Object.hasOwnProperty.call(errorObj.errors, key)) {
        const element = errorObj.errors[key];
        if (element?.message) {
          errMsg[key] = element.message;
        }
      }
    }
    return errMsg.length ? errMsg : errorObj.message ? { error : errorObj.message} : {};
};

const LandtitleCreateDialogComponent = (props) => {
    const [_entity, set_entity] = useState({});
    const [error, setError] = useState({});
    const [loading, setLoading] = useState(false);
    const urlParams = useParams();
    const [ownerId, setOwnerId] = useState([])

    useEffect(() => {
        let init  = {};
        if (!_.isEmpty(props?.entity)) {
            init = initilization({ ...props?.entity, ...init }, [ownerId], setError);
        }
        set_entity({...init});
    }, [props.show]);

    const validate = () => {
        let ret = true;
        const error = {};
        
        if (!ret) setError(error);
        return ret;
    }

    const onSave = async () => {
        if(!validate()) return;
        let _data = {
            titleId: _entity?.titleId,titleNumber: _entity?.titleNumber,ownerId: _entity?.ownerId?._id,registeredDate: _entity?.registeredDate,expireDate: _entity?.expireDate,
            createdBy: props.user._id,
            updatedBy: props.user._id
        };

        setLoading(true);

        try {
            
        const result = await client.service("landtitle").create(_data);
        const eagerResult = await client
            .service("landtitle")
            .find({ query: { $limit: 10000 ,  _id :  { $in :[result._id]}, $populate : [
                {
                    path : "ownerId",
                    service : "titleowner",
                    select:["ownerId"]}
            ] }});
        props.onHide();
        props.alert({ type: "success", title: "Create info", message: "Info Landtitle updated successfully" });
        props.onCreateResult(eagerResult.data[0]);
        } catch (error) {
            console.log("error", error);
            setError(getSchemaValidationErrorsStrings(error) || "Failed to create");
            props.alert({ type: "error", title: "Create", message: "Failed to create in Landtitle" });
        }
        setLoading(false);
    };

    useEffect(() => {
                    // on mount titleowner
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
        <Dialog header="Create Landtitle" visible={props.show} closable={false} onHide={props.onHide} modal style={{ width: "40vw" }} className="min-w-max" footer={renderFooter()} resizable={false}>
            <div className="grid p-fluid overflow-y-auto"
            style={{ maxWidth: "55vw" }} role="landtitle-create-dialog-component">
            <div className="col-12 md:col-6 field mt-5">
            <span className="align-items-center">
                <label htmlFor="titleId">title_id:</label>
                <InputNumber id="titleId" className="w-full mb-3 p-inputtext-sm" value={_entity?.titleId} onChange={(e) => setValByKey("titleId", e.value)}  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["titleId"]) ? (
              <p className="m-0" key="error-titleId">
                {error["titleId"]}
              </p>
            ) : null}
          </small>
            </div>
<div className="col-12 md:col-6 field mt-5">
            <span className="align-items-center">
                <label htmlFor="titleNumber">title_number:</label>
                <InputNumber id="titleNumber" className="w-full mb-3 p-inputtext-sm" value={_entity?.titleNumber} onChange={(e) => setValByKey("titleNumber", e.value)}  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["titleNumber"]) ? (
              <p className="m-0" key="error-titleNumber">
                {error["titleNumber"]}
              </p>
            ) : null}
          </small>
            </div>
<div className="col-12 md:col-6 field mt-5">
            <span className="align-items-center">
                <label htmlFor="ownerId">owner_id:</label>
                <Dropdown id="ownerId" value={_entity?.ownerId?._id} optionLabel="name" optionValue="value" options={ownerIdOptions} onChange={(e) => setValByKey("ownerId", {_id : e.value})}  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["ownerId"]) ? (
              <p className="m-0" key="error-ownerId">
                {error["ownerId"]}
              </p>
            ) : null}
          </small>
            </div>
<div className="col-12 md:col-6 field mt-5">
            <span className="align-items-center">
                <label htmlFor="registeredDate">registered_date:</label>
                <InputNumber id="registeredDate" className="w-full mb-3 p-inputtext-sm" value={_entity?.registeredDate} onChange={(e) => setValByKey("registeredDate", e.value)}  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["registeredDate"]) ? (
              <p className="m-0" key="error-registeredDate">
                {error["registeredDate"]}
              </p>
            ) : null}
          </small>
            </div>
<div className="col-12 md:col-6 field mt-5">
            <span className="align-items-center">
                <label htmlFor="expireDate">expire_date:</label>
                <InputNumber id="expireDate" className="w-full mb-3 p-inputtext-sm" value={_entity?.expireDate} onChange={(e) => setValByKey("expireDate", e.value)}  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["expireDate"]) ? (
              <p className="m-0" key="error-expireDate">
                {error["expireDate"]}
              </p>
            ) : null}
          </small>
            </div>
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
