import React, { useState } from "react";
import './Admin.css'
import { Link } from 'react-router-dom';
const host = "localhost"
const port = 9103
const ResetAll_URL = `http://${host}:${port}/intelliq_api/admin/resetall`;
const Upload_URL = `http://${host}:${port}/intelliq_api/admin/questionnaire_upd`;
//const { answers } = this.state;
var id = "QQ001";


function Admin()  {
  const [selectedFile, setselectedFile] = useState(null)
  
  
  const onFileChange = (event) => {setselectedFile(event.target.files[0]) }
 
  const  onFileUpload = (event) => {
    event.preventDefault();

   // const { selectedFile } = this.state;
    const formData = new FormData();
    formData.append("file", selectedFile);

    fetch(Upload_URL, {
      method: "POST",
      mode: 'no-cors',
      body: formData,
      headers: {
        "Content-Type": "multipart/form-data; boundary=${formData._boundary}",
      },
    })
  }
  
  const handleDelete=()=>{
  
    fetch(ResetAll_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })     
  }

  

 

    return (
      <div>
      <form method="post" encType="multipart/form-data" onSubmit={onFileUpload} >
        <label htmlFor="file-input">
          <span className="custom-file-upload">Choose File</span>
        </label>
        <input type="file" id="file-input" onChange={onFileChange} style={{ display: "none" }} />
        <button className="submit" type="submit">Upload</button>
      </form>
      <button className="delete" onClick={handleDelete}>Delete All</button>
      <br/>
      <Link to={`/Admin/Questionnaires`}> <button className="nextPage" >Questionnaires</button></Link>
    </div>
    );
  
}

export default Admin;