import React, { Fragment, useState , useEffect} from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import emailjs from "emailjs-com";
import EmailUpload from './EmailUpload';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry';
import "./style.css";

pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

const PDFUploader = ({ isLoggedIn, setIsLoggedIn, renderForm, fileDetails, setFileDetails , isLoggedOut , setLoggedOut}) => {
  const [file, setFile] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [text, setText] = useState('');
  const [bankInfo, setBankInfo] = useState({ Name: null, IBAN: null, BIC: null, TotalExpenses: null, PaidTo: null, TotalAmount: null, Purpose: null });
  const [taxInfo, setTaxInfo] = useState({ Name: null, TaxId: null, TaxCategory: null, SocialSecurity: null, TaxType: null, Amount: null });
  const [flag, setFlag] = useState(false)
  const [taxFlag, setTaxFlag] = useState(false)
  const [showButton, setShowButton] = useState(false)
  const [notify, setNotify] = useState(false)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);


  useEffect(() => {
    if (showSuccessMessage) {
      const timer = setTimeout(() => {
        setShowSuccessMessage(false);
      }, 1000);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [showSuccessMessage]);

  const handleLogout = () => {
    setIsLoggedIn(false);
    setFile(null);
    setNumPages(null);
    setText('');
    setBankInfo({ Name: null, IBAN: null, BIC: null, TotalExpenses: null, PaidTo: null, TotalAmount: null, Purpose: null });
    setTaxInfo({ Name: null, TaxId: null, TaxCategory: null, SocialSecurity: null, TaxType: null, Amount: null });
    setFlag(false);
    setTaxFlag(false);
    setShowButton(false);
    setNotify(false);
    setFileDetails(false);
    setLoggedOut(false);
    setShowSuccessMessage(true);
  };


  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
  };

  const handleUpload = () => {
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      const arrayBuffer = reader.result;
      const pdfData = new Uint8Array(arrayBuffer);

      pdfjs.getDocument(pdfData).promise.then((pdf) => {
        const totalNumPages = pdf.numPages;
        setNumPages(totalNumPages);

        let extractedText = '';

        const extractPageText = async (pageNum) => {
          const page = await pdf.getPage(pageNum);
          const textContent = await page.getTextContent();

          const items = textContent.items.map((item) => item.str);
          extractedText += items.join(" * ");

          extractedText += '\n'; // Add line break between pages

          if (pageNum < totalNumPages) {
            await extractPageText(pageNum + 1);
          } else {
            setText(extractedText);
            console.log("extracted", extractedText);
          }
        };

        extractPageText(1);

      });
    };

    reader.readAsArrayBuffer(file);
    setShowButton(true)
  };

  function extractNameAndIBAN(text) {
    const keywords = {
      Name: /Name\s*:\s*([^:**]+)/i,
      IBAN: /IBAN\s*:\s*([^:**]+)/i,
      BIC: /BIC\s*:\s*([^:**]+)/i,
      TotalExpenses: /Total Expenses\s*:\s*([^:**]+)/i,
      Purpose: /Purpose\s*:\s*([^:**]+)/i,
      PaidTo: /Paid to\s*:\s*([^:**]+)/i,
      TotalAmount: /Total Amount\s*:\s*([^:**]+)/i,
      TaxId: /Tax ID\s*:\s*([^:**]+)/i,
      TaxCategory: /Tax Category\s*:\s*([^:**]+)/i,
      SocialSecurity: /Social Security\s*:\s*([^:**]+)/i,
      TaxType: /Tax Type\s*:\s*([^:**]+)/i,
      Amount: /Amount\s*:\s*([^:**]+)/i,
    };

    const result = {
      Name: null,
      IBAN: null,
      BIC: null,
      TotalExpenses: null,
      PaidTo: null,
      Purpose: null,
      TotalAmount: null,
      TaxId: null,
      TaxCategory: null,
      SocialSecurity: null,
      TaxType: null,
      Amount: null
    };

    // Search for name
    const NameMatch = text.match(keywords.Name);
    if (NameMatch) {
      result.Name = NameMatch[1].trim().replace(/([.?!])\s+/g, "$1\n");
    }

    // Search for IBAN number
    const IBANMatch = text.match(keywords.IBAN);
    if (IBANMatch) {
      result.IBAN = IBANMatch[1].trim().replace(/([.?!])\s+/g, "$1\n");
    }

    //Search for bic
    const PaidToMatch = text.match(keywords.PaidTo);
    if (PaidToMatch) {
      result.PaidTo = PaidToMatch[1].trim().replace(/([.?!])\s+/g, "$1\n");
    }

    const PurposeMatch = text.match(keywords.Purpose);
    if (PurposeMatch) {
      result.Purpose = PurposeMatch[1].trim().replace(/([.?!])\s+/g, "$1\n");
    }

    const TotalExpensesMatch = text.match(keywords.TotalExpenses);
    if (TotalExpensesMatch) {
      result.TotalExpenses = TotalExpensesMatch[1].trim().replace(/([.?!])\s+/g, "$1\n");
    }

    const TotalAmountMatch = text.match(keywords.TotalAmount);
    if (TotalAmountMatch) {
      result.TotalAmount = TotalAmountMatch[1].trim().replace(/([.?!])\s+/g, "$1\n");
    }

    const BICMatch = text.match(keywords.BIC);
    if (BICMatch) {
      result.BIC = BICMatch[1].trim().replace(/([.?!])\s+/g, "$1\n");
    }

    const TaxIDMatch = text.match(keywords.TaxId);
    if (TaxIDMatch) {
      result.TaxId = TaxIDMatch[1].trim().replace(/([.?!])\s+/g, "$1\n");
    }

    const TaxCategoryMatch = text.match(keywords.TaxCategory);
    if (TaxCategoryMatch) {
      result.TaxCategory = TaxCategoryMatch[1].trim().replace(/([.?!])\s+/g, "$1\n");
    }

    const SocialSecurityMatch = text.match(keywords.SocialSecurity);
    if (SocialSecurityMatch) {
      result.SocialSecurity = SocialSecurityMatch[1].trim().replace(/([.?!])\s+/g, "$1\n");
    }

    const TaxTypeMatch = text.match(keywords.TaxType);
    if (TaxTypeMatch) {
      result.TaxType = TaxTypeMatch[1].trim().replace(/([.?!])\s+/g, "$1\n");
    }

    const AmountMatch = text.match(keywords.Amount);
    if (AmountMatch) {
      result.Amount = AmountMatch[1].trim().replace(/([.?!])\s+/g, "$1\n");
    }
    return result;
  }


  const handleBankUpload = () => {
    const extractedBankDetails = text;
    const extractedInfo = extractNameAndIBAN(extractedBankDetails);
    setBankInfo(extractedInfo);
    setFlag(true);
  }

  const handleTaxUpload = () => {
    const extractedBankDetails = text;
    const extractedInfo = extractNameAndIBAN(extractedBankDetails);
    setTaxInfo(extractedInfo);
    setTaxFlag(true);
    setNotify(true);
  }


  return (
    <div className="scrollable-container">
      <div>
        {fileDetails && (
          <div>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload</button>
          </div>
        )}
        {text && (
          <div>
            <h2 className="successMessage">   Uploaded Successfully!</h2>
          </div>
        )}
      </div>
      <div className="button-wrapper">
        <div className="button-container" >
          {showButton &&
            <button className="BankButton" onClick={handleBankUpload}>Bank Details</button>}
          {flag &&

            <div className="BankInfo" >
              <li> Name : {bankInfo.Name}</li>
              <li>IBAN : {bankInfo.IBAN}</li>
              <li>BIC : {bankInfo.BIC}</li>
              <li>Total Expenses : {bankInfo.TotalExpenses}</li>
              <li>Purpose : {bankInfo.Purpose}</li>
              <li>Paid to : {bankInfo.PaidTo}</li>
              <li>Total Amount : {bankInfo.TotalAmount}</li>
            </div>

          }

          {showButton &&
            <button className="TaxButton" onClick={handleTaxUpload}>Tax Details</button>}
          {taxFlag &&

            <div className="TaxInfo" >
              <li> Name : {taxInfo.Name}</li>
              <li>Tax Id : {taxInfo.TaxId}</li>
              <li>Tax Category : {taxInfo.TaxCategory}</li>
              <li>Tax Type : {taxInfo.TaxType}</li>
              <li>Amount : {taxInfo.Amount}</li>

            </div>

          }

        </div>

        <div className="lom">
        {showSuccessMessage && <p>Logout successful!</p>}
          
          {!isLoggedIn ? (
            renderForm
          ) : (
            ""
          )} 

        </div>
      </div>
      <EmailUpload bankInfo={bankInfo} taxInfo={taxInfo} showButton={showButton} setNotify={setNotify} notify={notify} />
    </div>

  );
};

export default PDFUploader;
