import { decode } from "punycode";
import { setupApiClient } from "../services/api";
import { withSSRAuth } from "../utils/withSSRAuth";

export function Metrics() {
  

  return (
    <>
      <h1>Metrics</h1>
      
    </>
  )
};

export const getServerSideProps = withSSRAuth(async (context) => {
  const apiClient = setupApiClient(context);

  const response = await apiClient.get('/me');
  

  return {
    props: {},
   }
  }, {
    permissions: ['metrics.list'],
    roles: ['administrator'],
  }
);