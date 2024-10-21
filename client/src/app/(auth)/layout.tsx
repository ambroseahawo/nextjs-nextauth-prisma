import { Providers } from "@/store/providers";
import { FC, ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout: FC<AuthLayoutProps> = ({ children }) => {
  return (
    <Providers>
      <div className='bg-slate-200 p-10 rounded-md'>{children}</div>
    </Providers>
  )
};

export default AuthLayout;
