import { useEffect, forwardRef, useRef, useImperativeHandle } from 'react';
import flatpickr from 'flatpickr';
import { Portuguese } from 'flatpickr/dist/l10n/pt.js';
import { CalenderIcon } from '../../icons';
import Label from './Label';

type PropsType = {
  id: string;
  mode?: "single" | "multiple" | "range" | "time";
  label?: string;
  placeholder?: string;
  defaultDate?: any;
  required?: boolean;
} & React.InputHTMLAttributes<HTMLInputElement>; 

const DatePicker = forwardRef<HTMLInputElement, PropsType>(({
  id,
  mode = "single",
  label,
  defaultDate,
  placeholder,
  onChange, 
  onBlur,
  name,
  required = false,
  ...rest
}, ref) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(ref, () => inputRef.current!);

  useEffect(() => {
    if (!inputRef.current) return;

    const fp = flatpickr(inputRef.current, {
        locale: Portuguese,
        mode,
        defaultDate,
        dateFormat: "d/m/Y",

        onChange: (selectedDates, dateStr) => {
            if (inputRef.current) {
            inputRef.current.value = dateStr;
            
            const event = {
                target: inputRef.current,
                type: 'change',
            } as React.ChangeEvent<HTMLInputElement>;

            if (onChange) onChange(event);
            }
        },
    });

    return () => fp.destroy();
  }, [mode, defaultDate, onChange]);

  return (
    <div>
      {label && <Label title={label} required={required}/>}
      <div className="relative">
        <input
            type='text'
            {...rest}
            id={id}
            name={name}
            ref={inputRef}
            onBlur={onBlur} 
            placeholder={placeholder}
            className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3  dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30  bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700  dark:focus:border-brand-800" // suas classes
        />

        <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
          <CalenderIcon className="size-6" />
        </span>
      </div>
    </div>
  );
});

export default DatePicker;