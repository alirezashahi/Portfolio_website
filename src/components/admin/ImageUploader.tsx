import { useState, useRef } from "react";
import { useMutation, useConvex } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";

interface ImageUploaderProps {
  onImageUploaded: (imageUrl: string, altText: string, caption?: string) => void;
  disabled?: boolean;
}

export const ImageUploader = ({ onImageUploaded, disabled = false }: ImageUploaderProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const convex = useConvex();
  
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const storeFileMetadata = useMutation(api.files.storeFileMetadata);
  
  const handleImageUpload = async () => {
    if (!fileInputRef.current?.files?.length) return;
    
    const file = fileInputRef.current.files[0];
    setIsUploading(true);
    setUploadProgress(0);
    setError(null);
    
    try {
      // 1. Get a URL to upload the image to
      const uploadUrl = await generateUploadUrl();
      console.log("Got upload URL:", uploadUrl);
      
      // 2. Upload the image to the URL
      const xhr = new XMLHttpRequest();
      xhr.open("POST", uploadUrl);
      xhr.setRequestHeader("Content-Type", file.type);
      
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(percentComplete);
        }
      };
      
      xhr.onload = async () => {
        if (xhr.status === 200 || xhr.status === 201) {
          // Success - Extract storageId from response
          let storageId: Id<"_storage"> | null = null;
          try {
            const responseData = JSON.parse(xhr.responseText);
            if (responseData.storageId) {
              storageId = responseData.storageId as Id<"_storage">;
              console.log("Storage ID from response:", storageId);
            } else {
              throw new Error("storageId not found in response JSON");
            }
          } catch (e) {
            console.error("Error parsing upload response or missing storageId:", e);
            setError(`File uploaded, but failed to get storage ID: ${e instanceof Error ? e.message : String(e)}`);
            setIsUploading(false);
            return; // Stop processing if we can't get the ID
          }

          if (!storageId) {
            setError("File uploaded, but could not determine storage ID.");
            setIsUploading(false);
            return;
          }

          try {
            // Store the file metadata
            await storeFileMetadata({
              storageId: storageId,
              filename: file.name,
              contentType: file.type,
              description: `Uploaded image: ${file.name}`,
            });
            console.log("File metadata stored successfully for:", storageId);

            // Get the permanent retrieval URL
            const retrievalUrl = await convex.query(api.files.getFileUrl, { storageId });

            if (!retrievalUrl) {
              throw new Error("Could not retrieve file URL after upload.");
            }
            console.log("Got retrieval URL:", retrievalUrl);

            // Notify parent component
            onImageUploaded(retrievalUrl, file.name);
            
            // Reset after short delay
            setTimeout(() => {
              setIsUploading(false);
              setUploadProgress(0);
              if (fileInputRef.current) fileInputRef.current.value = "";
            }, 1000);
          } catch (metadataError) {
            console.error("Error storing file metadata:", metadataError);
            setError(`File uploaded but could not store metadata: ${metadataError instanceof Error ? metadataError.message : String(metadataError)}`);
            setIsUploading(false);
          }
        } else {
          throw new Error("Upload failed with status: " + xhr.status);
        }
      };
      
      xhr.onerror = () => {
        throw new Error("Network error during upload");
      };
      
      xhr.send(file);
    } catch (error) {
      console.error("Error uploading image:", error);
      setError(`Failed to upload image: ${error instanceof Error ? error.message : String(error)}`);
      setIsUploading(false);
    }
  };
  
  return (
    <div className="space-y-2">
      {error && (
        <div className="text-red-500 text-sm mb-2">
          {error}
        </div>
      )}
      
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors"
          disabled={isUploading || disabled}
        >
          {isUploading ? `Uploading ${uploadProgress}%` : 'Upload Image'}
        </button>
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
          disabled={isUploading || disabled}
        />
        
        {isUploading && (
          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
            <div 
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploader; 