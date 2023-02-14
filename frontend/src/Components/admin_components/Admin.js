import React, { useState } from "react";
import './Admin.css';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const host = "localhost";
const port = 9103;
const ResetAll_URL = `http://${host}:${port}/intelliq_api/admin/resetall`;
const Upload_URL = `http://${host}:${port}/intelliq_api/admin/questionnaire_upd`;


function Admin()  {
  const [selectedFile, setselectedFile] = useState(null)
  var [fileName, setFileName] = useState("Choose file")  
  
  const onFileChange = (event) => {setselectedFile(event.target.files[0]); setFileName(event.target.files[0].name); }
 
  const  onFileUpload = (event) => {
    setFileName("Choose file");
    event.preventDefault();

   // const { selectedFile } = this.state;
    const formData = new FormData();
    formData.append("file", selectedFile);
    try{
    fetch(Upload_URL, {
      method: "POST",
      mode: 'no-cors',
      body: formData,
      headers: {
        "Content-Type": "multipart/form-data; boundary=${formData._boundary}",
      },
    })
    .then(
      toast.success("Upload succeeded!", {
      position: toast.POSITION.TOP_CENTER,
      autoClose: 2000, // The message will automatically close after 2 seconds
      
    }));
  }
  catch(error){
    console.error(error).then(
      toast.success("Upload failed!", {
      position: toast.POSITION.TOP_CENTER,
      autoClose: 2000, // The message will automatically close after 2 seconds
      
    }));
  }
  }
  
  const handleDelete=()=>{
  
    try{
    fetch(ResetAll_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
    .then(
      toast.success("All questionnaires deleted!", {
      position: toast.POSITION.TOP_CENTER,
      autoClose: 2000, 
      
    }))
  }
  catch(error){
    console.error(error).then(
      toast.success("Delete questionnaires failed!", {
      position: toast.POSITION.TOP_CENTER,
      autoClose: 2000, // The message will automatically close after 2 seconds
      
    }));
  }
       
  }

    return (
      <div>
        <div style={{ height: '200px'}}></div>
      <center><form method="post" encType="multipart/form-data" onSubmit={onFileUpload} >
        <table>
          <thead>
          <tr>
        <td><label htmlFor="file-input">
          <span className="button custom-file-upload">{fileName}</span>
        </label>
        <input type="file" id="file-input" onChange={onFileChange} style={{ display: "none" }} /></td>
        <td><center><button className="button" type="submit">Upload</button></center></td>
        </tr>
        
        </thead>
        </table>
      </form></center>
      
      <ToastContainer/>
        
      <center><button className="button redColor" onClick={handleDelete}>Delete All</button></center>
      <br/>
      <center><Link to={`/Admin/Questionnaires`}> <button className="button blueColor" >Questionnaires</button></Link></center>
    </div>
    );
  
}

export default Admin;