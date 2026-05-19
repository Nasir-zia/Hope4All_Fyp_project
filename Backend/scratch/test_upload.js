import { Blob } from "buffer";

const run = async () => {
  const formData = new FormData();
  
  // Dummy text file to simulate registrationCert
  const certBlob = new Blob(["dummy cert content"], { type: "application/pdf" });
  formData.append("registrationCert", certBlob, "cert.pdf");

  // Dummy text file to simulate buildingImages
  const imgBlob = new Blob(["dummy img content"], { type: "image/jpeg" });
  formData.append("buildingImages", imgBlob, "building.jpg");

  formData.append("userId", "69fee6d38da209cc3073328d");
  formData.append("name", "Debug Orphanage Upload");
  formData.append("registrationNumber", "REG-UPLOAD-1234");
  formData.append("establishedYear", "2020");
  formData.append("managerName", "Upload Manager");
  formData.append("staffCount", "10");
  formData.append("location[address]", "123 Street");
  formData.append("location[city]", "Faisalabad");
  formData.append("location[state]", "Punjab");
  formData.append("location[zipCode]", "38000");
  formData.append("contactInfo[phone]", "03001234567");
  formData.append("contactInfo[email]", "upload@orphanage.com");
  formData.append("capacity[current]", "0");
  formData.append("capacity[max]", "100");

  try {
    const response = await fetch("http://localhost:5000/api/orphanages/register", {
      method: "POST",
      body: formData
    });
    
    const data = await response.json();
    console.log("Status:", response.status);
    console.log("Response:", JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Fetch error:", err);
  }
};

run();
