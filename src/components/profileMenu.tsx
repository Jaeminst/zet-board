'use client';
import { useEnvironment } from "@/contexts/EnvironmentContext";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { useProfile } from "@/contexts/ProfileContext";

export function ProfileMenu() {
  const [profileList] = useProfile();
  const [selectedEnvironment, setSelectedEnvironment] = useEnvironment();
  const handleSelectEnvironment = (environment: string): void => {
    setSelectedEnvironment(environment);
  };

  return (
    <div className="flex items-center gap-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className='px-6' aria-expanded="true" variant="ghost">
            {selectedEnvironment}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {profileList.map((profile) => (
            <DropdownMenuItem key={profile.idx} onClick={() => handleSelectEnvironment(profile.environment)}>
              {profile.environment}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}