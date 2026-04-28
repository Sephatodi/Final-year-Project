import React from 'react';
import PropTypes from 'prop-types';
import Input from '../common/Input';

const BaitsTagInput = ({ value, onChange, error, required = false, readOnly = false }) => {
  const formatBaitsTag = (input) => {
    // Remove any non-alphanumeric characters except hyphens
    let cleaned = input.replace(/[^a-zA-Z0-9-]/g, '').toUpperCase();
    
    // Format as BW-YYYY-XXXXX
    if (cleaned.length > 2 && !cleaned.startsWith('BW-')) {
      if (cleaned.startsWith('BW')) {
        cleaned = 'BW-' + cleaned.substring(2);
      }
    }
    
    return cleaned;
  };

  const handleChange = (e) => {
    const formatted = formatBaitsTag(e.target.value);
    onChange(formatted);
  };

  const validateBaitsTag = (tag) => {
    if (!tag) return true;
    // Basic BAITS tag validation: BW-YYYY-XXXXX format
    const pattern = /^BW-\d{4}-[A-Z0-9]{5,10}$/;
    return pattern.test(tag);
  };

  return (
    <Input
      label="BAITS Tag Number"
      value={value}
      onChange={handleChange}
      error={error || (!validateBaitsTag(value) && value ? 'Invalid BAITS tag format' : '')}
      icon="badge"
      placeholder="BW-2024-12345"
      helper="Format: BW-YYYY-XXXXX (e.g., BW-2024-12345)"
      required={required}
      readOnly={readOnly}
      fullWidth
    />
  );
};

BaitsTagInput.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.string,
  required: PropTypes.bool,
  readOnly: PropTypes.bool,
};

export default BaitsTagInput;