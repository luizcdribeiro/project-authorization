import { destroyCookie } from "nookies";
import { useContext, useEffect } from "react"
import { Can } from "../components/Cant";
import { AuthContext } from "../contexts/AuthContext"
import { useCan } from "../hooks/useCan";
import { setupApiClient } from "../services/api";
import { api } from '../services/apiClient'
import { AuthTokenError } from "../services/errors/AuthTokenErro";
import { withSSRAuth } from "../utils/withSSRAuth";

export function Dashboard() {
  const { user, signOut } = useContext(AuthContext);

  

  useEffect(() => {
    api.get('/me')
    .then(response => console.log(response))
  , []});

  return (
    <>
      <h1>Dashboard: {user?.email}</h1>
      <button onClick={signOut}>Sign out</button>
      <Can permissions={['metrics.list']}>
        <div>Métricas</div>
      </Can>
    </>
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