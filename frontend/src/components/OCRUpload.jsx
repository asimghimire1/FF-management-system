import { useState } from "react";
import { Upload, CheckCircle, AlertCircle } from "lucide-react";

// Props: { matchId, roundNumber, onSuccess, loading }
export default function OCRUpload({ matchId, roundNumber = 1, onSuccess, loading = false }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      setError("File must be less than 10MB");
      return;
    }

    setFile(selectedFile);
    setError("");

    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result);
    reader.readAsDataURL(selectedFile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setError("Please select an image");
      return;
    }

    try {
      await onSuccess(file, matchId, roundNumber);
      setSuccess(true);
      setFile(null);
      setPreview(null);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message || "Upload failed");
    }
  };

  return (
    <div className="card max-w-md">
      <h3 className="text-lg font-semibold mb-4">Upload Leaderboard Screenshot</h3>

      {error && (
        <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded mb-4 flex items-center gap-2">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-900 border border-green-700 text-green-200 px-4 py-3 rounded mb-4 flex items-center gap-2">
          <CheckCircle size={18} />
          Leaderboard processed successfully!
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="label">Image File (Format: Team | Kills | Placement)</label>
          <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 transition">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              id="file-upload"
              disabled={loading}
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              {preview ? (
                <div>
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-32 object-cover rounded mb-2"
                  />
                  <p className="text-sm text-gray-300">Click to change</p>
                </div>
              ) : (
                <div>
                  <Upload className="mx-auto text-gray-400 mb-2" size={32} />
                  <p className="text-gray-300">Click or drag image here</p>
                  <p className="text-xs text-gray-500 mt-1">PNG, JPG or GIF</p>
                </div>
              )}
            </label>
          </div>
        </div>

        {file && (
          <p className="text-sm text-gray-400 mb-4">
            Selected: {file.name}
          </p>
        )}

        <button
          type="submit"
          className="btn-primary w-full"
          disabled={!file || loading}
        >
          {loading ? "Processing OCR..." : "Upload & Process"}
        </button>
      </form>
    </div>
  );
}
