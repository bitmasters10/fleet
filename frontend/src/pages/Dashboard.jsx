import Heading from "../components/Heading";


// eslint-disable-next-line react/prop-types
export default function Dashboard({title ,track}) {
  return (
    <div>
      <Heading title={title} track={track}/>

    </div>
  )
}

