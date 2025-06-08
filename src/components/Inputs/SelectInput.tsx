import { ChangeEvent } from 'react';

type SelectInputProps = {
  id: string;
  name: string;
  className?: string;
  value: number | '';
  onChange: (selectedValue: number) => void;
  placeholder?: string;
  disabled?: boolean;
  options: { value: number; label: string }[];
};

export const SelectInput = ({
  id,
  name,
  className,
  value,
  onChange,
  placeholder,
  disabled = false,
  options
}: SelectInputProps) => {
  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = parseInt(event.target.value, 10);
    if (!isNaN(selectedValue)) {
      onChange(selectedValue);
    }
  };
  return (
    <select
      id={id}
      name={name}
      className={className}
      value={value}
      onChange={handleChange}
      disabled={disabled}
    >
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}

      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};
