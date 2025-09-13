import FileUpload from "../components/FileUpload";

export default function Upload() {
  return (
    <div className="mt-8 flex flex-col items-center">
      <h2 className="mb-4 text-xl">Genre Classification</h2>
      <FileUpload />
    </div>
  );
}
