import { ChangeEvent } from 'react';

const values = [
  { value: 1, label: '1' },
  { value: 2, label: '2' },
  { value: 3, label: '3' },
  { value: 4, label: '4' },
  { value: 5, label: '5' },
  { value: 6, label: '6' },
  { value: 7, label: '7' },
  { value: 8, label: '8' },
  { value: 9, label: '9' },
  { value: 10, label: '10' }
];

type NumberSelectProps = {
  id: string;
  name: string;
  className?: string;
  value: number | '';
  onChange: (selectedValue: number) => void;
  placeholder?: string;
  disabled?: boolean;
};

export const NumberSelect = ({
  id,
  name,
  className,
  value,
  onChange,
  placeholder = '-- Select a Value --',
  disabled = false
}: NumberSelectProps) => {
  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const selectedMonnth = parseInt(event.target.value, 10);
    if (!isNaN(selectedMonnth)) {
      onChange(selectedMonnth);
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

      {values.map((value) => (
        <option key={value.value} value={value.value}>
          {value.label}
        </option>
      ))}
    </select>
  );
};
