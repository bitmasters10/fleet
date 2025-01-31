import { useState } from "react";
import {  useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [value , setValue] = useState("Admin")
  const { login , loginAdmin } = useAuth(); // Extract the login function from AuthContext
  const navigate = useNavigate();
 
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let success;
      if (value === "SAdmin") {
        success = await login(email, password);
      } else if (value === "Admin") {
        success = await loginAdmin(email, password);
      }
    
      if (success) {
        navigate("/dashboard");
      } else {
        throw new Error("Failed to sign in. Please check your credentials.");
      }
    } catch (err) {
      setError(err.message || "An error occurred. Please try again.");
      console.error(err);
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
          className="z-50 w-80 h-80 px-30 md:h-full md:w-90 md:h-90 lg:w-96 lg:h-96 lg:mt-28 xl:w-[30vw] xl:h-[30vh] xl:mt-36"
          alt="Illustration"
        />
      </Background>

      <form
        onSubmit={handleSubmit}
        className="w-full container-sm px-7 mt-[90px] md:mt-[180px] lg:pt-[50px] md:w-full lg:mt-0 lg:rounded-r-2xl lg:px-16 lg:py:9 xl:w-[60vw] lg:shadow-[0px_0px_9px_0px_rgba(194,194,194,1)] lg:bg-white dark:lg:bg-slate-900"
      >
        <Heading heading="Login" />
        {error && (
          <p className="text-red-500 text-sm text-center mb-2 mx-3">{error}</p>
        )}

        <InpFieldLay>
          <Radio value={value} onRadio={setValue} />
          <Email email={email} onEmail={setEmail} />
          <Password password={password} onPassword={setPassword} />
          <Button loading={loading} />
        </InpFieldLay>
      </form>
    </Lay>
  );
}
// eslint-disable-next-line react/prop-types
function Button({ loading }) {
  return (
    <>
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full text-xl h-11  bg-[#FF6500] text-white relative overflow-hidden group z-10 hover:text-white duration-1000"
      >
        <span className="absolute bg-orange-600 w-full h-36 rounded-full group-hover:scale-100 scale-0 -z-10 -left-2 -top-10 group-hover:duration-500 duration-700 origin-center transform transition-all"></span>
        <span className="absolute bg-orange-800 w-full h-36 -left-0 -top-10 rounded-full group-hover:scale-100 scale-0 -z-10 group-hover:duration-700 duration-500 origin-center transform transition-all"></span>
        {loading ? "Logging in..." : "Login"}
      </button>

     
    </>
  );
}

// Other components stay the same...

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
    <div className="md:flex md:flex-row md:align-middle md:justify-center lg:mx-20 lg:my-20 lg:mb-10 xl:mx-40  xl:my-20 xl:mb-20 h-[70vh] ">
      {children}
    </div>
  );
}

// eslint-disable-next-line react/prop-types
function Background({ children }) {
  return (
    <div className=" container-sm bg-[url('/pattern.svg')] w-full h-[70vh] rounded-es-full rounded-ee-full text-center flex justify-center md:w-50 max-md:h-[15vh]  md:rounded-es-none md:rounded-ee-none lg:w-full max-lg:h-[100vh] lg:rounded-l-2xl lg:shadow-[0px_0px_9px_0px_rgba(194,194,194,1)]">
      {children}
    </div>
  );
}

// eslint-disable-next-line react/prop-types
function Email({ email, onEmail }) {
  return (
    <>
      <div className="relative ">
        <input
          type="email"
          value={email}
          onChange={(e) => onEmail(e.target.value)}
          className="peer py-3  px-4 ps-11 rounded-full block w-full dark:border-none border-b-2  text-sm focus:border-b-none focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
          placeholder="Email"
        />
        <div className="absolute  inset-y-0 start-0 flex items-center pointer-events-none ps-4 peer-disabled:opacity-50 peer-disabled:pointer-events-none">
          <img
            src="/email-icon.svg"
            alt="Rsd"
            width={20}
            height={20}
            className="w-4 h-4"
          />
        </div>
      </div>
    </>
  );
}

// eslint-disable-next-line react/prop-types
function Password({ password, onPassword }) {
  return (
    <>
      <div className="relative ">
        <input
          type="password"
          value={password}
          onChange={(e) => onPassword(e.target.value)}
          className="peer py-3 px-4 ps-11 block w-full  border-b-2 dark:border-none rounded-full text-sm focus:border-b-none focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
          placeholder="Password"
        />
        <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none ps-4 peer-disabled:opacity-50 peer-disabled:pointer-events-none">
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
    </>
  );
}

// eslint-disable-next-line react/prop-types
function Radio({ onRadio}) {
  return (
    <div className="flex justify-between">
      <div className="flex items-center ps-4 border border-[#FF6500] rounded dark:border-[#FF6500] w-72 rounded-r-none">
        <input
          defaultChecked
          id="bordered-radio-1"
          type="radio"
          value="Admin"
          onChange={(e)=> onRadio(e.target.value)}
          name="bordered-radio"
          className="w-4 h-4   text-gray-900 bg-gray-100 border-[#FF6500] focus:ring-white dark:focus:ring-transparent dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
        />
        <label
          htmlFor="bordered-radio-1"
          className=" w-full py-4 ms-2 text-sm font-medium text-black dark:text-gray-300"
        >
          Admin
        </label>
      </div>
      <div className="flex items-center ps-4 border border-[#FF6500] rounded dark:border-[#FF6500] w-72 rounded-l-none">
        <input
          id="bordered-radio-2"
          type="radio"
          value="SAdmin"
          onChange={(e)=> onRadio(e.target.value)}

          name="bordered-radio"
          className=" w-4 h-4 text-black bg-gray-100 border-gray-300 focus:ring-white dark:focus:ring-transparent dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
        />
        <label
          htmlFor="bordered-radio-2"
          className="w-full py-4 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
        >
          Super Admin
        </label>
      </div>
    </div>
  );
}
