import React, { useState, useEffect } from 'react';
import { supabase } from '@lib/supabase';
import { PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface ImageLibraryProps {
  onImageSelect: (urls: string[]) => void;
  selectedImages: string[];
  multiple?: boolean;
}

const ImageLibrary: React.FC<ImageLibraryProps> = ({
  onImageSelect,
  selectedImages = [],
  multiple = false
}) => {
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError) throw authError;
      
      if (!user) {
        throw new Error('You must be logged in to view images');
      }

      console.log('Fetching images for user:', user.id);

      const { data: imageRecords, error: fetchError } = await supabase
        .from('retreat_images')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) {
        console.error('Database error:', fetchError);
        throw fetchError;
      }

      console.log('Fetched images:', imageRecords);
      setUploadedImages(imageRecords?.map(record => record.url) || []);
    } catch (err) {
      console.error('Error fetching images:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch images');
    } finally {
      setLoading(false);
    }
  };

  const uploadImage = async (file: File) => {
    try {
      setUploading(true);
      setError(null);

      // Check authentication
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError) throw authError;
      
      if (!user) {
        throw new Error('You must be logged in to upload images');
      }

      console.log('Uploading image for user:', user.id);
      
      // Generate a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;

      console.log('Uploading file:', fileName);

      // Upload file to storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('retreat-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type
        });

      if (uploadError) {
        console.error('Storage upload error:', uploadError);
        throw uploadError;
      }

      if (!uploadData?.path) {
        throw new Error('No upload data returned');
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('retreat-images')
        .getPublicUrl(uploadData.path);

      if (!urlData?.publicUrl) {
        throw new Error('Failed to get public URL for uploaded image');
      }

      const publicUrl = urlData.publicUrl;
      console.log('Got public URL:', publicUrl);

      // Save reference in the database
      const { error: dbError } = await supabase
        .from('retreat_images')
        .insert([{ url: publicUrl }]);

      if (dbError) {
        console.error('Database insert error:', dbError);
        throw dbError;
      }

      console.log('Successfully saved image reference to database');

      // Update local state
      setUploadedImages(prev => [publicUrl, ...prev]);
      
      // Update selection
      if (!multiple) {
        onImageSelect([publicUrl]);
      } else {
        onImageSelect([...selectedImages, publicUrl]);
      }

    } catch (err) {
      console.error('Error uploading image:', err);
      setError(err instanceof Error ? err.message : 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('File size must be less than 5MB');
        return;
      }
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        setError('Only JPEG, PNG, and WebP images are allowed');
        return;
      }
      uploadImage(file);
    }
  };

  const handleImageSelect = (imageUrl: string) => {
    if (multiple) {
      if (selectedImages.includes(imageUrl)) {
        onImageSelect(selectedImages.filter(url => url !== imageUrl));
      } else {
        onImageSelect([...selectedImages, imageUrl]);
      }
    } else {
      onImageSelect([imageUrl]);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
          {error}
        </div>
      )}

      {/* Upload Section */}
      <div className="flex items-center justify-center w-full">
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <PhotoIcon className="w-8 h-8 mb-3 text-gray-400" />
            <p className="mb-2 text-sm text-gray-500">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500">PNG, JPG or WebP (MAX. 5MB)</p>
          </div>
          <input
            type="file"
            className="hidden"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
            disabled={uploading}
          />
        </label>
      </div>

      {/* Image Grid */}
      {loading ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {uploadedImages.map((imageUrl, index) => (
            <div
              key={index}
              className={`relative group cursor-pointer rounded-lg overflow-hidden ${
                selectedImages.includes(imageUrl)
                  ? 'ring-2 ring-blue-500'
                  : 'hover:ring-2 hover:ring-gray-300'
              }`}
              onClick={() => handleImageSelect(imageUrl)}
            >
              <img
                src={imageUrl}
                alt={`Uploaded ${index + 1}`}
                className="w-full h-32 object-cover"
              />
              {selectedImages.includes(imageUrl) && (
                <div className="absolute inset-0 bg-blue-500 bg-opacity-20 flex items-center justify-center">
                  <div className="bg-white rounded-full p-1">
                    <XMarkIcon className="w-4 h-4 text-blue-500" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageLibrary; 