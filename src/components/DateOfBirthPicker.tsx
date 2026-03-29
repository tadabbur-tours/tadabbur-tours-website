'use client';

import { forwardRef, useCallback, useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface DateOfBirthPickerProps {
  id: string;
  value: string;
  onChange: (isoDateYyyyMmDd: string) => void;
}

const PLACEHOLDER = 'MM/DD/YYYY';

function parseYmdToLocalDate(ymd: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(ymd.trim());
  if (!m) return null;
  const y = Number(m[1]);
  const mo = Number(m[2]) - 1;
  const d = Number(m[3]);
  const dt = new Date(y, mo, d);
  if (dt.getFullYear() !== y || dt.getMonth() !== mo || dt.getDate() !== d) return null;
  return dt;
}

function formatLocalDateToYmd(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function formatLocalDateToMmDdYyyy(d: Date): string {
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const y = d.getFullYear();
  return `${m}/${day}/${y}`;
}

function formatDigitsToMmDdYyyy(digits: string): string {
  const d = digits.replace(/\D/g, '').slice(0, 8);
  if (d.length === 0) return '';
  if (d.length <= 2) return d;
  if (d.length <= 4) return `${d.slice(0, 2)}/${d.slice(2)}`;
  return `${d.slice(0, 2)}/${d.slice(2, 4)}/${d.slice(4)}`;
}

function parseMmDdYyyyComplete(str: string): Date | null {
  const m = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(str.trim());
  if (!m) return null;
  const month = Number(m[1]);
  const day = Number(m[2]);
  const year = Number(m[3]);
  if (month < 1 || month > 12 || day < 1 || day > 31 || year < 1900) return null;
  const dt = new Date(year, month - 1, day);
  if (dt.getFullYear() !== year || dt.getMonth() !== month - 1 || dt.getDate() !== day) return null;
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  if (dt > today) return null;
  if (dt < new Date(1900, 0, 1)) return null;
  return dt;
}

/**
 * Ignores react-datepicker's `value` prop — we control display via `maskValue` for digit masking.
 */
const DobMaskedInput = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & {
    maskValue: string;
    onMaskChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  }
>(function DobMaskedInput({ maskValue, onMaskChange, value: _v, onChange: _oc, ...props }, ref) {
  return (
    <input
      {...props}
      ref={ref}
      type="text"
      inputMode="numeric"
      autoComplete="bday"
      placeholder={PLACEHOLDER}
      value={maskValue}
      onChange={onMaskChange}
    />
  );
});

/**
 * Calendar + masked typing (MM/DD/YYYY); stored value is YYYY-MM-DD using local calendar dates (no UTC shift).
 */
export default function DateOfBirthPicker({ id, value, onChange }: DateOfBirthPickerProps) {
  const selected = value ? parseYmdToLocalDate(value) : null;

  const [inputDisplay, setInputDisplay] = useState(() =>
    selected ? formatLocalDateToMmDdYyyy(selected) : ''
  );

  useEffect(() => {
    if (!value) {
      setInputDisplay('');
      return;
    }
    const d = parseYmdToLocalDate(value);
    if (d) setInputDisplay(formatLocalDateToMmDdYyyy(d));
  }, [value]);

  const handleCalendarChange = useCallback(
    (date: Date | null) => {
      if (!date) {
        onChange('');
        setInputDisplay('');
        return;
      }
      onChange(formatLocalDateToYmd(date));
      setInputDisplay(formatLocalDateToMmDdYyyy(date));
    },
    [onChange]
  );

  const handleMaskedInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const digits = e.target.value.replace(/\D/g, '').slice(0, 8);
      const formatted = formatDigitsToMmDdYyyy(digits);
      setInputDisplay(formatted);

      if (formatted.length === 0) {
        onChange('');
        return;
      }

      const parsed = parseMmDdYyyyComplete(formatted);
      if (parsed) {
        onChange(formatLocalDateToYmd(parsed));
      }
    },
    [onChange]
  );

  return (
    <DatePicker
      selected={selected}
      onChange={handleCalendarChange}
      maxDate={new Date()}
      minDate={new Date(1900, 0, 1)}
      showMonthDropdown
      showYearDropdown
      dropdownMode="select"
      yearDropdownItemNumber={100}
      scrollableYearDropdown
      dateFormat="MM/dd/yyyy"
      placeholderText={PLACEHOLDER}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm text-gray-900 placeholder-gray-500"
      wrapperClassName="w-full block"
      popperClassName="datepicker-in-modal"
      popperPlacement="bottom-start"
      popperProps={{ strategy: 'fixed' }}
      portalId="react-datepicker-modal-portal"
      showPopperArrow={false}
      autoComplete="off"
      customInput={
        <DobMaskedInput id={id} maskValue={inputDisplay} onMaskChange={handleMaskedInputChange} />
      }
    />
  );
}
