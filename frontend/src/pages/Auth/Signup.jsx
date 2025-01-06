

import { useState } from 'react';

import { Link } from 'react-router-dom';


// eslint-disable-next-line react/prop-types
export default function SignupForm({setIsAuthenticated}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    try {
      setError('');
      setLoading(true);
      setIsAuthenticated(true)
     
    } catch (error) {
      setError('Failed to create account: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Lay>
      <Background>
        <img
          src="/undraw.svg"
          width={200}
          height={200}
          alt="signup-icon"
          className="z-50 w-80 h-80 px-30 md:h-full md:w-90 md:h-90 lg:w-96 lg:h-96 lg:mt-28 xl:w-[30vw] xl:h-[30vh] xl:mt-36"
        />
      </Background>

      <form
        onSubmit={handleSubmit}
        className="container-sm px-7 mt-[90px] md:mt-[180px] lg:pt-[50px] md:w-full lg:mt-0 lg:rounded-r-2xl lg:px-16 lg:py:9 xl:w-[60vw] lg:shadow-[0px_0px_9px_0px_rgba(194,194,194,1)] lg:bg-white dark:lg:bg-slate-900"
      >
        <Heading heading="Signup" />
        {error && <p className="text-red-500 text-sm text-center mb-2 mx-3">{error}</p>}
        <InpFieldLay>
          <Username name={name} onName={setName}/>
          <Email
            email={email} onEmail={setEmail}
          />
          <Password
            password={password} onPassword={setPassword}
          />
           <ConfirmPassword
            confirmPassword={confirmPassword} onConfirmPassword={setConfirmPassword}
            />
          <Button loading={loading} />
        </InpFieldLay>

      </form>
    </Lay>
  );
} 


// eslint-disable-next-line react/prop-types
function Username({name, onName}) {
  return (
    <div>
    <div className="relative">
      <input
        type="text"
       value={name}
      onChange={(e)=>{onName(e.target.value)}} 
      
        className="peer py-3 px-4 ps-11 rounded-full block w-full border-b-2 text-sm focus:border-b-none focus:ring-blue-500"
        placeholder="Username"
      />
      <div className="absolute inset-y-0 start-0 flex items-center ps-4">
        <svg
          className="shrink-0 size-4 text-gray-500"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
      </div>
      
    </div>

    </div>
  );
}




// eslint-disable-next-line react/prop-types
function Email({email, onEmail}) {
  return (
    <div>
    <div className="relative">
      <input
        type="email"
        value={email}
        onChange={(e)=>{onEmail(e.target.value)}} 
       
        className="peer py-3 px-4 ps-11 rounded-full block w-full border-b-2 text-sm focus:border-b-none focus:ring-blue-500"
        placeholder="Email"
      />
      <div className="absolute inset-y-0 start-0 flex items-center ps-4">
        <img src="/email-icon.svg" alt="email-icon" width={20} height={20} className="w-4 h-4" />
      </div>
     
    </div>
   
     </div>
  );
}

// eslint-disable-next-line react/prop-types
function Password({password, onPassword}) {
  return (
    <div>
    <div className="relative">
      <input
        type="password"
        value={password}
        onChange={(e)=>{onPassword(e.target.value)}} 
       
        className="peer py-3 px-4 ps-11 rounded-full block w-full border-b-2 text-sm focus:border-b-none focus:ring-blue-500"
        placeholder="Password"
      />
      <div className="absolute inset-y-0 start-0 flex items-center ps-4">
        <svg
          className="shrink-0 size-4 text-gray-500"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
        >
          <path d="M2 18v3c0 .6.4 1 1 1h4v-3h3v-3h2l1.4-1.4a6.5 6.5 0 1 0-4-4Z"></path>
          <circle cx="16.5" cy="7.5" r=".5"></circle>
        </svg>
      </div>
     
    </div>
   
      </div>
  );
}



// eslint-disable-next-line react/prop-types
function ConfirmPassword({confirmPassword, onConfirmPassword}) {
  return (
    <div>
    <div className="relative">
      <input
        type="password"
        value={confirmPassword}
        onChange={(e)=>{onConfirmPassword(e.target.value)}} 
        className="peer py-3 px-4 ps-11 rounded-full block w-full border-b-2 text-sm focus:border-b-none focus:ring-blue-500"
        placeholder="Confirm Password"
      />
      <div className="absolute inset-y-0 start-0 flex items-center ps-4">
        <svg
          className="shrink-0 size-4 text-gray-500"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
        >
          <path d="M2 18v3c0 .6.4 1 1 1h4v-3h3v-3h2l1.4-1.4a6.5 6.5 0 1 0-4-4Z"></path>
          <circle cx="16.5" cy="7.5" r=".5"></circle>
        </svg>
      </div>
     
    </div>
   
      </div>
  );
}

// eslint-disable-next-line react/prop-types
function Button({loading}) {
  return (
    <>
     <button
     type="submit"
     disabled={loading}
  className="w-full rounded-full text-xl h-11  bg-[#FF6500] text-white relative overflow-hidden group z-10 hover:text-white duration-1000"
>
  <span
    className="absolute bg-orange-600 w-full h-36 rounded-full group-hover:scale-100 scale-0 -z-10 -left-2 -top-10 group-hover:duration-500 duration-700 origin-center transform transition-all"
  ></span>
  <span
    className="absolute bg-orange-800 w-full h-36 -left-0 -top-10 rounded-full group-hover:scale-100 scale-0 -z-10 group-hover:duration-700 duration-500 origin-center transform transition-all"
  ></span>
 {loading ? 'Creating Account...' : 'Signup'}
</button>
      <p className="text-sm font-light text-gray-500 dark:text-gray-400">
        Already have an account?{" "}
        <Link
          to="/login"
          className="font-medium text-primary-600 hover:underline dark:text-primary-500 underline"
        >
          Login
        </Link>
      </p>
    </>
  );
}
// eslint-disable-next-line react/prop-types
function Heading({ heading }) {
  return (
    <h1 className="text-3xl text-center py-7 pb-8 antialiased font-semibold font-sans">
      {heading}
    </h1>
  );
}
// eslint-disable-next-line react/prop-types
function InpFieldLay({ children }) {
  return (
    <div className="max-w-2xl md:max-w-md  lg:max-w-lg xl:max-w-xl space-y-6">
      {children}
    </div>
  );
}

// eslint-disable-next-line react/prop-types
function Lay({ children }) {
  return (
    <div className="md:flex md:flex-row md:align-middle md:justify-center lg:mx-20 lg:my-20 lg:mb-10 xl:mx-40  xl:my-20 xl:mb-20 ">
      {children}
    </div>
  );
}

// eslint-disable-next-line react/prop-types
function Background({children}){
  return <div className=" container-sm bg-[url('/pattern.svg')] w-full h-[70vh] rounded-es-full rounded-ee-full text-center flex justify-center md:w-50 max-md:h-[15vh]  md:rounded-es-none md:rounded-ee-none lg:w-full max-lg:h-[100vh] lg:rounded-l-2xl lg:shadow-[0px_0px_9px_0px_rgba(194,194,194,1)]">
    {children}
  </div>
  
}


