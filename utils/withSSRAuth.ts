import decode from 'jwt-decode';
import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { destroyCookie, parseCookies } from "nookies";
import { AuthTokenError } from "../services/errors/AuthTokenErro";
import { validateUserPermissions } from './validateUserPermissions';

type withSSRAuthOptions = {
  permissions?: string[];
  roles?: string[];

}

export function withSSRAuth<P>(fn: GetServerSideProps<P>, options?: withSSRAuthOptions): GetServerSideProps {

 return async (context: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>> => {

  const cookies = parseCookies(context);
  const token = cookies['projectauth.token'];

  if(!token) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      }
    }
  }

  if(options) {
    const user = decode<{permissions: string[], roles: string[]}>(token);
    const { roles, permissions } = options;

    const userHasValidPermissions = validateUserPermissions({
      user,
      permissions,
      roles
    })

    if(!userHasValidPermissions) {
      return {
        redirect: {
          destination: '/dashboard',
          permanent: false,
        }
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