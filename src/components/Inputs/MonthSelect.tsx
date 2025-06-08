import { ChangeEvent } from 'react';

const months = [
  { value: 1, label: 'January' },
  { value: 2, label: 'February' },
  { value: 3, label: 'March' },
  { value: 4, label: 'April' },
  { value: 5, label: 'May' },
  { value: 6, label: 'June' },
  { value: 7, label: 'July' },
  { value: 8, label: 'August' },
  { value: 9, label: 'September' },
  { value: 10, label: 'October' },
  { value: 11, label: 'November' },
  { value: 12, label: 'December' }
];

type MonthSelectProps = {
  id: string;
  name: string;
  className?: string;
  value: number | '';
  onChange: (selectedMonth: number) => void;
  placeholder?: string;
  disabled?: boolean;
};

export const MonthSelect = ({
  id,
  name,
  className,
  value,
  onChange,
  placeholder = '-- Select a Month --',
  disabled = false
}: MonthSelectProps) => {
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

      {months.map((month) => (
        <option key={month.value} value={month.value}>
          {month.label}
        </option>
      ))}
    </select>
  );
};
