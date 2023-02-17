import React, { useState,useRef } from "react";
import { Link } from 'react-router-dom';
import { toast } from "react-toastify";
import './Admin.css';
import "react-toastify/dist/ReactToastify.css";

const host = "localhost";
const port = 9103;


function Admin()  {
  const fileInputRef = useRef();
  const [selectedFile, setselectedFile] = useState(null) //Used to upload the file
  var [fileName, setFileName] = useState("Choose file") //Used to show the file's name on the button
  
  /*
    onFileChange: When a file is selected, the selectedFile const 
    changes and the fileName variable changes as well
  */
  const onFileChange = (event) => {
    setselectedFile(event.target.files[0]); 
    setFileName(event.target.files[0].name); 
  }
 
  /*
    onFileUpload: When the button is pressed to submit the file,
    it uploads the file to the API through the '/admin/questionnaire_upd' Route
  */
    function handleButtonClick(event) {
    
      event.preventDefault(); // prevent the default behavior of the button
      onFileUpload();
      setselectedFile(null)
    }


   async function onFileUpload () {
    const UploadQuestionnaire_URL = `http://${host}:${port}/intelliq_api/admin/questionnaire_upd`;

    //setFileName("Choose file");
 
    /*
      FormData is an object that is required for the proper upload
      of the file to the API and then to the Database.
    */
    const formData = new FormData();
    formData.append("file", selectedFile);
    
    
   const Fetch_Url="http://localhost:9103/intelliq_api/fetchquestionnaires"
    
    var response1=  await fetch(Fetch_Url, {
      method: "POST",
      headers: {
        "Content-Type": 'application/x-www-form-urlencoded',
      },
    })
     
      

    
    var qnumber=await response1.json()
    
    /*
      All the requests to the API
      were made with the fetch() funtion that is inate
      to ReactJS. mode: 'no-cors' data is used due to a
      CORS issue that appeared.So inorder to understand if the upload was 
      successful we count the number of questionnaires before and after the upload.
      If they are the same we assume that the upload failed.
    */
    try{
    var response2= await fetch(UploadQuestionnaire_URL, {
      method: "POST",
      mode: 'no-cors',
      body: formData,
      headers: {
        "Content-Type": "multipart/form-data; boundary=${formData._boundary}",
      },
    })
  }catch(error){ //catches fatal errors
    setFileName("Choose File")
    fileInputRef.current.value = "";
    toast.error('Not a questionnaire! Danger!', {
      position: toast.POSITION.TOP_CENTER,
      autoClose: 2000,});
      return;

    };
    var response3=  await fetch(Fetch_Url, {
      method: "POST",
      headers: {
        "Content-Type": 'application/x-www-form-urlencoded',
      },
    })
    var qnumberafter=await response3.json()
    
    
      if (qnumberafter.length!==qnumber.length) {
      /*
        toast.success is used to make a success message appear,
        informing the admin that the upload was successful.
        2 seconds later it disappears.
      */
        toast.success("Upload succeeded!", {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 2000, 
        })
        setselectedFile(null)
      }
      else{
        /*
          toast.error is used to make an error message appear,
          informing the admin that the upload was unsuccessful.
          2 seconds later it disappears.
       */ 
        if(selectedFile===null){ //if the upload failed due to no file selection
          toast.error("Select a file!", {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 2000,})
        }
        else{
        toast.error("Upload failed!", {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 2000,})}
        setselectedFile(null)
      }
      setFileName("Choose File")
      fileInputRef.current.value = ""; //reset the input
      
    }
  
  
  
  /*
    handleDelete: it is used to delete all questionnaires
    that currently exist in the database using the 
    /admin/resetall Route of the API. no-cors is used for the
    same issues as onFileUpload
  */
  const handleDelete=()=>{
    const DeleteAllQuestionnaires_URL = `http://${host}:${port}/intelliq_api/admin/resetall`;
    
    fetch(DeleteAllQuestionnaires_URL, {
      method: 'POST',
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
    .then(response => {
      if (response.ok) {
        toast.success("All questionnaires deleted!", {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 2000, 
      })
      }
      else{
        toast.error("Delete questionnaires failed!", {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 2000,})
      }
    })
    .catch(error => {
      toast.error('Delete questionnaires failed!', {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 2000,});
      });
  }
       
  

  return (
    <div>
      {/*
        This div is used so that there is space between
        the top of the screen and the buttons
      */}
      <div style={{ height: '150px'}}></div>
      <center>
        {/* 
          The form is used to organise the selection of the file (onFileChange) and
          the POST of the file towards the database (onFileUpload)
        */}
        <form method="post" encType="multipart/form-data" onSubmit={handleButtonClick} >
          {/* 
            The table here is used for better formatting
          */}
          <table>
            <thead>
              <tr>
                <td>
                  <label htmlFor="file-input">
                    {/* 
                      Used for the button you press to choose a file
                    */}
                    <span className="button custom-file-upload">{fileName}</span> 
                  </label>
                  {/* 
                    Needed for input but used for the selection of the file
                  */}
                  <input type="file" id="file-input" onChange={onFileChange} style={{ display: "none" }} ref={fileInputRef} />
                </td>
                <td>
                  <center>
                    {/* 
                      Used for the button you press to upload the file
                    */}
                    <button className="button blueColor" type="submit">Upload</button>
                  </center>
                </td>
              </tr>            
            </thead>
          </table>
        </form>
      </center>
      
      {/* 
        Used as the Delete All button, calls handleDelete on click
      */}
      <center>
        <button className="button redColor" onClick={handleDelete}>Delete All</button>
      </center>
      <br/>
      {/* 
        Used to change pages and go to the page that the admin can select
        questionnaires, export them, delete their answers and has button
        that leads to the graphs and statistics of said questionnaire
      */}
      <center>
        <Link to={`/Admin/Questionnaires`}> 
          <button className="button" >SelectQuestionnaires</button>
        </Link>
      </center>
      {/* 
        Leads back to Homepage, in case they want to fill a Questionnaire
      */}
      <center>
        <Link to={`/`}>
          <button className="button" >Homepage</button>
        </Link>
      </center>
    </div>
    );

}

export default Admin;