import React, { useEffect, useState } from "react";
import axios from "axios"; // Ensure axios is installed and imported
import facts from "./sustainabilityFacts";
import "./SustainabilityFact.css";

function SustainabilityFact() {
  const [fact, setFact] = useState("");
  const [factIndex, setFactIndex] = useState(null); // To track the index of the current fact
  const [hasResponded, setHasResponded] = useState(false);
  const [response, setResponse] = useState(null);
  const [stats, setStats] = useState({ knew: 0, didNotKnow: 0 });

  useEffect(() => {
    const index = Math.floor(Math.random() * facts.length);
    setFact(facts[index]);
    setFactIndex(index);
  }, []);

  const handleResponse = async (didKnow) => {
    setResponse(didKnow);
    setHasResponded(true);

    try {
      const { data } = await axios.post("/api/facts/stats", {
        factIndex: factIndex,
        didKnow: didKnow,
      });
      setStats(data); // Assuming the backend returns an object with { knew, didNotKnow }
    } catch (error) {
      console.error("Error submitting fact response:", error);
    }
  };

  return (
    <div className="sustainability-fact">
      <h3>Did You Know?</h3>
      <p>{fact}</p>
      {!hasResponded ? (
        <div className="response-buttons">
          <button onClick={() => handleResponse(true)} className="thumbs-up">
            👍 Yes
          </button>
          <button onClick={() => handleResponse(false)} className="thumbs-down">
            👎 No
          </button>
        </div>
      ) : (
        <div>
          <p className="response">
            <span>You responded:</span>{" "}
            {response ? "Yes, I knew this!" : "No, I didn't know this."}
          </p>
          <p>
            {stats.knew} people knew this, {stats.didNotKnow} did not know this.
          </p>
        </div>
      )}
    </div>
  );
}

export default SustainabilityFact;
