import React, { useMemo } from 'react'
import { Filter, FilterItem } from '@vtex/shoreline'

export interface MultiSelectOption {
  value: string
  label: string
  disabled?: boolean
}

export interface MultiSelectProps {
  /** Array of options to display */
  options: MultiSelectOption[]
  /** Selected values (controlled) */
  value?: string[]
  /** Default selected values (uncontrolled) */
  defaultValue?: string[]
  /** Callback when selection changes */
  onChange?: (selectedValues: string[]) => void
  /** Label for the multi-select */
  label?: string
  /** Placeholder text when no items are selected */
  placeholder?: string
  /** Whether the component is disabled */
  disabled?: boolean
  /** Additional CSS class name */
  className?: string
  /** Test ID for testing purposes */
  testId?: string
}

/**
 * MultiSelect component using Shoreline Filter for multi-selection functionality.
 * Provides a dropdown interface for selecting multiple options from a list.
 * 
 * @example
 * ```tsx
 * const options = [
 *   { value: 'option1', label: 'Option 1' },
 *   { value: 'option2', label: 'Option 2' },
 *   { value: 'option3', label: 'Option 3' }
 * ]
 * 
 * <MultiSelect
 *   options={options}
 *   label="Select multiple options"
 *   onChange={(values) => console.log(values)}
 * />
 * ```
 */
export const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  value,
  defaultValue = [],
  onChange,
  label = 'Select options',
  placeholder,
  disabled = false,
  className,
  testId,
}) => {
  // Handle controlled vs uncontrolled state
  const isControlled = value !== undefined
  const selectedValues = isControlled ? value : defaultValue

  // Create a setter function that works for both controlled and uncontrolled modes
  const handleValueChange = useMemo(() => {
    if (isControlled && onChange) {
      return onChange
    }
    // For uncontrolled mode, we let the Filter component handle its own state
    return onChange || (() => {})
  }, [isControlled, onChange])

  // Filter out disabled options for selection
  const enabledOptions = useMemo(
    () => options.filter(option => !option.disabled),
    [options]
  )

  const filterProps = {
    label,
    className,
    'data-testid': testId,
    ...(isControlled ? { value: selectedValues, setValue: handleValueChange } : { defaultValue }),
  }

  return (
    <Filter {...filterProps}>
      {options.map((option) => (
        <FilterItem
          key={option.value}
          value={option.value}
          disabled={option.disabled || disabled}
        >
          {option.label}
        </FilterItem>
      ))}
    </Filter>
  )
}

export default MultiSelect