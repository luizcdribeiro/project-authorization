import { destroyCookie } from "nookies";
import { useContext, useEffect } from "react"
import { AuthContext } from "../contexts/AuthContext"
import { setupApiClient } from "../services/api";
import { api } from '../services/apiClient'
import { AuthTokenError } from "../services/errors/AuthTokenErro";
import { withSSRAuth } from "../utils/withSSRAuth";

export function Dashboard() {
  const { user } = useContext(AuthContext);

  useEffect(() => {
    api.get('/me')
    .then(response => console.log(response))
    .catch(error => console.log(error))
  , []});

  return (
    <h1>Dashboard: {user?.email}</h1>
  )
};

export const getServerSideProps = withSSRAuth(async (context) => {
  const apiClient = setupApiClient(context);

  const response = await apiClient.get('/me');
  
  console.log(response)

  return {
    props: {
      
    }
  }
})