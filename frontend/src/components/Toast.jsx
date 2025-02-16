// eslint-disable-next-line react/prop-types
export default function Toast({ message, type, onClose }) {
  console.log("Toast rendered with:", { message, type }); // Debug log

  const bgColor = type === "success" ? "bg-green-500" : "bg-red-500";

  return (
    <div
      className={`fixed top-24 right-4 ${bgColor} text-white px-6 py-3 rounded shadow-lg z-[9999] flex items-center`}
      style={{ pointerEvents: "auto" }} // Ensure clickable
    >
      <span className="text-sm font-medium">{message}</span>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        className="ml-4 text-white hover:text-gray-200 font-bold text-xl"
      >
        ×
      </button>
    </div>
  );
}
