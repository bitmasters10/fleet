import Heading from "../components/Heading";
import Input from "../components/Input";
import TableManage from "../components/TableManage";



// eslint-disable-next-line react/prop-types
export default function Trip({title, track}) {
  return (
    <div>
      <Heading title={title} track={track}/>
      <div className="xl:max-w-[90%] max-xl:mx-auto  w-full bg-white my-20 dark:bg-gray-800  ">
            <h2 className="mx-4 text-3xl font-semibold px-6 pt-6">{title}</h2>
            <Input title={title}/>
            <TableManage/>
        </div>
    </div>
  )
}

