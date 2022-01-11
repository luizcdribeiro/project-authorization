import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { destroyCookie, parseCookies } from "nookies";
import { AuthTokenError } from "../services/errors/AuthTokenErro";

export function withSSRAuth<P>(fn: GetServerSideProps<P>): GetServerSideProps {

 return async (context: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>> => {

  const cookies = parseCookies(context);

  if(!cookies['projectauth.token']) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      }
    }
  }

  try {
    return await fn(context);
  } catch(err) {
    if(err instanceof AuthTokenError) {
      destroyCookie(context, 'projectauth.token');
      destroyCookie(context, 'projectauth.refreshToken');

      return {
        redirect: {
          destination: '/',
          permanent: false,
        }
      }
    }
  }

 }
}