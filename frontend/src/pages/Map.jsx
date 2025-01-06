import Heading from "../components/Heading";
import Input from "../components/Input";


// eslint-disable-next-line react/prop-types
export default function Map({title, track}) {
  return (
    <div>
      <Heading title={title} track={track}/>
      <div className="flex justify-between items-center  my-11 xl:max-w-[90%] max-xl:mx-auto  max-w-screen-full">
        <div className="max-w-[50%] bg-black">
          {/* yahape map add krna he aur niche ka part hatana he */}
        <div className="flex items-center">
            Trips
        </div>
        {/* sirf itna */}
        </div>
        <div className="bg-white w-full xl:w-[20vw] h-[60vh] border-2 border-black dark:bg-gray-800 dark:border-white rounded-2xl">
        <h2 className="mx-4 text-3xl font-semibold px-3 pt-6">Trips</h2>
        <Input title="Trip"/>
        <div className="flex items-center justify-center">
            NO ONGOING TRIPS👋🏻
        </div>
        </div>
      </div>
    </div>
  )
}
