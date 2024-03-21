import React, { type FunctionComponent, type ReactNode } from 'react';
import { Separator } from "@/components/ui/separator";

interface SettingSectionProps {
  Icon: FunctionComponent<{ className?: string }>;
  title: string;
  children: ReactNode;
}

export function SettingSection({ Icon, title, children }: SettingSectionProps) {
  const IconElement = <Icon className="h-4 w-4" />;

  return (
    <div>
      <div className="flex justify-start items-center space-x-2 space-y-1">
        {IconElement}
        <h4 className="text-medium font-medium leading-none">
          {title}
        </h4>
      </div>
      <Separator className="my-4" />
      {children}
    </div>
  );
};
