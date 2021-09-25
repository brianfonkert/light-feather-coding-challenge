import { useState, useEffect } from "react";
import Select from "react-select";
import ErrorModal from "../Components/ErrorModal/ErrorModal";
import validator from "validator";
import Input from "react-phone-number-input/input";

import classes from "./Form.module.css";
import { isValidPhoneNumber } from "react-phone-number-input";

const Form = () => {
  //Options used with validator
  const phoneOptions = { Strictmode: false };
  const alphaOptions = { ignore: " -'" };

  //States
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailAddress, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [supervisor, setSupervisor] = useState([]);
  const [options, setOptions] = useState([]);
  const [activeOption, setActiveOption] = useState([]);
  const [emEnabled, setEmEnabled] = useState(false);
  const [pEnabled, setPEnabled] = useState(false);
  const [error, setError] = useState();

  //Change Handlers
  const fNameChangeHandler = (event) => {
    setFirstName(event.target.value);
  };

  const lNameChangeHandler = (event) => {
    setLastName(event.target.value);
  };

  const emailChangeHandler = (event) => {
    setEmail(event.target.value);
  };

  const phoneChangeHandler = (event) => {
    if (event !== undefined) {
      setPhoneNumber(event);
    } else {
      setPhoneNumber("");
    }
  };

  const supervisorChangeHandler = (event) => {
    setActiveOption(event);
    if (event === null) {
      setSupervisor([]);
    } else {
      setSupervisor(event);
    }
  };

  const emChangeHandler = () => {
    setEmEnabled(!emEnabled);
    if (emEnabled) {
      setEmail("");
    }
  };

  const pChangeHandler = () => {
    setPEnabled(!pEnabled);
    if (pEnabled) {
      setPhoneNumber("");
    }
  };

  //useEffect call to handle the inital fetch GET. Ensures we only fetch when the page loads.
  useEffect(() => {
    async function fetchResults() {
      try {
        const response = await fetch(
          "https://o3m5qixdng.execute-api.us-east-1.amazonaws.com/api/supervisors"
        );
        if (!response.ok) {
          throw new Error();
        }
        const data = await response.json();
        const returnedOptions = data.results.map((optionData) => {
          return {
            value: optionData.name.first + " " + optionData.name.last,
            label: optionData.name.first + " " + optionData.name.last,
          };
        });
        setOptions(returnedOptions);
      } catch (error) {
        setError({ title: "HTTP Error", message: error.message });
      }
    }
    fetchResults();
  }, []);

  //SubmitHandler Used to submit form data.
  const submitHandler = (event) => {
    event.preventDefault();
    const formData = {
      firstname: firstName.trim(),
      lastname: lastName.trim(),
      email: emailAddress,
      phone: phoneNumber,
      supervisor: supervisor.value,
    };

    //Check fields for validity.
    validateForm(formData);
  };

  //Validate the form fields, any errors will be prompted to the user via the ErrorModal.
  //If we pass validation, we handle the submission and fetch POST.
  const validateForm = (formData) => {
    if (formData.firstname.trim().length === 0) {
      setError({
        title: "First name required",
        message: "Please fill in your first name.",
      });
      return;
    }

    if (!validator.isAlpha(formData.firstname, "en-US", alphaOptions)) {
      setError({
        title: "First name invalid",
        message:
          "First name may not contain numbers or symbols. Dashes and apostrophes are allowed.",
      });
      return;
    }

    if (formData.lastname.trim().length === 0) {
      setError({
        title: "Last name required",
        message: "Please fill in your last name.",
      });
      return;
    }

    if (!validator.isAlpha(formData.lastname, "en-US", alphaOptions)) {
      setError({
        title: "Last name invalid",
        message:
          "Last name may not contain numbers or symbols. Dashes and apostrophes are allowed.",
      });
      return;
    }

    if (!emEnabled && !pEnabled) {
      setError({
        title: "Notification method required",
        message: "Please select and enter at least one notification method.",
      });
      return;
    }
    if (emEnabled && formData.email.trim().length === 0) {
      setError({
        title: "Email required",
        message: "Please enter an email.",
      });

      return;
    }

    if (emEnabled && !validator.isEmail(formData.email)) {
      setError({
        title: "Email invalid",
        message:
          "Please enter a valid email address. Valid format: example@test.com",
      });
      return;
    }

    if (pEnabled && formData.phone === "") {
      setError({
        title: "Phone number required",
        message: "Please enter a phone number.",
      });

      return;
    }

    if (
      pEnabled &&
      !isValidPhoneNumber(formData.phone, "en-US", phoneOptions)
    ) {
      setError({
        title: "Phone number invalid",
        message: "Please enter a valid phone number.",
      });
      return;
    }

    if (formData.supervisor === undefined) {
      setError({
        title: "Supervisor required",
        message: "Please select a supervisor.",
      });
      return;
    }
    requestPost(formData);
  };

  //fetch POST
  async function requestPost(formData) {
    console.log(formData);
    try {
      const response = await fetch(
        "https://o3m5qixdng.execute-api.us-east-1.amazonaws.com/api/submit",
        {
          method: "POST",
          body: JSON.stringify(formData),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error();
      }
      const status = await response.status;
      console.log(status);

      //Sucessful submission message displayed using the ErrorModal.
      setError({
        title: "Thank you!",
        message: "Your form has been submitted!",
      });

      //Clear form
      setFirstName("");
      setLastName("");
      setEmEnabled(false);
      setPEnabled(false);
      setEmail("");
      setPhoneNumber("");
      setSupervisor([]);
      setActiveOption([]);

      //Catch any errors and display them using ErrorModal.
    } catch (error) {
      setError({ title: "HTTP Error", message: error.message });
    }
  }

  //Used to reset the state of the ErrorModal after the user clicks out of the modal.
  const errorHandler = () => {
    setError(null);
  };

  //Form and ErrorModal
  return (
    <>
      {error && (
        <ErrorModal
          onConfirm={errorHandler}
          title={error.title}
          message={error.message}
        />
      )}
      <form noValidate onSubmit={submitHandler}>
        <div style={{ display: "inline-block", padding: "10px" }}>
          <label className={classes.label}>First Name</label>
          <input
            id="firstname"
            value={firstName}
            className={classes.input}
            onChange={fNameChangeHandler}
          />
        </div>
        <div style={{ display: "inline-block", padding: "10px" }}>
          <label className={classes.label}>Last Name</label>
          <input
            id="lastname"
            value={lastName}
            className={classes.input}
            onChange={lNameChangeHandler}
          />
        </div>
        <div>
          <span className={classes.span}>
            How would you prefer to be notified?
          </span>
        </div>
        <div>
          <div style={{ display: "inline-block", padding: "10px" }}>
            <div style={{ marginLeft: "8px" }}>
              <input
                id="emailchk"
                type="checkbox"
                checked={emEnabled}
                onChange={emChangeHandler}
              />
              <label style={{ color: "white" }}>Email</label>
            </div>
            <input
              id="email"
              disabled={!emEnabled}
              className={classes.input}
              type="email"
              value={emailAddress}
              onChange={emailChangeHandler}
            />
          </div>
          <div style={{ display: "inline-block", padding: "10px" }}>
            <div style={{ marginLeft: "8px" }}>
              <input
                id="phonechk"
                type="checkbox"
                checked={pEnabled}
                onChange={pChangeHandler}
                className={classes.inputcheckbox}
              />
              <label style={{ color: "white" }}>Phone Number</label>
            </div>
            <Input
              className={classes.input}
              disabled={!pEnabled}
              country="US"
              value={phoneNumber}
              onChange={phoneChangeHandler}
            />
          </div>
        </div>
        <div
          style={{
            padding: "0px 10px 10px 10px",
            width: "300px",
            margin: "auto",
          }}
        >
          <label style={{ color: "white", marginBottom: "10px" }}>
            Supervisor
          </label>
          <Select
            id="supervisor"
            isClearable
            value={activeOption}
            defaultValue="Select..."
            options={options}
            onChange={supervisorChangeHandler}
          />
        </div>
        <div style={{ height: "50px" }}>
          <button className={classes.button} type="submit">
            Submit
          </button>
        </div>
      </form>
    </>
  );
};

export default Form;
