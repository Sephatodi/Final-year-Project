import PropTypes from 'prop-types';
import { useRef, useState } from 'react';

const FileUpload = ({ 
  onFileSelect,
  multiple = false,
  accept = '*/*',
  maxSize = 5, // MB
  maxFiles = 5,
  disabled = false,
  className = '' 
}) => {
  const [files, setFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const validateFile = (file) => {
    if (file.size > maxSize * 1024 * 1024) {
      return `File ${file.name} exceeds ${maxSize}MB limit`;
    }
    return null;
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    setError('');

    if (disabled) return;

    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  };

  const handleFiles = (fileList) => {
    const newFiles = [];
    const errors = [];

    if (!multiple && fileList.length > 1) {
      setError('Only one file can be uploaded');
      return;
    }

    if (multiple && files.length + fileList.length > maxFiles) {
      setError(`Maximum ${maxFiles} files allowed`);
      return;
    }

    fileList.forEach(file => {
      const error = validateFile(file);
      if (error) {
        errors.push(error);
      } else {
        newFiles.push({
          id: Date.now() + Math.random(),
          file,
          name: file.name,
          size: file.size,
          type: file.type,
          preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
        });
      }
    });

    if (errors.length > 0) {
      setError(errors.join('\n'));
    }

    const updatedFiles = multiple ? [...files, ...newFiles] : newFiles;
    setFiles(updatedFiles);
    
    if (onFileSelect) {
      onFileSelect(updatedFiles.map(f => f.file));
    }
  };

  const handleFileInput = (e) => {
    setError('');
    handleFiles(Array.from(e.target.files));
  };

  const removeFile = (id) => {
    const updatedFiles = files.filter(f => f.id !== id);
    setFiles(updatedFiles);
    if (onFileSelect) {
      onFileSelect(updatedFiles.map(f => f.file));
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className={className}>
      {/* Drop Zone */}
      <div
        className={`
          relative p-8 border-2 border-dashed rounded-xl transition-colors
          ${dragActive ? 'border-primary bg-primary/5' : 'border-sage-300 dark:border-sage-700'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-primary/50'}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !disabled && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          accept={accept}
          onChange={handleFileInput}
          className="hidden"
          disabled={disabled}
        />

        <div className="text-center">
          <span className="material-icons-outlined text-5xl text-sage-400 mb-3">
            {dragActive ? 'cloud_upload' : 'cloud_upload'}
          </span>
          <p className="text-sm font-medium mb-1">
            {dragActive 
              ? 'Drop files here' 
              : 'Drag & drop files or click to browse'
            }
          </p>
          <p className="text-xs text-sage-500">
            Max {maxSize}MB per file • {multiple ? `Up to ${maxFiles} files` : 'Single file'}
          </p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
          <p className="text-sm text-red-600 dark:text-red-400 whitespace-pre-line">
            {error}
          </p>
        </div>
      )}

      {/* File List */}
      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          {files.map(file => (
            <div
              key={file.id}
              className="flex items-center gap-3 p-3 bg-sage-50 dark:bg-sage-900/20 rounded-lg"
            >
              {/* Preview */}
              {file.preview ? (
                <img
                  src={file.preview}
                  alt={file.name}
                  className="w-10 h-10 rounded object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded bg-sage-200 dark:bg-sage-800 flex items-center justify-center">
                  <span className="material-icons-outlined text-sage-500">insert_drive_file</span>
                </div>
              )}

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{file.name}</p>
                <p className="text-xs text-sage-500">{formatFileSize(file.size)}</p>
              </div>

              {/* Remove */}
              <button
                onClick={() => removeFile(file.id)}
                className="p-1 hover:bg-sage-200 dark:hover:bg-sage-800 rounded"
              >
                <span className="material-icons-outlined text-sm">close</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

FileUpload.propTypes = {
  onFileSelect: PropTypes.func,
  multiple: PropTypes.bool,
  accept: PropTypes.string,
  maxSize: PropTypes.number,
  maxFiles: PropTypes.number,
  disabled: PropTypes.bool,
  className: PropTypes.string,
};

export default FileUpload;