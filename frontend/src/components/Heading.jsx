// eslint-disable-next-line react/prop-types
export default function Heading({ title , track}) {
    return (
      <>
        <h1 className="text-3xl my-2 text-[#FF6500] ">
          {title}
        </h1>
        <p className="text-base"><span className="text-slate-700">{track}</span> / {title}</p>
      </>
    );
  }
  