'use client';
import { useCallback } from 'react';
import { UserIcon, GitCommitHorizontal } from 'lucide-react';
import { ProfileCombo } from '@/components/profile/profile-combo';
import { SettingSection } from '@/components/setting/setting-section';
import { SettingOption } from '@/components/setting/setting-option';

export default function SettingsPage() {
  const updateSettingField = useCallback(
    (category: string, field: keyof Setting[string], value: string | boolean) => {},
    [],
  );

  return (
    <div className="flex flex-col w-full">
      <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-gray-100/40 px-6 dark:bg-gray-800/40">
        <ProfileCombo />
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-16 md:p-6">
        <SettingSection Icon={UserIcon} title="Profile">
          <SettingOption
            type="Switch"
            name="Auto-renew"
            checked={true}
            onCheckedChange={(checked: boolean) => updateSettingField('profile', 'auto-renew', checked)}
          />
          <SettingOption
            type="EditableField"
            name="Duration"
            value={'3600'}
            onSave={(newValue: string) => updateSettingField('profile', 'duration', newValue)}
            disabled
          />
          <SettingOption
            type="EditableField"
            name="Token Suffix"
            value={'_token'}
            onSave={(newValue: string) => updateSettingField('profile', 'tokenSuffix', newValue)}
            disabled
          />
        </SettingSection>

        {
          //<SettingSection Icon={DatabaseIcon} title="Database">
          //  Database 섹션 옵션
          //</SettingSection>
        }

        <SettingSection Icon={GitCommitHorizontal} title="Tunneling">
          <SettingOption
            type="Switch"
            name="Auto-reconnect"
            checked={true}
            onCheckedChange={(checked: boolean) => updateSettingField('tunneling', 'auto-reconnect', checked)}
          />
          <SettingOption
            type="EditableField"
            name="Duration"
            value={'3600'}
            onSave={(newValue: string) => updateSettingField('tunneling', 'duration', newValue)}
            disabled
          />
          <SettingOption
            type="EditableField"
            name="Bastion Host"
            value={'bastion-host'}
            onSave={(newValue: string) => updateSettingField('tunneling', 'bastion-host', newValue)}
            disabled
          />
        </SettingSection>
      </main>
    </div>
  );
}
