export default function Loader({ text = "Forging your future..." }) {
  return (
    <div className="loader-wrap">
      <div className="loader-ring"><div></div><div></div><div></div></div>
      <p className="loader-text">{text}</p>
    </div>
  );
}