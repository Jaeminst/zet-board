import React from 'react';
import { Switch } from "@/components/ui/switch";
import { EditableField } from "@/components/ui/editable-field";

interface SettingOptionProps {
  type: 'Switch' | 'EditableField';
  name: string;
  checked?: boolean;
  value?: string;
  onCheckedChange?: (checked: boolean) => void;
  onSave?: (value: string) => void;
  disabled?: boolean;
}

export function SettingOption({ type, name, checked, onCheckedChange, value, onSave, ...props }: SettingOptionProps) {
  return (
    <div className="grid grid-cols-2 h-12 items-center text-sm">
      <div className="col-start-1">
        {name}
      </div>
      <div className="col-end-4">
        {type === 'Switch' ? (
          <Switch
            checked={checked}
            onCheckedChange={onCheckedChange}
            {...props}
          />
        ) : (
          <EditableField
            className="w-40 flex-row-reverse text-right border p-[5px] rounded"
            label={name}
            value={value ?? ''}
            onSave={onSave ? onSave : () => { }}
            {...props}
          />
        )}
      </div>
    </div>
  );
};
