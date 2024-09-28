import React, { useState } from "react";
import ReactDOM from "react-dom/client";

const Interaction = () => {
  const [pincode, setPincode] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLookup = async () => {
    // Check if the pincode is valid (6 digits)
    if (pincode.length !== 6 || isNaN(pincode)) {
      setError("Please enter a valid 6-digit pincode.");
      setData(null);
      return;
    }

    setError(""); // Clear any previous errors
    setLoading(true); // Show loader

    // Fetch data from API
    try {
      const response = await fetch(
        `https://api.postalpincode.in/pincode/${pincode}`
      );
      const result = await response.json();

      if (result[0].Status === "Error") {
        setError("No data found for this pincode.");
        setData(null);
      } else {
        setData(result[0].PostOffice); // Store the post office data
      }
    } catch (error) {
      setError("An error occurred while fetching the data.");
    }

    setLoading(false); // Hide loader
  };

  return (
    <div>
      <h1>Enter Pincode</h1>
      <input
        type="text"
        className="input-text"
        placeholder="Pincode"
        value={pincode}
        onChange={(e) => setPincode(e.target.value)}
      />
      <div className="btn">
        <button className="lookup-btn" onClick={handleLookup}>
          Lookup
        </button>
      </div>

      {/* Loader */}
      {loading && <div className="loader"></div>}

      {/* Error Message */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Results */}
      {data && (
        <div className="results">
          <h2>Post Office Details</h2>
          {data.map((office) => (
            <div key={office.Name} className="details">
              <p>
                <strong>Post Office Name:</strong> {office.Name}
              </p>
              <p>
                <strong>Pincode:</strong> {office.Pincode}
              </p>
              <p>
                <strong>District:</strong> {office.District}
              </p>
              <p>
                <strong>State:</strong> {office.State}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const AppLayout = () => {
  return (
    <div>
      <Interaction />
    </div>
  );
};

const root = ReactDOM.createRoot(document.querySelector("#root"));

root.render(<AppLayout />);
