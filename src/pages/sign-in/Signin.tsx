import { FC, useEffect } from 'react';

import classes from './Signin.module.scss';
import SigninForm from './components/sign-in-form/SigninForm';

interface ISigninPageProps {
  toggleAuthMode: () => void;
}

const SigninPage: FC<ISigninPageProps> = ({ toggleAuthMode }) => {
  return (
    <div className={classes.inner}>
      <img className={classes.logo} src='/logo.png' alt='logo' />
      <SigninForm />
      <button className={classes.alreadyButton} onClick={toggleAuthMode}>
        Don't have an account? Sign up
      </button>
    </div>
  );
};

export default SigninPage;
