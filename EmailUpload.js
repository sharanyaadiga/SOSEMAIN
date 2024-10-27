import React from "react";

import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

import emailjs from "emailjs-com";
import axios from 'axios';
import "./style.css";
// import { useNavigate } from 'react-router-dom';


const EmailUpload = ({ showButton, bankInfo, taxInfo ,notify , setNotify }) => {



    function sendEmail() {
        console.log("what is showbutton", showButton, bankInfo)
        const name = bankInfo.Name;
        const accountNumber = bankInfo.IBAN;
        const bicnumber = bankInfo.BIC;
        const TotalExpenses = bankInfo.TotalExpenses;
        const Purpose = bankInfo.Purpose;
        const PaidTo = bankInfo.PaidTo;
        const TotalAmount = bankInfo.TotalAmount;
      


        const templateParams = {
            name,
            accountNumber,
            bicnumber,
            TotalExpenses,
            Purpose,
            PaidTo,
            TotalAmount
        };
        console.log("templateparams", templateParams)

        var recipient = 'example@example.com';
        var subject = 'Hello';
        var body = 'This is the email content.';

        var data = {
            service_id: 'service_me3uxoz',
            template_id: 'template_h4x47op',
            user_id: 'PnSkZC0BI309uKdri',
            template_params: {
                recipient: recipient,
                subject: subject,
                body: body,
                ...templateParams // Include the templateParams in the request
            }
        };
        axios.post('https://api.emailjs.com/api/v1.0/email/send', data)
            .then(function (response) {
                console.log('Email sent successfully:', response.data);
            })
            .catch(function (error) {
                console.log('Error occurred while sending email:', error);
            });
    }

    function sendTaxEmail() {

        const name = taxInfo.Name;
        const TaxId = taxInfo.TaxId;
        const TaxCategory = taxInfo.TaxCategory;
        const SocialSecurity = taxInfo.SocialSecurity;
        const TaxType = taxInfo.TaxType;
        const amount = taxInfo.Amount;

        const templateParams = {
            name, TaxId, TaxCategory, SocialSecurity, TaxType, amount
        };
        console.log("templateparams", templateParams)

        var recipient = 'example@example.com';
        var subject = 'Hello';
        var body = 'This is the email content.';

        var data = {
            service_id: 'service_me3uxoz',
            template_id: 'template_ygfgdvy',
            user_id: 'PnSkZC0BI309uKdri',
            template_params: {
                recipient: recipient,
                subject: subject,
                body: body,
                ...templateParams // Include the templateParams in the request
            }
        };
        axios.post('https://api.emailjs.com/api/v1.0/email/send', data)
            .then(function (response) {
                console.log('Email sent successfully:', response.data);
            })
            .catch(function (error) {
                console.log('Error occurred while sending email:', error);
            });
    }

    // const navigate = useNavigate();

    // const handleClick = () => {
    //   navigate('/about');
    // };




    return (
        <div className="notifybutton">
            {  notify && showButton &&
                <button className="bankEmail" onClick={sendEmail}>Notify Bank</button>}
            { notify && showButton &&
                <button className="taxEmail" onClick={sendTaxEmail}>Notify Tax</button>}
            {/* <button onClick={handleClick}>Go to About Page</button> */}

        </div>

    )

}

export default EmailUpload;
