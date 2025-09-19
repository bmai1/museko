import Classifier from "../components/Classifier";

export default function Upload() {
  return (
    <div className="mt-[3vh] flex flex-col items-center">
      <h2 className="mb-4 text-lg">Genre Classification</h2>
      <Classifier />
    </div>
  );
}
