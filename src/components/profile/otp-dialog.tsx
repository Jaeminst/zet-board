import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogContent } from '@/components/ui/dialog';
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '@/components/ui/input-otp';

export function OtpDialog({
  onOpen,
  onClose,
  onConfirm,
}: {
  onOpen: boolean;
  onClose: () => void;
  onConfirm: (tokenCode: string) => void;
}) {
  return (
    <Dialog open={onOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Enter OTP</DialogTitle>
          <DialogDescription>Please enter the 6-digit OTP from your authenticator app.</DialogDescription>
        </DialogHeader>
        <form className="grid gap-4 py-4">
          <div className="flex justify-center">
            <InputOTP
              maxLength={6}
              onComplete={otpValue => {
                onConfirm(otpValue); // onConfirm 함수에 OTP 값 전달
                onClose(); // 다이얼로그 닫기
              }}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
