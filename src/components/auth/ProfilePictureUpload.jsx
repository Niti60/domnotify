'use client';

import { useState, useRef } from 'react';
import { Pencil, Loader2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/cn';

const DEFAULT_AVATAR = "https://res.cloudinary.com/dkczwvm0e/image/upload/v1779547451/fallback-logo_dcsvvs.png";

export function ProfilePictureUpload({ value, onChange, error, className = "" }) {
    const [uploading, setUploading] = useState(false);
    const [localError, setLocalError] = useState('');
    const fileInputRef = useRef(null);

    const handleFileChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validation
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            setLocalError('Invalid file type. Please upload JPG, PNG, or WEBP.');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setLocalError('File size must be less than 5MB.');
            return;
        }

        setLocalError('');
        setUploading(true);

        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (data.success) {
                onChange(data.imageUrl);
            } else {
                setLocalError(data.message || 'Upload failed');
            }
        } catch (err) {
            setLocalError('Network error during upload');
        } finally {
            setUploading(false);
        }
    };

    const triggerFileInput = () => {
        if (uploading) return;
        fileInputRef.current?.click();
    };

    const displayImage = value || DEFAULT_AVATAR;

    return (
        <div className={cn("flex flex-col items-center gap-3 mb-6", className)}>
            <div
                onClick={triggerFileInput}
                className={cn(
                    "relative group rounded-full overflow-hidden border-2 border-border cursor-pointer transition-all duration-300",
                    className.includes("large") ? "w-28 h-28" : "w-[100px] h-[100px]",
                    uploading ? "opacity-70 cursor-not-allowed" : "hover:scale-[1.02] active:scale-[0.98]"
                )}
            >
                <img
                    src={displayImage}
                    alt="Profile Preview"
                    className="w-full h-full object-cover"
                />

                {/* Overlay */}
                <div className={cn(
                    "absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200",
                    uploading && "opacity-100 bg-black/20"
                )}>
                    {uploading ? (
                        <Loader2 className="text-white animate-spin" size={24} />
                    ) : (
                        <Pencil className="text-white" size={20} />
                    )}
                </div>
            </div>

            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
            />

            {(localError || error) && (
                <p className="text-[11px] text-red-500 flex items-center gap-1 font-medium italic text-center max-w-[200px]">
                    <AlertCircle size={10} className="shrink-0" />
                    {localError || error}
                </p>
            )}
        </div>
    );
}
