'client'

import { useLoading } from "@/hooks/useLoading";
import { IconButton } from "@mui/material";
import { useRouter } from "next/router";
import { useState } from "react";
import { VscLoading, VscRepoFetch } from "react-icons/vsc";

export function FetchButton() {
    const [loading, setLoading] = useLoading();
    const [hasModel, setHasModel] = useState();
    const router = useRouter()
    const fetchModel = async () => {
          try {
            setLoading(true);
            const response = await fetch(`/api/getSwingers`);
            const data = await response.json();
            setLoading(false);
            setHasModel(data);
            router.push(router.asPath)
          } catch (error) {
            console.error("Error fetching data:", error);
          }
    };
    
  

    
    return (
        <>
            {loading  ? <VscLoading /> : <VscRepoFetch />}
            </>
   
    );
  }