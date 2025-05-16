import React, { useState } from "react";
import "./FileUploadForm.css";

const webhookUrl = process.env.REACT_APP_N8N_WEBHOOK;
const resultLink =
  "https://docs.google.com/spreadsheets/d/1uqq8hDkg352Ska1jvgCeDQURM69AMRNTp1cH8BD8Qcs/edit?usp=sharing";

const FileUploadForm = () => {
  const [scorecard, setScorecard] = useState(null);
  const [cv, setCv] = useState(null);
  const [message, setMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!scorecard || !cv) {
      setMessage("Please select both files.");
      return;
    }

    setIsUploading(true);
    setMessage("");

    const formData = new FormData();
    formData.append("scorecard", scorecard);
    formData.append("cv", cv);

    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        body: formData,
      });

      const result = await response.text();

      if (!response.ok) {
        throw new Error(result || "Upload failed");
      }

      setMessage(`✅ Upload successful - Result: ${resultLink}`);
    } catch (error) {
      setMessage(`❌ Error: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="upload-container">
      <h2>CV Grader</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="scorecard">Scorecard (PDF):</label>
          <input
            type="file"
            id="scorecard"
            accept="application/pdf"
            onChange={(e) => setScorecard(e.target.files[0])}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="cv">Candidate CV (PDF):</label>
          <input
            type="file"
            id="cv"
            accept="application/pdf"
            onChange={(e) => setCv(e.target.files[0])}
            required
          />
        </div>

        <button type="submit" disabled={isUploading}>
          {isUploading ? "Uploading..." : "Upload"}
        </button>

        {isUploading && <div className="spinner"></div>}

        {message && <p className="message">{message}</p>}
      </form>
    </div>
  );
};

export default FileUploadForm;
