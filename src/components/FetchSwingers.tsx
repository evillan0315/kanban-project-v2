'client'

import { useState } from "react";

export function FetchButton() {
    const [loading, setLoading] = useState(false);
    const [hasModel, setHasModel] = useState();
    console.log(hasModel);
    const fetchModel = async () => {
          try {
            setLoading(true);
            const response = await fetch(`/api/getSwingers`);
            const data = await response.json();
            setLoading(false);
            setHasModel(data);
            
          } catch (error) {
            console.error("Error fetching data:", error);
          }
    };
    
  

    
    return (
        <button onClick={fetchModel} disabled={loading}>
            {loading ? "Fetching..." : "Fetch Data"}
        </button>
    );
  }